import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PremiumGate } from "@/components/PremiumGate";
import { PantrySelection } from "@/components/PantrySelection";
import { useMealLogs } from "@/hooks/useMealLogs";
import { usePantry } from "@/hooks/usePantry";
import { useMealPlan, type WeekPlan, type DayPlan, type PlanType } from "@/hooks/useMealPlan";
import { generateWeekPlan, generateAutoWeekPlan } from "@/lib/generateMealPlan";
import { ShoppingCart, Check, X, MessageSquare, ChevronDown, ChevronUp, ChefHat, RefreshCw, Pencil, CalendarDays, Sparkles, Home } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getPreparations, type FoodPreparation } from "@/data/foodPreparations";
import { EditMealModal } from "@/components/EditMealModal";

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

const groupColors: Record<string, string> = {
  Fruta: "hsl(35 90% 60%)",
  Legume: "hsl(140 45% 50%)",
  Proteína: "hsl(0 60% 60%)",
  Grão: "hsl(30 50% 55%)",
};

type DietMode = "Tradicional" | "Vegetariano" | "Vegano";

const dietModes: { key: DietMode; emoji: string }[] = [
  { key: "Tradicional", emoji: "🍗" },
  { key: "Vegetariano", emoji: "🥚" },
  { key: "Vegano", emoji: "🌱" },
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
  const { selectedFoods, savePantry, saving: pantrySaving } = usePantry();
  const { plan, dietMode: savedDietMode, planType, savePlan, clearPlan, updateMeal, loading: planLoading } = useMealPlan();

  const [showSelection, setShowSelection] = useState(false);
  const [showDietPicker, setShowDietPicker] = useState(false);
  const [pendingMode, setPendingMode] = useState<"auto" | "personal" | null>(null);
  const [localSelection, setLocalSelection] = useState<string[]>([]);
  const [diet, setDiet] = useState<DietMode>((savedDietMode as DietMode) || "Tradicional");
  const [usedSuggestions, setUsedSuggestions] = useState(false);

  // Week view state
  const weekDates = useMemo(() => getWeekDates(), []);
  const todayIndex = weekDates.findIndex(isToday);
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex >= 0 ? todayIndex : 0);
  const [noteFood, setNoteFood] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({
    cafe: true, almoco: true, jantar: true, lanche: true,
  });
  const [prepFood, setPrepFood] = useState<FoodPreparation | null>(null);
  const [prepOpen, setPrepOpen] = useState(false);
  const [editMealKey, setEditMealKey] = useState<"cafe" | "almoco" | "jantar" | "lanche" | null>(null);

  const selectedDate = weekDates[selectedDayIndex];
  const dateStr = formatDate(selectedDate);
  const { logs, upsertLog } = useMealLogs(dateStr);

  const planIndex = (selectedDate.getDay() + 6) % 7;
  const dayPlan: DayPlan | null = plan ? plan[planIndex] || null : null;

  const mealSections = dayPlan ? [
    { key: "cafe", label: "☀️ Café da manhã", items: dayPlan.cafe },
    { key: "almoco", label: "🌤️ Almoço", items: dayPlan.almoco },
    { key: "jantar", label: "🌙 Jantar", items: dayPlan.jantar },
    { key: "lanche", label: "🍎 Lanche", items: dayPlan.lanche },
  ] : [];

  const allItems = mealSections.flatMap((s) => s.items.map((i) => ({ ...i, mealKey: s.key })));
  const totalItems = allItems.length;

  const getLogStatus = (foodName: string, mealType: string) =>
    logs.find((l) => l.food_name === foodName && l.meal_type === mealType)?.acceptance || null;
  const getLogNotes = (foodName: string, mealType: string) =>
    logs.find((l) => l.food_name === foodName && l.meal_type === mealType)?.notes || null;

  const markedCount = allItems.filter((i) => getLogStatus(i.name, i.mealKey) !== null).length;
  const ateCount = allItems.filter((i) => getLogStatus(i.name, i.mealKey) === "ate").length;
  const didNotEatCount = allItems.filter((i) => getLogStatus(i.name, i.mealKey) === "did_not_eat").length;

  const handleMark = async (foodName: string, mealType: string, status: string) => {
    const current = getLogStatus(foodName, mealType);
    if (current === status) return;
    const ok = await upsertLog(foodName, mealType, status, dateStr);
    if (ok) toast.success("Registro salvo!");
  };

  const handleSaveNote = async (foodName: string, mealType: string) => {
    const current = getLogStatus(foodName, mealType);
    await upsertLog(foodName, mealType, current || "ate", dateStr, noteText);
    setNoteFood(null);
    setNoteText("");
    toast.success("Observação salva!");
  };

  const handleOpenPrep = (foodName: string) => {
    const prep = getPreparations(foodName);
    setPrepFood(prep!);
    setPrepOpen(true);
  };

  const handleEditMealSave = async (mealKey: "cafe" | "almoco" | "jantar" | "lanche", items: import("@/hooks/useMealPlan").MealItem[]) => {
    const ok = await updateMeal(planIndex, mealKey, items);
    if (ok) {
      toast.success("Refeição atualizada! ✏️");
    } else {
      toast.error("Erro ao salvar alteração.");
    }
  };

  const toggleMealSection = (key: string) => {
    setExpandedMeals((p) => ({ ...p, [key]: !p[key] }));
  };

  // ---- Mode handlers ----

  const handleChooseAuto = () => {
    setPendingMode("auto");
    setShowDietPicker(true);
  };

  const handleChoosePersonal = () => {
    setPendingMode("personal");
    setShowDietPicker(true);
  };

  const handleDietConfirmed = () => {
    setShowDietPicker(false);
    if (pendingMode === "auto") {
      handleGenerateAuto();
    } else {
      setLocalSelection(selectedFoods.length > 0 ? [...selectedFoods] : []);
      setShowSelection(true);
    }
    setPendingMode(null);
  };

  const handleGenerateAuto = async () => {
    const newPlan = generateAutoWeekPlan(diet);
    const ok = await savePlan(newPlan, diet, "automatic");
    if (ok) {
      setUsedSuggestions(false);
      toast.success("Cardápio automático gerado! ✨");
    } else {
      toast.error("Erro ao salvar cardápio.");
    }
  };

  const handleGeneratePersonal = async () => {
    const saved = await savePantry(localSelection);
    if (!saved) { toast.error("Erro ao salvar alimentos."); return; }
    const { plan: newPlan, usedSuggestions: suggested } = generateWeekPlan(localSelection, diet);
    const ok = await savePlan(newPlan, diet, "personalized");
    if (ok) {
      setUsedSuggestions(suggested);
      setShowSelection(false);
      toast.success("Cardápio personalizado gerado! 🎉");
    } else {
      toast.error("Erro ao salvar cardápio.");
    }
  };

  const handleRegenerate = async () => {
    if (planType === "personalized" && selectedFoods.length > 0) {
      const { plan: newPlan, usedSuggestions: suggested } = generateWeekPlan(selectedFoods, diet);
      const ok = await savePlan(newPlan, diet, "personalized");
      if (ok) { setUsedSuggestions(suggested); toast.success("Cardápio atualizado! 🔄"); }
    } else {
      const newPlan = generateAutoWeekPlan(diet);
      const ok = await savePlan(newPlan, diet, "automatic");
      if (ok) toast.success("Cardápio atualizado! 🔄");
    }
  };

  const handleEditPantry = () => {
    setLocalSelection(selectedFoods.length > 0 ? [...selectedFoods] : []);
    setShowSelection(true);
  };

  // ---- Loading ----
  if (planLoading) {
    return (
      <div className="app-container bottom-nav-safe flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "hsl(var(--app-gold))", borderTopColor: "transparent" }} />
      </div>
    );
  }

  // ---- Diet picker modal ----
  if (showDietPicker) {
    return (
      <div className="app-container bottom-nav-safe">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center gap-6 min-h-[60vh]">
          <h2 className="text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
            Qual o regime alimentar?
          </h2>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            O cardápio será ajustado de acordo com essa escolha
          </p>
          <div className="flex gap-2 w-full max-w-xs">
            {dietModes.map(({ key, emoji }) => (
              <button
                key={key}
                onClick={() => setDiet(key)}
                className="flex-1 py-3 rounded-xl text-xs font-bold transition-all active:scale-95"
                style={{
                  fontWeight: 700,
                  background: diet === key ? "hsl(var(--app-gold))" : "hsl(var(--card))",
                  color: "hsl(var(--app-petrol))",
                  border: diet === key ? "2px solid hsl(var(--app-gold-dark))" : "2px solid hsl(var(--app-divider))",
                }}
              >
                {emoji} {key}
              </button>
            ))}
          </div>
          <button
            onClick={handleDietConfirmed}
            className="w-full max-w-xs py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: "hsl(var(--app-gold))",
              color: "hsl(var(--app-petrol))",
              fontWeight: 700,
              boxShadow: "0 4px 16px rgba(244,201,93,0.35)",
            }}
          >
            Continuar →
          </button>
          <button
            onClick={() => { setShowDietPicker(false); setPendingMode(null); }}
            className="text-xs font-semibold transition-all active:scale-95"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // ---- Pantry selection flow ----
  if (showSelection) {
    return (
      <div className="app-container bottom-nav-safe">
        <div className="px-5 pt-6 pb-20">
          <PantrySelection
            selected={localSelection}
            onChange={setLocalSelection}
            onConfirm={handleGeneratePersonal}
            onCancel={() => setShowSelection(false)}
            saving={pantrySaving}
          />
        </div>
      </div>
    );
  }

  // ---- Empty state — no plan yet ----
  if (!plan) {
    return (
      <div className="app-container bottom-nav-safe">
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center gap-5 min-h-[60vh]">
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--app-gold-light))" }}>
            <CalendarDays size={44} style={{ color: "hsl(var(--app-gold-dark))" }} />
          </div>
          <h1 className="text-xl" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
            Cardápio da Semana
          </h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))", lineHeight: 1.6, maxWidth: 280 }}>
            Escolha como montar o cardápio semanal do seu bebê
          </p>

          <div className="w-full max-w-xs flex flex-col gap-3 mt-2">
            {/* Auto button */}
            <button
              onClick={handleChooseAuto}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: "hsl(var(--app-gold))",
                color: "hsl(var(--app-petrol))",
                fontWeight: 700,
                boxShadow: "0 6px 24px rgba(244,201,93,0.4)",
              }}
            >
              <Sparkles size={18} />
              Gerar cardápio automático
            </button>
            <p className="text-[10px] -mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              Usa todos os alimentos recomendados para a idade
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px" style={{ background: "hsl(var(--app-divider))" }} />
              <span className="text-[10px] font-bold" style={{ color: "hsl(var(--muted-foreground))", fontWeight: 700 }}>ou</span>
              <div className="flex-1 h-px" style={{ background: "hsl(var(--app-divider))" }} />
            </div>

            {/* Personal button */}
            <button
              onClick={handleChoosePersonal}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: "hsl(var(--card))",
                color: "hsl(var(--app-petrol))",
                fontWeight: 700,
                border: "2px solid hsl(var(--app-gold))",
                boxShadow: "0 2px 8px rgba(46,64,87,0.06)",
              }}
            >
              <Home size={18} />
              Monte seu cardápio
            </button>
            <p className="text-[10px] -mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              Selecione os alimentos que você tem em casa
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---- Has plan — weekly view ----
  return (
    <div className="app-container bottom-nav-safe">
      {/* Header */}
      <div className="px-5 pt-6 pb-4" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center justify-between mb-1">
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

        {/* Plan type badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1" style={{
            background: "hsl(var(--app-gold-light))",
            color: "hsl(var(--app-gold-dark))",
            fontWeight: 700,
          }}>
            {planType === "automatic" ? (
              <><Sparkles size={10} /> Automático</>
            ) : (
              <><Home size={10} /> Baseado nos seus alimentos</>
            )}
          </span>
          {usedSuggestions && planType === "personalized" && (
            <span className="text-[10px] px-2 py-1 rounded-full" style={{
              background: "hsl(35 100% 95%)",
              color: "hsl(30 80% 45%)",
              fontWeight: 600,
            }}>
              + sugestões extras
            </span>
          )}
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
                  {weekdayShort[d.getDay()]}
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
          background: markedCount === totalItems && totalItems > 0 ? "hsl(var(--app-gold))" : "hsl(var(--app-cream-dark))",
        }}>
          <span className="text-sm font-bold" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
            {totalItems > 0 ? Math.round((markedCount / totalItems) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 mt-3 flex gap-2">
        {planType === "personalized" && (
          <button
            onClick={handleEditPantry}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{
              fontWeight: 700,
              background: "hsl(var(--card))",
              color: "hsl(var(--app-petrol))",
              boxShadow: "0 1px 4px rgba(46,64,87,0.06)",
            }}
          >
            <Pencil size={12} /> Editar alimentos
          </button>
        )}
        <button
          onClick={handleRegenerate}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          style={{
            fontWeight: 700,
            background: "hsl(var(--card))",
            color: "hsl(var(--app-petrol))",
            boxShadow: "0 1px 4px rgba(46,64,87,0.06)",
          }}
        >
          <RefreshCw size={12} /> Refazer cardápio
        </button>
        <button
          onClick={() => { clearPlan(); }}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          style={{
            fontWeight: 700,
            background: "hsl(var(--card))",
            color: "hsl(var(--muted-foreground))",
            boxShadow: "0 1px 4px rgba(46,64,87,0.06)",
          }}
          title="Trocar modo"
        >
          <CalendarDays size={12} /> Novo
        </button>
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
                className="flex-1 px-4 py-3 flex items-center justify-between active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>{label}</span>
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
              <div className="px-4 py-3 flex items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditMealKey(key as any); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95"
                  style={{
                    fontWeight: 700,
                    background: "hsl(var(--app-cream))",
                    color: "hsl(var(--app-gold-dark))",
                  }}
                >
                  <Pencil size={10} /> Editar
                </button>
              </div>

              {isOpen && (
                <div className="px-4 pb-3 space-y-2">
                  {items.map((meal) => {
                    const status = getLogStatus(meal.name, key);
                    const savedNote = getLogNotes(meal.name, key);
                    return (
                      <div key={`${meal.name}-${key}`}>
                        <div
                          className="flex items-center gap-2 p-3 rounded-xl transition-all"
                          style={{
                            background: status === "ate" ? "hsl(140 45% 95%)"
                              : status === "did_not_eat" ? "hsl(0 60% 96%)"
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

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenPrep(meal.name)}
                              className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-all active:scale-90"
                              style={{ background: "hsl(var(--card))", color: "hsl(var(--app-gold-dark))", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                            >
                              <ChefHat size={13} />
                              <span className="text-[8px] font-bold" style={{ fontWeight: 700 }}>Preparo</span>
                            </button>
                            <button
                              onClick={() => handleMark(meal.name, key, "ate")}
                              className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-all active:scale-90"
                              style={{
                                background: status === "ate" ? "hsl(140 50% 45%)" : "hsl(var(--card))",
                                color: status === "ate" ? "white" : "hsl(140 45% 45%)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              }}
                            >
                              <Check size={14} strokeWidth={2.5} />
                              <span className="text-[8px] font-bold" style={{ fontWeight: 700 }}>Comeu</span>
                            </button>
                            <button
                              onClick={() => handleMark(meal.name, key, "did_not_eat")}
                              className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-all active:scale-90"
                              style={{
                                background: status === "did_not_eat" ? "hsl(0 60% 55%)" : "hsl(var(--card))",
                                color: status === "did_not_eat" ? "white" : "hsl(0 60% 55%)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              }}
                            >
                              <X size={14} strokeWidth={2.5} />
                              <span className="text-[8px] font-bold" style={{ fontWeight: 700 }}>Recusou</span>
                            </button>
                            <button
                              onClick={() => { setNoteFood(`${meal.name}::${key}`); setNoteText(savedNote || ""); }}
                              className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-all active:scale-90"
                              style={{
                                background: savedNote ? "hsl(var(--app-gold-light))" : "hsl(var(--card))",
                                color: savedNote ? "hsl(var(--app-petrol))" : "hsl(var(--muted-foreground))",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              }}
                            >
                              <MessageSquare size={12} />
                              <span className="text-[8px] font-bold" style={{ fontWeight: 700 }}>Nota</span>
                            </button>
                          </div>
                        </div>

                        {savedNote && noteFood !== `${meal.name}::${key}` && (
                          <div className="mt-1 px-2">
                            <p className="text-[10px] px-2 py-1 rounded-lg" style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))" }}>
                              📝 {savedNote}
                            </p>
                          </div>
                        )}

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

      {/* Preparation Modal */}
      <Dialog open={prepOpen} onOpenChange={setPrepOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
              🍳 Como preparar: {prepFood?.name}
            </DialogTitle>
          </DialogHeader>
          {prepFood && prepFood.preparations.length > 0 ? (
            <div className="space-y-4 mt-2">
              {prepFood.preparations.map((prep, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: "hsl(var(--app-cream))" }}>
                  <h4 className="text-sm font-bold mb-3" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>{prep.method}</h4>
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}>Preparo</p>
                      <p className="text-xs" style={{ color: "hsl(var(--app-petrol))", lineHeight: 1.5 }}>{prep.steps}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}>Textura ideal</p>
                      <p className="text-xs" style={{ color: "hsl(var(--app-petrol))", lineHeight: 1.5 }}>{prep.texture}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}>Dicas e cuidados</p>
                      <p className="text-xs" style={{ color: "hsl(var(--app-petrol))", lineHeight: 1.5 }}>{prep.tips}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Sem modo de preparo cadastrado para este alimento.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Meal Modal */}
      {editMealKey && dayPlan && (
        <EditMealModal
          open={!!editMealKey}
          onOpenChange={(open) => { if (!open) setEditMealKey(null); }}
          mealKey={editMealKey}
          currentItems={dayPlan[editMealKey]}
          dietMode={diet}
          onSave={(items) => handleEditMealSave(editMealKey, items)}
        />
      )}
    </div>
  );
}
