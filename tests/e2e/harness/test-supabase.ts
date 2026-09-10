import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isFixtureAccount, isTestIdentity, randomPassword } from "./identities";
import { TEST_SUPABASE_REF, type ResolvedTarget } from "./target";

/**
 * Privileged access to the TEST Supabase project only
 * (docs/SUPABASE-MCP-SAFETY.md, docs/ENVIRONMENT-PARITY.md §7.9, §10).
 *
 * Used for throwaway accounts, entitlement read-backs and admin-generated
 * recovery tokens. Every entry point refuses:
 *   - any project but the recorded TEST ref (target.ts already refuses
 *     the PROD ref; this re-checks the host before a key is used);
 *   - the production-morning mode;
 *   - creating, resetting or deleting a FIXTURE account, or any address
 *     that is not a `+bf-e2e-` test identity.
 * Error messages name variables and actions — never an address, password,
 * token or link.
 */

export type TestAdmin = SupabaseClient;

export type FoundUser = { id: string; emailConfirmedAt: string | null };

export type EntitlementRow = {
  user_id: string;
  product: string;
  status: string;
  stripe_customer_id: string | null;
  [column: string]: unknown;
};

const MISSING =
  "[launch-gate] E2E_SUPABASE_URL and E2E_SUPABASE_SECRET_KEY are required for TEST-project throwaway accounts and record checks. " +
  "Store the TEST project's URL and secret key under those names (never the Production project).";

export function testAdmin(target: ResolvedTarget): TestAdmin {
  if (target.mode === "production-morning") {
    throw new Error(
      "[launch-gate] The privileged TEST client is never used in production-morning mode.",
    );
  }
  if (!target.testSupabase) throw new Error(MISSING);
  let host = "";
  try {
    host = new URL(target.testSupabase.url).hostname;
  } catch {
    throw new Error("[launch-gate] E2E_SUPABASE_URL is not a valid URL.");
  }
  if (host !== `${TEST_SUPABASE_REF}.supabase.co`) {
    throw new Error(
      `[launch-gate] E2E_SUPABASE_URL host "${host}" is not the recorded TEST project (${TEST_SUPABASE_REF}). Refusing.`,
    );
  }
  return createClient(target.testSupabase.url, target.testSupabase.secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function assertThrowaway(email: string, action: string): void {
  if (isFixtureAccount(email)) {
    throw new Error(
      `[launch-gate] Refusing to ${action} a fixture account (E2E_FREE_USER_EMAIL / E2E_PREMIUM_USER_EMAIL). Throwaway users come from identities.ts.`,
    );
  }
  if (!isTestIdentity(email)) {
    throw new Error(
      `[launch-gate] Refusing to ${action} an address that is not a bf-e2e test identity (address withheld).`,
    );
  }
}

/** Pages through the TEST project's users; null when the address is unknown. */
export async function findUserByEmail(
  target: ResolvedTarget,
  email: string,
): Promise<FoundUser | null> {
  const admin = testAdmin(target);
  const wanted = email.trim().toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) {
      throw new Error(
        `[launch-gate] Could not list TEST users (check E2E_SUPABASE_SECRET_KEY): ${error.message}`,
      );
    }
    const hit = data.users.find(
      (u) => (u.email ?? "").toLowerCase() === wanted,
    );
    if (hit) {
      return { id: hit.id, emailConfirmedAt: hit.email_confirmed_at ?? null };
    }
    if (data.users.length < 1000) break;
  }
  return null;
}

/** Creates an email-confirmed throwaway user; fails if the address exists. */
export async function createConfirmedUser(
  target: ResolvedTarget,
  email: string,
  password: string,
): Promise<{ id: string }> {
  assertThrowaway(email, "create");
  const admin = testAdmin(target);
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(
      `[launch-gate] Could not create the throwaway TEST user (values withheld): ${error?.message ?? "no user returned"}`,
    );
  }
  return { id: data.user.id };
}

/**
 * Idempotent variant: an existing user gets THIS password and a confirmed
 * email so the caller can sign in either way; `created` says which.
 */
export async function findOrCreateConfirmedUser(
  target: ResolvedTarget,
  email: string,
  password: string,
): Promise<{ id: string; created: boolean }> {
  assertThrowaway(email, "create or reset");
  const existing = await findUserByEmail(target, email);
  if (!existing) {
    const { id } = await createConfirmedUser(target, email, password);
    return { id, created: true };
  }
  const admin = testAdmin(target);
  const { error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (error) {
    throw new Error(
      `[launch-gate] Could not reset the throwaway TEST user (values withheld): ${error.message}`,
    );
  }
  return { id: existing.id, created: false };
}

/**
 * A throwaway account any test can sign in as, without module state or
 * on-disk passwords: created when absent, otherwise its password is reset
 * to a fresh randomPassword(). Never a fixture account.
 */
export async function ensureTestUser(
  target: ResolvedTarget,
  email: string,
): Promise<{ id: string; email: string; password: string }> {
  const password = randomPassword();
  const { id } = await findOrCreateConfirmedUser(target, email, password);
  return { id, email, password };
}

export async function confirmUserEmail(
  target: ResolvedTarget,
  userId: string,
): Promise<void> {
  const admin = testAdmin(target);
  const { error } = await admin.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });
  if (error) {
    throw new Error(
      `[launch-gate] Could not confirm the throwaway TEST user's email: ${error.message}`,
    );
  }
}

/** Deletes a throwaway user (entitlements cascade). `deleted: false` when unknown. */
export async function deleteUserByEmail(
  target: ResolvedTarget,
  email: string,
): Promise<{ deleted: boolean }> {
  assertThrowaway(email, "delete");
  const found = await findUserByEmail(target, email);
  if (!found) return { deleted: false };
  const admin = testAdmin(target);
  const { error } = await admin.auth.admin.deleteUser(found.id);
  if (error) {
    throw new Error(
      `[launch-gate] Could not delete the throwaway TEST user: ${error.message}`,
    );
  }
  return { deleted: true };
}

/** Every entitlements row for the user (admin read; RLS does not apply). */
export async function entitlementsFor(
  target: ResolvedTarget,
  userId: string,
): Promise<EntitlementRow[]> {
  const admin = testAdmin(target);
  const { data, error } = await admin
    .from("entitlements")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    throw new Error(
      `[launch-gate] Could not read entitlements from the TEST project: ${error.message}`,
    );
  }
  return (data ?? []) as EntitlementRow[];
}

/** Safety net for tests that must leave no entitlement behind. */
export async function deleteEntitlementsFor(
  target: ResolvedTarget,
  userId: string,
): Promise<{ removed: number }> {
  const admin = testAdmin(target);
  const { data, error } = await admin
    .from("entitlements")
    .delete()
    .eq("user_id", userId)
    .select("user_id");
  if (error) {
    throw new Error(
      `[launch-gate] Could not remove entitlements in the TEST project: ${error.message}`,
    );
  }
  return { removed: (data ?? []).length };
}

/**
 * The `token_hash` of a fresh password-recovery link for a throwaway
 * user, generated through the admin API so no email has to be received.
 * Only the hashed token is returned; the link, the OTP and any error
 * detail that could carry them are withheld.
 */
export async function generateRecoveryTokenHash(
  target: ResolvedTarget,
  email: string,
): Promise<string> {
  assertThrowaway(email, "generate a recovery link for");
  const admin = testAdmin(target);
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });
  const hashed = data?.properties?.hashed_token;
  if (error || !hashed) {
    throw new Error(
      `[launch-gate] generateLink failed for the reset identity (link and token withheld): ${error?.message ?? "no token returned"}`,
    );
  }
  return hashed;
}

/**
 * Same-origin path that redeems a recovery token on the target:
 * `/auth/confirm?token_hash=…&type=recovery&next=/reset-password`.
 * Use with page.goto()/api.get(); never put the returned path in a
 * message, title or annotation.
 */
export function recoveryConfirmPath(
  tokenHash: string,
  next = "/reset-password",
): string {
  return `/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}&type=recovery&next=${encodeURIComponent(next)}`;
}
