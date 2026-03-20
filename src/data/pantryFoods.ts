export interface PantryCategory {
  key: string;
  label: string;
  emoji: string;
  items: PantryItem[];
}

export interface PantryItem {
  name: string;
  emoji: string;
  group: string; // maps to meal plan group
}

export const pantryCategories: PantryCategory[] = [
  {
    key: "frutas",
    label: "Frutas",
    emoji: "🍎",
    items: [
      { name: "Banana", emoji: "🍌", group: "Fruta" },
      { name: "Maçã", emoji: "🍎", group: "Fruta" },
      { name: "Pera", emoji: "🍐", group: "Fruta" },
      { name: "Mamão", emoji: "🥭", group: "Fruta" },
      { name: "Abacate", emoji: "🥑", group: "Fruta" },
      { name: "Manga", emoji: "🥭", group: "Fruta" },
      { name: "Melancia", emoji: "🍉", group: "Fruta" },
      { name: "Morango", emoji: "🍓", group: "Fruta" },
      { name: "Uva", emoji: "🍇", group: "Fruta" },
      { name: "Laranja", emoji: "🍊", group: "Fruta" },
      { name: "Kiwi", emoji: "🥝", group: "Fruta" },
      { name: "Ameixa", emoji: "🫐", group: "Fruta" },
    ],
  },
  {
    key: "legumes",
    label: "Legumes",
    emoji: "🥕",
    items: [
      { name: "Cenoura", emoji: "🥕", group: "Legume" },
      { name: "Abobrinha", emoji: "🥒", group: "Legume" },
      { name: "Chuchu", emoji: "🥒", group: "Legume" },
      { name: "Beterraba", emoji: "🟣", group: "Legume" },
      { name: "Abóbora", emoji: "🎃", group: "Legume" },
      { name: "Vagem", emoji: "🫛", group: "Legume" },
      { name: "Quiabo", emoji: "🥒", group: "Legume" },
    ],
  },
  {
    key: "verduras",
    label: "Verduras",
    emoji: "🥬",
    items: [
      { name: "Brócolis", emoji: "🥦", group: "Legume" },
      { name: "Espinafre", emoji: "🥬", group: "Legume" },
      { name: "Couve", emoji: "🥬", group: "Legume" },
      { name: "Alface", emoji: "🥬", group: "Legume" },
      { name: "Agrião", emoji: "🥬", group: "Legume" },
    ],
  },
  {
    key: "proteinas",
    label: "Proteínas",
    emoji: "🍗",
    items: [
      { name: "Frango", emoji: "🍗", group: "Proteína" },
      { name: "Carne bovina", emoji: "🥩", group: "Proteína" },
      { name: "Peixe", emoji: "🐟", group: "Proteína" },
      { name: "Ovo", emoji: "🥚", group: "Proteína" },
      { name: "Fígado", emoji: "🥩", group: "Proteína" },
      { name: "Tofu", emoji: "🧊", group: "Proteína" },
      { name: "Grão-de-bico", emoji: "🫘", group: "Proteína" },
      { name: "Lentilha", emoji: "🫘", group: "Proteína" },
      { name: "Feijão", emoji: "🫘", group: "Proteína" },
      { name: "Ervilha", emoji: "🟢", group: "Proteína" },
      { name: "Queijo cottage", emoji: "🧀", group: "Proteína" },
      { name: "Ricota", emoji: "🧀", group: "Proteína" },
    ],
  },
  {
    key: "graos",
    label: "Grãos e Cereais",
    emoji: "🌾",
    items: [
      { name: "Arroz", emoji: "🍚", group: "Grão" },
      { name: "Aveia", emoji: "🥣", group: "Grão" },
      { name: "Quinoa", emoji: "🌾", group: "Grão" },
      { name: "Macarrão integral", emoji: "🍝", group: "Grão" },
      { name: "Pão integral", emoji: "🍞", group: "Grão" },
      { name: "Tapioca", emoji: "🫓", group: "Grão" },
      { name: "Milho", emoji: "🌽", group: "Grão" },
    ],
  },
  {
    key: "tuberculos",
    label: "Tubérculos",
    emoji: "🍠",
    items: [
      { name: "Batata doce", emoji: "🍠", group: "Legume" },
      { name: "Batata", emoji: "🥔", group: "Legume" },
      { name: "Mandioquinha", emoji: "🥔", group: "Legume" },
      { name: "Inhame", emoji: "🥔", group: "Legume" },
      { name: "Mandioca", emoji: "🥔", group: "Legume" },
    ],
  },
];

// Flat list of all items for search
export function getAllPantryItems(): PantryItem[] {
  return pantryCategories.flatMap((c) => c.items);
}
