import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface MealLog {
  id: string;
  food_name: string;
  meal_type: string;
  acceptance: string; // "ate" | "did_not_eat" | "tried"
  notes: string | null;
  offered_at: string;
  user_id: string;
  baby_id: string | null;
}

export function useMealLogs(date?: string) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (date) {
      query = query.eq("offered_at", date);
    }

    const { data } = await query;
    setLogs((data as MealLog[]) || []);
    setLoading(false);
  }, [user, date]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const upsertLog = async (
    foodName: string,
    mealType: string,
    acceptance: string,
    offeredAt: string,
    notes?: string
  ) => {
    if (!user) return;

    // Check if log exists for this food+meal+date
    const existing = logs.find(
      (l) => l.food_name === foodName && l.meal_type === mealType && l.offered_at === offeredAt
    );

    if (existing) {
      const { error } = await supabase
        .from("food_logs")
        .update({ acceptance, notes: notes || null })
        .eq("id", existing.id);
      if (!error) {
        setLogs((prev) =>
          prev.map((l) => (l.id === existing.id ? { ...l, acceptance, notes: notes || null } : l))
        );
      }
      return !error;
    } else {
      const { data, error } = await supabase
        .from("food_logs")
        .insert({
          user_id: user.id,
          food_name: foodName,
          meal_type: mealType,
          acceptance,
          offered_at: offeredAt,
          notes: notes || null,
        })
        .select()
        .single();
      if (!error && data) {
        setLogs((prev) => [data as MealLog, ...prev]);
      }
      return !error;
    }
  };

  return { logs, loading, upsertLog, refetch: fetchLogs };
}

export function useAllMealLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("offered_at", { ascending: false })
      .then(({ data }) => {
        setLogs((data as MealLog[]) || []);
        setLoading(false);
      });
  }, [user]);

  return { logs, loading };
}
