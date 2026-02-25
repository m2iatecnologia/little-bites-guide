import { useState } from "react";
import { Search, SlidersHorizontal, X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FoodImage } from "@/components/FoodImage";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumBadge } from "@/components/PremiumGate";
import { PremiumCTA } from "@/components/PremiumCTA";
import { premiumFoods, freeFoods, foodCategories, type PremiumFood } from "@/data/premiumFoods";

function FoodDetail({ food, onClose }: { food: PremiumFood; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "hsl(var(--background))", maxWidth: "28rem", margin: "0 auto" }}>
      <div className="relative h-56">
        <FoodImage name={food.image} className="w-full h-full object-cover" alt={food.name} />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <X size={18} color="white" />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="age-tag text-sm px-3 py-1">{food.age}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <h2 className="text-2xl" style={{ fontWeight: 900 }}>{food.name}</h2>
        {[
          { label: "✂️ Como oferecer", value: food.howToOffer },
          { label: "🍽️ Textura ideal", value: food.texture },
          { label: "⚠️ Atenções", value: food.attention },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))" }}>
            <p className="font-bold text-sm mb-1" style={{ fontWeight: 700 }}>{label}</p>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{value}</p>
          </div>
        ))}
        <div className="flex gap-3">
          <div className="flex-1 p-3 rounded-2xl text-center" style={{ background: food.canFreeze ? "hsl(var(--app-yellow) / 0.3)" : "hsl(var(--muted))" }}>
            <p className="text-lg">{food.canFreeze ? "✅" : "❌"}</p>
            <p className="text-xs font-bold" style={{ fontWeight: 700 }}>Pode congelar</p>
          </div>
          <div className="flex-1 p-3 rounded-2xl text-center" style={{ background: food.canLunchbox ? "hsl(var(--app-yellow) / 0.3)" : "hsl(var(--muted))" }}>
            <p className="text-lg">{food.canLunchbox ? "✅" : "❌"}</p>
            <p className="text-xs font-bold" style={{ fontWeight: 700 }}>Lancheira</p>
          </div>
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
          Assine para acessar +1.000 alimentos e recursos exclusivos.
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

function FoodCard({ food, isPremiumItem, onClick }: { food: PremiumFood; isPremiumItem: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 text-left transition-all active:scale-95">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <FoodImage name={food.image} className={`w-full h-full object-cover ${isPremiumItem ? "blur-[2px] opacity-70" : ""}`} alt={food.name} />
        <span className="age-tag absolute bottom-2 left-2">{food.age}</span>
        {isPremiumItem && (
          <div className="absolute top-2 right-2">
            <PremiumBadge />
          </div>
        )}
      </div>
      <span className="text-sm font-semibold text-center w-full" style={{ fontWeight: 600 }}>{food.name}</span>
    </button>
  );
}

export default function Alimentos() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<PremiumFood | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const visibleFoods = isPremium ? premiumFoods : freeFoods;

  const filtered = visibleFoods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "Todos" || f.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // For free users, show a few "locked" preview items
  const lockedPreview = !isPremium ? premiumFoods.slice(12, 18) : [];

  const handleFoodClick = (food: PremiumFood, isLocked: boolean) => {
    if (isLocked) {
      setShowPremiumModal(true);
      return;
    }
    setSelectedFood(food);
  };

  if (selectedFood) return <FoodDetail food={selectedFood} onClose={() => setSelectedFood(null)} />;

  return (
    <div className="app-container bottom-nav-safe">
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-xl mb-1" style={{ fontWeight: 900 }}>
          {isPremium ? "+1.000" : ""} Alimentos <span style={{ color: "hsl(var(--app-yellow-highlight))" }}>• Como oferecer</span>
        </h1>
        {!isPremium && (
          <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            Mostrando preview — assine para acessar todos os alimentos
          </p>
        )}

        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ background: "hsl(var(--card))", boxShadow: "0 2px 8px rgba(92,75,59,0.06)" }}>
            <Search size={18} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar alimento..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ fontFamily: "Nunito, sans-serif" }}
            />
          </div>
          <button onClick={() => setShowFilter(!showFilter)}
            className="px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all active:scale-95"
            style={{ background: "hsl(var(--card))", color: "hsl(var(--app-yellow-highlight))", fontWeight: 700, boxShadow: "0 2px 8px rgba(92,75,59,0.06)" }}>
            <SlidersHorizontal size={16} />
            Filtrar
          </button>
        </div>

        {showFilter && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {foodCategories.map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                style={{
                  fontWeight: 700,
                  background: activeCategory === cat ? "hsl(var(--app-yellow-dark))" : "hsl(var(--card))",
                  color: activeCategory === cat ? "hsl(var(--app-brown))" : "hsl(var(--foreground))",
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 space-y-5">
        {search || activeCategory !== "Todos" ? (
          <div>
            <h2 className="section-title">Resultados ({filtered.length})</h2>
            <div className="grid grid-cols-3 gap-3">
              {filtered.map(f => <FoodCard key={f.id} food={f} isPremiumItem={false} onClick={() => handleFoodClick(f, false)} />)}
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="section-title">{isPremium ? "Todos os alimentos" : "Top alimentos da semana"}</h2>
              <div className="grid grid-cols-3 gap-3">
                {filtered.slice(0, isPremium ? undefined : 6).map(f => (
                  <FoodCard key={f.id} food={f} isPremiumItem={false} onClick={() => handleFoodClick(f, false)} />
                ))}
              </div>
            </div>

            {!isPremium && lockedPreview.length > 0 && (
              <div>
                <h2 className="section-title">Mais alimentos 🔒</h2>
                <div className="grid grid-cols-3 gap-3">
                  {lockedPreview.map(f => (
                    <FoodCard key={f.id} food={f} isPremiumItem={true} onClick={() => handleFoodClick(f, true)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!isPremium && <PremiumCTA />}
      </div>
    </div>
  );
}
