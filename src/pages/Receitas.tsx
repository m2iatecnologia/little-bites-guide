import { useRef, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Lock, Crown, Clock, Snowflake, AlertCircle, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useRecipes, type Recipe } from "@/hooks/useRecipes";
import { useBaby } from "@/hooks/useBaby";
import { Skeleton } from "@/components/ui/skeleton";
import RecipeFilterModal, { type FilterState } from "@/components/RecipeFilterModal";

const FREE_LIMIT = 5;

function RecipeCardSkeleton() {
  return (
    <div className="card-food flex flex-col overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-2.5 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function RecipeCard({ recipe, locked, onClick }: { recipe: Recipe; locked: boolean; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = recipe.image_url && !recipe.image_url.startsWith("data:") && !imgError;

  return (
    <button
      onClick={onClick}
      className="card-food flex flex-col overflow-hidden text-left transition-all active:scale-95 relative"
    >
      <div className="relative aspect-[4/3]">
        {hasImage ? (
          <img
            src={recipe.image_url!}
            alt={recipe.name}
            className={`w-full h-full object-cover ${locked ? "blur-[2px] opacity-60" : ""}`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-4xl ${locked ? "blur-[2px] opacity-60" : ""}`}
            style={{ background: "hsl(var(--muted))" }}
          >
            🍽️
          </div>
        )}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
              style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
            >
              <Lock size={10} /> Premium
            </div>
          </div>
        )}
        {!locked && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            <span className="age-tag">{recipe.age}</span>
            <span className="age-tag">{recipe.difficulty}</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs leading-tight mb-1" style={{ fontWeight: 700 }}>
          {recipe.name}
        </p>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span className="flex items-center gap-0.5">
            <Clock size={10} /> {recipe.time_minutes}min
          </span>
          {recipe.can_freeze && (
            <span className="flex items-center gap-0.5">
              <Snowflake size={10} /> Congela
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function Receitas() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { baby } = useBaby();
  const [filterOpen, setFilterOpen] = useState(false);
  const {
    recipes, loading, loadingMore, error, hasMore, loadMore, retry,
    search, setSearch,
    ageFilter, setAgeFilter,
    categoryFilter, setCategoryFilter,
    difficultyFilter, setDifficultyFilter,
    timeRange, setTimeRange,
    ingredientTags, setIngredientTags,
    sortBy, setSortBy,
    activeFilterCount, clearFilters,
    allIngredientOptions,
  } = useRecipes();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMore]);

  const babyAgeMonths = baby?.birth_date
    ? Math.floor((Date.now() - new Date(baby.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : null;

  const handleCardClick = (recipe: Recipe, index: number) => {
    const locked = !isPremium && recipe.premium && index >= FREE_LIMIT;
    if (locked) { navigate("/planos"); return; }
    navigate(`/receitas/${recipe.id}`);
  };

  const handleApplyFilters = (state: FilterState) => {
    setAgeFilter(state.ageFilter);
    setCategoryFilter(state.categoryFilter);
    setDifficultyFilter(state.difficultyFilter);
    setTimeRange(state.timeRange);
    setIngredientTags(state.ingredientTags);
    setSortBy(state.sortBy);
  };

  return (
    <div className="app-container bottom-nav-safe">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl mb-0.5" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
          +100 <span style={{ color: "hsl(var(--app-gold-dark))" }}>Receitas</span>
        </h1>
        <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
          Receitas para introdução alimentar
          {babyAgeMonths !== null && ` · ${babyAgeMonths} meses`}
        </p>

        {/* Search + Filter button */}
        <div className="flex gap-2 mb-3">
          <div
            className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ background: "hsl(var(--card))", boxShadow: "0 2px 8px rgba(92,75,59,0.06)" }}
          >
            <Search size={18} style={{ color: "hsl(var(--app-gold-dark))" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar receita ou ingrediente..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ fontFamily: "Nunito, sans-serif" }}
            />
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className="relative flex items-center gap-1.5 px-3.5 py-3 rounded-2xl text-xs transition-all active:scale-95"
            style={{
              background: activeFilterCount > 0
                ? "linear-gradient(135deg, hsl(var(--app-gold)), hsl(var(--app-gold-dark)))"
                : "hsl(var(--card))",
              color: activeFilterCount > 0 ? "hsl(var(--app-petrol))" : "hsl(var(--foreground))",
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(92,75,59,0.06)",
            }}
          >
            <SlidersHorizontal size={16} />
            Filtrar
            {activeFilterCount > 0 && (
              <span
                className="ml-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                style={{ background: "hsl(var(--app-petrol))", color: "white", fontWeight: 800 }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="px-4 py-10 flex flex-col items-center gap-3 text-center">
          <AlertCircle size={32} style={{ color: "hsl(var(--destructive))" }} />
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{error}</p>
          <button
            onClick={retry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
          >
            <RefreshCw size={14} /> Tentar novamente
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && !error && (
        <div className="px-4 grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Recipe grid */}
      {!loading && !error && (
        <div className="px-4">
          {recipes.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                Nenhuma receita encontrada para esses filtros.
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-3 px-5 py-2 rounded-xl text-sm"
                  style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {recipes.map((recipe, index) => {
                  const locked = !isPremium && recipe.premium && index >= FREE_LIMIT;
                  return (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      locked={locked}
                      onClick={() => handleCardClick(recipe, index)}
                    />
                  );
                })}
              </div>

              <div ref={sentinelRef} className="h-4" />

              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div
                    className="w-7 h-7 rounded-full border-3 border-t-transparent animate-spin"
                    style={{ borderColor: "hsl(var(--app-gold))", borderTopColor: "transparent" }}
                  />
                </div>
              )}

              {!hasMore && recipes.length > 0 && (
                <p className="text-center text-xs py-4" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Todas as receitas carregadas ✨
                </p>
              )}
            </>
          )}

          {!isPremium && (
            <div className="mt-5 mb-4">
              <button
                onClick={() => navigate("/planos")}
                className="w-full py-4 rounded-2xl text-center transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--app-gold)), hsl(var(--app-gold-dark)))",
                  color: "hsl(var(--app-petrol))",
                  fontWeight: 800,
                  boxShadow: "0 4px 16px rgba(244,201,93,0.35)",
                }}
              >
                🔒 Desbloqueie +100 receitas · Assinar Premium
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter Modal */}
      <RecipeFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        ageFilter={ageFilter}
        categoryFilter={categoryFilter}
        difficultyFilter={difficultyFilter}
        timeRange={timeRange}
        ingredientTags={ingredientTags}
        sortBy={sortBy}
        allIngredientOptions={allIngredientOptions}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
