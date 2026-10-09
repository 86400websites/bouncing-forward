import { getStripe } from "@/lib/stripe/server";

/**
 * Purchase identification for a SHARED Stripe account.
 *
 * The account also serves Unretire (subscriptions, unretireproject.com),
 * and every webhook endpoint on the account receives every event. Before
 * Bouncing Forward writes an entitlement or tags an email it must be
 * sure the checkout is its own. Trusted evidence, in order:
 *
 *   1. mode — Bouncing Forward sells one one-time payment; anything else
 *      is not ours.
 *   2. metadata.app — stamped "bouncing-forward" on every session this
 *      site creates from now on; a different marker is someone else's.
 *   3. Sessions created before the marker existed through the site: the
 *      return address Stripe was given (success/cancel URL) must be one
 *      of our hosts.
 *   4. Sessions created through the old Stripe Payment Link (no return
 *      address on the session, no metadata): accepted when the purchased
 *      price is our Book Package price — or, when that cannot be checked,
 *      accepted as the historical Bouncing Forward flow.
 *   5. Very old account-flow sessions with no return address at all:
 *      the original metadata shape (product + supabase_user_id).
 *
 * Nothing here reads a secret value; the key prefix check only tells
 * live from test so an event from the wrong mode is never acted on.
 */

export const APP_MARKER = "bouncing-forward";

const RETURN_HOSTNAMES = [
  "www.bouncing-forward.com",
  "bouncing-forward.com",
  "bouncing-forward.vercel.app",
];

export type CheckoutSessionLike = {
  id?: string;
  mode?: string | null;
  livemode?: boolean;
  payment_status?: string | null;
  payment_link?: string | null;
  metadata?: Record<string, string | undefined> | null;
  success_url?: string | null;
  cancel_url?: string | null;
  line_items?: { data?: { price?: { id?: string } | null }[] } | null;
};

export type Classification =
  { ours: true; basis: string } | { ours: false; reason: string };

function hostnameOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isOurReturnHost(hostname: string): boolean {
  return (
    RETURN_HOSTNAMES.includes(hostname) ||
    (hostname.startsWith("bouncing-forward-") &&
      hostname.endsWith(".vercel.app")) ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  );
}

/** Price ids on the session when line items were expanded; null if unknown. */
export function priceIdsOf(session: CheckoutSessionLike): string[] | null {
  const items = session.line_items?.data;
  if (!items) return null;
  return items
    .map((item) => item.price?.id)
    .filter((id): id is string => typeof id === "string");
}

export function classifyCheckoutSession(
  session: CheckoutSessionLike,
  priceIds: string[] | null = priceIdsOf(session),
): Classification {
  if (session.mode && session.mode !== "payment") {
    return { ours: false, reason: `mode:${session.mode}` };
  }
  const app = session.metadata?.app?.trim();
  if (app) {
    return app === APP_MARKER
      ? { ours: true, basis: "metadata.app" }
      : { ours: false, reason: `metadata.app:${app}` };
  }
  const returnHost =
    hostnameOf(session.success_url) ?? hostnameOf(session.cancel_url);
  if (returnHost) {
    return isOurReturnHost(returnHost)
      ? { ours: true, basis: `legacy-return-url:${returnHost}` }
      : { ours: false, reason: `return-url:${returnHost}` };
  }
  if (session.payment_link) {
    const ourPrice = process.env.STRIPE_PRICE_PREMIUM?.trim();
    if (priceIds && ourPrice) {
      return priceIds.includes(ourPrice)
        ? { ours: true, basis: "legacy-payment-link-price" }
        : { ours: false, reason: "payment-link-price-mismatch" };
    }
    return { ours: true, basis: "legacy-payment-link" };
  }
  if (
    session.metadata?.product === "premium" &&
    session.metadata?.supabase_user_id
  ) {
    return { ours: true, basis: "legacy-metadata" };
  }
  return { ours: false, reason: "no-bouncing-forward-evidence" };
}

/**
 * Webhook payloads carry no line items. For a Payment-Link session with
 * no other evidence, fetch them so the price can be checked; returns null
 * (cannot check) on any failure rather than throwing.
 */
export async function lookUpPriceIds(
  session: CheckoutSessionLike,
): Promise<string[] | null> {
  if (!session.id || !session.payment_link) return null;
  try {
    const full = await getStripe().checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });
    return priceIdsOf(full as unknown as CheckoutSessionLike);
  } catch (err) {
    console.error("Stripe session look-up failed:", err);
    return null;
  }
}

/** "live" | "test" from the configured key's prefix; null if unknown. */
export function configuredStripeMode(): "live" | "test" | null {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (/^(sk|rk)_live_/.test(key)) return "live";
  if (/^(sk|rk)_test_/.test(key)) return "test";
  return null;
}

/** False only when we can tell the event's mode disagrees with our key. */
export function livemodeMatchesConfiguration(
  livemode: boolean | undefined,
): boolean {
  const mode = configuredStripeMode();
  if (mode === null || livemode === undefined) return true;
  return (mode === "live") === livemode;
}
