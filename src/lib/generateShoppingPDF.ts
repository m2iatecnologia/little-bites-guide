import jsPDF from "jspdf";

interface ShoppingPDFItem {
  name: string;
  qty: string;
}

interface ShoppingPDFData {
  categories: Record<string, ShoppingPDFItem[]>;
  babyName?: string;
  babyAge?: string;
  responsibleName?: string;
}

const PETROL: [number, number, number] = [46, 64, 87];
const GOLD: [number, number, number] = [244, 201, 93];
const DARK: [number, number, number] = [30, 35, 45];
const GRAY: [number, number, number] = [100, 110, 120];
const LIGHT_BG: [number, number, number] = [250, 248, 244];
const WHITE: [number, number, number] = [255, 255, 255];

export function generateShoppingListPDF(data: ShoppingPDFData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 16;
  const contentW = W - margin * 2;
  let y = 0;

  // Background
  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, 0, W, 297, "F");

  // ── Header bar ──
  doc.setFillColor(...PETROL);
  doc.rect(0, 0, W, 40, "F");

  doc.setFillColor(...GOLD);
  doc.rect(0, 40, W, 2.5, "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("🛒 Lista de Compras", margin, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, margin, 28);

  // Baby info line
  const infoItems: string[] = [];
  if (data.babyName) infoItems.push(data.babyName);
  if (data.babyAge) infoItems.push(data.babyAge);
  if (data.responsibleName) infoItems.push(`Resp.: ${data.responsibleName}`);
  if (infoItems.length > 0) {
    doc.text(infoItems.join("  ·  "), margin, 35);
  }

  y = 50;

  // Total items count
  const totalItems = Object.values(data.categories).flat().length;
  doc.setTextColor(...PETROL);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`${totalItems} ${totalItems === 1 ? "item" : "itens"} selecionados`, margin, y);
  y += 8;

  // ── Categories ──
  const categoryEntries = Object.entries(data.categories);

  categoryEntries.forEach(([category, items]) => {
    if (items.length === 0) return;

    // Check page break
    if (y + 15 + items.length * 9 > 275) {
      addFooter(doc);
      doc.addPage();
      doc.setFillColor(...LIGHT_BG);
      doc.rect(0, 0, W, 297, "F");
      y = 16;
    }

    // Category header
    doc.setFillColor(...PETROL);
    doc.roundedRect(margin, y, contentW, 9, 2, 2, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(category, margin + 4, y + 6.5);
    y += 11;

    // Items
    items.forEach((item, i) => {
      // Check page break for each item
      if (y + 9 > 275) {
        addFooter(doc);
        doc.addPage();
        doc.setFillColor(...LIGHT_BG);
        doc.rect(0, 0, W, 297, "F");
        y = 16;
      }

      doc.setFillColor(i % 2 === 0 ? WHITE[0] : LIGHT_BG[0], i % 2 === 0 ? WHITE[1] : LIGHT_BG[1], i % 2 === 0 ? WHITE[2] : LIGHT_BG[2]);
      doc.rect(margin, y, contentW, 8, "F");

      // Checkbox square
      doc.setDrawColor(180, 180, 175);
      doc.setLineWidth(0.4);
      doc.rect(margin + 3, y + 1.5, 5, 5);

      // Item name
      doc.setTextColor(...DARK);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(item.name, margin + 12, y + 5.5);

      // Quantity (right-aligned)
      doc.setTextColor(...GRAY);
      doc.setFontSize(8);
      doc.text(item.qty, W - margin - 4, y + 5.5, { align: "right" });

      y += 8.5;
    });

    y += 4;
  });

  // Footer
  addFooter(doc);

  const filename = `lista-compras-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}

function addFooter(doc: jsPDF) {
  const W = 210;
  const margin = 16;
  const y = 280;

  doc.setDrawColor(220, 220, 215);
  doc.setLineWidth(0.3);
  doc.line(margin, y, W - margin, y);

  doc.setTextColor(...GRAY);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Lista gerada pelo NutriBaby — Plataforma de acompanhamento alimentar infantil  |  nutribaby.app",
    margin, y + 4
  );
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
    W - margin, y + 4, { align: "right" }
  );
}
