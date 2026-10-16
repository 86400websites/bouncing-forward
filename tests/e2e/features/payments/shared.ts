import path from "node:path";
import type { Page, PlaywrightWorkerArgs } from "@playwright/test";
import { expect } from "../../harness/fixtures";
import { AUTH_DIR } from "../../harness/auth";
import { identity } from "../../harness/identities";
import { apiAs, type RoleApi } from "../../harness/roles";
import {
  preflightRecord,
  recordFixture,
  type PreflightDeployment,
} from "../../harness/run-record";
import {
  assertSessionReturnsToTarget,
  sessionIdFromUrl,
} from "../../harness/stripe";
import type { ResolvedTarget } from "../../harness/target";
import { ensureTestUser, entitlementsFor } from "../../harness/test-supabase";

/** Shared pieces of the payment specs (docs/FEATURE-LIST.md section D). Stripe TEST mode only. */

export const BUY = "Buy the Book Package — $9.99";
export const BOOK = "/api/premium/download?file=book";
export const WORKBOOK = "/api/premium/download?file=workbook";
export const STRIPE_CHECKOUT =
  /^https:\/\/checkout\.stripe\.com\/c\/pay\/cs_test_/;
export const THANK_YOU = "Thank you — it’s yours.";
export const PENDING = "Payment received — opening now.";
export const OPEN =
  "Everything is open. Download what you need, come back for the rest.";

export type Throwaway = { id: string; email: string; password: string };

/** The Preview facts every payment line needs; fails plainly naming the Preview variable. */
export function requireStripePreview(): PreflightDeployment {
  const d = preflightRecord().deployment;
  if (!d)
    throw new Error(
      "[launch-gate] The preflight record carries no deployment facts — re-run the preflight.",
    );
  if (d.stripeMode !== "test")
    throw new Error(
      "[launch-gate] The target's Stripe key is not in test mode — STRIPE_SECRET_KEY for the Preview must be an sk_test_/rk_test_ key.",
    );
  if (!d.stripePriceConfigured)
    throw new Error(
      "[launch-gate] STRIPE_PRICE_PREMIUM is not set for the Preview environment.",
    );
  if (!d.webhookSecretConfigured)
    throw new Error(
      "[launch-gate] STRIPE_WEBHOOK_SECRET is not set for the Preview environment (the sandbox webhook destination's signing secret).",
    );
  if (!d.privilegedSupabaseRef)
    throw new Error(
      "[launch-gate] SUPABASE_SECRET_KEY is not set for the Preview — the purchase webhook cannot grant access.",
    );
  return d;
}

/** The shared non-owner throwaway (never entitled); created or password-reset per call, registered for cleanup. */
export async function buyerB(
  target: ResolvedTarget,
  createdBy: string,
): Promise<Throwaway> {
  const creds = await ensureTestUser(target, identity("buyer-b"));
  recordFixture({ kind: "test-user", ref: "buyer-b", createdBy });
  return creds;
}

/** Clicks Buy on /premium, waits for Stripe Checkout, records the session and refuses a return address off the target. */
export async function startCheckout(
  page: Page,
  target: ResolvedTarget,
  createdBy: string,
): Promise<string> {
  await page.goto("/premium");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Go all the way.",
  );
  await page.getByRole("button", { name: BUY }).first().click();
  await page.waitForURL(STRIPE_CHECKOUT, { timeout: 30_000 });
  const id = sessionIdFromUrl(page.url());
  if (!id)
    throw new Error(
      "[launch-gate] No test-mode checkout session id in the Stripe URL.",
    );
  recordFixture({ kind: "stripe-session", ref: id, createdBy });
  await assertSessionReturnsToTarget(target, id);
  return id;
}

/** A same-origin request context carrying the page's current session (saved under tests/e2e/.auth, gitignored). */
export async function apiForPage(
  page: Page,
  playwright: PlaywrightWorkerArgs["playwright"],
  target: ResolvedTarget,
  name: string,
): Promise<RoleApi> {
  const file = path.join(AUTH_DIR, `${name}.json`);
  await page.context().storageState({ path: file });
  return apiAs(playwright, target, file);
}

export const WEBHOOK_SETUP_HELP = (origin: string) =>
  `The purchase webhook never reached this Preview in time. Create the Stripe sandbox webhook destination for this Preview (${origin}/api/stripe/webhook, events checkout.session.completed and checkout.session.async_payment_succeeded; on a protected Preview the destination must use Vercel's automation-bypass query parameter or Stripe gets 401) and store its signing secret as STRIPE_WEBHOOK_SECRET on the Preview and E2E_STRIPE_WEBHOOK_SECRET locally (MN-007).`;

/** Polls the TEST entitlements until exactly one active premium row exists for the user. */
export async function expectEntitlement(
  target: ResolvedTarget,
  userId: string,
  timeoutMs: number,
  help: string,
): Promise<void> {
  await expect
    .poll(
      async () =>
        (await entitlementsFor(target, userId)).map((r) => ({
          product: r.product,
          status: r.status,
        })),
      { timeout: timeoutMs, intervals: [2000], message: help },
    )
    .toEqual([{ product: "premium", status: "active" }]);
}
