export interface PreparationMethod {
  method: string;
  steps: string;
  texture: string;
  tips: string;
}

export interface FoodPreparation {
  name: string;
  preparations: PreparationMethod[];
}

export const foodPreparations: FoodPreparation[] = [
  {
    name: "Banana amassada",
    preparations: [
      { method: "Amassada", steps: "Descasque a banana e amasse com um garfo até formar um purê.", texture: "Cremosa e macia, fácil de engolir.", tips: "Use banana bem madura para melhor digestão." },
    ],
  },
  {
    name: "Banana",
    preparations: [
      { method: "In natura (BLW)", steps: "Corte ao meio no sentido do comprimento, deixando parte da casca para o bebê segurar.", texture: "Macia, desliza na boca.", tips: "Banana prata é mais firme e fácil de segurar." },
      { method: "Amassada", steps: "Descasque e amasse com garfo.", texture: "Purê cremoso.", tips: "Pode polvilhar canela." },
    ],
  },
  {
    name: "Aveia",
    preparations: [
      { method: "Mingau", steps: "Cozinhe 2 colheres de aveia em 100ml de água ou leite materno por 5 min.", texture: "Cremosa, sem grumos.", tips: "Não adicione açúcar. Pode misturar com frutas." },
    ],
  },
  {
    name: "Cenoura cozida",
    preparations: [
      { method: "Cozida", steps: "Descasque e corte em palitos. Cozinhe em água até ficar macia (15-20 min).", texture: "Bem macia, deve ceder ao pressionar com o dedo.", tips: "Nunca ofereça crua — risco de engasgo." },
      { method: "Ao vapor", steps: "Corte em palitos e cozinhe no vapor por 15 min.", texture: "Macia, preserva mais nutrientes.", tips: "Ideal para BLW." },
    ],
  },
  {
    name: "Cenoura",
    preparations: [
      { method: "Cozida", steps: "Descasque e corte em palitos. Cozinhe em água até ficar macia.", texture: "Bem macia.", tips: "Nunca ofereça crua para bebês." },
      { method: "Ao vapor", steps: "Corte em palitos e cozinhe no vapor por 15 min.", texture: "Macia, preserva nutrientes.", tips: "Ideal para BLW." },
      { method: "Refogada", steps: "Corte em cubos e refogue com azeite por 10 min.", texture: "Macia por dentro, levemente dourada.", tips: "Use pouco azeite." },
    ],
  },
  {
    name: "Arroz",
    preparations: [
      { method: "Cozido", steps: "Cozinhe normalmente. Para bebês iniciantes, amasse levemente com garfo.", texture: "Macio, levemente pastoso.", tips: "Pode cozinhar com caldo de legumes para mais sabor." },
    ],
  },
  {
    name: "Frango desfiado",
    preparations: [
      { method: "Cozido e desfiado", steps: "Cozinhe peito de frango em água com legumes. Desfie bem fino.", texture: "Desfiado fino, macio.", tips: "Adicione um fio de azeite para facilitar a mastigação." },
    ],
  },
  {
    name: "Ovo mexido",
    preparations: [
      { method: "Mexido", steps: "Bata o ovo e cozinhe em frigideira com pouco azeite, mexendo sempre.", texture: "Macio e úmido.", tips: "Cozinhe bem. Ofereça desde os 6 meses." },
    ],
  },
  {
    name: "Grão-de-bico",
    preparations: [
      { method: "Cozido e amassado", steps: "Cozinhe até ficar bem macio. Amasse com garfo removendo cascas.", texture: "Pastoso.", tips: "Deixe de molho por 12h antes." },
    ],
  },
  {
    name: "Purê de abacate",
    preparations: [
      { method: "Amassado", steps: "Corte o abacate ao meio, retire o caroço e amasse a polpa com garfo.", texture: "Cremoso e macio.", tips: "Use imediatamente para evitar oxidação." },
    ],
  },
  {
    name: "Batata doce",
    preparations: [
      { method: "Cozida", steps: "Cozinhe com casca em água por 25 min. Descasque e amasse.", texture: "Bem macia e doce.", tips: "Pode oferecer em palitos para BLW." },
      { method: "Assada", steps: "Corte em palitos, pincele azeite e asse a 200°C por 25 min.", texture: "Macia por dentro, firme por fora.", tips: "Ótima para BLW." },
    ],
  },
  {
    name: "Maçã cozida",
    preparations: [
      { method: "Cozida", steps: "Descasque, corte em fatias e cozinhe por 10 min até amolecer.", texture: "Macia, quase derretendo.", tips: "Pode polvilhar canela." },
    ],
  },
  {
    name: "Mamão",
    preparations: [
      { method: "In natura", steps: "Corte em fatias ou amasse com garfo.", texture: "Muito macia e suculenta.", tips: "Ideal para iniciantes na IA." },
    ],
  },
  {
    name: "Pão integral",
    preparations: [
      { method: "Tostado", steps: "Torre levemente e corte em tiras.", texture: "Crocante por fora, macia por dentro.", tips: "Verifique os ingredientes: sem açúcar ou excesso de sódio." },
    ],
  },
  {
    name: "Peixe cozido",
    preparations: [
      { method: "Cozido", steps: "Cozinhe o filé de peixe no vapor ou em água por 8-10 min. Desfie.", texture: "Macia e desfiada.", tips: "Remova TODOS os espinhos com atenção." },
    ],
  },
  {
    name: "Abobrinha",
    preparations: [
      { method: "Ao vapor", steps: "Corte em palitos e cozinhe no vapor por 8 min.", texture: "Macia.", tips: "Boa para BLW." },
      { method: "Refogada", steps: "Corte em rodelas e refogue com azeite.", texture: "Macia e saborosa.", tips: "Pode temperar com ervas." },
    ],
  },
  {
    name: "Brócolis",
    preparations: [
      { method: "Ao vapor", steps: "Cozinhe as floretes no vapor por 8-10 min.", texture: "Macia, fácil de segurar pela haste.", tips: "A haste funciona como 'alça' para o BLW." },
    ],
  },
  {
    name: "Pera",
    preparations: [
      { method: "In natura", steps: "Descasque e corte em palitos para BLW, ou amasse.", texture: "Macia e suculenta.", tips: "Use pera madura. Se firme, cozinhe levemente." },
    ],
  },
  {
    name: "Macarrão integral",
    preparations: [
      { method: "Cozido", steps: "Cozinhe até ficar bem macio (al dente não para bebês).", texture: "Macio.", tips: "Fusilli ou penne são fáceis de segurar." },
    ],
  },
  {
    name: "Lentilha",
    preparations: [
      { method: "Cozida", steps: "Cozinhe em água por 20 min até desmanchar.", texture: "Pastosa.", tips: "Não precisa demolhar. Rica em ferro." },
    ],
  },
  {
    name: "Queijo cottage",
    preparations: [
      { method: "In natura", steps: "Ofereça puro ou misturado com frutas.", texture: "Cremoso e granulado.", tips: "Verifique sódio. Ideal a partir de 9 meses." },
    ],
  },
  {
    name: "Tofu",
    preparations: [
      { method: "Grelhado", steps: "Corte em palitos e grelhe em frigideira com azeite.", texture: "Firme por fora, macio por dentro.", tips: "Boa fonte de proteína vegetal." },
    ],
  },
  {
    name: "Ovo cozido",
    preparations: [
      { method: "Cozido", steps: "Cozinhe por 10-12 min. Corte ao meio ou amasse.", texture: "Firme mas macio.", tips: "Ofereça gema e clara desde os 6 meses." },
    ],
  },
  {
    name: "Carne moída",
    preparations: [
      { method: "Refogada", steps: "Refogue com azeite e temperos naturais até cozinhar bem.", texture: "Desfiada e macia.", tips: "Use carne magra. Pode misturar com legumes." },
    ],
  },
  {
    name: "Beterraba",
    preparations: [
      { method: "Cozida", steps: "Cozinhe inteira por 40 min até ficar macia. Descasque e corte.", texture: "Macia.", tips: "Mancha roupas! Use avental." },
    ],
  },
  {
    name: "Manga",
    preparations: [
      { method: "In natura", steps: "Corte em fatias largas próximas ao caroço.", texture: "Macia e suculenta.", tips: "O caroço com polpa é ótimo para BLW." },
    ],
  },
  {
    name: "Abóbora",
    preparations: [
      { method: "Cozida", steps: "Corte em cubos e cozinhe por 15 min.", texture: "Bem macia.", tips: "Naturalmente doce, os bebês costumam adorar." },
      { method: "Assada", steps: "Corte em fatias e asse a 200°C por 25 min.", texture: "Macia e caramelizada.", tips: "Pode temperar com ervas." },
    ],
  },
  {
    name: "Melancia",
    preparations: [
      { method: "In natura", steps: "Corte em palitos ou tiras, removendo sementes.", texture: "Macia e suculenta.", tips: "Muito refrescante. Risco de engasgo baixo." },
    ],
  },
  {
    name: "Tapioca",
    preparations: [
      { method: "Frigideira", steps: "Espalhe a goma na frigideira antiaderente sem óleo. Doure levemente.", texture: "Flexível e macia.", tips: "Pode rechear com banana amassada." },
    ],
  },
  {
    name: "Morango",
    preparations: [
      { method: "In natura", steps: "Corte ao meio ou em quartos. Retire o cabinho.", texture: "Macia.", tips: "Alérgeno potencial. Introduza aos poucos." },
    ],
  },
  {
    name: "Abacate",
    preparations: [
      { method: "In natura", steps: "Corte em fatias ou amasse com garfo.", texture: "Cremoso.", tips: "Rico em gorduras boas. Servir imediatamente." },
    ],
  },
  {
    name: "Chuchu",
    preparations: [
      { method: "Cozido", steps: "Descasque, corte em palitos e cozinhe por 12 min.", texture: "Bem macia.", tips: "Sabor neutro, boa para misturar." },
    ],
  },
  {
    name: "Quinoa",
    preparations: [
      { method: "Cozida", steps: "Cozinhe 1 parte de quinoa para 2 de água por 15 min.", texture: "Grãos macios.", tips: "Lave bem antes para tirar o amargor." },
    ],
  },
  {
    name: "Feijão",
    preparations: [
      { method: "Cozido e amassado", steps: "Cozinhe até bem macio. Amasse parcialmente.", texture: "Pastoso com pedacinhos.", tips: "Fonte de ferro. Ofereça com vitamina C." },
    ],
  },
  {
    name: "Ricota",
    preparations: [
      { method: "In natura", steps: "Ofereça pura ou com frutas.", texture: "Cremosa.", tips: "Verifique sódio. A partir de 9 meses." },
    ],
  },
  {
    name: "Frango",
    preparations: [
      { method: "Cozido e desfiado", steps: "Cozinhe e desfie bem fino.", texture: "Desfiado macio.", tips: "Adicione azeite para facilitar." },
      { method: "Grelhado", steps: "Grelhe em frigideira com azeite. Corte em tiras.", texture: "Firme por fora, macio por dentro.", tips: "Corte em tiras finas para BLW." },
    ],
  },
  {
    name: "Uva cortada",
    preparations: [
      { method: "Cortada", steps: "Corte SEMPRE ao meio no sentido longitudinal. Para < 1 ano, corte em 4 partes.", texture: "Macia e suculenta.", tips: "⚠️ NUNCA ofereça inteira — alto risco de engasgo." },
    ],
  },
  {
    name: "Panqueca de banana",
    preparations: [
      { method: "Frigideira", steps: "Amasse 1 banana, misture com 1 ovo. Cozinhe em frigideira.", texture: "Macia e flexível.", tips: "Sem açúcar! A banana já adoça." },
    ],
  },
  {
    name: "Omelete",
    preparations: [
      { method: "Frigideira", steps: "Bata 1 ovo, cozinhe em frigideira com azeite. Pode adicionar legumes.", texture: "Macia.", tips: "Boa forma de incluir vegetais." },
    ],
  },
  {
    name: "Espinafre",
    preparations: [
      { method: "Refogado", steps: "Refogue rapidamente com azeite por 2-3 min.", texture: "Macia e murcha.", tips: "Rico em ferro. Ofereça com vitamina C." },
    ],
  },
  {
    name: "Ervilha",
    preparations: [
      { method: "Cozida e amassada", steps: "Cozinhe e amasse levemente para evitar engasgo.", texture: "Pastosa.", tips: "Para < 9 meses, amasse sempre." },
    ],
  },
  {
    name: "Batata",
    preparations: [
      { method: "Cozida", steps: "Descasque, corte e cozinhe por 20 min.", texture: "Macia.", tips: "Pode fazer purê com azeite." },
    ],
  },
  {
    name: "Pão de queijo",
    preparations: [
      { method: "Assado", steps: "Asse conforme instruções da embalagem.", texture: "Macio e elástico.", tips: "Verifique ingredientes. A partir de 9 meses." },
    ],
  },
  {
    name: "Carne",
    preparations: [
      { method: "Cozida e desfiada", steps: "Cozinhe em panela de pressão até desmanchar. Desfie fino.", texture: "Desfiada macia.", tips: "Cozinhe bastante para ficar macia." },
    ],
  },
  {
    name: "Maçã",
    preparations: [
      { method: "Cozida", steps: "Descasque e cozinhe em fatias por 10 min.", texture: "Macia.", tips: "Pode polvilhar canela." },
      { method: "Raspada", steps: "Raspe com colher para bebês iniciantes.", texture: "Purê fino.", tips: "Use maçã fuji ou gala." },
    ],
  },
  {
    name: "Peixe",
    preparations: [
      { method: "Cozido", steps: "Cozinhe no vapor por 8-10 min. Desfie.", texture: "Macia e desfiada.", tips: "Remova TODOS os espinhos." },
    ],
  },
  {
    name: "Mingau de aveia",
    preparations: [
      { method: "Cozido", steps: "Cozinhe aveia em água ou leite materno por 5 min.", texture: "Cremosa.", tips: "Não adicione açúcar." },
    ],
  },
  {
    name: "Feijão preto",
    preparations: [
      { method: "Cozido e amassado", steps: "Cozinhe até bem macio e amasse.", texture: "Pastoso.", tips: "Deixe de molho por 12h." },
    ],
  },
  {
    name: "Ovo",
    preparations: [
      { method: "Cozido", steps: "Cozinhe por 10-12 min. Corte ou amasse.", texture: "Firme mas macia.", tips: "Gema e clara desde os 6 meses." },
      { method: "Mexido", steps: "Bata e cozinhe mexendo em frigideira com azeite.", texture: "Macia.", tips: "Cozinhe bem." },
    ],
  },
  {
    name: "Aveia com fruta",
    preparations: [
      { method: "Mingau", steps: "Cozinhe aveia e misture com fruta amassada.", texture: "Cremosa com pedacinhos.", tips: "Varie as frutas a cada dia." },
    ],
  },
  {
    name: "Macarrão",
    preparations: [
      { method: "Cozido", steps: "Cozinhe até ficar bem macio.", texture: "Macia.", tips: "Fusilli e penne são fáceis de segurar." },
    ],
  },
  {
    name: "Arroz integral",
    preparations: [
      { method: "Cozido", steps: "Cozinhe com o dobro de água por 30 min.", texture: "Macio, mais textura que arroz branco.", tips: "Pode cozinhar com caldo de legumes." },
    ],
  },
  {
    name: "Inhame",
    preparations: [
      { method: "Cozido", steps: "Descasque, corte em cubos e cozinhe em água por 20-25 min até ficar macio.", texture: "Macia e levemente pegajosa.", tips: "Pode amassar com azeite para um purê." },
      { method: "Assado", steps: "Corte em palitos, pincele azeite e asse a 200°C por 25 min.", texture: "Macia por dentro, levemente crocante por fora.", tips: "Ótimo para BLW." },
    ],
  },
  {
    name: "Mandioquinha",
    preparations: [
      { method: "Cozida", steps: "Descasque, corte em rodelas e cozinhe por 15-20 min.", texture: "Muito macia e cremosa.", tips: "Naturalmente adocicada, ótima aceitação." },
      { method: "Purê", steps: "Cozinhe e amasse com garfo, adicione um fio de azeite.", texture: "Cremosa e aveludada.", tips: "Uma das preferidas dos bebês." },
    ],
  },
  {
    name: "Mandioca",
    preparations: [
      { method: "Cozida", steps: "Descasque, retire o fio central e cozinhe em água por 30-40 min.", texture: "Macia, deve desfiar facilmente.", tips: "Sempre cozinhe bem. Nunca ofereça crua." },
      { method: "Assada", steps: "Após cozinhar, corte em palitos e asse com azeite a 200°C por 15 min.", texture: "Crocante por fora, macia por dentro.", tips: "Boa para BLW após os 9 meses." },
    ],
  },
  {
    name: "Laranja",
    preparations: [
      { method: "In natura", steps: "Descasque e separe os gomos. Retire a membrana se possível.", texture: "Suculenta e macia.", tips: "Rica em vitamina C. Ajuda na absorção de ferro." },
    ],
  },
  {
    name: "Kiwi",
    preparations: [
      { method: "In natura", steps: "Descasque e corte em fatias ou palitos.", texture: "Macia e suculenta.", tips: "Rico em vitamina C. Pode ser ácido — observe aceitação." },
    ],
  },
  {
    name: "Ameixa",
    preparations: [
      { method: "In natura", steps: "Lave, corte ao meio e retire o caroço. Corte em fatias.", texture: "Macia e suculenta.", tips: "Ótima para o intestino. Ajuda na constipação." },
    ],
  },
  {
    name: "Uva",
    preparations: [
      { method: "Cortada", steps: "Corte SEMPRE ao meio no sentido longitudinal. Para < 1 ano, corte em 4 partes.", texture: "Macia e suculenta.", tips: "⚠️ NUNCA ofereça inteira — alto risco de engasgo." },
    ],
  },
  {
    name: "Vagem",
    preparations: [
      { method: "Cozida", steps: "Retire as pontas e cozinhe no vapor por 10-12 min.", texture: "Macia mas com forma.", tips: "Formato ideal para BLW. Corte ao meio se muito longa." },
    ],
  },
  {
    name: "Quiabo",
    preparations: [
      { method: "Refogado", steps: "Corte em rodelas e refogue com azeite por 10 min.", texture: "Macia.", tips: "Para reduzir a baba, cozinhe com limão." },
    ],
  },
  {
    name: "Couve",
    preparations: [
      { method: "Refogada", steps: "Corte em tiras finas e refogue com azeite por 3-5 min.", texture: "Macia e murcha.", tips: "Rica em ferro e cálcio. Ofereça com vitamina C." },
    ],
  },
  {
    name: "Alface",
    preparations: [
      { method: "In natura", steps: "Lave bem e rasgue em pedaços pequenos.", texture: "Macia e crocante.", tips: "Introduza a partir dos 9 meses em pedaços pequenos." },
    ],
  },
  {
    name: "Agrião",
    preparations: [
      { method: "Refogado", steps: "Lave e refogue rapidamente com azeite por 2 min.", texture: "Macia.", tips: "Sabor levemente picante. Misture com outros alimentos." },
    ],
  },
  {
    name: "Carne bovina",
    preparations: [
      { method: "Cozida e desfiada", steps: "Cozinhe em panela de pressão por 40 min. Desfie bem fino.", texture: "Desfiada macia.", tips: "Use cortes magros. Adicione azeite." },
      { method: "Moída refogada", steps: "Refogue com azeite e temperos naturais.", texture: "Granulada e macia.", tips: "Pode misturar com legumes." },
    ],
  },
  {
    name: "Fígado",
    preparations: [
      { method: "Grelhado", steps: "Corte em tiras finas e grelhe rapidamente (2-3 min de cada lado).", texture: "Macia por dentro.", tips: "Riquíssimo em ferro. Ofereça 1-2x por semana." },
      { method: "Patê", steps: "Grelhe e processe com azeite até virar pasta.", texture: "Cremosa.", tips: "Pode passar no pão integral." },
    ],
  },
  {
    name: "Milho",
    preparations: [
      { method: "Cozido", steps: "Cozinhe a espiga por 20-30 min. Para bebês, retire os grãos e amasse.", texture: "Macia quando amassada.", tips: "Grãos inteiros só após 1 ano. Antes, amasse." },
    ],
  },
];

/** Get preparation by exact or partial match */
export function getPreparations(foodName: string): FoodPreparation | undefined {
  // Exact match first
  const exact = foodPreparations.find(
    (f) => f.name.toLowerCase() === foodName.toLowerCase()
  );
  if (exact) return exact;

  // Partial match (food name contains or is contained)
  const partial = foodPreparations.find(
    (f) => f.name.toLowerCase().includes(foodName.toLowerCase()) ||
           foodName.toLowerCase().includes(f.name.toLowerCase())
  );
  if (partial) return partial;

  // Generate a generic preparation as fallback
  return {
    name: foodName,
    preparations: [
      {
        method: "Preparo básico",
        steps: `Lave bem e prepare o(a) ${foodName.toLowerCase()} de forma adequada à idade do bebê. Cozinhe até ficar macio(a) e ofereça em pedaços seguros.`,
        texture: "Deve estar macia o suficiente para ser amassada com os dedos.",
        tips: "Sempre supervisione a refeição. Adapte o corte à fase do bebê.",
      },
    ],
  };
}
