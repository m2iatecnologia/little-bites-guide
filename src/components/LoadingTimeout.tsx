import { useState, useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoadingTimeoutProps {
  timeout?: number; // ms, default 10000
  onRetry?: () => void;
  children: React.ReactNode;
  loading: boolean;
}

export function LoadingTimeout({ timeout = 10000, onRetry, children, loading }: LoadingTimeoutProps) {
  const [timedOut, setTimedOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      setTimedOut(false);
      return;
    }
    setTimedOut(false);
    const timer = setTimeout(() => setTimedOut(true), timeout);
    return () => clearTimeout(timer);
  }, [loading, timeout]);

  if (!loading) return <>{children}</>;

  if (timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "hsl(var(--app-cream))" }}>
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "hsl(var(--app-gold-light))" }}>
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
            Não foi possível carregar
          </h2>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Verifique sua conexão e tente novamente.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                setTimedOut(false);
                onRetry?.();
              }}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}>
              <RefreshCw size={16} /> Tentar novamente
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: "hsl(var(--card))", color: "hsl(var(--muted-foreground))", fontWeight: 700 }}>
              <Home size={16} /> Voltar para início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Still loading, show spinner
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--app-cream))" }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: "hsl(var(--app-gold))", borderTopColor: "transparent" }} />
    </div>
  );
}
