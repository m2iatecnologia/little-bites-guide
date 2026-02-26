import { useState } from "react";
import {
  FileText,
  Check,
  X,
  Download,
  ChevronDown,
  ChevronUp,
  Share2,
  Lock,
} from "lucide-react";
import { generateClinicalReport } from "@/lib/generateReport";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import type { DashboardData } from "@/hooks/useDashboardData";

interface ReportSectionProps {
  dashboardData: DashboardData;
}

export function ReportSection({ dashboardData: d }: ReportSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [parentNotes, setParentNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { isPremium } = useSubscription();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!isPremium) { navigate("/planos"); return; }
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 800));
    generateClinicalReport({ ...d.reportData, parentNotes });
    setIsGenerating(false);
    setShowModal(false);
  };

  const handleOpenModal = () => {
    if (!isPremium) { navigate("/planos"); return; }
    setShowModal(true);
  };

  return (
    <>
      <div className="card-clinical p-5">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-extrabold text-base"
            style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}
          >
            📊 Painel de Acompanhamento
          </h2>
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="p-1 rounded-lg transition-all active:scale-95"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Alimentos", value: String(d.totalFoods), sub: "introduzidos" },
            { label: "Novos", value: String(d.newFoodsThisMonth), sub: "este mês" },
            { label: "Refeições", value: String(d.totalMeals), sub: "registradas" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{ background: "hsl(var(--app-cream))" }}
            >
              <div
                className="text-xl font-extrabold leading-none"
                style={{ color: "hsl(var(--app-petrol))", fontWeight: 900 }}
              >
                {s.value}
              </div>
              <div
                className="text-[10px] leading-tight mt-1"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Acceptance bar */}
        <div className="mb-4">
          <div
            className="flex justify-between text-xs mb-1.5"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <span className="font-semibold">Índice de Aceitação</span>
            <span
              className="font-bold"
              style={{ color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}
            >
              {d.acceptanceRate}%
            </span>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden flex"
            style={{ background: "hsl(var(--app-cream-dark))" }}
          >
            <div
              className="h-full"
              style={{
                width: `${d.acceptanceRate}%`,
                background: "hsl(var(--app-gold))",
                borderRadius: "999px 0 0 999px",
              }}
            />
            <div
              className="h-full"
              style={{ width: `${d.neutralRate}%`, background: "hsl(var(--app-cream-dark))" }}
            />
            <div
              className="h-full flex-1"
              style={{
                background: "hsl(25 30% 70%)",
                borderRadius: "0 999px 999px 0",
              }}
            />
          </div>
          <div className="flex gap-3 mt-1.5">
            {[
              { color: "hsl(var(--app-gold))", label: `Aceitação ${d.acceptanceRate}%` },
              { color: "hsl(var(--app-cream-dark))", label: `Neutro ${d.neutralRate}%` },
              { color: "hsl(25 30% 70%)", label: `Recusa ${d.rejectionRate}%` },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: l.color }}
                />
                <span
                  className="text-[9px]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expanded details */}
        {showDetails && (
          <div className="space-y-2 mb-4 pt-2" style={{ borderTop: "1px solid hsl(var(--app-divider))" }}>
            {d.bestAccepted.length > 0 && (
              <>
                <div
                  className="text-xs font-bold mb-1"
                  style={{ color: "hsl(var(--app-petrol))", fontWeight: 700 }}
                >
                  🏆 Melhor aceitação
                </div>
                {d.bestAccepted.slice(0, 3).map((item, i) => (
                  <div key={item.food} className="flex items-center gap-2">
                    <span className="text-xs w-4">{["🥇", "🥈", "🥉"][i]}</span>
                    <span className="text-xs flex-1" style={{ color: "hsl(var(--app-petrol))" }}>
                      {item.food}
                    </span>
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ background: "hsl(var(--app-cream-dark))" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.rate}%`,
                          background: "hsl(var(--app-gold))",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold w-8 text-right"
                      style={{ color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}
                    >
                      {item.rate}%
                    </span>
                  </div>
                ))}
              </>
            )}
            {d.mostRejected.length > 0 && (
              <>
                <div
                  className="text-xs font-bold mt-3 mb-1"
                  style={{ color: "hsl(25 30% 50%)", fontWeight: 700 }}
                >
                  ⚠️ Maior rejeição
                </div>
                {d.mostRejected.slice(0, 3).map((item) => (
                  <div key={item.food} className="flex items-center gap-2">
                    <span className="text-xs w-4">•</span>
                    <span className="text-xs flex-1" style={{ color: "hsl(var(--app-petrol))" }}>
                      {item.food}
                    </span>
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ background: "hsl(var(--app-cream-dark))" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.rate}%`, background: "hsl(25 30% 70%)" }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold w-8 text-right"
                      style={{ color: "hsl(25 30% 55%)", fontWeight: 700 }}
                    >
                      {item.rate}%
                    </span>
                  </div>
                ))}
              </>
            )}
            {d.bestAccepted.length === 0 && d.mostRejected.length === 0 && (
              <p className="text-xs text-center py-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                Registre alimentos para ver os rankings aqui 📝
              </p>
            )}
            {d.reactions.length > 0 && (
              <div
                className="mt-2 p-2.5 rounded-xl text-xs"
                style={{ background: "hsl(0 80% 97%)" }}
              >
                <span className="font-bold" style={{ fontWeight: 700, color: "hsl(0 70% 45%)" }}>
                  ⚠️ Reação registrada:
                </span>{" "}
                <span style={{ color: "hsl(var(--app-petrol))" }}>
                  {d.reactions[0].food} — {d.reactions[0].type}
                </span>
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleOpenModal}
          className="btn-primary-clinical w-full"
          style={!isPremium ? { opacity: 0.85 } : {}}
        >
          {isPremium ? (
            <>
              <FileText size={17} />
              Gerar Relatório Profissional (PDF)
            </>
          ) : (
            <>
              <Lock size={17} />
              🔒 Gerar Relatório (Premium)
            </>
          )}
        </button>
        {!isPremium && (
          <p
            className="text-center text-[10px] mt-1.5 font-bold"
            style={{ color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}
          >
            Assine para desbloquear o relatório PDF
          </p>
        )}
        {isPremium && (
          <p
            className="text-center text-[10px] mt-1.5"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Leve para o pediatra, nutricionista ou alergista
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl p-5 pb-8"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="font-extrabold text-base"
                style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}
              >
                📄 Gerar Relatório Clínico
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} style={{ color: "hsl(var(--muted-foreground))" }} />
              </button>
            </div>

            <div
              className="rounded-xl p-3 mb-4 space-y-1.5 text-xs"
              style={{ background: "hsl(var(--app-cream))" }}
            >
              <p
                className="font-bold mb-2"
                style={{ color: "hsl(var(--app-petrol))", fontWeight: 700 }}
              >
                O relatório incluirá:
              </p>
              {[
                "Capa com dados da criança",
                "Resumo geral com estatísticas do mês",
                "Ranking de alimentos aceitos e recusados",
                "Histórico de possíveis reações",
                "Observações registradas nas refeições",
                "Gráfico de evolução semanal",
                "Suas observações para o médico",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2"
                  style={{ color: "hsl(var(--app-petrol))" }}
                >
                  <Check size={13} style={{ color: "hsl(var(--app-gold-dark))" }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label
                className="block text-xs font-bold mb-1.5"
                style={{ color: "hsl(var(--app-petrol))", fontWeight: 700 }}
              >
                📝 Observações para o médico (opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Bebê tem tido episódios de recusa ao jantar..."
                value={parentNotes}
                onChange={(e) => setParentNotes(e.target.value)}
                className="w-full text-xs rounded-xl p-3 resize-none border outline-none focus:ring-2"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary-clinical flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download size={17} />
                    Baixar PDF
                  </>
                )}
              </button>
              <button
                onClick={() => window.location.href = "/em-desenvolvimento"}
                className="px-4 py-3.5 rounded-xl flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: "hsl(var(--app-cream))",
                  color: "hsl(var(--app-petrol))",
                }}
              >
                <Share2 size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
