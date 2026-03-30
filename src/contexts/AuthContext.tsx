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
    let mounted = true;
    let initialSessionRestored = false;

    // 1. Restore session from storage FIRST
    supabase.auth.getSession().then(({ data: { session: restored }, error }) => {
      if (!mounted) return;
      initialSessionRestored = true;
      if (error) {
        console.error("Auth session error, clearing stale session:", error.message);
        supabase.auth.signOut().catch(() => {});
        setSession(null);
      } else {
        setSession(restored);
      }
      setLoading(false);
    }).catch((err) => {
      if (!mounted) return;
      initialSessionRestored = true;
      console.error("Auth getSession failed:", err);
      setSession(null);
      setLoading(false);
    });

    // 2. Listen for SUBSEQUENT auth changes (sign in/out/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      // Skip the INITIAL_SESSION event — we handle it via getSession above
      if (!initialSessionRestored) return;
      setSession(session);
      setLoading(false);
    });

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth loading timeout, proceeding without session");
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
