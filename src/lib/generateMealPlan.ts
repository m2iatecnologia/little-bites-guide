import { pantryCategories, type PantryItem } from "@/data/pantryFoods";
import type { WeekPlan, MealItem, DayPlan } from "@/hooks/useMealPlan";

type DietMode = "Tradicional" | "Vegetariano" | "Vegano";

function getItemByName(name: string): PantryItem | undefined {
  for (const cat of pantryCategories) {
    const found = cat.items.find((i) => i.name === name);
    if (found) return found;
  }
  return undefined;
}

function filterByDiet(foods: PantryItem[], diet: DietMode): PantryItem[] {
  if (diet === "Vegano") {
    const excluded = ["Frango", "Carne bovina", "Peixe", "Ovo", "Fígado", "Queijo cottage", "Ricota"];
    return foods.filter((f) => !excluded.includes(f.name));
  }
  if (diet === "Vegetariano") {
    const excluded = ["Frango", "Carne bovina", "Peixe", "Fígado"];
    return foods.filter((f) => !excluded.includes(f.name));
  }
  return foods;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickOne<T>(arr: T[], usedTracker: Map<string, number>, nameGetter: (item: T) => string): T | null {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) =>
    (usedTracker.get(nameGetter(a)) || 0) - (usedTracker.get(nameGetter(b)) || 0)
  );
  // Among items with lowest usage, pick randomly
  const minUsage = usedTracker.get(nameGetter(sorted[0])) || 0;
  const candidates = sorted.filter((i) => (usedTracker.get(nameGetter(i)) || 0) === minUsage);
  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  usedTracker.set(nameGetter(picked), (usedTracker.get(nameGetter(picked)) || 0) + 1);
  return picked;
}

const toMeal = (item: PantryItem): MealItem => ({ name: item.name, emoji: item.emoji, group: item.group });

// Grains suitable for breakfast (light)
const BREAKFAST_GRAINS = ["Aveia", "Pão integral", "Tapioca"];
// Grains suitable for lunch/dinner (heavy carbs)
const MEAL_GRAINS = ["Arroz", "Macarrão integral", "Quinoa", "Milho"];

// All available foods grouped
const allFoodsByGroup: Record<string, PantryItem[]> = {
  Fruta: pantryCategories.find((c) => c.key === "frutas")?.items || [],
  Legume: [
    ...(pantryCategories.find((c) => c.key === "legumes")?.items || []),
    ...(pantryCategories.find((c) => c.key === "verduras")?.items || []),
  ],
  Tubérculo: pantryCategories.find((c) => c.key === "tuberculos")?.items || [],
  Proteína: pantryCategories.find((c) => c.key === "proteinas")?.items || [],
  Grão: pantryCategories.find((c) => c.key === "graos")?.items || [],
};

interface MealGroups {
  Fruta: PantryItem[];
  Legume: PantryItem[];
  Tubérculo: PantryItem[];
  Proteína: PantryItem[];
  GrãoCafé: PantryItem[];   // light grains for breakfast
  GrãoRefeição: PantryItem[]; // heavy grains for lunch/dinner
}

function splitGroups(byGroup: Record<string, PantryItem[]>): MealGroups {
  const allGrains = byGroup.Grão || byGroup["Grão"] || [];
  const tuberculos = byGroup["Tubérculo"] || byGroup.Legume?.filter((i) =>
    ["Batata doce", "Batata", "Mandioquinha", "Inhame", "Mandioca"].includes(i.name)
  ) || [];
  const legumes = (byGroup.Legume || []).filter((i) =>
    !["Batata doce", "Batata", "Mandioquinha", "Inhame", "Mandioca"].includes(i.name)
  );

  return {
    Fruta: byGroup.Fruta || [],
    Legume: legumes.length > 0 ? legumes : [
      { name: "Cenoura", emoji: "🥕", group: "Legume" },
      { name: "Abobrinha", emoji: "🥒", group: "Legume" },
    ],
    Tubérculo: tuberculos,
    Proteína: byGroup["Proteína"] || [],
    GrãoCafé: allGrains.filter((g) => BREAKFAST_GRAINS.includes(g.name)),
    GrãoRefeição: [
      ...allGrains.filter((g) => MEAL_GRAINS.includes(g.name)),
      ...tuberculos, // tubérculos can sub for grains in meals
    ],
  };
}

function buildWeekFromGroups(byGroup: Record<string, PantryItem[]>): WeekPlan {
  const g = splitGroups(byGroup);
  const tracker = new Map<string, number>();
  const n = (i: PantryItem) => i.name;
  const plan: WeekPlan = {};

  // Fallbacks if categories are empty
  if (g.Fruta.length === 0) g.Fruta = [
    { name: "Banana", emoji: "🍌", group: "Fruta" },
    { name: "Maçã", emoji: "🍎", group: "Fruta" },
    { name: "Mamão", emoji: "🥭", group: "Fruta" },
  ];
  if (g.Proteína.length === 0) g.Proteína = [
    { name: "Ovo", emoji: "🥚", group: "Proteína" },
    { name: "Feijão", emoji: "🫘", group: "Proteína" },
  ];
  if (g.GrãoCafé.length === 0) g.GrãoCafé = [
    { name: "Aveia", emoji: "🥣", group: "Grão" },
  ];
  if (g.GrãoRefeição.length === 0) g.GrãoRefeição = [
    { name: "Arroz", emoji: "🍚", group: "Grão" },
  ];

  for (let day = 0; day < 7; day++) {
    // ☀️ Café da manhã: 1 fruta + 1 grão leve
    const cafeFruta = pickOne(shuffle(g.Fruta), tracker, n);
    const cafeGrao = pickOne(shuffle(g.GrãoCafé), tracker, n);

    // 🍽️ Almoço: 1 proteína + 1 legume/verdura + 1 grão/carboidrato
    const almocoProt = pickOne(shuffle(g.Proteína), tracker, n);
    const almocoLeg = pickOne(shuffle(g.Legume), tracker, n);
    const almocoGrao = pickOne(shuffle(g.GrãoRefeição), tracker, n);

    // 🌙 Jantar: 1 proteína (leve) + 1 legume + opcionalmente tubérculo
    const jantaProt = pickOne(shuffle(g.Proteína), tracker, n);
    const jantaLeg = pickOne(shuffle(g.Legume), tracker, n);
    const jantaCarb = g.Tubérculo.length > 0
      ? pickOne(shuffle(g.Tubérculo), tracker, n)
      : pickOne(shuffle(g.GrãoRefeição), tracker, n);

    // 🍌 Lanche: 1 fruta
    const lancheFruta = pickOne(shuffle(g.Fruta), tracker, n);

    plan[day] = {
      cafe: [cafeFruta, cafeGrao].filter(Boolean).map((i) => toMeal(i!)),
      almoco: [almocoProt, almocoLeg, almocoGrao].filter(Boolean).map((i) => toMeal(i!)),
      jantar: [jantaProt, jantaLeg, jantaCarb].filter(Boolean).map((i) => toMeal(i!)),
      lanche: [lancheFruta].filter(Boolean).map((i) => toMeal(i!)),
    };
  }
  return plan;
}

/** Generate plan from user-selected pantry foods */
export function generateWeekPlan(selectedFoodNames: string[], diet: DietMode): { plan: WeekPlan; usedSuggestions: boolean } {
  let allItems = selectedFoodNames.map(getItemByName).filter(Boolean) as PantryItem[];
  allItems = filterByDiet(allItems, diet);

  const byGroup: Record<string, PantryItem[]> = {
    Fruta: [], Legume: [], Tubérculo: [], Proteína: [], Grão: [],
  };
  allItems.forEach((item) => {
    const group = ["Batata doce", "Batata", "Mandioquinha", "Inhame", "Mandioca"].includes(item.name)
      ? "Tubérculo"
      : item.group === "Legume" ? "Legume"
      : item.group === "Fruta" ? "Fruta"
      : item.group === "Proteína" ? "Proteína"
      : item.group === "Grão" ? "Grão"
      : item.group;
    if (byGroup[group]) byGroup[group].push(item);
  });

  let usedSuggestions = false;
  const fallbacks: Record<string, PantryItem[]> = {
    Fruta: [
      { name: "Banana", emoji: "🍌", group: "Fruta" },
      { name: "Maçã", emoji: "🍎", group: "Fruta" },
    ],
    Legume: [
      { name: "Cenoura", emoji: "🥕", group: "Legume" },
      { name: "Abobrinha", emoji: "🥒", group: "Legume" },
    ],
    Proteína: [
      { name: "Ovo", emoji: "🥚", group: "Proteína" },
      { name: "Feijão", emoji: "🫘", group: "Proteína" },
    ],
    Grão: [
      { name: "Arroz", emoji: "🍚", group: "Grão" },
      { name: "Aveia", emoji: "🥣", group: "Grão" },
    ],
  };

  for (const group of Object.keys(fallbacks)) {
    if (byGroup[group].length === 0) {
      byGroup[group] = filterByDiet(fallbacks[group], diet);
      if (byGroup[group].length > 0) usedSuggestions = true;
    }
  }

  return { plan: buildWeekFromGroups(byGroup), usedSuggestions };
}

/** Generate plan automatically from all available foods */
export function generateAutoWeekPlan(diet: DietMode): WeekPlan {
  const byGroup: Record<string, PantryItem[]> = {};
  for (const group of Object.keys(allFoodsByGroup)) {
    byGroup[group] = filterByDiet(allFoodsByGroup[group], diet);
  }
  return buildWeekFromGroups(byGroup);
}
