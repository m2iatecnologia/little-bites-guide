import { useState } from "react";
import { FileText, TrendingUp, Check, X, Download, ChevronDown, ChevronUp } from "lucide-react";
import { generateClinicalReport } from "@/lib/generateReport";

const mockReportData = {
  childName: "Sofia Lima",
  birthDate: "12/05/2024",
  currentAge: "9 meses",
  weight: "8,2",
  period: "Janeiro 2025",
  totalFoods: 42,
  acceptanceRate: 68,
  rejectionRate: 20,
  neutralRate: 12,
  newFoodsIntroduced: 8,
  reactionsCount: 1,
  totalMeals: 87,
  weeklyFrequency: 3,
  bestAccepted: [
    { food: "Abobrinha", rate: 90 },
    { food: "Banana", rate: 85 },
    { food: "Ovo", rate: 82 },
    { food: "Batata doce", rate: 78 },
    { food: "Frango desfiado", rate: 74 },
  ],
  mostRejected: [
    { food: "Brócolis", rate: 70 },
    { food: "Beterraba", rate: 60 },
    { food: "Espinafre", rate: 45 },
  ],
  reactions: [
    { date: "15/01/2025", food: "Morango", type: "Manchas vermelhas ao redor da boca" },
  ],
  weeklyIntroductions: [6, 8, 12, 9, 7],
  parentNotes: "",
};

export function ReportSection() {
  const [showModal, setShowModal] = useState(false);
  const [parentNotes, setParentNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 800));
    generateClinicalReport({ ...mockReportData, parentNotes });
    setIsGenerating(false);
    setShowModal(false);
  };

  return (
    <>
      <div className="card-food p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--app-yellow) / 0.4)" }}>
              <TrendingUp size={16} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
            </div>
            <h2 className="font-extrabold text-base" style={{ fontWeight: 800 }}>
              📊 Resumo Alimentar do Mês
            </h2>
          </div>
          <button onClick={() => setShowDetails((v) => !v)} style={{ color: "hsl(var(--muted-foreground))" }}>
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: "Alimentos ofertados", value: "42", icon: "🥗" },
            { label: "Novos introduzidos", value: "8", icon: "🆕" },
            { label: "Refeições registradas", value: "87", icon: "🍽️" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-2 text-center"
              style={{ background: "hsl(var(--app-yellow) / 0.25)" }}>
              <div className="text-lg">{s.icon}</div>
              <div className="text-lg font-extrabold leading-none"
                style={{ color: "hsl(var(--app-brown))", fontWeight: 900 }}>
                {s.value}
              </div>
              <div className="text-[9px] leading-tight mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Acceptance bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            <span>Índice de Aceitação</span>
            <span className="font-bold" style={{ color: "hsl(var(--app-yellow-highlight))", fontWeight: 700 }}>68%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex" style={{ background: "hsl(var(--muted))" }}>
            <div className="h-full" style={{ width: "68%", background: "hsl(var(--app-yellow-dark))", borderRadius: "999px 0 0 999px" }} />
            <div className="h-full" style={{ width: "12%", background: "hsl(var(--app-warm-muted))" }} />
            <div className="h-full flex-1" style={{ background: "hsl(25 40% 65%)", borderRadius: "0 999px 999px 0" }} />
          </div>
          <div className="flex gap-3 mt-1">
            {[
              { color: "hsl(var(--app-yellow-dark))", label: "Aceitação 68%" },
              { color: "hsl(var(--app-warm-muted))", label: "Neutro 12%" },
              { color: "hsl(25 40% 65%)", label: "Recusa 20%" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="text-[9px]" style={{ color: "hsl(var(--muted-foreground))" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="space-y-2 mb-3">
            <div className="text-xs font-bold mb-1" style={{ color: "hsl(var(--app-brown))", fontWeight: 700 }}>
              🏆 Melhor aceitação
            </div>
            {mockReportData.bestAccepted.slice(0, 3).map((item, i) => (
              <div key={item.food} className="flex items-center gap-2">
                <span className="text-xs w-4">{["🥇", "🥈", "🥉"][i]}</span>
                <span className="text-xs flex-1">{item.food}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                  <div className="h-full rounded-full" style={{ width: `${item.rate}%`, background: "hsl(var(--app-yellow-dark))" }} />
                </div>
                <span className="text-xs font-bold w-8 text-right" style={{ color: "hsl(var(--app-yellow-highlight))", fontWeight: 700 }}>
                  {item.rate}%
                </span>
              </div>
            ))}
            <div className="text-xs font-bold mt-2 mb-1" style={{ color: "hsl(25 40% 50%)", fontWeight: 700 }}>
              ⚠️ Maior rejeição
            </div>
            {mockReportData.mostRejected.slice(0, 3).map((item) => (
              <div key={item.food} className="flex items-center gap-2">
                <span className="text-xs w-4">•</span>
                <span className="text-xs flex-1">{item.food}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                  <div className="h-full rounded-full" style={{ width: `${item.rate}%`, background: "hsl(25 40% 65%)" }} />
                </div>
                <span className="text-xs font-bold w-8 text-right" style={{ color: "hsl(25 40% 55%)", fontWeight: 700 }}>
                  {item.rate}%
                </span>
              </div>
            ))}
            {mockReportData.reactions.length > 0 && (
              <div className="mt-2 p-2 rounded-lg text-xs" style={{ background: "hsl(var(--app-yellow) / 0.3)" }}>
                <span className="font-bold" style={{ fontWeight: 700 }}>⚠️ Reações registradas:</span>{" "}
                {mockReportData.reactions[0].food} — {mockReportData.reactions[0].type}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95"
          style={{ background: "hsl(var(--app-yellow-dark))", color: "hsl(var(--app-brown))", fontWeight: 700 }}>
          <FileText size={17} />
          📄 Exportar Relatório para Consulta (PDF)
        </button>
        <p className="text-center text-[10px] mt-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
          Leve para o pediatra, nutricionista ou alergista
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="w-full max-w-md rounded-t-3xl p-5 pb-8"
            style={{ background: "hsl(var(--card))" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base" style={{ fontWeight: 800 }}>
                📄 Gerar Relatório Clínico
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} style={{ color: "hsl(var(--muted-foreground))" }} />
              </button>
            </div>

            <div className="rounded-xl p-3 mb-4 space-y-1.5 text-xs" style={{ background: "hsl(var(--app-yellow) / 0.25)" }}>
              <p className="font-bold mb-2" style={{ color: "hsl(var(--app-brown))", fontWeight: 700 }}>
                O relatório incluirá:
              </p>
              {[
                "Capa com dados da criança",
                "Resumo geral com estatísticas do mês",
                "Ranking de alimentos aceitos e recusados",
                "Histórico de possíveis reações",
                "Gráfico de evolução semanal",
                "Suas observações para o médico",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2" style={{ color: "hsl(var(--app-brown))" }}>
                  <Check size={13} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold mb-1.5"
                style={{ color: "hsl(var(--foreground))", fontWeight: 700 }}>
                📝 Observações para o médico (opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Bebê tem tido episódios de recusa ao jantar..."
                value={parentNotes}
                onChange={(e) => setParentNotes(e.target.value)}
                className="w-full text-xs rounded-xl p-3 resize-none border outline-none"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 disabled:opacity-60"
              style={{ background: "hsl(var(--app-yellow-dark))", color: "hsl(var(--app-brown))", fontWeight: 700 }}>
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download size={17} />
                  Baixar Relatório PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
