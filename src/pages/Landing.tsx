import { useNavigate } from "react-router-dom";
import { Baby, ChefHat, CalendarDays, ShieldCheck, Sparkles, Heart, Clock, Lightbulb, ArrowRight, CheckCircle2, HelpCircle, Apple, ListChecks } from "lucide-react";

const PROBLEMS = [
  { icon: HelpCircle, text: "Não sei o que meu bebê pode comer" },
  { icon: ShieldCheck, text: "Tenho medo de alergias" },
  { icon: Lightbulb, text: "Fico sem ideias do que preparar" },
  { icon: CheckCircle2, text: "Não sei se estou fazendo certo" },
];

const SOLUTIONS = [
  { icon: CalendarDays, title: "Cardápio semanal", desc: "Automático ou personalizado com o que você tem em casa" },
  { icon: Apple, title: "Seus alimentos", desc: "Monte o cardápio com o que já tem na despensa" },
  { icon: ChefHat, title: "Receitas seguras", desc: "Simples, testadas e adequadas para cada fase" },
  { icon: ListChecks, title: "Acompanhamento", desc: "Registre a evolução e reações do bebê" },
];

const STEPS = [
  { num: "1", title: "Cadastre seu bebê", desc: "Informe idade, peso e restrições alimentares" },
  { num: "2", title: "Escolha o modo", desc: "Cardápio automático ou baseado nos seus alimentos" },
  { num: "3", title: "Receba sugestões", desc: "Cardápios e receitas personalizadas" },
  { num: "4", title: "Acompanhe", desc: "Registre aceitação e evolução" },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "Mais segurança", desc: "Orientações baseadas em pediatria" },
  { icon: Heart, title: "Economia", desc: "Use o que já tem em casa" },
  { icon: Clock, title: "Praticidade", desc: "Cardápio pronto em segundos" },
  { icon: Sparkles, title: "Evolução visível", desc: "Acompanhe o progresso do bebê" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--app-cream))" }}>
      {/* HERO */}
      <section className="px-5 pt-12 pb-14 text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))" }}>
          <Baby size={14} /> Introdução alimentar simplificada
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4" style={{ color: "hsl(var(--app-petrol))", textWrap: "balance" }}>
          Nunca mais fique na dúvida sobre o que seu bebê pode comer
        </h1>

        <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: "hsl(var(--app-petrol-light))" }}>
          Receba cardápios personalizados, receitas e orientações para a introdução alimentar do seu filho.
        </p>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={() => navigate("/quiz")}
            className="w-full py-4 rounded-2xl font-bold text-base active:scale-[0.97] transition-transform"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 6px 24px hsla(43,88%,65%,0.4)" }}
          >
            Comece a usar <ArrowRight size={16} className="inline ml-1" />
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm active:scale-[0.97] transition-transform"
            style={{ background: "hsl(var(--app-card))", border: "1.5px solid hsl(var(--app-divider))", color: "hsl(var(--app-petrol))" }}
          >
            Já tenho conta · Entrar
          </button>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="px-5 py-12 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-center mb-6" style={{ color: "hsl(var(--app-petrol))" }}>
          Você se identifica?
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {PROBLEMS.map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 8px hsla(210,29%,29%,0.06)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(var(--app-gold-light))" }}>
                <p.icon size={18} style={{ color: "hsl(var(--app-petrol))" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "hsl(var(--app-petrol))" }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section className="px-5 py-12 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-center mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
          A solução está aqui
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: "hsl(var(--app-petrol-light))" }}>
          Tudo o que você precisa em um único app
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SOLUTIONS.map((s, i) => (
            <div key={i} className="p-4 rounded-2xl flex flex-col gap-2" style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 8px hsla(210,29%,29%,0.06)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--app-gold-light))" }}>
                <s.icon size={16} style={{ color: "hsl(var(--app-petrol))" }} />
              </div>
              <p className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>{s.title}</p>
              <p className="text-xs leading-snug" style={{ color: "hsl(var(--app-petrol-light))" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 py-12 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-center mb-6" style={{ color: "hsl(var(--app-petrol))" }}>
          Como funciona?
        </h2>
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 8px hsla(210,29%,29%,0.06)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-extrabold text-sm" style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))" }}>
                {s.num}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>{s.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(var(--app-petrol-light))" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-5 py-12 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-center mb-6" style={{ color: "hsl(var(--app-petrol))" }}>
          Por que usar o Nutroo?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {BENEFITS.map((b, i) => (
            <div key={i} className="p-4 rounded-2xl text-center flex flex-col items-center gap-2" style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 8px hsla(210,29%,29%,0.06)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--app-gold-light))" }}>
                <b.icon size={18} style={{ color: "hsl(var(--app-petrol))" }} />
              </div>
              <p className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>{b.title}</p>
              <p className="text-xs" style={{ color: "hsl(var(--app-petrol-light))" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 pt-8 pb-16 max-w-lg mx-auto text-center">
        <h2 className="text-lg font-bold mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
          Pronto para começar?
        </h2>
        <p className="text-sm mb-6" style={{ color: "hsl(var(--app-petrol-light))" }}>
          Monte um cardápio semanal com base nos alimentos que você já tem em casa.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={() => navigate("/quiz")}
            className="w-full py-4 rounded-2xl font-bold text-base active:scale-[0.97] transition-transform"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 6px 24px hsla(43,88%,65%,0.4)" }}
          >
            Comece a usar <ArrowRight size={16} className="inline ml-1" />
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm active:scale-[0.97] transition-transform"
            style={{ background: "hsl(var(--app-card))", border: "1.5px solid hsl(var(--app-divider))", color: "hsl(var(--app-petrol))" }}
          >
            Já tenho conta · Entrar
          </button>
        </div>
      </section>
    </div>
  );
}
