# Accounts setup — Supabase + the new purchase flow

The Book Package now works like Unretire: visitors create an
account, pay through Stripe Checkout, and the purchase is attached
to the account — log in on any device, everything's there. Old
access codes from already-sent emails keep working.

## 1 · Create the Supabase project (~5 min, free tier)

1. supabase.com → New project → name "bouncing-forward", pick a
   region near your users, set a strong database password (store
   it; you rarely need it again).
2. Project Settings → **API** → copy three values into `.env.local`
   and Vercel (Production):
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable (anon) key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Secret (service_role) key → `SUPABASE_SECRET_KEY`
3. **SQL Editor** → paste and run
   `supabase/sql/002_entitlements.up.sql`.
4. Authentication → **Sign In / Up → Email**: turn **"Confirm
   email" OFF** (buyers go straight from signup to payment; the
   code degrades gracefully if you leave it on, but the flow is
   smoother off).

## 2 · Stripe: one extra value

In the Stripe dashboard (Test mode first, same as before):
Product catalogue → The Book Package → click the $9.99 price →
copy its **API ID** (`price_…`) → `STRIPE_PRICE_PREMIUM` in
Vercel + `.env.local`.

The Payment Link and its Confirmation-page redirect are no longer
used — checkout sessions are created by the site per buyer, and
Stripe returns people to `/account?checkout=success`. The webhook
endpoint and `STRIPE_WEBHOOK_SECRET` stay exactly as configured.

## 3 · What happens on a purchase

1. "Buy the Book Package" → not signed in? → signup (or login)
   with `intent=premium` → straight into Stripe Checkout.
2. Payment completes → Stripe calls the webhook → the buyer's
   account gains the `premium` entitlement (Supabase) AND their
   email is tagged `premium` in Mailchimp (access email + weekly
   notes), exactly as before.
3. The buyer lands on `/account` — book + workbook download
   buttons, no code needed, on any device, forever.

## 4 · Mailchimp journey C copy

The access-code email still goes out (codes still work), but the
better message is now: "Your Book Package is attached to your
account — log in at bouncing-forward.vercel.app/login on any
device." Update the journey's wording with Heather when convenient.

## 5 · Test checklist (Stripe Test mode)

- /premium logged out → Buy → signup form → account created →
  Stripe → 4242 4242 4242 4242 → land on /account with downloads.
- Log out, log back in (any browser) → downloads still there.
- Old access code in "Use an access code instead" → still opens.
- Webhook page in Stripe shows 200s.
