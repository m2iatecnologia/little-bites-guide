import { useState, useMemo } from "react";
import { pantryCategories } from "@/data/pantryFoods";
import { Search, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PantrySelectionProps {
  selected: string[];
  onChange: (foods: string[]) => void;
  onConfirm: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export function PantrySelection({ selected, onChange, onConfirm, onCancel, saving }: PantrySelectionProps) {
  const [search, setSearch] = useState("");
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(
    () => Object.fromEntries(pantryCategories.map((c) => [c.key, true]))
  );

  const toggle = (name: string) => {
    onChange(
      selected.includes(name)
        ? selected.filter((f) => f !== name)
        : [...selected, name]
    );
  };

  const toggleCat = (key: string) => {
    setExpandedCats((p) => ({ ...p, [key]: !p[key] }));
  };

  const selectAll = (catKey: string) => {
    const cat = pantryCategories.find((c) => c.key === catKey);
    if (!cat) return;
    const allNames = cat.items.map((i) => i.name);
    const allSelected = allNames.every((n) => selected.includes(n));
    if (allSelected) {
      onChange(selected.filter((f) => !allNames.includes(f)));
    } else {
      onChange([...new Set([...selected, ...allNames])]);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return pantryCategories;
    const q = search.toLowerCase();
    return pantryCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((i) => i.name.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
          🛒 O que você tem em casa?
        </h2>
        <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Selecione os alimentos disponíveis para montar o cardápio
        </p>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-center">
        <span className="px-4 py-1.5 rounded-full text-xs font-bold" style={{
          fontWeight: 700,
          background: selected.length > 0 ? "hsl(var(--app-gold-light))" : "hsl(var(--app-cream))",
          color: "hsl(var(--app-petrol))",
        }}>
          {selected.length} alimento{selected.length !== 1 ? "s" : ""} selecionado{selected.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar alimento..."
          className="pl-9 text-xs h-9"
        />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {filteredCategories.map((cat) => {
          const isOpen = expandedCats[cat.key] !== false;
          const catSelected = cat.items.filter((i) => selected.includes(i.name)).length;
          return (
            <div key={cat.key} className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", boxShadow: "0 1px 4px rgba(46,64,87,0.06)" }}>
              <button
                onClick={() => toggleCat(cat.key)}
                className="w-full px-4 py-3 flex items-center justify-between active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-sm font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
                    {cat.label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{
                    fontWeight: 700,
                    background: catSelected > 0 ? "hsl(var(--app-gold-light))" : "hsl(var(--app-cream))",
                    color: catSelected > 0 ? "hsl(var(--app-gold-dark))" : "hsl(var(--muted-foreground))",
                  }}>
                    {catSelected}/{cat.items.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); selectAll(cat.key); }}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg active:scale-95"
                    style={{ fontWeight: 700, color: "hsl(var(--app-gold-dark))" }}
                  >
                    {catSelected === cat.items.length ? "Desmarcar" : "Todos"}
                  </button>
                  {isOpen ? <ChevronUp size={14} style={{ color: "hsl(var(--muted-foreground))" }} /> : <ChevronDown size={14} style={{ color: "hsl(var(--muted-foreground))" }} />}
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3 flex flex-wrap gap-2">
                  {cat.items.map((item) => {
                    const isSelected = selected.includes(item.name);
                    return (
                      <button
                        key={item.name}
                        onClick={() => toggle(item.name)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                        style={{
                          fontWeight: 600,
                          background: isSelected ? "hsl(var(--app-gold))" : "hsl(var(--app-cream))",
                          color: "hsl(var(--app-petrol))",
                          border: isSelected ? "1.5px solid hsl(var(--app-gold-dark))" : "1.5px solid transparent",
                        }}
                      >
                        <span>{item.emoji}</span>
                        {item.name}
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={onConfirm}
          disabled={selected.length < 3 || saving}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
          style={{
            background: "hsl(var(--app-gold))",
            color: "hsl(var(--app-petrol))",
            fontWeight: 700,
            boxShadow: "0 4px 16px rgba(244,201,93,0.35)",
          }}
        >
          {saving ? "Gerando cardápio..." : `✨ Gerar cardápio (${selected.length} itens)`}
        </button>
        {selected.length < 3 && selected.length > 0 && (
          <p className="text-[10px] text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
            Selecione pelo menos 3 alimentos
          </p>
        )}
        <button
          onClick={onCancel}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
          style={{
            background: "transparent",
            color: "hsl(var(--muted-foreground))",
            border: "1.5px solid hsl(var(--app-divider))",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
