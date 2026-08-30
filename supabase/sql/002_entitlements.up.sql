-- ============================================================
-- entitlements — which account owns which product. Written ONLY
-- by the Stripe webhook (admin client); read by each user under
-- Row Level Security. Run this in the Supabase SQL editor.
-- ============================================================

create table if not exists public.entitlements (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users (id) on delete cascade,
  product              text not null check (product in ('premium')),
  status               text not null default 'active' check (status in ('active', 'canceled')),
  stripe_customer_id   text,
  created_at           timestamptz not null default now(),
  unique (user_id, product)
);

alter table public.entitlements enable row level security;

-- A user can read their own entitlements. There is deliberately NO
-- insert/update policy: only the webhook's secret-key client (which
-- bypasses RLS) can write rows.
create policy "own entitlements readable"
  on public.entitlements
  for select
  using (auth.uid() = user_id);
