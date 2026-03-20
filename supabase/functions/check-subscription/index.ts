import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
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

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Check active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    let subscribed = subscriptions.data.length > 0;
    let productId: string | null = null;
    let subscriptionEnd: string | null = null;
    let subscriptionId: string | null = null;
    let sub: any = null;

    if (subscribed) {
      sub = subscriptions.data[0];
    } else {
      // Check trialing
      const trialSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
        limit: 1,
      });
      if (trialSubs.data.length > 0) {
        subscribed = true;
        sub = trialSubs.data[0];
      }
    }

    if (sub) {
      subscriptionId = sub.id;
      // Safely extract period end - handle both unix timestamp and string formats
      const periodEnd = sub.current_period_end;
      logStep("Raw period end", { periodEnd, type: typeof periodEnd });
      
      if (typeof periodEnd === "number" && periodEnd > 0) {
        subscriptionEnd = new Date(periodEnd * 1000).toISOString();
      } else if (typeof periodEnd === "string") {
        const parsed = new Date(periodEnd);
        if (!isNaN(parsed.getTime())) {
          subscriptionEnd = parsed.toISOString();
        }
      }
      
      // Safely extract product ID
      try {
        productId = sub.items?.data?.[0]?.price?.product ?? null;
        if (typeof productId === "object" && productId !== null) {
          productId = (productId as any).id ?? null;
        }
      } catch {
        productId = null;
      }

      // Sync to local subscriptions table
      const PRODUCT_TO_PLAN: Record<string, string> = {
        "prod_UA51MKpyHjm7pV": "mensal",
        "prod_UA53qLN4dqKmMS": "semestral",
        "prod_UA53rF7VfL99Jt": "anual",
      };
      const plan = productId ? (PRODUCT_TO_PLAN[productId] || "mensal") : "mensal";

      await supabaseClient.from("subscriptions").upsert(
        {
          user_id: user.id,
          plan,
          status: "active",
          started_at: new Date().toISOString(),
          ends_at: subscriptionEnd,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        },
        { onConflict: "user_id" }
      );
    } else {
      // No active subscription - mark expired
      await supabaseClient
        .from("subscriptions")
        .update({ status: "expired" })
        .eq("user_id", user.id)
        .in("status", ["active", "trial"]);
    }

    logStep("Result", { subscribed, productId, subscriptionEnd, subscriptionId });

    return new Response(JSON.stringify({
      subscribed,
      product_id: productId,
      subscription_end: subscriptionEnd,
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
