import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useBaby() {
  const { user } = useAuth();
  const [baby, setBaby] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBaby = useCallback(async () => {
    if (!user) {
      setBaby(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      console.log("[Baby] Fetching...");
      const { data, error } = await supabase
        .from("babies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) console.error("[Baby] Error:", error);
      setBaby(data ?? null);
      console.log("[Baby] Loaded:", data ? data.name : "none");
    } catch (e) {
      console.error("[Baby] Catch:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBaby();
  }, [fetchBaby]);

  return { baby, loading, hasBaby: !!baby, refetch: fetchBaby };
}
