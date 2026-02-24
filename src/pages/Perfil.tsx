import { useEffect, useState } from "react";
import { ArrowLeft, Edit, CreditCard, Baby, History, Download, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Perfil() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [baby, setBaby] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);
  const [foodCount, setFoodCount] = useState(0);
  const [mealCount, setMealCount] = useState(0);
  const [editingBaby, setEditingBaby] = useState(false);
  const [babyForm, setBabyForm] = useState({ name: "", birth_date: "", weight_kg: "", restrictions: "" });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: p }, { data: b }, { data: s }, { count: fc }, { count: mc }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("babies").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("food_logs").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("food_logs").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setProfile(p);
      setBaby(b);
      setSub(s);
      setFoodCount(fc || 0);
      setMealCount(mc || 0);
      if (b) setBabyForm({ name: b.name, birth_date: b.birth_date || "", weight_kg: b.weight_kg?.toString() || "", restrictions: b.restrictions || "" });
    };
    load();
  }, [user]);

  const saveBaby = async () => {
    if (!user) return;
    const payload = {
      user_id: user.id,
      name: babyForm.name,
      birth_date: babyForm.birth_date || null,
      weight_kg: babyForm.weight_kg ? parseFloat(babyForm.weight_kg) : null,
      restrictions: babyForm.restrictions,
    };
    if (baby) {
      await supabase.from("babies").update(payload).eq("id", baby.id);
    } else {
      await supabase.from("babies").insert(payload);
    }
    toast.success("Dados do bebê salvos!");
    setEditingBaby(false);
    const { data } = await supabase.from("babies").select("*").eq("user_id", user.id).maybeSingle();
    setBaby(data);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const babyAge = baby?.birth_date
    ? (() => {
        const diff = Date.now() - new Date(baby.birth_date).getTime();
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
        return `${months} meses`;
      })()
    : "—";

  const inputStyle = {
    background: "hsl(var(--app-card))",
    border: "1.5px solid hsl(var(--app-divider))",
    color: "hsl(var(--app-petrol))",
  };

  return (
    <div className="app-container bottom-nav-safe">
      <div className="px-4 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4"
          style={{ color: "hsl(var(--app-petrol))" }}>
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Voltar</span>
        </button>

        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-3"
            style={{ background: "hsl(var(--app-gold-light))" }}>
            👩
          </div>
          <h1 className="text-xl font-extrabold" style={{ color: "hsl(var(--foreground))" }}>
            {profile?.name || user?.email?.split("@")[0] || "Usuário"}
          </h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{user?.email}</p>
        </div>

        {/* Dados do Responsável */}
        <div className="card-food p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Edit size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
            <h2 className="font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>Dados do Responsável</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Nome</span><span className="font-semibold">{profile?.name || "—"}</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Email</span><span className="font-semibold">{user?.email || "—"}</span></div>
          </div>
        </div>

        {/* Plano */}
        <div className="card-food p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
            <h2 className="font-bold text-sm">Plano Assinado</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "hsl(var(--muted-foreground))" }}>Plano</span>
              <span className="font-semibold" style={{ color: "hsl(var(--app-gold-dark))" }}>
                {sub ? sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1) : "Nenhum"} {sub?.plan === "anual" && "⭐"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "hsl(var(--muted-foreground))" }}>Status</span>
              <span className="font-semibold">{sub?.status === "active" ? "Ativo ✅" : sub?.status || "—"}</span>
            </div>
          </div>
          <button onClick={() => navigate("/cancelamento")}
            className="w-full mt-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))" }}>
            Gerenciar Assinatura
          </button>
        </div>

        {/* Dados do Bebê */}
        <div className="card-food p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Baby size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
            <h2 className="font-bold text-sm">Dados do Bebê</h2>
          </div>
          {!editingBaby ? (
            <>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Nome</span><span className="font-semibold">{baby?.name || "—"}</span></div>
                <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Nascimento</span><span className="font-semibold">{baby?.birth_date ? new Date(baby.birth_date).toLocaleDateString("pt-BR") : "—"}</span></div>
                <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Idade</span><span className="font-semibold">{babyAge}</span></div>
                <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Peso</span><span className="font-semibold">{baby?.weight_kg ? `${baby.weight_kg} kg` : "—"}</span></div>
                <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Restrições</span><span className="font-semibold">{baby?.restrictions || "Nenhuma"}</span></div>
              </div>
              <button onClick={() => setEditingBaby(true)}
                className="w-full mt-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: "hsl(var(--app-cream-dark))", color: "hsl(var(--app-petrol))" }}>
                Editar dados do bebê
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <input value={babyForm.name} onChange={(e) => setBabyForm({ ...babyForm, name: e.target.value })} placeholder="Nome do bebê" className="w-full py-3 px-4 rounded-xl text-sm" style={inputStyle} />
              <input type="date" value={babyForm.birth_date} onChange={(e) => setBabyForm({ ...babyForm, birth_date: e.target.value })} className="w-full py-3 px-4 rounded-xl text-sm" style={inputStyle} />
              <input value={babyForm.weight_kg} onChange={(e) => setBabyForm({ ...babyForm, weight_kg: e.target.value })} placeholder="Peso (kg)" className="w-full py-3 px-4 rounded-xl text-sm" style={inputStyle} />
              <input value={babyForm.restrictions} onChange={(e) => setBabyForm({ ...babyForm, restrictions: e.target.value })} placeholder="Restrições alimentares" className="w-full py-3 px-4 rounded-xl text-sm" style={inputStyle} />
              <div className="flex gap-2">
                <button onClick={() => setEditingBaby(false)} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ border: "1.5px solid hsl(var(--app-divider))", color: "hsl(var(--app-petrol))" }}>Cancelar</button>
                <button onClick={saveBaby} className="flex-1 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform" style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))" }}>Salvar</button>
              </div>
            </div>
          )}
        </div>

        {/* Histórico */}
        <div className="card-food p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <History size={16} style={{ color: "hsl(var(--app-gold-dark))" }} />
            <h2 className="font-bold text-sm">Histórico</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Alimentos introduzidos</span><span className="font-bold" style={{ color: "hsl(var(--app-gold-dark))" }}>{foodCount}</span></div>
            <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Refeições registradas</span><span className="font-bold" style={{ color: "hsl(var(--app-gold-dark))" }}>{mealCount}</span></div>
          </div>
          <button onClick={() => navigate("/em-desenvolvimento")}
            className="w-full mt-3 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))" }}>
            <Download size={15} /> Exportar histórico completo
          </button>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform mt-2"
          style={{ background: "hsl(var(--destructive))", color: "white" }}>
          <LogOut size={16} /> Sair da conta
        </button>
      </div>
    </div>
  );
}
