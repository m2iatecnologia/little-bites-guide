import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionStatus = "active" | "trial" | "expired" | "canceled" | "none";
export type SubscriptionPlan = "mensal" | "semestral" | "anual" | null;

interface SubscriptionState {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  endsAt: Date | null;
  loading: boolean;
}

export function hasPremiumAccess(status: SubscriptionStatus, endsAt: Date | null): boolean {
  if (status === "active" || status === "trial") return true;
  if (status === "canceled" && endsAt && new Date(endsAt) > new Date()) return true;
  return false;
}

export function useSubscription() {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    status: "none",
    plan: null,
    endsAt: null,
    loading: true,
  });

  const checkAndUpdateStatus = useCallback(async () => {
    if (!user) {
      setState({ status: "none", plan: null, endsAt: null, loading: false });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        setState({ status: "none", plan: null, endsAt: null, loading: false });
        return;
      }

      let currentStatus = data.status as SubscriptionStatus;
      const endsAt = data.ends_at ? new Date(data.ends_at) : null;
      const now = new Date();

      // Auto-expire if ends_at has passed and status is active/trial
      if (endsAt && endsAt < now && (currentStatus === "active" || currentStatus === "trial")) {
        currentStatus = "expired";
        await supabase
          .from("subscriptions")
          .update({ status: "expired" })
          .eq("id", data.id);
      }

      // Auto-expire canceled if past end date
      if (currentStatus === "canceled" && endsAt && endsAt < now) {
        currentStatus = "expired";
        await supabase
          .from("subscriptions")
          .update({ status: "expired" })
          .eq("id", data.id);
      }

      setState({
        status: currentStatus,
        plan: (data.plan as SubscriptionPlan) || null,
        endsAt,
        loading: false,
      });
    } catch (e) {
      console.error("useSubscription error:", e);
      setState({ status: "none", plan: null, endsAt: null, loading: false });
    }
  }, [user]);

  useEffect(() => {
    checkAndUpdateStatus();
  }, [checkAndUpdateStatus]);

  const isPremium = hasPremiumAccess(state.status, state.endsAt);

  return { ...state, isPremium, refresh: checkAndUpdateStatus };
}
