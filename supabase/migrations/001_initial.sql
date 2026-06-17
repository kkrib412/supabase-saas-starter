-- ─────────────────────────────────────────────
-- 001: Initial schema
-- ─────────────────────────────────────────────

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text not null,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Subscriptions
create table if not exists public.subscriptions (
  id                      uuid default gen_random_uuid() primary key,
  user_id                 uuid references public.profiles(id) on delete cascade,
  stripe_customer_id      text unique not null,
  stripe_subscription_id  text unique,
  plan_id                 text not null default 'starter',
  status                  text not null default 'active',
  current_period_end      timestamptz,
  created_at              timestamptz default now() not null,
  updated_at              timestamptz default now() not null
);

-- Usage logs (for metered billing or analytics)
create table if not exists public.usage_logs (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references public.profiles(id) on delete cascade,
  input_tokens   integer default 0,
  output_tokens  integer default 0,
  created_at     timestamptz default now() not null
);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_logs enable row level security;

-- Profiles: users can only read/update their own
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Subscriptions: users can read their own
create policy "subscriptions: read own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Usage: users can read their own
create policy "usage: read own"
  on public.usage_logs for select
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists usage_logs_user_id_idx on public.usage_logs(user_id);
create index if not exists usage_logs_created_at_idx on public.usage_logs(created_at desc);
