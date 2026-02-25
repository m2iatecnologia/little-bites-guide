import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { batch = 1, count = 50 } = await req.json().catch(() => ({}));

    // Check how many recipes exist
    const { count: existing } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true });

    const prompt = `Gere exatamente ${count} receitas ÚNICAS para introdução alimentar de bebês (BLW e papinhas).
Lote ${batch}. Já existem ${existing || 0} receitas no banco.

REGRAS:
- Distribua entre faixas etárias: +6m, +7m, +8m, +9m, +10m, +12m, 1 ano+
- Categorias: café da manhã, almoço, jantar, lanche, sobremesa, lanchinho para passeio
- Dificuldade: Fácil, Médio, Avançado
- NÃO repita nomes. Cada receita deve ser ÚNICA.
- Ingredientes devem ter QUANTIDADES reais.
- Modo de preparo deve ser DETALHADO (mínimo 3 frases).
- Dica nutricional deve ser específica para bebês.
- As primeiras 10 receitas devem ter premium=false, o restante premium=true.

Retorne um JSON array com objetos assim:
{
  "name": "Nome da Receita",
  "age": "+6m",
  "difficulty": "Fácil",
  "time_minutes": 15,
  "category": "almoço",
  "ingredients": ["1 banana madura", "2 col. sopa de aveia"],
  "instructions": "Passo a passo detalhado...",
  "nutritional_tip": "Rica em ferro...",
  "can_freeze": true,
  "can_lunchbox": false,
  "premium": true,
  "tags_ingredientes": ["banana", "aveia"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Você é um nutricionista infantil especializado em introdução alimentar. Retorne APENAS o JSON array, sem markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      return new Response(JSON.stringify({ error: `AI error: ${response.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    
    // Clean markdown code blocks if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let recipes;
    try {
      recipes = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(recipes)) {
      return new Response(JSON.stringify({ error: "AI did not return an array" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert recipes
    const { data, error } = await supabase.from("recipes").insert(
      recipes.map((r: any) => ({
        name: r.name,
        age: r.age || "+6m",
        difficulty: r.difficulty || "Fácil",
        time_minutes: r.time_minutes || 15,
        category: r.category || "almoço",
        ingredients: r.ingredients || [],
        instructions: r.instructions || "",
        nutritional_tip: r.nutritional_tip || null,
        can_freeze: r.can_freeze || false,
        can_lunchbox: r.can_lunchbox || false,
        tags_ingredientes: r.tags_ingredientes || [],
        premium: r.premium !== undefined ? r.premium : true,
      }))
    ).select("id, name");

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      inserted: data?.length || 0,
      total_existing: (existing || 0) + (data?.length || 0),
      recipes: data?.map(r => r.name),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
