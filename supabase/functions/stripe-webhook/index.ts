import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

const PRODUCT_TO_PLAN: Record<string, string> = {
  "prod_UCfuzqN3xeBChd": "mensal",
  "prod_UCfuZLHeSLhBRr": "semestral",
  "prod_UCfuxVxgzcVgEk": "anual",
};

serve(async (req) => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!stripeKey) {
    logStep("ERROR", { message: "STRIPE_SECRET_KEY not set" });
    return new Response("Server error", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const body = await req.text();
    let event: Stripe.Event;

    if (webhookSecret) {
      const sig = req.headers.get("stripe-signature");
      if (!sig) {
        logStep("ERROR", { message: "No stripe-signature header" });
        return new Response("No signature", { status: 400 });
      }
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Without webhook secret, parse directly (less secure but functional)
      event = JSON.parse(body);
    }

    logStep("Event received", { type: event.type, id: event.id });

    const handleSubscriptionEvent = async (subscription: any) => {
      const customerId = typeof subscription.customer === "string" 
        ? subscription.customer 
        : subscription.customer?.id;

      if (!customerId) {
        logStep("No customer ID found");
        return;
      }

      // Get customer email
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer || (customer as any).deleted) {
        logStep("Customer deleted or not found");
        return;
      }
      const email = (customer as Stripe.Customer).email;
      if (!email) {
        logStep("No email on customer");
        return;
      }

      // Find user by email
      const { data: users } = await supabase.auth.admin.listUsers();
      const user = users?.users?.find(u => u.email === email);
      if (!user) {
        logStep("No Supabase user found for email", { email });
        return;
      }

      const status = subscription.status;
      const isActive = status === "active" || status === "trialing";
      
      let productId: string | null = null;
      try {
        productId = subscription.items?.data?.[0]?.price?.product ?? null;
        if (typeof productId === "object" && productId !== null) {
          productId = (productId as any).id ?? null;
        }
      } catch { productId = null; }

      const plan = productId ? (PRODUCT_TO_PLAN[productId] || "mensal") : "mensal";

      let endsAt: string | null = null;
      const periodEnd = subscription.current_period_end;
      if (typeof periodEnd === "number" && periodEnd > 0) {
        endsAt = new Date(periodEnd * 1000).toISOString();
      } else if (typeof periodEnd === "string") {
        const parsed = new Date(periodEnd);
        if (!isNaN(parsed.getTime())) endsAt = parsed.toISOString();
      }

      const dbStatus = isActive ? "active" : 
        (status === "canceled" || status === "unpaid") ? "canceled" : "expired";

      logStep("Upserting subscription", { userId: user.id, dbStatus, plan, endsAt });

      await supabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          plan,
          status: dbStatus,
          started_at: new Date().toISOString(),
          ends_at: endsAt,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          cancelled_at: status === "canceled" ? new Date().toISOString() : null,
        },
        { onConflict: "user_id" }
      );

      logStep("Subscription upserted successfully");
    };

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", { sessionId: session.id, subscriptionId: session.subscription });
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await handleSubscriptionEvent(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "invoice.paid": {
        const obj = event.data.object;
        if (event.type === "invoice.paid") {
          const invoice = obj as Stripe.Invoice;
          if (invoice.subscription) {
            const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
            await handleSubscriptionEvent(sub);
          }
        } else {
          await handleSubscriptionEvent(obj);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await handleSubscriptionEvent(sub);
        break;
      }
      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
