import { useState, useEffect, useCallback, useMemo } from "react";
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

export type SortOption =
  | "recent"
  | "time_asc"
  | "time_desc"
  | "easy_first"
  | "age_asc";

const PAGE_SIZE = 20;

const AGE_ORDER: Record<string, number> = {
  "+6m": 6, "+7m": 7, "+8m": 8, "+9m": 9, "+10m": 10, "+12m": 12, "+18m": 18, "+24m": 24,
};

const DIFFICULTY_ORDER: Record<string, number> = {
  "Fácil": 1, "Médio": 2, "Difícil": 3, "Avançado": 4,
};

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
  const [timeRange, setTimeRange] = useState<[number, number] | null>(null);
  const [ingredientTags, setIngredientTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (ageFilter !== "Todos") count++;
    if (categoryFilter !== "Todos") count++;
    if (difficultyFilter !== "Todos") count++;
    if (timeRange) count++;
    if (ingredientTags.length > 0) count++;
    if (sortBy !== "recent") count++;
    return count;
  }, [ageFilter, categoryFilter, difficultyFilter, timeRange, ingredientTags, sortBy]);

  const clearFilters = useCallback(() => {
    setAgeFilter("Todos");
    setCategoryFilter("Todos");
    setDifficultyFilter("Todos");
    setTimeRange(null);
    setIngredientTags([]);
    setSortBy("recent");
  }, []);

  const fetchRecipes = useCallback(async (pageNum: number, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      let query = supabase
        .from("recipes")
        .select("id, name, age, difficulty, time_minutes, premium, can_freeze, can_lunchbox, category, image_url, ingredients, instructions, nutritional_tip, tags_ingredientes")
        .order("premium", { ascending: true })
        .order("name")
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      if (ageFilter !== "Todos") query = query.eq("age", ageFilter);
      if (categoryFilter !== "Todos") query = query.ilike("category", categoryFilter);
      if (difficultyFilter !== "Todos") query = query.eq("difficulty", difficultyFilter);
      if (timeRange) {
        query = query.gte("time_minutes", timeRange[0]).lte("time_minutes", timeRange[1]);
      }

      const { data, error: err } = await query;
      if (err) throw err;

      const mapped: Recipe[] = (data || []).map((r) => ({
        ...r,
        ingredients: Array.isArray(r.ingredients) ? r.ingredients as string[] : [],
      }));

      if (reset) setRecipes(mapped);
      else setRecipes((prev) => [...prev, ...mapped]);
      setHasMore(mapped.length === PAGE_SIZE);
      setPage(pageNum);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar receitas");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [ageFilter, categoryFilter, difficultyFilter, timeRange]);

  useEffect(() => {
    fetchRecipes(0, true);
  }, [fetchRecipes]);

  const loadMore = () => {
    if (!loadingMore && hasMore) fetchRecipes(page + 1);
  };

  const retry = () => fetchRecipes(0, true);

  // Client-side: search + ingredient tags + sorting
  const filtered = useMemo(() => {
    let result = recipes;

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.tags_ingredientes.some((t) => t.toLowerCase().includes(s)) ||
          r.ingredients.some((i) => typeof i === "string" && i.toLowerCase().includes(s))
      );
    }

    // Ingredient tags filter
    if (ingredientTags.length > 0) {
      result = result.filter((r) =>
        ingredientTags.every((tag) =>
          r.tags_ingredientes.some((t) => t.toLowerCase().includes(tag.toLowerCase())) ||
          r.ingredients.some((i) => typeof i === "string" && i.toLowerCase().includes(tag.toLowerCase()))
        )
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "time_asc":
          return a.time_minutes - b.time_minutes;
        case "time_desc":
          return b.time_minutes - a.time_minutes;
        case "easy_first":
          return (DIFFICULTY_ORDER[a.difficulty] || 99) - (DIFFICULTY_ORDER[b.difficulty] || 99);
        case "age_asc":
          return (AGE_ORDER[a.age] || 99) - (AGE_ORDER[b.age] || 99);
        default:
          return 0; // "recent" keeps DB order
      }
    });

    return result;
  }, [recipes, search, ingredientTags, sortBy]);

  // Extract unique ingredient tags from loaded recipes for autocomplete
  const allIngredientOptions = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => r.tags_ingredientes.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [recipes]);

  return {
    recipes: filtered,
    allRecipes: recipes,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
    search, setSearch,
    ageFilter, setAgeFilter,
    categoryFilter, setCategoryFilter,
    difficultyFilter, setDifficultyFilter,
    timeRange, setTimeRange,
    ingredientTags, setIngredientTags,
    sortBy, setSortBy,
    activeFilterCount,
    clearFilters,
    allIngredientOptions,
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
