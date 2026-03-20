import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CANCEL-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { email: user.email });

    // Parse optional cancel reason
    let cancelReason = "";
    try {
      const body = await req.json();
      cancelReason = body?.reason || "";
    } catch { /* no body */ }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found");
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Find active or trialing subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    let sub = subscriptions.data[0];
    if (!sub) {
      const trialSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
        limit: 1,
      });
      sub = trialSubs.data[0];
    }

    if (!sub) {
      throw new Error("No active subscription found to cancel");
    }

    logStep("Found subscription", { subscriptionId: sub.id, status: sub.status });

    // Cancel at period end (NOT immediately)
    const updated = await stripe.subscriptions.update(sub.id, {
      cancel_at_period_end: true,
    });

    logStep("Stripe subscription updated", {
      cancel_at_period_end: updated.cancel_at_period_end,
      current_period_end: updated.current_period_end,
    });

    // Calculate the end date
    let endsAt: string | null = null;
    const periodEnd = updated.current_period_end;
    if (typeof periodEnd === "number" && periodEnd > 0) {
      endsAt = new Date(periodEnd * 1000).toISOString();
    } else if (typeof periodEnd === "string") {
      const parsed = new Date(periodEnd);
      if (!isNaN(parsed.getTime())) endsAt = parsed.toISOString();
    }

    // Update local database
    await supabaseClient.from("subscriptions").upsert(
      {
        user_id: user.id,
        status: "canceled",
        cancelled_at: new Date().toISOString(),
        ends_at: endsAt,
        cancel_reason: cancelReason || null,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
      },
      { onConflict: "user_id" }
    );

    logStep("Database updated", { endsAt });

    return new Response(JSON.stringify({
      success: true,
      ends_at: endsAt,
      cancel_at_period_end: true,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
