import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Baby, CheckCircle2 } from "lucide-react";

const RESTRICTIONS_OPTIONS = [
  "APLV",
  "Intolerância à lactose",
  "Alergia a ovo",
  "Alergia a amendoim",
];

export default function CadastroBebe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("not_informed");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [otherRestriction, setOtherRestriction] = useState("");

  const ageInMonths = useMemo(() => {
    if (!birthDate) return null;
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  }, [birthDate]);

  const isDateValid = useMemo(() => {
    if (!birthDate) return true;
    return new Date(birthDate) <= new Date();
  }, [birthDate]);

  const canSubmit = name.trim() && birthDate && isDateValid && !saving;

  const toggleRestriction = (r: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const handleSave = async () => {
    if (!user || !canSubmit) return;
    setSaving(true);

    const restrictions = [
      ...selectedRestrictions,
      ...(otherRestriction.trim() ? [otherRestriction.trim()] : []),
    ].join(", ");

    const { error } = await supabase.from("babies").insert({
      user_id: user.id,
      name: name.trim(),
      birth_date: birthDate,
      gender,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      height_cm: heightCm ? parseFloat(heightCm) : null,
      restrictions: restrictions || null,
    });

    setSaving(false);

    if (error) {
      toast.error("Erro ao salvar. Tente novamente.");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--app-gold-light))" }}>
          <CheckCircle2 size={40} style={{ color: "hsl(var(--app-gold-dark))" }} />
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: "hsl(var(--app-petrol))" }}>
          Perfil do bebê criado com sucesso 💛
        </h1>
        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Tudo pronto! Vamos começar a jornada alimentar.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary-clinical mt-4 text-base py-4 px-8">
          Começar agora
        </button>
      </div>
    );
  }

  const inputStyle = "w-full py-3 px-4 rounded-xl text-sm bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="app-container min-h-screen px-5 pt-8 pb-10">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold" style={{ color: "hsl(var(--muted-foreground))" }}>Passo 1 de 1</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: "hsl(var(--app-cream-dark))" }}>
          <div className="h-2 rounded-full transition-all" style={{ width: "100%", background: "hsl(var(--app-gold))" }} />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--app-gold-light))" }}>
          <Baby size={24} style={{ color: "hsl(var(--app-gold-dark))" }} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "hsl(var(--app-petrol))" }}>
            Vamos conhecer seu bebê 💛
          </h1>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Preencha os dados para personalizar o app
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Nome */}
        <div>
          <label className="text-sm font-bold mb-1.5 block" style={{ color: "hsl(var(--app-petrol))" }}>
            Nome do bebê *
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Maria, João..." className={inputStyle} />
        </div>

        {/* Data de nascimento */}
        <div>
          <label className="text-sm font-bold mb-1.5 block" style={{ color: "hsl(var(--app-petrol))" }}>
            Data de nascimento *
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={inputStyle}
          />
          {birthDate && !isDateValid && (
            <p className="text-xs mt-1" style={{ color: "hsl(var(--destructive))" }}>Data não pode ser futura</p>
          )}
          {ageInMonths !== null && isDateValid && (
            <p className="text-xs mt-1.5 font-bold" style={{ color: "hsl(var(--app-gold-dark))" }}>
              Seu bebê tem {ageInMonths} {ageInMonths === 1 ? "mês" : "meses"} 🎉
            </p>
          )}
        </div>

        {/* Sexo */}
        <div>
          <label className="text-sm font-bold mb-2 block" style={{ color: "hsl(var(--app-petrol))" }}>Sexo</label>
          <div className="flex gap-2">
            {[
              { value: "male", label: "Masculino" },
              { value: "female", label: "Feminino" },
              { value: "not_informed", label: "Prefiro não informar" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGender(opt.value)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: gender === opt.value ? "hsl(var(--app-gold))" : "hsl(var(--app-card))",
                  color: "hsl(var(--app-petrol))",
                  border: `1.5px solid ${gender === opt.value ? "hsl(var(--app-gold-dark))" : "hsl(var(--app-divider))"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Peso */}
        <div>
          <label className="text-sm font-bold mb-1.5 block" style={{ color: "hsl(var(--app-petrol))" }}>Peso atual (kg)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="Ex: 8.5"
            className={inputStyle}
          />
        </div>

        {/* Altura */}
        <div>
          <label className="text-sm font-bold mb-1.5 block" style={{ color: "hsl(var(--app-petrol))" }}>Altura atual (cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="Ex: 68"
            className={inputStyle}
          />
        </div>

        {/* Restrições */}
        <div>
          <label className="text-sm font-bold mb-2 block" style={{ color: "hsl(var(--app-petrol))" }}>Restrições alimentares</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {RESTRICTIONS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => toggleRestriction(r)}
                className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: selectedRestrictions.includes(r) ? "hsl(var(--app-gold))" : "hsl(var(--app-card))",
                  color: "hsl(var(--app-petrol))",
                  border: `1.5px solid ${selectedRestrictions.includes(r) ? "hsl(var(--app-gold-dark))" : "hsl(var(--app-divider))"}`,
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <input
            value={otherRestriction}
            onChange={(e) => setOtherRestriction(e.target.value)}
            placeholder="Outra restrição..."
            className={inputStyle}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSave}
          disabled={!canSubmit}
          className="btn-primary-clinical w-full text-base py-4 mt-4"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "hsl(var(--app-petrol))", borderTopColor: "transparent" }} />
              Salvando...
            </div>
          ) : (
            "Salvar e continuar"
          )}
        </button>
      </div>
    </div>
  );
}
