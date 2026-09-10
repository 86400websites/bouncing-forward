import { test, expect } from "../../harness/fixtures";
import {
  fillQuietly,
  loginAs,
  statePath,
  submitLogin,
} from "../../harness/auth";
import { identity, randomPassword } from "../../harness/identities";
import { expectDownloadDenied, settle } from "../../harness/pages";
import { apiAs } from "../../harness/roles";
import { recordFixture } from "../../harness/run-record";
import {
  APP_MARKER,
  TEST_CARDS,
  leaveStripeCheckout,
  listTestWebhookEndpoints,
  payOnStripeCheckout,
  retrieveSession,
  sessionIdFromUrl,
  stripeTest,
  assertSessionReturnsToTarget,
} from "../../harness/stripe";
import { PRODUCTION_HOSTS } from "../../harness/target";
import {
  confirmUserEmail,
  entitlementsFor,
  findUserByEmail,
} from "../../harness/test-supabase";
import {
  BOOK,
  BUY,
  OPEN,
  STRIPE_CHECKOUT,
  WORKBOOK,
  apiForPage,
  buyerB,
  requireStripePreview,
  startCheckout,
} from "./shared";

/** Section D — checkout paths that never complete a payment (PY-002, PY-004, PY-006, PY-007, PY-011). Stripe TEST mode only. */

const started = Math.floor(Date.now() / 1000);

test(
  "PY-002 a declined test card shows an honest failure, not a fake success",
  {
    tag: ["@PY-002", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "Stripe's decline notice is third-party copy; the Premium page shows no error state after a decline — the person simply stays on Stripe.",
    },
  },
  async ({ page, playwright, target }) => {
    test.setTimeout(120_000);
    requireStripePreview();
    const b = await buyerB(target, "PY-002");
    await loginAs(page, b, "free");
    const id = await startCheckout(page, target, "PY-002");
    await payOnStripeCheckout(page, {
      card: TEST_CARDS.declined,
      name: "Launch Gate Declined",
      expect: "decline",
    });
    await expect(page).toHaveURL(/checkout\.stripe\.com/);
    await page.goto("/account");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Welcome back.",
    );
    await expect(
      page.getByRole("heading", { name: "No Book Package yet" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The Book Package" }),
    ).toHaveCount(0);
    const asB = await apiForPage(page, playwright, target, "buyer-b");
    try {
      await expectDownloadDenied(asB, BOOK, "book after a decline");
      await expectDownloadDenied(asB, WORKBOOK, "workbook after a decline");
    } finally {
      await asB.dispose();
    }
    expect(await entitlementsFor(target, b.id)).toEqual([]);
    const session = await retrieveSession(target, id);
    expect(session.payment_status).toBe("unpaid");
    expect(session.status).toBe("open");
  },
);

test(
  "PY-004 backing out of Stripe returns to Premium with nothing granted",
  {
    tag: ["@PY-004", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "The Premium page renders no cancellation notice — only the URL carries ?checkout=cancelled.",
    },
  },
  async ({ page, playwright, target }, testInfo) => {
    test.setTimeout(120_000);
    requireStripePreview();
    const b = await buyerB(target, "PY-004");
    await loginAs(page, b, "free");
    const id = await startCheckout(page, target, "PY-004");
    const { viaStripeControl } = await leaveStripeCheckout(page, target);
    if (!viaStripeControl)
      testInfo.annotations.push({
        type: "note",
        description:
          "Stripe's back control was not rendered; navigated to the session's cancel address instead.",
      });
    await expect(page).toHaveURL(`${target.origin}/premium?checkout=cancelled`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Go all the way.",
    );
    await expect(page.getByRole("button", { name: BUY }).first()).toBeVisible();
    expect(await entitlementsFor(target, b.id)).toEqual([]);
    const asB = await apiForPage(page, playwright, target, "buyer-b");
    try {
      await expectDownloadDenied(asB, BOOK, "book after cancelling");
    } finally {
      await asB.dispose();
    }
    expect((await retrieveSession(target, id)).payment_status).toBe("unpaid");
  },
);

test(
  "PY-006 a visitor who clicks Buy is taken to Create account and straight into Stripe; a returning visitor can Log in & continue to payment",
  {
    tag: ["@PY-006", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "The test never pays. If the TEST project has Confirm email ON, the sign-up half fails with a plain message naming the setting (PY-006 as approved requires the browser to reach Stripe straight after sign-up).",
    },
  },
  async ({ page, api, target }) => {
    test.setTimeout(150_000);
    requireStripePreview();
    const email = identity("buyer-visitor");
    const password = randomPassword();
    recordFixture({
      kind: "test-user",
      ref: "buyer-visitor",
      createdBy: "PY-006",
    });
    const denied = await api.post("/api/checkout", {
      data: { product: "premium" },
    });
    expect(denied.status()).toBe(401);
    expect(await denied.json()).toEqual({ error: "Not signed in." });

    await page.goto("/premium");
    await page.getByRole("button", { name: BUY }).first().click();
    await page.waitForURL("**/signup?intent=premium", { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Create your account.",
    );
    await expect(
      page.getByRole("button", {
        name: "Create account & continue to payment",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create my account", exact: true }),
    ).toHaveCount(0);
    await fillQuietly(page.locator("#auth-email"), email, "email address");
    await fillQuietly(page.locator("#new-password"), password, "password");
    await page
      .getByRole("button", {
        name: "Create account & continue to payment",
        exact: true,
      })
      .click();
    const confirmOn = page.getByText(
      "Account created. Please confirm your email from your inbox, then log in.",
    );
    await expect
      .poll(
        async () =>
          STRIPE_CHECKOUT.test(page.url())
            ? "stripe"
            : (await confirmOn.isVisible().catch(() => false))
              ? "confirm"
              : null,
        {
          timeout: 45_000,
          message:
            "Sign-up with intent=premium reached neither Stripe Checkout nor the confirm-your-email message.",
        },
      )
      .not.toBeNull();
    if (!STRIPE_CHECKOUT.test(page.url())) {
      throw new Error(
        '[launch-gate] The TEST project has "Confirm email" ON — a new buyer is told to confirm first and is not taken straight into Stripe as PY-006 requires (owner decision: switch it off for TEST, or amend the line).',
      );
    }
    const first = sessionIdFromUrl(page.url());
    expect(first).toBeTruthy();
    recordFixture({
      kind: "stripe-session",
      ref: first as string,
      createdBy: "PY-006",
    });
    await assertSessionReturnsToTarget(target, first as string);
    const user = await findUserByEmail(target, email);
    expect(
      user,
      "the sign-up did not create the buyer in the TEST project",
    ).not.toBeNull();
    const session = await retrieveSession(target, first as string);
    expect(session.metadata?.supabase_user_id).toBe(user?.id);
    expect(session.metadata?.app).toBe(APP_MARKER);
    expect(
      session.customer_email === email,
      "the checkout was not prefilled with the buyer's address (value withheld)",
    ).toBe(true);

    await page.context().clearCookies();
    if (user && !user.emailConfirmedAt) await confirmUserEmail(target, user.id);
    await page.goto("/login?intent=premium");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Log in.");
    await expect(
      page.getByRole("button", {
        name: "Log in & continue to payment",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Log in", exact: true }),
    ).toHaveCount(0);
    await submitLogin(page, { email, password }, { intent: "premium" });
    await page.waitForURL(STRIPE_CHECKOUT, { timeout: 45_000 });
    const second = sessionIdFromUrl(page.url());
    expect(second).toBeTruthy();
    recordFixture({
      kind: "stripe-session",
      ref: second as string,
      createdBy: "PY-006",
    });
    expect(
      (await retrieveSession(target, second as string)).metadata
        ?.supabase_user_id,
    ).toBe(user?.id);
  },
);

test.describe("a Book Package owner", () => {
  test.use({ storageState: statePath("premium") });
  test(
    "PY-007 an owner who clicks Buy is sent to their account instead of Stripe",
    { tag: ["@PY-007", "@payments", "@desktop-only"] },
    async ({ page, playwright, target, consoleErrors }) => {
      test.setTimeout(60_000);
      if (!target.fixtures.premium)
        throw new Error(
          "[launch-gate] PY-007 needs E2E_PREMIUM_USER_EMAIL / E2E_PREMIUM_USER_PASSWORD.",
        );
      const posts: string[] = [];
      page.on("request", (r) => {
        if (
          r.method() === "POST" &&
          new URL(r.url()).pathname === "/api/checkout"
        )
          posts.push(r.url());
      });
      await page.goto("/premium");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "It’s all yours.",
      );
      await expect(page.getByText("Premium — yours for life")).toBeVisible();
      await expect(page.getByRole("heading", { name: OPEN })).toBeVisible();
      await expect(page.getByRole("button", { name: BUY })).toHaveCount(0);
      await page
        .getByRole("button", { name: "It’s yours — open your account →" })
        .first()
        .click();
      await page.waitForURL("**/account", { timeout: 30_000 });
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Welcome back.",
      );
      await expect(
        page.getByRole("heading", { name: "The Book Package" }),
      ).toBeVisible();
      expect(
        posts,
        "the owner's button must not call the checkout API",
      ).toEqual([]);
      const owner = await apiAs(playwright, target, "premium");
      try {
        const res = await owner.post("/api/checkout", {
          data: { product: "premium" },
          headers: { origin: target.origin },
        });
        expect(res.status()).toBe(200);
        const url = ((await res.json()) as { url?: string }).url ?? "";
        expect(url).toBe(`${target.origin}/account`);
        expect(url).not.toContain("checkout.stripe.com");
      } finally {
        await owner.dispose();
      }
      const premiumUser = await findUserByEmail(
        target,
        target.fixtures.premium.email,
      );
      const recent = await stripeTest(target).checkout.sessions.list({
        created: { gte: started },
        limit: 100,
      });
      expect(
        recent.data.some((s) => s.client_reference_id === premiumUser?.id),
        "no checkout session may be created for an owner",
      ).toBe(false);
      await settle(page);
      expect(consoleErrors).toEqual([]);
    },
  );
});

test(
  "PY-011 the Preview's Stripe keys, price and webhook are test-mode and belong to the candidate deployment",
  {
    tag: ["@PY-011", "@payments", "@desktop-only"],
    annotation: {
      type: "manual",
      description:
        "MN-007: dashboard confirmation of the sandbox endpoint and its signing secret.",
    },
  },
  async ({ page, target }, testInfo) => {
    test.setTimeout(120_000);
    requireStripePreview();
    const b = await buyerB(target, "PY-011");
    await loginAs(page, b, "free");
    const id = await startCheckout(page, target, "PY-011");
    await expect(page.getByText(/test mode|sandbox/i).first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("$9.99").first()).toBeVisible();
    const s = await retrieveSession(target, id, { expandLineItems: true });
    expect(s.livemode).toBe(false);
    expect(s.mode).toBe("payment");
    expect(s.amount_total).toBe(999);
    expect(s.currency).toBe("usd");
    expect(s.line_items?.data.length).toBe(1);
    expect(s.line_items?.data[0].price?.type).toBe("one_time");
    expect(s.line_items?.data[0].price?.unit_amount).toBe(999);
    expect(s.metadata?.app).toBe(APP_MARKER);
    expect(new URL(s.success_url ?? "").origin).toBe(target.origin);
    expect(new URL(s.success_url ?? "").pathname).toBe("/account");
    expect(s.cancel_url).toBe(`${target.origin}/premium?checkout=cancelled`);
    const endpoints = await listTestWebhookEndpoints(target);
    const ours = endpoints.filter(
      (e) =>
        e.origin === target.origin &&
        e.pathname === "/api/stripe/webhook" &&
        e.status === "enabled",
    );
    expect(
      ours.length,
      `Expected exactly one enabled test-mode webhook destination at ${target.origin}/api/stripe/webhook (found ${ours.length}) — create it in Stripe (Test mode) → Developers → Webhooks (MN-007).`,
    ).toBe(1);
    const events = ours[0].enabled_events;
    expect(
      events.includes("checkout.session.completed") || events.includes("*"),
      "the destination must listen for checkout.session.completed",
    ).toBe(true);
    testInfo.annotations.push({
      type: "note",
      description: `async_payment_succeeded ${events.includes("checkout.session.async_payment_succeeded") || events.includes("*") ? "is" : "is NOT"} enabled on the sandbox destination.`,
    });
    const onProduction = endpoints.filter((e) => {
      try {
        return PRODUCTION_HOSTS.includes(new URL(e.origin).hostname);
      } catch {
        return false;
      }
    });
    expect(
      onProduction,
      "a TEST-mode webhook endpoint must never point at a Production host",
    ).toEqual([]);
  },
);
