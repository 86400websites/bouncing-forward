import { test, expect } from "../../harness/fixtures";
import { identity } from "../../harness/identities";
import { expectTagged, memberOf } from "../../harness/mailchimp";
import { expectPdf } from "../../harness/pages";
import { recordFixture, requireDeploymentFact } from "../../harness/run-record";
import {
  TEST_CARDS,
  createTestSession,
  payOnStripeCheckout,
  retrieveSession,
} from "../../harness/stripe";
import { OPEN, requireStripePreview } from "./shared";

/**
 * Section D — the old Payment-Link return (PY-010): /premium?session_id=…
 * hands out the shared access code only for a session Stripe confirms as
 * paid AND as a Bouncing Forward purchase. Two labelled $9.99 test-mode
 * sessions are created by the harness and paid with the test card: one in
 * the legacy Bouncing Forward shape (return address on this Preview) and one
 * shaped like another site's (return address on example.com, answered inside
 * the browser and never contacted).
 */

const REFUSED = "We couldn’t confirm that payment.";

test(
  "PY-010 the old Payment-Link return only hands out the shared access code for a session Stripe confirms as paid and as a Bouncing Forward purchase",
  {
    tag: ["@PY-010", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "FIXED IN CANDIDATE (origin check added). The access code rides in the download URL by design of the legacy flow — it is followed, never printed. The legacy purchase's webhook tags the typed address premium (SHARED audience, registered for archiving); the foreign purchase's webhook must tag nothing.",
    },
  },
  async ({ page, api, target }) => {
    test.setTimeout(240_000);
    requireStripePreview();
    requireDeploymentFact("accessCodesConfigured", "PREMIUM_ACCESS_CODES");
    const legacyBuyer = identity("buyer-legacy");
    const foreignBuyer = identity("buyer-foreign");
    await memberOf(target, legacyBuyer); // fails naming the Mailchimp variables before any write

    // A) Refusals without a payment.
    const malformed = await api.get(
      "/api/stripe/verify?session_id=not-a-session",
    );
    expect(malformed.status()).toBe(400);
    expect(await malformed.json()).toEqual({
      ok: false,
      message: "Invalid session reference.",
    });
    const madeUp = await api.get(
      "/api/stripe/verify?session_id=cs_test_launchgatemadeup000",
    );
    expect(madeUp.status()).toBe(400);
    expect(await madeUp.json()).toEqual({ ok: false, message: REFUSED });
    const legacy = await createTestSession(target, {
      shape: "legacy-bf",
      origin: target.origin,
      email: legacyBuyer,
    });
    recordFixture({
      kind: "stripe-session",
      ref: legacy.id,
      createdBy: "PY-010",
    });
    recordFixture({
      kind: "mailchimp-member",
      ref: "buyer-legacy",
      createdBy: "PY-010",
    });
    recordFixture({
      kind: "mailchimp-member",
      ref: "buyer-foreign",
      createdBy: "PY-010",
    });
    const unpaid = await api.get(`/api/stripe/verify?session_id=${legacy.id}`);
    expect(unpaid.status()).toBe(200);
    const unpaidBody = (await unpaid.json()) as Record<string, unknown>;
    expect(unpaidBody).toMatchObject({
      ok: false,
      pending: true,
      message:
        "The payment is still processing — your access code will arrive by email as soon as it completes.",
    });
    expect(unpaidBody).not.toHaveProperty("code");

    // B) A paid session from another site's flow is refused.
    const foreign = await createTestSession(target, {
      shape: "foreign",
      origin: target.origin,
      email: foreignBuyer,
    });
    recordFixture({
      kind: "stripe-session",
      ref: foreign.id,
      createdBy: "PY-010",
    });
    await page.route("https://example.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<p>paid</p>",
      }),
    );
    await page.goto(foreign.url);
    await payOnStripeCheckout(page, {
      card: TEST_CARDS.success,
      name: "Launch Gate Foreign",
    });
    await page.waitForURL(/^https:\/\/example\.com\/paid\?session_id=/, {
      timeout: 30_000,
    });
    expect(
      (await retrieveSession(target, foreign.id)).payment_status,
      "the foreign session must be genuinely paid so the refusal is the classification",
    ).toBe("paid");
    const foreignVerify = await api.get(
      `/api/stripe/verify?session_id=${foreign.id}`,
    );
    expect(foreignVerify.status()).toBe(400);
    expect(await foreignVerify.json()).toEqual({ ok: false, message: REFUSED });
    await page.goto(`/premium?session_id=${foreign.id}`);
    await expect(page.getByText(REFUSED)).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: "Everything in Premium" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: OPEN })).toHaveCount(0);
    await expect(page).toHaveURL(`${target.origin}/premium`);
    await page.unroute("https://example.com/**");

    // C) A paid legacy Bouncing Forward session opens the library.
    await page.goto(legacy.url);
    await payOnStripeCheckout(page, {
      card: TEST_CARDS.success,
      name: "Launch Gate Legacy",
    });
    await page.waitForURL(`${target.origin}/premium**`, { timeout: 30_000 });
    await expect(page.getByRole("heading", { name: OPEN })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page).toHaveURL(`${target.origin}/premium`);
    for (const [name, file] of [
      ["The complete book", "book"],
      ["The companion workbook", "workbook"],
    ] as const) {
      const href = await page.getByRole("link", { name }).getAttribute("href");
      expect(
        href?.startsWith(`/api/premium/download?file=${file}&code=`),
        `${name}: the library link must carry the code (value withheld)`,
      ).toBe(true);
      await expectPdf(api, href as string, {
        label: `${name} via the legacy code`,
        attachment: true,
      });
    }
    const verified = await api.get(
      `/api/stripe/verify?session_id=${legacy.id}`,
    );
    expect(verified.status()).toBe(200);
    const verifiedBody = (await verified.json()) as {
      ok?: boolean;
      code?: unknown;
    };
    expect(verifiedBody.ok).toBe(true);
    expect(typeof verifiedBody.code).toBe("string");

    // D) The webhook side of both real payments.
    await expectTagged(target, legacyBuyer, "premium", 60_000);
    await page.waitForTimeout(10_000);
    const foreignMember = await memberOf(target, foreignBuyer);
    expect(
      foreignMember?.tags.includes("premium") ?? false,
      "the real foreign purchase must not tag its buyer premium",
    ).toBe(false);
  },
);
