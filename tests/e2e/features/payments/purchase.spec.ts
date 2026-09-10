import { test, expect } from "../../harness/fixtures";
import { loginAs } from "../../harness/auth";
import { identity, runId } from "../../harness/identities";
import { expectTagged, memberOf } from "../../harness/mailchimp";
import { expectDownloadDenied, expectPdf } from "../../harness/pages";
import { apiAs } from "../../harness/roles";
import { recordFixture } from "../../harness/run-record";
import {
  APP_MARKER,
  TEST_CARDS,
  checkoutCompletedEvent,
  payOnStripeCheckout,
  retrieveSession,
  signedWebhookRequest,
  stripeTest,
} from "../../harness/stripe";
import {
  ensureTestUser,
  entitlementsFor,
  findUserByEmail,
} from "../../harness/test-supabase";
import {
  BOOK,
  BUY,
  OPEN,
  PENDING,
  STRIPE_CHECKOUT,
  THANK_YOU,
  WEBHOOK_SETUP_HELP,
  WORKBOOK,
  apiForPage,
  buyerB,
  expectEntitlement,
  requireStripePreview,
  startCheckout,
  type Throwaway,
} from "./shared";

/**
 * Section D — the real purchase and everything that depends on it
 * (PY-001, FM-010, PY-003, PY-015, PY-005, PY-013), in one serial block:
 * a fresh throwaway buyer pays $9.99 with the test card on this run's
 * Preview; the later lines read that buyer's entitlement and session.
 * FM-010 lives here because the premium tag is applied by PY-001's webhook.
 */

test.describe.configure({ mode: "serial" });

let buyer: Throwaway | null = null;
let buyerSession = "";
const started = Math.floor(Date.now() / 1000);

test(
  "PY-001 a signed-in account holder can buy the Book Package for $9.99 with the test card",
  {
    tag: ["@PY-001", "@payments", "@desktop-only"],
    annotation: {
      type: "manual",
      description:
        "No matching Production record — owner read-only check with supabase-prod-readonly for the buyer identity (MN-007).",
    },
  },
  async ({ page, playwright, target }, testInfo) => {
    test.setTimeout(180_000);
    requireStripePreview();
    buyer = await ensureTestUser(target, identity("buyer"));
    recordFixture({ kind: "test-user", ref: "buyer", createdBy: "PY-001" });
    recordFixture({
      kind: "mailchimp-member",
      ref: "buyer",
      createdBy: "PY-001",
    });
    await loginAs(page, buyer, "free");
    const asBuyer = await apiForPage(page, playwright, target, "buyer");
    try {
      await expectDownloadDenied(asBuyer, BOOK, "book before paying");
      buyerSession = await startCheckout(page, target, "PY-001");
      const session = await retrieveSession(target, buyerSession);
      expect(session.livemode).toBe(false);
      expect(session.mode).toBe("payment");
      expect(session.metadata?.app).toBe(APP_MARKER);
      expect(session.metadata?.supabase_user_id).toBe(buyer.id);
      expect(session.client_reference_id).toBe(buyer.id);
      await payOnStripeCheckout(page, {
        card: TEST_CARDS.success,
        name: "Launch Gate Buyer",
      });
      await page.waitForURL("**/account?checkout=success", { timeout: 60_000 });
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        THANK_YOU,
      );
      const pending = await page
        .getByRole("heading", { name: PENDING })
        .isVisible()
        .catch(() => false);
      testInfo.annotations.push({
        type: "note",
        description: pending
          ? 'First landing showed "Payment received — opening now." (the webhook was still landing).'
          : "First landing already showed the Book Package.",
      });
      await expectEntitlement(
        target,
        buyer.id,
        90_000,
        WEBHOOK_SETUP_HELP(target.origin),
      );
      await page.reload();
      await expect(
        page.getByRole("heading", { name: "The Book Package" }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "The complete book" }),
      ).toHaveAttribute("href", BOOK);
      await expect(
        page.getByRole("link", { name: "The companion workbook" }),
      ).toHaveAttribute("href", WORKBOOK);
      const book = await expectPdf(asBuyer, BOOK, { attachment: true });
      expect(book.filename).toBe("Bouncing-Forward-Book.pdf");
      await expectPdf(asBuyer, WORKBOOK, { attachment: true });
    } finally {
      await asBuyer.dispose();
    }
  },
);

test(
  "FM-010 a Book Package purchase tags the buyer premium in the audience",
  {
    tag: ["@FM-010", "@forms", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "SHARED audience: read-back only of the member PY-001's webhook created (registered for archiving by PY-001). The access-email journey is MN-004.",
    },
  },
  async ({ target }) => {
    if (!buyer)
      throw new Error(
        "[launch-gate] FM-010 needs PY-001's buyer (the purchase did not complete).",
      );
    const member = await expectTagged(target, buyer.email, "premium", 60_000);
    expect(member.status).toBe("subscribed");
    expect(member.tags).not.toContain("newsletter");
    expect(member.tags).not.toContain("full-assessment");
  },
);

test(
  "PY-003 paying unlocks exactly what it should — and nothing before payment",
  {
    tag: ["@PY-003", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "The pre-payment state cannot be held open on a real purchase (the sandbox webhook lands within seconds), so it is proven with a signed-in non-owner on the same return address — exactly the buyer's state until the webhook writes the row.",
    },
  },
  async ({ page, playwright, target, api }) => {
    test.setTimeout(120_000);
    if (!buyer)
      throw new Error(
        "[launch-gate] PY-003 needs PY-001's buyer (the purchase did not complete).",
      );
    const b = await buyerB(target, "PY-003");
    await page.context().clearCookies();
    await loginAs(page, b, "free");
    await page.goto("/account?checkout=success");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(THANK_YOU);
    await expect(page.getByRole("heading", { name: PENDING })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Refresh this page" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The Book Package" }),
    ).toHaveCount(0);
    const asB = await apiForPage(page, playwright, target, "buyer-b");
    try {
      await expectDownloadDenied(asB, BOOK, "book before payment");
      await expectDownloadDenied(asB, WORKBOOK, "workbook before payment");
    } finally {
      await asB.dispose();
    }
    expect(await entitlementsFor(target, b.id)).toEqual([]);
    expect((await api.get(BOOK)).status(), "a visitor's download").toBe(401);

    await page.context().clearCookies();
    await loginAs(page, buyer, "premium");
    const asBuyer = await apiForPage(page, playwright, target, "buyer");
    try {
      await expectPdf(asBuyer, BOOK, { attachment: true });
      await expectPdf(asBuyer, WORKBOOK, { attachment: true });
    } finally {
      await asBuyer.dispose();
    }
    await page.goto("/premium");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "It’s all yours.",
    );
    await expect(page.getByRole("heading", { name: OPEN })).toBeVisible();
    await expect(
      page.getByText(
        "Tied to your account — log in on any device and it’s all here.",
      ),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => window.localStorage.getItem("bf-allin-open")),
      )
      .toBe("1");
  },
);

test(
  "PY-015 another person's payment reference cannot give me access",
  {
    tag: ["@PY-015", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        'The approved line expects "No Book Package yet" at /account?checkout=success; the component shows "Payment received — opening now." whenever that parameter is present (nothing is granted). "No Book Package yet" is asserted on the plain /account. The legacy shared-code note is observed and annotated, not asserted.',
    },
  },
  async ({ page, playwright, target, api }, testInfo) => {
    test.setTimeout(90_000);
    if (!buyer || !buyerSession)
      throw new Error(
        "[launch-gate] PY-015 needs PY-001's buyer and session (the purchase did not complete).",
      );
    const b = await buyerB(target, "PY-015");
    await page.context().clearCookies();
    await loginAs(page, b, "free");
    for (const path of [
      "/account?checkout=success",
      `/account?checkout=success&session_id=${buyerSession}`,
    ]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: PENDING })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "The Book Package" }),
      ).toHaveCount(0);
    }
    const asB = await apiForPage(page, playwright, target, "buyer-b");
    try {
      await expectDownloadDenied(asB, BOOK, "book as user B");
      await expectDownloadDenied(asB, WORKBOOK, "workbook as user B");
    } finally {
      await asB.dispose();
    }
    expect(await entitlementsFor(target, b.id)).toEqual([]);
    expect(
      (await entitlementsFor(target, buyer.id)).map((r) => r.status),
    ).toEqual(["active"]);
    await page.goto("/account");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Welcome back.",
    );
    await expect(
      page.getByRole("heading", { name: "No Book Package yet" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "See the Book Package →" }),
    ).toBeVisible();
    const verify = await api.get(
      `/api/stripe/verify?session_id=${buyerSession}`,
    );
    const body = (await verify.json().catch(() => ({}))) as { ok?: boolean };
    testInfo.annotations.push({
      type: "note",
      description: `Legacy verify route for a paid Bouncing Forward session id held by anyone: HTTP ${verify.status()} ok=${String(body.ok)} (Should-fix by design of the shared-code flow; value never printed).`,
    });
  },
);

test(
  "PY-005 double-clicking Buy creates one checkout, an owner cannot buy twice, and a duplicate webhook delivery does not create two records",
  {
    tag: ["@PY-005", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "Known limit: two separate tabs (or the page's three independent Buy buttons) opened before paying could each reach Stripe — documented, not prevented. The duplicate delivery is a signed re-send of the real session's event with no email, so the shared audience is not written again.",
    },
  },
  async ({ page, playwright, target, api }) => {
    test.setTimeout(120_000);
    if (!buyer || !buyerSession)
      throw new Error(
        "[launch-gate] PY-005 needs PY-001's buyer and session (the purchase did not complete).",
      );
    if (!target.fixtures.premium)
      throw new Error(
        "[launch-gate] PY-005 needs E2E_PREMIUM_USER_EMAIL / E2E_PREMIUM_USER_PASSWORD.",
      );
    const b = await buyerB(target, "PY-005");
    await page.context().clearCookies();
    await loginAs(page, b, "free");
    await page.goto("/premium");
    const posts: string[] = [];
    page.on("request", (r) => {
      if (
        r.method() === "POST" &&
        new URL(r.url()).pathname === "/api/checkout"
      )
        posts.push(r.url());
    });
    const buy = page.getByRole("button", { name: BUY }).first();
    await buy.dblclick();
    await expect(
      page.getByRole("button", { name: "One moment…" }).first(),
    ).toBeDisabled();
    await page.waitForURL(STRIPE_CHECKOUT, { timeout: 30_000 });
    expect(posts, "a double click must start one checkout").toHaveLength(1);
    const abandoned = page.url().match(/(cs_test_[A-Za-z0-9]+)/)?.[1];
    if (abandoned)
      recordFixture({
        kind: "stripe-session",
        ref: abandoned,
        createdBy: "PY-005",
      });

    const owner = await apiAs(playwright, target, "premium");
    try {
      const res = await owner.post("/api/checkout", {
        data: { product: "premium" },
        headers: { origin: target.origin },
      });
      expect(res.status()).toBe(200);
      expect(((await res.json()) as { url?: string }).url).toBe(
        `${target.origin}/account`,
      );
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
      "an owner's Buy must not create a checkout session",
    ).toBe(false);

    const event = checkoutCompletedEvent({
      id: `evt_launchgate_dup_${runId()}`,
      object: {
        id: buyerSession,
        metadata: {
          app: APP_MARKER,
          supabase_user_id: buyer.id,
          product: "premium",
        },
        success_url: `${target.origin}/account?checkout=success`,
      },
    });
    for (let i = 0; i < 2; i++) {
      const res = await api.post(
        "/api/stripe/webhook",
        signedWebhookRequest(target, event),
      );
      expect(res.status(), `delivery ${i + 1}`).toBe(200);
      expect(await res.json()).toEqual({
        ok: true,
        note: "No email on session.",
      });
    }
    expect(
      (await entitlementsFor(target, buyer.id)).map((r) => r.status),
    ).toEqual(["active"]);
  },
);

test(
  "PY-013 genuine Bouncing Forward purchases are still honoured, including older shapes; an event from the wrong Stripe mode is not acted on",
  {
    tag: ["@PY-013", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        'The approved line says a wrong-mode event is "ignored"; the handler deliberately answers 500 so Stripe retries a misconfigured deployment — asserted as the code behaves. The premium tag for the marker and legacy-return shapes is proven by the real purchases (FM-010, PY-010); only the Payment-Link shape writes its own identity to the shared audience.',
    },
  },
  async ({ target, api }) => {
    test.setTimeout(120_000);
    if (!buyer || !buyerSession)
      throw new Error(
        "[launch-gate] PY-013 needs PY-001's session (the purchase did not complete).",
      );
    const u1 = await ensureTestUser(target, identity("buyer-marker"));
    recordFixture({
      kind: "test-user",
      ref: "buyer-marker",
      createdBy: "PY-013",
    });
    const u2 = await ensureTestUser(target, identity("buyer-nomarker"));
    recordFixture({
      kind: "test-user",
      ref: "buyer-nomarker",
      createdBy: "PY-013",
    });
    const post = (event: object) =>
      api.post("/api/stripe/webhook", signedWebhookRequest(target, event));

    const wrongMode = await post(
      checkoutCompletedEvent({
        livemode: true,
        object: {
          id: `cs_test_lgmode${runId()}`,
          livemode: true,
          metadata: {
            app: APP_MARKER,
            supabase_user_id: u1.id,
            product: "premium",
          },
        },
      }),
    );
    expect(wrongMode.status()).toBe(500);
    expect(await wrongMode.json()).toEqual({
      ok: false,
      message: "Payment mode mismatch — Stripe will retry.",
    });
    expect(await entitlementsFor(target, u1.id)).toEqual([]);

    const marker = await post(
      checkoutCompletedEvent({
        object: {
          id: `cs_test_lgmarker${runId()}`,
          metadata: {
            app: APP_MARKER,
            supabase_user_id: u1.id,
            product: "premium",
          },
          success_url: `${target.origin}/account?checkout=success`,
        },
      }),
    );
    expect(marker.status()).toBe(200);
    expect(await marker.json()).toEqual({
      ok: true,
      note: "No email on session.",
    });
    await expectEntitlement(
      target,
      u1.id,
      10_000,
      "the marker-shaped purchase was not honoured",
    );

    const legacy = await post(
      checkoutCompletedEvent({
        object: {
          id: `cs_test_lglegacy${runId()}`,
          metadata: { supabase_user_id: u2.id, product: "premium" },
          success_url: `${target.origin}/account?checkout=success`,
          cancel_url: `${target.origin}/premium?checkout=cancelled`,
        },
      }),
    );
    expect(legacy.status()).toBe(200);
    expect(await legacy.json()).toEqual({
      ok: true,
      note: "No email on session.",
    });
    await expectEntitlement(
      target,
      u2.id,
      10_000,
      "the older account-flow shape (no marker, our return address) was not honoured",
    );

    const linkBuyer = identity("buyer-paymentlink");
    recordFixture({
      kind: "mailchimp-member",
      ref: "buyer-paymentlink",
      createdBy: "PY-013",
    });
    const paymentLink = await post(
      checkoutCompletedEvent({
        object: {
          id: buyerSession,
          payment_link: `plink_launchgate_${runId()}`,
          metadata: null,
          success_url: null,
          cancel_url: null,
          customer_details: { email: linkBuyer, name: "Launch Gate" },
        },
      }),
    );
    expect(
      paymentLink.status(),
      "a Payment-Link purchase recognised by the Book Package price",
    ).toBe(200);
    expect(await paymentLink.json()).toEqual({ ok: true });
    await expectTagged(target, linkBuyer, "premium", 30_000);
    expect((await entitlementsFor(target, u1.id)).length).toBe(1);
    expect((await entitlementsFor(target, u2.id)).length).toBe(1);
    expect(
      await memberOf(target, identity("buyer-foreign")).then(
        (m) => m?.tags.includes("premium") ?? false,
      ),
    ).toBe(false);
  },
);
