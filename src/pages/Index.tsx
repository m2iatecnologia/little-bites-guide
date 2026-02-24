import { useNavigate } from "react-router-dom";
import dicaImg from "@/assets/dica-do-dia.jpg";
import muffinImg from "@/assets/receita-muffin.jpg";
import picoleImg from "@/assets/receita-picole.jpg";
import { FoodImage } from "@/components/FoodImage";
import { ReportSection } from "@/components/ReportSection";
import { foods } from "@/data/appData";
import { ChevronRight, Crown } from "lucide-react";

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
  const navigate = useNavigate();

  return (
    <div className="app-container bottom-nav-safe">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Olá, Mamãe 👋</p>
          <h1 className="text-2xl" style={{ fontWeight: 900 }}>
            Nutri<span style={{ color: "hsl(var(--app-yellow-highlight))" }}>Baby</span>
          </h1>
        </div>
        <button
          onClick={() => navigate("/perfil")}
          className="w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all active:scale-95"
          style={{ background: "hsl(var(--app-yellow))", boxShadow: "0 2px 8px rgba(92,75,59,0.12)" }}>
          👶
        </button>
      </div>

      <div className="px-4 space-y-4">
        {/* Resumo Alimentar + PDF */}
        <ReportSection />

        {/* Dica do Dia */}
        <button onClick={() => navigate("/em-desenvolvimento")} className="card-food overflow-hidden w-full text-left">
          <div className="relative h-44">
            <img src={dicaImg} alt="Dica do dia" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-3"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
              <span className="tag-highlight mb-1 inline-block">Dica do dia</span>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between">
            <p className="font-bold text-sm flex-1" style={{ fontWeight: 700 }}>
              Como lidar com a recusa e seletividade depois de 1 ano
            </p>
            <ChevronRight size={18} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
          </div>
        </button>

        {/* Alimentos */}
        <button onClick={() => navigate("/alimentos")} className="card-food p-4 w-full text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥗</span>
              <h2 className="font-extrabold text-base" style={{ fontWeight: 800 }}>Alimentos • Como oferecer</h2>
            </div>
            <ChevronRight size={18} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {foods.slice(0, 4).map((food) => (
              <div key={food.id} className="flex-shrink-0 flex flex-col items-center gap-1">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                  <FoodImage name={food.image} className="w-full h-full object-cover" alt={food.name} />
                  <span className="age-tag absolute bottom-1 left-1">{food.age}</span>
                </div>
                <span className="text-xs font-semibold text-center" style={{ fontWeight: 600 }}>{food.name}</span>
              </div>
            ))}
          </div>
        </button>

        {/* Receitas */}
        <button onClick={() => navigate("/receitas")} className="card-food p-4 w-full text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧁</span>
              <h2 className="font-extrabold text-base" style={{ fontWeight: 800 }}>+650 Receitas</h2>
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
            <p className="col-span-2 text-xs text-center font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
              {recipes[0].name}
            </p>
          </div>
        </button>

        {/* Cardápios */}
        <button onClick={() => navigate("/cardapio")} className="card-food p-4 w-full text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍱</span>
              <h2 className="font-extrabold text-base" style={{ fontWeight: 800 }}>Cardápios</h2>
            </div>
            <Crown size={18} className="premium-crown" />
          </div>
          <div className="space-y-3">
            {mealPlan.map((m) => (
              <div key={m.meal}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{m.emoji}</span>
                  <span className="font-bold text-sm" style={{ fontWeight: 700 }}>{m.meal}</span>
                </div>
                <div className="space-y-1 ml-6">
                  {m.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--app-yellow-highlight))" }} />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </button>

        {/* Chat com Nutricionista */}
        <div className="card-food p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ background: "hsl(var(--app-yellow))" }}>
                💬
              </div>
              <h2 className="font-extrabold text-base" style={{ fontWeight: 800 }}>Chat com Nutricionista</h2>
            </div>
            <Crown size={18} className="premium-crown" />
          </div>
          <div className="space-y-2">
            <div className="ml-auto max-w-[80%] p-3 rounded-2xl rounded-tr-sm text-sm font-semibold text-white"
              style={{ background: "hsl(var(--app-yellow-highlight))", color: "hsl(var(--app-brown))" }}>
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
          <button
            onClick={() => navigate("/em-desenvolvimento")}
            className="w-full mt-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: "hsl(var(--app-yellow-dark))", color: "hsl(var(--app-brown))", fontWeight: 700 }}>
            💳 Premium — Ativar Chat
          </button>
        </div>

        <div className="flex justify-center gap-4 py-4 text-3xl">
          <span>🍌</span><span>🍓</span><span>🥦</span><span>🍊</span>
        </div>
      </div>
    </div>
  );
}
