import { useState, useRef, useCallback, useEffect } from "react";
import { Search, X, Lock, Crown, Clock, Snowflake, Backpack, ChefHat, Star, Filter, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumCTA } from "@/components/PremiumCTA";
import { useBaby } from "@/hooks/useBaby";
import { useRecipes, useRecipeImage, type Recipe } from "@/hooks/useRecipes";
import { Skeleton } from "@/components/ui/skeleton";

const AGE_FILTERS = ["Todos", "+6m", "+7m", "+8m", "+9m", "+10m", "+12m", "1 ano+"];
const CATEGORY_FILTERS = ["Todos", "café da manhã", "almoço", "jantar", "lanche", "sobremesa", "lanchinho para passeio"];
const DIFFICULTY_FILTERS = ["Todos", "Fácil", "Médio", "Avançado"];

const categoryEmoji: Record<string, string> = {
  "café da manhã": "☀️",
  "almoço": "🍽️",
  "jantar": "🌙",
  "lanche": "🍎",
  "sobremesa": "🍨",
  "lanchinho para passeio": "🎒",
};

const difficultyColor: Record<string, string> = {
  "Fácil": "hsl(var(--app-gold-light))",
  "Médio": "hsl(43, 88%, 72%)",
  "Avançado": "hsl(25, 70%, 60%)",
};

function RecipeImage({ recipe }: { recipe: Recipe }) {
  const { imageUrl, loading } = useRecipeImage(recipe.id, recipe.name, recipe.ingredients);

  if (loading || !imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center text-4xl"
        style={{ background: "hsl(var(--app-cream-dark))" }}>
        {categoryEmoji[recipe.category] || "🍽️"}
      </div>
    );
  }

  return <img src={imageUrl} alt={recipe.name} className="w-full h-full object-cover" loading="lazy" />;
}

function RecipeCardSkeleton() {
  return (
    <div className="card-food flex flex-col overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onClick, isLocked }: { recipe: Recipe; onClick: () => void; isLocked: boolean }) {
  return (
    <button onClick={onClick}
      className="card-food flex flex-col overflow-hidden text-left transition-all active:scale-[0.97] relative">
      <div className="relative aspect-[4/3]">
        {isLocked ? (
          <div className="w-full h-full flex items-center justify-center text-4xl blur-[2px] opacity-60"
            style={{ background: "hsl(var(--app-cream-dark))" }}>
            {categoryEmoji[recipe.category] || "🍽️"}
          </div>
        ) : (
          <RecipeImage recipe={recipe} />
        )}
        {isLocked && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}>
            <Lock size={10} /> Premium
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex gap-1">
          <span className="age-tag">{recipe.age}</span>
        </div>
      </div>
      <div className="p-2.5 flex flex-col gap-1">
        <p className="text-xs font-bold leading-tight line-clamp-2" style={{ fontWeight: 700 }}>{recipe.name}</p>
        <div className="flex items-center gap-2 text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span className="flex items-center gap-0.5">
            <Clock size={10} /> {recipe.time_minutes} min
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
            style={{ background: difficultyColor[recipe.difficulty] || "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </button>
  );
}

function RecipeDetail({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const { imageUrl, loading: imgLoading } = useRecipeImage(recipe.id, recipe.name, recipe.ingredients);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
      style={{ background: "hsl(var(--background))", maxWidth: "28rem", margin: "0 auto" }}>
      {/* Header image */}
      <div className="relative h-56 flex-shrink-0" style={{ background: "hsl(var(--app-cream-dark))" }}>
        {imageUrl ? (
          <img src={imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {categoryEmoji[recipe.category] || "🍽️"}
          </div>
        )}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <X size={18} color="white" />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="age-tag">{recipe.age}</span>
          <span className="age-tag">{recipe.difficulty}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 pb-28">
        <h2 className="text-xl" style={{ fontWeight: 900 }}>{recipe.name}</h2>

        {/* Quick info */}
        <div className="flex flex-wrap gap-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span className="flex items-center gap-1"><Clock size={14} /> {recipe.time_minutes} min</span>
          {recipe.can_freeze && <span className="flex items-center gap-1"><Snowflake size={14} /> Pode congelar</span>}
          {recipe.can_lunchbox && <span className="flex items-center gap-1"><Backpack size={14} /> Lancheira</span>}
        </div>

        {/* Ingredients */}
        <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontWeight: 700 }}>
            🥕 Ingredientes
          </h3>
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: "hsl(var(--app-yellow-highlight))" }} />
              <span className="text-sm">{ing}</span>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontWeight: 700 }}>
            👩‍🍳 Modo de Preparo
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            {recipe.instructions}
          </p>
        </div>

        {/* Nutritional tip */}
        {recipe.nutritional_tip && (
          <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--app-gold-light))" }}>
            <h3 className="font-bold mb-2 flex items-center gap-2" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
              🧠 Dica Nutricional
            </h3>
            <p className="text-sm" style={{ color: "hsl(var(--app-petrol))" }}>
              {recipe.nutritional_tip}
            </p>
          </div>
        )}

        {/* Tags */}
        {recipe.tags_ingredientes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags_ingredientes.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: "hsl(var(--app-cream-dark))", color: "hsl(var(--muted-foreground))" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PremiumModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="mx-6 p-6 rounded-2xl text-center space-y-4 max-w-sm w-full"
        style={{ background: "hsl(var(--background))" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "hsl(var(--app-gold-light))" }}>
          <Lock size={28} style={{ color: "hsl(var(--app-petrol))" }} />
        </div>
        <h3 className="text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
          Conteúdo Premium
        </h3>
        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Assine para acessar +1.000 receitas exclusivas com instruções detalhadas.
        </p>
        <button onClick={() => navigate("/planos")}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}>
          💛 Desbloquear +1.000 receitas
        </button>
        <button onClick={onClose} className="w-full py-2 text-sm"
          style={{ color: "hsl(var(--muted-foreground))" }}>Fechar</button>
      </div>
    </div>
  );
}

export default function Receitas() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { baby } = useBaby();
  const [search, setSearch] = useState("");
  const [selectedAge, setSelectedAge] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const filters = { search, age: selectedAge, category: selectedCategory, difficulty: selectedDifficulty };
  const { recipes, loading, loadingMore, hasMore, totalCount, loadMore } = useRecipes(filters, isPremium);

  // Infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMore();
      }
    }, { threshold: 0.1 });
    observerRef.current.observe(node);
  }, [hasMore, loadingMore, loadMore]);

  const babyAgeMonths = baby?.birth_date
    ? Math.floor((Date.now() - new Date(baby.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : null;

  const handleSelectRecipe = (recipe: Recipe) => {
    if (recipe.premium && !isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setSelected(recipe);
  };

  if (selected) return <RecipeDetail recipe={selected} onClose={() => setSelected(null)} />;

  return (
    <div className="app-container bottom-nav-safe">
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}

      <div className="px-4 pt-6 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl" style={{ fontWeight: 900 }}>
            <span style={{ color: "hsl(var(--app-yellow-highlight))" }}>Receitas</span>
          </h1>
          {totalCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}>
              {totalCount} receitas
            </span>
          )}
        </div>
        {babyAgeMonths !== null && (
          <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            Sugestões para {babyAgeMonths} meses
          </p>
        )}

        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-3"
          style={{ background: "hsl(var(--card))", boxShadow: "0 2px 8px rgba(92,75,59,0.06)" }}>
          <Search size={18} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar receita ou ingrediente..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ fontFamily: "Nunito, sans-serif" }} />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
            </button>
          )}
        </div>

        {/* Age filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
          {AGE_FILTERS.map(f => (
            <button key={f} onClick={() => setSelectedAge(f)}
              className="flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
              style={{
                fontWeight: 700,
                background: selectedAge === f ? "hsl(var(--app-yellow-dark))" : "hsl(var(--card))",
                color: selectedAge === f ? "hsl(var(--app-brown))" : "hsl(var(--foreground))",
                boxShadow: "0 1px 4px rgba(92,75,59,0.06)",
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Category + filters toggle */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide">
            {CATEGORY_FILTERS.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95"
                style={{
                  fontWeight: 700,
                  background: selectedCategory === c ? "hsl(var(--app-yellow))" : "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  boxShadow: "0 1px 4px rgba(92,75,59,0.04)",
                }}>
                {c === "Todos" ? "Todos" : `${categoryEmoji[c] || ""} ${c.charAt(0).toUpperCase() + c.slice(1)}`}
              </button>
            ))}
          </div>
          <button onClick={() => setShowFilters(v => !v)}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: showFilters ? "hsl(var(--app-yellow-dark))" : "hsl(var(--card))",
              boxShadow: "0 1px 4px rgba(92,75,59,0.06)",
            }}>
            <Filter size={16} style={{ color: showFilters ? "hsl(var(--app-petrol))" : "hsl(var(--muted-foreground))" }} />
          </button>
        </div>

        {/* Difficulty filter (collapsible) */}
        {showFilters && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            <span className="text-[10px] flex-shrink-0 self-center" style={{ color: "hsl(var(--muted-foreground))" }}>
              Dificuldade:
            </span>
            {DIFFICULTY_FILTERS.map(d => (
              <button key={d} onClick={() => setSelectedDifficulty(d)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95"
                style={{
                  fontWeight: 700,
                  background: selectedDifficulty === d
                    ? (difficultyColor[d] || "hsl(var(--app-yellow))")
                    : "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                }}>
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat size={40} className="mx-auto mb-3" style={{ color: "hsl(var(--muted-foreground))" }} />
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Nenhuma receita encontrada.
            </p>
            <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              Tente ajustar os filtros.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe}
                  onClick={() => handleSelectRecipe(recipe)}
                  isLocked={recipe.premium && !isPremium} />
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-10 flex items-center justify-center mt-4">
              {loadingMore && (
                <Loader2 size={20} className="animate-spin" style={{ color: "hsl(var(--app-yellow-highlight))" }} />
              )}
            </div>
          </>
        )}

        {/* Premium CTA for free users */}
        {!isPremium && recipes.length > 0 && (
          <div className="mt-6">
            <PremiumCTA />
          </div>
        )}
      </div>
    </div>
  );
}
