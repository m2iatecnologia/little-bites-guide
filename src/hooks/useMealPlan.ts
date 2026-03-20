import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBaby } from "@/hooks/useBaby";

export interface MealItem {
  name: string;
  emoji: string;
  group: string;
}

export interface DayPlan {
  cafe: MealItem[];
  almoco: MealItem[];
  jantar: MealItem[];
  lanche: MealItem[];
}

export type WeekPlan = Record<number, DayPlan>; // 0-6
export type PlanType = "automatic" | "personalized";

function getWeekStart(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return monday.toISOString().split("T")[0];
}

export function useMealPlan() {
  const { user } = useAuth();
  const { baby } = useBaby();
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [dietMode, setDietMode] = useState<string>("Tradicional");
  const [planType, setPlanType] = useState<PlanType>("automatic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const weekStart = getWeekStart();

  const fetchPlan = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("meal_plans" as any)
      .select("*")
      .eq("user_id", user.id)
      .eq("week_start", weekStart)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      const d = data as any;
      setPlan(d.plan as WeekPlan);
      setDietMode(d.diet_mode || "Tradicional");
      // Extract plan type from diet_mode field (format: "diet|type")
      if (d.diet_mode && d.diet_mode.includes("|")) {
        const [dm, pt] = d.diet_mode.split("|");
        setDietMode(dm);
        setPlanType(pt as PlanType);
      } else {
        setDietMode(d.diet_mode || "Tradicional");
        setPlanType("automatic");
      }
    } else {
      setPlan(null);
    }
    setLoading(false);
  }, [user, weekStart]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const savePlan = useCallback(async (weekPlan: WeekPlan, diet: string, type: PlanType = "automatic") => {
    if (!user) return false;
    setSaving(true);

    // Encode plan type in diet_mode to avoid schema change
    const storedDietMode = `${diet}|${type}`;

    const { error } = await supabase
      .from("meal_plans" as any)
      .insert({
        user_id: user.id,
        baby_id: baby?.id || null,
        week_start: weekStart,
        plan: weekPlan as any,
        diet_mode: storedDietMode,
      } as any);

    setSaving(false);
    if (!error) {
      setPlan(weekPlan);
      setDietMode(diet);
      setPlanType(type);
      return true;
    }
    return false;
  }, [user, baby, weekStart]);

  const clearPlan = useCallback(() => {
    setPlan(null);
  }, []);

  return { plan, dietMode, planType, loading, saving, weekStart, savePlan, clearPlan, refetch: fetchPlan };
}
