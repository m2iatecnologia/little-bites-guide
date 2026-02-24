import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dicaImg from "@/assets/dica-do-dia.jpg";
import { FoodImage } from "@/components/FoodImage";
import { ReportSection } from "@/components/ReportSection";
import { foods } from "@/data/appData";
import {
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

/* mock data */
const weeklyEvolution = [
  { week: "Sem 1", count: 6 },
  { week: "Sem 2", count: 11 },
  { week: "Sem 3", count: 18 },
  { week: "Sem 4", count: 24 },
];

const recommendedFoods = [
  { name: "Batata doce", emoji: "🍠", reason: "Rica em vitamina A" },
  { name: "Lentilha", emoji: "🫘", reason: "Ferro vegetal" },
  { name: "Manga", emoji: "🥭", reason: "Vitamina C e sabor doce" },
  { name: "Brócolis", emoji: "🥦", reason: "Cálcio e fibras" },
];

const alerts = [
  { type: "reaction", icon: "⚠️", text: "Morango — manchas ao redor da boca (15/01)" },
  { type: "rejection", icon: "🔄", text: "Brócolis precisa de nova exposição (recusa 70%)" },
  { type: "rejection", icon: "🔄", text: "Beterraba — tente novamente esta semana" },
];

export default function Index() {
  const navigate = useNavigate();

  const maxEvolution = Math.max(...weeklyEvolution.map((w) => w.count));

  return (
    <div className="app-container bottom-nav-safe">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
            Olá, Mamãe 👋
          </p>
          <h1 className="text-xl" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
            Sofia · <span className="font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol-light))" }}>9 meses</span>
          </h1>
        </div>
        <button
          onClick={() => navigate("/perfil")}
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all active:scale-95"
          style={{
            background: "hsl(var(--app-gold-light))",
            boxShadow: "0 2px 10px rgba(46,64,87,0.1)",
          }}
        >
          👶
        </button>
      </div>

      <div className="px-4 space-y-4">
        {/* 1. Painel de Acompanhamento Alimentar */}
        <ReportSection />

        {/* 2. Evolução da Diversidade Alimentar */}
        <div className="card-clinical p-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--app-gold-light))" }}
            >
              <TrendingUp size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
            </div>
            <h2 className="font-extrabold text-sm" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
              Evolução da Diversidade Alimentar
            </h2>
          </div>
          {/* Simple line chart */}
          <div className="flex items-end gap-3 h-28 px-2">
            {weeklyEvolution.map((w, i) => (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                <span
                  className="text-xs font-bold"
                  style={{ color: "hsl(var(--app-petrol))", fontWeight: 700 }}
                >
                  {w.count}
                </span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${(w.count / maxEvolution) * 80}px`,
                    background:
                      i === weeklyEvolution.length - 1
                        ? "hsl(var(--app-gold))"
                        : "hsl(var(--app-gold-light))",
                  }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {w.week}
                </span>
              </div>
            ))}
          </div>
          <p
            className="text-[10px] text-center mt-2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Repertório alimentar crescendo semana a semana 📈
          </p>
        </div>

        {/* 3. Próximos Alimentos Recomendados */}
        <div className="card-clinical p-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--app-gold-light))" }}
            >
              <Lightbulb size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
            </div>
            <h2 className="font-extrabold text-sm" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
              Próximos Alimentos Recomendados
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {recommendedFoods.map((food) => (
              <button
                key={food.name}
                onClick={() => navigate("/alimentos")}
                className="flex items-center gap-2 p-3 rounded-xl text-left transition-all active:scale-95"
                style={{ background: "hsl(var(--app-cream))" }}
              >
                <span className="text-2xl">{food.emoji}</span>
                <div>
                  <p className="text-xs font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
                    {food.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {food.reason}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Alertas e Observações */}
        <div className="card-clinical p-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "hsl(0 80% 95%)" }}
            >
              <AlertTriangle size={16} style={{ color: "hsl(0 70% 55%)" }} />
            </div>
            <h2 className="font-extrabold text-sm" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
              Alertas e Observações
            </h2>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 rounded-xl text-xs"
                style={{
                  background: alert.type === "reaction" ? "hsl(0 80% 97%)" : "hsl(var(--app-cream))",
                }}
              >
                <span className="flex-shrink-0">{alert.icon}</span>
                <p style={{ color: "hsl(var(--app-petrol))" }}>{alert.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Dica do Dia */}
        <button
          onClick={() => navigate("/em-desenvolvimento")}
          className="card-clinical overflow-hidden w-full text-left"
        >
          <div className="relative h-40">
            <img
              src={dicaImg}
              alt="Dica do dia"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-3"
              style={{
                background: "linear-gradient(to top, rgba(46,64,87,0.7), transparent)",
              }}
            >
              <span className="tag-highlight mb-1 inline-block">Dica do dia</span>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between">
            <p
              className="font-bold text-sm flex-1"
              style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}
            >
              Como lidar com a recusa e seletividade depois de 1 ano
            </p>
            <ChevronRight size={18} style={{ color: "hsl(var(--app-gold-dark))" }} />
          </div>
        </button>

        {/* 6. Quick access - Alimentos */}
        <button
          onClick={() => navigate("/alimentos")}
          className="card-clinical p-4 w-full text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥗</span>
              <h2 className="font-extrabold text-sm" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
                Alimentos · Como oferecer
              </h2>
            </div>
            <ChevronRight size={18} style={{ color: "hsl(var(--app-gold-dark))" }} />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {foods.slice(0, 4).map((food) => (
              <div key={food.id} className="flex-shrink-0 flex flex-col items-center gap-1">
                <div className="relative w-18 h-18 rounded-xl overflow-hidden">
                  <FoodImage
                    name={food.image}
                    className="w-full h-full object-cover"
                    alt={food.name}
                  />
                  <span className="age-tag absolute bottom-1 left-1">{food.age}</span>
                </div>
                <span
                  className="text-xs font-semibold text-center"
                  style={{ fontWeight: 600, color: "hsl(var(--app-petrol))" }}
                >
                  {food.name}
                </span>
              </div>
            ))}
          </div>
        </button>

        <div className="flex justify-center gap-4 py-3 text-3xl">
          <span>🍌</span><span>🍓</span><span>🥦</span><span>🍊</span>
        </div>
      </div>
    </div>
  );
}
