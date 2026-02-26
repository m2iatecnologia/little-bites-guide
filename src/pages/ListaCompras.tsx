import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  Check,
  Pencil,
  Loader2,
} from "lucide-react";
import { PremiumGate } from "@/components/PremiumGate";
import { useBaby } from "@/hooks/useBaby";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { generateShoppingListPDF } from "@/lib/generateShoppingPDF";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShoppingItem {
  name: string;
  qty: string;
  selected: boolean;
  purchased: boolean;
}

const initialCategories: Record<string, ShoppingItem[]> = {
  "🍎 Frutas": [
    { name: "Banana", qty: "5 unidades", selected: true, purchased: false },
    { name: "Maçã", qty: "3 unidades", selected: true, purchased: false },
    { name: "Mamão", qty: "1 unidade", selected: true, purchased: false },
    { name: "Pera", qty: "3 unidades", selected: true, purchased: false },
    { name: "Melancia", qty: "1/4 unidade", selected: true, purchased: false },
    { name: "Morango", qty: "1 bandeja", selected: true, purchased: false },
    { name: "Abacate", qty: "2 unidades", selected: true, purchased: false },
    { name: "Manga", qty: "2 unidades", selected: true, purchased: false },
  ],
  "🥦 Legumes e Verduras": [
    { name: "Cenoura", qty: "1 kg", selected: true, purchased: false },
    { name: "Abobrinha", qty: "2 unidades", selected: true, purchased: false },
    { name: "Batata doce", qty: "500g", selected: true, purchased: false },
    { name: "Brócolis", qty: "1 unidade", selected: true, purchased: false },
    { name: "Espinafre", qty: "1 maço", selected: true, purchased: false },
    { name: "Beterraba", qty: "2 unidades", selected: true, purchased: false },
    { name: "Abóbora", qty: "1/4 unidade", selected: true, purchased: false },
    { name: "Chuchu", qty: "2 unidades", selected: true, purchased: false },
  ],
  "🍗 Proteínas": [
    { name: "Frango", qty: "500g", selected: true, purchased: false },
    { name: "Ovos", qty: "1 dúzia", selected: true, purchased: false },
    { name: "Peixe", qty: "400g", selected: true, purchased: false },
    { name: "Feijão", qty: "500g", selected: true, purchased: false },
    { name: "Lentilha", qty: "500g", selected: true, purchased: false },
    { name: "Grão-de-bico", qty: "500g", selected: true, purchased: false },
  ],
  "🌾 Grãos e Cereais": [
    { name: "Arroz", qty: "1 kg", selected: true, purchased: false },
    { name: "Arroz integral", qty: "500g", selected: true, purchased: false },
    { name: "Aveia", qty: "400g", selected: true, purchased: false },
    { name: "Macarrão integral", qty: "500g", selected: true, purchased: false },
    { name: "Quinoa", qty: "300g", selected: true, purchased: false },
    { name: "Tapioca", qty: "500g", selected: true, purchased: false },
    { name: "Azeite", qty: "1 frasco", selected: true, purchased: false },
  ],
};

export default function ListaComprasPage() {
  return (
    <PremiumGate>
      <ListaCompras />
    </PremiumGate>
  );
}

function ListaCompras() {
  const navigate = useNavigate();
  const { baby } = useBaby();
  const { user } = useAuth();
  const [categories, setCategories] = useState(initialCategories);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingItem, setEditingItem] = useState<{ cat: string; idx: number } | null>(null);
  const [editQty, setEditQty] = useState("");

  const toggleSelected = (cat: string, idx: number) => {
    setCategories((prev) => {
      const updated = { ...prev };
      updated[cat] = [...updated[cat]];
      updated[cat][idx] = { ...updated[cat][idx], selected: !updated[cat][idx].selected };
      return updated;
    });
  };

  const togglePurchased = (cat: string, idx: number) => {
    setCategories((prev) => {
      const updated = { ...prev };
      updated[cat] = [...updated[cat]];
      updated[cat][idx] = { ...updated[cat][idx], purchased: !updated[cat][idx].purchased };
      return updated;
    });
  };

  const openEditQty = (cat: string, idx: number) => {
    setEditingItem({ cat, idx });
    setEditQty(categories[cat][idx].qty);
  };

  const saveQty = () => {
    if (!editingItem) return;
    setCategories((prev) => {
      const updated = { ...prev };
      updated[editingItem.cat] = [...updated[editingItem.cat]];
      updated[editingItem.cat][editingItem.idx] = {
        ...updated[editingItem.cat][editingItem.idx],
        qty: editQty || updated[editingItem.cat][editingItem.idx].qty,
      };
      return updated;
    });
    setEditingItem(null);
    setEditQty("");
  };

  const allItems = Object.values(categories).flat();
  const selectedItems = allItems.filter((i) => i.selected);
  const purchasedItems = allItems.filter((i) => i.purchased);

  const calcBabyAge = (): string => {
    if (!baby?.birth_date) return "";
    const birth = new Date(baby.birth_date);
    const now = new Date();
    const months = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    if (months < 1) return "< 1 mês";
    if (months < 24) return `${months} ${months === 1 ? "mês" : "meses"}`;
    const years = Math.floor(months / 12);
    return `${years} ${years === 1 ? "ano" : "anos"}`;
  };

  const handleExportPDF = async () => {
    if (selectedItems.length === 0) {
      toast.error("Selecione pelo menos 1 item para exportar o PDF.");
      return;
    }

    setIsGenerating(true);
    try {
      // Small delay for UX feedback
      await new Promise((r) => setTimeout(r, 400));

      // Build selected categories
      const selectedCategories: Record<string, { name: string; qty: string }[]> = {};
      Object.entries(categories).forEach(([cat, items]) => {
        const selected = items.filter((i) => i.selected).map((i) => ({ name: i.name, qty: i.qty }));
        if (selected.length > 0) {
          selectedCategories[cat] = selected;
        }
      });

      generateShoppingListPDF({
        categories: selectedCategories,
        babyName: baby?.name,
        babyAge: calcBabyAge(),
        responsibleName: user?.user_metadata?.full_name || "",
      });

      toast.success("PDF gerado com sucesso! 📄");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (selectedItems.length === 0) {
      toast.error("Selecione pelo menos 1 item para compartilhar.");
      return;
    }

    // Build text
    let text = "🛒 Lista de Compras\n";
    text += `📅 ${new Date().toLocaleDateString("pt-BR")}\n\n`;

    Object.entries(categories).forEach(([cat, items]) => {
      const selected = items.filter((i) => i.selected);
      if (selected.length === 0) return;
      text += `${cat}\n`;
      selected.forEach((item) => {
        text += `  □ ${item.name} — ${item.qty}\n`;
      });
      text += "\n";
    });

    text += "Gerado pelo NutriBaby 🍼";

    if (navigator.share) {
      try {
        await navigator.share({ title: "Lista de Compras", text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Lista copiada para a área de transferência! 📋");
    }
  };

  const selectAll = () => {
    setCategories((prev) => {
      const updated: typeof prev = {};
      Object.entries(prev).forEach(([cat, items]) => {
        updated[cat] = items.map((i) => ({ ...i, selected: true }));
      });
      return updated;
    });
  };

  const deselectAll = () => {
    setCategories((prev) => {
      const updated: typeof prev = {};
      Object.entries(prev).forEach(([cat, items]) => {
        updated[cat] = items.map((i) => ({ ...i, selected: false }));
      });
      return updated;
    });
  };

  return (
    <div className="app-container bottom-nav-safe">
      {/* Header */}
      <div className="px-5 pt-6 pb-4" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate("/cardapio")}
            className="p-2 rounded-xl transition-all active:scale-95"
            style={{ background: "hsl(var(--app-cream))" }}
          >
            <ArrowLeft size={18} style={{ color: "hsl(var(--app-petrol))" }} />
          </button>
          <div className="flex-1">
            <h1
              className="text-lg"
              style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}
            >
              🛒 Lista de Compras
            </h1>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {selectedItems.length} de {allItems.length} itens selecionados · {purchasedItems.length} comprados
            </p>
          </div>
        </div>

        {/* Progress */}
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "hsl(var(--app-cream-dark))" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${allItems.length > 0 ? (purchasedItems.length / allItems.length) * 100 : 0}%`,
              background: "hsl(var(--app-gold))",
            }}
          />
        </div>

        {/* Select all / deselect */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={selectAll}
            className="text-[10px] font-bold px-2 py-1 rounded-lg transition-all active:scale-95"
            style={{ background: "hsl(var(--app-cream))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
          >
            Selecionar tudo
          </button>
          <button
            onClick={deselectAll}
            className="text-[10px] font-bold px-2 py-1 rounded-lg transition-all active:scale-95"
            style={{ background: "hsl(var(--app-cream))", color: "hsl(var(--muted-foreground))", fontWeight: 700 }}
          >
            Limpar seleção
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-60"
            style={{
              background: "hsl(var(--app-gold))",
              color: "hsl(var(--app-petrol))",
              fontWeight: 700,
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download size={14} />
                Exportar PDF
              </>
            )}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            style={{
              background: "hsl(var(--app-cream))",
              color: "hsl(var(--app-petrol))",
              fontWeight: 700,
            }}
          >
            <Share2 size={14} />
            Compartilhar
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-4 space-y-4 pb-4">
        {Object.entries(categories).map(([cat, items]) => {
          const catSelected = items.filter((i) => i.selected).length;
          return (
            <div key={cat} className="card-clinical overflow-hidden">
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: "1px solid hsl(var(--app-divider))" }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}
                >
                  {cat}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{
                    fontWeight: 700,
                    background: catSelected === items.length ? "hsl(140 45% 90%)" : "hsl(var(--app-cream))",
                    color: catSelected === items.length ? "hsl(140 45% 35%)" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {catSelected}/{items.length}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: "hsl(var(--app-divider))" }}>
                {items.map((item, idx) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 px-4 py-3 transition-all"
                    style={{
                      background: item.purchased
                        ? "hsl(140 45% 96%)"
                        : !item.selected
                        ? "hsl(var(--app-cream) / 0.3)"
                        : "transparent",
                    }}
                  >
                    {/* Selection checkbox */}
                    <button
                      onClick={() => toggleSelected(cat, idx)}
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                      style={{
                        background: item.selected ? "hsl(var(--app-gold))" : "transparent",
                        border: item.selected ? "none" : "2px solid hsl(var(--app-cream-dark))",
                      }}
                    >
                      {item.selected && (
                        <Check size={12} style={{ color: "hsl(var(--app-petrol))" }} />
                      )}
                    </button>

                    {/* Purchased toggle */}
                    <button
                      onClick={() => togglePurchased(cat, idx)}
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                      style={{
                        background: item.purchased ? "hsl(140 50% 45%)" : "transparent",
                        border: item.purchased ? "none" : "2px solid hsl(var(--app-cream-dark))",
                      }}
                      title={item.purchased ? "Comprado" : "Marcar comprado"}
                    >
                      {item.purchased && (
                        <Check size={10} style={{ color: "white" }} />
                      )}
                    </button>

                    {/* Name */}
                    <span
                      className="text-sm flex-1"
                      style={{
                        color: "hsl(var(--app-petrol))",
                        textDecoration: item.purchased ? "line-through" : "none",
                        opacity: item.purchased ? 0.5 : item.selected ? 1 : 0.4,
                      }}
                    >
                      {item.name}
                    </span>

                    {/* Quantity + edit */}
                    <button
                      onClick={() => openEditQty(cat, idx)}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all active:scale-95"
                      style={{
                        background: "hsl(var(--app-cream))",
                        color: "hsl(var(--muted-foreground))",
                        opacity: item.selected ? 1 : 0.4,
                      }}
                    >
                      {item.qty}
                      <Pencil size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit quantity dialog */}
      <Dialog open={editingItem !== null} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle
              className="text-sm font-bold"
              style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}
            >
              ✏️ Editar quantidade
            </DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div>
              <p className="text-xs mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                {categories[editingItem.cat][editingItem.idx].name}
              </p>
              <input
                value={editQty}
                onChange={(e) => setEditQty(e.target.value)}
                placeholder="Ex: 500g, 3 unidades..."
                className="w-full text-sm p-3 rounded-xl border outline-none focus:ring-2"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveQty()}
              />
              <button
                onClick={saveQty}
                className="w-full mt-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{
                  background: "hsl(var(--app-gold))",
                  color: "hsl(var(--app-petrol))",
                  fontWeight: 700,
                }}
              >
                Salvar
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
