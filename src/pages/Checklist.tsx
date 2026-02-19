import { useState } from "react";
import { checklistFoods } from "@/data/appData";
import { Scissors, AlertTriangle } from "lucide-react";

type Category = keyof typeof checklistFoods;

export default function Checklist() {
  const categories = Object.keys(checklistFoods) as Category[];
  const [activeCategory, setActiveCategory] = useState<Category>("Frutas");
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    Object.values(checklistFoods).flat().forEach(f => {
      if (f.introduced) init[f.name] = true;
    });
    return init;
  });

  const toggle = (name: string) =>
    setChecked(prev => ({ ...prev, [name]: !prev[name] }));

  const allFoods = Object.values(checklistFoods).flat();
  const totalIntroduced = Object.values(checked).filter(Boolean).length;
  const totalFoods = allFoods.length;
  const progress = Math.round((totalIntroduced / totalFoods) * 100);

  const foods = checklistFoods[activeCategory];
  const catIntroduced = foods.filter(f => checked[f.name]).length;

  const badges = [
    { count: 10, emoji: "🥉", label: "10 alimentos" },
    { count: 30, emoji: "🥈", label: "30 alimentos" },
    { count: 50, emoji: "🥇", label: "50 alimentos" },
  ];

  return (
    <div className="app-container bottom-nav-safe">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-900" style={{ fontWeight: 900 }}>
          Checklist de <span style={{ color: "hsl(var(--primary))" }}>Alimentos</span>
        </h1>

        {/* Progress */}
        <div className="card-food p-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-700" style={{ fontWeight: 700 }}>Progresso geral</span>
            <span className="text-sm font-700" style={{ color: "hsl(var(--primary))", fontWeight: 700 }}>
              {totalIntroduced}/{totalFoods}
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "hsl(var(--primary))" }} />
          </div>
          <p className="text-xs mt-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            {progress}% dos alimentos introduzidos 🎉
          </p>

          {/* Badges */}
          <div className="flex gap-2 mt-3">
            {badges.map(b => (
              <div key={b.count}
                className="flex-1 p-2 rounded-xl text-center"
                style={{
                  background: totalIntroduced >= b.count ? "hsl(var(--app-teal-light))" : "hsl(var(--muted))",
                  opacity: totalIntroduced >= b.count ? 1 : 0.5,
                }}>
                <p className="text-lg">{b.emoji}</p>
                <p className="text-xs font-700" style={{ fontWeight: 700 }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-700 transition-all"
              style={{
                fontWeight: 700,
                background: activeCategory === cat ? "hsl(var(--primary))" : "hsl(var(--card))",
                color: activeCategory === cat ? "white" : "hsl(var(--foreground))",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Foods list */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">{activeCategory}</h2>
          <span className="text-sm font-600" style={{ color: "hsl(var(--muted-foreground))" }}>
            {catIntroduced}/{foods.length}
          </span>
        </div>

        <div className="card-food divide-y" style={{ borderColor: "hsl(var(--border))" }}>
          {foods.map((food) => (
            <div key={food.name}
              className="flex items-center gap-3 px-4 py-3.5">
              {/* Checkbox */}
              <button
                onClick={() => toggle(food.name)}
                className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all border-2"
                style={{
                  background: checked[food.name] ? "hsl(var(--primary))" : "transparent",
                  borderColor: checked[food.name] ? "hsl(var(--primary))" : "hsl(var(--border))",
                }}>
                {checked[food.name] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-600" style={{
                    fontWeight: 600,
                    textDecoration: checked[food.name] ? "line-through" : "none",
                    color: checked[food.name] ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))",
                  }}>
                    {food.name}
                  </span>
                  <span className="text-xs font-600" style={{ color: "hsl(var(--primary))", fontWeight: 600 }}>
                    {food.age}
                  </span>
                  {food.warning && (
                    <AlertTriangle size={13} style={{ color: "hsl(44 100% 50%)", flexShrink: 0 }} />
                  )}
                </div>
              </div>

              {/* Action */}
              <button className="p-1.5 rounded-lg" style={{ color: "hsl(var(--primary))" }}>
                <Scissors size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Export */}
        <button className="w-full mt-4 py-4 rounded-2xl font-700 text-sm"
          style={{ background: "hsl(var(--app-teal-light))", color: "hsl(var(--primary))", fontWeight: 700 }}>
          📤 Exportar histórico de alimentos
        </button>
      </div>
    </div>
  );
}
