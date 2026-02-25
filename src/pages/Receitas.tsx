import { useState } from "react";
import { Star, Heart, Crown, X, Lock, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FoodImage } from "@/components/FoodImage";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumBadge } from "@/components/PremiumGate";
import { PremiumCTA } from "@/components/PremiumCTA";
import { premiumRecipes, freeRecipes, recipeCategories, recipeAgeFilters, type PremiumRecipe } from "@/data/premiumRecipes";
import { useBaby } from "@/hooks/useBaby";

function RecipeDetail({ recipe, onClose }: { recipe: PremiumRecipe; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto" style={{ background: "hsl(var(--background))", maxWidth: "28rem", margin: "0 auto" }}>
      <div className="relative h-56 flex-shrink-0">
        <FoodImage name={recipe.image} className="w-full h-full object-cover" alt={recipe.name} />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <X size={18} color="white" />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-1">
          <span className="age-tag">{recipe.age}</span>
          <span className="age-tag">{recipe.difficulty}</span>
        </div>
      </div>
      <div className="p-5 space-y-4 pb-28">
        <div className="flex items-start justify-between">
          <h2 className="text-xl flex-1" style={{ fontWeight: 900 }}>{recipe.name}</h2>
          <Heart size={22} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
        </div>
        <div className="flex gap-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span>⏱️ {recipe.time}</span>
          <span>⭐ {recipe.rating}</span>
          {recipe.canFreeze && <span>❄️ Pode congelar</span>}
        </div>
        <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-bold mb-2" style={{ fontWeight: 700 }}>Ingredientes</h3>
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--app-yellow-highlight))" }} />
              <span className="text-sm">{ing}</span>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-bold mb-2" style={{ fontWeight: 700 }}>Modo de preparo</h3>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{recipe.instructions}</p>
        </div>
      </div>
    </div>
  );
}

function PremiumModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="mx-6 p-6 rounded-2xl text-center space-y-4 max-w-sm w-full"
        style={{ background: "hsl(var(--background))" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "hsl(var(--app-gold-light))" }}>
          <Lock size={28} style={{ color: "hsl(var(--app-petrol))" }} />
        </div>
        <h3 className="text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>Conteúdo Premium</h3>
        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Assine para acessar +1.000 receitas e recursos exclusivos.
        </p>
        <button
          onClick={() => navigate("/planos")}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
        >
          Ver planos
        </button>
        <button onClick={onClose} className="w-full py-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default function Receitas() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { baby } = useBaby();
  const [selectedAge, setSelectedAge] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<PremiumRecipe | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Auto-suggest age filter based on baby age
  const babyAgeMonths = baby?.birth_date
    ? Math.floor((Date.now() - new Date(baby.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : null;

  const visibleRecipes = isPremium ? premiumRecipes : freeRecipes;

  const filtered = visibleRecipes.filter(r => {
    const matchesAge = selectedAge === "Todos" || r.age === selectedAge;
    const matchesCat = selectedCategory === "Todos" || r.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.ingredients.some(i => i.toLowerCase().includes(search.toLowerCase()));
    return matchesAge && matchesCat && matchesSearch;
  });

  // Locked previews for free users
  const lockedPreview = !isPremium ? premiumRecipes.filter(r => r.premium).slice(0, 4) : [];

  const handleSelectRecipe = (recipe: PremiumRecipe, isLocked: boolean) => {
    if (isLocked || (recipe.premium && !isPremium)) {
      setShowPremiumModal(true);
      return;
    }
    setSelected(recipe);
  };

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  if (selected) return <RecipeDetail recipe={selected} onClose={() => setSelected(null)} />;

  return (
    <div className="app-container bottom-nav-safe">
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl mb-1" style={{ fontWeight: 900 }}>
          {isPremium ? "+1.000" : "+650"} <span style={{ color: "hsl(var(--app-yellow-highlight))" }}>Receitas</span>
        </h1>
        {babyAgeMonths !== null && (
          <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            Sugestões para {babyAgeMonths} meses
          </p>
        )}

        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-3"
          style={{ background: "hsl(var(--card))", boxShadow: "0 2px 8px rgba(92,75,59,0.06)" }}>
          <Search size={18} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar receita ou ingrediente..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>

        {/* Age filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {recipeAgeFilters.map(f => (
            <button key={f} onClick={() => setSelectedAge(f)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
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

        {/* Category filters */}
        {isPremium && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recipeCategories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                style={{
                  fontWeight: 700,
                  background: selectedCategory === c ? "hsl(var(--app-yellow))" : "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  boxShadow: "0 1px 4px rgba(92,75,59,0.06)",
                }}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(recipe => (
            <button key={recipe.id} onClick={() => handleSelectRecipe(recipe, false)}
              className="card-food flex flex-col overflow-hidden text-left transition-all active:scale-95 relative">
              <div className="relative aspect-[4/3]">
                <FoodImage name={recipe.image} className="w-full h-full object-cover" alt={recipe.name} />
                {recipe.premium && isPremium && (
                  <div className="absolute top-2 right-2">
                    <Crown size={16} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <span className="age-tag">{recipe.age}</span>
                  <span className="age-tag">{recipe.difficulty}</span>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-bold leading-tight mb-1" style={{ fontWeight: 700 }}>{recipe.name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={11} style={{ fill: "hsl(var(--app-yellow-highlight))", color: "hsl(var(--app-yellow-highlight))" }} />
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{recipe.rating}</span>
                  </div>
                  <button onClick={e => toggleFav(recipe.id, e)}>
                    <Heart size={14} style={{
                      fill: favorites.includes(recipe.id) ? "hsl(var(--destructive))" : "none",
                      color: favorites.includes(recipe.id) ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))",
                    }} />
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Locked previews for free users */}
        {!isPremium && lockedPreview.length > 0 && (
          <>
            <h2 className="section-title mt-5">Receitas Premium 🔒</h2>
            <div className="grid grid-cols-2 gap-3">
              {lockedPreview.map(recipe => (
                <button key={recipe.id} onClick={() => handleSelectRecipe(recipe, true)}
                  className="card-food flex flex-col overflow-hidden text-left transition-all active:scale-95 relative">
                  <div className="relative aspect-[4/3]">
                    <FoodImage name={recipe.image} className="w-full h-full object-cover blur-[2px] opacity-70" alt={recipe.name} />
                    <div className="absolute top-2 right-2">
                      <PremiumBadge />
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <span className="age-tag">{recipe.age}</span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold leading-tight mb-1" style={{ fontWeight: 700 }}>{recipe.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        {!isPremium && <PremiumCTA />}
      </div>
    </div>
  );
}
