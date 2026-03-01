export interface DicaDoDia {
  id: number;
  titulo: string;
  texto: string;
  categoria: "segurança" | "rotina" | "alergias" | "aceitação" | "nutrição" | "preparo";
  emoji: string;
}

export const dicasDoDia: DicaDoDia[] = [
  {
    id: 1,
    titulo: "Como lidar com a recusa alimentar",
    texto: "É normal o bebê recusar um alimento várias vezes antes de aceitá-lo. Estudos mostram que podem ser necessárias até 15 exposições para que ele aceite um novo sabor. Não force, apenas ofereça novamente em outro momento com preparo diferente.",
    categoria: "aceitação",
    emoji: "🤔",
  },
  {
    id: 2,
    titulo: "Sinais de prontidão para introdução alimentar",
    texto: "O bebê está pronto quando consegue sentar com apoio mínimo, perdeu o reflexo de protrusão da língua, demonstra interesse pela comida dos adultos e consegue segurar objetos e levá-los à boca.",
    categoria: "rotina",
    emoji: "👶",
  },
  {
    id: 3,
    titulo: "Alimentos alergênicos: quando introduzir?",
    texto: "A Sociedade Brasileira de Pediatria recomenda que alimentos alergênicos como ovo, peixe, amendoim e leite de vaca sejam introduzidos a partir dos 6 meses, um de cada vez, observando reações por 3 a 5 dias antes de introduzir outro.",
    categoria: "alergias",
    emoji: "⚠️",
  },
  {
    id: 4,
    titulo: "A importância do ferro na alimentação",
    texto: "A partir dos 6 meses, as reservas de ferro do bebê começam a diminuir. Ofereça alimentos ricos em ferro como feijão, lentilha, carne vermelha e folhas verde-escuras. Combine com vitamina C (laranja, limão) para melhor absorção.",
    categoria: "nutrição",
    emoji: "💪",
  },
  {
    id: 5,
    titulo: "BLW vs Tradicional: qual escolher?",
    texto: "Não precisa ser um ou outro! A abordagem participativa (BLISS) combina o melhor dos dois: papinha com pedaços grandes para o bebê explorar. O importante é respeitar os sinais de fome e saciedade do bebê.",
    categoria: "rotina",
    emoji: "🍽️",
  },
  {
    id: 6,
    titulo: "Engasgo vs Gag reflex",
    texto: "O reflexo de gag (ânsia) é um mecanismo de proteção: o bebê faz cara de desconforto e empurra o alimento para frente. Engasgo real é silencioso, o bebê não tosse. Aprenda a diferença e faça um curso de primeiros socorros.",
    categoria: "segurança",
    emoji: "🚨",
  },
  {
    id: 7,
    titulo: "Texturas ideais por idade",
    texto: "6-7 meses: purês, papas e alimentos macios em pedaços grandes. 8-9 meses: alimentos amassados com garfo e pedaços pequenos. 10-12 meses: comida da família em pedaços adequados. Evolua gradualmente!",
    categoria: "preparo",
    emoji: "🥄",
  },
  {
    id: 8,
    titulo: "Água: quando e quanto oferecer?",
    texto: "A partir dos 6 meses, ofereça água filtrada em copinho aberto ou de transição durante as refeições. Não precisa ser em grande quantidade — cerca de 50-100ml ao longo do dia já é suficiente nessa fase.",
    categoria: "nutrição",
    emoji: "💧",
  },
  {
    id: 9,
    titulo: "Sal e açúcar: evite até os 2 anos",
    texto: "O paladar do bebê está em formação. Evite sal, açúcar, mel (até 1 ano), sucos e alimentos ultraprocessados. Temperos naturais como alho, cebola, ervas e especiarias suaves são permitidos e recomendados!",
    categoria: "nutrição",
    emoji: "🚫",
  },
  {
    id: 10,
    titulo: "A refeição é um momento de aprendizado",
    texto: "Deixe o bebê se sujar, tocar e explorar os alimentos. Isso faz parte do desenvolvimento sensorial e motor. Coma junto com ele — o exemplo é o melhor estímulo. Refeições devem ser momentos tranquilos e sem telas.",
    categoria: "rotina",
    emoji: "🎓",
  },
  {
    id: 11,
    titulo: "Congelamento seguro de papinhas",
    texto: "Papinhas podem ser congeladas por até 30 dias em potes de vidro. Congele em porções individuais, etiquete com data e nome do alimento. Descongele na geladeira e aqueça apenas uma vez. Nunca recongele!",
    categoria: "preparo",
    emoji: "❄️",
  },
  {
    id: 12,
    titulo: "Ofereça variedade desde o início",
    texto: "Quanto mais alimentos diferentes o bebê provar nos primeiros meses de introdução alimentar, maior a chance de ele aceitar uma alimentação variada no futuro. Não repita o mesmo cardápio todos os dias!",
    categoria: "aceitação",
    emoji: "🌈",
  },
  {
    id: 13,
    titulo: "Cuidados com o mel antes de 1 ano",
    texto: "O mel pode conter esporos de Clostridium botulinum, que causa botulismo infantil. Nunca ofereça mel (em nenhuma forma) para bebês menores de 1 ano. Isso vale para receitas, biscoitos e qualquer preparação.",
    categoria: "segurança",
    emoji: "🍯",
  },
  {
    id: 14,
    titulo: "Sinais de alergia alimentar",
    texto: "Fique atento a: urticária, inchaço nos lábios/olhos, vômito persistente, diarreia com sangue, chiado no peito ou dificuldade respiratória. Em caso de reação grave, procure emergência imediatamente.",
    categoria: "alergias",
    emoji: "🏥",
  },
  {
    id: 15,
    titulo: "Como cortar alimentos de forma segura",
    texto: "Alimentos redondos (uva, tomate cereja) devem ser cortados ao meio no sentido do comprimento. Alimentos duros (cenoura crua, maçã) devem ser cozidos. Nunca ofereça alimentos em formato de moeda para bebês.",
    categoria: "segurança",
    emoji: "🔪",
  },
];

export function getDicaDoDia(date?: Date): DicaDoDia {
  const d = date || new Date();
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % dicasDoDia.length;
  return dicasDoDia[index];
}

export function getCategoriaColor(cat: DicaDoDia["categoria"]): string {
  const colors: Record<string, string> = {
    segurança: "hsl(0 70% 55%)",
    rotina: "hsl(210 60% 50%)",
    alergias: "hsl(30 80% 50%)",
    aceitação: "hsl(140 45% 45%)",
    nutrição: "hsl(270 50% 55%)",
    preparo: "hsl(43 88% 50%)",
  };
  return colors[cat] || "hsl(var(--muted-foreground))";
}

export function getCategoriaBg(cat: DicaDoDia["categoria"]): string {
  const colors: Record<string, string> = {
    segurança: "hsl(0 70% 95%)",
    rotina: "hsl(210 60% 95%)",
    alergias: "hsl(30 80% 95%)",
    aceitação: "hsl(140 45% 95%)",
    nutrição: "hsl(270 50% 95%)",
    preparo: "hsl(43 88% 95%)",
  };
  return colors[cat] || "hsl(var(--app-cream))";
}
