import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Calendar, BarChart3, RefreshCw, MessageCircle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

const premiumBenefits = [
  "Acessar todas as receitas",
  "Usar cardápios personalizados",
  "Gerar relatório PDF profissional",
  "Acompanhar evolução alimentar",
  "Usar recursos exclusivos",
];

type ActivationState = "checking" | "active" | "failed";

export default function AssinaturaConfirmada() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refresh, plan, endsAt, isPremium, loading } = useSubscription();

  const [activationState, setActivationState] = useState<ActivationState>("checking");
  const [showCheck, setShowCheck] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const pollCount = useRef(0);
  const maxPolls = 10;

  useEffect(() => {
    if (!searchParams.get("session_id")) {
      setActivationState("active");
      setShowCheck(true);
      setTimeout(() => setShowContent(true), 400);
      return;
    }

    const pollSubscription = async () => {
      pollCount.current++;
      await refresh();
    };

    pollSubscription();
    const interval = setInterval(() => {
      if (pollCount.current >= maxPolls) {
        clearInterval(interval);
        setActivationState("failed");
        setShowCheck(true);
        setTimeout(() => setShowContent(true), 400);
        return;
      }
      pollSubscription();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // React to subscription status changes
  useEffect(() => {
    if (loading) return;
    if (isPremium && activationState === "checking") {
      setActivationState("active");
      setShowCheck(true);
      setTimeout(() => setShowContent(true), 400);
    }
  }, [isPremium, loading, activationState]);

  const handleRetry = async () => {
    setActivationState("checking");
    pollCount.current = 0;
    await refresh();
    if (isPremium) {
      setActivationState("active");
    } else {
      setTimeout(async () => {
        await refresh();
      }, 3000);
    }
  };

  const planNames: Record<string, string> = {
    mensal: "Mensal",
    semestral: "Semestral",
    anual: "Anual",
  };

  const planPrices: Record<string, string> = {
    mensal: "R$ 9,90",
    semestral: "R$ 49,90",
    anual: "R$ 99,90",
  };

  const displayPlan = plan ? planNames[plan] || plan : "Premium";
  const displayPrice = plan ? planPrices[plan] || "" : "";

  // Loading / checking state
  if (activationState === "checking") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-5"
        style={{ background: "hsl(var(--app-cream))" }}
      >
        <div className="animate-spin mb-5">
          <RefreshCw size={36} style={{ color: "hsl(var(--app-gold))" }} />
        </div>
        <h2
          className="text-lg font-bold text-center mb-2"
          style={{ color: "hsl(var(--app-petrol))" }}
        >
          Estamos confirmando sua assinatura...
        </h2>
        <p className="text-sm text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
          Isso pode levar alguns segundos. Por favor, aguarde.
        </p>
      </div>
    );
  }

  // Failed state
  if (activationState === "failed") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-5"
        style={{ background: "hsl(var(--app-cream))" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: "hsl(var(--app-gold-light))" }}
        >
          <span className="text-2xl">⏳</span>
        </div>
        <h2
          className="text-lg font-bold text-center mb-2"
          style={{ color: "hsl(var(--app-petrol))" }}
        >
          Seu pagamento foi confirmado!
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
          Ainda estamos finalizando a ativação da sua assinatura. Tente atualizar em alguns instantes.
        </p>
        <button
          onClick={handleRetry}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 mb-3 active:scale-[0.97] transition-transform"
          style={{
            background: "hsl(var(--app-gold))",
            color: "hsl(var(--app-petrol))",
          }}
        >
          <RefreshCw size={18} /> Atualizar status
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          style={{
            border: "1.5px solid hsl(var(--app-divider))",
            color: "hsl(var(--app-petrol))",
          }}
        >
          <MessageCircle size={16} /> Falar com suporte
        </button>
      </div>
    );
  }

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
          Seu plano foi ativado com sucesso.
        </p>

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
              {displayPlan}
            </span>
          </div>
          {endsAt && (
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                Próxima cobrança
              </span>
              <span className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>
                {endsAt.toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}
          {displayPrice && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                Valor
              </span>
              <span className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>
                {displayPrice}
              </span>
            </div>
          )}
          <button
            onClick={() => navigate("/perfil")}
            className="text-xs font-semibold underline active:scale-95 transition-transform"
            style={{ color: "hsl(var(--app-gold-dark))" }}
          >
            Gerenciar assinatura
          </button>
        </div>

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
