import { ArrowLeft, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmDesenvolvimento() {
  const navigate = useNavigate();

  return (
    <div className="app-container bottom-nav-safe flex flex-col items-center justify-center min-h-screen px-6">
      <button onClick={() => navigate(-1)} className="absolute top-6 left-4 flex items-center gap-2"
        style={{ color: "hsl(var(--app-brown))" }}>
        <ArrowLeft size={20} />
        <span className="font-bold text-sm">Voltar</span>
      </button>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        style={{ background: "hsl(var(--app-yellow))" }}>
        <Construction size={36} style={{ color: "hsl(var(--app-brown))" }} />
      </div>
      <h1 className="text-xl font-extrabold mb-2 text-center" style={{ fontWeight: 900 }}>Em Desenvolvimento</h1>
      <p className="text-sm text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
        Esta funcionalidade estará disponível em breve! ✨
      </p>
    </div>
  );
}
