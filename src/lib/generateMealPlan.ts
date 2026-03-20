import { pantryCategories, type PantryItem } from "@/data/pantryFoods";
import type { WeekPlan, MealItem, DayPlan } from "@/hooks/useMealPlan";

type DietMode = "Tradicional" | "Vegetariano" | "Vegano";

// Get PantryItem details by name
function getItemByName(name: string): PantryItem | undefined {
  for (const cat of pantryCategories) {
    const found = cat.items.find((i) => i.name === name);
    if (found) return found;
  }
  return undefined;
}

// Filter foods by diet restrictions
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

// Shuffle array
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Pick N items from array, cycling if needed
function pickN<T>(arr: T[], n: number, usedTracker?: Map<string, number>, nameGetter?: (item: T) => string): T[] {
  if (arr.length === 0) return [];
  const shuffled = shuffle(arr);

  if (usedTracker && nameGetter) {
    // Sort by least used
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

// Default fallback foods when user has none in a group
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

export function generateWeekPlan(selectedFoodNames: string[], diet: DietMode): { plan: WeekPlan; usedSuggestions: boolean } {
  // Resolve items
  let allItems = selectedFoodNames
    .map(getItemByName)
    .filter(Boolean) as PantryItem[];

  allItems = filterByDiet(allItems, diet);

  const byGroup: Record<string, PantryItem[]> = {
    Fruta: [],
    Legume: [],
    Proteína: [],
    Grão: [],
  };

  allItems.forEach((item) => {
    if (byGroup[item.group]) {
      byGroup[item.group].push(item);
    }
  });

  // Check if we need fallbacks
  let usedSuggestions = false;
  for (const group of Object.keys(byGroup)) {
    if (byGroup[group].length === 0 && fallbackFoods[group]) {
      byGroup[group] = filterByDiet(fallbackFoods[group], diet);
      if (byGroup[group].length > 0) usedSuggestions = true;
    }
  }

  // Track usage across the week to avoid repetition
  const usageTracker = new Map<string, number>();
  const nameGetter = (item: PantryItem) => item.name;

  const plan: WeekPlan = {};

  for (let day = 0; day < 7; day++) {
    const frutas = byGroup.Fruta;
    const legumes = byGroup.Legume;
    const proteinas = byGroup.Proteína;
    const graos = byGroup.Grão;

    const toMeal = (item: PantryItem): MealItem => ({
      name: item.name,
      emoji: item.emoji,
      group: item.group,
    });

    // Café: 1 fruta + 1 grão
    const cafeFrutas = pickN(frutas, 1, usageTracker, nameGetter).map(toMeal);
    const cafeGraos = pickN(graos, 1, usageTracker, nameGetter).map(toMeal);

    // Almoço: 1 proteína + 1 legume + 1 grão
    const almocoProteinas = pickN(proteinas, 1, usageTracker, nameGetter).map(toMeal);
    const almocoLegumes = pickN(legumes, 1, usageTracker, nameGetter).map(toMeal);
    const almocoGraos = pickN(graos, 1, usageTracker, nameGetter).map(toMeal);

    // Jantar: 1 fruta + 1 legume
    const jantarFrutas = pickN(frutas, 1, usageTracker, nameGetter).map(toMeal);
    const jantarLegumes = pickN(legumes, 1, usageTracker, nameGetter).map(toMeal);

    // Lanche: 1 fruta
    const lancheFrutas = pickN(frutas, 1, usageTracker, nameGetter).map(toMeal);

    const dayPlan: DayPlan = {
      cafe: [...cafeFrutas, ...cafeGraos],
      almoco: [...almocoProteinas, ...almocoLegumes, ...almocoGraos],
      jantar: [...jantarFrutas, ...jantarLegumes],
      lanche: lancheFrutas,
    };

    plan[day] = dayPlan;
  }

  return { plan, usedSuggestions };
}
