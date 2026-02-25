import { useNavigate } from "react-router-dom";
import dicaImg from "@/assets/dica-do-dia.jpg";
import { ReportSection } from "@/components/ReportSection";
import {
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { PremiumBanner } from "@/components/PremiumBanner";
import { useDashboardData } from "@/hooks/useDashboardData";

const recommendedFoods = [
  { name: "Batata doce", emoji: "🍠", reason: "Rica em vitamina A" },
  { name: "Lentilha", emoji: "🫘", reason: "Ferro vegetal" },
  { name: "Manga", emoji: "🥭", reason: "Vitamina C e sabor doce" },
  { name: "Brócolis", emoji: "🥦", reason: "Cálcio e fibras" },
];

export default function Index() {
  const navigate = useNavigate();
  const data = useDashboardData();

  const maxEvolution = Math.max(...data.weeklyEvolution.map((w) => w.count), 1);

  return (
    <div className="app-container bottom-nav-safe">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
            Olá, {data.profileName || "Mamãe"} 👋
          </p>
          <h1 className="text-xl" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
            {data.baby?.name || "Bebê"} · <span className="font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol-light))" }}>{data.babyAge || "—"}</span>
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
        <PremiumBanner />
        <ReportSection dashboardData={data} />

        {/* Evolução da Diversidade Alimentar */}
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
          <div className="flex items-end gap-3 h-28 px-2">
            {data.weeklyEvolution.map((w, i) => (
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
                    minHeight: w.count > 0 ? "4px" : "0px",
                    background:
                      i === data.weeklyEvolution.length - 1
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
            {data.totalFoods > 0
              ? "Repertório alimentar crescendo semana a semana 📈"
              : "Registre alimentos para acompanhar a evolução 📝"}
          </p>
        </div>

        {/* Próximos Alimentos Recomendados */}
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

        {/* Alertas e Observações */}
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
            {data.alerts.length > 0 ? (
              data.alerts.map((alert, i) => (
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
              ))
            ) : (
              <p className="text-xs text-center py-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                Nenhum alerta no momento. Continue registrando! ✅
              </p>
            )}
          </div>
        </div>

        {/* Dica do Dia */}
        <button
          onClick={() => navigate("/em-desenvolvimento")}
          className="card-clinical overflow-hidden w-full text-left"
        >
          <div className="relative h-40">
            <img
              src={dicaImg}
              alt="Dica do dia"
              className="w-full h-full object-cover"
              loading="lazy"
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

        <div className="flex justify-center gap-4 py-3 text-3xl">
          <span>🍌</span><span>🍓</span><span>🥦</span><span>🍊</span>
        </div>
      </div>
    </div>
  );
}
