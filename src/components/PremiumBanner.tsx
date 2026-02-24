import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

export function PremiumBanner() {
  const navigate = useNavigate();
  const { status, isPremium, loading } = useSubscription();

  if (loading || isPremium) return null;
  if (status !== "expired" && status !== "canceled") return null;

  return (
    <button
      onClick={() => navigate("/planos")}
      className="w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98]"
      style={{
        background: "hsl(var(--app-gold-light))",
        border: "1.5px solid hsl(var(--app-gold))",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">⏳</span>
        <p className="text-xs font-bold text-left" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
          Seu acesso premium expirou.
        </p>
      </div>
      <span
        className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
        style={{
          background: "hsl(var(--app-gold))",
          color: "hsl(var(--app-petrol))",
          fontWeight: 700,
        }}
      >
        Reativar agora
      </span>
    </button>
  );
}
