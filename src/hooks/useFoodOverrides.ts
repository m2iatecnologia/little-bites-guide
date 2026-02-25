import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FoodOverride {
  id: string;
  food_name: string;
  category: string;
  status: string;
  user_id: string;
}

export function useFoodOverrides() {
  const { user } = useAuth();
  const [overrides, setOverrides] = useState<FoodOverride[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverrides = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("food_status_overrides")
        .select("*")
        .eq("user_id", user.id);
      if (error) console.error("[FoodOverrides] Error:", error);
      setOverrides((data as FoodOverride[]) || []);
    } catch (e) {
      console.error("[FoodOverrides] Catch:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOverrides();
  }, [fetchOverrides]);

  const upsertOverride = async (foodName: string, category: string, status: string) => {
    if (!user) return false;
    const { error } = await supabase
      .from("food_status_overrides")
      .upsert(
        { user_id: user.id, food_name: foodName, category, status },
        { onConflict: "user_id,food_name" }
      );
    if (!error) await fetchOverrides();
    return !error;
  };

  const deleteOverride = async (foodName: string) => {
    if (!user) return false;
    const { error } = await supabase
      .from("food_status_overrides")
      .delete()
      .eq("user_id", user.id)
      .eq("food_name", foodName);
    if (!error) await fetchOverrides();
    return !error;
  };

  return { overrides, loading, upsertOverride, deleteOverride, refetch: fetchOverrides };
}
