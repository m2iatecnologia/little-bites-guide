import { ArrowLeft, Edit, CreditCard, Baby, History, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();

  return (
    <div className="app-container bottom-nav-safe">
      <div className="px-4 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4"
          style={{ color: "hsl(var(--app-brown))" }}>
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Voltar</span>
        </button>

        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-3"
            style={{ background: "hsl(var(--app-yellow))" }}>
            👩
          </div>
          <h1 className="text-xl font-extrabold" style={{ fontWeight: 900, color: "hsl(var(--foreground))" }}>Maria Silva</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>maria@email.com</p>
        </div>

        {/* Dados do Responsável */}
        <div className="card-food p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm flex items-center gap-2" style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>
              <Edit size={16} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
              Dados do Responsável
            </h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Nome</span><span className="font-bold" style={{ fontWeight: 600 }}>Maria Silva</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Email</span><span className="font-bold" style={{ fontWeight: 600 }}>maria@email.com</span></div>
          </div>
          <button className="w-full mt-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: "hsl(var(--app-warm-muted))", color: "hsl(var(--app-brown))", fontWeight: 700 }}>
            Editar perfil
          </button>
        </div>

        {/* Plano */}
        <div className="card-food p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
            <h2 className="font-bold text-sm" style={{ fontWeight: 700 }}>Plano Assinado</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Plano</span><span className="font-bold" style={{ fontWeight: 600, color: "hsl(var(--app-yellow-highlight))" }}>Anual ⭐</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Início</span><span className="font-bold" style={{ fontWeight: 600 }}>15/01/2025</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Próxima cobrança</span><span className="font-bold" style={{ fontWeight: 600 }}>15/01/2026</span></div>
          </div>
          <button onClick={() => navigate("/cancelamento")}
            className="w-full mt-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: "hsl(var(--app-yellow))", color: "hsl(var(--app-brown))", fontWeight: 700 }}>
            Gerenciar Assinatura
          </button>
        </div>

        {/* Dados do Bebê */}
        <div className="card-food p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Baby size={16} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
            <h2 className="font-bold text-sm" style={{ fontWeight: 700 }}>Dados do Bebê</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Nome</span><span className="font-bold" style={{ fontWeight: 600 }}>Sofia</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Nascimento</span><span className="font-bold" style={{ fontWeight: 600 }}>12/05/2024</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Idade atual</span><span className="font-bold" style={{ fontWeight: 600 }}>9 meses</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Peso</span><span className="font-bold" style={{ fontWeight: 600 }}>8,2 kg</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Restrições</span><span className="font-bold" style={{ fontWeight: 600 }}>Nenhuma</span></div>
          </div>
          <button className="w-full mt-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: "hsl(var(--app-warm-muted))", color: "hsl(var(--app-brown))", fontWeight: 700 }}>
            Editar dados do bebê
          </button>
        </div>

        {/* Histórico */}
        <div className="card-food p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <History size={16} style={{ color: "hsl(var(--app-yellow-highlight))" }} />
            <h2 className="font-bold text-sm" style={{ fontWeight: 700 }}>Histórico</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Alimentos introduzidos</span><span className="font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-yellow-highlight))" }}>42</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Refeições registradas</span><span className="font-bold" style={{ fontWeight: 700, color: "hsl(var(--app-yellow-highlight))" }}>87</span></div>
          </div>
          <button className="w-full mt-3 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: "hsl(var(--app-yellow))", color: "hsl(var(--app-brown))", fontWeight: 700 }}>
            <Download size={15} />
            Exportar histórico completo
          </button>
        </div>
      </div>
    </div>
  );
}
