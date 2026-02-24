import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Lock, Crown } from "lucide-react";

interface PremiumGateProps {
  children: ReactNode;
  /** If true, shows blurred preview instead of full block */
  blur?: boolean;
  /** Optional fallback content shown when blocked */
  fallback?: ReactNode;
}

export function PremiumGate({ children, blur = false, fallback }: PremiumGateProps) {
  const { isPremium, loading } = useSubscription();

  if (loading) return null;
  if (isPremium) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  if (blur) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none opacity-60">
          {children}
        </div>
        <PremiumOverlay />
      </div>
    );
  }

  return <PremiumBlockScreen />;
}

export function PremiumOverlay() {
  const navigate = useNavigate();
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <button
        onClick={() => navigate("/planos")}
        className="flex flex-col items-center gap-2 p-5 rounded-2xl backdrop-blur-md transition-all active:scale-95"
        style={{
          background: "hsla(0, 0%, 100%, 0.85)",
          boxShadow: "0 8px 32px rgba(46, 64, 87, 0.15)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "hsl(var(--app-gold-light))" }}
        >
          <Lock size={20} style={{ color: "hsl(var(--app-petrol))" }} />
        </div>
        <p className="text-sm font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
          Conteúdo Premium
        </p>
        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          Toque para ver planos
        </p>
      </button>
    </div>
  );
}

export function PremiumBlockScreen() {
  const navigate = useNavigate();
  return (
    <div className="app-container flex flex-col items-center justify-center px-8 py-20 text-center gap-5">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: "hsl(var(--app-gold-light))" }}
      >
        <Crown size={36} style={{ color: "hsl(var(--app-gold-dark))" }} />
      </div>
      <h2 className="text-xl" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
        Recurso exclusivo para assinantes
      </h2>
      <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
        Assine um plano para desbloquear essa funcionalidade e ter acesso completo ao app.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
        <button
          onClick={() => navigate("/planos")}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: "hsl(var(--app-gold))",
            color: "hsl(var(--app-petrol))",
            fontWeight: 700,
            boxShadow: "0 4px 16px rgba(244,201,93,0.35)",
          }}
        >
          💛 Ver Planos
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
          style={{
            background: "transparent",
            color: "hsl(var(--muted-foreground))",
            border: "1.5px solid hsl(var(--app-divider))",
          }}
        >
          ❌ Voltar
        </button>
      </div>
    </div>
  );
}

/** Badge to show on recipe cards etc. */
export function PremiumBadge() {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{
        background: "hsl(var(--app-gold))",
        color: "hsl(var(--app-petrol))",
        fontWeight: 700,
      }}
    >
      <Lock size={10} />
      Premium
    </div>
  );
}
