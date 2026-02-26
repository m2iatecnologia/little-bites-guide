import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { differenceInMonths, differenceInDays, startOfMonth, subWeeks, format } from "date-fns";
import type { ReportData } from "@/lib/generateReport";

interface Baby {
  id: string;
  name: string;
  birth_date: string | null;
  weight_kg: number | null;
  restrictions: string | null;
}

interface FoodLog {
  id: string;
  food_name: string;
  acceptance: string;
  reaction: string | null;
  offered_at: string;
  meal_type: string;
  notes: string | null;
}

interface FoodStat {
  food: string;
  rate: number;
  count?: number;
}

export interface DashboardData {
  loading: boolean;
  baby: Baby | null;
  babyAge: string;
  profileName: string;
  // Stats
  totalFoods: number;
  newFoodsThisMonth: number;
  totalMeals: number;
  acceptanceRate: number;
  rejectionRate: number;
  neutralRate: number;
  // Rankings
  bestAccepted: FoodStat[];
  mostRejected: FoodStat[];
  // Reactions
  reactions: { date: string; food: string; type: string }[];
  // Weekly evolution (unique foods per week, last 4 weeks)
  weeklyEvolution: { week: string; count: number }[];
  // Alerts
  alerts: { type: "reaction" | "rejection"; icon: string; text: string }[];
  reportData: ReportData;
}

function calcAge(birthDate: string | null): string {
  if (!birthDate) return "";
  const birth = new Date(birthDate);
  const now = new Date();
  const months = differenceInMonths(now, birth);
  if (months < 1) {
    const days = differenceInDays(now, birth);
    return `${days} dias`;
  }
  if (months < 24) return `${months} ${months === 1 ? "mês" : "meses"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "ano" : "anos"}`;
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const [baby, setBaby] = useState<Baby | null>(null);
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      const [babyRes, logsRes, profileRes] = await Promise.all([
        supabase.from("babies").select("*").eq("user_id", user.id).limit(1).maybeSingle(),
        supabase.from("food_logs").select("*").eq("user_id", user.id).order("offered_at", { ascending: false }),
        supabase.from("profiles").select("name").eq("user_id", user.id).maybeSingle(),
      ]);

      setBaby(babyRes.data ?? null);
      setLogs(logsRes.data ?? []);
      setProfileName(profileRes.data?.name ?? user.user_metadata?.full_name ?? "");
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  return useMemo(() => {
    const uniqueFoods = new Set(logs.map((l) => l.food_name.toLowerCase()));
    const totalFoods = uniqueFoods.size;

    const monthStart = startOfMonth(new Date());
    const logsThisMonth = logs.filter((l) => new Date(l.offered_at) >= monthStart);
    const foodsBeforeMonth = new Set(
      logs.filter((l) => new Date(l.offered_at) < monthStart).map((l) => l.food_name.toLowerCase())
    );
    const newFoodsThisMonth = logsThisMonth.filter(
      (l) => !foodsBeforeMonth.has(l.food_name.toLowerCase())
    ).length
      ? new Set(
          logsThisMonth
            .filter((l) => !foodsBeforeMonth.has(l.food_name.toLowerCase()))
            .map((l) => l.food_name.toLowerCase())
        ).size
      : 0;

    const totalMeals = logs.length;

    const accepted = logs.filter((l) => l.acceptance === "aceito" || l.acceptance === "aceitou").length;
    const rejected = logs.filter((l) => l.acceptance === "recusou" || l.acceptance === "recusado").length;
    const neutral = logs.filter((l) => l.acceptance === "neutro").length;
    const total = Math.max(totalMeals, 1);
    const acceptanceRate = Math.round((accepted / total) * 100);
    const rejectionRate = Math.round((rejected / total) * 100);
    const neutralRate = Math.round((neutral / total) * 100);

    // Food rankings
    const foodCounts: Record<string, { accepted: number; total: number }> = {};
    logs.forEach((l) => {
      const key = l.food_name;
      if (!foodCounts[key]) foodCounts[key] = { accepted: 0, total: 0 };
      foodCounts[key].total++;
      if (l.acceptance === "aceito" || l.acceptance === "aceitou") foodCounts[key].accepted++;
    });

    const bestAccepted: FoodStat[] = Object.entries(foodCounts)
      .map(([food, c]) => ({ food, rate: Math.round((c.accepted / c.total) * 100), count: c.total }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);

    const mostRejected: FoodStat[] = Object.entries(foodCounts)
      .map(([food, c]) => ({ food, rate: Math.round(((c.total - c.accepted) / c.total) * 100), count: c.total }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);

    // Reactions
    const reactions = logs
      .filter((l) => l.reaction && l.reaction.trim() !== "")
      .map((l) => ({
        date: format(new Date(l.offered_at), "dd/MM/yyyy"),
        food: l.food_name,
        type: l.reaction!,
      }));

    // Weekly evolution - unique foods per week for last 4 weeks
    const now = new Date();
    const weeklyEvolution = [3, 2, 1, 0].map((weeksAgo) => {
      const weekStart = subWeeks(now, weeksAgo + 1);
      const weekEnd = subWeeks(now, weeksAgo);
      const weekLogs = logs.filter((l) => {
        const d = new Date(l.offered_at);
        return d >= weekStart && d < weekEnd;
      });
      return {
        week: `Sem ${4 - weeksAgo}`,
        count: new Set(weekLogs.map((l) => l.food_name.toLowerCase())).size,
      };
    });

    // Alerts
    const alerts: DashboardData["alerts"] = [];
    reactions.slice(0, 2).forEach((r) => {
      alerts.push({ type: "reaction", icon: "⚠️", text: `${r.food} — ${r.type} (${r.date})` });
    });
    mostRejected.slice(0, 2).forEach((r) => {
      if (r.rate >= 50) {
        alerts.push({
          type: "rejection",
          icon: "🔄",
          text: `${r.food} precisa de nova exposição (recusa ${r.rate}%)`,
        });
      }
    });

    const babyAge = calcAge(baby?.birth_date ?? null);

    // Food groups classification
    const groupMap: Record<string, string[]> = {
      "Frutas": ["banana", "maçã", "manga", "morango", "melancia", "abacate", "pera", "mamão", "laranja", "uva", "kiwi", "melão", "ameixa", "goiaba", "pêssego"],
      "Legumes": ["cenoura", "abobrinha", "abóbora", "batata", "batata doce", "inhame", "mandioca", "mandioquinha", "beterraba", "chuchu"],
      "Verduras": ["brócolis", "espinafre", "couve", "alface", "rúcula", "agrião", "acelga", "repolho"],
      "Proteínas": ["frango", "carne", "ovo", "peixe", "feijão", "lentilha", "grão de bico", "tofu", "fígado"],
      "Grãos": ["arroz", "aveia", "quinoa", "milho", "trigo", "macarrão", "pão"],
      "Oleaginosas": ["castanha", "amendoim", "nozes", "amêndoa", "gergelim", "linhaça", "chia"],
    };

    const foodGroups = Object.entries(groupMap).map(([group, keywords]) => {
      const matchedFoods = logs.filter((l) =>
        keywords.some((kw) => l.food_name.toLowerCase().includes(kw))
      );
      const uniqueMatched = new Set(matchedFoods.map((l) => l.food_name.toLowerCase()));
      return { group, count: uniqueMatched.size, frequency: matchedFoods.length };
    });

    // Meal observations (logs with notes)
    const mealObservations = logs
      .filter((l) => l.notes && l.notes.trim() !== "")
      .map((l) => ({
        date: format(new Date(l.offered_at), "dd/MM/yyyy"),
        meal: l.meal_type,
        food: l.food_name,
        status: l.acceptance,
        note: l.notes!,
      }));

    const reportData: import("@/lib/generateReport").ReportData = {
      childName: baby?.name ?? "",
      birthDate: baby?.birth_date ? format(new Date(baby.birth_date), "dd/MM/yyyy") : "",
      currentAge: babyAge,
      weight: baby?.weight_kg?.toString().replace(".", ",") ?? "",
      period: format(new Date(), "MMMM yyyy"),
      responsibleName: profileName,
      totalFoods,
      acceptanceRate,
      rejectionRate,
      neutralRate,
      newFoodsIntroduced: newFoodsThisMonth,
      reactionsCount: reactions.length,
      totalMeals,
      weeklyFrequency: Math.round(totalMeals / Math.max(weeklyEvolution.length, 1)),
      bestAccepted,
      mostRejected,
      reactions,
      weeklyIntroductions: weeklyEvolution.map((w) => w.count),
      foodGroups,
      mealObservations,
      parentNotes: "",
    };

    return {
      loading,
      baby,
      babyAge,
      profileName,
      totalFoods,
      newFoodsThisMonth,
      totalMeals,
      acceptanceRate,
      rejectionRate,
      neutralRate,
      bestAccepted,
      mostRejected,
      reactions,
      weeklyEvolution,
      alerts,
      reportData,
    };
  }, [logs, baby, loading, profileName]);
}
