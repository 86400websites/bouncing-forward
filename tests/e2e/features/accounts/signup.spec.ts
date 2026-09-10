import { test, expect } from "../../harness/fixtures";
import { fillQuietly } from "../../harness/auth";
import { identity, randomPassword } from "../../harness/identities";
import { recordFixture } from "../../harness/run-record";
import { findUserByEmail } from "../../harness/test-supabase";

/**
 * Section B — creating an account (AC-006, AC-001, AC-004), in this order:
 * the validation line proves no account exists for the run's sign-up
 * identity before AC-001 creates it through the real form (TEST project
 * only, registered for cleanup).
 */

const CREATE = "Create my account";
const authError = (page: import("@playwright/test").Page) =>
  page.getByTestId("auth-error");

test(
  "AC-006 an invalid email or a password under 8 characters is refused with an inline message",
  { tag: ["@AC-006", "@accounts", "@desktop-only"] },
  async ({ page, target }) => {
    const email = identity("signup");
    await page.goto("/signup");
    await page.locator("#auth-email").fill("not-an-email");
    await fillQuietly(
      page.locator("#new-password"),
      randomPassword(),
      "password",
    );
    await page.getByRole("button", { name: CREATE, exact: true }).click();
    await expect(authError(page)).toHaveText(
      "That doesn’t look like a valid email address.",
    );
    await expect(page).toHaveURL(/\/signup/);

    await page.goto("/signup");
    await page.locator("#auth-email").fill(email);
    await fillQuietly(
      page.locator("#new-password"),
      randomPassword().slice(0, 7),
      "short password",
    );
    await page.getByRole("button", { name: CREATE, exact: true }).click();
    await expect(authError(page)).toHaveText(
      "Password must be at least 8 characters.",
    );
    await expect(page).toHaveURL(/\/signup/);
    expect(
      await findUserByEmail(target, email),
      "no account may exist for the sign-up identity before AC-001",
    ).toBeNull();
  },
);

test(
  "AC-001 a visitor can create an account with an email and a password of 8+ characters (TEST database only)",
  {
    tag: ["@AC-001", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        'The "not in Production" half is the owner\'s read-only P2 check; the preflight proves both clients are wired to TEST.',
    },
  },
  async ({ page, target }, testInfo) => {
    test.slow();
    const email = identity("signup");
    await page.goto("/signup");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Create your account.",
    );
    await page.locator("#auth-email").fill(email);
    await fillQuietly(
      page.locator("#new-password"),
      randomPassword(),
      "password",
    );
    await page.getByRole("button", { name: CREATE, exact: true }).click();
    recordFixture({ kind: "test-user", ref: "signup", createdBy: "AC-001" });

    const confirmOn = page.getByText(
      "Account created. Please confirm your email from your inbox, then log in.",
    );
    await expect
      .poll(
        async () => {
          if (/\/account(\?|$)/.test(page.url())) return "account";
          if (await confirmOn.isVisible().catch(() => false)) return "confirm";
          return null;
        },
        {
          timeout: 30_000,
          message:
            "Sign-up ended neither on Your account nor on the confirm-your-email message.",
        },
      )
      .not.toBeNull();
    if (/\/account(\?|$)/.test(page.url())) {
      await expect(
        page.getByText("Your account", { exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Welcome back.",
      );
      await expect(page.getByText("Signed in as")).toContainText(email);
      testInfo.annotations.push({
        type: "note",
        description:
          "TEST project has Confirm email OFF: sign-up landed on Your account.",
      });
    } else {
      await expect(confirmOn).toBeVisible();
      await expect(page).toHaveURL(/\/signup/);
      testInfo.annotations.push({
        type: "note",
        description:
          "TEST project has Confirm email ON: sign-up asked for email confirmation (MN-002 covers the email).",
      });
    }
    await expect(authError(page)).toBeHidden();
    expect(
      await findUserByEmail(target, email),
      "the account was not created in the TEST project",
    ).not.toBeNull();
  },
);

test(
  "AC-004 creating an account with an email that already exists sends the person to Log in instead",
  {
    tag: ["@AC-004", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "The Log in page shows no notice explaining the redirect (?exists=1 is ignored). The address-enumeration note is recorded as Low on the list (owner's call).",
    },
  },
  async ({ page, target }) => {
    if (!target.fixtures.free)
      throw new Error(
        "[launch-gate] AC-004 needs E2E_FREE_USER_EMAIL / E2E_FREE_USER_PASSWORD (a confirmed, existing account).",
      );
    const before = await findUserByEmail(target, target.fixtures.free.email);
    await page.goto("/signup");
    await page.locator("#auth-email").fill(target.fixtures.free.email);
    await fillQuietly(
      page.locator("#new-password"),
      randomPassword(),
      "password",
    );
    await page.getByRole("button", { name: CREATE, exact: true }).click();
    await page.waitForURL("**/login?intent=account&exists=1", {
      timeout: 30_000,
    });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Log in.");
    await expect(
      page.getByRole("button", { name: "Log in", exact: true }),
    ).toBeVisible();
    const after = await findUserByEmail(target, target.fixtures.free.email);
    expect(after?.id, "the existing account must not be duplicated").toBe(
      before?.id,
    );
  },
);
