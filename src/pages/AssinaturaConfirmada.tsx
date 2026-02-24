import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Calendar, BarChart3 } from "lucide-react";

const premiumBenefits = [
  "Acessar todas as receitas",
  "Usar cardápios personalizados",
  "Gerar relatório PDF profissional",
  "Acompanhar evolução alimentar",
  "Usar recursos exclusivos",
];

export default function AssinaturaConfirmada() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { plan?: string; price?: string; trial?: boolean }) || {};
  const { plan = "Anual", price = "R$ 99,90", trial = true } = state;

  const [showCheck, setShowCheck] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCheck(true), 300);
    const t2 = setTimeout(() => setShowContent(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + (trial ? 7 : 30));

  return (
    <div
      className="min-h-screen flex flex-col items-center px-5 pt-14 pb-10"
      style={{ background: "hsl(var(--app-cream))" }}
    >
      {/* Animated check */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-all duration-500"
        style={{
          background: "hsl(var(--app-gold))",
          transform: showCheck ? "scale(1)" : "scale(0)",
          opacity: showCheck ? 1 : 0,
        }}
      >
        <Check size={40} style={{ color: "hsl(var(--app-petrol))" }} strokeWidth={3} />
      </div>

      {/* Confetti dots */}
      {showCheck && (
        <div className="absolute top-8 left-0 right-0 flex justify-center gap-2 pointer-events-none animate-fade-in">
          {["🎉", "✨", "🎊", "💛", "✨"].map((e, i) => (
            <span
              key={i}
              className="text-lg animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {e}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        className="w-full transition-all duration-500"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <h1
          className="text-xl font-extrabold text-center leading-tight mb-2"
          style={{ color: "hsl(var(--app-petrol))" }}
        >
          Parabéns! Seu acesso premium está ativo.
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
          {trial
            ? "Você tem 7 dias gratuitos para explorar todos os recursos."
            : "Seu plano foi ativado com sucesso."}
        </p>

        {/* Plan details card */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "hsl(var(--app-card))",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
              Plano escolhido
            </span>
            <span className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>
              {plan}
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
              Próxima cobrança
            </span>
            <span className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>
              {nextBilling.toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
              Valor
            </span>
            <span className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>
              {price}
            </span>
          </div>
          <button
            onClick={() => navigate("/perfil")}
            className="text-xs font-semibold underline active:scale-95 transition-transform"
            style={{ color: "hsl(var(--app-gold-dark))" }}
          >
            Gerenciar assinatura
          </button>
        </div>

        {/* Benefits */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "hsl(var(--app-card))",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <p className="text-sm font-bold mb-3" style={{ color: "hsl(var(--app-petrol))" }}>
            Agora você pode:
          </p>
          {premiumBenefits.map((b) => (
            <div key={b} className="flex items-center gap-3 mb-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--app-gold-light))" }}
              >
                <Check size={12} style={{ color: "hsl(var(--app-petrol))" }} strokeWidth={3} />
              </div>
              <span className="text-sm" style={{ color: "hsl(var(--app-petrol))" }}>{b}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <button
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 mb-3 active:scale-95 transition-transform"
          style={{
            background: "hsl(var(--app-gold))",
            color: "hsl(var(--app-petrol))",
            boxShadow: "0 4px 16px rgba(244,201,93,0.35)",
          }}
        >
          🚀 Começar a usar agora
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/cardapio")}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{
              border: "1.5px solid hsl(var(--app-divider))",
              color: "hsl(var(--app-petrol))",
            }}
          >
            <Calendar size={16} /> Cardápio
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{
              border: "1.5px solid hsl(var(--app-divider))",
              color: "hsl(var(--app-petrol))",
            }}
          >
            <BarChart3 size={16} /> Painel
          </button>
        </div>
      </div>
    </div>
  );
}
