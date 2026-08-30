import { getStripe } from "@/lib/stripe/server";

/**
 * Single source of truth for creating the Book Package Checkout
 * Session — used by /api/checkout (logged-in buys) and by the
 * signup/login actions (brand-new buys). One-time payment, price from
 * STRIPE_PRICE_PREMIUM so test → live is an env swap, buyer's Supabase
 * user id stamped in metadata so the webhook can grant the entitlement.
 */
export async function createCheckoutSession(opts: {
  userId: string;
  email: string | null;
  origin: string;
}): Promise<string> {
  const price = process.env.STRIPE_PRICE_PREMIUM;
  if (!price) throw new Error("STRIPE_PRICE_PREMIUM is not set");

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    customer_email: opts.email ?? undefined,
    client_reference_id: opts.userId,
    metadata: { supabase_user_id: opts.userId, product: "premium" },
    success_url: `${opts.origin}/account?checkout=success`,
    cancel_url: `${opts.origin}/premium?checkout=cancelled`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return session.url;
}
