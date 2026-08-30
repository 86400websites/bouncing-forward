import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Server-only Stripe client, created lazily on FIRST USE so importing
 * this module never throws when STRIPE_SECRET_KEY isn't set (e.g. a
 * Preview build). Never expose the secret key to the browser.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key);
  }
  return _stripe;
}
