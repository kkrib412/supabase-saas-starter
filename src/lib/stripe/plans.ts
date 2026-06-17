export type PlanId = "starter" | "pro" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  priceMonthly: number;
  stripePriceId: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For solo founders getting started.",
    priceMonthly: 29,
    stripePriceId: process.env.STRIPE_PRICE_STARTER!,
    features: [
      "Up to 3 projects",
      "1,000 AI requests / month",
      "Email support",
      "Core integrations",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses that need more.",
    priceMonthly: 79,
    stripePriceId: process.env.STRIPE_PRICE_PRO!,
    highlighted: true,
    features: [
      "Unlimited projects",
      "10,000 AI requests / month",
      "Priority support",
      "All integrations",
      "Analytics dashboard",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom volume for larger teams.",
    priceMonthly: 299,
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    features: [
      "Everything in Pro",
      "Unlimited AI requests",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "SSO / SAML",
    ],
  },
];

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function getPlanByPriceId(priceId: string): Plan | undefined {
  return PLANS.find((p) => p.stripePriceId === priceId);
}
