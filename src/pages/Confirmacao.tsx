import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import nutrooLogo from "@/assets/nutroo-logo-full.png";
import { supabase } from "@/integrations/supabase/client";

export default function Confirmacao() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const hash = window.location.hash;
    
    // If this is a recovery link, redirect to the password reset page
    if (hash.includes("type=recovery")) {
      navigate(`/redefinir-senha${hash}`, { replace: true });
      return;
    }

    const checkConfirmation = async () => {
      await new Promise((r) => setTimeout(r, 1500));
      
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check auth state change for recovery event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          subscription.unsubscribe();
          navigate(`/redefinir-senha`, { replace: true });
        }
      });
      
      if (session) {
        // Update profile status to active
        await supabase
          .from("profiles")
          .update({ status: "active" })
          .eq("user_id", session.user.id);
        
        // Sign out so user logs in fresh
        await supabase.auth.signOut();
        setStatus("success");
      } else {
        if (hash.includes("error")) {
          setStatus("error");
        } else {
          setTimeout(async () => {
            const { data: { session: s2 } } = await supabase.auth.getSession();
            if (s2) {
              await supabase
                .from("profiles")
                .update({ status: "active" })
                .eq("user_id", s2.user.id);
              await supabase.auth.signOut();
              setStatus("success");
            } else {
              setStatus("error");
            }
          }, 2000);
        }
      }
      
      return () => subscription.unsubscribe();
    };

    checkConfirmation();
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ background: "hsl(var(--app-cream))" }}
    >
      <div className="w-full max-w-sm text-center space-y-6">
        <img
          src={nutrooLogo}
          alt="Nutroo"
          className="w-40 mx-auto mb-2 object-contain"
        />

        {status === "loading" && (
          <>
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
              style={{ background: "hsl(var(--app-gold-light))" }}
            >
              <Loader2
                size={36}
                className="animate-spin"
                style={{ color: "hsl(var(--app-petrol))" }}
              />
            </div>
            <h1
              className="text-xl font-bold"
              style={{ color: "hsl(var(--app-petrol))" }}
            >
              Confirmando seu email...
            </h1>
            <p
              className="text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Aguarde um momento enquanto validamos seu cadastro.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
              style={{ background: "hsl(142 71% 90%)" }}
            >
              <CheckCircle size={40} style={{ color: "hsl(142 71% 40%)" }} />
            </div>
            <h1
              className="text-xl font-bold"
              style={{ color: "hsl(var(--app-petrol))" }}
            >
              Validação realizada com sucesso!
            </h1>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Agora você já pode fazer login e começar a usar a Nutroo.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform"
              style={{
                background: "hsl(var(--app-gold))",
                color: "hsl(var(--app-petrol))",
                boxShadow: "0 4px 16px rgba(244,201,93,0.35)",
              }}
            >
              Ir para o login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
              style={{ background: "hsl(0 84% 92%)" }}
            >
              <XCircle size={40} style={{ color: "hsl(0 84% 60%)" }} />
            </div>
            <h1
              className="text-xl font-bold"
              style={{ color: "hsl(var(--app-petrol))" }}
            >
              Erro na confirmação
            </h1>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              O link de confirmação pode ter expirado ou já foi utilizado.
              Tente fazer login e solicitar um novo email de confirmação.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform"
              style={{
                background: "hsl(var(--app-gold))",
                color: "hsl(var(--app-petrol))",
                boxShadow: "0 4px 16px rgba(244,201,93,0.35)",
              }}
            >
              Voltar para o login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
