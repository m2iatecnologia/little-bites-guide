import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionStatus = "active" | "trial" | "expired" | "canceled" | "none";
export type SubscriptionPlan = "mensal" | "semestral" | "anual" | null;

const PRODUCT_TO_PLAN: Record<string, SubscriptionPlan> = {
  "prod_UA51MKpyHjm7pV": "mensal",
  "prod_UA53qLN4dqKmMS": "semestral",
  "prod_UA53rF7VfL99Jt": "anual",
};

interface SubscriptionState {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  endsAt: Date | null;
  cancelAtPeriodEnd: boolean;
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
    cancelAtPeriodEnd: false,
    loading: true,
  });

  const checkAndUpdateStatus = useCallback(async () => {
    if (!user) {
      setState({ status: "none", plan: null, endsAt: null, loading: false });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");

      if (error) {
        console.error("Check subscription error:", error);
        setState({ status: "none", plan: null, endsAt: null, loading: false });
        return;
      }

      if (data?.subscribed) {
        const plan = data.product_id ? (PRODUCT_TO_PLAN[data.product_id] || null) : null;
        const endsAt = data.subscription_end ? new Date(data.subscription_end) : null;

        // Also sync to local subscriptions table
        await supabase.from("subscriptions").upsert(
          {
            user_id: user.id,
            plan: plan || "mensal",
            status: "active",
            started_at: new Date().toISOString(),
            ends_at: endsAt?.toISOString() || null,
          },
          { onConflict: "user_id" }
        );

        setState({
          status: "active",
          plan,
          endsAt,
          loading: false,
        });
      } else {
        // Mark as expired in local table if was active
        await supabase
          .from("subscriptions")
          .update({ status: "expired" })
          .eq("user_id", user.id)
          .in("status", ["active", "trial"]);

        setState({ status: "none", plan: null, endsAt: null, loading: false });
      }
    } catch (err) {
      console.error("Subscription check failed:", err);
      setState({ status: "none", plan: null, endsAt: null, loading: false });
    }
  }, [user]);

  useEffect(() => {
    checkAndUpdateStatus();
  }, [checkAndUpdateStatus]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkAndUpdateStatus, 60000);
    return () => clearInterval(interval);
  }, [user, checkAndUpdateStatus]);

  const isPremium = hasPremiumAccess(state.status, state.endsAt);

  return { ...state, isPremium, refresh: checkAndUpdateStatus };
}
