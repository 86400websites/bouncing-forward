import path from "node:path";
import { expect, type Locator, type Page } from "@playwright/test";
import type { Credentials } from "./target";

/**
 * Signs a fixture account in through the real login form and saves the
 * browser session for reuse by role-based specs. Runs only against TEST
 * data (docs/SUPABASE-MCP-SAFETY.md, ENVIRONMENT-PARITY.md §7.9).
 *
 * Credentials are typed through a wrapper that never lets the value reach
 * an error message: Playwright's own action log would otherwise print the
 * typed text when a field is not editable in time.
 */

export const AUTH_DIR = path.join(process.cwd(), "tests", "e2e", ".auth");

export function statePath(role: "free" | "premium" | "morning"): string {
  return path.join(AUTH_DIR, `${role}.json`);
}

async function fillQuietly(field: Locator, value: string, label: string) {
  try {
    await field.fill(value);
  } catch {
    throw new Error(
      `[launch-gate] Could not enter the ${label} on the login form (field not editable in time). Value withheld.`,
    );
  }
}

export async function signIn(
  page: Page,
  creds: Credentials,
  role: "free" | "premium" | "morning",
): Promise<void> {
  await page.goto("/login");
  await fillQuietly(page.locator("#auth-email"), creds.email, "email address");
  await fillQuietly(
    page.locator("#current-password"),
    creds.password,
    "password",
  );
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await page.waitForURL("**/account", { timeout: 30_000 });
  await expect(page.getByText("Signed in as")).toBeVisible();

  // Fail closed if the account is not the role it claims to be.
  if (role === "premium") {
    await expect(
      page.getByRole("heading", { name: "The Book Package" }),
    ).toBeVisible();
  } else {
    await expect(
      page.getByRole("heading", { name: "No Book Package yet" }),
    ).toBeVisible();
  }

  await page.context().storageState({ path: statePath(role) });
}
