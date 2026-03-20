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

function pickN<T>(arr: T[], n: number, usedTracker?: Map<string, number>, nameGetter?: (item: T) => string): T[] {
  if (arr.length === 0) return [];
  const shuffled = shuffle(arr);
  if (usedTracker && nameGetter) {
    shuffled.sort((a, b) => (usedTracker.get(nameGetter(a)) || 0) - (usedTracker.get(nameGetter(b)) || 0));
  }
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    const item = shuffled[i % shuffled.length];
    result.push(item);
    if (usedTracker && nameGetter) {
      usedTracker.set(nameGetter(item), (usedTracker.get(nameGetter(item)) || 0) + 1);
    }
  }
  return result;
}

// All available foods grouped for auto mode
const allFoodsByGroup: Record<string, PantryItem[]> = {
  Fruta: pantryCategories.find((c) => c.key === "frutas")?.items || [],
  Legume: [
    ...(pantryCategories.find((c) => c.key === "legumes")?.items || []),
    ...(pantryCategories.find((c) => c.key === "verduras")?.items || []),
    ...(pantryCategories.find((c) => c.key === "tuberculos")?.items || []),
  ],
  Proteína: pantryCategories.find((c) => c.key === "proteinas")?.items || [],
  Grão: pantryCategories.find((c) => c.key === "graos")?.items || [],
};

const fallbackFoods: Record<string, PantryItem[]> = {
  Fruta: [
    { name: "Banana", emoji: "🍌", group: "Fruta" },
    { name: "Maçã", emoji: "🍎", group: "Fruta" },
    { name: "Pera", emoji: "🍐", group: "Fruta" },
  ],
  Legume: [
    { name: "Cenoura", emoji: "🥕", group: "Legume" },
    { name: "Abobrinha", emoji: "🥒", group: "Legume" },
    { name: "Batata doce", emoji: "🍠", group: "Legume" },
  ],
  Proteína: [
    { name: "Frango", emoji: "🍗", group: "Proteína" },
    { name: "Ovo", emoji: "🥚", group: "Proteína" },
    { name: "Feijão", emoji: "🫘", group: "Proteína" },
  ],
  Grão: [
    { name: "Arroz", emoji: "🍚", group: "Grão" },
    { name: "Aveia", emoji: "🥣", group: "Grão" },
  ],
};

function buildWeekFromGroups(byGroup: Record<string, PantryItem[]>): WeekPlan {
  const usageTracker = new Map<string, number>();
  const nameGetter = (item: PantryItem) => item.name;
  const toMeal = (item: PantryItem): MealItem => ({ name: item.name, emoji: item.emoji, group: item.group });
  const plan: WeekPlan = {};

  for (let day = 0; day < 7; day++) {
    plan[day] = {
      cafe: [
        ...pickN(byGroup.Fruta, 1, usageTracker, nameGetter).map(toMeal),
        ...pickN(byGroup.Grão, 1, usageTracker, nameGetter).map(toMeal),
      ],
      almoco: [
        ...pickN(byGroup.Proteína, 1, usageTracker, nameGetter).map(toMeal),
        ...pickN(byGroup.Legume, 1, usageTracker, nameGetter).map(toMeal),
        ...pickN(byGroup.Grão, 1, usageTracker, nameGetter).map(toMeal),
      ],
      jantar: [
        ...pickN(byGroup.Fruta, 1, usageTracker, nameGetter).map(toMeal),
        ...pickN(byGroup.Legume, 1, usageTracker, nameGetter).map(toMeal),
      ],
      lanche: pickN(byGroup.Fruta, 1, usageTracker, nameGetter).map(toMeal),
    };
  }
  return plan;
}

/** Generate plan from user-selected pantry foods */
export function generateWeekPlan(selectedFoodNames: string[], diet: DietMode): { plan: WeekPlan; usedSuggestions: boolean } {
  let allItems = selectedFoodNames.map(getItemByName).filter(Boolean) as PantryItem[];
  allItems = filterByDiet(allItems, diet);

  const byGroup: Record<string, PantryItem[]> = { Fruta: [], Legume: [], Proteína: [], Grão: [] };
  allItems.forEach((item) => {
    if (byGroup[item.group]) byGroup[item.group].push(item);
  });

  let usedSuggestions = false;
  for (const group of Object.keys(byGroup)) {
    if (byGroup[group].length === 0 && fallbackFoods[group]) {
      byGroup[group] = filterByDiet(fallbackFoods[group], diet);
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
    if (byGroup[group].length === 0 && fallbackFoods[group]) {
      byGroup[group] = filterByDiet(fallbackFoods[group], diet);
    }
  }
  return buildWeekFromGroups(byGroup);
}
