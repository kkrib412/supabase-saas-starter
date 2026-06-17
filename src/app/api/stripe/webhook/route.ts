import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { getPlanByPriceId } from "@/lib/stripe/plans";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;
      const plan = getPlanByPriceId(priceId);

      await supabase
        .from("subscriptions")
        .upsert({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan_id: plan?.id ?? "starter",
          status: subscription.status,
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
        })
        .eq("stripe_customer_id", customerId);

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;
      const plan = getPlanByPriceId(priceId);

      await supabase
        .from("subscriptions")
        .update({
          plan_id: plan?.id ?? "starter",
          status: subscription.status,
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;

      await supabase
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_customer_id", invoice.customer as string);

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
