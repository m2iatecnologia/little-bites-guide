import { Link, useLocation } from "react-router-dom";
import { Home, Apple, BookOpen, CalendarDays, CheckSquare } from "lucide-react";

const navItems = [
  { to: "/", label: "Início", icon: Home },
  { to: "/alimentos", label: "Alimentos", icon: Apple },
  { to: "/receitas", label: "Receitas", icon: BookOpen },
  { to: "/cardapio", label: "Cardápio", icon: CalendarDays },
  { to: "/checklist", label: "Checklist", icon: CheckSquare },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 border-t"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--app-divider))",
      }}
    >
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 min-w-0 flex-1 py-1 px-0.5 transition-spring"
              style={{ transform: isActive ? "scale(1.05)" : "scale(1)" }}
            >
              <Icon
                size={22}
                className="transition-all"
                style={{
                  color: isActive ? "hsl(var(--app-gold-dark))" : "hsl(var(--app-petrol))",
                  fill: isActive ? "hsl(var(--app-gold-dark))" : "none",
                  strokeWidth: isActive ? 2.2 : 1.5,
                }}
              />
              <span
                className="text-[10px] leading-tight truncate"
                style={{
                  color: isActive ? "hsl(var(--app-gold-dark))" : "hsl(var(--app-petrol-light))",
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
