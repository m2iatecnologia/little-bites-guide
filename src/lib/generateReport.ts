import jsPDF from "jspdf";

export interface ReportData {
  // Cover
  childName: string;
  birthDate: string;
  currentAge: string;
  weight?: string;
  period: string;
  feedingMethod?: string; // BLW / Tradicional / Misto
  responsibleName?: string;
  // Summary
  totalFoods: number;
  acceptanceRate: number;
  rejectionRate: number;
  neutralRate: number;
  newFoodsIntroduced: number;
  reactionsCount: number;
  totalMeals: number;
  weeklyFrequency: number;
  // Rankings
  bestAccepted: { food: string; rate: number; count?: number }[];
  mostRejected: { food: string; rate: number; count?: number }[];
  // Reactions
  reactions: { date: string; food: string; type: string }[];
  // Weekly
  weeklyIntroductions: number[];
  // Food groups
  foodGroups?: { group: string; count: number; frequency: number }[];
  // System insights
  insights?: string[];
  // Meal observations from Cardápio
  mealObservations?: { date: string; meal: string; food: string; status: string; note: string }[];
  // Food occurrences (post-consumption reactions)
  foodOccurrences?: { date: string; food: string; reaction: string; timeAfter: string; intensity: string; notes: string }[];
  // Parent notes
  parentNotes: string;
  // Behavioral / context (optional)
  behavioralNotes?: string;
  familyContext?: string;
}

// ─── Colors ────────────────────────────────────────────────────
const PETROL = [46, 64, 87] as const;
const PETROL_LIGHT = [70, 95, 120] as const;
const GOLD = [244, 201, 93] as const;
const GOLD_DARK = [180, 140, 50] as const;
const DARK = [30, 35, 45] as const;
const GRAY = [100, 110, 120] as const;
const LIGHT_BG = [250, 248, 244] as const;
const WHITE: [number, number, number] = [255, 255, 255];
const RED = [200, 60, 50] as const;
const RED_LIGHT = [255, 240, 238] as const;
const GREEN = [60, 160, 120] as const;
const GREEN_LIGHT = [235, 248, 243] as const;

type RGB = readonly [number, number, number];

function setFill(doc: jsPDF, rgb: RGB) { doc.setFillColor(rgb[0], rgb[1], rgb[2]); }
function setText(doc: jsPDF, rgb: RGB) { doc.setTextColor(rgb[0], rgb[1], rgb[2]); }
function setDraw(doc: jsPDF, rgb: RGB) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]); }

// Helpers
function addPageHeader(doc: jsPDF, childName: string, period: string) {
  const W = 210, margin = 16;
  setFill(doc, PETROL);
  doc.rect(0, 0, W, 16, "F");
  setText(doc, WHITE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório Nutricional — Introdução Alimentar", margin, 10);
  doc.setFont("helvetica", "normal");
  doc.text(`${childName} · ${period}`, W - margin, 10, { align: "right" });
}

function addFooter(doc: jsPDF, pageNum: number) {
  const W = 210, margin = 16, contentW = W - margin * 2;
  const y = 278;
  setDraw(doc, [220, 220, 215]);
  doc.setLineWidth(0.3);
  doc.line(margin, y, W - margin, y);
  setText(doc, GRAY);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Relatório gerado pelo NutriBaby — Plataforma de acompanhamento alimentar infantil  |  nutribaby.app",
    margin, y + 5
  );
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString("pt-BR")}  |  Página ${pageNum}`,
    W - margin, y + 5, { align: "right" }
  );
  // Disclaimer
  doc.setFontSize(5.5);
  doc.text(
    "Este relatório tem caráter informativo e auxilia na avaliação nutricional profissional. Não substitui consulta médica.",
    margin, y + 10
  );
}

function sectionTitle(doc: jsPDF, y: number, title: string, margin: number): number {
  setText(doc, PETROL);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, y);
  return y + 7;
}

function checkPageBreak(doc: jsPDF, y: number, needed: number, childName: string, period: string, pageRef: { num: number }): number {
  if (y + needed > 270) {
    addFooter(doc, pageRef.num);
    pageRef.num++;
    doc.addPage();
    setFill(doc, LIGHT_BG);
    doc.rect(0, 0, 210, 297, "F");
    addPageHeader(doc, childName, period);
    return 26;
  }
  return y;
}

export function generateClinicalReport(data: ReportData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 16;
  const contentW = W - margin * 2;
  let y = 0;
  const page = { num: 1 };

  // ═══════════════════════════════════════════════════════════════════════════
  // PÁGINA 1: CAPA PROFISSIONAL
  // ═══════════════════════════════════════════════════════════════════════════
  setFill(doc, LIGHT_BG);
  doc.rect(0, 0, 210, 297, "F");

  // Header bar
  setFill(doc, PETROL);
  doc.rect(0, 0, W, 60, "F");

  // Gold accent line
  setFill(doc, GOLD);
  doc.rect(0, 60, W, 3, "F");

  // Title
  setText(doc, WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("RELATÓRIO NUTRICIONAL", margin, 20);

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Introdução Alimentar", margin, 32);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Acompanhamento clínico para nutricionistas e pediatras", margin, 42);

  // Badge
  setFill(doc, GOLD);
  doc.roundedRect(margin, 48, 56, 8, 2, 2, "F");
  setText(doc, PETROL);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("DOCUMENTO PROFISSIONAL", margin + 4, 53.5);

  // Child info section
  y = 76;
  setText(doc, PETROL);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(data.childName || "—", margin, y);

  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setText(doc, GRAY);

  const infoRows = [
    `Data de nascimento: ${data.birthDate || "—"}`,
    `Idade atual: ${data.currentAge || "—"}`,
    data.weight ? `Peso: ${data.weight} kg` : null,
    `Período analisado: ${data.period}`,
    `Método alimentar: ${data.feedingMethod || "Não informado"}`,
    `Responsável: ${data.responsibleName || "—"}`,
    `Data de emissão: ${new Date().toLocaleDateString("pt-BR")}`,
  ].filter(Boolean) as string[];

  infoRows.forEach((row) => {
    doc.text(row, margin, y);
    y += 6;
  });

  // Separator
  y += 4;
  setDraw(doc, [220, 220, 215]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, W - margin, y);

  // Quick stats
  y += 10;
  setText(doc, PETROL);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo Rápido", margin, y);
  y += 8;

  const stats = [
    { label: "Alimentos introduzidos", value: String(data.totalFoods) },
    { label: "Refeições registradas", value: String(data.totalMeals) },
    { label: "Aceitação positiva", value: `${data.acceptanceRate}%` },
    { label: "Novos este mês", value: String(data.newFoodsIntroduced) },
  ];

  const cardW = (contentW - 6) / 2;
  stats.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = margin + col * (cardW + 6);
    const cy = y + row * 24;

    setFill(doc, WHITE);
    doc.roundedRect(cx, cy, cardW, 20, 3, 3, "F");
    setDraw(doc, [230, 230, 225]);
    doc.roundedRect(cx, cy, cardW, 20, 3, 3, "S");

    // Left accent
    setFill(doc, GOLD);
    doc.roundedRect(cx, cy, 3, 20, 1.5, 1.5, "F");

    setText(doc, PETROL);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(s.value, cx + 10, cy + 12);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    setText(doc, GRAY);
    doc.text(s.label, cx + 10, cy + 17);
  });

  y += 54;

  // Acceptance bar
  setText(doc, PETROL);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Índice de Aceitação Alimentar", margin, y);
  y += 5;

  setFill(doc, [230, 230, 225]);
  doc.roundedRect(margin, y, contentW, 8, 3, 3, "F");

  if (data.acceptanceRate > 0) {
    setFill(doc, GREEN);
    doc.roundedRect(margin, y, (data.acceptanceRate / 100) * contentW, 8, 3, 3, "F");
  }
  const neutralStart = (data.acceptanceRate / 100) * contentW;
  if (data.neutralRate > 0) {
    setFill(doc, GOLD);
    doc.rect(margin + neutralStart, y, (data.neutralRate / 100) * contentW, 8, "F");
  }
  const rejectStart = neutralStart + (data.neutralRate / 100) * contentW;
  if (data.rejectionRate > 0) {
    setFill(doc, RED);
    doc.rect(margin + rejectStart, y, (data.rejectionRate / 100) * contentW, 8, "F");
  }

  y += 12;
  doc.setFontSize(7);
  setText(doc, GRAY);
  const legendItems = [
    { color: GREEN, label: `Aceitação ${data.acceptanceRate}%` },
    { color: GOLD, label: `Neutro ${data.neutralRate}%` },
    { color: RED, label: `Recusa ${data.rejectionRate}%` },
  ];
  legendItems.forEach((l, i) => {
    const lx = margin + i * 55;
    setFill(doc, l.color);
    doc.roundedRect(lx, y - 2, 6, 3, 1, 1, "F");
    setText(doc, GRAY);
    doc.text(l.label, lx + 8, y);
  });

  addFooter(doc, page.num);

  // ═══════════════════════════════════════════════════════════════════════════
  // PÁGINA 2: DIVERSIDADE + RANKINGS
  // ═══════════════════════════════════════════════════════════════════════════
  page.num++;
  doc.addPage();
  setFill(doc, LIGHT_BG);
  doc.rect(0, 0, 210, 297, "F");
  addPageHeader(doc, data.childName, data.period);
  y = 26;

  // ── 4. Diversidade Alimentar por Grupo ──
  y = sectionTitle(doc, y, "Diversidade Alimentar por Grupo", margin);

  const groups = data.foodGroups ?? [];
  if (groups.length > 0) {
    // Table header
    setFill(doc, PETROL);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
    setText(doc, WHITE);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("Grupo Alimentar", margin + 4, y + 5.5);
    doc.text("Qtd. Alimentos", margin + 70, y + 5.5);
    doc.text("Frequência", margin + 110, y + 5.5);
    doc.text("Status", margin + 145, y + 5.5);
    y += 9;

    groups.forEach((g, i) => {
      setFill(doc, i % 2 === 0 ? WHITE : LIGHT_BG);
      doc.rect(margin, y, contentW, 8, "F");
      setText(doc, DARK);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(g.group, margin + 4, y + 5.5);
      doc.text(String(g.count), margin + 75, y + 5.5);
      doc.text(`${g.frequency}x`, margin + 115, y + 5.5);

      const status = g.count >= 3 ? "Adequado" : g.count >= 1 ? "Explorar mais" : "Não introduzido";
      const statusColor = g.count >= 3 ? GREEN : g.count >= 1 ? GOLD_DARK : RED;
      setText(doc, statusColor);
      doc.setFont("helvetica", "bold");
      doc.text(status, margin + 145, y + 5.5);
      y += 9;
    });
  } else {
    setFill(doc, WHITE);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, "F");
    setText(doc, GRAY);
    doc.setFontSize(8);
    doc.text("Dados de grupos alimentares serão exibidos conforme registros forem adicionados.", margin + 4, y + 7);
    y += 16;
  }

  y += 6;

  // ── 5. Melhor Aceitação ──
  y = checkPageBreak(doc, y, 60, data.childName, data.period, page);
  y = sectionTitle(doc, y, "Alimentos com Melhor Aceitação", margin);

  if (data.bestAccepted.length > 0) {
    data.bestAccepted.slice(0, 5).forEach((item, i) => {
      setFill(doc, i % 2 === 0 ? WHITE : LIGHT_BG);
      doc.roundedRect(margin, y, contentW, 10, 2, 2, "F");
      const medals = ["🥇", "🥈", "🥉"];
      doc.setFontSize(9);
      setText(doc, DARK);
      doc.setFont("helvetica", "normal");
      doc.text(`${medals[i] ?? `${i + 1}.`}  ${item.food}`, margin + 4, y + 7);

      if (item.count) {
        doc.setFontSize(7);
        setText(doc, GRAY);
        doc.text(`${item.count}x oferecido`, margin + 85, y + 7);
      }

      const barX = margin + contentW - 50;
      const barW = 38;
      setFill(doc, [220, 240, 234]);
      doc.roundedRect(barX, y + 2.5, barW, 5, 2, 2, "F");
      setFill(doc, GREEN);
      doc.roundedRect(barX, y + 2.5, (item.rate / 100) * barW, 5, 2, 2, "F");

      setText(doc, GREEN);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(`${item.rate}%`, barX + barW + 2, y + 7);
      y += 11;
    });
  } else {
    setText(doc, GRAY);
    doc.setFontSize(8);
    doc.text("Nenhum registro de aceitação disponível.", margin, y + 4);
    y += 10;
  }

  y += 6;

  // ── 6. Maior Recusa ──
  y = checkPageBreak(doc, y, 50, data.childName, data.period, page);
  y = sectionTitle(doc, y, "Alimentos com Maior Recusa", margin);

  if (data.mostRejected.length > 0) {
    data.mostRejected.slice(0, 5).forEach((item, i) => {
      setFill(doc, i % 2 === 0 ? WHITE : LIGHT_BG);
      doc.roundedRect(margin, y, contentW, 10, 2, 2, "F");
      doc.setFontSize(9);
      setText(doc, DARK);
      doc.setFont("helvetica", "normal");
      doc.text(`${i + 1}.  ${item.food}`, margin + 4, y + 7);

      if (item.count) {
        doc.setFontSize(7);
        setText(doc, GRAY);
        doc.text(`${item.count}x exposto`, margin + 85, y + 7);
      }

      const barX = margin + contentW - 50;
      const barW = 38;
      setFill(doc, [250, 225, 222]);
      doc.roundedRect(barX, y + 2.5, barW, 5, 2, 2, "F");
      setFill(doc, RED);
      doc.roundedRect(barX, y + 2.5, (item.rate / 100) * barW, 5, 2, 2, "F");

      setText(doc, RED);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(`${item.rate}%`, barX + barW + 2, y + 7);
      y += 11;
    });
  } else {
    setText(doc, GRAY);
    doc.setFontSize(8);
    doc.text("Nenhum registro de recusa disponível.", margin, y + 4);
    y += 10;
  }

  y += 6;

  // ── 7. Reações / Intolerâncias ──
  y = checkPageBreak(doc, y, 40, data.childName, data.period, page);
  y = sectionTitle(doc, y, "Possíveis Reações ou Intolerâncias", margin);

  if (data.reactions.length === 0) {
    setFill(doc, GREEN_LIGHT);
    doc.roundedRect(margin, y, contentW, 10, 3, 3, "F");
    setText(doc, GREEN);
    doc.setFontSize(8);
    doc.text("Não houve reações relatadas no período.", margin + 4, y + 7);
    y += 14;
  } else {
    setFill(doc, PETROL);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
    setText(doc, WHITE);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("Data", margin + 4, y + 5.5);
    doc.text("Alimento", margin + 35, y + 5.5);
    doc.text("Reação Observada", margin + 85, y + 5.5);
    y += 9;

    data.reactions.forEach((r, i) => {
      y = checkPageBreak(doc, y, 10, data.childName, data.period, page);
      setFill(doc, i % 2 === 0 ? WHITE : RED_LIGHT);
      doc.rect(margin, y, contentW, 8, "F");
      setText(doc, DARK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(r.date, margin + 4, y + 5.5);
      doc.text(r.food, margin + 35, y + 5.5);
      const reactionLines = doc.splitTextToSize(r.type, 80);
      doc.text(reactionLines[0], margin + 85, y + 5.5);
      y += 9;
    });
    y += 4;
  }

  addFooter(doc, page.num);

  // ═══════════════════════════════════════════════════════════════════════════
  // PÁGINA 3: EVOLUÇÃO + INSIGHTS + OBSERVAÇÕES
  // ═══════════════════════════════════════════════════════════════════════════
  page.num++;
  doc.addPage();
  setFill(doc, LIGHT_BG);
  doc.rect(0, 0, 210, 297, "F");
  addPageHeader(doc, data.childName, data.period);
  y = 26;

  // ── Evolução Semanal ──
  y = sectionTitle(doc, y, "Evolução Semanal de Diversidade", margin);

  const chartH = 38;
  const weeks = data.weeklyIntroductions;
  const maxVal = Math.max(...weeks, 1);
  const barGap = contentW / Math.max(weeks.length, 1);
  const barWidth = barGap * 0.55;

  // Grid lines
  setDraw(doc, [230, 230, 225]);
  doc.setLineWidth(0.2);
  for (let i = 0; i <= 4; i++) {
    const lineY = y + chartH - (i / 4) * chartH;
    doc.line(margin, lineY, margin + contentW, lineY);
    setText(doc, GRAY);
    doc.setFontSize(6);
    doc.text(String(Math.round((i / 4) * maxVal)), margin - 4, lineY + 1, { align: "right" });
  }

  weeks.forEach((val, i) => {
    const barH = Math.max((val / maxVal) * chartH, val > 0 ? 2 : 0);
    const bx = margin + i * barGap + barGap * 0.22;
    const by = y + chartH - barH;

    setFill(doc, GOLD);
    doc.roundedRect(bx, by, barWidth, barH, 2, 2, "F");

    setText(doc, PETROL);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(String(val), bx + barWidth / 2, by - 2, { align: "center" });

    setText(doc, GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text(`Sem ${i + 1}`, bx + barWidth / 2, y + chartH + 4, { align: "center" });
  });
  y += chartH + 14;

  // ── 8. Comportamento Alimentar ──
  if (data.behavioralNotes) {
    y = checkPageBreak(doc, y, 30, data.childName, data.period, page);
    y = sectionTitle(doc, y, "Comportamento e Ambiente Alimentar", margin);
    setFill(doc, WHITE);
    doc.roundedRect(margin, y, contentW, 24, 3, 3, "F");
    setDraw(doc, [230, 230, 225]);
    doc.roundedRect(margin, y, contentW, 24, 3, 3, "S");
    setText(doc, DARK);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const behLines = doc.splitTextToSize(data.behavioralNotes, contentW - 8);
    doc.text(behLines.slice(0, 5), margin + 4, y + 6);
    y += 30;
  }

  // ── 9. Contexto Familiar ──
  if (data.familyContext) {
    y = checkPageBreak(doc, y, 30, data.childName, data.period, page);
    y = sectionTitle(doc, y, "Rotina e Contexto Familiar", margin);
    setFill(doc, WHITE);
    doc.roundedRect(margin, y, contentW, 24, 3, 3, "F");
    setDraw(doc, [230, 230, 225]);
    doc.roundedRect(margin, y, contentW, 24, 3, 3, "S");
    setText(doc, DARK);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const famLines = doc.splitTextToSize(data.familyContext, contentW - 8);
    doc.text(famLines.slice(0, 5), margin + 4, y + 6);
    y += 30;
  }

  // ── 10. Observações Registradas nas Refeições ──
  const obs = data.mealObservations ?? [];
  y = checkPageBreak(doc, y, 30, data.childName, data.period, page);
  y = sectionTitle(doc, y, "Observações Registradas nas Refeições", margin);

  if (obs.length === 0) {
    setFill(doc, WHITE);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, "F");
    setDraw(doc, [230, 230, 225]);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, "S");
    setText(doc, GRAY);
    doc.setFontSize(8);
    doc.text("Nenhuma observação foi registrada no período.", margin + 4, y + 7);
    y += 16;
  } else {
    // Table header
    setFill(doc, PETROL);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
    setText(doc, WHITE);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text("Data", margin + 3, y + 5.5);
    doc.text("Refeição", margin + 25, y + 5.5);
    doc.text("Alimento", margin + 55, y + 5.5);
    doc.text("Status", margin + 100, y + 5.5);
    doc.text("Observação", margin + 125, y + 5.5);
    y += 9;

    const statusLabels: Record<string, string> = { ate: "Comeu", did_not_eat: "Não comeu", tried: "Provou" };
    const mealLabels: Record<string, string> = { cafe: "Café", almoco: "Almoço", jantar: "Jantar", lanche: "Lanche" };

    obs.forEach((o, i) => {
      y = checkPageBreak(doc, y, 10, data.childName, data.period, page);
      setFill(doc, i % 2 === 0 ? WHITE : LIGHT_BG);
      doc.rect(margin, y, contentW, 8, "F");
      setText(doc, DARK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text(o.date, margin + 3, y + 5.5);
      doc.text(mealLabels[o.meal] || o.meal, margin + 25, y + 5.5);
      doc.text(doc.splitTextToSize(o.food, 40)[0], margin + 55, y + 5.5);
      doc.text(statusLabels[o.status] || o.status, margin + 100, y + 5.5);
      const noteLines = doc.splitTextToSize(o.note, 48);
      doc.text(noteLines[0] || "", margin + 125, y + 5.5);
      y += 9;
    });
    y += 4;
  }

  // ── 10b. Ocorrências Registradas após Consumo ──
  const occs = data.foodOccurrences ?? [];
  y = checkPageBreak(doc, y, 30, data.childName, data.period, page);
  y = sectionTitle(doc, y, "Ocorrências Registradas após Consumo", margin);

  if (occs.length === 0) {
    setFill(doc, WHITE);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, "F");
    setDraw(doc, [230, 230, 225]);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, "S");
    setText(doc, GRAY);
    doc.setFontSize(8);
    doc.text("Nenhuma ocorrência registrada no período.", margin + 4, y + 7);
    y += 16;
  } else {
    setFill(doc, PETROL);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
    setText(doc, WHITE);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text("Data", margin + 3, y + 5.5);
    doc.text("Alimento", margin + 25, y + 5.5);
    doc.text("Reação", margin + 65, y + 5.5);
    doc.text("Tempo", margin + 110, y + 5.5);
    doc.text("Intensidade", margin + 135, y + 5.5);
    y += 9;

    occs.forEach((o, i) => {
      y = checkPageBreak(doc, y, 10, data.childName, data.period, page);
      setFill(doc, i % 2 === 0 ? WHITE : RED_LIGHT);
      doc.rect(margin, y, contentW, 8, "F");
      setText(doc, DARK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text(o.date, margin + 3, y + 5.5);
      doc.text(doc.splitTextToSize(o.food, 35)[0], margin + 25, y + 5.5);
      doc.text(doc.splitTextToSize(o.reaction, 40)[0], margin + 65, y + 5.5);
      doc.text(o.timeAfter, margin + 110, y + 5.5);
      doc.text(o.intensity || "—", margin + 135, y + 5.5);
      y += 9;
    });
    y += 4;
  }

  // ── 10c. Observações do Responsável ──
  y = checkPageBreak(doc, y, 30, data.childName, data.period, page);
  y = sectionTitle(doc, y, "Observações do Responsável", margin);

  setFill(doc, WHITE);
  const notesText = data.parentNotes || "Nenhuma observação adicional.";
  const notesLines = doc.splitTextToSize(notesText, contentW - 8);
  const notesH = Math.max(20, notesLines.length * 4 + 10);
  doc.roundedRect(margin, y, contentW, notesH, 3, 3, "F");
  setDraw(doc, [230, 230, 225]);
  doc.roundedRect(margin, y, contentW, notesH, 3, 3, "S");
  setText(doc, DARK);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(notesLines, margin + 4, y + 7);
  y += notesH + 6;

  // ── 11. Análise Automática ──
  const insights = data.insights ?? generateAutoInsights(data);
  if (insights.length > 0) {
    y = checkPageBreak(doc, y, 10 + insights.length * 8, data.childName, data.period, page);
    y = sectionTitle(doc, y, "Análise Automática do Sistema", margin);

    setFill(doc, [245, 248, 255]);
    const insightH = insights.length * 8 + 6;
    doc.roundedRect(margin, y, contentW, insightH, 3, 3, "F");
    setDraw(doc, [200, 210, 230]);
    doc.roundedRect(margin, y, contentW, insightH, 3, 3, "S");

    insights.forEach((insight, i) => {
      setText(doc, PETROL);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.text(`•  ${insight}`, margin + 4, y + 6 + i * 8);
    });
    y += insightH + 6;
  }

  // ── 12. Considerações Finais ──
  y = checkPageBreak(doc, y, 20, data.childName, data.period, page);
  y = sectionTitle(doc, y, "Considerações Finais", margin);
  setFill(doc, WHITE);
  doc.roundedRect(margin, y, contentW, 16, 3, 3, "F");
  setDraw(doc, [230, 230, 225]);
  doc.roundedRect(margin, y, contentW, 16, 3, 3, "S");
  setText(doc, GRAY);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Este relatório tem caráter informativo e auxilia na avaliação nutricional profissional.",
    margin + 4, y + 6
  );
  doc.text(
    "Não substitui diagnóstico, orientação ou acompanhamento por nutricionista ou pediatra.",
    margin + 4, y + 12
  );

  addFooter(doc, page.num);

  // Save
  const filename = `relatorio-nutricional-${(data.childName || "bebe").toLowerCase().replace(/\s+/g, "-")}.pdf`;
  doc.save(filename);
}

// ── Auto-insights generator ──
function generateAutoInsights(data: ReportData): string[] {
  const insights: string[] = [];

  if (data.totalFoods === 0) {
    insights.push("Nenhum alimento foi registrado. Inicie os registros para análises detalhadas.");
    return insights;
  }

  if (data.acceptanceRate >= 70) {
    insights.push(`Índice de aceitação de ${data.acceptanceRate}% — considerado adequado.`);
  } else if (data.acceptanceRate >= 40) {
    insights.push(`Índice de aceitação de ${data.acceptanceRate}% — pode ser ampliado com reexposição.`);
  } else {
    insights.push(`Índice de aceitação de ${data.acceptanceRate}% — recomenda-se avaliar estratégias de oferta.`);
  }

  if (data.mostRejected.length > 0) {
    const topRejected = data.mostRejected[0];
    insights.push(`"${topRejected.food}" apresenta a maior taxa de recusa (${topRejected.rate}%). Considerar reexposição.`);
  }

  if (data.reactionsCount > 0) {
    insights.push(`${data.reactionsCount} reação(ões) registrada(s). Recomenda-se atenção e acompanhamento.`);
  } else {
    insights.push("Nenhuma reação adversa registrada no período avaliado.");
  }

  const groups = data.foodGroups ?? [];
  const lowGroups = groups.filter((g) => g.count < 2);
  if (lowGroups.length > 0) {
    insights.push(`Grupos com baixa diversidade: ${lowGroups.map((g) => g.group).join(", ")}.`);
  }

  if (data.weeklyFrequency < 3) {
    insights.push("Frequência semanal de refeições registradas abaixo de 3. Considerar aumentar a regularidade.");
  }

  return insights;
}
