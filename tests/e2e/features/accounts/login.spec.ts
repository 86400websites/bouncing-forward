import { test, expect } from "../../harness/fixtures";
import { expectVisitorRedirectedToLogin } from "../../harness/pages";
import { fillQuietly, statePath, submitLogin } from "../../harness/auth";
import { randomPassword } from "../../harness/identities";
import { openAs } from "../../harness/roles";

/** Section B — logging in and the account boundary (AC-002, AC-005, AC-007, AC-010). */

const noSupabaseCookie = async (
  context: import("@playwright/test").BrowserContext,
  origin: string,
) => (await context.cookies(origin)).every((c) => !c.name.startsWith("sb-"));

test(
  "AC-002 an account holder can log in and log out",
  { tag: ["@AC-002", "@accounts", "@desktop-only"] },
  async ({ page, context, target }) => {
    test.slow();
    if (!target.fixtures.free)
      throw new Error(
        "[launch-gate] AC-002 needs E2E_FREE_USER_EMAIL / E2E_FREE_USER_PASSWORD.",
      );
    await submitLogin(page, target.fixtures.free);
    await page.waitForURL("**/account", { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Welcome back.",
    );
    await expect(page.getByText("Signed in as")).toContainText(
      target.fixtures.free.email,
    );
    await expect(
      page.getByRole("heading", { level: 2, name: "No Book Package yet" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("**/login", { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Log in.");
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login(\?|$)/);
    await expect(page.getByText("Signed in as")).toHaveCount(0);
    expect(
      await noSupabaseCookie(context, target.origin),
      "a session cookie survived Log out",
    ).toBe(true);
  },
);

test(
  "AC-005 a wrong password is refused with a clear message and no session",
  {
    tag: ["@AC-005", "@accounts"],
    annotation: {
      type: "note",
      description:
        'The message is Supabase\'s own wording ("Invalid login credentials"), passed through by the login action — not site copy.',
    },
  },
  async ({ page, context, target }) => {
    if (!target.fixtures.free)
      throw new Error(
        "[launch-gate] AC-005 needs E2E_FREE_USER_EMAIL / E2E_FREE_USER_PASSWORD.",
      );
    await page.goto("/login");
    await page.locator("#auth-email").fill(target.fixtures.free.email);
    await fillQuietly(
      page.locator("#current-password"),
      randomPassword(),
      "wrong password",
    );
    await page.getByRole("button", { name: "Log in", exact: true }).click();
    await expect(page.getByTestId("auth-error")).toHaveText(
      /Invalid login credentials/,
      { timeout: 15_000 },
    );
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole("button", { name: "Log in", exact: true }),
    ).toBeEnabled();
    expect(
      await noSupabaseCookie(context, target.origin),
      "a wrong password must not create a session",
    ).toBe(true);
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login(\?|$)/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Log in.");
    await expect(page.getByText("Signed in as")).toHaveCount(0);
  },
);

test.describe("signed in as the free fixture", () => {
  test.use({ storageState: statePath("free") });
  test(
    "AC-007 a signed-in session survives page reloads and navigation across the site",
    { tag: ["@AC-007", "@accounts"] },
    async ({ page, target, consoleErrors }) => {
      if (!target.fixtures.free)
        throw new Error(
          "[launch-gate] AC-007 needs E2E_FREE_USER_EMAIL / E2E_FREE_USER_PASSWORD.",
        );
      const email = target.fixtures.free.email;
      await page.goto("/account");
      await expect(page.getByText("Signed in as")).toContainText(email);
      await page.reload();
      await expect(page.getByText("Signed in as")).toContainText(email);
      await page.goto("/book");
      if ((page.viewportSize()?.width ?? 1280) >= 1024) {
        await expect(
          page
            .getByRole("navigation", { name: "Main" })
            .getByRole("link", { name: "Account", exact: true }),
        ).toBeVisible({ timeout: 10_000 });
      }
      await page.goto("/premium");
      await expect(page).toHaveURL(/\/premium$/);
      await page.goto("/account");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Welcome back.",
      );
      await expect(page.getByText("Signed in as")).toContainText(email);
      expect(consoleErrors).toEqual([]);
    },
  );
});

test(
  "AC-010 a visitor cannot open Your account by typing the URL",
  { tag: ["@AC-010", "@accounts"] },
  async ({ page, api, browser, target }) => {
    await expectVisitorRedirectedToLogin(api, "/account");
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login(\?|$)/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Log in.");
    await expect(page.getByText("Signed in as")).toHaveCount(0);
    await expect(page.getByText("Welcome back.")).toHaveCount(0);
    // Allowed half of the same boundary.
    if (!target.fixtures.free)
      throw new Error(
        "[launch-gate] AC-010 needs E2E_FREE_USER_EMAIL / E2E_FREE_USER_PASSWORD for the allowed half.",
      );
    const ctx = await openAs(browser, target, "free");
    try {
      const member = await ctx.newPage();
      await member.goto("/account");
      await expect(member.getByText("Signed in as")).toContainText(
        target.fixtures.free.email,
      );
    } finally {
      await ctx.close();
    }
  },
);
