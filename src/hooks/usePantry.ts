import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBaby } from "@/hooks/useBaby";

export function usePantry() {
  const { user } = useAuth();
  const { baby } = useBaby();
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchPantry = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("user_pantry" as any)
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setSelectedFoods((data as any).foods || []);
      setLastUpdated((data as any).updated_at);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPantry();
  }, [fetchPantry]);

  const savePantry = useCallback(async (foods: string[]) => {
    if (!user) return false;
    setSaving(true);

    // Try upsert
    const { error } = await supabase
      .from("user_pantry" as any)
      .upsert({
        user_id: user.id,
        baby_id: baby?.id || null,
        foods,
        updated_at: new Date().toISOString(),
      } as any, { onConflict: "user_id,baby_id" });

    setSaving(false);
    if (!error) {
      setSelectedFoods(foods);
      setLastUpdated(new Date().toISOString());
      return true;
    }
    return false;
  }, [user, baby]);

  return { selectedFoods, loading, saving, lastUpdated, savePantry, refetch: fetchPantry };
}
