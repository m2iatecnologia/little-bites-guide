import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Star, Shield, CreditCard, Clock } from "lucide-react";

const benefits = [
  "+600 receitas completas",
  "Cardápios personalizados por idade",
  "Checklist inteligente de alimentos",
  "Relatório PDF para levar ao pediatra",
  "Sugestões inteligentes de novos alimentos",
  "Atualizações mensais de conteúdo",
];

const plans = [
  {
    id: "mensal",
    name: "Mensal",
    price: "R$ 9,90",
    period: "/ mês",
    badge: null,
    highlighted: false,
  },
  {
    id: "semestral",
    name: "Semestral",
    price: "R$ 49,90",
    period: "/ 6 meses",
    badge: "Mais econômico",
    highlighted: false,
  },
  {
    id: "anual",
    name: "Anual",
    price: "R$ 99,90",
    period: "/ ano",
    badge: "⭐ Melhor custo-benefício",
    highlighted: true,
  },
];

export default function Planos() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("anual");

  const handleSubscribe = (trial: boolean) => {
    const plan = plans.find((p) => p.id === selected);
    navigate("/assinatura-confirmada", {
      state: {
        plan: plan?.name,
        price: plan?.price,
        trial,
      },
    });
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: "hsl(var(--app-cream))" }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 active:scale-95 transition-transform"
          style={{ color: "hsl(var(--app-petrol))" }}
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Voltar</span>
        </button>

        <h1
          className="text-2xl font-extrabold leading-tight mb-2"
          style={{ color: "hsl(var(--app-petrol))" }}
        >
          Desbloqueie o acesso completo
        </h1>
        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Tenha acesso a cardápios, receitas exclusivas e relatórios profissionais.
        </p>
      </div>

      {/* Benefits */}
      <div className="px-5 py-5">
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--app-gold-light))" }}
              >
                <Check size={14} style={{ color: "hsl(var(--app-petrol))" }} strokeWidth={3} />
              </div>
              <span className="text-sm font-medium" style={{ color: "hsl(var(--app-petrol))" }}>
                {b}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="px-5 space-y-3">
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className="w-full rounded-2xl p-4 text-left transition-all duration-200 active:scale-[0.98] relative overflow-hidden"
              style={{
                background: "hsl(var(--app-card))",
                border: isSelected
                  ? "2.5px solid hsl(var(--app-gold))"
                  : "2px solid hsl(var(--app-divider))",
                boxShadow: isSelected
                  ? "0 4px 20px rgba(244,201,93,0.25)"
                  : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {plan.badge && (
                <span
                  className="absolute top-0 right-0 text-[10px] font-bold px-3 py-1 rounded-bl-xl"
                  style={{
                    background: plan.highlighted
                      ? "hsl(var(--app-gold))"
                      : "hsl(var(--app-gold-light))",
                    color: "hsl(var(--app-petrol))",
                  }}
                >
                  {plan.badge}
                </span>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-base" style={{ color: "hsl(var(--app-petrol))" }}>
                    Plano {plan.name}
                  </p>
                  <p className="mt-1">
                    <span
                      className="text-xl font-extrabold"
                      style={{ color: "hsl(var(--app-petrol))" }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-sm ml-1"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {plan.period}
                    </span>
                  </p>
                </div>

                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                  style={{
                    borderColor: isSelected
                      ? "hsl(var(--app-gold))"
                      : "hsl(var(--app-divider))",
                    background: isSelected ? "hsl(var(--app-gold))" : "transparent",
                  }}
                >
                  {isSelected && (
                    <Check size={14} color="hsl(var(--app-petrol))" strokeWidth={3} />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Trial CTA */}
      <div className="px-5 mt-6 space-y-3">
        <button
          onClick={() => handleSubscribe(true)}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{
            background: "hsl(var(--app-gold))",
            color: "hsl(var(--app-petrol))",
            boxShadow: "0 4px 16px rgba(244,201,93,0.35)",
          }}
        >
          🎁 Iniciar 7 dias grátis
        </button>

        <p className="text-center text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          Experimente grátis por 7 dias. Cancele quando quiser.
        </p>

        <button
          onClick={() => handleSubscribe(false)}
          className="w-full py-3 rounded-2xl font-semibold text-sm active:scale-95 transition-transform"
          style={{
            background: "transparent",
            color: "hsl(var(--app-petrol))",
            border: "1.5px solid hsl(var(--app-divider))",
          }}
        >
          Assinar agora sem teste grátis
        </button>
      </div>

      {/* Trust badges */}
      <div className="px-5 mt-8 space-y-3">
        <div className="flex items-center gap-3">
          <Shield size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Cancelamento a qualquer momento
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Pagamento 100% seguro
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Cobrança automática após período de teste
          </span>
        </div>
      </div>
    </div>
  );
}
