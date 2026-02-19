import dicaImg from "@/assets/dica-do-dia.jpg";
import muffinImg from "@/assets/receita-muffin.jpg";
import picoleImg from "@/assets/receita-picole.jpg";
import { FoodImage } from "@/components/FoodImage";
import { foods, ageTips } from "@/data/appData";
import { ChevronRight, Crown, Star } from "lucide-react";
import { useState } from "react";

const ageGuides = [
  { age: "0–5m", emoji: "🍼" },
  { age: "6m", emoji: "🍌" },
  { age: "7m", emoji: "🍓" },
  { age: "8m", emoji: "🍊" },
  { age: "9m", emoji: "🥝" },
  { age: "10m", emoji: "🍉" },
  { age: "11m", emoji: "🍐" },
  { age: "1 ano", emoji: "🍎" },
  { age: "+2 anos", emoji: "🍇" },
];

const recipes = [
  { name: "Muffin de espinafre e batata doce", age: "+9m", img: muffinImg },
  { name: "Picolé / Sorvete de frutas", age: "+6m", difficulty: "Fácil", img: picoleImg },
];

const mealPlan = [
  { meal: "Café da manhã", emoji: "☀️", items: ["🧀 Pão de queijo fácil", "🍑 Ameixa"] },
  { meal: "Almoço", emoji: "🌤️", items: ["🍗 Frango desfiado", "🥕 Purê de cenoura", "🍚 Arroz"] },
  { meal: "Jantar", emoji: "🌙", items: ["🥑 Macarrão com abacate", "🥦 Brócolis"] },
];

export default function Index() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  return (
    <div className="app-container bottom-nav-safe">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-600" style={{ color: "hsl(var(--muted-foreground))" }}>Olá, Mamãe 👋</p>
          <h1 className="text-2xl font-900" style={{ color: "hsl(var(--foreground))", fontWeight: 900 }}>
            Nutri<span style={{ color: "hsl(var(--primary))" }}>Baby</span>
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ background: "hsl(var(--primary))", color: "white" }}>
          👶
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Dica do Dia */}
        <div className="card-food overflow-hidden">
          <div className="relative h-44">
            <img src={dicaImg} alt="Dica do dia" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-3"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
              <span className="tag-green mb-1 inline-block">Dica do dia</span>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between">
            <p className="font-700 text-sm flex-1" style={{ fontWeight: 700 }}>
              Como lidar com a recusa e seletividade depois de 1 ano
            </p>
            <ChevronRight size={18} style={{ color: "hsl(var(--primary))" }} />
          </div>
        </div>

        {/* Alimentos - Como oferecer */}
        <div className="card-food p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥗</span>
              <h2 className="font-800 text-base" style={{ fontWeight: 800 }}>Alimentos • Como oferecer</h2>
            </div>
            <ChevronRight size={18} style={{ color: "hsl(var(--primary))" }} />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {foods.slice(0, 4).map((food) => (
              <div key={food.id} className="flex-shrink-0 flex flex-col items-center gap-1">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                  <FoodImage name={food.image} className="w-full h-full object-cover" alt={food.name} />
                  <span className="age-tag absolute bottom-1 left-1">{food.age}</span>
                </div>
                <span className="text-xs font-600 text-center" style={{ fontWeight: 600 }}>{food.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Receitas */}
        <div className="card-food p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧁</span>
              <h2 className="font-800 text-base" style={{ fontWeight: 800 }}>+650 Receitas</h2>
            </div>
            <Crown size={18} className="premium-crown" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recipes.map((r, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/2.5]">
                <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }} />
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <span className="age-tag">{r.age}</span>
                  {r.difficulty && <span className="age-tag">{r.difficulty}</span>}
                </div>
              </div>
            ))}
            <p className="col-span-2 text-xs text-center font-600" style={{ color: "hsl(var(--muted-foreground))" }}>
              {recipes[0].name}
            </p>
          </div>
        </div>

        {/* Guia por Idade */}
        <div className="card-food p-4">
          <h2 className="section-title">Guia da Introdução Alimentar</h2>
          <p className="text-sm mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>Escolha a idade do bebê:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="col-span-2 cardapio-btn flex items-center justify-center gap-2"
              onClick={() => setSelectedAge("0–5 meses")}
              style={selectedAge === "0–5 meses" ? { background: "hsl(var(--app-teal-light))" } : {}}
            >
              <span>🍼</span> 0–5 meses
            </button>
            {ageGuides.slice(1).map(({ age, emoji }) => (
              <button
                key={age}
                className="cardapio-btn flex items-center justify-center gap-2 text-sm"
                onClick={() => setSelectedAge(age)}
                style={selectedAge === age ? { background: "hsl(var(--app-teal-light))" } : {}}
              >
                <span>{emoji}</span> {age}
              </button>
            ))}
          </div>
          {selectedAge && (
            <div className="mt-3 p-3 rounded-xl text-sm font-600"
              style={{ background: "hsl(var(--app-teal-light))", color: "hsl(var(--app-teal-dark))" }}>
              📖 Abrindo guia para <strong>{selectedAge}</strong>...
            </div>
          )}
        </div>

        {/* Cardápios */}
        <div className="card-food p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍱</span>
              <h2 className="font-800 text-base" style={{ fontWeight: 800 }}>Cardápios</h2>
            </div>
            <Crown size={18} className="premium-crown" />
          </div>
          <div className="space-y-3">
            {mealPlan.map((m) => (
              <div key={m.meal}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{m.emoji}</span>
                  <span className="font-700 text-sm" style={{ fontWeight: 700 }}>{m.meal}</span>
                </div>
                <div className="space-y-1 ml-6">
                  {m.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--primary))" }} />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat com Nutricionista */}
        <div className="card-food p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ background: "hsl(var(--app-yellow))" }}>
                💬
              </div>
              <h2 className="font-800 text-base" style={{ fontWeight: 800 }}>Chat com Nutricionista</h2>
            </div>
            <Crown size={18} className="premium-crown" />
          </div>
          <div className="space-y-2">
            <div className="ml-auto max-w-[80%] p-3 rounded-2xl rounded-tr-sm text-sm font-600 text-white"
              style={{ background: "hsl(var(--primary))" }}>
              Meu bebê não quer comer nada, o que eu faço? Socorro!
            </div>
            <div className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-sm"
                style={{ background: "hsl(var(--muted))" }}>
                👩‍⚕️
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Nutri Lilian</p>
                <div className="p-3 rounded-2xl rounded-tl-sm text-sm"
                  style={{ background: "hsl(var(--muted))" }}>
                  Oi! Qual o nome e idade do seu bebê?
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-3 py-3 rounded-xl text-sm font-700 text-white transition-all"
            style={{ background: "hsl(var(--primary))", fontWeight: 700 }}>
            💳 Premium — Ativar Chat
          </button>
        </div>

        {/* Stars decoration */}
        <div className="flex justify-center gap-4 py-4 text-3xl">
          <span>🍌</span><span>🍓</span><span>🥦</span><span>🍊</span>
        </div>
      </div>
    </div>
  );
}
