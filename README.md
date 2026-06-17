# ⚡ Supabase SaaS Starter

A production-ready Next.js 15 SaaS boilerplate. Skip the plumbing, ship your product.

> Built and battle-tested while building [The AI Forge](https://github.com/kkrib412). Opinionated by design.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | Supabase (Postgres + Auth + Storage) |
| Payments | Stripe (subscriptions + webhooks) |
| Email | Resend |
| AI | Anthropic Claude API |
| Styling | Tailwind CSS |
| Language | TypeScript |

---

## Features

- ✅ **Auth** — Email/password + magic link via Supabase Auth
- ✅ **Stripe Subscriptions** — Plans, billing portal, webhook handler
- ✅ **Protected Routes** — Middleware-based route guards
- ✅ **User Dashboard** — Skeleton dashboard ready to extend
- ✅ **Transactional Email** — Welcome, billing, and notification emails via Resend
- ✅ **AI-Ready** — Anthropic SDK wired up with a reusable client
- ✅ **Database Migrations** — Versioned SQL migrations for Supabase
- ✅ **Type-Safe** — Full TypeScript coverage including Supabase types

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/supabase-saas-starter
cd supabase-saas-starter
cp .env.example .env.local
npm install
npm run dev
```

Fill out `.env.local` with your keys (see [Environment Variables](#environment-variables)), then:

```bash
# Push the DB schema
npx supabase db push

# Run locally
npm run dev
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, signup, reset password pages
│   ├── dashboard/        # Protected user dashboard
│   └── api/
│       ├── stripe/       # Stripe webhook handler
│       └── ai/           # Claude API route
├── components/
│   ├── ui/               # Buttons, inputs, cards (unstyled primitives)
│   └── shared/           # Navbar, Footer, PricingCard, etc.
├── lib/
│   ├── supabase/         # Browser + server clients
│   ├── stripe/           # Stripe helpers + plan config
│   └── resend/           # Email templates + send helpers
└── types/                # Shared TypeScript types
supabase/
└── migrations/           # SQL migration files
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Stripe Plans

Plans are defined in `src/lib/stripe/plans.ts`. Edit them to match your product. Webhook handler at `src/app/api/stripe/webhook/route.ts` handles:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

---

## Database Schema

Core tables in `supabase/migrations/001_initial.sql`:

- `profiles` — extends Supabase auth.users
- `subscriptions` — linked to Stripe customer/subscription IDs
- `usage_logs` — optional per-feature usage tracking

---

## Deploying

### Vercel (recommended)
```bash
vercel --prod
```
Set all env vars in your Vercel project dashboard. Enable Supabase integration for automatic connection pooling.

### Stripe Webhooks
Point your Stripe webhook to:
```
https://yourdomain.com/api/stripe/webhook
```

---

## Roadmap

- [ ] OAuth providers (Google, GitHub)
- [ ] Usage-based billing with Stripe Meters
- [ ] Admin panel (user management, MRR dashboard)
- [ ] Onboarding flow with multi-step wizard
- [ ] API key management for SaaS APIs
- [ ] Team/org support with invite system

---

## Contributing

PRs welcome. Open an issue first for large changes.

---

## License

MIT
