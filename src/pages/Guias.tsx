import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { guides } from "@/data/appData";

const categories = ["Guias Básicos", "Atenção", "Transições", "Praticidade", "Quizzes"];

export default function Guias() {
  const [openCats, setOpenCats] = useState<string[]>([]);

  const toggle = (cat: string) =>
    setOpenCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const guidesByCategory = (cat: string) => guides.filter(g => g.category === cat);
  const recentGuides = guides.filter(g => g.isNew);
  const otherGuides = guides.filter(g => !g.isNew);

  return (
    <div className="app-container bottom-nav-safe">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-900" style={{ fontWeight: 900 }}>
          Guia da <span style={{ color: "hsl(var(--primary))" }}>Introdução Alimentar</span>
        </h1>
      </div>

      {/* Accordion categories */}
      <div className="px-4 space-y-2 mb-5">
        {categories.map(cat => {
          const isOpen = openCats.includes(cat);
          const catGuides = guidesByCategory(cat);
          return (
            <div key={cat} className="rounded-2xl overflow-hidden"
              style={{ background: "hsl(var(--card))", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <button
                onClick={() => toggle(cat)}
                className="w-full flex items-center justify-between px-4 py-4"
              >
                <span className="font-700" style={{ fontWeight: 700 }}>{cat}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(var(--primary))" }}>
                  {isOpen
                    ? <ChevronUp size={16} color="white" />
                    : <ChevronDown size={16} color="white" />}
                </div>
              </button>
              {isOpen && catGuides.length > 0 && (
                <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: "hsl(var(--border))" }}>
                  {catGuides.map(g => (
                    <button key={g.id} className="w-full text-left flex items-center gap-3 py-2">
                      <span className="text-2xl">{g.emoji}</span>
                      <div>
                        <p className="text-sm font-700" style={{ fontWeight: 700 }}>{g.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{g.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {isOpen && catGuides.length === 0 && (
                <div className="border-t px-4 py-3 text-sm" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                  Em breve novos guias nesta categoria!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recentes */}
      <div className="px-4">
        <h2 className="section-title">Recentes</h2>
        <div className="space-y-3">
          {recentGuides.map(g => (
            <div key={g.id} className="card-food p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-3xl">{g.emoji}</span>
                <div>
                  <p className="font-700 text-sm" style={{ fontWeight: 700 }}>👑 {g.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{g.description}</p>
                </div>
              </div>
              <span className="tag-green flex-shrink-0">Novo</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid guides */}
      <div className="px-4 mt-5 mb-4">
        <div className="grid grid-cols-2 gap-3">
          {otherGuides.map(g => (
            <button key={g.id} className="p-4 rounded-2xl text-left flex flex-col gap-2 min-h-28"
              style={{
                background: g.id % 2 === 0 ? "hsl(var(--primary))" : "hsl(168 50% 35%)",
                color: "white",
              }}>
              <span className="text-2xl">{g.emoji}</span>
              <p className="font-700 text-sm leading-tight" style={{ fontWeight: 700 }}>{g.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
