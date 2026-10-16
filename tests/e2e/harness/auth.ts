import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  expect,
  type BrowserContext,
  type Locator,
  type Page,
} from "@playwright/test";
import type { Credentials } from "./target";

/**
 * Signs a fixture account in through the real login form and saves the
 * browser session for reuse by role-based specs. Runs only against TEST
 * data (docs/SUPABASE-MCP-SAFETY.md, ENVIRONMENT-PARITY.md §7.9).
 *
 * Credentials are typed through a wrapper that never lets the value reach
 * an error message: Playwright's own action log would otherwise print the
 * typed text when a field is not editable in time.
 *
 *   submitLogin  fill + submit only (no waiting, no state file)
 *   loginAs      submitLogin + wait for /account + role check (no state file)
 *   signIn       loginAs + save tests/e2e/.auth/<role>.json (setup projects only)
 */

export const AUTH_DIR = path.join(process.cwd(), "tests", "e2e", ".auth");

export type Role = "free" | "premium";

export function statePath(role: Role | "morning"): string {
  return path.join(AUTH_DIR, `${role}.json`);
}

/** Fills a field; on failure throws a plain message that withholds the value. */
export async function fillQuietly(
  field: Locator,
  value: string,
  label: string,
): Promise<void> {
  try {
    await field.fill(value);
  } catch {
    throw new Error(
      `[launch-gate] Could not enter the ${label} (field not editable in time). Value withheld.`,
    );
  }
}

/**
 * Opens /login (or /login?intent=premium), types the credentials and
 * presses the submit button. Returns right after the click so the caller
 * decides what the outcome should be. Writes no state file.
 */
export async function submitLogin(
  page: Page,
  creds: Credentials,
  options?: { intent?: "premium" },
): Promise<void> {
  const premium = options?.intent === "premium";
  await page.goto(premium ? "/login?intent=premium" : "/login");
  await fillQuietly(page.locator("#auth-email"), creds.email, "email address");
  await fillQuietly(
    page.locator("#current-password"),
    creds.password,
    "password",
  );
  await page
    .getByRole("button", {
      name: premium ? "Log in & continue to payment" : "Log in",
      exact: true,
    })
    .click();
}

/**
 * The quiet /login flow ending on /account with the role's heading
 * visible ("The Book Package" for premium, "No Book Package yet" for
 * free). Fails closed if the account is not the role it claims to be.
 * Writes no state file, so a spec can sign a throwaway in mid-test.
 */
export async function loginAs(
  page: Page,
  creds: Credentials,
  expectRole: Role,
): Promise<void> {
  await submitLogin(page, creds);
  await page.waitForURL("**/account", { timeout: 30_000 });
  await expect(page.getByText("Signed in as")).toBeVisible();
  if (expectRole === "premium") {
    await expect(
      page.getByRole("heading", { name: "The Book Package" }),
    ).toBeVisible();
  } else {
    await expect(
      page.getByRole("heading", { name: "No Book Package yet" }),
    ).toBeVisible();
  }
}

export async function signIn(
  page: Page,
  creds: Credentials,
  role: Role | "morning",
): Promise<void> {
  await loginAs(page, creds, role === "premium" ? "premium" : "free");
  await page.context().storageState({ path: statePath(role) });
}

export type StoredCookie = Parameters<BrowserContext["addCookies"]>[0][number];

/**
 * Only the Supabase session cookies (`sb-*`) from the saved role state —
 * for signing a visitor context in mid-test with context.addCookies()
 * without discarding its deployment-protection bypass cookie. Throws a
 * plain error naming the setup variables when the state file is missing.
 */
export function sessionCookies(role: Role): StoredCookie[] {
  const file = statePath(role);
  if (!existsSync(file)) {
    const pair =
      role === "premium"
        ? "E2E_PREMIUM_USER_EMAIL / E2E_PREMIUM_USER_PASSWORD"
        : "E2E_FREE_USER_EMAIL / E2E_FREE_USER_PASSWORD";
    throw new Error(
      `[launch-gate] No saved session for the ${role} fixture — run the auth-${role} setup project (needs ${pair}).`,
    );
  }
  const state = JSON.parse(readFileSync(file, "utf8")) as {
    cookies?: StoredCookie[];
  };
  return (state.cookies ?? []).filter((c) => c.name.startsWith("sb-"));
}
