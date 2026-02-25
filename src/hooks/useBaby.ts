import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useBaby() {
  const { user } = useAuth();
  const [baby, setBaby] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setBaby(null); setLoading(false); return; }
    setLoading(true);
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from("babies")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) console.error("useBaby error:", error);
        setBaby(data ?? null);
      } catch (e) {
        console.error("useBaby catch:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  return { baby, loading, hasBaby: !!baby };
}
