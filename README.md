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

- ✅ Auth — Email/password + magic link via Supabase Auth
- ✅ Stripe Subscriptions — Plans, billing portal, webhook handler
- ✅ Protected Routes — Middleware-based route guards
- ✅ User Dashboard — Skeleton dashboard ready to extend
- ✅ Transactional Email — Welcome, billing, and notification emails via Resend
- ✅ AI-Ready — Anthropic SDK wired up with a reusable client
- ✅ Database Migrations — Versioned SQL migrations for Supabase
- ✅ Type-Safe — Full TypeScript coverage including Supabase types

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/supabase-saas-starter
cd supabase-saas-starter
cp .env.example .env.local
npm install
npm run dev
```

Fill out `.env.local` with your keys, then run the app and push the DB schema.

---

## Steps

1. Clone the repo
2. Copy `.env.example` to `.env.local`
3. Install dependencies
4. Add Supabase and Stripe credentials
5. Push database schema
6. Run locally or deploy

---

## Display format

- [ ] Auth flow enabled
- [ ] Database schema loaded
- [ ] Payments configured
- [ ] Deployment working

---

## License

MIT
