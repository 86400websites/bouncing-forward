import { randomBytes } from "node:crypto";
import { test, expect } from "../../harness/fixtures";
import { fillQuietly, submitLogin } from "../../harness/auth";
import { identity, randomPassword } from "../../harness/identities";
import { recordFixture } from "../../harness/run-record";
import { resolveTarget } from "../../harness/target";
import {
  findOrCreateConfirmedUser,
  generateRecoveryTokenHash,
  recoveryConfirmPath,
} from "../../harness/test-supabase";

/**
 * Section B — password reset (AC-003a, c, d, e, f, g). AC-003b (the email
 * arrives) is MANUAL — see manual/. Recovery links are generated through
 * the TEST admin API on THIS origin, so no email has to be received; the
 * emailed link's host is MN-002's evidence. Tests run in file order and
 * share one throwaway "reset" account created before the first test.
 */

const NOTICE =
  "Your reset link has expired or is invalid. Please request a new one.";
const NEUTRAL =
  "If an account exists for that email, a reset link is on its way. Check your inbox.";
let resetEmail = "";
let currentPassword = "";

test.beforeAll(async () => {
  const target = resolveTarget(process.env);
  resetEmail = identity("reset");
  currentPassword = randomPassword();
  await findOrCreateConfirmedUser(target, resetEmail, currentPassword);
  recordFixture({ kind: "test-user", ref: "reset", createdBy: "AC-003" });
});

async function requestReset(
  page: import("@playwright/test").Page,
  email: string,
): Promise<string> {
  await page.goto("/forgot-password");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Reset your password.",
  );
  await fillQuietly(page.locator("#fp-email"), email, "email address");
  await page
    .getByRole("button", { name: "Send reset link", exact: true })
    .click();
  const message = page.getByText(NEUTRAL);
  await expect(message).toBeVisible({ timeout: 15_000 });
  await expect(
    page.getByRole("button", { name: "Send reset link", exact: true }),
  ).toHaveCount(0);
  return (await message.textContent())?.trim() ?? "";
}

async function expectRefused(
  page: import("@playwright/test").Page,
  target: { origin: string },
) {
  await expect(page).toHaveURL(`${target.origin}/forgot-password?error=link`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Reset your password.",
  );
  await expect(page.getByRole("alert")).toHaveText(NOTICE);
  await expect(page.locator("#fp-email")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send reset link", exact: true }),
  ).toBeVisible();
}

test(
  "AC-003a requesting a password reset shows the neutral message whether or not the address is registered",
  {
    tag: ["@AC-003a", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "The known-address pass sends the real reset email to the free fixture's plus-address on the owner's mailbox — the capture for MN-002.",
    },
  },
  async ({ page, target }) => {
    if (!target.fixtures.free)
      throw new Error("[launch-gate] AC-003a needs E2E_FREE_USER_EMAIL.");
    const known = await requestReset(page, target.fixtures.free.email);
    const unknown = await requestReset(page, identity("unknown"));
    expect(known).toBe(NEUTRAL);
    expect(unknown).toBe(NEUTRAL);
  },
);

test(
  "AC-003c the reset link returns to the environment that sent it and opens Choose a new password",
  {
    tag: ["@AC-003c", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "The link is built by the harness on this origin through the TEST admin API (no email); the host of the emailed link is MN-002's evidence.",
    },
  },
  async ({ page, target, consoleErrors }) => {
    const tokenHash = await generateRecoveryTokenHash(target, resetEmail);
    await page.goto(recoveryConfirmPath(tokenHash));
    expect(
      new URL(page.url()).host,
      "the reset link left the target environment",
    ).toBe(target.host);
    await expect(page).toHaveURL(/\/reset-password/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Choose a new password.",
    );
    await expect(page.locator("#new-password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Set new password", exact: true }),
    ).toBeVisible();
    expect(consoleErrors).toEqual([]);
  },
);

test(
  "AC-003d a new 8+ character password saves, shows password updated, and logging in with it works",
  {
    tag: ["@AC-003d", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        'The page renders " · password updated" appended to "Signed in as …".',
    },
  },
  async ({ page, target }) => {
    test.slow();
    const tokenHash = await generateRecoveryTokenHash(target, resetEmail);
    await page.goto(recoveryConfirmPath(tokenHash));
    await expect(page).toHaveURL(/\/reset-password/);
    const newPassword = randomPassword();
    await fillQuietly(
      page.locator("#new-password"),
      newPassword,
      "new password",
    );
    await page
      .getByRole("button", { name: "Set new password", exact: true })
      .click();
    await page.waitForURL("**/account?password=updated", { timeout: 30_000 });
    currentPassword = newPassword;
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Welcome back.",
    );
    await expect(page.getByText("Signed in as")).toContainText(resetEmail);
    await expect(page.getByText("password updated")).toBeVisible();
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("**/login", { timeout: 30_000 });
    await submitLogin(page, { email: resetEmail, password: newPassword });
    await page.waitForURL("**/account", { timeout: 30_000 });
    await expect(page.getByText("Signed in as")).toContainText(resetEmail);
  },
);

test(
  "AC-003e an invalid reset link is refused with a clear notice, not a blank page",
  {
    tag: ["@AC-003e", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "FIXED IN CANDIDATE — previously landed on Log in with no message.",
    },
  },
  async ({ page, api, target }) => {
    const fake = randomBytes(32).toString("hex"); // plausible shape, never issued
    const path = recoveryConfirmPath(fake);
    const res = await api.get(path);
    expect(res.status()).toBeGreaterThanOrEqual(300);
    expect(res.status()).toBeLessThan(400);
    const location = new URL(
      res.headers()["location"] ?? "",
      `${target.origin}/`,
    );
    expect(location.origin).toBe(target.origin);
    expect(location.pathname + location.search).toBe(
      "/forgot-password?error=link",
    );
    await page.goto(path);
    await expectRefused(page, target);
  },
);

test(
  "AC-003f an expired reset link is refused the same way",
  {
    tag: ["@AC-003f", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "A truly time-expired token cannot be produced on demand (the TEST project's link lifetime is minutes to an hour). A superseded token — a newer link was issued for the same account — is the closest robot equivalent and takes the same refusal path. Owner to confirm the line wording, or set a short OTP expiry on TEST for a timed variant.",
    },
  },
  async ({ page, target }) => {
    const older = await generateRecoveryTokenHash(target, resetEmail);
    const newer = await generateRecoveryTokenHash(target, resetEmail);
    await page.goto(recoveryConfirmPath(older));
    await expectRefused(page, target);
    await page.goto(recoveryConfirmPath(newer));
    await expect(page).toHaveURL(/\/reset-password/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Choose a new password.",
    );
  },
);

test(
  "AC-003g a reset link that was already used cannot be used again",
  { tag: ["@AC-003g", "@accounts", "@desktop-only"] },
  async ({ page, context, target }) => {
    test.slow();
    const path = recoveryConfirmPath(
      await generateRecoveryTokenHash(target, resetEmail),
    );
    await page.goto(path);
    await expect(page).toHaveURL(/\/reset-password/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Choose a new password.",
    );
    await context.clearCookies();
    await page.goto(path);
    await expectRefused(page, target);
    expect(
      (await context.cookies(target.origin)).some((c) =>
        c.name.startsWith("sb-"),
      ),
      "the second visit must not create a session",
    ).toBe(false);
    await submitLogin(page, { email: resetEmail, password: currentPassword });
    await page.waitForURL("**/account", { timeout: 30_000 });
    await expect(page.getByText("Signed in as")).toContainText(resetEmail);
  },
);
