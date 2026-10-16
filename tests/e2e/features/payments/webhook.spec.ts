import { randomBytes, randomUUID } from "node:crypto";
import { test, expect } from "../../harness/fixtures";
import { identity, runId } from "../../harness/identities";
import { memberOf } from "../../harness/mailchimp";
import { recordFixture } from "../../harness/run-record";
import {
  APP_MARKER,
  OTHER_SITE_MARKER,
  checkoutCompletedEvent,
  createTestSession,
  signedWebhookRequest,
} from "../../harness/stripe";
import { entitlementsFor } from "../../harness/test-supabase";
import { buyerB, requireStripePreview } from "./shared";

/**
 * Section D — the payment webhook's refusals (PY-008, PY-012, PY-014).
 * Synthetic events signed with the Preview endpoint's secret; a throwaway
 * non-owner and a never-written identity serve as canaries so any wrongful
 * acceptance shows up as an entitlement or a tag.
 */

const INVALID = { ok: false, message: "Invalid signature." };
const notPremium = async (
  target: Parameters<typeof memberOf>[0],
  email: string,
) => !((await memberOf(target, email))?.tags.includes("premium") ?? false);

test(
  "PY-008 the payment webhook refuses anything that is not genuinely signed by Stripe",
  {
    tag: ["@PY-008", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "Goes beyond the unsigned case (proof P6a): a wrong-secret signature, a stale timestamp (replay) and a tampered body all get the same refusal.",
    },
  },
  async ({ api, target }) => {
    test.setTimeout(60_000);
    requireStripePreview();
    const b = await buyerB(target, "PY-008");
    const canary = identity("buyer-foreign");
    const event = checkoutCompletedEvent({
      object: {
        id: `cs_test_lgforged${runId()}`,
        metadata: {
          app: APP_MARKER,
          supabase_user_id: b.id,
          product: "premium",
        },
        success_url: `${target.origin}/account?checkout=success`,
        customer_details: { email: canary, name: "Launch Gate" },
      },
    });
    const body = JSON.stringify(event);
    const probes: [string, Parameters<typeof api.post>[1]][] = [
      [
        "no signature header",
        { data: body, headers: { "content-type": "application/json" } },
      ],
      [
        "nonsense signature",
        {
          data: body,
          headers: {
            "content-type": "application/json",
            "stripe-signature": `t=${Math.floor(Date.now() / 1000)},v1=deadbeef`,
          },
        },
      ],
      [
        "signed with another secret",
        signedWebhookRequest(target, event, {
          secretOverride: `whsec_launchgate_wrong_${randomBytes(8).toString("hex")}`,
        }),
      ],
      [
        "stale timestamp (replay)",
        signedWebhookRequest(target, event, { timestampOffsetSeconds: -900 }),
      ],
      [
        "tampered body",
        signedWebhookRequest(target, event, { tamperBody: true }),
      ],
    ];
    for (const [label, options] of probes) {
      const res = await api.post("/api/stripe/webhook", options);
      if (res.status() === 503)
        throw new Error(
          "[launch-gate] STRIPE_WEBHOOK_SECRET is not configured on this Preview (the webhook answered 503).",
        );
      expect(res.status(), label).toBe(400);
      expect(await res.json(), label).toEqual(INVALID);
      expect(await res.text(), `${label}: friendly body`).not.toMatch(
        /\bat \S+ \(|node_modules/,
      );
    }
    expect(
      await entitlementsFor(target, b.id),
      "a forged event must grant nothing",
    ).toEqual([]);
    expect(
      await notPremium(target, canary),
      "a forged event must tag nobody",
    ).toBe(true);
  },
);

test(
  "PY-012 events from the other site on the shared Stripe account are ignored safely — no record, no email, and Stripe stops retrying",
  {
    tag: ["@PY-012", "@payments", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "Shaped like the other site's events with neutral values (launch-gate-other-site, example.com). PY-010 additionally proves a real Stripe-delivered foreign purchase leaves the same canary untagged.",
    },
  },
  async ({ api, target }) => {
    test.setTimeout(120_000);
    requireStripePreview();
    const b = await buyerB(target, "PY-012");
    const canary = identity("buyer-foreign");
    const post = (event: object) =>
      api.post("/api/stripe/webhook", signedWebhookRequest(target, event));
    const marker = {
      app: APP_MARKER,
      supabase_user_id: b.id,
      product: "premium",
    };
    const foreign = {
      app: OTHER_SITE_MARKER,
      supabase_user_id: b.id,
      product: "premium",
    };
    const unpaidSession = await createTestSession(target, {
      shape: "legacy-bf",
      origin: target.origin,
      email: canary,
    });
    recordFixture({
      kind: "stripe-session",
      ref: unpaidSession.id,
      createdBy: "PY-012",
    });
    const probes: [string, object, string][] = [
      [
        "subscription mode",
        checkoutCompletedEvent({
          object: {
            id: `cs_test_lgsub${runId()}`,
            mode: "subscription",
            metadata: foreign,
            success_url: "https://example.com/welcome",
            customer_details: { email: canary, name: "Launch Gate" },
          },
        }),
        "mode:subscription",
      ],
      [
        "another site's marker",
        checkoutCompletedEvent({
          object: {
            id: `cs_test_lgapp${runId()}`,
            metadata: foreign,
            customer_details: { email: canary, name: "Launch Gate" },
          },
        }),
        `metadata.app:${OTHER_SITE_MARKER}`,
      ],
      [
        "another site's return address",
        checkoutCompletedEvent({
          object: {
            id: `cs_test_lgret${runId()}`,
            metadata: null,
            success_url: "https://example.com/paid",
            cancel_url: "https://example.com/cancel",
            customer_details: { email: canary, name: "Launch Gate" },
          },
        }),
        "return-url:example.com",
      ],
      [
        "Payment Link with the wrong price",
        checkoutCompletedEvent({
          object: {
            id: unpaidSession.id,
            payment_link: `plink_launchgate_${runId()}`,
            metadata: null,
            success_url: null,
            cancel_url: null,
            customer_details: { email: canary, name: "Launch Gate" },
          },
        }),
        "payment-link-price-mismatch",
      ],
      [
        "ours but unpaid",
        checkoutCompletedEvent({
          object: {
            id: `cs_test_lgunpaid${runId()}`,
            payment_status: "unpaid",
            metadata: marker,
            customer_details: { email: canary, name: "Launch Gate" },
          },
        }),
        "checkout.session.completed",
      ],
      [
        "a failed async payment",
        checkoutCompletedEvent({
          type: "checkout.session.async_payment_failed",
          object: {
            id: `cs_test_lgfail${runId()}`,
            metadata: marker,
            customer_details: { email: canary, name: "Launch Gate" },
          },
        }),
        "checkout.session.async_payment_failed",
      ],
    ];
    for (const [label, event, reason] of probes) {
      const res = await post(event);
      expect(res.status(), label).toBe(200);
      expect(await res.json(), label).toEqual({ ok: true, ignored: reason });
    }
    expect(
      await entitlementsFor(target, b.id),
      "an ignored event must write no record",
    ).toEqual([]);
    expect(
      await notPremium(target, canary),
      "an ignored event must tag nobody",
    ).toBe(true);
  },
);

test(
  "PY-014 if the payment succeeds but saving the access record fails, the webhook reports failure so Stripe retries",
  {
    tag: ["@PY-014", "@payments", "@desktop-only"],
    annotation: {
      type: "manual",
      description:
        "MN-008: the resend half — Stripe → Developers → Webhooks → the sandbox endpoint → the event for a real TEST purchase → Resend; then confirm the TEST entitlement is present and the downloads work.",
    },
  },
  async ({ api, target }) => {
    test.setTimeout(60_000);
    requireStripePreview();
    const ghost = randomUUID();
    expect(await entitlementsFor(target, ghost)).toEqual([]);
    const res = await api.post(
      "/api/stripe/webhook",
      signedWebhookRequest(
        target,
        checkoutCompletedEvent({
          object: {
            id: `cs_test_lgghost${runId()}`,
            metadata: {
              app: APP_MARKER,
              supabase_user_id: ghost,
              product: "premium",
            },
            success_url: `${target.origin}/account?checkout=success`,
          },
        }),
      ),
    );
    expect(
      res.status(),
      "a purchase whose access record cannot be saved must make Stripe retry",
    ).toBe(500);
    expect(await res.json()).toEqual({
      ok: false,
      message: "Entitlement write failed — Stripe will retry.",
    });
    expect(await res.text()).not.toMatch(/violates|23503|foreign key/i);
    expect(
      await entitlementsFor(target, ghost),
      "nothing may be half-written",
    ).toEqual([]);
  },
);
