// ── Types ──

export interface Preparation {
  type: string;
  instructions: string;
  texture: string;
  tips: string;
}

export interface PremiumFood {
  id: number;
  name: string;
  emoji: string;
  age: string;
  category: string;
  attention: string;
  canFreeze: boolean;
  canLunchbox: boolean;
  preparations: Preparation[];
}

// ── Emoji map ──

const foodEmojiMap: Record<string, string> = {
  "Melancia": "🍉", "Banana": "🍌", "Morango": "🍓", "Abacate": "🥑",
  "Manga": "🥭", "Pêssego": "🍑", "Figo": "🫐", "Maçã": "🍎",
  "Pera": "🍐", "Mamão": "🥭", "Kiwi": "🥝", "Uva": "🍇",
  "Ameixa": "🫐", "Caqui": "🍊", "Goiaba": "🍈", "Abacaxi": "🍍",
  "Laranja": "🍊", "Tangerina": "🍊", "Melão": "🍈", "Framboesa": "🫐",
  "Mirtilo": "🫐", "Pitaya": "🐉", "Carambola": "⭐", "Lichia": "🍒",
  "Maracujá": "💛", "Jabuticaba": "🟣", "Acerola": "🍒", "Coco fresco": "🥥",
  "Damasco": "🍑", "Nectarina": "🍑",
  "Abobrinha": "🥒", "Cenoura": "🥕", "Batata doce": "🍠", "Brócolis": "🥦",
  "Beterraba": "🟣", "Abóbora": "🎃", "Espinafre": "🥬", "Couve-flor": "🥦",
  "Chuchu": "🥒", "Berinjela": "🍆", "Vagem": "🫛", "Ervilha": "🫛",
  "Milho": "🌽", "Pepino": "🥒", "Tomate": "🍅", "Pimentão": "🫑",
  "Inhame": "🥔", "Mandioca": "🥔", "Mandioquinha": "🥔", "Batata": "🥔",
  "Nabo": "🥔", "Rabanete": "🥕", "Aspargo": "🌿", "Alcachofra": "🌿",
  "Jiló": "🟢", "Quiabo": "🟢", "Couve": "🥬", "Rúcula": "🥬",
  "Alface": "🥬", "Repolho": "🥬",
  "Frango": "🍗", "Ovo": "🥚", "Carne bovina": "🥩", "Peixe branco": "🐟",
  "Salmão": "🐟", "Sardinha": "🐟", "Feijão": "🫘", "Lentilha": "🫘",
  "Grão-de-bico": "🫘", "Tofu": "🧈", "Peru": "🍗", "Fígado de frango": "🍖",
  "Carne de porco": "🥩", "Camarão": "🦐", "Ervilha seca": "🫛",
  "Edamame": "🫛", "Iogurte natural": "🥛", "Queijo cottage": "🧀",
  "Ricota": "🧀", "Amendoim": "🥜", "Castanha de caju": "🥜",
  "Castanha-do-pará": "🥜", "Nozes": "🥜",
  "Arroz": "🍚", "Aveia": "🥣", "Quinoa": "🌾", "Macarrão integral": "🍝",
  "Pão integral": "🍞", "Tapioca": "🫓", "Painço": "🌾", "Amaranto": "🌾",
  "Cuscuz": "🫓", "Farinha de mandioca": "🫓", "Polenta": "🌽",
  "Granola sem açúcar": "🥣",
  "Semente de chia": "🌱", "Semente de linhaça": "🌱", "Gergelim": "🌱",
  "Semente de abóbora": "🌱", "Semente de girassol": "🌻",
  "Cúrcuma": "🟡", "Canela": "🟤", "Salsinha": "🌿", "Cebolinha": "🌿",
  "Alho": "🧄", "Cebola": "🧅", "Manjericão": "🌿", "Orégano": "🌿",
  "Alecrim": "🌿", "Gengibre": "🫚", "Coentro": "🌿", "Hortelã": "🌿",
  "Tomilho": "🌿", "Louro": "🍃", "Noz-moscada": "🟤",
};

const categoryEmoji: Record<string, string> = {
  fruta: "🍎", legume: "🥦", proteína: "🍗", grão: "🌾", tempero: "🌿",
};

function getEmoji(name: string): string {
  if (foodEmojiMap[name]) return foodEmojiMap[name];
  for (const key of Object.keys(foodEmojiMap)) {
    if (name.startsWith(key)) return foodEmojiMap[key];
  }
  return "🥗";
}

// ── Standard preparation sets ──

const vegPreps: Preparation[] = [
  { type: "Cozido(a)", instructions: "Cozinhe em água até ficar bem macia. Sirva em palitos ou cubos.", texture: "Macia e fácil de amassar.", tips: "Ideal para bebês iniciantes. Teste com garfo antes de servir." },
  { type: "Ao vapor", instructions: "Cozinhe ao vapor por 10-15 minutos até ficar tenra.", texture: "Macia, mantém mais nutrientes.", tips: "Preserve vitaminas cozinhando ao vapor ao invés de ferver." },
  { type: "Assado(a)", instructions: "Asse em forno a 180°C por 20-30 min com fio de azeite.", texture: "Levemente firme por fora, macia por dentro.", tips: "Corte em palitos antes de assar para facilitar." },
  { type: "Grelhado(a)", instructions: "Grelhe em frigideira antiaderente com fio de azeite.", texture: "Levemente dourada, macia por dentro.", tips: "Fique atento para não ressecar demais." },
  { type: "Refogado(a)", instructions: "Refogue com azeite, alho e cebola em fogo baixo.", texture: "Macia e saborosa.", tips: "Ótima forma de combinar com temperos naturais." },
];

const fruitPreps: Preparation[] = [
  { type: "In natura", instructions: "Ofereça madura, em fatias, tiras ou amassada.", texture: "Macia e natural.", tips: "Sempre verifique se está bem madura para facilitar a mastigação." },
  { type: "Amassada", instructions: "Amasse com garfo até formar uma papa.", texture: "Cremosa e fácil de engolir.", tips: "Ideal para bebês em início de introdução alimentar." },
  { type: "Cozida", instructions: "Cozinhe brevemente em água ou ao vapor.", texture: "Mais macia que in natura.", tips: "Bom para frutas mais firmes como maçã e pera." },
];

const proteinPreps: Preparation[] = [
  { type: "Cozido(a)", instructions: "Cozinhe bem em água temperada até ficar macia.", texture: "Macia e fácil de desfiar.", tips: "Desfie bem para bebês menores." },
  { type: "Grelhado(a)", instructions: "Grelhe em frigideira com fio de azeite.", texture: "Levemente firme, suculenta.", tips: "Não deixe passar do ponto para não ressecar." },
  { type: "Assado(a)", instructions: "Asse em forno a 180°C até dourar.", texture: "Firme por fora, macia por dentro.", tips: "Corte em tiras finas para facilitar." },
  { type: "Desfiado(a)", instructions: "Cozinhe e desfie em pedaços pequenos.", texture: "Macia, fácil de pegar.", tips: "Ideal para BLW e primeiras experiências." },
];

const grainPreps: Preparation[] = [
  { type: "Cozido(a)", instructions: "Cozinhe em água até ficar macia.", texture: "Macia e solta.", tips: "Use proporção correta de água." },
  { type: "Em mingau", instructions: "Cozinhe com leite materno ou fórmula até cremoso.", texture: "Cremosa.", tips: "Não adicione açúcar." },
];

const spicePreps: Preparation[] = [
  { type: "Em preparações", instructions: "Adicione pitadas durante o cozimento.", texture: "Integrada ao prato.", tips: "Use quantidades pequenas para acostumar o paladar." },
];

function getPreps(cat: string): Preparation[] {
  switch (cat) {
    case "fruta": return fruitPreps;
    case "legume": return vegPreps;
    case "proteína": return proteinPreps;
    case "grão": return grainPreps;
    case "tempero": return spicePreps;
    default: return vegPreps;
  }
}

// ── Food templates (unique base foods only) ──

interface FoodBase {
  name: string;
  age: string;
  category: string;
  attention: string;
  canFreeze: boolean;
  canLunchbox: boolean;
  customPreps?: Preparation[];
}

const foodBases: FoodBase[] = [
  // ===== FRUTAS (30) =====
  { name: "Melancia", age: "+6m", category: "fruta", attention: "Risco baixo se cortada corretamente.", canFreeze: false, canLunchbox: true },
  { name: "Banana", age: "+6m", category: "fruta", attention: "Pode causar constipação em excesso.", canFreeze: true, canLunchbox: true },
  { name: "Morango", age: "+6m", category: "fruta", attention: "Alérgeno potencial.", canFreeze: true, canLunchbox: true },
  { name: "Abacate", age: "+6m", category: "fruta", attention: "Sem restrições.", canFreeze: false, canLunchbox: false },
  { name: "Manga", age: "+6m", category: "fruta", attention: "Pode causar alergia em alguns.", canFreeze: true, canLunchbox: true },
  { name: "Pêssego", age: "+6m", category: "fruta", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Figo", age: "+6m", category: "fruta", attention: "Sem restrições.", canFreeze: false, canLunchbox: true },
  { name: "Maçã", age: "+6m", category: "fruta", attention: "⚠️ Crua pode engasgar. Sempre cozida.", canFreeze: true, canLunchbox: true },
  { name: "Pera", age: "+6m", category: "fruta", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Mamão", age: "+6m", category: "fruta", attention: "Laxativo natural.", canFreeze: false, canLunchbox: true },
  { name: "Kiwi", age: "+8m", category: "fruta", attention: "Pode ser ácido para alguns bebês.", canFreeze: true, canLunchbox: true },
  { name: "Uva", age: "+9m", category: "fruta", attention: "⚠️ ALTO risco de engasgo se inteira. SEMPRE cortar ao meio.", canFreeze: false, canLunchbox: true },
  { name: "Ameixa", age: "+6m", category: "fruta", attention: "Laxativo natural.", canFreeze: true, canLunchbox: true },
  { name: "Caqui", age: "+6m", category: "fruta", attention: "Sem restrições.", canFreeze: false, canLunchbox: false },
  { name: "Goiaba", age: "+6m", category: "fruta", attention: "Sementes podem ser difíceis.", canFreeze: true, canLunchbox: true },
  { name: "Abacaxi", age: "+9m", category: "fruta", attention: "Pode irritar a boca, ácido.", canFreeze: true, canLunchbox: true },
  { name: "Laranja", age: "+8m", category: "fruta", attention: "Ácida, introduza aos poucos.", canFreeze: false, canLunchbox: true },
  { name: "Tangerina", age: "+8m", category: "fruta", attention: "Ácida.", canFreeze: false, canLunchbox: true },
  { name: "Melão", age: "+6m", category: "fruta", attention: "Sem restrições.", canFreeze: false, canLunchbox: true },
  { name: "Framboesa", age: "+6m", category: "fruta", attention: "Alérgeno potencial.", canFreeze: true, canLunchbox: true },
  { name: "Mirtilo", age: "+6m", category: "fruta", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Pitaya", age: "+8m", category: "fruta", attention: "Pode colorir fezes.", canFreeze: true, canLunchbox: true },
  { name: "Carambola", age: "+12m", category: "fruta", attention: "⚠️ Contraindicada para bebês com problemas renais.", canFreeze: false, canLunchbox: true },
  { name: "Lichia", age: "+12m", category: "fruta", attention: "⚠️ Risco de engasgo, sempre cortada.", canFreeze: false, canLunchbox: true },
  { name: "Maracujá", age: "+9m", category: "fruta", attention: "Muito ácido, use com moderação.", canFreeze: true, canLunchbox: false },
  { name: "Jabuticaba", age: "+9m", category: "fruta", attention: "Casca pode ser difícil.", canFreeze: true, canLunchbox: false },
  { name: "Acerola", age: "+8m", category: "fruta", attention: "Muito ácida.", canFreeze: true, canLunchbox: false },
  { name: "Coco fresco", age: "+6m", category: "fruta", attention: "Rico em gordura boa.", canFreeze: true, canLunchbox: true },
  { name: "Damasco", age: "+6m", category: "fruta", attention: "Seco pode ter açúcar adicionado.", canFreeze: true, canLunchbox: true },
  { name: "Nectarina", age: "+6m", category: "fruta", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },

  // ===== LEGUMES E VERDURAS (30) =====
  { name: "Abobrinha", age: "+6m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Cenoura", age: "+6m", category: "legume", attention: "⚠️ Crua = alto risco de engasgo.", canFreeze: true, canLunchbox: false },
  { name: "Batata doce", age: "+6m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Brócolis", age: "+6m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Beterraba", age: "+6m", category: "legume", attention: "Pode tingir fezes e urina.", canFreeze: true, canLunchbox: true },
  { name: "Abóbora", age: "+6m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Espinafre", age: "+6m", category: "legume", attention: "⚠️ Contém oxalato, ofereça com moderação.", canFreeze: true, canLunchbox: true },
  { name: "Couve-flor", age: "+6m", category: "legume", attention: "Pode causar gases.", canFreeze: true, canLunchbox: true },
  { name: "Chuchu", age: "+6m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Berinjela", age: "+6m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Vagem", age: "+6m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Ervilha", age: "+6m", category: "legume", attention: "⚠️ Inteira pode ser risco, amasse.", canFreeze: true, canLunchbox: true },
  { name: "Milho", age: "+9m", category: "legume", attention: "Grãos inteiros podem ser difíceis.", canFreeze: true, canLunchbox: true },
  { name: "Pepino", age: "+6m", category: "legume", attention: "Pode ser oferecido cru se maduro.", canFreeze: false, canLunchbox: true },
  { name: "Tomate", age: "+6m", category: "legume", attention: "Ácido, pode irritar.", canFreeze: true, canLunchbox: true },
  { name: "Pimentão", age: "+8m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Inhame", age: "+6m", category: "legume", attention: "Sem restrições. Ótimo primeiro alimento.", canFreeze: true, canLunchbox: true },
  { name: "Mandioca", age: "+6m", category: "legume", attention: "Deve estar bem cozida.", canFreeze: true, canLunchbox: true },
  { name: "Mandioquinha", age: "+6m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Batata", age: "+6m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Nabo", age: "+6m", category: "legume", attention: "Sabor pode ser forte.", canFreeze: true, canLunchbox: true },
  { name: "Rabanete", age: "+9m", category: "legume", attention: "Sabor picante, cozinhe.", canFreeze: true, canLunchbox: true },
  { name: "Aspargo", age: "+8m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Alcachofra", age: "+12m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Jiló", age: "+12m", category: "legume", attention: "Sabor amargo.", canFreeze: true, canLunchbox: true },
  { name: "Quiabo", age: "+9m", category: "legume", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Couve", age: "+6m", category: "legume", attention: "Rica em ferro e cálcio.", canFreeze: true, canLunchbox: true },
  { name: "Rúcula", age: "+8m", category: "legume", attention: "Sabor forte/picante.", canFreeze: false, canLunchbox: false },
  { name: "Alface", age: "+9m", category: "legume", attention: "Sem restrições.", canFreeze: false, canLunchbox: true },
  { name: "Repolho", age: "+6m", category: "legume", attention: "Pode causar gases.", canFreeze: true, canLunchbox: true },

  // ===== PROTEÍNAS (23) =====
  { name: "Frango", age: "+6m", category: "proteína", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Ovo", age: "+6m", category: "proteína", attention: "⚠️ Alérgeno. Introduza gradualmente.", canFreeze: false, canLunchbox: true },
  { name: "Carne bovina", age: "+6m", category: "proteína", attention: "Rica em ferro.", canFreeze: true, canLunchbox: true },
  { name: "Peixe branco", age: "+6m", category: "proteína", attention: "⚠️ Alérgeno. Verifique espinhas.", canFreeze: true, canLunchbox: true },
  { name: "Salmão", age: "+8m", category: "proteína", attention: "⚠️ Alérgeno. Rico em ômega-3.", canFreeze: true, canLunchbox: true },
  { name: "Sardinha", age: "+8m", category: "proteína", attention: "Rica em ômega-3 e cálcio.", canFreeze: true, canLunchbox: true },
  { name: "Feijão", age: "+6m", category: "proteína", attention: "Pode causar gases.", canFreeze: true, canLunchbox: true },
  { name: "Lentilha", age: "+6m", category: "proteína", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Grão-de-bico", age: "+6m", category: "proteína", attention: "Inteiro pode ser risco.", canFreeze: true, canLunchbox: true },
  { name: "Tofu", age: "+6m", category: "proteína", attention: "⚠️ Derivado de soja, alérgeno.", canFreeze: true, canLunchbox: true },
  { name: "Peru", age: "+6m", category: "proteína", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Fígado de frango", age: "+6m", category: "proteína", attention: "Muito rico em ferro e vitamina A.", canFreeze: true, canLunchbox: true },
  { name: "Carne de porco", age: "+8m", category: "proteína", attention: "Escolha cortes magros.", canFreeze: true, canLunchbox: true },
  { name: "Camarão", age: "+12m", category: "proteína", attention: "⚠️ Alérgeno potente.", canFreeze: true, canLunchbox: true },
  { name: "Ervilha seca", age: "+6m", category: "proteína", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Edamame", age: "+9m", category: "proteína", attention: "Derivado de soja.", canFreeze: true, canLunchbox: true },
  { name: "Iogurte natural", age: "+6m", category: "proteína", attention: "⚠️ Derivado de leite. Sem açúcar!", canFreeze: false, canLunchbox: true },
  { name: "Queijo cottage", age: "+9m", category: "proteína", attention: "⚠️ Derivado de leite.", canFreeze: false, canLunchbox: true },
  { name: "Ricota", age: "+9m", category: "proteína", attention: "⚠️ Derivado de leite.", canFreeze: false, canLunchbox: true },
  { name: "Amendoim", age: "+6m", category: "proteína", attention: "⚠️ Alérgeno potente. Introduza cedo em pequena quantidade.", canFreeze: false, canLunchbox: true },
  { name: "Castanha de caju", age: "+6m", category: "proteína", attention: "⚠️ Inteira = risco de engasgo.", canFreeze: false, canLunchbox: true },
  { name: "Castanha-do-pará", age: "+12m", category: "proteína", attention: "⚠️ Inteira = risco de engasgo. Rica em selênio.", canFreeze: false, canLunchbox: false },
  { name: "Nozes", age: "+9m", category: "proteína", attention: "⚠️ Alérgeno. Nunca inteira.", canFreeze: false, canLunchbox: true },

  // ===== GRÃOS E CEREAIS (17) =====
  { name: "Arroz", age: "+6m", category: "grão", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Aveia", age: "+6m", category: "grão", attention: "⚠️ Pode conter glúten por contaminação cruzada.", canFreeze: true, canLunchbox: true },
  { name: "Quinoa", age: "+8m", category: "grão", attention: "Sem restrições. Superalimento.", canFreeze: true, canLunchbox: true },
  { name: "Macarrão integral", age: "+8m", category: "grão", attention: "⚠️ Contém glúten.", canFreeze: true, canLunchbox: true },
  { name: "Pão integral", age: "+8m", category: "grão", attention: "⚠️ Contém glúten. Sem açúcar.", canFreeze: true, canLunchbox: true },
  { name: "Tapioca", age: "+6m", category: "grão", attention: "Sem glúten.", canFreeze: false, canLunchbox: true },
  { name: "Painço", age: "+8m", category: "grão", attention: "Sem glúten.", canFreeze: true, canLunchbox: true },
  { name: "Amaranto", age: "+8m", category: "grão", attention: "Sem glúten, rico em proteínas.", canFreeze: true, canLunchbox: true },
  { name: "Cuscuz", age: "+8m", category: "grão", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Farinha de mandioca", age: "+9m", category: "grão", attention: "Sem restrições.", canFreeze: false, canLunchbox: true },
  { name: "Polenta", age: "+8m", category: "grão", attention: "Sem glúten.", canFreeze: true, canLunchbox: true },
  { name: "Granola sem açúcar", age: "+12m", category: "grão", attention: "Verificar rótulo - sem açúcar.", canFreeze: false, canLunchbox: true },
  { name: "Semente de chia", age: "+6m", category: "grão", attention: "⚠️ Seca pode engasgar, sempre hidratar.", canFreeze: false, canLunchbox: true },
  { name: "Semente de linhaça", age: "+6m", category: "grão", attention: "Rica em ômega-3.", canFreeze: false, canLunchbox: true },
  { name: "Gergelim", age: "+6m", category: "grão", attention: "⚠️ Alérgeno. Introduza gradualmente.", canFreeze: false, canLunchbox: true },
  { name: "Semente de abóbora", age: "+9m", category: "grão", attention: "Sempre moída para bebês.", canFreeze: false, canLunchbox: true },
  { name: "Semente de girassol", age: "+9m", category: "grão", attention: "Sempre moída para bebês.", canFreeze: false, canLunchbox: true },

  // ===== TEMPEROS E ERVAS (15) =====
  { name: "Cúrcuma", age: "+6m", category: "tempero", attention: "Anti-inflamatório natural.", canFreeze: false, canLunchbox: false },
  { name: "Canela", age: "+6m", category: "tempero", attention: "Sem restrições em pequenas quantidades.", canFreeze: false, canLunchbox: false },
  { name: "Salsinha", age: "+6m", category: "tempero", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Cebolinha", age: "+6m", category: "tempero", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Alho", age: "+6m", category: "tempero", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Cebola", age: "+6m", category: "tempero", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Manjericão", age: "+6m", category: "tempero", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Orégano", age: "+6m", category: "tempero", attention: "Sem restrições em pequenas quantidades.", canFreeze: false, canLunchbox: false },
  { name: "Alecrim", age: "+8m", category: "tempero", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Gengibre", age: "+9m", category: "tempero", attention: "Sabor forte, use pouco.", canFreeze: true, canLunchbox: false },
  { name: "Coentro", age: "+6m", category: "tempero", attention: "Sabor forte.", canFreeze: true, canLunchbox: false },
  { name: "Hortelã", age: "+8m", category: "tempero", attention: "Sem restrições.", canFreeze: false, canLunchbox: false },
  { name: "Tomilho", age: "+8m", category: "tempero", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Louro", age: "+6m", category: "tempero", attention: "⚠️ Sempre retirar do prato.", canFreeze: false, canLunchbox: false },
  { name: "Noz-moscada", age: "+9m", category: "tempero", attention: "Use com muita moderação.", canFreeze: false, canLunchbox: false },
];

// ── Build final list with emojis and preparations ──

export const premiumFoods: PremiumFood[] = foodBases
  .map((f, i) => ({
    id: i + 1,
    name: f.name,
    emoji: getEmoji(f.name),
    age: f.age,
    category: f.category,
    attention: f.attention,
    canFreeze: f.canFreeze,
    canLunchbox: f.canLunchbox,
    preparations: f.customPreps || getPreps(f.category),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

export const freeFoods = premiumFoods.slice(0, 12);

export const foodCategories = ["Todos", "Fruta", "Legume", "Proteína", "Grão", "Tempero"];
