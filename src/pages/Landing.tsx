import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Baby, ChefHat, CalendarDays, ShieldCheck, Sparkles, Heart,
  Clock, Lightbulb, ArrowRight, CheckCircle2, HelpCircle, Apple,
  ListChecks, Star, Users
} from "lucide-react";

import logoImg from "@/assets/logo-nutroo.png";
import heroMomBaby from "@/assets/hero-mom-baby.jpg";
import babyEating from "@/assets/baby-eating.jpg";
import appMockup from "@/assets/app-mockup.png";

/* ── scroll-reveal hook ── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── data ── */
const PROBLEMS = [
  { icon: HelpCircle, text: "Não sei o que meu bebê pode comer" },
  { icon: ShieldCheck, text: "Tenho medo de alergias e reações" },
  { icon: Lightbulb, text: "Fico sem ideias do que preparar" },
  { icon: CheckCircle2, text: "Não sei se estou fazendo certo" },
];

const SOLUTIONS = [
  { icon: CalendarDays, title: "Cardápio semanal inteligente", desc: "Automático ou personalizado com o que você tem em casa" },
  { icon: Apple, title: "Seus alimentos, seu cardápio", desc: "Monte o cardápio com o que já tem na despensa" },
  { icon: ChefHat, title: "Receitas aprovadas", desc: "Simples, testadas e adequadas para cada fase do bebê" },
  { icon: ListChecks, title: "Acompanhamento completo", desc: "Registre a evolução, aceitação e reações do bebê" },
];

const STEPS = [
  { num: "1", title: "Cadastre seu bebê", desc: "Idade, peso e restrições alimentares" },
  { num: "2", title: "Escolha o modo", desc: "Automático ou baseado nos seus alimentos" },
  { num: "3", title: "Receba sugestões", desc: "Cardápios e receitas personalizadas" },
  { num: "4", title: "Acompanhe", desc: "Registre aceitação e evolução" },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "Mais segurança", desc: "Orientações baseadas em pediatria e nutrição infantil" },
  { icon: Heart, title: "Economia real", desc: "Use o que já tem em casa, sem desperdício" },
  { icon: Clock, title: "Praticidade total", desc: "Cardápio pronto em segundos, sem precisar pensar" },
  { icon: Sparkles, title: "Evolução visível", desc: "Acompanhe o progresso alimentar do bebê" },
];

const TESTIMONIALS = [
  { name: "Ana Carolina", role: "mãe de primeira viagem", text: "Depois desse app, nunca mais fiquei perdida na alimentação do meu filho. Recomendo demais!", rating: 5 },
  { name: "Mariana Santos", role: "mãe de gêmeos", text: "Com dois bebês, eu não tinha tempo de pesquisar. O Nutroo me salvou com cardápios prontos e receitas fáceis.", rating: 5 },
  { name: "Juliana Ferreira", role: "mãe de segunda viagem", text: "Mesmo já tendo passado pela IA uma vez, cada bebê é diferente. O app me ajudou a ter segurança de novo.", rating: 5 },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "hsl(var(--app-cream))" }}>

      {/* ═══ NAV ═══ */}
      <nav className="flex items-center justify-between px-5 py-4 max-w-5xl mx-auto">
        <img src={logoImg} alt="Nutroo" className="h-8 w-auto" />
        <button
          onClick={() => navigate("/auth")}
          className="text-sm font-semibold px-4 py-2 rounded-xl active:scale-[0.97] transition-transform"
          style={{ color: "hsl(var(--app-petrol))", background: "hsl(var(--app-card))", border: "1.5px solid hsl(var(--app-divider))" }}
        >
          Entrar
        </button>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="px-5 pt-6 pb-14 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* text */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5 animate-fade-in"
              style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))" }}
            >
              <Baby size={14} /> Introdução alimentar simplificada
            </div>

            <h1
              className="text-[1.75rem] sm:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 animate-fade-in"
              style={{ color: "hsl(var(--app-petrol))", textWrap: "balance", animationDelay: "100ms" }}
            >
              Nunca mais fique na dúvida sobre o que seu bebê pode comer
            </h1>

            <p
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 animate-fade-in"
              style={{ color: "hsl(var(--app-petrol-light))", textWrap: "pretty", animationDelay: "200ms" }}
            >
              Cardápios personalizados, receitas seguras e orientação completa para a introdução alimentar — tudo em um só app.
            </p>

            <div className="flex flex-col gap-3 max-w-xs mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <button
                onClick={() => navigate("/quiz")}
                className="w-full py-4 rounded-2xl font-bold text-base active:scale-[0.97] transition-all hover:brightness-105"
                style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 8px 32px hsla(43,88%,65%,0.45)" }}
              >
                Comece grátis por 7 dias <ArrowRight size={16} className="inline ml-1" />
              </button>
              <p className="text-xs text-center lg:text-left" style={{ color: "hsl(var(--app-petrol-light))" }}>
                Sem compromisso · Cancele quando quiser
              </p>
            </div>
          </div>

          {/* mockup */}
          <div className="flex-1 flex justify-center animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="relative">
              {/* soft blob behind */}
              <div
                className="absolute -inset-8 rounded-full blur-3xl opacity-40"
                style={{ background: "hsl(var(--app-gold-light))" }}
              />
              <img
                src={appMockup}
                alt="Tela do app Nutroo mostrando cardápio semanal"
                className="relative w-64 sm:w-72 lg:w-80 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF COUNTER ═══ */}
      <Reveal>
        <div className="flex items-center justify-center gap-2 py-6" style={{ color: "hsl(var(--app-petrol-light))" }}>
          <Users size={16} />
          <p className="text-sm font-semibold">
            Mais de <span style={{ color: "hsl(var(--app-petrol))" }}>2.347 famílias</span> já utilizam o Nutroo
          </p>
        </div>
      </Reveal>

      {/* ═══ PROBLEM ═══ */}
      <section className="px-5 py-14 max-w-lg mx-auto">
        <Reveal>
          <h2 className="text-xl font-extrabold text-center mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
            Você se identifica?
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: "hsl(var(--app-petrol-light))" }}>
            A maioria dos pais passa por isso na introdução alimentar
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-3">
          {PROBLEMS.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="flex items-center gap-3.5 p-4 rounded-2xl transition-shadow hover:shadow-md"
                style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 12px hsla(210,29%,29%,0.07)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(var(--app-gold-light))" }}>
                  <p.icon size={20} style={{ color: "hsl(var(--app-gold-dark))" }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: "hsl(var(--app-petrol))" }}>{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ EMOTIONAL ═══ */}
      <section className="px-5 py-14 max-w-5xl mx-auto">
        <Reveal>
          <div className="rounded-3xl overflow-hidden" style={{ background: "hsl(var(--app-card))", boxShadow: "0 4px 24px hsla(210,29%,29%,0.08)" }}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img src={heroMomBaby} alt="Mãe alimentando bebê com carinho" className="w-full h-56 md:h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                <Heart size={24} className="mb-3" style={{ color: "hsl(var(--app-gold-dark))" }} />
                <h2 className="text-lg font-extrabold mb-3 leading-snug" style={{ color: "hsl(var(--app-petrol))" }}>
                  Sabemos que a introdução alimentar pode gerar insegurança…
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--app-petrol-light))" }}>
                  É normal se sentir perdida. Cada bebê é único e os primeiros meses de alimentação trazem muitas dúvidas.
                  O Nutroo foi criado por quem entende essa jornada — para que você se sinta segura em cada refeição.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section className="px-5 py-14 max-w-lg mx-auto">
        <Reveal>
          <h2 className="text-xl font-extrabold text-center mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
            A solução está aqui
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: "hsl(var(--app-petrol-light))" }}>
            Tudo o que você precisa em um único app
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-3">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="p-5 rounded-2xl flex flex-col gap-2.5 transition-all hover:shadow-md h-full"
                style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 12px hsla(210,29%,29%,0.07)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--app-gold-light))" }}>
                  <s.icon size={20} style={{ color: "hsl(var(--app-gold-dark))" }} />
                </div>
                <p className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>{s.title}</p>
                <p className="text-xs leading-snug" style={{ color: "hsl(var(--app-petrol-light))" }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ APP SHOWCASE ═══ */}
      <section className="px-5 py-14 max-w-lg mx-auto text-center">
        <Reveal>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
            Veja o app em ação
          </h2>
          <p className="text-sm mb-8" style={{ color: "hsl(var(--app-petrol-light))" }}>
            Interface simples, intuitiva e feita para pais ocupados
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="relative inline-block">
            <div
              className="absolute -inset-6 rounded-full blur-3xl opacity-30"
              style={{ background: "hsl(var(--app-gold))" }}
            />
            <img
              src={babyEating}
              alt="Bebê feliz comendo alimentos saudáveis"
              className="relative w-full max-w-sm rounded-3xl shadow-xl mx-auto"
            />
          </div>
        </Reveal>
      </section>

      {/* ═══ HOW IT WORKS — TIMELINE ═══ */}
      <section className="px-5 py-14 max-w-lg mx-auto">
        <Reveal>
          <h2 className="text-xl font-extrabold text-center mb-8" style={{ color: "hsl(var(--app-petrol))" }}>
            Como funciona?
          </h2>
        </Reveal>
        <div className="relative">
          {/* timeline line */}
          <div
            className="absolute left-[22px] top-2 bottom-2 w-0.5 rounded-full"
            style={{ background: "hsl(var(--app-gold-light))" }}
          />
          <div className="space-y-5">
            {STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="flex items-start gap-4 relative">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-extrabold text-sm relative z-10"
                    style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 4px 12px hsla(43,88%,65%,0.3)" }}
                  >
                    {s.num}
                  </div>
                  <div
                    className="flex-1 p-4 rounded-2xl"
                    style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 12px hsla(210,29%,29%,0.07)" }}
                  >
                    <p className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>{s.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(var(--app-petrol-light))" }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="px-5 py-14 max-w-lg mx-auto">
        <Reveal>
          <h2 className="text-xl font-extrabold text-center mb-8" style={{ color: "hsl(var(--app-petrol))" }}>
            Por que usar o Nutroo?
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="p-5 rounded-2xl text-center flex flex-col items-center gap-2.5 transition-all hover:shadow-md h-full"
                style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 12px hsla(210,29%,29%,0.07)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--app-gold-light))" }}>
                  <b.icon size={22} style={{ color: "hsl(var(--app-gold-dark))" }} />
                </div>
                <p className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>{b.title}</p>
                <p className="text-xs leading-snug" style={{ color: "hsl(var(--app-petrol-light))" }}>{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="px-5 py-14 max-w-lg mx-auto">
        <Reveal>
          <h2 className="text-xl font-extrabold text-center mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
            O que dizem as mães
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: "hsl(var(--app-petrol-light))" }}>
            Histórias reais de quem já usa o Nutroo
          </p>
        </Reveal>
        <div className="space-y-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className="p-5 rounded-2xl transition-shadow hover:shadow-md"
                style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 12px hsla(210,29%,29%,0.07)" }}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="hsl(var(--app-gold))" style={{ color: "hsl(var(--app-gold))" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-3 italic" style={{ color: "hsl(var(--app-petrol))" }}>
                  "{t.text}"
                </p>
                <p className="text-xs font-bold" style={{ color: "hsl(var(--app-petrol))" }}>
                  {t.name} <span className="font-normal" style={{ color: "hsl(var(--app-petrol-light))" }}>— {t.role}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="px-5 pt-8 pb-20 max-w-lg mx-auto text-center">
        <Reveal>
          <div
            className="p-8 rounded-3xl"
            style={{ background: "hsl(var(--app-gold-light))", boxShadow: "0 4px 24px hsla(43,88%,65%,0.2)" }}
          >
            <h2 className="text-xl font-extrabold mb-2" style={{ color: "hsl(var(--app-petrol))" }}>
              Pronto para começar?
            </h2>
            <p className="text-sm mb-6" style={{ color: "hsl(var(--app-petrol-light))" }}>
              Monte um cardápio semanal personalizado agora mesmo.
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={() => navigate("/quiz")}
                className="w-full py-4 rounded-2xl font-bold text-base active:scale-[0.97] transition-all hover:brightness-105"
                style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 8px 32px hsla(43,88%,65%,0.45)" }}
              >
                Comece grátis por 7 dias <ArrowRight size={16} className="inline ml-1" />
              </button>
              <p className="text-xs" style={{ color: "hsl(var(--app-petrol-light))" }}>
                Sem compromisso · Cancele quando quiser
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm active:scale-[0.97] transition-transform"
                style={{ background: "hsl(var(--app-card))", border: "1.5px solid hsl(var(--app-divider))", color: "hsl(var(--app-petrol))" }}
              >
                Já tenho conta · Entrar
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* inline styles for scroll-reveal */}
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(18px);
          filter: blur(4px);
          transition: opacity 600ms cubic-bezier(0.16,1,0.3,1),
                      transform 600ms cubic-bezier(0.16,1,0.3,1),
                      filter 600ms cubic-bezier(0.16,1,0.3,1);
        }
        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      `}</style>
    </div>
  );
}
