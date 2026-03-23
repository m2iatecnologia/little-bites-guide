import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Mail, Lock, User, Eye, EyeOff, Phone, Check, X } from "lucide-react";
import nutrooLogo from "@/assets/nutroo-logo-full.png";
import { toast } from "sonner";

/* ── Phone mask ── */
function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function isPhoneValid(v: string) {
  return v.replace(/\D/g, "").length === 11;
}

/* ── Password rules ── */
const pwRules = [
  { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "1 letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 número", test: (p: string) => /\d/.test(p) },
  { label: "1 caractere especial", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  const pwChecks = useMemo(() => pwRules.map((r) => ({ ...r, pass: r.test(password) })), [password]);
  const allPwValid = pwChecks.every((c) => c.pass);
  const pwMatch = password === confirmPw && confirmPw.length > 0;

  const inputStyle: React.CSSProperties = {
    background: "hsl(var(--app-card))",
    border: "1.5px solid hsl(var(--app-divider))",
    color: "hsl(var(--app-petrol))",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      if (!allPwValid) return toast.error("A senha não atende todos os requisitos.");
      if (!pwMatch) return toast.error("As senhas não coincidem.");
      if (!isPhoneValid(phone)) return toast.error("Número de celular inválido.");
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, phone: phone.replace(/\D/g, "") },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        // Save phone to profile (trigger creates profile, we update phone)
        // We'll do this after confirmation via webhook/trigger, but attempt update
        setSignupEmail(email);
        setShowEmailModal(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
    } catch (err: any) {
      toast.error(err.message || "Erro com Google");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmedEmail = async () => {
    setShowEmailModal(false);
    toast.success("Cadastro confirmado! Faça login para continuar.");
    setMode("login");
    setEmail(signupEmail);
    setPassword("");
  };

  /* ── Email confirmation modal ── */
  if (showEmailModal) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "hsl(var(--app-cream))" }}>
        <div
          className="w-full max-w-sm rounded-3xl p-8 text-center space-y-5"
          style={{ background: "hsl(var(--app-card))", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "hsl(var(--app-gold) / 0.2)" }}>
            <Mail size={28} style={{ color: "hsl(var(--app-gold-dark))" }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Confirme seu email</h2>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            Enviamos um email para <strong style={{ color: "hsl(var(--app-petrol))" }}>{signupEmail}</strong>.
            <br />Confirme seu cadastro clicando no link enviado para continuar.
          </p>
          <button
            onClick={handleConfirmedEmail}
            className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 4px 16px rgba(244,201,93,0.35)" }}
          >
            Já confirmei meu email
          </button>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Não recebeu? Verifique sua caixa de spam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10" style={{ background: "hsl(var(--app-cream))" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={nutrooLogo} alt="Nutroo - Introdução Alimentar" className="w-44 mx-auto mb-1 object-contain" />
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {mode === "login" ? "Entre na sua conta" : "Crie sua conta gratuita"}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 mb-4 active:scale-95 transition-transform"
          style={{ ...inputStyle }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continuar com Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "hsl(var(--app-divider))" }} />
          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>ou</span>
          <div className="flex-1 h-px" style={{ background: "hsl(var(--app-divider))" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          {mode === "signup" && (
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                required
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                style={inputStyle}
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              style={inputStyle}
            />
          </div>

          {/* Phone */}
          {mode === "signup" && (
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                required
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                style={inputStyle}
              />
            </div>
          )}

          {/* Password */}
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              className="w-full py-3.5 pl-11 pr-11 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              style={inputStyle}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2">
              {showPw ? <EyeOff size={16} style={{ color: "hsl(var(--muted-foreground))" }} /> : <Eye size={16} style={{ color: "hsl(var(--muted-foreground))" }} />}
            </button>
          </div>

          {/* Password checklist */}
          {mode === "signup" && password.length > 0 && (
            <div className="rounded-2xl p-3 space-y-1" style={{ background: "hsl(var(--app-cream))" }}>
              {pwChecks.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-xs">
                  {c.pass ? (
                    <Check size={14} className="text-green-500 shrink-0" />
                  ) : (
                    <X size={14} className="text-red-400 shrink-0" />
                  )}
                  <span style={{ color: c.pass ? "hsl(142 71% 40%)" : "hsl(0 60% 55%)" }}>{c.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Confirm password */}
          {mode === "signup" && (
            <>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
                <input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Confirmar senha"
                  required
                  className="w-full py-3.5 pl-11 pr-11 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  style={inputStyle}
                />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showConfirmPw ? <EyeOff size={16} style={{ color: "hsl(var(--muted-foreground))" }} /> : <Eye size={16} style={{ color: "hsl(var(--muted-foreground))" }} />}
                </button>
              </div>
              {confirmPw.length > 0 && !pwMatch && (
                <p className="text-xs pl-2" style={{ color: "hsl(0 60% 55%)" }}>As senhas não coincidem.</p>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform disabled:opacity-50"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 4px 16px rgba(244,201,93,0.35)" }}
          >
            {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "hsl(var(--muted-foreground))" }}>
          {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setPassword(""); setConfirmPw(""); }}
            className="font-bold underline"
            style={{ color: "hsl(var(--app-petrol))" }}
          >
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
