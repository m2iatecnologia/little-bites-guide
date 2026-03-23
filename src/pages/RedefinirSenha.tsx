import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, Eye, EyeOff, Check, X, CheckCircle, XCircle, Loader2 } from "lucide-react";
import nutrooLogo from "@/assets/nutroo-logo-full.png";
import { toast } from "sonner";

const pwRules = [
  { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "1 letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 número", test: (p: string) => /\d/.test(p) },
  { label: "1 caractere especial", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ready" | "success" | "error">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");

  const pwChecks = useMemo(() => pwRules.map((r) => ({ ...r, pass: r.test(password) })), [password]);
  const allPwValid = pwChecks.every((c) => c.pass);
  const pwMatch = password === confirmPw && confirmPw.length > 0;

  useEffect(() => {
    let resolved = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (resolved) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        resolved = true;
        if (session?.user?.email) {
          setSessionEmail(session.user.email);
          setEmail(session.user.email);
        }
        setStatus("ready");
      }
    });

    // Also check if there's already a session (link may have been processed before mount)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (resolved) return;
      if (session?.user) {
        resolved = true;
        if (session.user.email) {
          setSessionEmail(session.user.email);
          setEmail(session.user.email);
        }
        setStatus("ready");
      }
    });

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (!resolved) {
        setStatus("error");
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleGoToLogin = async () => {
    // Always sign out before going to login to prevent auto-login
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allPwValid) return toast.error("A senha não atende todos os requisitos.");
    if (!pwMatch) return toast.error("As senhas não coincidem.");

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Always sign out after password reset to prevent auto-login
      await supabase.auth.signOut();
      setStatus("success");
    } catch (err: any) {
      toast.error(err.message || "Erro ao redefinir senha.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "hsl(var(--app-card))",
    border: "1.5px solid hsl(var(--app-divider))",
    color: "hsl(var(--app-petrol))",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10" style={{ background: "hsl(var(--app-cream))" }}>
      <div className="w-full max-w-sm text-center space-y-6">
        <img src={nutrooLogo} alt="Nutroo" className="w-40 mx-auto mb-2 object-contain" />

        {status === "loading" && (
          <>
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background: "hsl(var(--app-gold-light))" }}>
              <Loader2 size={36} className="animate-spin" style={{ color: "hsl(var(--app-petrol))" }} />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Verificando link...</h1>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Aguarde um momento.</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background: "hsl(0 84% 92%)" }}>
              <XCircle size={40} style={{ color: "hsl(0 84% 60%)" }} />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Link inválido ou expirado</h1>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              Este link expirou ou já foi utilizado. Solicite uma nova redefinição de senha na tela de login.
            </p>
            <button onClick={handleGoToLogin} className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform" style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 4px 16px rgba(244,201,93,0.35)" }}>
              Voltar para o login
            </button>
          </>
        )}

        {status === "ready" && (
          <>
            <h1 className="text-xl font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Redefinir senha</h1>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Crie uma nova senha segura para sua conta.</p>

            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              {/* Email field - read-only, pre-filled from recovery session */}
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
                <input type="email" value={email} readOnly className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm outline-none opacity-70 cursor-not-allowed" style={inputStyle} />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nova senha" required className="w-full py-3.5 pl-11 pr-11 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" style={inputStyle} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff size={16} style={{ color: "hsl(var(--muted-foreground))" }} /> : <Eye size={16} style={{ color: "hsl(var(--muted-foreground))" }} />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="rounded-2xl p-3 space-y-1" style={{ background: "hsl(var(--app-cream))" }}>
                  {pwChecks.map((c) => (
                    <div key={c.label} className="flex items-center gap-2 text-xs">
                      {c.pass ? <Check size={14} className="text-green-500 shrink-0" /> : <X size={14} className="text-red-400 shrink-0" />}
                      <span style={{ color: c.pass ? "hsl(142 71% 40%)" : "hsl(0 60% 55%)" }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
                <input type={showConfirmPw ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirmar nova senha" required className="w-full py-3.5 pl-11 pr-11 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" style={inputStyle} />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showConfirmPw ? <EyeOff size={16} style={{ color: "hsl(var(--muted-foreground))" }} /> : <Eye size={16} style={{ color: "hsl(var(--muted-foreground))" }} />}
                </button>
              </div>

              {confirmPw.length > 0 && !pwMatch && (
                <p className="text-xs pl-2" style={{ color: "hsl(0 60% 55%)" }}>As senhas não coincidem.</p>
              )}

              <button type="submit" disabled={saving || !allPwValid || !pwMatch} className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform disabled:opacity-50" style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 4px 16px rgba(244,201,93,0.35)" }}>
                {saving ? "Salvando..." : "Redefinir senha"}
              </button>
            </form>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background: "hsl(142 71% 90%)" }}>
              <CheckCircle size={40} style={{ color: "hsl(142 71% 40%)" }} />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Sua senha foi redefinida com sucesso!</h1>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>Agora você já pode fazer login com sua nova senha.</p>
            <button onClick={handleGoToLogin} className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform" style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 4px 16px rgba(244,201,93,0.35)" }}>
              Ir para o login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
