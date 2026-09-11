import { randomBytes } from "node:crypto";
import { expect, type Locator, type Page } from "@playwright/test";
import Stripe from "stripe";
import { fillQuietly } from "./auth";
import { LABEL, runId } from "./identities";
import type { ResolvedTarget } from "./target";

/**
 * Stripe TEST-mode helpers for the payment lines (docs/FEATURE-LIST.md
 * section D). The account is SHARED with another site, so every session
 * this harness creates is labelled, and the classification rules in
 * src/lib/stripe/identify.ts are exercised with synthetic events signed
 * with the Preview endpoint's secret.
 *
 * Safety: a live key is refused by target.ts before it gets here; a
 * return address is only ever the verified target origin (or example.com
 * for the foreign shape, which the browser never follows); raw webhook
 * endpoint URLs are never returned or logged (a bypass query parameter
 * may ride on them); Checkout URLs and session ids stay out of messages.
 */

export const TEST_CARDS = {
  success: "4242424242424242",
  declined: "4000000000000002",
} as const;

/** The marker src/lib/stripe/identify.ts stamps on this site's sessions. */
export const APP_MARKER = "bouncing-forward";
/** A marker that belongs to "another site" on the shared account. */
export const OTHER_SITE_MARKER = "launch-gate-other-site";

export function stripeTest(target: ResolvedTarget): Stripe {
  const key = target.testStripe.secretKey;
  if (!key) {
    throw new Error(
      "[launch-gate] E2E_STRIPE_SECRET_KEY is required for Stripe test-mode checks (an sk_test_/rk_test_ key of the shared sandbox).",
    );
  }
  if (!/^(sk|rk)_test_/.test(key)) {
    throw new Error(
      "[launch-gate] E2E_STRIPE_SECRET_KEY is not a test-mode key. Refusing.",
    );
  }
  return new Stripe(key);
}

export function webhookSecret(target: ResolvedTarget): string {
  const secret = target.testStripe.webhookSecret;
  if (!secret) {
    throw new Error(
      "[launch-gate] E2E_STRIPE_WEBHOOK_SECRET is required for synthetic signed events — the signing secret of the Preview's sandbox webhook endpoint (identical to the Preview's STRIPE_WEBHOOK_SECRET).",
    );
  }
  return secret;
}

/** The Checkout Session fields the webhook route reads. */
export type WebhookSession = {
  id: string;
  object: "checkout.session";
  mode: string | null;
  livemode: boolean;
  status: string | null;
  payment_status: string | null;
  payment_link: string | null;
  metadata: Record<string, string> | null;
  success_url: string | null;
  cancel_url: string | null;
  customer: string | null;
  customer_email: string | null;
  customer_details: { email: string | null; name: string | null } | null;
  client_reference_id: string | null;
  amount_total: number | null;
  currency: string | null;
};

export type WebhookEvent = {
  id: string;
  object: "event";
  api_version: string;
  created: number;
  livemode: boolean;
  type: string;
  pending_webhooks: number;
  request: { id: string | null; idempotency_key: string | null };
  data: { object: WebhookSession };
};

function fakeId(prefix: string): string {
  return `${prefix}_${randomBytes(12)
    .toString("base64url")
    .replace(/[^A-Za-z0-9]/g, "x")}`;
}

/**
 * A realistic livemode:false `checkout.session.completed` event. The
 * default session is inert (our marker, paid, but no user id and no
 * email), so a spec must set what it means to write: `object.metadata`
 * with supabase_user_id + product, `object.customer_details.email`, a
 * legacy `success_url` on the target origin, `payment_link`, or `null`s.
 * `object` merges shallowly — null replaces the default.
 */
export function checkoutCompletedEvent(
  overrides: {
    id?: string;
    type?: string;
    livemode?: boolean;
    created?: number;
    object?: Partial<WebhookSession>;
  } = {},
): WebhookEvent {
  const session: WebhookSession = {
    id: fakeId("cs_test"),
    object: "checkout.session",
    mode: "payment",
    livemode: overrides.livemode ?? false,
    status: "complete",
    payment_status: "paid",
    payment_link: null,
    metadata: { app: APP_MARKER, launch_gate: LABEL },
    success_url: null,
    cancel_url: null,
    customer: null,
    customer_email: null,
    customer_details: null,
    client_reference_id: null,
    amount_total: 999,
    currency: "usd",
    ...overrides.object,
  };
  return {
    id: overrides.id ?? fakeId("evt"),
    object: "event",
    api_version: "2025-08-27.basil",
    created: overrides.created ?? Math.floor(Date.now() / 1000),
    livemode: overrides.livemode ?? false,
    type: overrides.type ?? "checkout.session.completed",
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    data: { object: session },
  };
}

/**
 * Body + headers for a signed POST to /api/stripe/webhook. Accepts an
 * object (serialised) or a RAW STRING (so a signed non-JSON payload can
 * prove the "Invalid payload." branch). Options: `secretOverride` signs
 * with another secret, `timestampOffsetSeconds` signs with a shifted
 * timestamp (e.g. -600 for a stale signature), `tamperBody` alters the
 * body AFTER signing so the signature no longer matches.
 */
export function signedWebhookRequest(
  target: ResolvedTarget,
  payload: string | object,
  options?: {
    secretOverride?: string;
    timestampOffsetSeconds?: number;
    tamperBody?: boolean;
  },
): { data: Buffer; headers: Record<string, string> } {
  const secret = options?.secretOverride ?? webhookSecret(target);
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  const timestamp =
    Math.floor(Date.now() / 1000) + (options?.timestampOffsetSeconds ?? 0);
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload: body,
    secret,
    timestamp,
  });
  const data = options?.tamperBody
    ? body.includes('"paid"')
      ? body.replace('"paid"', '"unpaid"')
      : `${body} `
    : body;
  return {
    // Raw bytes, not a string: with a JSON content-type the request layer
    // re-encodes a string that is not valid JSON, so the body Stripe verifies
    // would stop matching the body that was signed and a deliberately
    // malformed payload would be refused as an invalid signature instead of
    // reaching the handler's "Invalid payload." branch.
    data: Buffer.from(data, "utf8"),
    headers: {
      "content-type": "application/json",
      "stripe-signature": signature,
    },
  };
}

/** `cs_test_…` from a checkout.stripe.com URL's path (never its fragment); null when absent. */
export function sessionIdFromUrl(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    return /(cs_test_[A-Za-z0-9]+)/.exec(pathname)?.[1] ?? null;
  } catch {
    return null;
  }
}

export async function retrieveSession(
  target: ResolvedTarget,
  id: string,
  options?: { expandLineItems?: boolean },
): Promise<Stripe.Checkout.Session> {
  return stripeTest(target).checkout.sessions.retrieve(
    id,
    options?.expandLineItems ? { expand: ["line_items"] } : {},
  );
}

function originOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/**
 * Retrieves the session and throws a plain error when its success_url or
 * cancel_url is not on the target origin — so a browser is never sent to
 * a Production return address.
 */
export async function assertSessionReturnsToTarget(
  target: ResolvedTarget,
  sessionId: string,
): Promise<Stripe.Checkout.Session> {
  const session = await retrieveSession(target, sessionId);
  for (const [name, url] of [
    ["success_url", session.success_url],
    ["cancel_url", session.cancel_url],
  ] as const) {
    const origin = originOf(url);
    if (origin !== target.origin) {
      throw new Error(
        `[launch-gate] The Checkout Session's ${name} is on ${origin ?? "no origin"}, not the target ${target.origin}. ` +
          "The deployment built its return address from NEXT_PUBLIC_SITE_URL instead of its own host — refusing to follow it.",
      );
    }
  }
  return session;
}

async function visible(locator: Locator, timeout: number): Promise<boolean> {
  try {
    await locator.waitFor({ state: "visible", timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Fills the hosted Stripe Checkout page (test card, 12/34, CVC 123, US
 * 94103) and submits. `expect: "redirect"` (default) resolves once Stripe
 * navigates away from stripe.com; `expect: "decline"` resolves when the
 * decline notice is shown, still on checkout.stripe.com. Every wait is
 * bounded; failures are plain messages.
 */
export async function payOnStripeCheckout(
  page: Page,
  opts: {
    card: string;
    name: string;
    email?: string;
    expect?: "redirect" | "decline";
  },
): Promise<{ outcome: "redirected" | "declined"; url: string }> {
  try {
    await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//, {
      timeout: 30_000,
    });
  } catch {
    throw new Error(
      "[launch-gate] The browser did not reach Stripe Checkout within 30 s.",
    );
  }
  const cardNumber = page.locator("#cardNumber");
  if (!(await visible(cardNumber, 20_000))) {
    // Some layouts fold the card form behind a "Card" choice.
    const cardChoice = page
      .locator(
        "#payment-method-accordion-item-title-card, [data-testid='card-accordion-item-button'], button:has-text('Card')",
      )
      .first();
    if (await visible(cardChoice, 2_000)) await cardChoice.click();
    if (!(await visible(cardNumber, 20_000))) {
      throw new Error(
        "[launch-gate] Stripe Checkout did not show its card form within the bounded wait.",
      );
    }
  }
  const emailField = page.locator("#email");
  if (
    opts.email &&
    (await emailField.isVisible().catch(() => false)) &&
    (await emailField.isEditable().catch(() => false))
  ) {
    await fillQuietly(emailField, opts.email, "checkout email");
  }
  await fillQuietly(cardNumber, opts.card, "card number");
  await fillQuietly(page.locator("#cardExpiry"), "1234", "card expiry");
  await fillQuietly(page.locator("#cardCvc"), "123", "card CVC");
  await fillQuietly(page.locator("#billingName"), opts.name, "name on card");
  const country = page.locator("#billingCountry");
  if (await country.isVisible().catch(() => false)) {
    await country.selectOption("US").catch(() => undefined);
  }
  const postal = page.locator("#billingPostalCode");
  if (await visible(postal, 3_000)) {
    await fillQuietly(postal, "94103", "postal code");
  }
  await page
    .locator(
      "[data-testid='hosted-payment-submit-button'], button[type='submit']",
    )
    .first()
    .click();

  if ((opts.expect ?? "redirect") === "decline") {
    await expect(
      page.getByText(/declined/i).first(),
      "Stripe Checkout did not show a decline notice within 30 s.",
    ).toBeVisible({ timeout: 30_000 });
    return { outcome: "declined", url: page.url() };
  }
  try {
    await page.waitForURL((url) => !url.hostname.endsWith("stripe.com"), {
      timeout: 90_000,
    });
  } catch {
    throw new Error(
      "[launch-gate] Stripe Checkout did not navigate away within 90 s after the payment was submitted.",
    );
  }
  return { outcome: "redirected", url: page.url() };
}

/**
 * Leaves the hosted page through Stripe's own back control (the link
 * whose href is the session's cancel_url on the target origin), falling
 * back to navigating to the retrieved cancel_url when the control is not
 * rendered. Never navigates to another origin.
 */
export async function leaveStripeCheckout(
  page: Page,
  target: ResolvedTarget,
): Promise<{ viaStripeControl: boolean }> {
  const back = page
    .locator(`a[href^="${target.origin}/premium?checkout=cancelled"]`)
    .first();
  if (await visible(back, 5_000)) {
    await back.click();
    await page.waitForURL(`${target.origin}/premium**`, { timeout: 30_000 });
    return { viaStripeControl: true };
  }
  const id = sessionIdFromUrl(page.url());
  if (!id) {
    throw new Error(
      "[launch-gate] Not on a Stripe Checkout page — cannot leave it.",
    );
  }
  const session = await assertSessionReturnsToTarget(target, id);
  await page.goto(session.cancel_url as string);
  return { viaStripeControl: false };
}

export type TestSessionShape = "legacy-bf" | "foreign";

/**
 * Creates a $9.99 one-time test session with price_data (no dependence on
 * STRIPE_PRICE_PREMIUM):
 *   legacy-bf  no app marker; success_url `${origin}/premium?session_id={CHECKOUT_SESSION_ID}`,
 *              cancel_url `${origin}/premium?checkout=cancelled` — origin must be the target
 *   foreign    metadata.app "launch-gate-other-site"; success_url
 *              https://example.com/paid?session_id={CHECKOUT_SESSION_ID} (never followed)
 * `email` prefills the hosted page. Register the id with recordFixture.
 */
export async function createTestSession(
  target: ResolvedTarget,
  opts: { shape: TestSessionShape; origin: string; email?: string },
): Promise<{ id: string; url: string }> {
  if (opts.shape === "legacy-bf" && opts.origin !== target.origin) {
    throw new Error(
      `[launch-gate] A legacy-shape session may only return to the verified target (${target.origin}).`,
    );
  }
  const common = {
    launch_gate: LABEL,
    launch_gate_run: runId(),
    launch_gate_shape: opts.shape,
  };
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: 999,
          product_data: { name: `Book Package ${LABEL}` },
        },
      },
    ],
    customer_email: opts.email,
    ...(opts.shape === "legacy-bf"
      ? {
          metadata: common,
          success_url: `${opts.origin}/premium?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${opts.origin}/premium?checkout=cancelled`,
        }
      : {
          metadata: { ...common, app: OTHER_SITE_MARKER },
          success_url:
            "https://example.com/paid?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: "https://example.com/cancelled",
        }),
  };
  const session = await stripeTest(target).checkout.sessions.create(params);
  if (!session.url) {
    throw new Error("[launch-gate] Stripe did not return a Checkout URL.");
  }
  return { id: session.id, url: session.url };
}

/** Expires an open session; `expired: false` (with the status) when it is not open. */
export async function expireSession(
  target: ResolvedTarget,
  sessionId: string,
): Promise<{ expired: boolean; status: string | null }> {
  const stripe = stripeTest(target);
  const current = await stripe.checkout.sessions.retrieve(sessionId);
  if (current.status !== "open") {
    return { expired: false, status: current.status ?? null };
  }
  const result = await stripe.checkout.sessions.expire(sessionId);
  return {
    expired: result.status === "expired",
    status: result.status ?? null,
  };
}

export type SanitisedWebhookEndpoint = {
  origin: string;
  pathname: string;
  status: string;
  enabled_events: string[];
  livemode: boolean;
};

/**
 * The account's test-mode webhook endpoints with their URLs reduced to
 * origin + pathname (a bypass query parameter may ride on the real URL).
 * Throws a plain permission message when the key cannot list endpoints.
 */
export async function listTestWebhookEndpoints(
  target: ResolvedTarget,
): Promise<SanitisedWebhookEndpoint[]> {
  let endpoints: Stripe.WebhookEndpoint[];
  try {
    const list = await stripeTest(target).webhookEndpoints.list({
      limit: 100,
    });
    endpoints = list.data;
  } catch (err) {
    const status =
      err instanceof Stripe.errors.StripeError ? err.statusCode : undefined;
    if (status === 401 || status === 403) {
      throw new Error(
        "[launch-gate] E2E_STRIPE_SECRET_KEY cannot list webhook endpoints (permission denied) — use a test key with Webhook Endpoints read access.",
      );
    }
    throw new Error(
      `[launch-gate] Could not list Stripe webhook endpoints${status ? ` (HTTP ${status})` : ""}.`,
    );
  }
  return endpoints.map((endpoint) => {
    let origin = "";
    let pathname = "";
    try {
      const url = new URL(endpoint.url);
      origin = url.origin;
      pathname = url.pathname;
    } catch {
      origin = "(unparseable)";
    }
    return {
      origin,
      pathname,
      status: endpoint.status,
      enabled_events: [...endpoint.enabled_events],
      livemode: endpoint.livemode,
    };
  });
}
