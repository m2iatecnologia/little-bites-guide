import { useState, useEffect } from "react";
import { X, SlidersHorizontal, Check } from "lucide-react";
import type { SortOption } from "@/hooks/useRecipes";

const ageOptions = ["+6m", "+7m", "+8m", "+9m", "+10m", "+12m"];
const difficultyOptions = ["Fácil", "Médio", "Avançado"];
const categoryOptions = ["Café da manhã", "Almoço", "Lanche", "Jantar"];
const timeRanges: { label: string; value: [number, number] }[] = [
  { label: "0–10 min", value: [0, 10] },
  { label: "10–20 min", value: [20, 20] },
  { label: "20–40 min", value: [20, 40] },
  { label: "40+ min", value: [40, 999] },
];
const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Mais recentes", value: "recent" },
  { label: "Menor tempo de preparo", value: "time_asc" },
  { label: "Maior tempo de preparo", value: "time_desc" },
  { label: "Mais fáceis primeiro", value: "easy_first" },
  { label: "Idade recomendada (menor → maior)", value: "age_asc" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  // Current values
  ageFilter: string;
  categoryFilter: string;
  difficultyFilter: string;
  timeRange: [number, number] | null;
  ingredientTags: string[];
  sortBy: SortOption;
  allIngredientOptions: string[];
  // Setters
  onApply: (state: FilterState) => void;
}

export interface FilterState {
  ageFilter: string;
  categoryFilter: string;
  difficultyFilter: string;
  timeRange: [number, number] | null;
  ingredientTags: string[];
  sortBy: SortOption;
}

export default function RecipeFilterModal({
  open, onClose,
  ageFilter, categoryFilter, difficultyFilter, timeRange, ingredientTags, sortBy,
  allIngredientOptions, onApply,
}: Props) {
  // Local state so user can cancel without applying
  const [local, setLocal] = useState<FilterState>({
    ageFilter, categoryFilter, difficultyFilter, timeRange, ingredientTags, sortBy,
  });
  const [ingredientInput, setIngredientInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (open) {
      setLocal({ ageFilter, categoryFilter, difficultyFilter, timeRange, ingredientTags, sortBy });
      setIngredientInput("");
    }
  }, [open, ageFilter, categoryFilter, difficultyFilter, timeRange, ingredientTags, sortBy]);

  if (!open) return null;

  const suggestions = ingredientInput.length >= 2
    ? allIngredientOptions.filter(
        (o) => o.toLowerCase().includes(ingredientInput.toLowerCase()) && !local.ingredientTags.includes(o)
      ).slice(0, 8)
    : [];

  const addTag = (tag: string) => {
    setLocal((s) => ({ ...s, ingredientTags: [...s.ingredientTags, tag] }));
    setIngredientInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    setLocal((s) => ({ ...s, ingredientTags: s.ingredientTags.filter((t) => t !== tag) }));
  };

  const clearAll = () => {
    setLocal({
      ageFilter: "Todos", categoryFilter: "Todos", difficultyFilter: "Todos",
      timeRange: null, ingredientTags: [], sortBy: "recent",
    });
  };

  const chipStyle = (active: boolean) => ({
    background: active ? "hsl(var(--app-gold-dark))" : "hsl(var(--muted))",
    color: active ? "white" : "hsl(var(--foreground))",
    fontWeight: 700 as const,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Bottom sheet */}
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl px-5 pt-5 pb-8 animate-in slide-in-from-bottom duration-300"
        style={{ background: "hsl(var(--background))" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full" style={{ background: "hsl(var(--border))" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
            <SlidersHorizontal size={18} className="inline mr-2" />
            Ordenar e Filtrar
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: "hsl(var(--muted))" }}>
            <X size={16} />
          </button>
        </div>

        {/* SORT */}
        <section className="mb-5">
          <h3 className="text-xs uppercase tracking-wider mb-2" style={{ fontWeight: 800, color: "hsl(var(--muted-foreground))" }}>
            Ordenação
          </h3>
          <div className="space-y-1.5">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLocal((s) => ({ ...s, sortBy: opt.value }))}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  background: local.sortBy === opt.value ? "hsl(var(--app-gold-light))" : "hsl(var(--card))",
                  fontWeight: local.sortBy === opt.value ? 700 : 400,
                }}
              >
                {opt.label}
                {local.sortBy === opt.value && <Check size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />}
              </button>
            ))}
          </div>
        </section>

        {/* AGE FILTER */}
        <section className="mb-5">
          <h3 className="text-xs uppercase tracking-wider mb-2" style={{ fontWeight: 800, color: "hsl(var(--muted-foreground))" }}>
            Idade
          </h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLocal((s) => ({ ...s, ageFilter: "Todos" }))} className="px-3 py-1.5 rounded-full text-xs" style={chipStyle(local.ageFilter === "Todos")}>
              Todos
            </button>
            {ageOptions.map((a) => (
              <button key={a} onClick={() => setLocal((s) => ({ ...s, ageFilter: a }))} className="px-3 py-1.5 rounded-full text-xs" style={chipStyle(local.ageFilter === a)}>
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* CATEGORY FILTER */}
        <section className="mb-5">
          <h3 className="text-xs uppercase tracking-wider mb-2" style={{ fontWeight: 800, color: "hsl(var(--muted-foreground))" }}>
            Categoria
          </h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLocal((s) => ({ ...s, categoryFilter: "Todos" }))} className="px-3 py-1.5 rounded-full text-xs" style={chipStyle(local.categoryFilter === "Todos")}>
              Todos
            </button>
            {categoryOptions.map((c) => (
              <button key={c} onClick={() => setLocal((s) => ({ ...s, categoryFilter: c }))} className="px-3 py-1.5 rounded-full text-xs" style={chipStyle(local.categoryFilter === c)}>
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* DIFFICULTY */}
        <section className="mb-5">
          <h3 className="text-xs uppercase tracking-wider mb-2" style={{ fontWeight: 800, color: "hsl(var(--muted-foreground))" }}>
            Dificuldade
          </h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLocal((s) => ({ ...s, difficultyFilter: "Todos" }))} className="px-3 py-1.5 rounded-full text-xs" style={chipStyle(local.difficultyFilter === "Todos")}>
              Todos
            </button>
            {difficultyOptions.map((d) => (
              <button key={d} onClick={() => setLocal((s) => ({ ...s, difficultyFilter: d }))} className="px-3 py-1.5 rounded-full text-xs" style={chipStyle(local.difficultyFilter === d)}>
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* TIME RANGE */}
        <section className="mb-5">
          <h3 className="text-xs uppercase tracking-wider mb-2" style={{ fontWeight: 800, color: "hsl(var(--muted-foreground))" }}>
            Tempo de Preparo
          </h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLocal((s) => ({ ...s, timeRange: null }))} className="px-3 py-1.5 rounded-full text-xs" style={chipStyle(!local.timeRange)}>
              Todos
            </button>
            {timeRanges.map((tr) => {
              const active = local.timeRange?.[0] === tr.value[0] && local.timeRange?.[1] === tr.value[1];
              return (
                <button key={tr.label} onClick={() => setLocal((s) => ({ ...s, timeRange: tr.value }))} className="px-3 py-1.5 rounded-full text-xs" style={chipStyle(active)}>
                  {tr.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* INGREDIENT TAGS */}
        <section className="mb-6">
          <h3 className="text-xs uppercase tracking-wider mb-2" style={{ fontWeight: 800, color: "hsl(var(--muted-foreground))" }}>
            Ingredientes-chave
          </h3>
          {/* Tags */}
          {local.ingredientTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {local.ingredientTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                  style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", fontWeight: 700 }}
                >
                  {tag}
                  <button onClick={() => removeTag(tag)}><X size={12} /></button>
                </span>
              ))}
            </div>
          )}
          <div className="relative">
            <input
              value={ingredientInput}
              onChange={(e) => { setIngredientInput(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Digite um ingrediente..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-hidden shadow-lg z-10 max-h-40 overflow-y-auto"
                style={{ background: "hsl(var(--card))" }}
              >
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => addTag(s)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors capitalize"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={clearAll}
            className="flex-1 py-3 rounded-xl text-sm transition-all"
            style={{ background: "hsl(var(--muted))", fontWeight: 700 }}
          >
            Limpar filtros
          </button>
          <button
            onClick={() => { onApply(local); onClose(); }}
            className="flex-1 py-3 rounded-xl text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, hsl(var(--app-gold)), hsl(var(--app-gold-dark)))",
              color: "hsl(var(--app-petrol))",
              fontWeight: 800,
            }}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
