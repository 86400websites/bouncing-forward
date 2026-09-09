import { test as setup } from "./fixtures";
import { signIn } from "./auth";

/**
 * Role: signed-in account that OWNS the Book Package (TEST project only).
 * Fails closed when E2E_PREMIUM_USER_EMAIL / E2E_PREMIUM_USER_PASSWORD are absent.
 */
setup(
  "auth: sign in the premium (Book Package owner) fixture account",
  async ({ page, target }) => {
    if (!target.fixtures.premium) {
      throw new Error(
        "[launch-gate] E2E_PREMIUM_USER_EMAIL and E2E_PREMIUM_USER_PASSWORD are required for role-based specs. " +
          "Create the fixture account in the TEST Supabase project with an active premium entitlement (see docs/FEATURE-LIST.md).",
      );
    }
    await signIn(page, target.fixtures.premium, "premium");
  },
);
