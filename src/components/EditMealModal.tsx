import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { pantryCategories, type PantryItem } from "@/data/pantryFoods";
import type { MealItem } from "@/hooks/useMealPlan";

type MealKey = "cafe" | "almoco" | "jantar" | "lanche";

// Rules: which food groups are allowed per meal
const ALLOWED_GROUPS: Record<MealKey, string[]> = {
  cafe: ["Fruta", "Grão"],
  almoco: ["Proteína", "Legume", "Grão"],
  jantar: ["Proteína", "Legume", "Grão"],
  lanche: ["Fruta"],
};

const MEAL_LABELS: Record<MealKey, string> = {
  cafe: "☀️ Café da manhã",
  almoco: "🌤️ Almoço",
  jantar: "🌙 Jantar",
  lanche: "🍎 Lanche",
};

// Map pantry category keys to meal groups
const CATEGORY_TO_GROUP: Record<string, string> = {
  frutas: "Fruta",
  legumes: "Legume",
  verduras: "Legume",
  proteinas: "Proteína",
  graos: "Grão",
  tuberculos: "Legume",
};

interface EditMealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealKey: MealKey;
  currentItems: MealItem[];
  dietMode: string;
  onSave: (items: MealItem[]) => void;
}

export function EditMealModal({ open, onOpenChange, mealKey, currentItems, dietMode, onSave }: EditMealModalProps) {
  const [selected, setSelected] = useState<MealItem[]>(currentItems);

  // Reset when modal opens
  useState(() => {
    setSelected(currentItems);
  });

  const allowedGroups = ALLOWED_GROUPS[mealKey];

  // Filter available foods by allowed groups and diet
  const availableFoods = useMemo(() => {
    const excludedByDiet: string[] = [];
    if (dietMode === "Vegano") {
      excludedByDiet.push("Frango", "Carne bovina", "Peixe", "Ovo", "Fígado", "Queijo cottage", "Ricota");
    } else if (dietMode === "Vegetariano") {
      excludedByDiet.push("Frango", "Carne bovina", "Peixe", "Fígado");
    }

    const foods: PantryItem[] = [];
    for (const cat of pantryCategories) {
      const group = CATEGORY_TO_GROUP[cat.key];
      if (!group || !allowedGroups.includes(group)) continue;
      for (const item of cat.items) {
        if (excludedByDiet.includes(item.name)) continue;
        // Remap group for tuberculos
        const mappedGroup = cat.key === "tuberculos" ? "Legume" : group;
        foods.push({ ...item, group: mappedGroup });
      }
    }
    return foods;
  }, [allowedGroups, dietMode]);

  // Group available foods
  const grouped = useMemo(() => {
    const map: Record<string, PantryItem[]> = {};
    for (const f of availableFoods) {
      const g = f.group;
      if (!map[g]) map[g] = [];
      map[g].push(f);
    }
    return map;
  }, [availableFoods]);

  const isSelected = (name: string) => selected.some((s) => s.name === name);

  const toggleFood = (food: PantryItem) => {
    if (isSelected(food.name)) {
      setSelected(selected.filter((s) => s.name !== food.name));
    } else {
      setSelected([...selected, { name: food.name, emoji: food.emoji, group: food.group }]);
    }
  };

  const handleSave = () => {
    if (selected.length === 0) return;
    onSave(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
            ✏️ Editar {MEAL_LABELS[mealKey]}
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
          Selecione os alimentos para esta refeição
        </p>

        <div className="space-y-4">
          {Object.entries(grouped).map(([group, foods]) => (
            <div key={group}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}>
                {group}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {foods.map((food) => {
                  const sel = isSelected(food.name);
                  return (
                    <button
                      key={food.name}
                      onClick={() => toggleFood(food)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs transition-all active:scale-95"
                      style={{
                        fontWeight: 600,
                        background: sel ? "hsl(var(--app-gold))" : "hsl(var(--app-cream))",
                        color: "hsl(var(--app-petrol))",
                        border: sel ? "2px solid hsl(var(--app-gold-dark))" : "2px solid transparent",
                      }}
                    >
                      <span>{food.emoji}</span>
                      <span>{food.name}</span>
                      {sel && <Check size={12} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Current selection summary */}
        {selected.length > 0 && (
          <div className="mt-4 p-3 rounded-xl" style={{ background: "hsl(var(--app-cream))" }}>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: "hsl(var(--app-petrol))", fontWeight: 700 }}>
              Refeição editada ({selected.length} itens)
            </p>
            <div className="flex flex-wrap gap-1">
              {selected.map((item) => (
                <span key={item.name} className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "hsl(var(--card))", fontWeight: 600 }}>
                  {item.emoji} {item.name}
                  <button onClick={() => setSelected(selected.filter((s) => s.name !== item.name))} className="ml-0.5">
                    <X size={10} style={{ color: "hsl(var(--muted-foreground))" }} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-3 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ background: "hsl(var(--app-cream))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={selected.length === 0}
            className="flex-1 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
          >
            Salvar refeição
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
