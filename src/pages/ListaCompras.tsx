import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  Check,
} from "lucide-react";

interface ShoppingItem {
  name: string;
  qty: string;
  checked: boolean;
}

const initialCategories: Record<string, ShoppingItem[]> = {
  "🍎 Frutas": [
    { name: "Banana", qty: "5 unidades", checked: false },
    { name: "Maçã", qty: "3 unidades", checked: false },
    { name: "Mamão", qty: "1 unidade", checked: false },
    { name: "Pera", qty: "3 unidades", checked: false },
    { name: "Melancia", qty: "1/4 unidade", checked: false },
    { name: "Morango", qty: "1 bandeja", checked: false },
    { name: "Abacate", qty: "2 unidades", checked: false },
    { name: "Manga", qty: "2 unidades", checked: false },
  ],
  "🥦 Legumes e Verduras": [
    { name: "Cenoura", qty: "1 kg", checked: false },
    { name: "Abobrinha", qty: "2 unidades", checked: false },
    { name: "Batata doce", qty: "500g", checked: false },
    { name: "Brócolis", qty: "1 unidade", checked: false },
    { name: "Espinafre", qty: "1 maço", checked: false },
    { name: "Beterraba", qty: "2 unidades", checked: false },
    { name: "Abóbora", qty: "1/4 unidade", checked: false },
    { name: "Chuchu", qty: "2 unidades", checked: false },
  ],
  "🍗 Proteínas": [
    { name: "Frango", qty: "500g", checked: false },
    { name: "Ovos", qty: "1 dúzia", checked: false },
    { name: "Peixe", qty: "400g", checked: false },
    { name: "Feijão", qty: "500g", checked: false },
    { name: "Lentilha", qty: "500g", checked: false },
    { name: "Grão-de-bico", qty: "500g", checked: false },
  ],
  "🌾 Grãos e Cereais": [
    { name: "Arroz", qty: "1 kg", checked: false },
    { name: "Arroz integral", qty: "500g", checked: false },
    { name: "Aveia", qty: "400g", checked: false },
    { name: "Macarrão integral", qty: "500g", checked: false },
    { name: "Quinoa", qty: "300g", checked: false },
    { name: "Tapioca", qty: "500g", checked: false },
    { name: "Azeite", qty: "1 frasco", checked: false },
  ],
};

export default function ListaCompras() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(initialCategories);

  const toggleItem = (cat: string, idx: number) => {
    setCategories((prev) => {
      const updated = { ...prev };
      updated[cat] = [...updated[cat]];
      updated[cat][idx] = { ...updated[cat][idx], checked: !updated[cat][idx].checked };
      return updated;
    });
  };

  const totalItems = Object.values(categories).flat().length;
  const checkedItems = Object.values(categories).flat().filter((i) => i.checked).length;

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
              {checkedItems} de {totalItems} itens comprados
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
              width: `${totalItems > 0 ? (checkedItems / totalItems) * 100 : 0}%`,
              background: "hsl(var(--app-gold))",
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate("/em-desenvolvimento")}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            style={{
              background: "hsl(var(--app-gold))",
              color: "hsl(var(--app-petrol))",
              fontWeight: 700,
            }}
          >
            <Download size={14} />
            Exportar PDF
          </button>
          <button
            onClick={() => navigate("/em-desenvolvimento")}
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
          const catChecked = items.filter((i) => i.checked).length;
          return (
            <div key={cat} className="card-clinical overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid hsl(var(--app-divider))" }}>
                <span
                  className="text-sm font-bold"
                  style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}
                >
                  {cat}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {catChecked}/{items.length}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: "hsl(var(--app-divider))" }}>
                {items.map((item, idx) => (
                  <button
                    key={item.name}
                    onClick={() => toggleItem(cat, idx)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all active:scale-[0.99]"
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: item.checked ? "hsl(var(--app-gold))" : "transparent",
                        border: item.checked ? "none" : "2px solid hsl(var(--app-cream-dark))",
                      }}
                    >
                      {item.checked && <Check size={12} style={{ color: "hsl(var(--app-petrol))" }} />}
                    </div>
                    <span
                      className="text-sm flex-1"
                      style={{
                        color: "hsl(var(--app-petrol))",
                        textDecoration: item.checked ? "line-through" : "none",
                        opacity: item.checked ? 0.5 : 1,
                      }}
                    >
                      {item.name}
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        color: "hsl(var(--muted-foreground))",
                        opacity: item.checked ? 0.5 : 1,
                      }}
                    >
                      {item.qty}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
