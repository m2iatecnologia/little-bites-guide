// Cutting guide data per food — início (big pieces for beginners) and pinça (small pieces for advanced)

export interface CuttingGuide {
  inicio: { shape: string; label: string; description: string };
  pinca: { shape: string; label: string; description: string };
  tip: string;
}

// Shape types for SVG rendering: "stick" | "cube" | "mashed" | "shredded" | "slice" | "half" | "wedge" | "strip"

const defaultGuide = (food: string): CuttingGuide => ({
  inicio: { shape: "stick", label: "Palitos grandes", description: `Corte ${food.toLowerCase()} em palitos do tamanho do dedo do adulto para o bebê segurar com a palma.` },
  pinca: { shape: "cube", label: "Cubinhos", description: `Corte ${food.toLowerCase()} em cubos de ~1cm para estimular o movimento de pinça.` },
  tip: `Para bebês iniciantes, ofereça ${food.toLowerCase()} em pedaços maiores para facilitar o agarre. Conforme evolui, corte em pedaços menores para estimular a pinça.`,
});

const guides: Record<string, CuttingGuide> = {
  "Banana": {
    inicio: { shape: "stick", label: "Metade com casca", description: "Corte ao meio e deixe parte da casca para o bebê segurar sem escorregar." },
    pinca: { shape: "cube", label: "Rodelas finas", description: "Corte em rodelas de ~1cm ou pedacinhos pequenos para a pinça." },
    tip: "A banana é escorregadia! Deixe a casca como 'cabo' para iniciantes, ou passe aveia por fora para dar aderência.",
  },
  "Melancia": {
    inicio: { shape: "strip", label: "Tiras compridas", description: "Corte em tiras compridas e finas, retirando todas as sementes." },
    pinca: { shape: "cube", label: "Cubinhos", description: "Corte em cubos de ~1cm sem sementes para praticar a pinça." },
    tip: "Retire sempre as sementes. A melancia é ótima para aliviar a gengiva em dias quentes.",
  },
  "Abacate": {
    inicio: { shape: "strip", label: "Fatias grossas", description: "Corte em fatias grossas tipo 'palito'. Passe farinha de aveia por fora para facilitar o agarre." },
    pinca: { shape: "cube", label: "Cubinhos", description: "Corte em cubinhos pequenos de ~1cm. O abacate maduro amassa fácil na boca." },
    tip: "O abacate é escorregadio! Rolar na aveia ou farinha de linhaça ajuda o bebê a segurar.",
  },
  "Morango": {
    inicio: { shape: "half", label: "Inteiro ou ao meio", description: "Ofereça morango grande inteiro ou cortado ao meio para o bebê morder." },
    pinca: { shape: "cube", label: "Quartos pequenos", description: "Corte em quartos ou fatias finas para praticar a pinça." },
    tip: "Retire o cabinho. Morangos muito pequenos devem ser cortados ao meio para evitar engasgo.",
  },
  "Cenoura": {
    inicio: { shape: "stick", label: "Palitos cozidos", description: "Cozinhe bem e corte em palitos grossos. Deve amassar fácil entre os dedos." },
    pinca: { shape: "cube", label: "Cubinhos cozidos", description: "Cozinhe e corte em cubinhos de ~1cm, bem macios." },
    tip: "⚠️ NUNCA ofereça cenoura crua — alto risco de engasgo. Deve estar bem macia ao ponto de amassar com o dedo.",
  },
  "Abobrinha": {
    inicio: { shape: "stick", label: "Palitos ao vapor", description: "Cozinhe ao vapor e corte em palitos grossos do tamanho do dedo." },
    pinca: { shape: "cube", label: "Cubinhos", description: "Corte em cubinhos de ~1cm após cozinhar. Amassa fácil na gengiva." },
    tip: "A abobrinha cozida é uma das melhores opções para iniciar o BLW pela textura macia e sabor suave.",
  },
  "Brócolis": {
    inicio: { shape: "stick", label: "Florzinha com talo", description: "Ofereça a florzinha inteira com o talo como 'cabo' para o bebê segurar." },
    pinca: { shape: "cube", label: "Florzinhas pequenas", description: "Separe em mini florzinhas para a pinça. Cozinhe bem ao vapor." },
    tip: "O talo do brócolis funciona como um cabo natural! Cozinhe até ficar macio mas firme o suficiente para segurar.",
  },
  "Batata doce": {
    inicio: { shape: "stick", label: "Palitos assados", description: "Corte em palitos grossos e asse no forno até ficarem macios por dentro." },
    pinca: { shape: "cube", label: "Cubinhos", description: "Corte em cubos pequenos de ~1cm após cozinhar." },
    tip: "A batata doce assada tem uma casquinha que ajuda o bebê a segurar. Ótima opção nutritiva!",
  },
  "Manga": {
    inicio: { shape: "strip", label: "Fatia com caroço", description: "Corte uma fatia grossa junto ao caroço — o bebê chupa e morde a polpa." },
    pinca: { shape: "cube", label: "Cubinhos", description: "Corte a polpa em cubinhos de ~1cm para praticar a pinça." },
    tip: "A manga madura é perfeita para BLW. A fatia com caroço funciona como 'picolé natural'.",
  },
  "Maçã": {
    inicio: { shape: "stick", label: "Fatias cozidas", description: "Cozinhe ao vapor e corte em fatias grossas. NUNCA ofereça crua para iniciantes." },
    pinca: { shape: "cube", label: "Cubinhos cozidos", description: "Cozinhe e corte em cubinhos pequenos de ~1cm." },
    tip: "⚠️ Maçã crua é dura e oferece risco de engasgo. Sempre cozinhe até ficar macia para bebês.",
  },
  "Pera": {
    inicio: { shape: "stick", label: "Fatias maduras", description: "Escolha peras bem maduras e corte em fatias grossas para segurar." },
    pinca: { shape: "cube", label: "Cubinhos", description: "Corte em cubinhos de ~1cm. Se não estiver madura, cozinhe ao vapor." },
    tip: "A pera madura já tem a textura ideal para BLW. Se estiver dura, cozinhe ao vapor primeiro.",
  },
  "Ovo": {
    inicio: { shape: "half", label: "Tiras de omelete", description: "Faça omelete e corte em tiras para o bebê segurar e morder." },
    pinca: { shape: "cube", label: "Pedacinhos", description: "Corte ovo cozido ou omelete em pedacinhos pequenos." },
    tip: "O ovo é alérgeno comum. Introduza aos poucos e observe reações por 3 dias.",
  },
  "Frango": {
    inicio: { shape: "shredded", label: "Coxa desfiada", description: "Cozinhe a coxa até desmanchar e ofereça pedaços grandes e macios." },
    pinca: { shape: "shredded", label: "Desfiado fino", description: "Desfie bem fininho para a pinça. Misture com purê se necessário." },
    tip: "Prefira coxas e sobrecoxas — são mais macias que o peito. Cozinhe bem até desfiar fácil.",
  },
  "Carne bovina": {
    inicio: { shape: "strip", label: "Tiras grandes", description: "Cozinhe até ficar macia e corte em tiras do tamanho do dedo para segurar." },
    pinca: { shape: "shredded", label: "Desfiada", description: "Desfie bem ou corte em pedacinhos muito pequenos." },
    tip: "Prefira cortes macios como patinho ou músculo. Cozinhe por bastante tempo até desmanchar.",
  },
  "Peixe branco": {
    inicio: { shape: "strip", label: "Lascas grandes", description: "Cozinhe e separe em lascas grandes, verificando espinhas." },
    pinca: { shape: "shredded", label: "Lascas pequenas", description: "Separe em lascas pequenas. Sempre verifique espinhas!" },
    tip: "⚠️ Verifique SEMPRE se há espinhas. Peixes como tilápia e pescada são boas opções iniciais.",
  },
  "Abóbora": {
    inicio: { shape: "stick", label: "Palitos assados", description: "Corte em palitos grossos e asse no forno até ficarem macios." },
    pinca: { shape: "cube", label: "Cubinhos", description: "Corte em cubos de ~1cm após cozinhar." },
    tip: "A abóbora assada tem sabor adocicado que agrada os bebês. Ótima fonte de vitamina A!",
  },
  "Beterraba": {
    inicio: { shape: "stick", label: "Palitos cozidos", description: "Cozinhe bem e corte em palitos grossos. Atenção: mancha muito!" },
    pinca: { shape: "cube", label: "Cubinhos", description: "Corte em cubos de ~1cm bem cozidos." },
    tip: "Dica: use avental no bebê — beterraba mancha tudo! O sabor doce costuma agradar.",
  },
  "Arroz": {
    inicio: { shape: "mashed", label: "Bolinho de arroz", description: "Amasse o arroz e forme bolinhos achatados para o bebê segurar." },
    pinca: { shape: "cube", label: "Grãos soltos", description: "Ofereça arroz cozido solto para praticar a pinça." },
    tip: "Arroz solto é ótimo para treinar a pinça! Faça bolinhos no início para facilitar.",
  },
  "Aveia": {
    inicio: { shape: "mashed", label: "Mingau grosso", description: "Prepare um mingau mais grosso que o bebê consiga pegar com as mãos." },
    pinca: { shape: "mashed", label: "Mingau ou panqueca", description: "Use aveia em panquecas cortadas em tiras para facilitar." },
    tip: "A aveia é versátil: mingau, panqueca ou misturada a frutas. Rica em fibras e ferro!",
  },
};

export function getCuttingGuide(foodName: string): CuttingGuide {
  return guides[foodName] || defaultGuide(foodName);
}
