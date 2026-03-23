import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionStatus = "active" | "trial" | "expired" | "canceled" | "none";
export type SubscriptionPlan = "mensal" | "semestral" | "anual" | null;

const PRODUCT_TO_PLAN: Record<string, SubscriptionPlan> = {
  "prod_UA51MKpyHjm7pV": "mensal",
  "prod_UA53qLN4dqKmMS": "semestral",
  "prod_UA53rF7VfL99Jt": "anual",
};

const CACHE_KEY = "nutroo_sub_cache";

interface SubscriptionState {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  endsAt: Date | null;
  cancelAtPeriodEnd: boolean;
  loading: boolean;
  isPremium: boolean;
}

interface SubscriptionContextValue extends SubscriptionState {
  refresh: () => Promise<void>;
}

function hasPremiumAccess(status: SubscriptionStatus, endsAt: Date | null): boolean {
  if (status === "active" || status === "trial") return true;
  if (status === "canceled" && endsAt && new Date(endsAt) > new Date()) return true;
  return false;
}

function readCache(): { status: SubscriptionStatus; plan: SubscriptionPlan; endsAt: string | null; cancelAtPeriodEnd: boolean } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function writeCache(status: SubscriptionStatus, plan: SubscriptionPlan, endsAt: Date | null, cancelAtPeriodEnd: boolean) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ status, plan, endsAt: endsAt?.toISOString() || null, cancelAtPeriodEnd }));
  } catch {}
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Initialize from cache to avoid flicker
  const cached = readCache();
  const cachedEndsAt = cached?.endsAt ? new Date(cached.endsAt) : null;
  const cachedStatus = cached?.status || "none";
  const cachedPremium = cached ? hasPremiumAccess(cachedStatus, cachedEndsAt) : false;

  const [state, setState] = useState<SubscriptionState>({
    status: user ? cachedStatus : "none",
    plan: user ? (cached?.plan || null) : null,
    endsAt: user ? cachedEndsAt : null,
    cancelAtPeriodEnd: user ? (cached?.cancelAtPeriodEnd || false) : false,
    loading: !!user, // only loading if there's a user to check
    isPremium: user ? cachedPremium : false,
  });

  const checkAndUpdateStatus = useCallback(async () => {
    if (!user) {
      clearCache();
      setState({ status: "none", plan: null, endsAt: null, cancelAtPeriodEnd: false, loading: false, isPremium: false });
      return;
    }

    try {
      console.log("[SUBSCRIPTION] Checking status for user:", user.email);
      const { data, error } = await supabase.functions.invoke("check-subscription");

      if (error) {
        console.error("[SUBSCRIPTION] Check error:", error);
        // Keep cached state on error — don't block user
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      if (data?.subscribed) {
        const plan = data.product_id ? (PRODUCT_TO_PLAN[data.product_id] || null) : null;
        const endsAt = data.subscription_end ? new Date(data.subscription_end) : null;
        const cancelAtPeriodEnd = data.cancel_at_period_end === true;
        const status: SubscriptionStatus = cancelAtPeriodEnd ? "canceled" : "active";
        const isPremium = hasPremiumAccess(status, endsAt);

        writeCache(status, plan, endsAt, cancelAtPeriodEnd);
        console.log("[SUBSCRIPTION] Active —", { status, plan, isPremium });

        // Sync to local table (fire and forget)
        supabase.from("subscriptions").upsert(
          { user_id: user.id, plan: plan || "mensal", status, started_at: new Date().toISOString(), ends_at: endsAt?.toISOString() || null },
          { onConflict: "user_id" }
        ).then(() => {});

        setState({ status, plan, endsAt, cancelAtPeriodEnd, loading: false, isPremium });
      } else {
        console.log("[SUBSCRIPTION] Not subscribed");
        writeCache("none", null, null, false);

        supabase.from("subscriptions").update({ status: "expired" }).eq("user_id", user.id).in("status", ["active", "trial"]).then(() => {});

        setState({ status: "none", plan: null, endsAt: null, cancelAtPeriodEnd: false, loading: false, isPremium: false });
      }
    } catch (err) {
      console.error("[SUBSCRIPTION] Check failed:", err);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    checkAndUpdateStatus();
  }, [checkAndUpdateStatus]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkAndUpdateStatus, 60000);
    return () => clearInterval(interval);
  }, [user, checkAndUpdateStatus]);

  return (
    <SubscriptionContext.Provider value={{ ...state, refresh: checkAndUpdateStatus }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}

export { hasPremiumAccess };
