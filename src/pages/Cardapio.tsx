import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PremiumGate } from "@/components/PremiumGate";
import { useMealLogs } from "@/hooks/useMealLogs";
import { ShoppingCart, Check, X, Minus, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

type DietMode = "Tradicional" | "Vegetariano" | "Vegano";

const dietModes: { key: DietMode; emoji: string }[] = [
  { key: "Tradicional", emoji: "🍗" },
  { key: "Vegetariano", emoji: "🥚" },
  { key: "Vegano", emoji: "🌱" },
];

interface Meal {
  name: string;
  emoji: string;
  group: string;
}

interface DayPlan {
  cafe: Meal[];
  almoco: Meal[];
  jantar: Meal[];
  lanche: Meal[];
}

const weekdayLabels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const weekdayShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getWeekDates(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function isToday(d: Date): boolean {
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

const generateDayPlan = (diet: DietMode, dayIndex: number): DayPlan => {
  const plans: Record<number, DayPlan> = {
    0: { // Monday
      cafe: [{ name: "Banana amassada", emoji: "🍌", group: "Fruta" }, { name: "Aveia", emoji: "🥣", group: "Grão" }],
      almoco: [
        { name: diet === "Vegano" ? "Grão-de-bico" : diet === "Vegetariano" ? "Ovo mexido" : "Frango desfiado", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🍳" : "🍗", group: "Proteína" },
        { name: "Cenoura cozida", emoji: "🥕", group: "Legume" },
        { name: "Arroz", emoji: "🍚", group: "Grão" },
      ],
      jantar: [{ name: "Purê de abacate", emoji: "🥑", group: "Fruta" }, { name: "Batata doce", emoji: "🍠", group: "Legume" }],
      lanche: [{ name: "Maçã cozida", emoji: "🍎", group: "Fruta" }],
    },
    1: {
      cafe: [{ name: "Mamão", emoji: "🥭", group: "Fruta" }, { name: "Pão integral", emoji: "🍞", group: "Grão" }],
      almoco: [
        { name: diet === "Vegano" ? "Lentilha" : diet === "Vegetariano" ? "Queijo cottage" : "Peixe cozido", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🧀" : "🐟", group: "Proteína" },
        { name: "Abobrinha", emoji: "🥒", group: "Legume" },
        { name: "Macarrão integral", emoji: "🍝", group: "Grão" },
      ],
      jantar: [{ name: "Pera", emoji: "🍐", group: "Fruta" }, { name: "Brócolis", emoji: "🥦", group: "Legume" }],
      lanche: [{ name: "Banana", emoji: "🍌", group: "Fruta" }],
    },
    2: {
      cafe: [{ name: "Pera", emoji: "🍐", group: "Fruta" }, { name: "Mingau de aveia", emoji: "🥣", group: "Grão" }],
      almoco: [
        { name: diet === "Vegano" ? "Tofu" : diet === "Vegetariano" ? "Ovo cozido" : "Carne moída", emoji: diet === "Vegano" ? "🧊" : diet === "Vegetariano" ? "🥚" : "🥩", group: "Proteína" },
        { name: "Beterraba", emoji: "🟣", group: "Legume" },
        { name: "Arroz", emoji: "🍚", group: "Grão" },
      ],
      jantar: [{ name: "Manga", emoji: "🥭", group: "Fruta" }, { name: "Abóbora", emoji: "🎃", group: "Legume" }],
      lanche: [{ name: "Melancia", emoji: "🍉", group: "Fruta" }],
    },
    3: {
      cafe: [{ name: "Melancia", emoji: "🍉", group: "Fruta" }, { name: "Tapioca", emoji: "🫓", group: "Grão" }],
      almoco: [
        { name: diet === "Vegano" ? "Feijão" : diet === "Vegetariano" ? "Ricota" : "Frango", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🧀" : "🍗", group: "Proteína" },
        { name: "Chuchu", emoji: "🥒", group: "Legume" },
        { name: "Quinoa", emoji: "🌾", group: "Grão" },
      ],
      jantar: [{ name: "Morango", emoji: "🍓", group: "Fruta" }, { name: "Cenoura", emoji: "🥕", group: "Legume" }],
      lanche: [{ name: "Abacate", emoji: "🥑", group: "Fruta" }],
    },
    4: {
      cafe: [{ name: "Uva cortada", emoji: "🍇", group: "Fruta" }, { name: "Panqueca de banana", emoji: "🥞", group: "Grão" }],
      almoco: [
        { name: diet === "Vegano" ? "Ervilha" : diet === "Vegetariano" ? "Omelete" : "Peixe", emoji: diet === "Vegano" ? "🟢" : diet === "Vegetariano" ? "🍳" : "🐟", group: "Proteína" },
        { name: "Espinafre", emoji: "🥬", group: "Legume" },
        { name: "Arroz integral", emoji: "🍚", group: "Grão" },
      ],
      jantar: [{ name: "Abacate", emoji: "🥑", group: "Fruta" }, { name: "Batata", emoji: "🥔", group: "Legume" }],
      lanche: [{ name: "Mamão", emoji: "🥭", group: "Fruta" }],
    },
    5: {
      cafe: [{ name: "Banana", emoji: "🍌", group: "Fruta" }, { name: "Pão de queijo", emoji: "🧀", group: "Grão" }],
      almoco: [
        { name: diet === "Vegano" ? "Grão-de-bico" : diet === "Vegetariano" ? "Lentilha" : "Carne", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🫘" : "🥩", group: "Proteína" },
        { name: "Cenoura", emoji: "🥕", group: "Legume" },
        { name: "Arroz", emoji: "🍚", group: "Grão" },
      ],
      jantar: [{ name: "Maçã", emoji: "🍎", group: "Fruta" }, { name: "Abobrinha", emoji: "🥒", group: "Legume" }],
      lanche: [{ name: "Pera", emoji: "🍐", group: "Fruta" }],
    },
    6: {
      cafe: [{ name: "Mamão", emoji: "🥭", group: "Fruta" }, { name: "Aveia com fruta", emoji: "🥣", group: "Grão" }],
      almoco: [
        { name: diet === "Vegano" ? "Feijão preto" : diet === "Vegetariano" ? "Ovo" : "Frango", emoji: diet === "Vegano" ? "🫘" : diet === "Vegetariano" ? "🥚" : "🍗", group: "Proteína" },
        { name: "Brócolis", emoji: "🥦", group: "Legume" },
        { name: "Macarrão", emoji: "🍝", group: "Grão" },
      ],
      jantar: [{ name: "Pera", emoji: "🍐", group: "Fruta" }, { name: "Abóbora", emoji: "🎃", group: "Legume" }],
      lanche: [{ name: "Morango", emoji: "🍓", group: "Fruta" }],
    },
  };
  return plans[dayIndex] || plans[0];
};

const groupColors: Record<string, string> = {
  Fruta: "hsl(35 90% 60%)",
  Legume: "hsl(140 45% 50%)",
  Proteína: "hsl(0 60% 60%)",
  Grão: "hsl(30 50% 55%)",
};

export default function CardapioPage() {
  return (
    <PremiumGate>
      <CardapioContent />
    </PremiumGate>
  );
}

function CardapioContent() {
  const navigate = useNavigate();
  const weekDates = useMemo(() => getWeekDates(), []);
  const todayIndex = weekDates.findIndex(isToday);
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex >= 0 ? todayIndex : 0);
  const [diet, setDiet] = useState<DietMode>("Tradicional");
  const [noteFood, setNoteFood] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({
    cafe: true, almoco: true, jantar: true, lanche: true,
  });

  const selectedDate = weekDates[selectedDayIndex];
  const dateStr = formatDate(selectedDate);
  // dayIndex for plan: 0=Mon ... 6=Sun; JS getDay: 0=Sun. Convert.
  const planIndex = (selectedDate.getDay() + 6) % 7;
  const dayPlan = useMemo(() => generateDayPlan(diet, planIndex), [diet, planIndex]);

  const { logs, upsertLog } = useMealLogs(dateStr);

  const mealSections = [
    { key: "cafe", label: "☀️ Café da manhã", items: dayPlan.cafe },
    { key: "almoco", label: "🌤️ Almoço", items: dayPlan.almoco },
    { key: "jantar", label: "🌙 Jantar", items: dayPlan.jantar },
    { key: "lanche", label: "🍎 Lanche", items: dayPlan.lanche },
  ];

  const allItems = mealSections.flatMap((s) => s.items.map((i) => ({ ...i, mealKey: s.key })));
  const totalItems = allItems.length;

  const getLogStatus = (foodName: string, mealType: string) => {
    return logs.find((l) => l.food_name === foodName && l.meal_type === mealType)?.acceptance || null;
  };

  const markedCount = allItems.filter((i) => getLogStatus(i.name, i.mealKey) !== null).length;
  const ateCount = allItems.filter((i) => getLogStatus(i.name, i.mealKey) === "ate").length;
  const didNotEatCount = allItems.filter((i) => getLogStatus(i.name, i.mealKey) === "did_not_eat").length;

  const handleMark = async (foodName: string, mealType: string, status: string) => {
    const current = getLogStatus(foodName, mealType);
    // Toggle off if same status
    const newStatus = current === status ? "ate" : status; // default back to ate if toggling off
    if (current === status) return; // already set, do nothing
    const ok = await upsertLog(foodName, mealType, newStatus, dateStr);
    if (ok) toast.success("Registro salvo!");
  };

  const handleSaveNote = async (foodName: string, mealType: string) => {
    const current = getLogStatus(foodName, mealType);
    await upsertLog(foodName, mealType, current || "ate", dateStr, noteText);
    setNoteFood(null);
    setNoteText("");
    toast.success("Observação salva!");
  };

  const toggleMealSection = (key: string) => {
    setExpandedMeals((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="app-container bottom-nav-safe">
      {/* Header */}
      <div className="px-5 pt-6 pb-4" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
              {isToday(selectedDate) ? "Hoje" : weekdayLabels[selectedDate.getDay()]}
              <span className="text-sm font-semibold ml-2" style={{ color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>
                {selectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
              </span>
            </h1>
          </div>
          <button
            onClick={() => navigate("/lista-compras")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
          >
            <ShoppingCart size={14} /> Compras
          </button>
        </div>

        {/* Day selector */}
        <div className="flex gap-1.5">
          {weekDates.map((d, i) => {
            const isSel = i === selectedDayIndex;
            const isTod = isToday(d);
            return (
              <button
                key={i}
                onClick={() => setSelectedDayIndex(i)}
                className="flex-1 py-2 rounded-xl text-center transition-all active:scale-95"
                style={{
                  background: isSel ? "hsl(var(--app-gold))" : "hsl(var(--app-cream))",
                  border: isTod && !isSel ? "2px solid hsl(var(--app-gold))" : "2px solid transparent",
                }}
              >
                <p className="text-[10px] font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
                  {weekdayShort[(d.getDay())]}
                </p>
                <p className="text-xs font-bold" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
                  {d.getDate()}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary bar */}
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: "hsl(var(--app-cream))" }}>
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
            Marcados: {markedCount}/{totalItems}
          </p>
          <div className="flex gap-3 mt-0.5">
            <span className="text-[10px]" style={{ color: "hsl(140 45% 40%)" }}>✅ Comeu: {ateCount}</span>
            <span className="text-[10px]" style={{ color: "hsl(0 60% 50%)" }}>❌ Não comeu: {didNotEatCount}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
          background: markedCount === totalItems ? "hsl(var(--app-gold))" : "hsl(var(--app-cream-dark))",
        }}>
          <span className="text-sm font-bold" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
            {totalItems > 0 ? Math.round((markedCount / totalItems) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Diet mode */}
      <div className="px-4 mt-3 flex gap-2">
        {dietModes.map(({ key, emoji }) => (
          <button
            key={key}
            onClick={() => setDiet(key)}
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
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

      {/* Meal sections */}
      <div className="px-4 mt-4 space-y-3 pb-4">
        {mealSections.map(({ key, label, items }) => {
          const isOpen = expandedMeals[key];
          const sectionAte = items.filter((i) => getLogStatus(i.name, key) === "ate").length;
          return (
            <div key={key} className="card-clinical overflow-hidden">
              <button
                onClick={() => toggleMealSection(key)}
                className="w-full px-4 py-3 flex items-center justify-between active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
                    {label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{
                    fontWeight: 700,
                    background: sectionAte === items.length && items.length > 0 ? "hsl(140 45% 90%)" : "hsl(var(--app-cream))",
                    color: sectionAte === items.length && items.length > 0 ? "hsl(140 45% 35%)" : "hsl(var(--muted-foreground))",
                  }}>
                    {sectionAte}/{items.length}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={16} style={{ color: "hsl(var(--muted-foreground))" }} /> : <ChevronDown size={16} style={{ color: "hsl(var(--muted-foreground))" }} />}
              </button>

              {isOpen && (
                <div className="px-4 pb-3 space-y-2">
                  {items.map((meal) => {
                    const status = getLogStatus(meal.name, key);
                    return (
                      <div key={meal.name}>
                        <div
                          className="flex items-center gap-2 p-3 rounded-xl transition-all"
                          style={{
                            background: status === "ate" ? "hsl(140 45% 95%)"
                              : status === "did_not_eat" ? "hsl(0 60% 96%)"
                              : status === "tried" ? "hsl(43 88% 95%)"
                              : "hsl(var(--app-cream))",
                          }}
                        >
                          <span className="text-lg">{meal.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold" style={{
                              fontWeight: 600,
                              color: "hsl(var(--app-petrol))",
                              textDecoration: status === "ate" ? "line-through" : "none",
                              opacity: status === "ate" ? 0.6 : 1,
                            }}>
                              {meal.name}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: groupColors[meal.group] }} />
                              <span className="text-[9px]" style={{ color: "hsl(var(--muted-foreground))" }}>{meal.group}</span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMark(meal.name, key, "ate")}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                              style={{
                                background: status === "ate" ? "hsl(140 50% 45%)" : "hsl(var(--card))",
                                color: status === "ate" ? "white" : "hsl(140 45% 45%)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              }}
                              title="Comeu"
                            >
                              <Check size={14} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => handleMark(meal.name, key, "tried")}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                              style={{
                                background: status === "tried" ? "hsl(43 88% 55%)" : "hsl(var(--card))",
                                color: status === "tried" ? "white" : "hsl(43 88% 55%)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              }}
                              title="Provou"
                            >
                              <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => handleMark(meal.name, key, "did_not_eat")}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                              style={{
                                background: status === "did_not_eat" ? "hsl(0 60% 55%)" : "hsl(var(--card))",
                                color: status === "did_not_eat" ? "white" : "hsl(0 60% 55%)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              }}
                              title="Não comeu"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => { setNoteFood(`${meal.name}::${key}`); setNoteText(""); }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                              style={{
                                background: "hsl(var(--card))",
                                color: "hsl(var(--muted-foreground))",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              }}
                              title="Observação"
                            >
                              <MessageSquare size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Notes input */}
                        {noteFood === `${meal.name}::${key}` && (
                          <div className="mt-1 flex gap-2 px-1">
                            <input
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Ex: fez careta, engasgou..."
                              className="flex-1 text-xs p-2 rounded-lg border"
                              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveNote(meal.name, key)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95"
                              style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
                            >
                              Salvar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Conclude day */}
        {markedCount === totalItems && totalItems > 0 && (
          <button
            onClick={() => toast.success("Dia concluído! 🎉")}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
          >
            ✅ Concluir Dia
          </button>
        )}
      </div>
    </div>
  );
}
