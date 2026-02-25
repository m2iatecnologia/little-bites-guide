import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";

export function PremiumCTA() {
  const navigate = useNavigate();
  return (
    <div
      className="mt-6 mb-4 p-5 rounded-2xl text-center space-y-3"
      style={{ background: "hsl(var(--app-gold-light))", border: "1.5px solid hsl(var(--app-gold))" }}
    >
      <div className="flex justify-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "hsl(var(--app-gold))" }}
        >
          <Crown size={22} style={{ color: "hsl(var(--app-petrol))" }} />
        </div>
      </div>
      <p className="font-extrabold text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
        Desbloqueie o Premium
      </p>
      <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
        Acesse +1.000 receitas e recursos exclusivos.
      </p>
      <button
        onClick={() => navigate("/planos")}
        className="w-full py-3.5 rounded-xl font-extrabold text-sm transition-all active:scale-95"
        style={{
          background: "hsl(var(--app-gold))",
          color: "hsl(var(--app-petrol))",
          fontWeight: 900,
          boxShadow: "0 4px 16px rgba(244,201,93,0.35)",
        }}
      >
        🎁 Experimentar grátis por 7 dias
      </button>
    </div>
  );
}
