import { test, expect } from "../../harness/fixtures";
import { fillQuietly } from "../../harness/auth";
import { identity, randomPassword } from "../../harness/identities";
import { apiAs } from "../../harness/roles";
import { preflightRecord, recordFixture } from "../../harness/run-record";
import {
  expireSession,
  sessionIdFromUrl,
  stripeTest,
} from "../../harness/stripe";
import { resolveTarget } from "../../harness/target";
import {
  createConfirmedUser,
  findUserByEmail,
  generateRecoveryTokenHash,
  recoveryConfirmPath,
} from "../../harness/test-supabase";

/**
 * Section B — origin safety of email links and Stripe return addresses
 * (AC-016, AC-017). Direct HTTP through the api fixture; token URLs are
 * never logged. Shares the throwaway "reset" identity with the reset spec.
 */

let resetEmail = "";
test.beforeAll(async () => {
  const target = resolveTarget(process.env);
  resetEmail = identity("reset");
  if (!(await findUserByEmail(target, resetEmail))) {
    await createConfirmedUser(target, resetEmail, randomPassword());
  }
  recordFixture({ kind: "test-user", ref: "reset", createdBy: "AC-016" });
});

test(
  "AC-016 the email links cannot be abused to send someone to another website",
  {
    tag: ["@AC-016", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "FIXED IN CANDIDATE — the old check accepted //evil.example.",
    },
  },
  async ({ page, api, target }) => {
    const ours = (location: string) => {
      const url = new URL(location, `${target.origin}/`);
      expect(url.hostname, "a return path left the site").not.toContain(
        "evil.example",
      );
      expect(url.origin, "a return path left the target origin").toBe(
        target.origin,
      );
      return url;
    };
    for (const next of [
      "//evil.example",
      "/\evil.example",
      "https://evil.example",
      "\t//evil.example",
    ]) {
      const res = await api.get(
        `/auth/confirm?next=${encodeURIComponent(next)}`,
      );
      expect(res.status(), `tampered next: status`).toBeGreaterThanOrEqual(300);
      expect(res.status()).toBeLessThan(400);
      const url = ours(res.headers()["location"] ?? "");
      expect(url.pathname + url.search).toBe(
        "/login?error=confirmation_failed",
      );
    }
    const abused = await api.get(
      `${recoveryConfirmPath(await generateRecoveryTokenHash(target, resetEmail), "//evil.example")}`,
    );
    expect(abused.status()).toBeGreaterThanOrEqual(300);
    expect(abused.status()).toBeLessThan(400);
    expect(ours(abused.headers()["location"] ?? "").pathname).toBe("/account");
    const control = await api.get(
      recoveryConfirmPath(await generateRecoveryTokenHash(target, resetEmail)),
    );
    expect(ours(control.headers()["location"] ?? "").pathname).toBe(
      "/reset-password",
    );
    await page.goto("/auth/confirm?next=//evil.example");
    expect(new URL(page.url()).host).toBe(target.host);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Log in.");
  },
);

test(
  "AC-017 auth emails and Stripe return links use this deployment's own address only when the request came to one of ours; any other host name is ignored",
  {
    tag: ["@AC-017", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "FIXED IN CANDIDATE. A forged Host header cannot reach the app on Vercel (the edge routes by Host) and x-forwarded-host may be normalised; the assertion is that no returned link ever carries the forged name. The emailed reset link's host is MN-002's evidence.",
    },
  },
  async ({ page, playwright, target }, testInfo) => {
    test.slow();
    if (!target.fixtures.free || !target.fixtures.premium)
      throw new Error(
        "[launch-gate] AC-017 needs both fixture accounts (E2E_FREE_USER_* and E2E_PREMIUM_USER_*).",
      );
    if (!target.testStripe.secretKey)
      throw new Error(
        "[launch-gate] AC-017 needs E2E_STRIPE_SECRET_KEY (test mode) to inspect the checkout session's return addresses.",
      );
    const siteUrl = preflightRecord().deployment?.siteUrl ?? null;
    const allowedHosts = new Set([
      target.host,
      "bouncing-forward.vercel.app",
      "www.bouncing-forward.com",
      "bouncing-forward.com",
    ]);
    if (siteUrl) {
      try {
        allowedHosts.add(new URL(siteUrl).hostname);
      } catch {
        /* recorded as-is */
      }
    }
    const hostOf = (url: string | null | undefined) =>
      url ? new URL(url).hostname : "";

    // Part A — the checkout return address for an owner (no session is created).
    const owner = await apiAs(playwright, target, "premium");
    try {
      const genuine = await owner.post("/api/checkout", {
        data: { product: "premium" },
        headers: { origin: target.origin },
      });
      expect(genuine.status()).toBe(200);
      expect(((await genuine.json()) as { url?: string }).url).toBe(
        `${target.origin}/account`,
      );
      const forged: Record<string, string | undefined> = {
        forged: "https://evil.example",
        lookalike: "https://www.bouncing-forward.com.evil.example",
        absent: undefined,
      };
      for (const [label, origin] of Object.entries(forged)) {
        const res = await owner.post("/api/checkout", {
          data: { product: "premium" },
          headers: origin ? { origin } : {},
        });
        expect(res.status(), label).toBe(200);
        const url = new URL(((await res.json()) as { url: string }).url);
        expect(url.hostname, `${label}: return host`).not.toContain(
          "evil.example",
        );
        expect(
          allowedHosts.has(url.hostname),
          `${label}: return host ${url.hostname} is not one of ours`,
        ).toBe(true);
        expect(url.pathname).toBe("/account");
        testInfo.annotations.push({
          type: "note",
          description: `${label} Origin → return host ${url.hostname}`,
        });
      }
    } finally {
      await owner.dispose();
    }

    // Part B — the server-action path (feeds auth emails and the post-login checkout).
    await page.route(`${target.origin}/login**`, async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        await route.continue({
          headers: { ...request.headers(), "x-forwarded-host": "evil.example" },
        });
      } else {
        await route.continue();
      }
    });
    await page.route("https://checkout.stripe.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<title>blocked by the launch gate</title>",
      }),
    );
    await page.goto("/login?intent=premium");
    await page.locator("#auth-email").fill(target.fixtures.free.email);
    await fillQuietly(
      page.locator("#current-password"),
      target.fixtures.free.password,
      "password",
    );
    await page
      .getByRole("button", {
        name: "Log in & continue to payment",
        exact: true,
      })
      .click();
    await page.waitForURL(/checkout\.stripe\.com\/c\/pay\/cs_test_/, {
      timeout: 30_000,
    });
    const id = sessionIdFromUrl(page.url());
    expect(
      id,
      "no test-mode checkout session id in the Stripe URL",
    ).toBeTruthy();
    recordFixture({
      kind: "stripe-session",
      ref: id as string,
      createdBy: "AC-017",
    });
    const session = await stripeTest(target).checkout.sessions.retrieve(
      id as string,
    );
    for (const [name, url] of [
      ["success_url", session.success_url],
      ["cancel_url", session.cancel_url],
    ] as const) {
      expect(hostOf(url), `${name} carries the forged host`).not.toContain(
        "evil.example",
      );
      expect(
        allowedHosts.has(hostOf(url)),
        `${name} host ${hostOf(url)} is not one of ours`,
      ).toBe(true);
    }
    expect(session.metadata?.app).toBe("bouncing-forward");
    await expireSession(target, id as string);
  },
);
