import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id: string;
  name: string;
  age: string;
  difficulty: string;
  time_minutes: number;
  category: string;
  ingredients: string[];
  instructions: string;
  nutritional_tip: string | null;
  can_freeze: boolean;
  can_lunchbox: boolean;
  tags_ingredientes: string[];
  image_url: string | null;
  premium: boolean;
}

interface Filters {
  search: string;
  age: string;
  category: string;
  difficulty: string;
}

const PAGE_SIZE = 20;

export function useRecipes(filters: Filters, isPremium: boolean) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);

  // Reset when filters change
  useEffect(() => {
    setRecipes([]);
    setPage(0);
    setHasMore(true);
  }, [filters.search, filters.age, filters.category, filters.difficulty, isPremium]);

  const fetchRecipes = useCallback(async (pageNum: number, append: boolean) => {
    if (pageNum === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      let query = supabase
        .from("recipes")
        .select("*", { count: "exact" })
        .order("name", { ascending: true })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      // If not premium, only show free recipes (limited)
      if (!isPremium) {
        query = query.eq("premium", false);
      }

      if (filters.age && filters.age !== "Todos") {
        query = query.eq("age", filters.age);
      }
      if (filters.category && filters.category !== "Todos") {
        query = query.ilike("category", filters.category);
      }
      if (filters.difficulty && filters.difficulty !== "Todos") {
        query = query.eq("difficulty", filters.difficulty);
      }
      if (filters.search) {
        // Search in name and tags
        const searchTerm = filters.search.toLowerCase();
        query = query.or(
          `name.ilike.%${searchTerm}%,tags_ingredientes.cs.{${searchTerm}}`
        );
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching recipes:", error);
        return;
      }

      const mapped: Recipe[] = (data || []).map((r: any) => ({
        ...r,
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
        tags_ingredientes: Array.isArray(r.tags_ingredientes) ? r.tags_ingredientes : [],
      }));

      if (append) {
        setRecipes(prev => [...prev, ...mapped]);
      } else {
        setRecipes(mapped);
      }

      setTotalCount(count || 0);
      setHasMore(mapped.length === PAGE_SIZE);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, isPremium]);

  // Fetch on filter/page change
  useEffect(() => {
    fetchRecipes(page, page > 0);
  }, [page, fetchRecipes]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setPage(p => p + 1);
    }
  }, [loadingMore, hasMore]);

  return { recipes, loading, loadingMore, hasMore, totalCount, loadMore };
}

export function useRecipeImage(recipeId: string | null, recipeName: string, ingredients: string[]) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recipeId) return;
    
    const generateImage = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("generate-recipe-image", {
          body: { recipe_id: recipeId, recipe_name: recipeName, ingredients },
        });
        if (data?.image_url) {
          setImageUrl(data.image_url);
        }
      } catch (e) {
        console.error("Image generation error:", e);
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, [recipeId, recipeName]);

  return { imageUrl, loading };
}
