import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Mail, Lock, User, Eye, EyeOff, Phone, Check, X, Shield, MailCheck } from "lucide-react";
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

/* ── Email validation ── */
const ALLOWED_DOMAINS = [
  "gmail.com", "googlemail.com",
  "hotmail.com", "hotmail.com.br", "outlook.com", "outlook.com.br", "live.com", "msn.com",
  "yahoo.com", "yahoo.com.br",
  "icloud.com", "me.com", "mac.com",
  "protonmail.com", "proton.me",
  "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "globo.com",
  "aol.com", "zoho.com", "yandex.com",
];

const BLOCKED_DOMAINS = [
  "teste.com", "test.com", "example.com", "example.org", "example.net",
  "email.com", "fake.com", "noemail.com", "none.com",
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "tempmail.com",
  "throwaway.email", "sharklasers.com", "guerrillamailblock.com",
  "grr.la", "dispostable.com", "yopmail.com", "yopmail.fr",
  "trashmail.com", "trashmail.net", "temp-mail.org", "fakeinbox.com",
  "mailnesia.com", "maildrop.cc", "discard.email", "getnada.com",
  "tmail.com", "tmpmail.net", "10minutemail.com",
];

function validateEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Formato de email inválido.";
  }
  const domain = trimmed.split("@")[1];
  if (BLOCKED_DOMAINS.includes(domain)) {
    return "Este domínio de email não é permitido. Use um email real.";
  }
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return "Use um provedor de email válido (Gmail, Hotmail, Outlook, Yahoo, iCloud, etc.)";
  }
  return null;
}

/* ── Password rules ── */
const pwRules = [
  { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "1 letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 número", test: (p: string) => /\d/.test(p) },
  { label: "1 caractere especial", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

/* ── Terms of Use content ── */
const SUPPORT_EMAIL = "suportem2ia@gmail.com";

const termsContent = [
  {
    icon: "🔒",
    title: "Isenção de Responsabilidade Médica",
    text: "O aplicativo Nutroo tem caráter exclusivamente educativo e informativo. Ele NÃO substitui consultas médicas, pediátricas ou nutricionais. Todas as informações, sugestões de alimentos, cardápios e orientações disponibilizadas são de natureza genérica e não configuram prescrição ou diagnóstico. O usuário é integralmente responsável pelas decisões alimentares tomadas para seu bebê e deve sempre consultar um profissional de saúde qualificado."
  },
  {
    icon: "⚠️",
    title: "Alergias e Riscos Alimentares",
    text: "O Nutroo não se responsabiliza por reações alérgicas, intolerâncias alimentares ou quaisquer efeitos adversos decorrentes da introdução de alimentos. Cada bebê pode reagir de forma diferente a determinados alimentos. É responsabilidade exclusiva dos pais ou responsáveis verificar a adequação de cada alimento antes de oferecê-lo, observar possíveis reações e buscar orientação médica quando necessário."
  },
  {
    icon: "🤖",
    title: "Uso de Inteligência Artificial",
    text: "Algumas recomendações, cardápios e conteúdos do aplicativo podem ser gerados ou auxiliados por tecnologias de Inteligência Artificial. Embora nos esforcemos para garantir a qualidade e precisão das informações, podem existir limitações, imprecisões ou desatualizações. O usuário deve utilizar as sugestões com bom senso e discernimento, complementando sempre com orientação profissional."
  },
  {
    icon: "👶",
    title: "Responsabilidade do Responsável Legal",
    text: "O uso do aplicativo é de inteira responsabilidade dos pais ou responsáveis legais do bebê. O Nutroo não garante resultados específicos na introdução alimentar. Os resultados dependem de diversos fatores individuais de cada criança. Ao utilizar o aplicativo, o usuário reconhece e aceita que as decisões finais sobre alimentação são exclusivamente suas."
  },
  {
    icon: "📊",
    title: "Dados e Privacidade",
    text: "Os dados fornecidos pelo usuário podem ser armazenados e utilizados para melhorar a experiência dentro do aplicativo, personalizar conteúdos e aprimorar funcionalidades. Respeitamos a privacidade do usuário e nos comprometemos a não compartilhar informações pessoais com terceiros sem consentimento, exceto quando exigido por lei."
  },
  {
    icon: "🚫",
    title: "Limitação de Responsabilidade",
    text: "Em nenhuma hipótese o Nutroo, seus desenvolvedores, colaboradores ou parceiros serão responsáveis por danos diretos, indiretos, incidentais, consequenciais ou especiais decorrentes do uso ou impossibilidade de uso do aplicativo. Isso inclui, sem limitação, problemas de saúde, decisões alimentares tomadas com base nas recomendações do app, perda de dados ou interrupção de serviço."
  },
  {
    icon: "🔄",
    title: "Atualizações e Modificações",
    text: "O Nutroo reserva-se o direito de atualizar, modificar ou descontinuar conteúdos, funcionalidades e termos a qualquer momento, sem aviso prévio. O uso contínuo do aplicativo após eventuais alterações implica aceitação automática dos novos termos."
  },
  {
    icon: "📧",
    title: "Contato e Suporte",
    text: `Em caso de dúvidas, sugestões ou reclamações, entre em contato com nossa equipe pelo email: ${SUPPORT_EMAIL}. Faremos o possível para atendê-lo da melhor forma.`
  },
];

/* ── Terms Modal ── */
function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div
        className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl overflow-hidden"
        style={{ background: "hsl(var(--app-card))" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "hsl(var(--app-divider))" }}>
          <div className="flex items-center gap-2">
            <Shield size={20} style={{ color: "hsl(var(--app-gold-dark))" }} />
            <h2 className="text-lg font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Termos de Uso</h2>
          </div>
          <button onClick={onClose} className="text-sm font-semibold px-3 py-1 rounded-xl" style={{ color: "hsl(var(--app-petrol))", background: "hsl(var(--app-cream))" }}>
            Fechar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            Última atualização: Março de 2026. Ao criar sua conta e utilizar o aplicativo Nutroo, você declara ter lido, compreendido e aceitado integralmente os termos abaixo.
          </p>

          {termsContent.map((section, i) => (
            <div key={i} className="space-y-1.5">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "hsl(var(--app-petrol))" }}>
                <span>{section.icon}</span> {section.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                {section.text}
              </p>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t" style={{ borderColor: "hsl(var(--app-divider))" }}>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))" }}
          >
            Entendi e aceito
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
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
      const emailError = validateEmail(email);
      if (emailError) return toast.error(emailError);
      if (!acceptedTerms) return toast.error("É necessário aceitar os termos para continuar.");
      if (!allPwValid) return toast.error("A senha não atende todos os requisitos.");
      if (!pwMatch) return toast.error("As senhas não coincidem.");
      if (!isPhoneValid(phone)) return toast.error("Número de celular inválido.");
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, phone: phone.replace(/\D/g, "") },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        if (data.session) {
          toast.success("Conta criada com sucesso!");
          navigate("/");
        } else {
          toast.success("Conta criada! Faça login para continuar.");
          setMode("login");
          setEmail(email);
          setPassword("");
          setConfirmPw("");
        }
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
          {mode === "signup" && (
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" required className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" style={inputStyle} />
            </div>
          )}

          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" style={inputStyle} />
          </div>

          {mode === "signup" && (
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input type="tel" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} placeholder="(00) 00000-0000" required className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" style={inputStyle} />
            </div>
          )}

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required className="w-full py-3.5 pl-11 pr-11 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" style={inputStyle} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2">
              {showPw ? <EyeOff size={16} style={{ color: "hsl(var(--muted-foreground))" }} /> : <Eye size={16} style={{ color: "hsl(var(--muted-foreground))" }} />}
            </button>
          </div>

          {mode === "signup" && password.length > 0 && (
            <div className="rounded-2xl p-3 space-y-1" style={{ background: "hsl(var(--app-cream))" }}>
              {pwChecks.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-xs">
                  {c.pass ? <Check size={14} className="text-green-500 shrink-0" /> : <X size={14} className="text-red-400 shrink-0" />}
                  <span style={{ color: c.pass ? "hsl(142 71% 40%)" : "hsl(0 60% 55%)" }}>{c.label}</span>
                </div>
              ))}
            </div>
          )}

          {mode === "signup" && (
            <>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
                <input type={showConfirmPw ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirmar senha" required className="w-full py-3.5 pl-11 pr-11 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" style={inputStyle} />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showConfirmPw ? <EyeOff size={16} style={{ color: "hsl(var(--muted-foreground))" }} /> : <Eye size={16} style={{ color: "hsl(var(--muted-foreground))" }} />}
                </button>
              </div>
              {confirmPw.length > 0 && !pwMatch && (
                <p className="text-xs pl-2" style={{ color: "hsl(0 60% 55%)" }}>As senhas não coincidem.</p>
              )}

              {/* Terms checkbox */}
              <div className="flex items-start gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    borderColor: acceptedTerms ? "hsl(var(--app-gold-dark))" : "hsl(var(--app-divider))",
                    background: acceptedTerms ? "hsl(var(--app-gold))" : "transparent",
                  }}
                >
                  {acceptedTerms && <Check size={13} style={{ color: "hsl(var(--app-petrol))" }} />}
                </button>
                <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Li e aceito os{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="font-bold underline"
                    style={{ color: "hsl(var(--app-petrol))" }}
                  >
                    Termos de Uso
                  </button>
                </p>
              </div>
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
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setPassword(""); setConfirmPw(""); setAcceptedTerms(false); }}
            className="font-bold underline"
            style={{ color: "hsl(var(--app-petrol))" }}
          >
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>

      {/* Terms modal */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}
