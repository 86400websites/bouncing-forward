import { test as setup } from "./fixtures";
import { signIn } from "./auth";

/**
 * Role: signed-in account WITHOUT the Book Package (TEST project only).
 * Fails closed when E2E_FREE_USER_EMAIL / E2E_FREE_USER_PASSWORD are absent.
 */
setup(
  "auth: sign in the free (no Book Package) fixture account",
  async ({ page, target }) => {
    if (!target.fixtures.free) {
      throw new Error(
        "[launch-gate] E2E_FREE_USER_EMAIL and E2E_FREE_USER_PASSWORD are required for role-based specs. " +
          "Create the fixture account in the TEST Supabase project (see docs/FEATURE-LIST.md) and store the values only in the secret store.",
      );
    }
    await signIn(page, target.fixtures.free, "free");
  },
);
