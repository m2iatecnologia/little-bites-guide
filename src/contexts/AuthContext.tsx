import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[Auth] Initializing...");
    let settled = false;

    const settle = (s: Session | null) => {
      if (!settled) {
        settled = true;
        setSession(s);
        setLoading(false);
        console.log("[Auth] Settled:", s ? "logged in" : "logged out");
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[Auth] Event:", event);
      if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        settle(session);
        // Also update after settle
        setSession(session);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        if (!settled) settle(null);
      } else {
        // INITIAL_SESSION or other events
        settle(session);
      }
    });

    // Also try getSession as fallback
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("[Auth] getSession error:", error.message);
        // If refresh token is invalid, clear the corrupted session
        if (error.message?.includes("Failed to fetch") || 
            error.message?.includes("Invalid Refresh Token") ||
            error.message?.includes("Refresh Token Not Found")) {
          console.warn("[Auth] Clearing corrupted session");
          supabase.auth.signOut().catch(() => {});
        }
        settle(null);
        return;
      }
      settle(session);
    }).catch((e) => {
      console.error("[Auth] getSession catch:", e);
      settle(null);
    });

    // Safety timeout - never wait more than 8s for auth
    const timeout = setTimeout(() => {
      if (!settled) {
        console.warn("[Auth] Timeout - forcing loading=false");
        settle(null);
      }
    }, 8000);

    // Global unhandled rejection handler to prevent crashes
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason?.name === "AuthRetryableFetchError" || 
          reason?.message?.includes("Failed to fetch")) {
        console.warn("[Auth] Suppressed retryable fetch error");
        event.preventDefault();
        // If still loading, settle as logged out
        if (!settled) settle(null);
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("[Auth] signOut error:", e);
      // Force clear even if signOut fails
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
