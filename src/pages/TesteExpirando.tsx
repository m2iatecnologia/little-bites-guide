import { useNavigate, useSearchParams } from "react-router-dom";
import { Clock, Shield } from "lucide-react";

export default function TesteExpirando() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const days = Number(params.get("days") || 3);

  const urgency = days <= 1 ? "high" : days <= 1 ? "medium" : "low";

  const titles: Record<number, string> = {
    3: "Seu acesso premium termina em 3 dias",
    1: "Último dia do seu teste gratuito",
    0: "Seu teste termina hoje",
  };
  const key = days >= 3 ? 3 : days >= 1 ? 1 : 0;

  const subtitles: Record<number, string> = {
    3: "Continue acompanhando a evolução alimentar do seu bebê sem interrupções.",
    1: "Não perca acesso às receitas, cardápios e relatórios.",
    0: "Amanhã seu acesso premium será encerrado.",
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-5 pt-14 pb-10" style={{ background: "hsl(var(--app-cream))" }}>
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: key === 0 ? "hsl(0 84% 95%)" : "hsl(var(--app-gold-light))" }}
      >
        <Clock size={36} style={{ color: "hsl(var(--app-petrol))" }} />
      </div>

      {/* Counter badge */}
      {key <= 1 && (
        <div
          className="px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          style={{
            background: key === 0 ? "hsl(0 84% 60%)" : "hsl(var(--app-gold))",
            color: key === 0 ? "white" : "hsl(var(--app-petrol))",
          }}
        >
          {key === 0 ? "Último dia" : "1 dia restante"}
        </div>
      )}

      <h1 className="text-xl font-extrabold text-center mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
        {titles[key]}
      </h1>
      <p className="text-sm text-center mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
        {subtitles[key]}
      </p>

      {/* Plan info */}
      <div
        className="w-full rounded-2xl p-4 mb-6"
        style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: "hsl(var(--muted-foreground))" }}>Plano selecionado</span>
          <span className="font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Anual</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "hsl(var(--muted-foreground))" }}>Valor após o teste</span>
          <span className="font-bold" style={{ color: "hsl(var(--app-petrol))" }}>R$ 99,90/ano</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/planos")}
        className="w-full py-4 rounded-2xl font-bold text-base mb-3 active:scale-95 transition-transform"
        style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 4px 16px rgba(244,201,93,0.35)" }}
      >
        {key === 0 ? "Continuar com o plano" : key === 1 ? "Garantir acesso contínuo" : "💛 Manter meu acesso"}
      </button>

      {key === 0 ? (
        <button
          onClick={() => navigate("/cancelamento")}
          className="w-full py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-transform"
          style={{ color: "hsl(var(--muted-foreground))", border: "1.5px solid hsl(var(--app-divider))" }}
        >
          Cancelar agora
        </button>
      ) : (
        <button
          onClick={() => navigate("/perfil")}
          className="w-full py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-transform"
          style={{ color: "hsl(var(--muted-foreground))", border: "1.5px solid hsl(var(--app-divider))" }}
        >
          ⚙ Gerenciar assinatura
        </button>
      )}

      {/* Trust */}
      <div className="flex items-center gap-2 mt-8">
        <Shield size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          Cancelamento a qualquer momento
        </span>
      </div>
    </div>
  );
}
