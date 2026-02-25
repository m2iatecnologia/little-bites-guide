// Large dataset of recipes for premium users

export interface PremiumRecipe {
  id: number;
  name: string;
  image: string;
  age: string;
  difficulty: string;
  time: string;
  rating: number;
  premium: boolean;
  canFreeze: boolean;
  ingredients: string[];
  instructions: string;
  diet: string;
  category: string;
}

const images = ["muffin", "picole", "cenoura", "banana", "morango", "abacate", "melancia"];
const pickImg = () => images[Math.floor(Math.random() * images.length)];

interface RecipeTemplate {
  name: string;
  age: string;
  difficulty: string;
  time: string;
  rating: number;
  premium: boolean;
  canFreeze: boolean;
  ingredients: string[];
  instructions: string;
  diet: string;
  category: string;
}

const recipeTemplates: RecipeTemplate[] = [
  // ===== CAFÉ DA MANHÃ =====
  { name: "Panqueca de Banana", age: "+6m", difficulty: "Fácil", time: "15 min", rating: 4.9, premium: false, canFreeze: true, ingredients: ["1 banana", "1 ovo", "Canela"], instructions: "Amasse a banana, misture com o ovo. Cozinhe em frigideira antiaderente.", diet: "vegetariano", category: "café da manhã" },
  { name: "Mingau de Aveia com Frutas", age: "+6m", difficulty: "Fácil", time: "10 min", rating: 4.7, premium: false, canFreeze: false, ingredients: ["3 col. aveia", "Leite materno ou fórmula", "Frutas picadas"], instructions: "Cozinhe a aveia com o leite. Adicione frutas amassadas.", diet: "vegetariano", category: "café da manhã" },
  { name: "Crepioca com Banana", age: "+8m", difficulty: "Fácil", time: "10 min", rating: 4.8, premium: true, canFreeze: false, ingredients: ["2 col. tapioca", "1 ovo", "Banana"], instructions: "Misture tapioca e ovo. Cozinhe como panqueca. Recheie com banana.", diet: "vegetariano", category: "café da manhã" },
  { name: "Waffle de Batata Doce", age: "+9m", difficulty: "Médio", time: "25 min", rating: 4.6, premium: true, canFreeze: true, ingredients: ["1 batata doce cozida", "2 ovos", "3 col. farinha integral"], instructions: "Amasse a batata doce, misture com ovos e farinha. Cozinhe na máquina de waffle.", diet: "vegetariano", category: "café da manhã" },
  { name: "Omelete de Espinafre", age: "+8m", difficulty: "Fácil", time: "10 min", rating: 4.5, premium: true, canFreeze: false, ingredients: ["2 ovos", "Espinafre picado", "Azeite"], instructions: "Bata ovos, adicione espinafre. Cozinhe em frigideira.", diet: "vegetariano", category: "café da manhã" },
  { name: "Panqueca de Abóbora", age: "+6m", difficulty: "Fácil", time: "15 min", rating: 4.7, premium: true, canFreeze: true, ingredients: ["1/2 xíc. abóbora cozida", "1 ovo", "2 col. farinha aveia"], instructions: "Amasse a abóbora, misture ingredientes. Cozinhe em frigideira.", diet: "vegetariano", category: "café da manhã" },
  { name: "Bolinho de Banana e Aveia", age: "+8m", difficulty: "Fácil", time: "20 min", rating: 4.8, premium: true, canFreeze: true, ingredients: ["2 bananas", "1 xíc. aveia", "Canela"], instructions: "Amasse bananas, misture com aveia. Forme bolinhos. Asse 180°C 15 min.", diet: "vegano", category: "café da manhã" },
  { name: "Mingau de Quinoa", age: "+8m", difficulty: "Fácil", time: "15 min", rating: 4.5, premium: true, canFreeze: false, ingredients: ["3 col. quinoa", "Leite materno", "Fruta"], instructions: "Cozinhe a quinoa. Adicione leite e fruta amassada.", diet: "vegano", category: "café da manhã" },

  // ===== ALMOÇO =====
  { name: "Muffin de Espinafre e Batata Doce", age: "+9m", difficulty: "Fácil", time: "30 min", rating: 4.8, premium: false, canFreeze: true, ingredients: ["2 ovos", "1 xíc. batata doce cozida", "1/2 xíc. espinafre", "1/2 xíc. farinha integral", "Azeite"], instructions: "Misture todos. Asse a 180°C por 20 min.", diet: "tradicional", category: "almoço" },
  { name: "Purê de Cenoura e Batata", age: "+6m", difficulty: "Fácil", time: "20 min", rating: 4.7, premium: true, canFreeze: true, ingredients: ["2 cenouras", "1 batata", "Azeite"], instructions: "Cozinhe os legumes. Amasse com garfo.", diet: "vegano", category: "almoço" },
  { name: "Frango Desfiado com Legumes", age: "+6m", difficulty: "Médio", time: "40 min", rating: 4.9, premium: true, canFreeze: true, ingredients: ["1 peito frango", "Cenoura", "Batata", "Abobrinha"], instructions: "Cozinhe frango com legumes. Desfie o frango.", diet: "tradicional", category: "almoço" },
  { name: "Risoto de Abóbora", age: "+8m", difficulty: "Médio", time: "35 min", rating: 4.8, premium: true, canFreeze: true, ingredients: ["1 xíc. arroz", "Abóbora cozida", "Cebola", "Azeite"], instructions: "Refogue cebola, adicione arroz e abóbora. Cozinhe até cremoso.", diet: "vegano", category: "almoço" },
  { name: "Bolinho de Arroz e Feijão", age: "+9m", difficulty: "Médio", time: "30 min", rating: 4.6, premium: true, canFreeze: true, ingredients: ["1 xíc. arroz cozido", "1/2 xíc. feijão cozido", "1 ovo", "Temperos"], instructions: "Amasse feijão. Misture com arroz e ovo. Asse em forminhas.", diet: "vegetariano", category: "almoço" },
  { name: "Sopa de Lentilha", age: "+6m", difficulty: "Fácil", time: "30 min", rating: 4.7, premium: true, canFreeze: true, ingredients: ["1 xíc. lentilha", "Cenoura", "Batata", "Cebola"], instructions: "Cozinhe tudo junto até macio. Amasse ou bata.", diet: "vegano", category: "almoço" },
  { name: "Macarrão com Molho de Beterraba", age: "+8m", difficulty: "Fácil", time: "20 min", rating: 4.5, premium: true, canFreeze: true, ingredients: ["Macarrão cabelo de anjo", "1 beterraba cozida", "Azeite"], instructions: "Cozinhe o macarrão. Bata beterraba com azeite. Misture.", diet: "vegano", category: "almoço" },
  { name: "Carne Moída com Legumes", age: "+6m", difficulty: "Médio", time: "35 min", rating: 4.8, premium: true, canFreeze: true, ingredients: ["200g carne moída", "Cenoura", "Abobrinha", "Cebola"], instructions: "Refogue cebola, adicione carne e legumes picados.", diet: "tradicional", category: "almoço" },
  { name: "Nhoque de Batata Doce", age: "+9m", difficulty: "Médio", time: "40 min", rating: 4.7, premium: true, canFreeze: true, ingredients: ["2 batatas doce", "Farinha", "1 ovo"], instructions: "Amasse batata, misture ingredientes. Forme nhoque. Cozinhe em água.", diet: "vegetariano", category: "almoço" },
  { name: "Polenta com Ragu de Frango", age: "+8m", difficulty: "Médio", time: "30 min", rating: 4.6, premium: true, canFreeze: true, ingredients: ["Fubá", "Frango desfiado", "Molho de tomate caseiro"], instructions: "Prepare polenta. Sirva com frango desfiado no molho.", diet: "tradicional", category: "almoço" },

  // ===== LANCHE =====
  { name: "Picolé de Frutas", age: "+6m", difficulty: "Fácil", time: "10 min + congelar", rating: 4.9, premium: false, canFreeze: true, ingredients: ["1 manga", "1 xíc. morango", "Iogurte natural"], instructions: "Bata frutas no liquidificador. Misture com iogurte. Congele.", diet: "vegetariano", category: "lanche" },
  { name: "Smoothie de Frutas", age: "+8m", difficulty: "Fácil", time: "5 min", rating: 4.6, premium: false, canFreeze: false, ingredients: ["1 banana", "1 xíc. morango", "Leite materno"], instructions: "Bata tudo no liquidificador.", diet: "vegetariano", category: "lanche" },
  { name: "Bolo de Banana Integral", age: "+12m", difficulty: "Médio", time: "45 min", rating: 4.8, premium: true, canFreeze: true, ingredients: ["3 bananas", "2 ovos", "2 xíc. farinha integral"], instructions: "Amasse bananas, misture ovos e farinha. Asse 180°C por 35 min.", diet: "vegetariano", category: "lanche" },
  { name: "Palitos de Cenoura Assados", age: "+6m", difficulty: "Fácil", time: "25 min", rating: 4.5, premium: true, canFreeze: true, ingredients: ["3 cenouras", "Azeite", "Alecrim"], instructions: "Corte em palitos. Tempere com azeite. Asse 200°C por 20 min.", diet: "vegano", category: "lanche" },
  { name: "Bolinhas de Coco e Aveia", age: "+9m", difficulty: "Fácil", time: "15 min", rating: 4.7, premium: true, canFreeze: true, ingredients: ["1 xíc. aveia", "Coco ralado", "Banana amassada"], instructions: "Misture tudo. Forme bolinhas. Refrigere.", diet: "vegano", category: "lanche" },
  { name: "Chips de Batata Doce", age: "+9m", difficulty: "Fácil", time: "30 min", rating: 4.6, premium: true, canFreeze: false, ingredients: ["2 batatas doce", "Azeite"], instructions: "Fatie fino. Asse 180°C por 25 min.", diet: "vegano", category: "lanche" },
  { name: "Pudim de Chia com Manga", age: "+8m", difficulty: "Fácil", time: "10 min + gelar", rating: 4.8, premium: true, canFreeze: false, ingredients: ["3 col. chia", "Leite de coco", "Manga"], instructions: "Misture chia com leite. Refrigere 4h. Cubra com manga.", diet: "vegano", category: "lanche" },
  { name: "Biscoito de Aveia e Banana", age: "+9m", difficulty: "Fácil", time: "20 min", rating: 4.7, premium: true, canFreeze: true, ingredients: ["1 banana", "1 xíc. aveia"], instructions: "Amasse banana, misture aveia. Forme biscoitos. Asse 180°C 15 min.", diet: "vegano", category: "lanche" },

  // ===== JANTAR =====
  { name: "Sopinha de Legumes", age: "+6m", difficulty: "Fácil", time: "25 min", rating: 4.6, premium: true, canFreeze: true, ingredients: ["Batata", "Cenoura", "Chuchu", "Azeite"], instructions: "Cozinhe legumes, amasse com garfo. Regue com azeite.", diet: "vegano", category: "jantar" },
  { name: "Omelete de Forno", age: "+8m", difficulty: "Fácil", time: "20 min", rating: 4.5, premium: true, canFreeze: true, ingredients: ["3 ovos", "Brócolis", "Cenoura ralada"], instructions: "Bata ovos, misture legumes. Asse em forma untada 180°C 15 min.", diet: "vegetariano", category: "jantar" },
  { name: "Caldo de Feijão com Legumes", age: "+6m", difficulty: "Fácil", time: "30 min", rating: 4.7, premium: true, canFreeze: true, ingredients: ["Feijão cozido", "Abóbora", "Couve"], instructions: "Bata feijão com abóbora. Adicione couve refogada.", diet: "vegano", category: "jantar" },
  { name: "Peixe com Purê", age: "+8m", difficulty: "Médio", time: "30 min", rating: 4.8, premium: true, canFreeze: true, ingredients: ["Filé de peixe branco", "Batata", "Azeite"], instructions: "Cozinhe peixe ao vapor. Faça purê de batata. Sirva junto.", diet: "tradicional", category: "jantar" },
  { name: "Arroz com Lentilha", age: "+6m", difficulty: "Fácil", time: "25 min", rating: 4.6, premium: true, canFreeze: true, ingredients: ["Arroz", "Lentilha", "Cenoura", "Cebola"], instructions: "Cozinhe arroz e lentilha juntos com legumes.", diet: "vegano", category: "jantar" },
];

// Generate more recipe variations to increase count
const ageVars = ["+6m", "+7m", "+8m", "+9m", "+10m", "+12m"];
const additionalRecipes: RecipeTemplate[] = [];

const bases = [
  { base: "Papinha de", items: ["Manga e Banana", "Pera e Maçã", "Abacate com Banana", "Mamão e Laranja", "Goiaba e Pera", "Morango e Banana", "Pêssego e Maçã", "Ameixa e Pera", "Kiwi e Banana", "Melão e Manga"] },
  { base: "Purê de", items: ["Abóbora com Cenoura", "Batata com Brócolis", "Mandioquinha com Espinafre", "Inhame com Cenoura", "Batata Doce com Couve", "Chuchu com Batata", "Ervilha com Batata", "Beterraba com Batata", "Vagem com Cenoura", "Nabo com Batata"] },
  { base: "Bolinho de", items: ["Brócolis", "Couve-flor", "Espinafre", "Cenoura", "Batata Doce", "Mandioca", "Abóbora", "Milho", "Grão-de-bico", "Lentilha"] },
  { base: "Sopa de", items: ["Frango com Legumes", "Mandioquinha", "Abóbora com Gengibre", "Ervilha", "Cenoura e Inhame", "Batata com Couve", "Tomate", "Beterraba", "Milho Verde", "Feijão Branco"] },
];

bases.forEach(({ base, items }) => {
  items.forEach((item, idx) => {
    additionalRecipes.push({
      name: `${base} ${item}`,
      age: ageVars[idx % ageVars.length],
      difficulty: "Fácil",
      time: `${15 + idx * 2} min`,
      rating: 4.3 + Math.round(Math.random() * 6) / 10,
      premium: true,
      canFreeze: true,
      ingredients: item.split(" e ").concat(["Azeite"]),
      instructions: `Prepare ${item.toLowerCase()} e finalize com azeite.`,
      diet: idx % 3 === 0 ? "tradicional" : idx % 3 === 1 ? "vegetariano" : "vegano",
      category: base.includes("Papinha") || base.includes("Purê") ? "almoço" : base.includes("Sopa") ? "jantar" : "lanche",
    });
  });
});

export const premiumRecipes: PremiumRecipe[] = [...recipeTemplates, ...additionalRecipes].map((r, i) => ({
  ...r,
  id: i + 1,
  image: pickImg(),
}));

export const freeRecipes = premiumRecipes.filter(r => !r.premium).slice(0, 6);
export const recipeCategories = ["Todos", "Café da manhã", "Almoço", "Lanche", "Jantar"];
export const recipeAgeFilters = ["Todos", "+6m", "+7m", "+8m", "+9m", "+10m", "+12m"];
