import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

/** Create or retrieve a Stripe customer for a given user. */
export async function getOrCreateCustomer({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name?: string;
}): Promise<string> {
  const existing = await stripe.customers.search({
    query: `metadata["supabase_user_id"]:"${userId}"`,
    limit: 1,
  });

  if (existing.data.length > 0) {
    return existing.data[0].id;
  }

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { supabase_user_id: userId },
  });

  return customer.id;
}

/** Create a Stripe Checkout session for a subscription. */
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  trialDays,
}: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: trialDays
      ? { trial_period_days: trialDays }
      : undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });
}

/** Create a Stripe Billing Portal session so users can manage their sub. */
export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
