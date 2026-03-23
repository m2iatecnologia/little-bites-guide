import { useEffect, useState } from "react";
import { ArrowLeft, Edit, CreditCard, Baby, History, Download, LogOut, Lock, Eye, EyeOff, Check, X } from "lucide-react";
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
  const [babyForm, setBabyForm] = useState({ name: "", birth_date: "", weight_kg: "", height_cm: "", gender: "not_informed", restrictions: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      if (b) setBabyForm({ name: b.name, birth_date: b.birth_date || "", weight_kg: b.weight_kg?.toString() || "", height_cm: b.height_cm?.toString() || "", gender: b.gender || "not_informed", restrictions: b.restrictions || "" });
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
      height_cm: babyForm.height_cm ? parseFloat(babyForm.height_cm) : null,
      gender: babyForm.gender,
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

  const pwRules = {
    minLength: pwForm.newPw.length >= 8,
    uppercase: /[A-Z]/.test(pwForm.newPw),
    number: /[0-9]/.test(pwForm.newPw),
    special: /[^A-Za-z0-9]/.test(pwForm.newPw),
    match: pwForm.newPw.length > 0 && pwForm.newPw === pwForm.confirm,
  };
  const allPwValid = pwRules.minLength && pwRules.uppercase && pwRules.number && pwRules.special && pwRules.match;

  const handleChangePassword = async () => {
    if (!user || !allPwValid) return;
    setPwLoading(true);
    // Validate current password by trying to sign in
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: pwForm.current,
    });
    if (signInErr) {
      toast.error("A senha atual está incorreta");
      setPwLoading(false);
      return;
    }
    // Update password
    const { error: updateErr } = await supabase.auth.updateUser({ password: pwForm.newPw });
    if (updateErr) {
      toast.error("Erro ao alterar senha: " + updateErr.message);
    } else {
      toast.success("Sua senha foi alterada com sucesso.");
      setShowPasswordModal(false);
      setPwForm({ current: "", newPw: "", confirm: "" });
    }
    setPwLoading(false);
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
          <button onClick={() => setShowPasswordModal(true)}
            className="w-full mt-3 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: "hsl(var(--app-cream-dark))", color: "hsl(var(--app-petrol))" }}>
            <Lock size={15} /> Alterar senha
          </button>
        </div>

        {/* Modal Alterar Senha */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: "hsl(var(--app-card))" }}>
              <h2 className="text-lg font-extrabold text-center" style={{ color: "hsl(var(--foreground))" }}>Alterar Senha</h2>

              {/* Senha atual */}
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Senha atual"
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  className="w-full py-3 px-4 pr-12 rounded-xl text-sm"
                  style={{ background: "hsl(var(--background))", border: "1.5px solid hsl(var(--app-divider))", color: "hsl(var(--foreground))" }}
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Nova senha */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Nova senha"
                  value={pwForm.newPw}
                  onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                  className="w-full py-3 px-4 pr-12 rounded-xl text-sm"
                  style={{ background: "hsl(var(--background))", border: "1.5px solid hsl(var(--app-divider))", color: "hsl(var(--foreground))" }}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Validação visual */}
              {pwForm.newPw.length > 0 && (
                <div className="space-y-1 text-xs">
                  {[
                    { ok: pwRules.minLength, label: "Mínimo 8 caracteres" },
                    { ok: pwRules.uppercase, label: "1 letra maiúscula" },
                    { ok: pwRules.number, label: "1 número" },
                    { ok: pwRules.special, label: "1 caractere especial" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-1.5">
                      {r.ok ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-red-400" />}
                      <span style={{ color: r.ok ? "hsl(var(--app-petrol))" : "hsl(var(--muted-foreground))" }}>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirmar nova senha */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirmar nova senha"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  className="w-full py-3 px-4 pr-12 rounded-xl text-sm"
                  style={{ background: "hsl(var(--background))", border: "1.5px solid hsl(var(--app-divider))", color: "hsl(var(--foreground))" }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {pwForm.confirm.length > 0 && !pwRules.match && (
                <p className="text-xs text-red-500">As senhas não coincidem</p>
              )}

              <div className="flex gap-2 pt-2">
                <button onClick={() => { setShowPasswordModal(false); setPwForm({ current: "", newPw: "", confirm: "" }); }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold"
                  style={{ border: "1.5px solid hsl(var(--app-divider))", color: "hsl(var(--app-petrol))" }}>
                  Cancelar
                </button>
                <button onClick={handleChangePassword} disabled={!allPwValid || !pwForm.current || pwLoading}
                  className="flex-1 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform disabled:opacity-50"
                  style={{ background: "hsl(var(--app-gold))", color: "hsl(var(--app-petrol))" }}>
                  {pwLoading ? "Salvando..." : "Salvar nova senha"}
                </button>
              </div>
            </div>
          </div>
        )}

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
                <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Altura</span><span className="font-semibold">{baby?.height_cm ? `${baby.height_cm} cm` : "—"}</span></div>
                <div className="flex justify-between"><span style={{ color: "hsl(var(--muted-foreground))" }}>Sexo</span><span className="font-semibold">{baby?.gender === "male" ? "Masculino" : baby?.gender === "female" ? "Feminino" : "Não informado"}</span></div>
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
              <input value={babyForm.height_cm} onChange={(e) => setBabyForm({ ...babyForm, height_cm: e.target.value })} placeholder="Altura (cm)" className="w-full py-3 px-4 rounded-xl text-sm" style={inputStyle} />
              <select value={babyForm.gender} onChange={(e) => setBabyForm({ ...babyForm, gender: e.target.value })} className="w-full py-3 px-4 rounded-xl text-sm" style={inputStyle}>
                <option value="not_informed">Prefiro não informar</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
              </select>
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
