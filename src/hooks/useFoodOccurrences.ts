import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBaby } from "@/hooks/useBaby";
import { toast } from "sonner";

export interface FoodOccurrence {
  id: string;
  user_id: string;
  baby_id: string | null;
  food_name: string;
  occurrence_date: string;
  meal_type: string | null;
  reaction_type: string;
  reaction_other_text: string | null;
  time_after_value: number;
  time_after_unit: string;
  intensity: string | null;
  notes: string | null;
  created_at: string;
}

export function useFoodOccurrences() {
  const { user } = useAuth();
  const { baby } = useBaby();
  const [occurrences, setOccurrences] = useState<FoodOccurrence[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOccurrences = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("food_occurrences")
      .select("*")
      .eq("user_id", user.id)
      .order("occurrence_date", { ascending: false });

    if (!error && data) setOccurrences(data as FoodOccurrence[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchOccurrences();
  }, [user]);

  const addOccurrence = async (occ: {
    food_name: string;
    occurrence_date: string;
    meal_type?: string;
    reaction_type: string;
    reaction_other_text?: string;
    time_after_value: number;
    time_after_unit: string;
    intensity?: string;
    notes?: string;
  }): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from("food_occurrences").insert({
      user_id: user.id,
      baby_id: baby?.id ?? null,
      food_name: occ.food_name,
      occurrence_date: occ.occurrence_date,
      meal_type: occ.meal_type ?? null,
      reaction_type: occ.reaction_type,
      reaction_other_text: occ.reaction_other_text ?? null,
      time_after_value: occ.time_after_value,
      time_after_unit: occ.time_after_unit,
      intensity: occ.intensity ?? null,
      notes: occ.notes ?? null,
    } as any);
    if (error) {
      toast.error("Erro ao salvar ocorrência.");
      return false;
    }
    await fetchOccurrences();
    return true;
  };

  const getOccurrencesByFood = (foodName: string) =>
    occurrences.filter((o) => o.food_name === foodName);

  return { occurrences, loading, addOccurrence, getOccurrencesByFood };
}
