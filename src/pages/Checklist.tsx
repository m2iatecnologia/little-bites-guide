import { useState, useMemo } from "react";
import { useAllMealLogs } from "@/hooks/useMealLogs";
import { useFoodOverrides } from "@/hooks/useFoodOverrides";
import { checklistFoods } from "@/data/appData";
import { Search, Plus, ArrowRightLeft, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type Tab = "introduced" | "rejected" | "to_introduce";
type SortMode = "name" | "most_rejected" | "last_offered" | "to_introduce_first";

interface FoodSummary {
  name: string;
  category: string;
  totalOffered: number;
  ateCount: number;
  didNotEatCount: number;
  triedCount: number;
  lastOfferedDate: string | null;
  computedStatus: Tab;
  manualStatus: string | null;
  isCustom: boolean;
}

const allDefaultFoods = Object.entries(checklistFoods).flatMap(([cat, foods]) =>
  foods.map((f) => ({ name: f.name, category: cat }))
);

const categoryOptions = ["Frutas", "Legumes e Verduras", "Proteínas", "Grãos", "Outro"];

export default function Checklist() {
  const { logs, loading: logsLoading } = useAllMealLogs();
  const { overrides, upsertOverride, deleteOverride, loading: overridesLoading } = useFoodOverrides();
  const [activeTab, setActiveTab] = useState<Tab>("introduced");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodCategory, setNewFoodCategory] = useState("Frutas");
  const [expandedFood, setExpandedFood] = useState<string | null>(null);
  const [showMoveMenu, setShowMoveMenu] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const loading = logsLoading || overridesLoading;

  const foodSummaries: FoodSummary[] = useMemo(() => {
    // Combine default foods + custom overrides
    const foodMap = new Map<string, FoodSummary>();

    allDefaultFoods.forEach((f) => {
      foodMap.set(f.name, {
        name: f.name,
        category: f.category,
        totalOffered: 0,
        ateCount: 0,
        didNotEatCount: 0,
        triedCount: 0,
        lastOfferedDate: null,
        computedStatus: "to_introduce",
        manualStatus: null,
        isCustom: false,
      });
    });

    // Add custom overrides that aren't in default
    overrides.forEach((o) => {
      if (!foodMap.has(o.food_name)) {
        foodMap.set(o.food_name, {
          name: o.food_name,
          category: o.category,
          totalOffered: 0,
          ateCount: 0,
          didNotEatCount: 0,
          triedCount: 0,
          lastOfferedDate: null,
          computedStatus: "to_introduce",
          manualStatus: o.status,
          isCustom: true,
        });
      } else {
        foodMap.get(o.food_name)!.manualStatus = o.status;
      }
    });

    // Process logs
    logs.forEach((log) => {
      const existing = foodMap.get(log.food_name);
      if (existing) {
        existing.totalOffered++;
        if (log.acceptance === "ate") existing.ateCount++;
        else if (log.acceptance === "did_not_eat") existing.didNotEatCount++;
        else if (log.acceptance === "tried") existing.triedCount++;
        if (!existing.lastOfferedDate || log.offered_at > existing.lastOfferedDate) {
          existing.lastOfferedDate = log.offered_at;
        }
      } else {
        // Food from logs not in defaults
        const entry: FoodSummary = {
          name: log.food_name,
          category: "Outro",
          totalOffered: 1,
          ateCount: log.acceptance === "ate" ? 1 : 0,
          didNotEatCount: log.acceptance === "did_not_eat" ? 1 : 0,
          triedCount: log.acceptance === "tried" ? 1 : 0,
          lastOfferedDate: log.offered_at,
          computedStatus: "to_introduce",
          manualStatus: null,
          isCustom: true,
        };
        foodMap.set(log.food_name, entry);
      }
    });

    // Compute status
    foodMap.forEach((f) => {
      if (f.ateCount >= 1) f.computedStatus = "introduced";
      else if (f.didNotEatCount >= 2) f.computedStatus = "rejected";
      else f.computedStatus = "to_introduce";
    });

    return Array.from(foodMap.values());
  }, [logs, overrides]);

  const getEffectiveStatus = (f: FoodSummary): Tab => {
    return (f.manualStatus as Tab) || f.computedStatus;
  };

  const filtered = useMemo(() => {
    let result = foodSummaries.filter((f) => getEffectiveStatus(f) === activeTab);

    if (search) {
      result = result.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filterCategory) {
      result = result.filter((f) => f.category === filterCategory);
    }

    result.sort((a, b) => {
      switch (sortMode) {
        case "most_rejected": return b.didNotEatCount - a.didNotEatCount;
        case "last_offered": return (b.lastOfferedDate || "").localeCompare(a.lastOfferedDate || "");
        case "to_introduce_first": return a.totalOffered - b.totalOffered;
        default: return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [foodSummaries, activeTab, search, filterCategory, sortMode]);

  const handleAddFood = async () => {
    if (!newFoodName.trim()) return;
    const ok = await upsertOverride(newFoodName.trim(), newFoodCategory, "to_introduce");
    if (ok) {
      toast.success("Alimento adicionado!");
      setNewFoodName("");
      setShowAddForm(false);
    }
  };

  const handleMoveStatus = async (foodName: string, category: string, newStatus: Tab) => {
    const ok = await upsertOverride(foodName, category, newStatus);
    if (ok) toast.success("Status atualizado!");
    setShowMoveMenu(null);
  };

  const handleDeleteFood = async (foodName: string) => {
    const ok = await deleteOverride(foodName);
    if (ok) toast.success("Alimento removido!");
  };

  const getFoodLogs = (foodName: string) => {
    return logs.filter((l) => l.food_name === foodName).sort((a, b) => b.offered_at.localeCompare(a.offered_at));
  };

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: "introduced", label: "Introduzidos", emoji: "✅" },
    { key: "rejected", label: "Rejeitados", emoji: "❌" },
    { key: "to_introduce", label: "A introduzir", emoji: "🕒" },
  ];

  const tabCounts = useMemo(() => ({
    introduced: foodSummaries.filter((f) => getEffectiveStatus(f) === "introduced").length,
    rejected: foodSummaries.filter((f) => getEffectiveStatus(f) === "rejected").length,
    to_introduce: foodSummaries.filter((f) => getEffectiveStatus(f) === "to_introduce").length,
  }), [foodSummaries]);

  if (loading) {
    return (
      <div className="app-container bottom-nav-safe flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "hsl(var(--app-gold))", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="app-container bottom-nav-safe">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
            Repertório <span style={{ color: "hsl(var(--app-gold-dark))" }}>Alimentar</span>
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>

        {/* Add food form */}
        {showAddForm && (
          <div className="card-clinical p-4 mt-3 space-y-3">
            <Input
              value={newFoodName}
              onChange={(e) => setNewFoodName(e.target.value)}
              placeholder="Nome do alimento"
              className="text-sm"
            />
            <div className="flex gap-2 flex-wrap">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewFoodCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
                  style={{
                    fontWeight: 700,
                    background: newFoodCategory === cat ? "hsl(var(--app-gold))" : "hsl(var(--app-cream))",
                    color: "hsl(var(--app-petrol))",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddFood}
              className="w-full py-3 rounded-xl text-sm font-bold active:scale-95 transition-all"
              style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
            >
              Adicionar alimento
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
              style={{
                fontWeight: 700,
                background: activeTab === t.key ? "hsl(var(--app-gold))" : "hsl(var(--card))",
                color: "hsl(var(--app-petrol))",
                boxShadow: activeTab === t.key ? "none" : "0 1px 4px rgba(46,64,87,0.06)",
              }}
            >
              {t.emoji} {t.label} ({tabCounts[t.key]})
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="mt-3 space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar alimento..."
              className="pl-9 text-xs h-9"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-[10px] font-bold flex items-center gap-1"
            style={{ color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}
          >
            Filtros e ordenação {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showFilters && (
            <div className="space-y-2">
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setFilterCategory(null)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold active:scale-95"
                  style={{
                    fontWeight: 700,
                    background: !filterCategory ? "hsl(var(--app-gold))" : "hsl(var(--app-cream))",
                    color: "hsl(var(--app-petrol))",
                  }}
                >
                  Todos
                </button>
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold active:scale-95"
                    style={{
                      fontWeight: 700,
                      background: filterCategory === cat ? "hsl(var(--app-gold))" : "hsl(var(--app-cream))",
                      color: "hsl(var(--app-petrol))",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {([
                  { key: "name", label: "A-Z" },
                  { key: "most_rejected", label: "Mais rejeitados" },
                  { key: "last_offered", label: "Últimos ofertados" },
                  { key: "to_introduce_first", label: "Menos ofertados" },
                ] as { key: SortMode; label: string }[]).map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSortMode(s.key)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold active:scale-95"
                    style={{
                      fontWeight: 700,
                      background: sortMode === s.key ? "hsl(var(--app-petrol))" : "hsl(var(--app-cream))",
                      color: sortMode === s.key ? "hsl(var(--app-cream))" : "hsl(var(--app-petrol))",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Food list */}
      <div className="px-4 pb-4 space-y-2">
        {filtered.length === 0 && (
          <div className="card-clinical p-8 text-center">
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Nenhum alimento nesta categoria
            </p>
          </div>
        )}

        {filtered.map((food) => {
          const isExpanded = expandedFood === food.name;
          const foodLogs = isExpanded ? getFoodLogs(food.name) : [];

          return (
            <div key={food.name} className="card-clinical overflow-hidden">
              <button
                onClick={() => setExpandedFood(isExpanded ? null : food.name)}
                className="w-full px-4 py-3.5 flex items-center gap-3 active:scale-[0.99] transition-all"
              >
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
                      {food.name}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{
                      background: "hsl(var(--app-cream))",
                      color: "hsl(var(--muted-foreground))",
                    }}>
                      {food.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Ofertado {food.totalOffered}x
                    </span>
                    {food.totalOffered > 0 && (
                      <>
                        <span className="text-[10px]" style={{ color: "hsl(140 45% 40%)" }}>
                          ✅ {food.ateCount}x
                        </span>
                        <span className="text-[10px]" style={{ color: "hsl(0 60% 50%)" }}>
                          ❌ {food.didNotEatCount}x
                        </span>
                      </>
                    )}
                    {food.lastOfferedDate && (
                      <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                        Último: {new Date(food.lastOfferedDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={16} style={{ color: "hsl(var(--muted-foreground))" }} /> : <ChevronDown size={16} style={{ color: "hsl(var(--muted-foreground))" }} />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid hsl(var(--app-divider))" }}>
                  {/* Action buttons */}
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => setShowMoveMenu(showMoveMenu === food.name ? null : food.name)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold active:scale-95"
                      style={{ background: "hsl(var(--app-cream))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
                    >
                      <ArrowRightLeft size={11} /> Mover status
                    </button>
                    {food.isCustom && (
                      <button
                        onClick={() => handleDeleteFood(food.name)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold active:scale-95"
                        style={{ background: "hsl(0 60% 96%)", color: "hsl(0 60% 50%)", fontWeight: 700 }}
                      >
                        <Trash2 size={11} /> Remover
                      </button>
                    )}
                  </div>

                  {showMoveMenu === food.name && (
                    <div className="flex gap-2">
                      {tabs.filter((t) => t.key !== getEffectiveStatus(food)).map((t) => (
                        <button
                          key={t.key}
                          onClick={() => handleMoveStatus(food.name, food.category, t.key)}
                          className="flex-1 py-2 rounded-lg text-[10px] font-bold active:scale-95"
                          style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
                        >
                          {t.emoji} {t.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* History timeline */}
                  <div>
                    <p className="text-xs font-bold mb-2" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
                      Histórico
                    </p>
                    {foodLogs.length === 0 ? (
                      <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                        Nenhum registro encontrado.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {foodLogs.slice(0, 10).map((log) => (
                          <div key={log.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "hsl(var(--app-cream))" }}>
                            <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                              {new Date(log.offered_at).toLocaleDateString("pt-BR")}
                            </span>
                            <span className="text-[10px] font-semibold" style={{ color: "hsl(var(--app-petrol))", fontWeight: 600 }}>
                              {log.meal_type === "cafe" ? "Café" : log.meal_type === "almoco" ? "Almoço" : log.meal_type === "jantar" ? "Jantar" : log.meal_type === "lanche" ? "Lanche" : log.meal_type}
                            </span>
                            <span className="text-[10px]">
                              {log.acceptance === "ate" ? "✅ Comeu" : log.acceptance === "did_not_eat" ? "❌ Não comeu" : log.acceptance === "tried" ? "😐 Provou" : log.acceptance}
                            </span>
                            {log.notes && (
                              <span className="text-[9px] italic truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                                "{log.notes}"
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
