import { Link, useLocation } from "react-router-dom";
import { Star, Apple, UtensilsCrossed, BookOpen, CalendarDays, CheckSquare } from "lucide-react";

const navItems = [
  { to: "/", label: "Início", icon: Star },
  { to: "/alimentos", label: "Alimentos", icon: Apple },
  { to: "/receitas", label: "Receitas", icon: UtensilsCrossed },
  { to: "/guias", label: "Guias", icon: BookOpen },
  { to: "/cardapio", label: "Cardápio", icon: CalendarDays },
  { to: "/checklist", label: "Checklist", icon: CheckSquare },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 border-t border-border"
      style={{ background: "hsl(var(--card))" }}>
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 min-w-0 flex-1 py-1 px-0.5"
            >
              <Icon
                size={22}
                className="transition-all"
                style={{
                  color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  fill: isActive ? "hsl(var(--primary))" : "none",
                  strokeWidth: isActive ? 2 : 1.5,
                }}
              />
              <span
                className="text-[10px] font-700 leading-tight truncate"
                style={{
                  color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  fontWeight: isActive ? 800 : 600,
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
