import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import dicaImg from "@/assets/dica-do-dia.jpg";
import {
  dicasDoDia,
  getDicaDoDia,
  getCategoriaColor,
  getCategoriaBg,
  type DicaDoDia,
} from "@/data/dicasDoDia";

const categorias = ["Todas", "segurança", "rotina", "alergias", "aceitação", "nutrição", "preparo"];
const categoriaLabels: Record<string, string> = {
  Todas: "Todas",
  segurança: "🚨 Segurança",
  rotina: "📅 Rotina",
  alergias: "⚠️ Alergias",
  aceitação: "💚 Aceitação",
  nutrição: "💪 Nutrição",
  preparo: "🍳 Preparo",
};

export default function DicasPage() {
  const navigate = useNavigate();
  const [selectedDica, setSelectedDica] = useState<DicaDoDia | null>(null);
  const [filterCat, setFilterCat] = useState("Todas");
  const dicaHoje = getDicaDoDia();

  const filtered = filterCat === "Todas"
    ? dicasDoDia
    : dicasDoDia.filter((d) => d.categoria === filterCat);

  if (selectedDica) {
    return (
      <div className="app-container bottom-nav-safe">
        <div className="px-5 pt-6 pb-4">
          <button
            onClick={() => setSelectedDica(null)}
            className="flex items-center gap-2 mb-4 active:scale-95 transition-all"
          >
            <ArrowLeft size={18} style={{ color: "hsl(var(--app-petrol))" }} />
            <span className="text-sm font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
              Voltar
            </span>
          </button>
        </div>

        <div className="px-4 pb-6">
          <div className="card-clinical overflow-hidden">
            <div className="relative h-44">
              <img src={dicaImg} alt={selectedDica.titulo} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 p-4"
                style={{ background: "linear-gradient(to top, rgba(46,64,87,0.8), transparent)" }}>
                <span className="text-3xl">{selectedDica.emoji}</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{
                    fontWeight: 700,
                    background: getCategoriaBg(selectedDica.categoria),
                    color: getCategoriaColor(selectedDica.categoria),
                  }}>
                  {categoriaLabels[selectedDica.categoria]}
                </span>
              </div>
              <h1 className="text-lg font-bold" style={{ fontWeight: 800, color: "hsl(var(--app-petrol))" }}>
                {selectedDica.titulo}
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
                {selectedDica.texto}
              </p>
              {selectedDica.id === dicaHoje.id && (
                <div className="px-3 py-2 rounded-xl text-xs font-bold text-center"
                  style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-gold-dark))", fontWeight: 700 }}>
                  ⭐ Dica do dia de hoje
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container bottom-nav-safe">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl active:scale-95 transition-all"
            style={{ background: "hsl(var(--app-cream))" }}>
            <ArrowLeft size={18} style={{ color: "hsl(var(--app-petrol))" }} />
          </button>
          <h1 className="text-xl" style={{ fontWeight: 900, color: "hsl(var(--app-petrol))" }}>
            💡 Dicas
          </h1>
        </div>

        {/* Dica do dia highlight */}
        <button
          onClick={() => setSelectedDica(dicaHoje)}
          className="card-clinical overflow-hidden w-full text-left mb-4"
        >
          <div className="relative h-36">
            <img src={dicaImg} alt="Dica do dia" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute bottom-0 left-0 right-0 p-3"
              style={{ background: "linear-gradient(to top, rgba(46,64,87,0.7), transparent)" }}>
              <span className="tag-highlight mb-1 inline-block">⭐ Dica do dia</span>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between">
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
                {dicaHoje.titulo}
              </p>
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                {dicaHoje.texto}
              </p>
            </div>
            <ChevronRight size={18} style={{ color: "hsl(var(--app-gold-dark))" }} />
          </div>
        </button>

        {/* Category filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
          {categorias.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap flex-shrink-0 active:scale-95 transition-all"
              style={{
                fontWeight: 700,
                background: filterCat === cat ? "hsl(var(--app-gold))" : "hsl(var(--app-cream))",
                color: "hsl(var(--app-petrol))",
              }}>
              {categoriaLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 space-y-2">
        {filtered.map((dica) => (
          <button key={dica.id} onClick={() => setSelectedDica(dica)}
            className="card-clinical w-full text-left p-4 flex items-center gap-3 active:scale-[0.99] transition-all">
            <span className="text-2xl flex-shrink-0">{dica.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ fontWeight: 700, color: "hsl(var(--app-petrol))" }}>
                {dica.titulo}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    fontWeight: 700,
                    background: getCategoriaBg(dica.categoria),
                    color: getCategoriaColor(dica.categoria),
                  }}>
                  {dica.categoria}
                </span>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
