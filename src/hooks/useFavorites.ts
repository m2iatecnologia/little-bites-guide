import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      const { data } = await supabase
        .from("recipe_favorites" as any)
        .select("recipe_id")
        .eq("user_id", user.id);

      if (data) {
        setFavoriteIds(new Set((data as any[]).map((d) => d.recipe_id)));
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = useCallback(
    async (recipeId: string) => {
      if (!user) return;

      const isFav = favoriteIds.has(recipeId);

      // Optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) next.delete(recipeId);
        else next.add(recipeId);
        return next;
      });

      if (isFav) {
        await supabase
          .from("recipe_favorites" as any)
          .delete()
          .eq("user_id", user.id)
          .eq("recipe_id", recipeId);
      } else {
        await supabase
          .from("recipe_favorites" as any)
          .insert({ user_id: user.id, recipe_id: recipeId } as any);
      }
    },
    [user, favoriteIds]
  );

  const isFavorite = useCallback(
    (recipeId: string) => favoriteIds.has(recipeId),
    [favoriteIds]
  );

  return { favoriteIds, isFavorite, toggleFavorite, loading };
}
