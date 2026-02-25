export interface PremiumFood {
  id: number;
  name: string;
  emoji: string;
  age: string;
  category: string;
  howToOffer: string;
  texture: string;
  attention: string;
  canFreeze: boolean;
  canLunchbox: boolean;
}

// Deterministic emoji map — each food gets a matching emoji
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

function getEmoji(name: string, category: string): string {
  // Exact match
  if (foodEmojiMap[name]) return foodEmojiMap[name];
  // Check if the base name matches (e.g. "Batata doce ao vapor" → "Batata doce")
  for (const key of Object.keys(foodEmojiMap)) {
    if (name.startsWith(key)) return foodEmojiMap[key];
  }
  return categoryEmoji[category] || "🥗";
}

interface FoodTemplate {
  name: string;
  age: string;
  category: string;
  howToOffer: string;
  texture: string;
  attention: string;
  canFreeze: boolean;
  canLunchbox: boolean;
}

const foodTemplates: FoodTemplate[] = [
  // ===== FRUTAS =====
  { name: "Melancia", age: "+6m", category: "fruta", howToOffer: "Corte em palitos compridos, retire sementes.", texture: "Macia e suculenta.", attention: "Risco baixo se cortada corretamente.", canFreeze: false, canLunchbox: true },
  { name: "Banana", age: "+6m", category: "fruta", howToOffer: "Ofereça em palito com casca para BLW.", texture: "Macia e fácil de amassar.", attention: "Pode causar constipação em excesso.", canFreeze: true, canLunchbox: true },
  { name: "Morango", age: "+6m", category: "fruta", howToOffer: "Corte ao meio ou em quartos.", texture: "Macia, boa aceitação.", attention: "Alérgeno potencial.", canFreeze: true, canLunchbox: true },
  { name: "Abacate", age: "+6m", category: "fruta", howToOffer: "Em fatias ou amassado.", texture: "Cremoso.", attention: "Sem restrições.", canFreeze: false, canLunchbox: false },
  { name: "Manga", age: "+6m", category: "fruta", howToOffer: "Tiras ou cubos maduros.", texture: "Macia e suculenta.", attention: "Pode causar alergia em alguns.", canFreeze: true, canLunchbox: true },
  { name: "Pêssego", age: "+6m", category: "fruta", howToOffer: "Fatias sem casca.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Figo", age: "+6m", category: "fruta", howToOffer: "Aberto ao meio.", texture: "Macia e doce.", attention: "Sem restrições.", canFreeze: false, canLunchbox: true },
  { name: "Maçã", age: "+6m", category: "fruta", howToOffer: "Cozida ao vapor, em tiras ou ralada.", texture: "Crua é dura, cozinhe bem.", attention: "⚠️ Crua pode engasgar. Sempre cozida.", canFreeze: true, canLunchbox: true },
  { name: "Pera", age: "+6m", category: "fruta", howToOffer: "Madura em fatias ou cozida.", texture: "Macia quando madura.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Mamão", age: "+6m", category: "fruta", howToOffer: "Em cubos ou amassado.", texture: "Bem macia.", attention: "Laxativo natural.", canFreeze: false, canLunchbox: true },
  { name: "Kiwi", age: "+8m", category: "fruta", howToOffer: "Em fatias finas ou rodelas.", texture: "Macia.", attention: "Pode ser ácido para alguns bebês.", canFreeze: true, canLunchbox: true },
  { name: "Uva", age: "+9m", category: "fruta", howToOffer: "⚠️ SEMPRE cortada ao meio no sentido longitudinal.", texture: "Firme.", attention: "⚠️ ALTO risco de engasgo se inteira.", canFreeze: false, canLunchbox: true },
  { name: "Ameixa", age: "+6m", category: "fruta", howToOffer: "Madura, sem caroço, em fatias.", texture: "Macia.", attention: "Laxativo natural.", canFreeze: true, canLunchbox: true },
  { name: "Caqui", age: "+6m", category: "fruta", howToOffer: "Maduro, em fatias ou amassado.", texture: "Bem macia quando maduro.", attention: "Sem restrições.", canFreeze: false, canLunchbox: false },
  { name: "Goiaba", age: "+6m", category: "fruta", howToOffer: "Sem sementes, em pedaços.", texture: "Macia.", attention: "Sementes podem ser difíceis.", canFreeze: true, canLunchbox: true },
  { name: "Abacaxi", age: "+9m", category: "fruta", howToOffer: "Em tiras finas, bem maduro.", texture: "Fibrosa.", attention: "Pode irritar a boca, ácido.", canFreeze: true, canLunchbox: true },
  { name: "Laranja", age: "+8m", category: "fruta", howToOffer: "Em gomos sem membrana.", texture: "Suculenta.", attention: "Ácida, introduza aos poucos.", canFreeze: false, canLunchbox: true },
  { name: "Tangerina", age: "+8m", category: "fruta", howToOffer: "Em gomos sem membrana.", texture: "Suculenta.", attention: "Ácida.", canFreeze: false, canLunchbox: true },
  { name: "Melão", age: "+6m", category: "fruta", howToOffer: "Em tiras ou cubos.", texture: "Macia e suculenta.", attention: "Sem restrições.", canFreeze: false, canLunchbox: true },
  { name: "Framboesa", age: "+6m", category: "fruta", howToOffer: "Inteiras ou amassadas.", texture: "Macia.", attention: "Alérgeno potencial.", canFreeze: true, canLunchbox: true },
  { name: "Mirtilo", age: "+6m", category: "fruta", howToOffer: "Amassados ou cortados ao meio.", texture: "Pequenos, amassar para segurança.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Pitaya", age: "+8m", category: "fruta", howToOffer: "Em cubos.", texture: "Macia.", attention: "Pode colorir fezes.", canFreeze: true, canLunchbox: true },
  { name: "Carambola", age: "+12m", category: "fruta", howToOffer: "Em fatias finas.", texture: "Crocante.", attention: "⚠️ Contraindicada para bebês com problemas renais.", canFreeze: false, canLunchbox: true },
  { name: "Lichia", age: "+12m", category: "fruta", howToOffer: "Sem caroço, cortada.", texture: "Macia.", attention: "⚠️ Risco de engasgo, sempre cortada.", canFreeze: false, canLunchbox: true },
  { name: "Maracujá", age: "+9m", category: "fruta", howToOffer: "Polpa coada ou em preparações.", texture: "Líquida/sementes.", attention: "Muito ácido, use com moderação.", canFreeze: true, canLunchbox: false },
  { name: "Jabuticaba", age: "+9m", category: "fruta", howToOffer: "Amassada, sem casca.", texture: "Macia.", attention: "Casca pode ser difícil.", canFreeze: true, canLunchbox: false },
  { name: "Acerola", age: "+8m", category: "fruta", howToOffer: "Amassada ou em suco.", texture: "Macia.", attention: "Muito ácida.", canFreeze: true, canLunchbox: false },
  { name: "Coco fresco", age: "+6m", category: "fruta", howToOffer: "Ralado ou em lascas finas.", texture: "Fibrosa.", attention: "Rico em gordura boa.", canFreeze: true, canLunchbox: true },
  { name: "Damasco", age: "+6m", category: "fruta", howToOffer: "Fresco em fatias ou seco hidratado.", texture: "Macia.", attention: "Seco pode ter açúcar adicionado.", canFreeze: true, canLunchbox: true },
  { name: "Nectarina", age: "+6m", category: "fruta", howToOffer: "Em fatias sem caroço.", texture: "Macia quando madura.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },

  // ===== LEGUMES E VERDURAS =====
  { name: "Abobrinha", age: "+6m", category: "legume", howToOffer: "Cozinhe ao vapor, em palitos.", texture: "Macia quando cozida.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Cenoura", age: "+6m", category: "legume", howToOffer: "Cozinhe bem até ficar macia, em palitos grossos.", texture: "Deve estar bem macia.", attention: "⚠️ Crua = alto risco de engasgo.", canFreeze: true, canLunchbox: false },
  { name: "Batata doce", age: "+6m", category: "legume", howToOffer: "Assada ou cozida em palitos.", texture: "Bem macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Brócolis", age: "+6m", category: "legume", howToOffer: "Cozido ao vapor, em buquês.", texture: "Firme mas macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Beterraba", age: "+6m", category: "legume", howToOffer: "Cozida em palitos ou ralada.", texture: "Macia quando cozida.", attention: "Pode tingir fezes e urina.", canFreeze: true, canLunchbox: true },
  { name: "Abóbora", age: "+6m", category: "legume", howToOffer: "Assada ou cozida em cubos.", texture: "Bem macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Espinafre", age: "+6m", category: "legume", howToOffer: "Cozido, em preparações.", texture: "Macia.", attention: "⚠️ Contém oxalato, ofereça com moderação.", canFreeze: true, canLunchbox: true },
  { name: "Couve-flor", age: "+6m", category: "legume", howToOffer: "Cozida ao vapor, em buquês.", texture: "Macia.", attention: "Pode causar gases.", canFreeze: true, canLunchbox: true },
  { name: "Chuchu", age: "+6m", category: "legume", howToOffer: "Cozido em palitos.", texture: "Bem macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Berinjela", age: "+6m", category: "legume", howToOffer: "Assada ou grelhada em tiras.", texture: "Macia quando cozida.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Vagem", age: "+6m", category: "legume", howToOffer: "Cozida ao vapor, inteira.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Ervilha", age: "+6m", category: "legume", howToOffer: "Cozida, amassada para bebês menores.", texture: "Macia.", attention: "⚠️ Inteira pode ser risco, amasse.", canFreeze: true, canLunchbox: true },
  { name: "Milho", age: "+9m", category: "legume", howToOffer: "Espiga cozida ou grãos amassados.", texture: "Firme.", attention: "Grãos inteiros podem ser difíceis.", canFreeze: true, canLunchbox: true },
  { name: "Pepino", age: "+6m", category: "legume", howToOffer: "Em palitos, descascado.", texture: "Crocante.", attention: "Pode ser oferecido cru se maduro.", canFreeze: false, canLunchbox: true },
  { name: "Tomate", age: "+6m", category: "legume", howToOffer: "Sem pele e sementes, em pedaços.", texture: "Macia.", attention: "Ácido, pode irritar.", canFreeze: true, canLunchbox: true },
  { name: "Pimentão", age: "+8m", category: "legume", howToOffer: "Assado, sem pele, em tiras.", texture: "Macia quando assado.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Inhame", age: "+6m", category: "legume", howToOffer: "Cozido, em purê ou palitos.", texture: "Bem macia.", attention: "Sem restrições. Ótimo primeiro alimento.", canFreeze: true, canLunchbox: true },
  { name: "Mandioca", age: "+6m", category: "legume", howToOffer: "Cozida, em palitos.", texture: "Macia quando bem cozida.", attention: "Deve estar bem cozida.", canFreeze: true, canLunchbox: true },
  { name: "Mandioquinha", age: "+6m", category: "legume", howToOffer: "Cozida ou assada em palitos.", texture: "Bem macia e cremosa.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Batata", age: "+6m", category: "legume", howToOffer: "Cozida ou assada em palitos.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Nabo", age: "+6m", category: "legume", howToOffer: "Cozido, em purê ou palitos.", texture: "Macia quando cozido.", attention: "Sabor pode ser forte.", canFreeze: true, canLunchbox: true },
  { name: "Rabanete", age: "+9m", category: "legume", howToOffer: "Cozido, em fatias.", texture: "Firme cru, macia cozido.", attention: "Sabor picante, cozinhe.", canFreeze: true, canLunchbox: true },
  { name: "Aspargo", age: "+8m", category: "legume", howToOffer: "Cozido ao vapor, pontas.", texture: "Macia na ponta.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Alcachofra", age: "+12m", category: "legume", howToOffer: "Coração cozido.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Jiló", age: "+12m", category: "legume", howToOffer: "Refogado.", texture: "Firme.", attention: "Sabor amargo.", canFreeze: true, canLunchbox: true },
  { name: "Quiabo", age: "+9m", category: "legume", howToOffer: "Cozido ou refogado.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Couve", age: "+6m", category: "legume", howToOffer: "Refogada, bem picada.", texture: "Macia quando refogada.", attention: "Rica em ferro e cálcio.", canFreeze: true, canLunchbox: true },
  { name: "Rúcula", age: "+8m", category: "legume", howToOffer: "Em preparações cozidas.", texture: "Folha tenra.", attention: "Sabor forte/picante.", canFreeze: false, canLunchbox: false },
  { name: "Alface", age: "+9m", category: "legume", howToOffer: "Em tiras, crua ou cozida.", texture: "Crocante.", attention: "Sem restrições.", canFreeze: false, canLunchbox: true },
  { name: "Repolho", age: "+6m", category: "legume", howToOffer: "Cozido, refogado.", texture: "Macia quando cozido.", attention: "Pode causar gases.", canFreeze: true, canLunchbox: true },

  // ===== PROTEÍNAS =====
  { name: "Frango", age: "+6m", category: "proteína", howToOffer: "Desfiado ou em tiras cozidas.", texture: "Macia se bem cozido.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Ovo", age: "+6m", category: "proteína", howToOffer: "Cozido, em tiras ou amassado.", texture: "Firme.", attention: "⚠️ Alérgeno. Introduza gradualmente.", canFreeze: false, canLunchbox: true },
  { name: "Carne bovina", age: "+6m", category: "proteína", howToOffer: "Desfiada ou moída, bem cozida.", texture: "Macia se bem cozida.", attention: "Rica em ferro.", canFreeze: true, canLunchbox: true },
  { name: "Peixe branco", age: "+6m", category: "proteína", howToOffer: "Cozido, em lascas, sem espinhas.", texture: "Macia.", attention: "⚠️ Alérgeno. Verifique espinhas.", canFreeze: true, canLunchbox: true },
  { name: "Salmão", age: "+8m", category: "proteína", howToOffer: "Cozido ou assado, em lascas.", texture: "Macia.", attention: "⚠️ Alérgeno. Rico em ômega-3.", canFreeze: true, canLunchbox: true },
  { name: "Sardinha", age: "+8m", category: "proteína", howToOffer: "Cozida, sem espinhas.", texture: "Macia.", attention: "Rica em ômega-3 e cálcio.", canFreeze: true, canLunchbox: true },
  { name: "Feijão", age: "+6m", category: "proteína", howToOffer: "Cozido, amassado.", texture: "Macia.", attention: "Pode causar gases.", canFreeze: true, canLunchbox: true },
  { name: "Lentilha", age: "+6m", category: "proteína", howToOffer: "Cozida, em purê.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Grão-de-bico", age: "+6m", category: "proteína", howToOffer: "Cozido, amassado ou em hummus.", texture: "Macia quando amassado.", attention: "Inteiro pode ser risco.", canFreeze: true, canLunchbox: true },
  { name: "Tofu", age: "+6m", category: "proteína", howToOffer: "Em cubos ou tiras.", texture: "Macia.", attention: "⚠️ Derivado de soja, alérgeno.", canFreeze: true, canLunchbox: true },
  { name: "Peru", age: "+6m", category: "proteína", howToOffer: "Desfiado ou moído.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Fígado de frango", age: "+6m", category: "proteína", howToOffer: "Cozido e amassado ou ralado.", texture: "Macia.", attention: "Muito rico em ferro e vitamina A.", canFreeze: true, canLunchbox: true },
  { name: "Carne de porco", age: "+8m", category: "proteína", howToOffer: "Desfiada, sem gordura.", texture: "Macia se bem cozida.", attention: "Escolha cortes magros.", canFreeze: true, canLunchbox: true },
  { name: "Camarão", age: "+12m", category: "proteína", howToOffer: "Cozido, picado.", texture: "Firme.", attention: "⚠️ Alérgeno potente.", canFreeze: true, canLunchbox: true },
  { name: "Ervilha seca", age: "+6m", category: "proteína", howToOffer: "Cozida, em purê.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Edamame", age: "+9m", category: "proteína", howToOffer: "Cozido, amassado.", texture: "Macia.", attention: "Derivado de soja.", canFreeze: true, canLunchbox: true },
  { name: "Iogurte natural", age: "+6m", category: "proteína", howToOffer: "Sem açúcar, como base de papas.", texture: "Cremosa.", attention: "⚠️ Derivado de leite. Sem açúcar!", canFreeze: false, canLunchbox: true },
  { name: "Queijo cottage", age: "+9m", category: "proteína", howToOffer: "Puro ou em preparações.", texture: "Cremosa.", attention: "⚠️ Derivado de leite.", canFreeze: false, canLunchbox: true },
  { name: "Ricota", age: "+9m", category: "proteína", howToOffer: "Amassada ou em preparações.", texture: "Cremosa e macia.", attention: "⚠️ Derivado de leite.", canFreeze: false, canLunchbox: true },
  { name: "Amendoim", age: "+6m", category: "proteína", howToOffer: "Pasta fina ou moído em preparações.", texture: "Cremosa (pasta).", attention: "⚠️ Alérgeno potente. Introduza cedo em pequena quantidade.", canFreeze: false, canLunchbox: true },
  { name: "Castanha de caju", age: "+6m", category: "proteína", howToOffer: "Moída ou em pasta.", texture: "Cremosa.", attention: "⚠️ Inteira = risco de engasgo.", canFreeze: false, canLunchbox: true },
  { name: "Castanha-do-pará", age: "+12m", category: "proteína", howToOffer: "Ralada em preparações.", texture: "Dura.", attention: "⚠️ Inteira = risco de engasgo. Rica em selênio.", canFreeze: false, canLunchbox: false },
  { name: "Nozes", age: "+9m", category: "proteína", howToOffer: "Moídas em preparações.", texture: "Dura.", attention: "⚠️ Alérgeno. Nunca inteira.", canFreeze: false, canLunchbox: true },

  // ===== GRÃOS E CEREAIS =====
  { name: "Arroz", age: "+6m", category: "grão", howToOffer: "Bem cozido, papa ou solto.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Aveia", age: "+6m", category: "grão", howToOffer: "Mingau ou em preparações.", texture: "Cremosa.", attention: "⚠️ Pode conter glúten por contaminação cruzada.", canFreeze: true, canLunchbox: true },
  { name: "Quinoa", age: "+8m", category: "grão", howToOffer: "Cozida como acompanhamento.", texture: "Granulada.", attention: "Sem restrições. Superalimento.", canFreeze: true, canLunchbox: true },
  { name: "Macarrão integral", age: "+8m", category: "grão", howToOffer: "Bem cozido, cortado.", texture: "Macia.", attention: "⚠️ Contém glúten.", canFreeze: true, canLunchbox: true },
  { name: "Pão integral", age: "+8m", category: "grão", howToOffer: "Em tiras ou torrado.", texture: "Macia.", attention: "⚠️ Contém glúten. Sem açúcar.", canFreeze: true, canLunchbox: true },
  { name: "Tapioca", age: "+6m", category: "grão", howToOffer: "Hidratada, em crepioca.", texture: "Macia e elástica.", attention: "Sem glúten.", canFreeze: false, canLunchbox: true },
  { name: "Painço", age: "+8m", category: "grão", howToOffer: "Cozido, como arroz.", texture: "Granulada.", attention: "Sem glúten.", canFreeze: true, canLunchbox: true },
  { name: "Amaranto", age: "+8m", category: "grão", howToOffer: "Cozido ou em mingau.", texture: "Cremosa.", attention: "Sem glúten, rico em proteínas.", canFreeze: true, canLunchbox: true },
  { name: "Cuscuz", age: "+8m", category: "grão", howToOffer: "Bem cozido, desfiado.", texture: "Macia.", attention: "Sem restrições.", canFreeze: true, canLunchbox: true },
  { name: "Farinha de mandioca", age: "+9m", category: "grão", howToOffer: "Em pirão ou farofa leve.", texture: "Granulada.", attention: "Sem restrições.", canFreeze: false, canLunchbox: true },
  { name: "Polenta", age: "+8m", category: "grão", howToOffer: "Cozida, em palitos.", texture: "Macia.", attention: "Sem glúten.", canFreeze: true, canLunchbox: true },
  { name: "Granola sem açúcar", age: "+12m", category: "grão", howToOffer: "Com frutas ou iogurte.", texture: "Crocante.", attention: "Verificar rótulo - sem açúcar.", canFreeze: false, canLunchbox: true },
  { name: "Semente de chia", age: "+6m", category: "grão", howToOffer: "Hidratada em pudding ou mingau.", texture: "Gelatinosa quando hidratada.", attention: "⚠️ Seca pode engasgar, sempre hidratar.", canFreeze: false, canLunchbox: true },
  { name: "Semente de linhaça", age: "+6m", category: "grão", howToOffer: "Triturada em preparações.", texture: "Pó.", attention: "Rica em ômega-3.", canFreeze: false, canLunchbox: true },
  { name: "Gergelim", age: "+6m", category: "grão", howToOffer: "Pasta (tahine) ou moído.", texture: "Cremosa (pasta).", attention: "⚠️ Alérgeno. Introduza gradualmente.", canFreeze: false, canLunchbox: true },
  { name: "Semente de abóbora", age: "+9m", category: "grão", howToOffer: "Moída em preparações.", texture: "Dura inteira.", attention: "Sempre moída para bebês.", canFreeze: false, canLunchbox: true },
  { name: "Semente de girassol", age: "+9m", category: "grão", howToOffer: "Moída ou em pasta.", texture: "Dura inteira.", attention: "Sempre moída para bebês.", canFreeze: false, canLunchbox: true },

  // ===== TEMPEROS E ERVAS =====
  { name: "Cúrcuma", age: "+6m", category: "tempero", howToOffer: "Pitada em preparações.", texture: "Pó.", attention: "Anti-inflamatório natural.", canFreeze: false, canLunchbox: false },
  { name: "Canela", age: "+6m", category: "tempero", howToOffer: "Pitada em mingaus e frutas.", texture: "Pó.", attention: "Sem restrições em pequenas quantidades.", canFreeze: false, canLunchbox: false },
  { name: "Salsinha", age: "+6m", category: "tempero", howToOffer: "Picada em preparações.", texture: "Folha.", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Cebolinha", age: "+6m", category: "tempero", howToOffer: "Picada em preparações.", texture: "Folha.", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Alho", age: "+6m", category: "tempero", howToOffer: "Em preparações cozidas.", texture: "Macia quando cozido.", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Cebola", age: "+6m", category: "tempero", howToOffer: "Em preparações cozidas.", texture: "Macia quando cozida.", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Manjericão", age: "+6m", category: "tempero", howToOffer: "Fresco em preparações.", texture: "Folha tenra.", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Orégano", age: "+6m", category: "tempero", howToOffer: "Em preparações.", texture: "Seco.", attention: "Sem restrições em pequenas quantidades.", canFreeze: false, canLunchbox: false },
  { name: "Alecrim", age: "+8m", category: "tempero", howToOffer: "Em preparações assadas.", texture: "Folha.", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Gengibre", age: "+9m", category: "tempero", howToOffer: "Ralado em preparações.", texture: "Fibroso.", attention: "Sabor forte, use pouco.", canFreeze: true, canLunchbox: false },
  { name: "Coentro", age: "+6m", category: "tempero", howToOffer: "Picado em preparações.", texture: "Folha.", attention: "Sabor forte.", canFreeze: true, canLunchbox: false },
  { name: "Hortelã", age: "+8m", category: "tempero", howToOffer: "Fresca em preparações.", texture: "Folha.", attention: "Sem restrições.", canFreeze: false, canLunchbox: false },
  { name: "Tomilho", age: "+8m", category: "tempero", howToOffer: "Em preparações cozidas.", texture: "Folha pequena.", attention: "Sem restrições.", canFreeze: true, canLunchbox: false },
  { name: "Louro", age: "+6m", category: "tempero", howToOffer: "Em caldos, retirar antes de servir.", texture: "Folha dura.", attention: "⚠️ Sempre retirar do prato.", canFreeze: false, canLunchbox: false },
  { name: "Noz-moscada", age: "+9m", category: "tempero", howToOffer: "Pitada em preparações.", texture: "Pó.", attention: "Use com muita moderação.", canFreeze: false, canLunchbox: false },
];

// Generate preparation variations for key foods
const additionalFoods: FoodTemplate[] = [];
const preparations = ["ao vapor", "assado(a)", "cozido(a)", "grelhado(a)", "refogado(a)"];
const keyFoods = ["Batata doce", "Abóbora", "Cenoura", "Brócolis", "Frango", "Banana", "Maçã", "Pera"];
keyFoods.forEach((food) => {
  preparations.forEach((prep) => {
    additionalFoods.push({
      name: `${food} ${prep}`,
      age: "+6m",
      category: food === "Frango" ? "proteína" : ["Banana", "Maçã", "Pera"].includes(food) ? "fruta" : "legume",
      howToOffer: `Prepare ${food.toLowerCase()} ${prep}.`,
      texture: "Macia quando preparada.",
      attention: "Sem restrições.",
      canFreeze: true,
      canLunchbox: true,
    });
  });
});

// Build final list with deterministic emojis
export const premiumFoods: PremiumFood[] = [...foodTemplates, ...additionalFoods].map((f, i) => ({
  ...f,
  id: i + 1,
  emoji: getEmoji(f.name, f.category),
}));

export const freeFoods = premiumFoods.slice(0, 12);

export const foodCategories = ["Todos", "Fruta", "Legume", "Proteína", "Grão", "Tempero"];
