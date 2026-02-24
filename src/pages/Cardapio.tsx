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
      {/* Header */}
      <div className="px-5 pt-6 pb-6 rounded-b-3xl"
        style={{ background: "hsl(var(--app-yellow-dark))" }}>
        <h1 className="text-xl text-white mb-1" style={{ fontWeight: 900, color: "hsl(var(--app-brown))" }}>Cardápios por idade</h1>
        <p className="text-sm" style={{ color: "hsl(var(--app-brown-light))" }}>Escolha o cardápio na idade atual do bebê</p>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {dietModes.map(({ key, emoji }) => (
            <button key={key}
              onClick={() => { setDiet(key); setSelectedAge(null); }}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
              style={{
                fontWeight: 700,
                background: diet === key ? "white" : "rgba(255,255,255,0.4)",
                color: diet === key ? "hsl(var(--app-brown))" : "hsl(var(--app-brown))",
              }}>
              {emoji} {key}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {ageButtons.filter(b => b.full).map(({ label }) => (
            <button key={label}
              onClick={() => setSelectedAge(label)}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: selectedAge === label ? "hsl(var(--app-yellow))" : "white",
                color: "hsl(var(--app-brown))",
                fontWeight: 700,
              }}>
              {label}
            </button>
          ))}
          <div className="grid grid-cols-2 gap-2">
            {ageButtons.filter(b => !b.full).map(({ label }) => (
              <button key={label}
                onClick={() => setSelectedAge(label)}
                className="py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{
                  background: selectedAge === label ? "hsl(var(--app-yellow))" : "white",
                  color: "hsl(var(--app-brown))",
                  fontWeight: 700,
                }}>
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedAge("compras")}
            className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95"
            style={{
              background: selectedAge === "compras" ? "hsl(var(--app-yellow))" : "white",
              color: "hsl(var(--app-brown))",
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

      {selectedAge && selectedAge !== "compras" && mealForAge && (
        <div className="px-4 mt-5 space-y-3">
          <h2 className="section-title">{selectedAge} — {diet}</h2>
          {[
            { key: "cafe", label: "☀️ Café da manhã" },
            { key: "almoco", label: "🌤️ Almoço" },
            { key: "jantar", label: "🌙 Jantar" },
          ].map(({ key, label }) => (
            <div key={key} className="card-food p-4">
              <h3 className="font-bold mb-2" style={{ fontWeight: 700 }}>{label}</h3>
              <div className="space-y-1.5">
                {(mealForAge[key as keyof typeof mealForAge] ?? []).map((item: string) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "hsl(var(--app-yellow-highlight))" }} />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAge === "compras" && (
        <div className="px-4 mt-5">
          <h2 className="section-title">🛒 Lista Geral de Compras</h2>
          <div className="card-food p-4 space-y-2">
            {shoppingList.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0"
                style={{ borderColor: "hsl(var(--border))" }}>
                <div className="w-5 h-5 rounded border-2 flex-shrink-0"
                  style={{ borderColor: "hsl(var(--app-yellow-highlight))" }} />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 mt-5 mb-4">
        <p className="text-sm font-bold mb-3" style={{ fontWeight: 700 }}>*Cardápios elaborados por</p>
        <div className="card-food p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: "hsl(var(--app-yellow) / 0.3)" }}>
            👩‍⚕️
          </div>
          <div>
            <p className="font-bold" style={{ fontWeight: 700 }}>Dra. Nutricionista</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Nutricionista Pediátrica · CRN3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
