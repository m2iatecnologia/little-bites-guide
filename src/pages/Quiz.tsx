import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizQuestion {
  question: string;
  options: string[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: "Você é mamãe ou papai?",
    options: ["Mamãe", "Papai", "Outro cuidador"],
  },
  {
    question: "De qual região do Brasil você é?",
    options: ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"],
  },
  {
    question: "Qual a idade do seu bebê?",
    options: ["6 meses", "7–8 meses", "9–12 meses", "Mais de 1 ano"],
  },
  {
    question: "Você já iniciou a introdução alimentar?",
    options: ["Sim", "Não", "Estou começando agora"],
  },
  {
    question: "Qual seu maior desafio hoje?",
    options: ["Não sei o que preparar", "Falta de tempo", "Medo de errar", "Falta de ideias"],
  },
  {
    question: "Seu bebê possui alguma restrição alimentar?",
    options: ["Não", "Sim"],
  },
  {
    question: "Qual tipo de alimentação você segue?",
    options: ["Sem restrições", "Vegetariana", "Vegana"],
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTIONS.length).fill(null));

  const current = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;
  const selected = answers[step];

  const handleSelect = (option: string) => {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Save answers to sessionStorage so CadastroBebe can pre-fill
      const dietMap: Record<string, string> = {
        "Sem restrições": "no_restrictions",
        "Vegetariana": "vegetarian",
        "Vegana": "vegan",
      };
      const quizData = {
        role: answers[0],
        region: answers[1],
        babyAge: answers[2],
        startedIA: answers[3],
        challenge: answers[4],
        hasRestriction: answers[5],
        dietType: dietMap[answers[6] || ""] || "no_restrictions",
      };
      sessionStorage.setItem("quiz_answers", JSON.stringify(quizData));
      navigate("/auth?mode=signup");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate("/landing");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--app-cream))" }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-xl active:scale-95 transition-transform" style={{ color: "hsl(var(--app-petrol))" }}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <Progress value={progress} className="h-2 rounded-full" style={{ background: "hsl(var(--app-cream-dark))" }} />
        </div>
        <span className="text-xs font-semibold tabular-nums" style={{ color: "hsl(var(--app-petrol-light))" }}>
          {step + 1}/{QUESTIONS.length}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-5 max-w-lg mx-auto w-full">
        <h2 className="text-xl font-extrabold mb-8 text-center" style={{ color: "hsl(var(--app-petrol))", textWrap: "balance" }}>
          {current.question}
        </h2>

        <div className="space-y-3">
          {current.options.map((option) => {
            const isSelected = selected === option;
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className="w-full py-4 px-5 rounded-2xl text-left font-semibold text-sm active:scale-[0.97] transition-all"
                style={{
                  background: isSelected ? "hsl(var(--app-gold))" : "hsl(var(--app-card))",
                  border: isSelected ? "2px solid hsl(var(--app-gold-dark))" : "1.5px solid hsl(var(--app-divider))",
                  color: "hsl(var(--app-petrol))",
                  boxShadow: isSelected ? "0 4px 16px hsla(43,88%,65%,0.3)" : "0 2px 8px hsla(210,29%,29%,0.06)",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 pt-4 max-w-lg mx-auto w-full">
        <button
          onClick={handleNext}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-bold text-base active:scale-[0.97] transition-transform disabled:opacity-40"
          style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))", boxShadow: selected ? "0 6px 24px hsla(43,88%,65%,0.4)" : "none" }}
        >
          {step < QUESTIONS.length - 1 ? (
            <>Próxima <ArrowRight size={16} className="inline ml-1" /></>
          ) : (
            "Criar minha conta"
          )}
        </button>
      </div>
    </div>
  );
}
