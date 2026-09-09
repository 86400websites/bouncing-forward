import { test, expect } from "../harness/fixtures";

/**
 * P6 (reachability half) — docs/ENVIRONMENT-PARITY.md §12.
 *
 * Sends ONE unsigned, empty request to the payment webhook through the
 * sanctioned Preview bypass. The handler must refuse it. This proves the
 * route is reachable on this deployment (and, on a Preview, that the
 * signing secret is configured) without creating or changing anything.
 * The business effect of a real payment is proven separately (P5).
 */
test("@proof P6a the payment webhook is reachable and refuses an unsigned request", async ({
  api,
  target,
}) => {
  const res = await api.post("/api/stripe/webhook", {
    data: "{}",
    headers: { "content-type": "application/json" },
  });
  const body = (await res.json().catch(() => ({}))) as { ok?: boolean };

  // 400 = handler reached, signature rejected. 503 = handler reached but
  // this deployment has no STRIPE_WEBHOOK_SECRET yet.
  expect([400, 503], `Unexpected status ${res.status()}`).toContain(
    res.status(),
  );
  expect(body.ok).toBe(false);
  if (target.mode === "preview") {
    expect(
      res.status(),
      "The Preview has no STRIPE_WEBHOOK_SECRET — payment proofs cannot run until it is set for the Preview environment.",
    ).toBe(400);
  }
});
