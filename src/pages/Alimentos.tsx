import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { FoodImage } from "@/components/FoodImage";
import { foods } from "@/data/appData";

const categories = ["Todos", "Fruta", "Legume", "Proteína", "Grão"];
const ages = ["Todos", "+6m", "+7m", "+8m", "+9m"];

const allFoods = [
  ...foods,
  { id: 7, name: "Beterraba", image: "cenoura", age: "+6m", category: "legume", howToOffer: "Cozinhe e corte em palitos.", texture: "Macia.", attention: "Pode tingir fezes.", canFreeze: true, canLunchbox: true },
  { id: 8, name: "Brócolis", image: "abobrinha", age: "+6m", category: "legume", howToOffer: "Cozinhe no vapor, buquês.", texture: "Firme mas macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { id: 9, name: "Manga", image: "morango", age: "+6m", category: "fruta", howToOffer: "Tiras ou cubos maduros.", texture: "Macia e suculenta.", attention: "Pode causar alergia.", canFreeze: true, canLunchbox: true },
  { id: 10, name: "Pêssego", image: "morango", age: "+6m", category: "fruta", howToOffer: "Fatias sem casca.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { id: 11, name: "Figo", image: "abacate", age: "+6m", category: "fruta", howToOffer: "Aberto ao meio.", texture: "Macia e doce.", attention: "Sem restrições.", canFreeze: false, canLunchbox: true },
  { id: 12, name: "Abóbora", image: "cenoura", age: "+6m", category: "legume", howToOffer: "Assada ou cozida em cubos.", texture: "Bem macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
];

const weeklyFoods = allFoods.slice(0, 3);
const seasonFruits = allFoods.filter(f => f.category === "fruta").slice(0, 3);
const seasonVegs = allFoods.filter(f => f.category === "legume").slice(0, 3);

interface FoodDetailProps {
  food: typeof allFoods[0];
  onClose: () => void;
}

function FoodDetail({ food, onClose }: FoodDetailProps) {
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
        <h2 className="text-2xl font-900" style={{ fontWeight: 900 }}>{food.name}</h2>
        {[
          { label: "✂️ Como oferecer", value: food.howToOffer },
          { label: "🍽️ Textura ideal", value: food.texture },
          { label: "⚠️ Atenções", value: food.attention },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))" }}>
            <p className="font-700 text-sm mb-1" style={{ fontWeight: 700 }}>{label}</p>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{value}</p>
          </div>
        ))}
        <div className="flex gap-3">
          <div className="flex-1 p-3 rounded-2xl text-center" style={{ background: food.canFreeze ? "hsl(var(--app-teal-light))" : "hsl(var(--muted))" }}>
            <p className="text-lg">{food.canFreeze ? "✅" : "❌"}</p>
            <p className="text-xs font-700" style={{ fontWeight: 700 }}>Pode congelar</p>
          </div>
          <div className="flex-1 p-3 rounded-2xl text-center" style={{ background: food.canLunchbox ? "hsl(var(--app-teal-light))" : "hsl(var(--muted))" }}>
            <p className="text-lg">{food.canLunchbox ? "✅" : "❌"}</p>
            <p className="text-xs font-700" style={{ fontWeight: 700 }}>Lancheira</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FoodCard({ food, onClick }: { food: typeof allFoods[0]; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 text-left">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden"
        style={{ background: "hsl(var(--muted))" }}>
        <FoodImage name={food.image} className="w-full h-full object-cover" alt={food.name} />
        <span className="age-tag absolute bottom-2 left-2">{food.age}</span>
      </div>
      <span className="text-sm font-600 text-center w-full" style={{ fontWeight: 600 }}>{food.name}</span>
    </button>
  );
}

export default function Alimentos() {
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<typeof allFoods[0] | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered = allFoods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "Todos" || f.category === activeCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  if (selectedFood) return <FoodDetail food={selectedFood} onClose={() => setSelectedFood(null)} />;

  return (
    <div className="app-container bottom-nav-safe">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-xl font-900 mb-4" style={{ fontWeight: 900 }}>
          Alimentos <span style={{ color: "hsl(var(--primary))" }}>• Como oferecer</span>
        </h1>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ background: "hsl(var(--card))", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <Search size={18} style={{ color: "hsl(var(--primary))" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar alimento..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ fontFamily: "Nunito, sans-serif" }}
            />
          </div>
          <button onClick={() => setShowFilter(!showFilter)}
            className="px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-700"
            style={{ background: "hsl(var(--card))", color: "hsl(var(--primary))", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <SlidersHorizontal size={16} />
            Filtrar
          </button>
        </div>

        {/* Category filter */}
        {showFilter && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-700 transition-all"
                style={{
                  fontWeight: 700,
                  background: activeCategory === cat ? "hsl(var(--primary))" : "hsl(var(--card))",
                  color: activeCategory === cat ? "white" : "hsl(var(--foreground))",
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
              {filtered.map(f => <FoodCard key={f.id} food={f} onClick={() => setSelectedFood(f)} />)}
            </div>
          </div>
        ) : (
          <>
            {/* Alimentos da semana */}
            <div>
              <h2 className="section-title">Alimentos da semana</h2>
              <div className="grid grid-cols-3 gap-3">
                {weeklyFoods.map(f => <FoodCard key={f.id} food={f} onClick={() => setSelectedFood(f)} />)}
              </div>
            </div>
            {/* Frutas da estação */}
            <div>
              <h2 className="section-title">Frutas da estação</h2>
              <div className="grid grid-cols-3 gap-3">
                {seasonFruits.map(f => <FoodCard key={f.id} food={f} onClick={() => setSelectedFood(f)} />)}
              </div>
            </div>
            {/* Legumes e verduras */}
            <div>
              <h2 className="section-title">Legumes e verduras da estação</h2>
              <div className="grid grid-cols-3 gap-3">
                {seasonVegs.map(f => <FoodCard key={f.id} food={f} onClick={() => setSelectedFood(f)} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
