import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Baby, ChefHat, CalendarDays, ShieldCheck, Sparkles, Heart,
  Clock, Lightbulb, ArrowRight, CheckCircle2, HelpCircle, Apple,
  ListChecks, Star, Users, AlertTriangle, BookOpen, TrendingUp,
  Utensils, Check, Smartphone, ChevronRight, Lock
} from "lucide-react";

import logoImg from "@/assets/nutroo-logo-full.png";
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
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`scroll-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Phone mockup frame ── */
function PhoneMockup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-[220px] sm:w-[240px] lg:w-[260px] rounded-[28px] overflow-hidden"
        style={{
          background: "hsl(var(--app-card))",
          boxShadow: "0 20px 60px hsla(210,29%,29%,0.15), 0 4px 16px hsla(210,29%,29%,0.08)",
          border: "3px solid hsl(var(--app-divider))",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-2.5 pb-1" style={{ background: "hsl(var(--app-card))" }}>
          <span className="text-[10px] font-semibold" style={{ color: "hsl(var(--app-petrol))" }}>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-2 rounded-sm" style={{ background: "hsl(var(--app-petrol))", opacity: 0.3 }} />
            <div className="w-3 h-2 rounded-sm" style={{ background: "hsl(var(--app-petrol))", opacity: 0.3 }} />
            <div className="w-5 h-2.5 rounded-sm" style={{ background: "hsl(var(--app-petrol))", opacity: 0.3 }} />
          </div>
        </div>
        {/* Content */}
        <div className="px-3 pb-4 pt-1" style={{ background: "hsl(var(--app-cream))", minHeight: "340px" }}>
          {children}
        </div>
        {/* Home indicator */}
        <div className="flex justify-center pb-2" style={{ background: "hsl(var(--app-cream))" }}>
          <div className="w-24 h-1 rounded-full" style={{ background: "hsl(var(--app-petrol))", opacity: 0.15 }} />
        </div>
      </div>
      <p className="text-xs font-bold" style={{ color: "hsl(var(--app-petrol))" }}>{label}</p>
    </div>
  );
}

/* ── Fake app screens ── */
function ScreenCardapio() {
  const meals = [
    { time: "Manhã", food: "Papa de banana com aveia", status: "done" },
    { time: "Almoço", food: "Purê de abóbora com frango", status: "done" },
    { time: "Lanche", food: "Manga amassada", status: "current" },
    { time: "Jantar", food: "Sopa de legumes", status: "pending" },
  ];
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={14} style={{ color: "hsl(var(--app-gold-dark))" }} />
        <span className="text-xs font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Cardápio de Hoje</span>
      </div>
      <div className="text-[10px] font-semibold mb-2 px-1" style={{ color: "hsl(var(--app-petrol-light))" }}>Segunda-feira, 24 Mar</div>
      <div className="space-y-2">
        {meals.map((m, i) => (
          <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: "hsl(var(--app-card))", boxShadow: "0 1px 4px hsla(210,29%,29%,0.06)" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{
              background: m.status === "done" ? "hsl(var(--app-gold))" : m.status === "current" ? "hsl(var(--app-gold-light))" : "hsl(var(--app-cream-dark))"
            }}>
              {m.status === "done" ? <Check size={10} style={{ color: "hsl(var(--app-petrol))" }} /> :
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.status === "current" ? "hsl(var(--app-gold-dark))" : "hsl(var(--app-petrol-light))" }} />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold" style={{ color: "hsl(var(--app-petrol-light))" }}>{m.time}</p>
              <p className="text-[11px] font-semibold truncate" style={{ color: "hsl(var(--app-petrol))" }}>{m.food}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ScreenAlimentos() {
  const foods = [
    { name: "Banana", status: "Aceitou", emoji: "🍌", color: "hsl(120,50%,45%)" },
    { name: "Abóbora", status: "Aceitou", emoji: "🎃", color: "hsl(120,50%,45%)" },
    { name: "Morango", status: "Reação leve", emoji: "🍓", color: "hsl(40,90%,50%)" },
    { name: "Manga", status: "Não testado", emoji: "🥭", color: "hsl(210,15%,65%)" },
    { name: "Ovo", status: "Aceitou", emoji: "🥚", color: "hsl(120,50%,45%)" },
    { name: "Amendoim", status: "Não testado", emoji: "🥜", color: "hsl(210,15%,65%)" },
  ];
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Apple size={14} style={{ color: "hsl(var(--app-gold-dark))" }} />
        <span className="text-xs font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Alimentos</span>
      </div>
      <div className="space-y-1.5">
        {foods.map((f, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: "hsl(var(--app-card))", boxShadow: "0 1px 4px hsla(210,29%,29%,0.05)" }}>
            <span className="text-sm">{f.emoji}</span>
            <span className="text-[11px] font-semibold flex-1" style={{ color: "hsl(var(--app-petrol))" }}>{f.name}</span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${f.color}20`, color: f.color }}>{f.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function ScreenReceitas() {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <ChefHat size={14} style={{ color: "hsl(var(--app-gold-dark))" }} />
        <span className="text-xs font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Receitas</span>
      </div>
      <div className="rounded-xl overflow-hidden mb-2" style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 8px hsla(210,29%,29%,0.08)" }}>
        <img src={babyEating} alt="" className="w-full h-24 object-cover" loading="lazy" />
        <div className="p-2.5">
          <p className="text-[11px] font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Papa de banana com aveia</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))" }}>6+ meses</span>
            <span className="text-[9px]" style={{ color: "hsl(var(--app-petrol-light))" }}>⏱ 10 min</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 8px hsla(210,29%,29%,0.08)" }}>
        <div className="p-2.5 flex items-center gap-2">
          <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden">
            <img src={heroMomBaby} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <p className="text-[11px] font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Purê de abóbora</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))" }}>6+ meses</span>
              <span className="text-[9px]" style={{ color: "hsl(var(--app-petrol-light))" }}>⏱ 15 min</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ScreenChecklist() {
  const items = [
    { text: "Oferecer fruta pela manhã", done: true },
    { text: "Testar novo alimento", done: true },
    { text: "Registrar aceitação", done: false },
    { text: "Verificar reações", done: false },
    { text: "Preparar almoço BLW", done: false },
  ];
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <ListChecks size={14} style={{ color: "hsl(var(--app-gold-dark))" }} />
        <span className="text-xs font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Checklist do Dia</span>
      </div>
      <div className="rounded-xl p-3 mb-3" style={{ background: "hsl(var(--app-gold-light))" }}>
        <p className="text-[10px] font-bold" style={{ color: "hsl(var(--app-petrol))" }}>Progresso de hoje</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--app-cream-dark))" }}>
            <div className="h-full rounded-full" style={{ width: "40%", background: "hsl(var(--app-gold))" }} />
          </div>
          <span className="text-[10px] font-bold" style={{ color: "hsl(var(--app-petrol))" }}>2/5</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: "hsl(var(--app-card))", boxShadow: "0 1px 4px hsla(210,29%,29%,0.05)" }}>
            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{
              background: item.done ? "hsl(var(--app-gold))" : "transparent",
              border: item.done ? "none" : "1.5px solid hsl(var(--app-divider))"
            }}>
              {item.done && <Check size={10} style={{ color: "hsl(var(--app-petrol))" }} />}
            </div>
            <span className={`text-[11px] font-medium ${item.done ? "line-through opacity-50" : ""}`} style={{ color: "hsl(var(--app-petrol))" }}>{item.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── data ── */
const SOLUTIONS = [
  { icon: CalendarDays, title: "Cardápio inteligente por idade", desc: "Receba refeições prontas e adequadas para a fase do seu bebê, todos os dias" },
  { icon: ChefHat, title: "Receitas seguras e simples", desc: "Preparos rápidos, testados e pensados para cada etapa da introdução" },
  { icon: ListChecks, title: "Checklist de evolução alimentar", desc: "Acompanhe cada novo alimento oferecido e a reação do bebê" },
  { icon: TrendingUp, title: "Acompanhamento do desenvolvimento", desc: "Visualize o progresso alimentar e sinta segurança a cada semana" },
];

const TRUST_POINTS = [
  { icon: BookOpen, title: "Baseado em boas práticas", desc: "Conteúdo alinhado com as recomendações atuais de nutrição infantil" },
  { icon: ShieldCheck, title: "Atualizado constantemente", desc: "As orientações são revisadas e atualizadas com frequência" },
  { icon: Heart, title: "Feito para mães reais", desc: "Pensado para facilitar a rotina de quem cuida com amor" },
];

const TESTIMONIALS = [
  { name: "Juliana R.", text: "Eu não sabia por onde começar. O app me deu segurança total!", rating: 5 },
  { name: "Ana Carolina", text: "Depois desse app, nunca mais fiquei perdida na alimentação do meu filho. Recomendo demais!", rating: 5 },
  { name: "Mariana S.", text: "Com dois bebês, eu não tinha tempo de pesquisar. O Nutroo me salvou com cardápios prontos e receitas fáceis.", rating: 5 },
];

export default function Landing() {
  const navigate = useNavigate();

  const ctaClick = () => navigate("/quiz");
  const loginClick = () => navigate("/auth");

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "hsl(var(--app-cream))" }}>

      {/* ═══ NAV ═══ */}
      <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "hsla(34,33%,95%,0.85)", borderBottom: "1px solid hsl(var(--app-divider))" }}>
        <div className="flex items-center justify-between px-5 sm:px-8 py-3 max-w-7xl mx-auto">
          <img src={logoImg} alt="Nutroo" className="h-24 lg:h-28 w-auto" />
          <div className="flex items-center gap-3">
            <button
              onClick={loginClick}
              className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:shadow-md active:scale-[0.97]"
              style={{ color: "hsl(var(--app-petrol))", background: "hsl(var(--app-card))", border: "1.5px solid hsl(var(--app-divider))" }}
            >
              Entrar
            </button>
            <button
              onClick={ctaClick}
              className="hidden sm:inline-flex text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.97]"
              style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))" }}
            >
              Testar grátis
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ 1. HERO ═══ */}
      <section className="px-5 sm:px-8 pt-12 pb-16 lg:pt-20 lg:pb-28 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 xl:gap-24">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none">
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 animate-fade-in"
              style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))" }}
            >
              <ShieldCheck size={13} /> Guia completo de introdução alimentar
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-[2.75rem] xl:text-5xl font-extrabold leading-[1.12] mb-6 animate-fade-in"
              style={{ color: "hsl(var(--app-petrol))", animationDelay: "100ms" }}
            >
              Descubra exatamente o que seu bebê pode comer em cada fase
              <span style={{ color: "hsl(var(--app-gold-dark))" }}> — sem medo e com segurança</span>
            </h1>

            <p
              className="text-sm sm:text-base lg:text-lg leading-relaxed lg:leading-[1.75] mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-in"
              style={{ color: "hsl(var(--app-petrol-light))", animationDelay: "200ms" }}
            >
              Cardápios prontos, receitas seguras e orientação completa para a introdução alimentar do seu bebê
            </p>

            {/* Bullets */}
            <div className="flex flex-col gap-2.5 mb-8 max-w-md mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
              {[
                "Saiba o que pode e o que NÃO pode em cada idade",
                "Evite riscos de engasgo e alergias",
                "Tenha cardápios prontos todos os dias",
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 text-left">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "hsl(var(--app-gold))" }}>
                    <Check size={11} strokeWidth={3} style={{ color: "hsl(var(--app-petrol))" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "hsl(var(--app-petrol))" }}>{b}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
              <button
                onClick={ctaClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base transition-all hover:brightness-105 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
                style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: "0 8px 32px hsla(43,88%,65%,0.45)" }}
              >
                Começar grátis por 7 dias <ArrowRight size={16} className="inline ml-1" />
              </button>
            </div>
            <p className="text-xs mt-3 text-center lg:text-left animate-fade-in" style={{ color: "hsl(var(--app-petrol-light))", animationDelay: "400ms" }}>
              Sem compromisso · Cancele quando quiser
            </p>
          </div>

          {/* Right: mockup */}
          <div className="flex-1 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="relative">
              <div
                className="absolute -inset-12 lg:-inset-20 rounded-full blur-3xl opacity-35"
                style={{ background: "hsl(var(--app-gold-light))" }}
              />
              <img
                src={appMockup}
                alt="Tela do app Nutroo mostrando cardápio semanal"
                className="relative w-64 sm:w-72 lg:w-80 xl:w-[380px] drop-shadow-2xl"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <Reveal>
        <div className="py-5 lg:py-6" style={{ background: "hsl(var(--app-card))", borderTop: "1px solid hsl(var(--app-divider))", borderBottom: "1px solid hsl(var(--app-divider))" }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 max-w-7xl mx-auto px-5">
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
              <p className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>
                +2.347 famílias
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="hsl(var(--app-gold))" style={{ color: "hsl(var(--app-gold))" }} />
              ))}
              <span className="text-sm font-bold ml-1" style={{ color: "hsl(var(--app-petrol))" }}>4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--app-petrol))" }}>
                7 dias grátis
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ═══ 2. BLOCO DE DOR ═══ */}
      <section className="px-5 sm:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: "hsl(0 84% 60% / 0.1)" }}>
              <AlertTriangle size={24} style={{ color: "hsl(0,84%,60%)" }} />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-4" style={{ color: "hsl(var(--app-petrol))" }}>
              Você também tem medo de errar na alimentação do seu bebê?
            </h2>
            <p className="text-sm lg:text-base mb-10" style={{ color: "hsl(var(--app-petrol-light))" }}>
              Essas dúvidas são mais comuns do que você imagina
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            { icon: HelpCircle, text: '"Será que ele já pode comer isso?"' },
            { icon: AlertTriangle, text: '"E se eu der algo que faz mal?"' },
            { icon: ShieldCheck, text: '"Tenho medo de engasgo ou alergia"' },
            { icon: Utensils, text: '"Não sei montar refeições equilibradas"' },
          ].map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:shadow-md"
                style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 12px hsla(210,29%,29%,0.07)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(0 84% 60% / 0.08)" }}>
                  <p.icon size={20} style={{ color: "hsl(0,84%,55%)" }} />
                </div>
                <p className="text-sm font-semibold italic" style={{ color: "hsl(var(--app-petrol))" }}>{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div className="flex items-center gap-3 max-w-lg mx-auto mt-10 p-5 rounded-2xl" style={{ background: "hsl(var(--app-gold-light))" }}>
            <Heart size={22} style={{ color: "hsl(var(--app-gold-dark))" }} />
            <p className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>
              Você não está sozinha — e nós vamos te ajudar.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ═══ 3. DEMONSTRAÇÃO DO APP ═══ */}
      <section className="py-16 lg:py-24" style={{ background: "hsl(var(--app-card))" }}>
        <div className="px-5 sm:px-8 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))" }}>
                <Smartphone size={13} /> Veja na prática
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-3" style={{ color: "hsl(var(--app-petrol))" }}>
                Veja como o Nutroo funciona na prática
              </h2>
              <p className="text-sm lg:text-base max-w-lg mx-auto" style={{ color: "hsl(var(--app-petrol-light))" }}>
                Interface simples e intuitiva — feita para mães ocupadas que precisam de praticidade
              </p>
            </div>
          </Reveal>

          <div className="flex overflow-x-auto lg:overflow-visible lg:grid lg:grid-cols-4 gap-6 lg:gap-8 pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide">
            {[
              { component: <ScreenCardapio />, label: "Cardápio do Dia" },
              { component: <ScreenAlimentos />, label: "Controle de Alimentos" },
              { component: <ScreenReceitas />, label: "Receitas Seguras" },
              { component: <ScreenChecklist />, label: "Checklist Diário" },
            ].map((screen, i) => (
              <Reveal key={i} delay={i * 120} className="snap-center shrink-0 lg:shrink">
                <PhoneMockup label={screen.label}>
                  {screen.component}
                </PhoneMockup>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. SOLUÇÃO ═══ */}
      <section className="px-5 sm:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-3" style={{ color: "hsl(var(--app-petrol))" }}>
              O Nutroo guia você em cada etapa da alimentação
            </h2>
            <p className="text-sm lg:text-base max-w-lg mx-auto" style={{ color: "hsl(var(--app-petrol-light))" }}>
              Tudo o que você precisa, em um único app
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="p-6 lg:p-7 rounded-2xl flex flex-col gap-3 transition-all hover:shadow-lg hover:-translate-y-1 h-full"
                style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 16px hsla(210,29%,29%,0.07)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--app-gold-light))" }}>
                  <s.icon size={22} style={{ color: "hsl(var(--app-gold-dark))" }} />
                </div>
                <p className="text-base font-bold" style={{ color: "hsl(var(--app-petrol))" }}>{s.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--app-petrol-light))" }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ EMOTIONAL IMAGE ═══ */}
      <section className="px-5 sm:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
        <Reveal>
          <div className="rounded-3xl overflow-hidden" style={{ background: "hsl(var(--app-card))", boxShadow: "0 4px 32px hsla(210,29%,29%,0.1)" }}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img src={heroMomBaby} alt="Mãe alimentando bebê com carinho" className="w-full h-56 md:h-full object-cover" loading="lazy" />
              </div>
              <div className="md:w-1/2 p-6 md:p-10 lg:p-16 flex flex-col justify-center">
                <Heart size={28} className="mb-4" style={{ color: "hsl(var(--app-gold-dark))" }} />
                <h2 className="text-lg lg:text-2xl font-extrabold mb-4 leading-snug" style={{ color: "hsl(var(--app-petrol))" }}>
                  Sabemos que a introdução alimentar pode gerar insegurança…
                </h2>
                <p className="text-sm lg:text-base lg:leading-[1.8] mb-6" style={{ color: "hsl(var(--app-petrol-light))" }}>
                  É normal se sentir perdida. Cada bebê é único e os primeiros meses de alimentação trazem muitas dúvidas.
                  O Nutroo foi criado por quem entende essa jornada — para que você se sinta segura em cada refeição.
                </p>
                <button
                  onClick={ctaClick}
                  className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
                  style={{ color: "hsl(var(--app-gold-dark))" }}
                >
                  Comece sua jornada <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 5. PROVA SOCIAL ═══ */}
      <section className="px-5 sm:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-3" style={{ color: "hsl(var(--app-petrol))" }}>
              Mais de 1.000 mães já usam o Nutroo
            </h2>
            <p className="text-sm lg:text-base" style={{ color: "hsl(var(--app-petrol-light))" }}>
              Veja o que elas dizem
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className="p-6 lg:p-7 rounded-2xl flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ background: "hsl(var(--app-card))", boxShadow: "0 2px 16px hsla(210,29%,29%,0.07)" }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="hsl(var(--app-gold))" style={{ color: "hsl(var(--app-gold))" }} />
                  ))}
                </div>
                <p className="text-sm lg:text-base leading-relaxed mb-5 flex-1" style={{ color: "hsl(var(--app-petrol))" }}>
                  "{t.text}"
                </p>
                <p className="text-sm font-bold" style={{ color: "hsl(var(--app-petrol))" }}>
                  — {t.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ 6. QUEBRA DE OBJEÇÃO ═══ */}
      <section className="py-16 lg:py-24" style={{ background: "hsl(var(--app-card))" }}>
        <div className="px-5 sm:px-8 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-10 lg:mb-14">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: "hsl(var(--app-gold-light))" }}>
                <Lock size={24} style={{ color: "hsl(var(--app-gold-dark))" }} />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-3" style={{ color: "hsl(var(--app-petrol))" }}>
                Por que você pode confiar no Nutroo?
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 max-w-4xl mx-auto">
            {TRUST_POINTS.map((tp, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="text-center p-6 lg:p-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(var(--app-gold-light))" }}>
                    <tp.icon size={24} style={{ color: "hsl(var(--app-gold-dark))" }} />
                  </div>
                  <p className="text-base font-bold mb-2" style={{ color: "hsl(var(--app-petrol))" }}>{tp.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--app-petrol-light))" }}>{tp.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. CTA FINAL ═══ */}
      <section className="px-5 sm:px-8 py-16 lg:py-24 max-w-5xl mx-auto">
        <Reveal>
          <div
            className="p-8 sm:p-10 lg:p-16 rounded-3xl text-center relative overflow-hidden"
            style={{ background: "hsl(var(--app-gold))", boxShadow: "0 8px 40px hsla(43,88%,65%,0.35)" }}
          >
            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ background: "hsl(var(--app-gold-dark))" }} />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-3xl opacity-20" style={{ background: "hsl(var(--app-gold-light))" }} />

            <div className="relative z-10">
              <Sparkles size={32} className="mx-auto mb-4" style={{ color: "hsl(var(--app-petrol))" }} />
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-extrabold mb-3" style={{ color: "hsl(var(--app-petrol))" }}>
                Comece agora gratuitamente
              </h2>
              <p className="text-sm lg:text-base mb-8 max-w-md mx-auto" style={{ color: "hsl(var(--app-petrol))", opacity: 0.7 }}>
                Leva menos de 2 minutos para começar. Sem cartão de crédito.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center">
                <button
                  onClick={ctaClick}
                  className="flex-1 py-4 px-8 rounded-2xl font-bold text-base transition-all hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
                  style={{ background: "hsl(var(--app-petrol))", color: "hsl(var(--app-cream))", boxShadow: "0 8px 24px hsla(210,29%,29%,0.25)" }}
                >
                  Testar grátis por 7 dias <ArrowRight size={16} className="inline ml-1" />
                </button>
                <button
                  onClick={loginClick}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:shadow-md active:scale-[0.97]"
                  style={{ background: "hsl(var(--app-card))", color: "hsl(var(--app-petrol))", border: "1.5px solid hsl(var(--app-divider))" }}
                >
                  Já tenho conta · Entrar
                </button>
              </div>

              <p className="text-xs mt-4 font-medium" style={{ color: "hsl(var(--app-petrol))", opacity: 0.5 }}>
                Sem compromisso · Cancele quando quiser
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 text-center" style={{ borderTop: "1px solid hsl(var(--app-divider))" }}>
        <p className="text-xs" style={{ color: "hsl(var(--app-petrol-light))" }}>
          © {new Date().getFullYear()} Nutroo. Todos os direitos reservados.
        </p>
      </footer>

      {/* scroll-reveal animation */}
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(20px);
          filter: blur(4px);
          transition: opacity 650ms cubic-bezier(0.16,1,0.3,1),
                      transform 650ms cubic-bezier(0.16,1,0.3,1),
                      filter 650ms cubic-bezier(0.16,1,0.3,1);
        }
        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
