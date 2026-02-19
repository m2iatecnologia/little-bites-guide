import { useState } from "react";
import { ShoppingCart } from "lucide-react";

type DietMode = "Tradicional" | "Vegano" | "Vegetariano" | "APLV";

const dietModes: { key: DietMode; emoji: string }[] = [
  { key: "Tradicional", emoji: "🍗" },
  { key: "Vegano", emoji: "🌱" },
  { key: "Vegetariano", emoji: "🥚" },
  { key: "APLV", emoji: "🚫🥛" },
];

const ageButtons = [
  { label: "6 meses · primeiros 30 dias", full: true },
  { label: "7 meses", full: false },
  { label: "8 meses", full: false },
  { label: "9 meses", full: false },
  { label: "10 meses", full: false },
  { label: "11 meses", full: false },
  { label: "1 ano, crianças e adultos", full: true },
  { label: "+1 ano · Lancheirinha/Passeio", full: true },
];

const mealData: Record<string, Record<string, { cafe: string[]; almoco: string[]; jantar: string[] }>> = {
  Tradicional: {
    "6 meses · primeiros 30 dias": {
      cafe: ["🍌 Banana amassada", "☕ Leite materno"],
      almoco: ["🍗 Frango desfiado", "🥕 Purê de cenoura", "🍚 Arroz papa"],
      jantar: ["🥑 Purê de abacate", "🥛 Leite materno"],
    },
    "7 meses": {
      cafe: ["🍳 Ovo mexido mole", "🍊 Laranja espremida"],
      almoco: ["🐟 Peixe cozido", "🥦 Brócolis", "🍚 Arroz"],
      jantar: ["🥣 Papa de aveia com fruta"],
    },
  },
  Vegano: {
    "6 meses · primeiros 30 dias": {
      cafe: ["🍌 Banana amassada", "🫐 Mirtilo amassado"],
      almoco: ["🫘 Feijão batido", "🥕 Purê de cenoura", "🍚 Arroz"],
      jantar: ["🥑 Creme de abacate"],
    },
  },
  Vegetariano: {
    "6 meses · primeiros 30 dias": {
      cafe: ["🍳 Ovo mexido", "🍑 Pêssego"],
      almoco: ["🫘 Lentilha", "🥦 Brócolis", "🍚 Arroz"],
      jantar: ["🧀 Cottage com fruta"],
    },
  },
  APLV: {
    "6 meses · primeiros 30 dias": {
      cafe: ["🍌 Banana", "🫐 Frutas vermelhas"],
      almoco: ["🍗 Frango", "🥕 Legumes variados", "🍚 Arroz"],
      jantar: ["🥑 Purê de abacate"],
    },
  },
};

export default function Cardapio() {
  const [diet, setDiet] = useState<DietMode>("Tradicional");
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const mealForAge = selectedAge
    ? (mealData[diet]?.[selectedAge] ?? mealData[diet]?.["6 meses · primeiros 30 dias"])
    : null;

  const shoppingList = [
    "Banana (5 unidades)", "Maçã (3 unidades)", "Cenoura (1 kg)", "Batata doce (500g)",
    "Frango (500g)", "Ovos (1 dz)", "Arroz integral (500g)", "Feijão (500g)",
    "Abobrinha (2 unidades)", "Brócolis (1 unidade)", "Aveia (400g)", "Azeite (1 frasco)",
  ];

  return (
    <div className="app-container bottom-nav-safe">
      {/* Teal header */}
      <div className="px-5 pt-6 pb-6 rounded-b-3xl"
        style={{ background: "hsl(var(--primary))" }}>
        <h1 className="text-xl font-900 text-white mb-1" style={{ fontWeight: 900 }}>Cardápios por idade</h1>
        <p className="text-white text-sm opacity-90">Escolha o cardápio na idade atual do bebê</p>

        {/* Diet mode selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {dietModes.map(({ key, emoji }) => (
            <button key={key}
              onClick={() => { setDiet(key); setSelectedAge(null); }}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-700 transition-all"
              style={{
                fontWeight: 700,
                background: diet === key ? "white" : "rgba(255,255,255,0.25)",
                color: diet === key ? "hsl(var(--primary))" : "white",
              }}>
              {emoji} {key}
            </button>
          ))}
        </div>

        {/* Age buttons */}
        <div className="mt-4 space-y-2">
          {ageButtons.map(({ label, full }) => (
            <div key={label} className={full ? "w-full" : "inline-block"}>
              {full ? (
                <button
                  onClick={() => setSelectedAge(label)}
                  className="w-full py-4 rounded-2xl font-700 text-sm transition-all"
                  style={{
                    background: selectedAge === label ? "hsl(var(--app-yellow))" : "white",
                    color: selectedAge === label ? "hsl(220 20% 15%)" : "hsl(var(--primary))",
                    fontWeight: 700,
                  }}>
                  {label}
                </button>
              ) : null}
            </div>
          ))}
          {/* Grid for small buttons */}
          <div className="grid grid-cols-2 gap-2">
            {ageButtons.filter(b => !b.full).map(({ label }) => (
              <button key={label}
                onClick={() => setSelectedAge(label)}
                className="py-4 rounded-2xl font-700 text-sm transition-all"
                style={{
                  background: selectedAge === label ? "hsl(var(--app-yellow))" : "white",
                  color: selectedAge === label ? "hsl(220 20% 15%)" : "hsl(var(--primary))",
                  fontWeight: 700,
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Shopping list button */}
          <button
            onClick={() => setSelectedAge("compras")}
            className="w-full py-4 rounded-2xl font-700 text-sm flex items-center justify-center gap-3 transition-all"
            style={{
              background: selectedAge === "compras" ? "hsl(var(--app-yellow))" : "white",
              color: selectedAge === "compras" ? "hsl(220 20% 15%)" : "hsl(220 20% 15%)",
              fontWeight: 700,
            }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--app-yellow))" }}>
              <ShoppingCart size={16} />
            </span>
            Lista Geral de Compras
          </button>
        </div>
      </div>

      {/* Meal detail */}
      {selectedAge && selectedAge !== "compras" && mealForAge && (
        <div className="px-4 mt-5 space-y-3">
          <h2 className="section-title">{selectedAge} — {diet}</h2>
          {[
            { key: "cafe", label: "☀️ Café da manhã" },
            { key: "almoco", label: "🌤️ Almoço" },
            { key: "jantar", label: "🌙 Jantar" },
          ].map(({ key, label }) => (
            <div key={key} className="card-food p-4">
              <h3 className="font-700 mb-2" style={{ fontWeight: 700 }}>{label}</h3>
              <div className="space-y-1.5">
                {(mealForAge[key as keyof typeof mealForAge] ?? []).map((item: string) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "hsl(var(--primary))" }} />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shopping list */}
      {selectedAge === "compras" && (
        <div className="px-4 mt-5">
          <h2 className="section-title">🛒 Lista Geral de Compras</h2>
          <div className="card-food p-4 space-y-2">
            {shoppingList.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0"
                style={{ borderColor: "hsl(var(--border))" }}>
                <div className="w-5 h-5 rounded border-2 flex-shrink-0"
                  style={{ borderColor: "hsl(var(--primary))" }} />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credit section */}
      <div className="px-4 mt-5 mb-4">
        <p className="text-sm font-700 mb-3" style={{ fontWeight: 700 }}>*Cardápios elaborados por</p>
        <div className="card-food p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: "hsl(var(--app-teal-light))" }}>
            👩‍⚕️
          </div>
          <div>
            <p className="font-700" style={{ fontWeight: 700 }}>Dra. Nutricionista</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Nutricionista Pediátrica · CRN3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
