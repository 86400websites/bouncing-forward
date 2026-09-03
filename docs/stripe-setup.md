# Stripe setup — the $9.99 Book Package

Fifteen minutes in the Stripe dashboard connects real payments.
Do it once in **Test mode** first, then repeat the same steps in
Live mode.

## 1 · Product and Payment Link

1. Stripe → **Product catalogue** → **Add product**:
   name "The Book Package — Bouncing Forward", one-time price
   **$9.99 USD**.
2. Stripe → **Payment links** → **New** → pick that product.
3. Under **After payment** choose **Redirect customers to your
   website** and paste — exactly, including the tail:

   `https://bouncing-forward.vercel.app/premium?session_id={CHECKOUT_SESSION_ID}`

   That tail is how the site opens everything the moment payment
   completes, without waiting for the email.

4. Copy the link's URL (starts `https://buy.stripe.com/…`).

## 2 · Webhook (tags the buyer in Mailchimp)

1. Stripe → **Developers** → **Webhooks** → **Add endpoint**.
2. Endpoint URL: `https://bouncing-forward.vercel.app/api/stripe/webhook`
3. Events: select `checkout.session.completed` and
   `checkout.session.async_payment_succeeded`.
4. After creating it, open the endpoint and copy the
   **Signing secret** (`whsec_…`).

## 3 · Keys into Vercel

Project → Settings → Environment Variables (Production), then
**redeploy**:

| Variable                          | Value                              |
| --------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | the `https://buy.stripe.com/…` URL |
| `STRIPE_SECRET_KEY`               | Developers → API keys → Secret key |
| `STRIPE_WEBHOOK_SECRET`           | the `whsec_…` signing secret       |

(`PREMIUM_ACCESS_CODES` and the three Mailchimp variables should
already be set — the webhook needs Mailchimp to deliver the
access-code email.)

## 4 · Mailchimp automation C

Journey triggered by **tag added → `premium`**, sending Heather's
access-code email (BF_Premium_Access_Email) with `[ACCESS CODE]`
replaced by the first code in `PREMIUM_ACCESS_CODES`. Details in
`mailchimp-automations.md`.

## 5 · Test run (Test mode)

Use test keys + a test Payment Link, set the env vars in a
Preview environment or locally, pay with card `4242 4242 4242
4242` (any future expiry, any CVC). You should land back on
/premium with everything open, and the test email appears in
Mailchimp tagged `premium`.

## What the buyer experiences

Buy → Stripe checkout → back on /premium with the library open →
the email arrives with the same code for their other devices.
