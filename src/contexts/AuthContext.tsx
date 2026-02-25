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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[Auth] State changed:", _event, session ? "logged in" : "logged out");
      setSession(session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error("[Auth] getSession error:", error);
      console.log("[Auth] Session loaded:", session ? "exists" : "none");
      setSession(session);
      setLoading(false);
    }).catch((e) => {
      console.error("[Auth] getSession catch:", e);
      setLoading(false);
    });

    // Safety timeout - auth should never take more than 8s
    const timeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) console.warn("[Auth] Timeout - forcing loading=false");
        return false;
      });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
