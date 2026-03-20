import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ChevronLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SUPPORT_EMAIL = "suporte@seuemail.com"; // placeholder

interface ChatMessage {
  from: "bot" | "user";
  text: string;
  options?: QuickOption[];
  link?: { label: string; to: string };
}

interface QuickOption {
  label: string;
  action: string;
}

const INITIAL_OPTIONS: QuickOption[] = [
  { label: "🍽️ Como montar meu cardápio?", action: "cardapio" },
  { label: "🥑 Como preparar um alimento?", action: "preparar" },
  { label: "🔪 Como cortar os alimentos?", action: "cortar" },
  { label: "📖 Onde vejo as receitas?", action: "receitas" },
  { label: "✅ Como funciona o checklist?", action: "checklist" },
  { label: "⭐ Dúvidas sobre assinatura", action: "assinatura" },
  { label: "📩 Falar com o suporte", action: "suporte" },
];

function getResponse(action: string): ChatMessage {
  switch (action) {
    case "cardapio":
      return {
        from: "bot",
        text: "Na tela de Cardápio, você pode montar o plano semanal do bebê automaticamente com base na despensa e na idade. Quer ir para lá agora?",
        link: { label: "Ir para Cardápio", to: "/cardapio" },
      };
    case "preparar":
      return {
        from: "bot",
        text: "Na tela Alimentos você encontra orientações de preparo, textura ideal e dicas para cada alimento. Posso te levar para lá!",
        link: { label: "Abrir Alimentos", to: "/alimentos" },
      };
    case "cortar":
      return {
        from: "bot",
        text: "Cada alimento tem um guia de corte específico com dois estágios: Início (pedaços maiores) e Pinça (pedaços menores). Acesse a tela Alimentos para ver os guias visuais.",
        link: { label: "Ver guias de corte", to: "/alimentos" },
      };
    case "receitas":
      return {
        from: "bot",
        text: "Você pode explorar receitas na tela Receitas! Lá tem filtros por idade, categoria e ingredientes. Vamos lá?",
        link: { label: "Abrir Receitas", to: "/receitas" },
      };
    case "checklist":
      return {
        from: "bot",
        text: "O Checklist ajuda a acompanhar o dia a dia do bebê — refeições, sono e marcos importantes. Quer conferir?",
        link: { label: "Abrir Checklist", to: "/checklist" },
      };
    case "assinatura":
      return {
        from: "bot",
        text: "Com o plano premium você desbloqueia todas as receitas, cardápios personalizados e muito mais! Quer ver os planos disponíveis?",
        link: { label: "Ver planos", to: "/planos" },
      };
    case "suporte":
      return {
        from: "bot",
        text: `Não conseguiu resolver sua dúvida? Entre em contato com nosso suporte pelo e-mail:\n\n📧 ${SUPPORT_EMAIL}`,
      };
    default:
      return {
        from: "bot",
        text: "Desculpe, não entendi. Posso te ajudar com as opções abaixo:",
        options: INITIAL_OPTIONS,
      };
  }
}

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showInitial, setShowInitial] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          from: "bot",
          text: "Oi! Sou seu assistente do app 😊\nPosso te ajudar com dúvidas rápidas sobre alimentos, receitas, cardápio e uso do aplicativo.",
        },
      ]);
      setShowInitial(true);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOption = (opt: QuickOption) => {
    const userMsg: ChatMessage = { from: "user", text: opt.label };
    const botMsg = getResponse(opt.action);
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setShowInitial(false);
  };

  const handleReset = () => {
    setMessages([
      {
        from: "bot",
        text: "Oi! Sou seu assistente do app 😊\nPosso te ajudar com dúvidas rápidas sobre alimentos, receitas, cardápio e uso do aplicativo.",
      },
    ]);
    setShowInitial(true);
  };

  const handleNavigate = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed z-[60] right-4 shadow-lg flex items-center justify-center rounded-full transition-all duration-200 active:scale-95"
        style={{
          bottom: 80,
          width: 52,
          height: 52,
          background: "hsl(var(--app-petrol))",
          color: "hsl(var(--app-gold))",
        }}
        aria-label={open ? "Fechar chat" : "Abrir assistente"}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed z-[60] right-4 flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300"
          style={{
            bottom: 140,
            width: "calc(100vw - 32px)",
            maxWidth: 360,
            height: 460,
            maxHeight: "calc(100vh - 200px)",
            background: "hsl(var(--app-cream))",
            border: "1px solid hsl(var(--app-divider))",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: "hsl(var(--app-petrol))" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))" }}
            >
              🤖
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--app-cream))" }}>
                Assistente
              </p>
              <p className="text-[10px] opacity-70" style={{ color: "hsl(var(--app-cream))" }}>
                Online agora
              </p>
            </div>
            {!showInitial && (
              <button
                onClick={handleReset}
                className="p-1.5 rounded-full transition-colors hover:bg-white/10"
                style={{ color: "hsl(var(--app-cream))" }}
                aria-label="Voltar ao início"
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line"
                  style={
                    msg.from === "user"
                      ? {
                          background: "hsl(var(--app-petrol))",
                          color: "hsl(var(--app-cream))",
                          borderBottomRightRadius: 6,
                        }
                      : {
                          background: "hsl(var(--card))",
                          color: "hsl(var(--app-petrol))",
                          borderBottomLeftRadius: 6,
                          boxShadow: "0 1px 3px hsl(var(--app-petrol) / .06)",
                        }
                  }
                >
                  {msg.text}
                  {msg.link && (
                    <button
                      onClick={() => handleNavigate(msg.link!.to)}
                      className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold rounded-lg px-3 py-1.5 transition-all active:scale-95"
                      style={{
                        background: "hsl(var(--app-gold))",
                        color: "hsl(var(--app-petrol))",
                      }}
                    >
                      <ExternalLink size={13} />
                      {msg.link.label}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Quick options */}
            {showInitial && (
              <div className="flex flex-col gap-1.5 pt-1">
                {INITIAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.action}
                    onClick={() => handleOption(opt)}
                    className="text-left text-[13px] rounded-xl px-3.5 py-2.5 transition-all active:scale-[0.97]"
                    style={{
                      background: "hsl(var(--card))",
                      color: "hsl(var(--app-petrol))",
                      border: "1px solid hsl(var(--app-divider))",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </>
  );
}
