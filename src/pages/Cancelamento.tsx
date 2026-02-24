import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Gift, Bell, BookOpen, Check } from "lucide-react";

const reasons = [
  { id: "expensive", icon: "💰", label: "Está caro para mim" },
  { id: "not-using", icon: "📅", label: "Não estou usando com frequência" },
  { id: "baby-grown", icon: "👶", label: "Meu bebê já passou dessa fase" },
  { id: "free-content", icon: "📚", label: "Encontrei conteúdo gratuito" },
  { id: "no-value", icon: "🤔", label: "Não vi valor suficiente" },
  { id: "other", icon: "✏️", label: "Outro" },
];

type Step = "confirm" | "reason" | "offer" | "final" | "done";

export default function Cancelamento() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("confirm");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherText, setOtherText] = useState("");

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  const formattedEnd = endDate.toLocaleDateString("pt-BR");

  const getOffer = () => {
    if (selectedReason === "expensive")
      return {
        icon: <Gift size={28} style={{ color: "hsl(var(--app-petrol))" }} />,
        title: "Podemos oferecer 30% de desconto pelos próximos 3 meses.",
        accept: "Aceitar desconto",
        acceptIcon: "💛",
      };
    if (selectedReason === "not-using")
      return {
        icon: <Bell size={28} style={{ color: "hsl(var(--app-petrol))" }} />,
        title: "Que tal ativar lembretes personalizados para usar o app com mais frequência?",
        accept: "Ativar lembretes",
        acceptIcon: "🔔",
      };
    if (selectedReason === "baby-grown")
      return {
        icon: <BookOpen size={28} style={{ color: "hsl(var(--app-petrol))" }} />,
        title: "Temos conteúdo para +1 ano e lancheiras escolares!",
        accept: "Explorar conteúdo",
        acceptIcon: "📅",
      };
    return null;
  };

  const offer = getOffer();

  return (
    <div className="min-h-screen px-5 pt-6 pb-10" style={{ background: "hsl(var(--app-cream))" }}>
      <button
        onClick={() => (step === "confirm" ? navigate(-1) : setStep("confirm"))}
        className="flex items-center gap-2 mb-6 active:scale-95 transition-transform"
        style={{ color: "hsl(var(--app-petrol))" }}
      >
        <ArrowLeft size={20} />
        <span className="font-bold text-sm">Voltar</span>
      </button>

      {/* STEP 1 – Confirm */}
      {step === "confirm" && (
        <div className="animate-fade-in">
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--app-gold-light))" }}
            >
              <AlertTriangle size={30} style={{ color: "hsl(var(--app-petrol))" }} />
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-center mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
            Tem certeza que deseja cancelar?
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            Você perderá acesso a receitas exclusivas, cardápios personalizados e relatórios profissionais.
          </p>

          <div
            className="rounded-2xl p-4 mb-6"
            style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Seu plano atual</p>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: "hsl(var(--muted-foreground))" }}>Plano</span>
              <span className="font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Anual ⭐</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "hsl(var(--muted-foreground))" }}>Acesso até</span>
              <span className="font-bold" style={{ color: "hsl(var(--app-petrol))" }}>{formattedEnd}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 rounded-2xl font-bold text-base mb-3 active:scale-95 transition-transform"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 4px 16px rgba(244,201,93,0.35)" }}
          >
            Quero continuar com o plano
          </button>
          <button
            onClick={() => setStep("reason")}
            className="w-full py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-transform"
            style={{ color: "hsl(var(--muted-foreground))", border: "1.5px solid hsl(var(--app-divider))" }}
          >
            Continuar cancelamento
          </button>
        </div>
      )}

      {/* STEP 2 – Reason */}
      {step === "reason" && (
        <div className="animate-fade-in">
          <h1 className="text-xl font-extrabold mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
            O que te levou a cancelar?
          </h1>
          <p className="text-sm mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
            Sua resposta nos ajuda a melhorar o app.
          </p>

          <div className="space-y-2 mb-6">
            {reasons.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReason(r.id)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-[0.98]"
                style={{
                  background: "hsl(var(--app-card))",
                  border: selectedReason === r.id ? "2.5px solid hsl(var(--app-gold))" : "2px solid hsl(var(--app-divider))",
                  boxShadow: selectedReason === r.id ? "0 4px 16px rgba(244,201,93,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <span className="text-lg">{r.icon}</span>
                <span className="text-sm font-semibold" style={{ color: "hsl(var(--app-petrol))" }}>{r.label}</span>
              </button>
            ))}
          </div>

          {selectedReason === "other" && (
            <textarea
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Conte-nos mais..."
              className="w-full p-4 rounded-2xl text-sm mb-4 resize-none"
              rows={3}
              style={{
                background: "hsl(var(--app-card))",
                border: "1.5px solid hsl(var(--app-divider))",
                color: "hsl(var(--app-petrol))",
              }}
            />
          )}

          <button
            onClick={() => setStep(offer ? "offer" : "final")}
            disabled={!selectedReason}
            className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform disabled:opacity-40"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))" }}
          >
            Continuar
          </button>
        </div>
      )}

      {/* STEP 3 – Smart Offer */}
      {step === "offer" && offer && (
        <div className="animate-fade-in">
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--app-gold-light))" }}
            >
              {offer.icon}
            </div>
          </div>
          <h1 className="text-lg font-extrabold text-center mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
            Antes de ir...
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            {offer.title}
          </p>

          <button
            onClick={() => navigate("/em-desenvolvimento")}
            className="w-full py-4 rounded-2xl font-bold text-base mb-3 active:scale-95 transition-transform"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 4px 16px rgba(244,201,93,0.35)" }}
          >
            {offer.acceptIcon} {offer.accept}
          </button>
          <button
            onClick={() => setStep("final")}
            className="w-full py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-transform"
            style={{ color: "hsl(var(--muted-foreground))", border: "1.5px solid hsl(var(--app-divider))" }}
          >
            Continuar cancelamento
          </button>
        </div>
      )}

      {/* STEP 4 – Final Confirmation */}
      {step === "final" && (
        <div className="animate-fade-in">
          <h1 className="text-xl font-extrabold mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
            Confirmação final
          </h1>
          <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            Seu plano será encerrado em <strong>{formattedEnd}</strong>. Você continuará com acesso até essa data.
          </p>

          <button
            onClick={() => setStep("done")}
            className="w-full py-4 rounded-2xl font-bold text-base mb-3 active:scale-95 transition-transform"
            style={{ background: "hsl(var(--destructive))", color: "white" }}
          >
            Confirmar cancelamento
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-transform"
            style={{ color: "hsl(var(--app-petrol))", border: "1.5px solid hsl(var(--app-divider))" }}
          >
            Voltar
          </button>
        </div>
      )}

      {/* STEP 5 – Done */}
      {step === "done" && (
        <div className="animate-fade-in flex flex-col items-center pt-10">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{ background: "hsl(var(--app-gold-light))" }}
          >
            <Check size={30} style={{ color: "hsl(var(--app-petrol))" }} strokeWidth={3} />
          </div>
          <h1 className="text-xl font-extrabold text-center mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
            Assinatura cancelada
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            Você pode reativar a qualquer momento.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))" }}
          >
            Voltar ao aplicativo
          </button>
        </div>
      )}
    </div>
  );
}
