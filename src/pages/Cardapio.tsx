import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PremiumGate } from "@/components/PremiumGate";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  BookOpen,
  RefreshCw,
  Check,
  Leaf,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

type DietMode = "Tradicional" | "Vegetariano" | "Vegano";

const dietModes: { key: DietMode; emoji: string }[] = [
  { key: "Tradicional", emoji: "🍗" },
  { key: "Vegetariano", emoji: "🥚" },
  { key: "Vegano", emoji: "🌱" },
];

const weekdays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

interface Meal {
  name: string;
  emoji: string;
  group: string; // Fruta, Legume, Proteína, Grão
}

interface DayPlan {
  cafe: Meal[];
  almoco: Meal[];
  jantar: Meal[];
  lanche?: Meal[];
}

const generateWeekPlan = (diet: DietMode, weekOffset: number): Record<string, DayPlan> => {
  const base: Record<string, DayPlan> = {
    Segunda: {
      cafe: [
        { name: "Banana amassada", emoji: "🍌", group: "Fruta" },
        { name: "Aveia", emoji: "🥣", group: "Grão" },
      ],
      almoco: [
        { name: diet === "Vegano" ? "Grão-de-bico" : diet === "Vegetariano" ? "Ovo mexido" : "Frango desfiado", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🍳" : "🍗", group: "Proteína" },
        { name: "Cenoura cozida", emoji: "🥕", group: "Legume" },
        { name: "Arroz", emoji: "🍚", group: "Grão" },
      ],
      jantar: [
        { name: "Purê de abacate", emoji: "🥑", group: "Fruta" },
        { name: "Batata doce", emoji: "🍠", group: "Legume" },
      ],
    },
    Terça: {
      cafe: [
        { name: "Mamão", emoji: "🥭", group: "Fruta" },
        { name: "Pão integral", emoji: "🍞", group: "Grão" },
      ],
      almoco: [
        { name: diet === "Vegano" ? "Lentilha" : diet === "Vegetariano" ? "Queijo cottage" : "Peixe cozido", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🧀" : "🐟", group: "Proteína" },
        { name: "Abobrinha", emoji: "🥒", group: "Legume" },
        { name: "Macarrão integral", emoji: "🍝", group: "Grão" },
      ],
      jantar: [
        { name: "Maçã cozida", emoji: "🍎", group: "Fruta" },
        { name: "Brócolis", emoji: "🥦", group: "Legume" },
      ],
    },
    Quarta: {
      cafe: [
        { name: "Pera", emoji: "🍐", group: "Fruta" },
        { name: "Mingau de aveia", emoji: "🥣", group: "Grão" },
      ],
      almoco: [
        { name: diet === "Vegano" ? "Tofu" : diet === "Vegetariano" ? "Ovo cozido" : "Carne moída", emoji: diet === "Vegano" ? "🧊" : diet === "Vegetariano" ? "🥚" : "🥩", group: "Proteína" },
        { name: "Beterraba", emoji: "🟣", group: "Legume" },
        { name: "Arroz", emoji: "🍚", group: "Grão" },
      ],
      jantar: [
        { name: "Manga", emoji: "🥭", group: "Fruta" },
        { name: "Abóbora", emoji: "🎃", group: "Legume" },
      ],
    },
    Quinta: {
      cafe: [
        { name: "Melancia", emoji: "🍉", group: "Fruta" },
        { name: "Tapioca", emoji: "🫓", group: "Grão" },
      ],
      almoco: [
        { name: diet === "Vegano" ? "Feijão" : diet === "Vegetariano" ? "Ricota" : "Frango", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🧀" : "🍗", group: "Proteína" },
        { name: "Chuchu", emoji: "🥒", group: "Legume" },
        { name: "Quinoa", emoji: "🌾", group: "Grão" },
      ],
      jantar: [
        { name: "Morango", emoji: "🍓", group: "Fruta" },
        { name: "Cenoura", emoji: "🥕", group: "Legume" },
      ],
    },
    Sexta: {
      cafe: [
        { name: "Uva cortada", emoji: "🍇", group: "Fruta" },
        { name: "Panqueca de banana", emoji: "🥞", group: "Grão" },
      ],
      almoco: [
        { name: diet === "Vegano" ? "Ervilha" : diet === "Vegetariano" ? "Omelete" : "Peixe", emoji: diet === "Vegano" ? "🟢" : diet === "Vegetariano" ? "🍳" : "🐟", group: "Proteína" },
        { name: "Espinafre", emoji: "🥬", group: "Legume" },
        { name: "Arroz integral", emoji: "🍚", group: "Grão" },
      ],
      jantar: [
        { name: "Abacate", emoji: "🥑", group: "Fruta" },
        { name: "Batata", emoji: "🥔", group: "Legume" },
      ],
    },
    Sábado: {
      cafe: [
        { name: "Banana", emoji: "🍌", group: "Fruta" },
        { name: "Pão de queijo", emoji: "🧀", group: "Grão" },
      ],
      almoco: [
        { name: diet === "Vegano" ? "Grão-de-bico" : diet === "Vegetariano" ? "Lentilha" : "Carne", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🫘" : "🥩", group: "Proteína" },
        { name: "Cenoura", emoji: "🥕", group: "Legume" },
        { name: "Arroz", emoji: "🍚", group: "Grão" },
      ],
      jantar: [
        { name: "Maçã", emoji: "🍎", group: "Fruta" },
        { name: "Abobrinha", emoji: "🥒", group: "Legume" },
      ],
    },
    Domingo: {
      cafe: [
        { name: "Mamão", emoji: "🥭", group: "Fruta" },
        { name: "Aveia com fruta", emoji: "🥣", group: "Grão" },
      ],
      almoco: [
        { name: diet === "Vegano" ? "Feijão preto" : diet === "Vegetariano" ? "Ovo" : "Frango", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🥚" : "🍗", group: "Proteína" },
        { name: "Brócolis", emoji: "🥦", group: "Legume" },
        { name: "Macarrão", emoji: "🍝", group: "Grão" },
      ],
      jantar: [
        { name: "Pera", emoji: "🍐", group: "Fruta" },
        { name: "Abóbora", emoji: "🎃", group: "Legume" },
      ],
    },
  };
  return base;
};

const groupColors: Record<string, string> = {
  Fruta: "hsl(35 90% 60%)",
  Legume: "hsl(140 45% 50%)",
  Proteína: "hsl(0 60% 60%)",
  Grão: "hsl(30 50% 55%)",
};

const suggestions = [
  { name: "Quinoa", emoji: "🌾", reason: "Ainda não introduzido — rico em proteínas" },
  { name: "Brócolis", emoji: "🥦", reason: "Baixa aceitação — tente nova forma de preparo" },
];

export default function CardapioPage() {
  return (
    <PremiumGate>
      <CardapioContent />
    </PremiumGate>
  );
}

function CardapioContent() {
  const navigate = useNavigate();
  const [diet, setDiet] = useState<DietMode>("Tradicional");
  const [weekOffset, setWeekOffset] = useState(0);
  const [expandedDay, setExpandedDay] = useState<string | null>("Segunda");
  const [offeredMeals, setOfferedMeals] = useState<Set<string>>(new Set());

  const weekPlan = generateWeekPlan(diet, weekOffset);

  const weekLabel = weekOffset === 0 ? "Semana Atual" : weekOffset === 1 ? "Próxima Semana" : `Semana +${weekOffset}`;

  const toggleOffer = (key: string) => {
    setOfferedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Count unique food groups for the week
  const allGroups = new Set<string>();
  Object.values(weekPlan).forEach((day) => {
    [...day.cafe, ...day.almoco, ...day.jantar].forEach((m) => allGroups.add(m.group));
  });
  const diversityPercent = Math.min(100, Math.round((allGroups.size / 4) * 100));

  return (
    <div className="app-container bottom-nav-safe">
      {/* Header */}
      <div
        className="px-5 pt-6 pb-5"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1
              className="text-xl"
              style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}
            >
              Planejamento Alimentar
            </h1>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Bebê com 9 meses
            </p>
          </div>
          <button
            onClick={() => navigate("/lista-compras")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{
              background: "hsl(var(--app-gold))",
              color: "hsl(var(--app-petrol))",
              fontWeight: 700,
            }}
          >
            <ShoppingCart size={14} />
            Compras
          </button>
        </div>

        {/* Weekly diversity indicator */}
        <div
          className="mt-3 p-3 rounded-xl"
          style={{ background: "hsl(var(--app-cream))" }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-xs font-bold"
              style={{ color: "hsl(var(--app-petrol))", fontWeight: 700 }}
            >
              📈 Diversidade Alimentar da Semana
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}
            >
              {diversityPercent}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "hsl(var(--app-cream-dark))" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${diversityPercent}%`,
                background: "hsl(var(--app-gold))",
              }}
            />
          </div>
          <div className="flex gap-2 mt-2">
            {["Fruta", "Legume", "Proteína", "Grão"].map((g) => (
              <div key={g} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: groupColors[g] }}
                />
                <span
                  className="text-[9px]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {g}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {/* Week selector */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            className="p-2 rounded-xl transition-all active:scale-95"
            style={{ background: "hsl(var(--card))" }}
          >
            <ChevronLeft size={18} style={{ color: "hsl(var(--app-petrol))" }} />
          </button>
          <span
            className="text-sm font-bold"
            style={{ color: "hsl(var(--app-petrol))", fontWeight: 700 }}
          >
            📅 {weekLabel}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-2 rounded-xl transition-all active:scale-95"
            style={{ background: "hsl(var(--card))" }}
          >
            <ChevronRight size={18} style={{ color: "hsl(var(--app-petrol))" }} />
          </button>
        </div>

        {/* Diet mode selector */}
        <div className="flex gap-2">
          {dietModes.map(({ key, emoji }) => (
            <button
              key={key}
              onClick={() => setDiet(key)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
              style={{
                fontWeight: 700,
                background: diet === key ? "hsl(var(--app-gold))" : "hsl(var(--card))",
                color: "hsl(var(--app-petrol))",
                boxShadow: diet === key ? "none" : "0 1px 4px rgba(46,64,87,0.06)",
              }}
            >
              {emoji} {key}
            </button>
          ))}
        </div>

        {/* Days */}
        {weekdays.map((day) => {
          const plan = weekPlan[day];
          if (!plan) return null;
          const isExpanded = expandedDay === day;
          const dayGroups = new Set<string>();
          [...plan.cafe, ...plan.almoco, ...plan.jantar].forEach((m) => dayGroups.add(m.group));

          return (
            <div key={day} className="card-clinical overflow-hidden">
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day)}
                className="w-full px-4 py-3.5 flex items-center justify-between transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-bold"
                    style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}
                  >
                    📌 {day}
                  </span>
                  <div className="flex gap-1">
                    {Array.from(dayGroups).map((g) => (
                      <div
                        key={g}
                        className="w-2 h-2 rounded-full"
                        style={{ background: groupColors[g] }}
                      />
                    ))}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {[
                    { key: "cafe", label: "☀️ Café da manhã", meals: plan.cafe },
                    { key: "almoco", label: "🌤️ Almoço", meals: plan.almoco },
                    { key: "jantar", label: "🌙 Jantar", meals: plan.jantar },
                  ].map(({ key, label, meals }) => (
                    <div key={key}>
                      <p
                        className="text-xs font-bold mb-1.5"
                        style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}
                      >
                        {label}
                      </p>
                      <div className="space-y-1.5">
                        {meals.map((meal) => {
                          const mealKey = `${day}-${key}-${meal.name}`;
                          const isOffered = offeredMeals.has(mealKey);
                          return (
                            <div
                              key={meal.name}
                              className="flex items-center justify-between p-2.5 rounded-xl"
                              style={{
                                background: isOffered ? "hsl(var(--app-gold-light))" : "hsl(var(--app-cream))",
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span>{meal.emoji}</span>
                                <span
                                  className="text-xs"
                                  style={{
                                    color: "hsl(var(--app-petrol))",
                                    textDecoration: isOffered ? "line-through" : "none",
                                    opacity: isOffered ? 0.6 : 1,
                                  }}
                                >
                                  {meal.name}
                                </span>
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: groupColors[meal.group] }}
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => navigate("/em-desenvolvimento")}
                                  className="p-1.5 rounded-lg transition-all active:scale-90"
                                  style={{ color: "hsl(var(--muted-foreground))" }}
                                  title="Ver receita"
                                >
                                  <BookOpen size={13} />
                                </button>
                                <button
                                  onClick={() => navigate("/em-desenvolvimento")}
                                  className="p-1.5 rounded-lg transition-all active:scale-90"
                                  style={{ color: "hsl(var(--muted-foreground))" }}
                                  title="Substituir"
                                >
                                  <RefreshCw size={13} />
                                </button>
                                <button
                                  onClick={() => toggleOffer(mealKey)}
                                  className="p-1.5 rounded-lg transition-all active:scale-90"
                                  style={{
                                    color: isOffered ? "hsl(var(--app-gold-dark))" : "hsl(var(--muted-foreground))",
                                  }}
                                  title="Marcar como oferecido"
                                >
                                  <Check size={13} strokeWidth={isOffered ? 3 : 2} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Daily nutritional indicator */}
                  <div
                    className="flex items-center gap-1.5 pt-2"
                    style={{ borderTop: "1px solid hsl(var(--app-divider))" }}
                  >
                    {Array.from(dayGroups).map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: `${groupColors[g]}22`,
                          color: groupColors[g],
                        }}
                      >
                        {g}
                      </span>
                    ))}
                    {dayGroups.size < 4 && (
                      <span
                        className="text-[10px] flex items-center gap-0.5"
                        style={{ color: "hsl(35 80% 50%)" }}
                      >
                        <AlertTriangle size={10} />
                        Varie mais
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Smart Suggestions */}
        <div className="card-clinical p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
            <h3
              className="text-sm font-bold"
              style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}
            >
              Sugestão Personalizada
            </h3>
          </div>
          <div className="space-y-2">
            {suggestions.map((s) => (
              <button
                key={s.name}
                onClick={() => navigate("/alimentos")}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-95"
                style={{ background: "hsl(var(--app-cream))" }}
              >
                <span className="text-xl">{s.emoji}</span>
                <div>
                  <p
                    className="text-xs font-bold"
                    style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}
                  >
                    {s.name}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {s.reason}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="card-clinical p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "hsl(var(--app-gold-light))" }}
          >
            👩‍⚕️
          </div>
          <div>
            <p
              className="font-bold text-xs"
              style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}
            >
              Cardápios elaborados por Dra. Nutricionista
            </p>
            <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
              Nutricionista Pediátrica · CRN3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
