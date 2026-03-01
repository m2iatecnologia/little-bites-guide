import { useParams, useNavigate } from "react-router-dom";
import { useRecipeById } from "@/hooks/useRecipes";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumBlockScreen } from "@/components/PremiumGate";
import { ArrowLeft, Clock, Snowflake, Backpack, ChefHat, Lightbulb, Scissors } from "lucide-react";

// Illustration placeholders for prep steps
const prepIllustrations = [
  { icon: "🔪", label: "Corte em pedaços adequados" },
  { icon: "🍳", label: "Cozinhe até ficar macio" },
  { icon: "🥣", label: "Consistência ideal" },
  { icon: "✋", label: "Tamanho seguro para o bebê" },
];

function parseSteps(instructions: string): string[] {
  // Try numbered steps first
  const numbered = instructions.split(/\d+\.\s+/).filter(Boolean);
  if (numbered.length > 1) return numbered.map((s) => s.trim());
  // Split by period sentences
  const sentences = instructions.split(/\.\s+/).filter((s) => s.trim().length > 10);
  if (sentences.length > 1) return sentences.map((s) => s.trim().replace(/\.$/, "") + ".");
  return [instructions];
}

export default function ReceitaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipe, loading } = useRecipeById(id);
  const { isPremium } = useSubscription();

  if (loading) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "hsl(var(--app-gold))", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <p className="text-lg" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
          Receita não encontrada
        </p>
        <button
          onClick={() => navigate("/receitas")}
          className="px-6 py-3 rounded-xl text-sm"
          style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
        >
          Voltar às receitas
        </button>
      </div>
    );
  }

  if (recipe.premium && !isPremium) {
    return <PremiumBlockScreen />;
  }

  const steps = parseSteps(recipe.instructions);

  return (
    <div className="app-container bottom-nav-safe pb-28">
      {/* Header */}
      <div className="relative">
        {recipe.image_url && !recipe.image_url.startsWith("data:") ? (
          <img src={recipe.image_url} alt={recipe.name} className="w-full h-56 object-cover" loading="lazy" />
        ) : (
          <div
            className="w-full h-56 flex items-center justify-center text-6xl"
            style={{ background: "hsl(var(--muted))" }}
          >
            🍽️
          </div>
        )}
        <button
          onClick={() => navigate("/receitas")}
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <ArrowLeft size={18} color="white" />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="age-tag">{recipe.age}</span>
          <span className="age-tag">{recipe.difficulty}</span>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Title & meta */}
        <h1 className="text-xl" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
          {recipe.name}
        </h1>

        <div className="flex flex-wrap gap-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {recipe.time_minutes} min
          </span>
          {recipe.can_freeze && (
            <span className="flex items-center gap-1">
              <Snowflake size={14} /> Pode congelar
            </span>
          )}
          {recipe.can_lunchbox && (
            <span className="flex items-center gap-1">
              <Backpack size={14} /> Lancheira
            </span>
          )}
        </div>

        {/* Nutritional tip */}
        {recipe.nutritional_tip && (
          <div
            className="flex gap-3 p-4 rounded-2xl"
            style={{ background: "hsl(var(--app-gold-light))" }}
          >
            <Lightbulb size={18} className="flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--app-petrol))" }} />
            <p className="text-xs" style={{ color: "hsl(var(--app-petrol))" }}>
              {recipe.nutritional_tip}
            </p>
          </div>
        )}

        {/* Ingredients */}
        <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontWeight: 700 }}>
            <ChefHat size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
            Ingredientes
          </h3>
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5">
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: "hsl(var(--app-gold-dark))" }}
              />
              <span className="text-sm">{ing}</span>
            </div>
          ))}
        </div>

        {/* Step by step */}
        <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-bold mb-3" style={{ fontWeight: 700 }}>
            Modo de Preparo
          </h3>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                  style={{
                    background: "hsl(var(--app-gold))",
                    color: "hsl(var(--app-petrol))",
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-sm pt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prep illustrations */}
        <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontWeight: 700 }}>
            <Scissors size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
            Como cortar e preparar
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {prepIllustrations.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                style={{ background: "hsl(var(--muted))" }}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-[11px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
