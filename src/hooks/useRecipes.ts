import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id: string;
  name: string;
  age: string;
  difficulty: string;
  time_minutes: number;
  premium: boolean;
  can_freeze: boolean;
  can_lunchbox: boolean;
  category: string;
  image_url: string | null;
  ingredients: string[];
  instructions: string;
  nutritional_tip: string | null;
  tags_ingredientes: string[];
}

const PAGE_SIZE = 20;

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [difficultyFilter, setDifficultyFilter] = useState("Todos");

  const fetchRecipes = useCallback(async (pageNum: number, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      let query = supabase
        .from("recipes")
        .select("id, name, age, difficulty, time_minutes, premium, can_freeze, can_lunchbox, category, image_url, ingredients, instructions, nutritional_tip, tags_ingredientes")
        .order("premium", { ascending: true })
        .order("name")
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      if (ageFilter !== "Todos") {
        query = query.eq("age", ageFilter);
      }
      if (categoryFilter !== "Todos") {
        query = query.ilike("category", categoryFilter);
      }
      if (difficultyFilter !== "Todos") {
        query = query.eq("difficulty", difficultyFilter);
      }

      const { data, error: err } = await query;
      if (err) throw err;

      const mapped: Recipe[] = (data || []).map((r) => ({
        ...r,
        ingredients: Array.isArray(r.ingredients) ? r.ingredients as string[] : [],
      }));

      if (reset) {
        setRecipes(mapped);
      } else {
        setRecipes((prev) => [...prev, ...mapped]);
      }
      setHasMore(mapped.length === PAGE_SIZE);
      setPage(pageNum);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar receitas");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [ageFilter, categoryFilter, difficultyFilter]);

  // Reset on filter change
  useEffect(() => {
    fetchRecipes(0, true);
  }, [fetchRecipes]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchRecipes(page + 1);
    }
  };

  const retry = () => fetchRecipes(0, true);

  // Client-side search filter (search by name + ingredients)
  const filtered = search
    ? recipes.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.tags_ingredientes.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
          r.ingredients.some((i) => typeof i === "string" && i.toLowerCase().includes(search.toLowerCase()))
      )
    : recipes;

  return {
    recipes: filtered,
    allRecipes: recipes,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
    search,
    setSearch,
    ageFilter,
    setAgeFilter,
    categoryFilter,
    setCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
  };
}

export function useRecipeById(id: string | undefined) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setRecipe({
            ...data,
            ingredients: Array.isArray(data.ingredients) ? data.ingredients as string[] : [],
          });
        }
        setLoading(false);
      });
  }, [id]);

  return { recipe, loading };
}
