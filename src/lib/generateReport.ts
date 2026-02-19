import jsPDF from "jspdf";

export interface ReportData {
  childName: string;
  birthDate: string;
  currentAge: string;
  weight?: string;
  period: string;
  totalFoods: number;
  acceptanceRate: number;
  rejectionRate: number;
  neutralRate: number;
  newFoodsIntroduced: number;
  reactionsCount: number;
  totalMeals: number;
  weeklyFrequency: number;
  bestAccepted: { food: string; rate: number }[];
  mostRejected: { food: string; rate: number }[];
  reactions: { date: string; food: string; type: string }[];
  weeklyIntroductions: number[];
  parentNotes: string;
}

const TEAL = [43, 196, 162] as const;
const TEAL_DARK = [28, 138, 111] as const;
const YELLOW = [255, 215, 80] as const;
const DARK = [30, 35, 45] as const;
const GRAY = [100, 110, 120] as const;
const LIGHT_BG = [248, 252, 250] as const;
const WHITE: [number, number, number] = [255, 255, 255];

function setFill(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}
function setTextColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}
function setDrawColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

export function generateClinicalReport(data: ReportData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 16;
  const contentW = W - margin * 2;
  let y = 0;

  // ─── PÁGINA 1: CAPA ───────────────────────────────────────────────────────
  // Fundo creme
  setFill(doc, [255, 250, 240]);
  doc.rect(0, 0, 210, 297, "F");

  // Topo verde
  setFill(doc, TEAL);
  doc.roundedRect(0, 0, 210, 72, 0, 0, "F");
  setFill(doc, [255, 255, 255, 0.15] as any);

  // Título do app
  setTextColor(doc, WHITE);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("NutriBaby", margin, 28);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Relatório Clínico de Introdução Alimentar", margin, 38);

  // Badge
  setFill(doc, YELLOW);
  doc.roundedRect(margin, 46, 72, 14, 4, 4, "F");
  setTextColor(doc, DARK);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("📄 DOCUMENTO PROFISSIONAL", margin + 4, 55);

  // Dados da criança
  y = 90;
  setTextColor(doc, DARK);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.childName, margin, y);

  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  setTextColor(doc, GRAY);
  doc.text(`Data de nascimento: ${data.birthDate}`, margin, y);

  y += 6;
  doc.text(`Idade atual: ${data.currentAge}`, margin, y);

  if (data.weight) {
    y += 6;
    doc.text(`Peso: ${data.weight} kg`, margin, y);
  }

  y += 6;
  doc.text(`Período analisado: ${data.period}`, margin, y);

  // Linha separadora
  y += 10;
  setDrawColor(doc, [220, 230, 225]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, W - margin, y);

  // Cards de resumo rápido
  y += 10;
  setTextColor(doc, TEAL_DARK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo do Período", margin, y);

  y += 6;
  const cards = [
    { label: "Alimentos introduzidos", value: String(data.totalFoods), icon: "🥗" },
    { label: "Aceitação positiva", value: `${data.acceptanceRate}%`, icon: "✅" },
    { label: "Refeições registradas", value: String(data.totalMeals), icon: "🍽" },
    { label: "Novos alimentos", value: String(data.newFoodsIntroduced), icon: "🆕" },
  ];

  const cardW = (contentW - 6) / 2;
  cards.forEach((card, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = margin + col * (cardW + 6);
    const cy = y + row * 28;

    setFill(doc, WHITE);
    doc.roundedRect(cx, cy, cardW, 22, 3, 3, "F");
    setDrawColor(doc, [230, 240, 236]);
    doc.roundedRect(cx, cy, cardW, 22, 3, 3, "S");

    // Faixa colorida lateral
    setFill(doc, TEAL);
    doc.roundedRect(cx, cy, 3, 22, 2, 2, "F");

    setTextColor(doc, DARK);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(card.value, cx + 10, cy + 13);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    setTextColor(doc, GRAY);
    doc.text(card.label, cx + 10, cy + 19);
  });

  y += 62;

  // Barra de aceitação
  setTextColor(doc, TEAL_DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Índice de Aceitação", margin, y);

  y += 5;
  // Fundo da barra
  setFill(doc, [230, 240, 236]);
  doc.roundedRect(margin, y, contentW, 10, 3, 3, "F");

  // Aceitação (verde)
  const acceptPx = (data.acceptanceRate / 100) * contentW;
  setFill(doc, TEAL);
  doc.roundedRect(margin, y, acceptPx, 10, 3, 3, "F");

  // Neutro (amarelo)
  const neutralPx = (data.neutralRate / 100) * contentW;
  setFill(doc, YELLOW);
  doc.rect(margin + acceptPx, y, neutralPx, 10, "F");

  // Rejeição (vermelho)
  setFill(doc, [240, 100, 90]);
  const rejectPx = (data.rejectionRate / 100) * contentW;
  doc.rect(margin + acceptPx + neutralPx, y, rejectPx, 10, "F");

  y += 14;
  doc.setFontSize(8);
  setTextColor(doc, GRAY);
  const legend = [
    { color: TEAL, label: `Aceitação ${data.acceptanceRate}%` },
    { color: YELLOW, label: `Neutro ${data.neutralRate}%` },
    { color: [240, 100, 90] as [number, number, number], label: `Recusa ${data.rejectionRate}%` },
  ];
  legend.forEach((l, i) => {
    const lx = margin + i * 58;
    setFill(doc, l.color);
    doc.roundedRect(lx, y - 2, 7, 4, 1, 1, "F");
    setTextColor(doc, GRAY);
    doc.text(l.label, lx + 9, y + 1);
  });

  // Nota de geração
  y = 272;
  setFill(doc, LIGHT_BG);
  doc.roundedRect(margin, y, contentW, 16, 3, 3, "F");
  setTextColor(doc, GRAY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Este relatório foi gerado automaticamente pelo NutriBaby — Ferramenta de acompanhamento alimentar infantil.",
    margin + 4,
    y + 6
  );
  doc.text(
    "📲 Indique o app NutriBaby para seus pacientes! Acesse: nutribaby.app",
    margin + 4,
    y + 12
  );

  // ─── PÁGINA 2: DETALHES ───────────────────────────────────────────────────
  doc.addPage();
  setFill(doc, [255, 250, 240]);
  doc.rect(0, 0, 210, 297, "F");

  // Cabeçalho da pág 2
  setFill(doc, TEAL);
  doc.rect(0, 0, 210, 18, "F");
  setTextColor(doc, WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("NutriBaby — Relatório Clínico", margin, 12);
  doc.text(`${data.childName} • ${data.period}`, W - margin, 12, { align: "right" });

  y = 28;

  // 2.1 Melhores aceitos
  setTextColor(doc, TEAL_DARK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("🏆 Alimentos com Melhor Aceitação", margin, y);

  y += 6;
  data.bestAccepted.forEach((item, i) => {
    setFill(doc, i % 2 === 0 ? WHITE : LIGHT_BG);
    doc.roundedRect(margin, y, contentW, 10, 2, 2, "F");

    // Medal
    const medals = ["🥇", "🥈", "🥉"];
    doc.setFontSize(9);
    setTextColor(doc, DARK);
    doc.text(`${medals[i] ?? `${i + 1}.`}  ${item.food}`, margin + 4, y + 7);

    // Barra de progresso inline
    const barX = margin + contentW - 50;
    const barW = 40;
    setFill(doc, [220, 240, 234]);
    doc.roundedRect(barX, y + 2, barW, 6, 2, 2, "F");
    setFill(doc, TEAL);
    doc.roundedRect(barX, y + 2, (item.rate / 100) * barW, 6, 2, 2, "F");

    setTextColor(doc, TEAL_DARK);
    doc.setFont("helvetica", "bold");
    doc.text(`${item.rate}%`, barX + barW + 2, y + 7);
    doc.setFont("helvetica", "normal");

    y += 11;
  });

  y += 6;

  // 2.2 Maior rejeição
  setTextColor(doc, TEAL_DARK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("⚠️ Alimentos com Maior Recusa", margin, y);

  y += 6;
  data.mostRejected.forEach((item, i) => {
    setFill(doc, i % 2 === 0 ? WHITE : LIGHT_BG);
    doc.roundedRect(margin, y, contentW, 10, 2, 2, "F");

    doc.setFontSize(9);
    setTextColor(doc, DARK);
    doc.text(`${i + 1}.  ${item.food}`, margin + 4, y + 7);

    const barX = margin + contentW - 50;
    const barW = 40;
    setFill(doc, [250, 220, 218]);
    doc.roundedRect(barX, y + 2, barW, 6, 2, 2, "F");
    setFill(doc, [220, 70, 60]);
    doc.roundedRect(barX, y + 2, (item.rate / 100) * barW, 6, 2, 2, "F");

    setTextColor(doc, [200, 50, 40]);
    doc.setFont("helvetica", "bold");
    doc.text(`${item.rate}%`, barX + barW + 2, y + 7);
    doc.setFont("helvetica", "normal");

    y += 11;
  });

  y += 6;

  // 2.3 Reações observadas
  setTextColor(doc, TEAL_DARK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("🩺 Possíveis Reações Observadas", margin, y);
  y += 6;

  if (data.reactions.length === 0) {
    setFill(doc, [235, 248, 243]);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, "F");
    setTextColor(doc, TEAL_DARK);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("✅  Nenhuma reação adversa registrada no período.", margin + 4, y + 8);
    y += 18;
  } else {
    // Header tabela
    setFill(doc, TEAL);
    doc.roundedRect(margin, y, contentW, 9, 2, 2, "F");
    setTextColor(doc, WHITE);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Data", margin + 4, y + 6);
    doc.text("Alimento", margin + 30, y + 6);
    doc.text("Reação", margin + 90, y + 6);
    y += 10;

    data.reactions.forEach((r, i) => {
      setFill(doc, i % 2 === 0 ? WHITE : LIGHT_BG);
      doc.rect(margin, y, contentW, 9, "F");
      setTextColor(doc, DARK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(r.date, margin + 4, y + 6);
      doc.text(r.food, margin + 30, y + 6);
      doc.text(r.type, margin + 90, y + 6);
      y += 10;
    });
    y += 4;
  }

  // 2.4 Evolução semanal (gráfico de barras simples)
  setTextColor(doc, TEAL_DARK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("📈 Evolução Semanal de Introdução", margin, y);
  y += 8;

  const chartH = 40;
  const chartW = contentW;
  const weeks = data.weeklyIntroductions;
  const maxVal = Math.max(...weeks, 1);
  const barWidth = (chartW / weeks.length) * 0.6;
  const barGap = chartW / weeks.length;

  // Eixo Y
  setDrawColor(doc, [210, 220, 218]);
  doc.setLineWidth(0.3);
  for (let i = 0; i <= 4; i++) {
    const lineY = y + chartH - (i / 4) * chartH;
    doc.line(margin, lineY, margin + chartW, lineY);
    setTextColor(doc, GRAY);
    doc.setFontSize(7);
    doc.text(String(Math.round((i / 4) * maxVal)), margin - 5, lineY + 1, { align: "right" });
  }

  weeks.forEach((val, i) => {
    const barH = (val / maxVal) * chartH;
    const bx = margin + i * barGap + barGap * 0.2;
    const by = y + chartH - barH;

    setFill(doc, TEAL);
    doc.roundedRect(bx, by, barWidth, barH, 2, 2, "F");

    setTextColor(doc, DARK);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(String(val), bx + barWidth / 2, by - 2, { align: "center" });

    setTextColor(doc, GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`Sem ${i + 1}`, bx + barWidth / 2, y + chartH + 5, { align: "center" });
  });

  y += chartH + 14;

  // 2.5 Observações dos pais
  if (y < 220) {
    setTextColor(doc, TEAL_DARK);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("📝 Observações dos Pais / Responsáveis", margin, y);
    y += 6;

    const notesH = 36;
    setFill(doc, WHITE);
    doc.roundedRect(margin, y, contentW, notesH, 3, 3, "F");
    setDrawColor(doc, [200, 220, 215]);
    doc.roundedRect(margin, y, contentW, notesH, 3, 3, "S");

    setTextColor(doc, DARK);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(data.parentNotes || "Nenhuma observação adicional.", contentW - 8);
    doc.text(lines, margin + 4, y + 8);
    y += notesH + 6;
  }

  // Rodapé da pág 2
  y = 272;
  setDrawColor(doc, [200, 220, 215]);
  doc.setLineWidth(0.3);
  doc.line(margin, y, W - margin, y);
  y += 6;
  setFill(doc, LIGHT_BG);
  doc.roundedRect(margin, y, contentW, 16, 3, 3, "F");
  setTextColor(doc, GRAY);
  doc.setFontSize(7.5);
  doc.text(
    "Este relatório foi gerado pelo NutriBaby — ferramenta de acompanhamento da introdução alimentar infantil.",
    margin + 4,
    y + 6
  );
  doc.text(
    "📲 Indique aos seus pacientes: nutribaby.app  |  Gerado em: " + new Date().toLocaleDateString("pt-BR"),
    margin + 4,
    y + 12
  );

  doc.save(`relatorio-nutribaby-${data.childName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
