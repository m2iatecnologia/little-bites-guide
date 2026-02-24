import { useState } from "react";
import { Star, Heart, Crown, X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FoodImage } from "@/components/FoodImage";
import { recipes } from "@/data/appData";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumBadge } from "@/components/PremiumGate";

const ageFilters = ["Todos", "+6m", "+8m", "+9m", "+12m"];
const dietFilters = ["Tradicional", "Vegetariano", "Vegano"];

const allRecipes = [
  ...recipes,
  {
    id: 5, name: "Smoothie de Frutas", image: "morango", age: "+8m", difficulty: "Fácil",
    time: "5 min", rating: 4.6, premium: false, canFreeze: false,
    ingredients: ["1 banana", "1 xíc. morango", "Leite materno"],
    instructions: "Bata tudo no liquidificador.", diet: "vegetariano",
  },
  {
    id: 6, name: "Bolo de Banana Integral", image: "banana", age: "+12m", difficulty: "Médio",
    time: "45 min", rating: 4.8, premium: true, canFreeze: true,
    ingredients: ["3 bananas", "2 ovos", "2 xíc. farinha integral", "Mel"],
    instructions: "Amasse bananas, misture ovos e farinha. Asse 180°C por 35 min.", diet: "vegetariano",
  },
];

function RecipeDetail({ recipe, onClose }: { recipe: typeof allRecipes[0]; onClose: () => void }) {
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
      <div className="p-5 space-y-4 pb-24">
        <div className="flex items-start justify-between">
          <h2 className="text-xl flex-1" style={{ fontWeight: 900 }}>{recipe.name}</h2>
          <Heart size={22} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
        </div>
        <div className="flex gap-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span>⏱️ {recipe.time}</span>
          <span>⭐ {recipe.rating}</span>
          {recipe.canFreeze && <span>❄️ Pode congelar</span>}
        </div>
        {recipe.premium && (
          <div className="p-3 rounded-xl text-sm font-bold text-center"
            style={{ background: "hsl(var(--app-yellow))", fontWeight: 700, color: "hsl(var(--app-brown))" }}>
            👑 Receita Premium — Faça upgrade para ver
          </div>
        )}
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

export default function Receitas() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const [selectedAge, setSelectedAge] = useState("Todos");
  const [selectedDiet, setSelectedDiet] = useState("Tradicional");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<typeof allRecipes[0] | null>(null);

  const handleSelectRecipe = (recipe: typeof allRecipes[0]) => {
    if (recipe.premium && !isPremium) {
      navigate("/planos");
      return;
    }
    setSelected(recipe);
  };

  const filtered = allRecipes.filter(r =>
    (selectedAge === "Todos" || r.age === selectedAge)
  );

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  if (selected) return <RecipeDetail recipe={selected} onClose={() => setSelected(null)} />;

  return (
    <div className="app-container bottom-nav-safe">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl mb-4" style={{ fontWeight: 900 }}>
          +650 <span style={{ color: "hsl(var(--app-yellow-highlight))" }}>Receitas</span>
        </h1>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {ageFilters.map(f => (
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

        <div className="flex gap-2">
          {dietFilters.map(d => (
            <button key={d} onClick={() => setSelectedDiet(d)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
              style={{
                fontWeight: 700,
                background: selectedDiet === d ? "hsl(var(--app-yellow))" : "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                boxShadow: "0 1px 4px rgba(92,75,59,0.06)",
              }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(recipe => (
            <button key={recipe.id} onClick={() => handleSelectRecipe(recipe)}
              className="card-food flex flex-col overflow-hidden text-left transition-all active:scale-95 relative">
              <div className="relative aspect-[4/3]">
                <FoodImage
                  name={recipe.image}
                  className={`w-full h-full object-cover ${recipe.premium && !isPremium ? "blur-[2px]" : ""}`}
                  alt={recipe.name}
                />
                {recipe.premium && !isPremium && (
                  <div className="absolute top-2 right-2">
                    <PremiumBadge />
                  </div>
                )}
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
                    <Heart size={14}
                      style={{
                        fill: favorites.includes(recipe.id) ? "hsl(var(--destructive))" : "none",
                        color: favorites.includes(recipe.id) ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))",
                      }} />
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Premium CTA */}
        <div className="mt-6 p-5 rounded-2xl text-center space-y-3"
          style={{ background: "hsl(var(--app-yellow-dark))" }}>
          <p className="font-extrabold text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-brown))" }}>+600 receitas esperando! 🍽️</p>
          <p className="text-sm" style={{ color: "hsl(var(--app-brown-light))" }}>7 dias grátis. Cancele quando quiser.</p>
          <div className="flex gap-2">
            <div className="flex-1 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.5)" }}>
              <p className="text-xs font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-brown))" }}>⭐ Anual</p>
              <p className="font-extrabold text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-brown))" }}>R$ 83,90</p>
              <p className="text-xs" style={{ color: "hsl(var(--app-brown-light))" }}>/ano</p>
            </div>
            <div className="flex-1 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.5)" }}>
              <p className="text-xs font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-brown))" }}>Mensal</p>
              <p className="font-extrabold text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-brown))" }}>R$ 10,90</p>
              <p className="text-xs" style={{ color: "hsl(var(--app-brown-light))" }}>/mês</p>
            </div>
          </div>
          <button onClick={() => navigate("/em-desenvolvimento")}
            className="w-full py-3 rounded-xl font-extrabold text-sm transition-all active:scale-95"
            style={{ background: "white", color: "hsl(var(--app-brown))", fontWeight: 900 }}>
            🎁 Experimentar grátis por 7 dias
          </button>
        </div>
      </div>
    </div>
  );
}
