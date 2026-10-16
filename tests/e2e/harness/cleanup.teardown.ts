import { existsSync, unlinkSync } from "node:fs";
import { test as teardown, expect } from "@playwright/test";
import {
  identity,
  isFixtureAccount,
  maskEmail,
  parseIdentityRef,
  runId,
} from "./identities";
import { archiveMember } from "./mailchimp";
import {
  FIXTURES_FILE,
  readFixtures,
  writeFixtures,
  writeRunRecord,
  type FixtureEntry,
} from "./run-record";
import { expireSession } from "./stripe";
import { resolveTarget, type ResolvedTarget } from "./target";
import { deleteUserByEmail } from "./test-supabase";

/**
 * Cleanup — the teardown of the `preflight` project, so it runs after
 * every project that depends on the preflight has finished, whether the
 * specs passed or not (docs/ENVIRONMENT-PARITY.md §10 "Fixture writes use
 * TEST only, with cleanup and a run record").
 *
 * Reads qa-evidence/fixtures.json (absent = nothing to do) and, per entry:
 *   test-user          deletes the throwaway TEST user (entitlements cascade)
 *   mailchimp-member   archives the test identity in the shared audience
 *   stripe-session     expires the test session if it is still open
 *   contact-message    nothing to automate — recorded for MN-003
 * The fixture accounts (E2E_FREE_USER_EMAIL / E2E_PREMIUM_USER_EMAIL) are
 * never touched even if listed. A missing optional variable is recorded as
 * "not cleaned: <variable> absent", never thrown. E2E_KEEP_TEST_USERS=1
 * keeps the throwaway users for manual evidence (MN-004 / MN-008); run
 * `pnpm exec playwright test --project=cleanup` afterwards to remove them.
 *
 * Writes qa-evidence/run-record.json (kinds, sanitised refs, counts —
 * never a value). Entries that could not be cleaned stay in fixtures.json
 * for the next cleanup; an API error fails this teardown so residual data
 * is never silent.
 */

type Row = {
  kind: FixtureEntry["kind"];
  ref: string;
  createdBy: string[];
  count: number;
  run: string;
  cleaned: boolean;
  reason: string;
};

function sanitisedRef(entry: FixtureEntry): string {
  switch (entry.kind) {
    case "test-user":
    case "mailchimp-member":
      return parseIdentityRef(entry.ref) ? entry.ref : maskEmail(entry.ref);
    case "stripe-session":
      return `cs_test_…${entry.ref.slice(-4)}`;
    case "contact-message":
      return entry.ref;
  }
}

function resolveAddress(
  entry: FixtureEntry,
): { email: string } | { missing: string } {
  const spec = parseIdentityRef(entry.ref);
  if (!spec) return { email: entry.ref };
  try {
    return {
      email: identity(spec.kind, {
        label: spec.label,
        runId: entry.recordedRun,
      }),
    };
  } catch {
    return { missing: "E2E_OWNER_MAILBOX" };
  }
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function cleanOne(
  target: ResolvedTarget,
  entry: FixtureEntry,
  keepUsers: boolean,
): Promise<{ cleaned: boolean; reason: string }> {
  switch (entry.kind) {
    case "test-user": {
      if (keepUsers)
        return { cleaned: false, reason: "kept (E2E_KEEP_TEST_USERS=1)" };
      const address = resolveAddress(entry);
      if ("missing" in address) {
        return {
          cleaned: false,
          reason: `not cleaned: ${address.missing} absent`,
        };
      }
      if (isFixtureAccount(address.email)) {
        return { cleaned: false, reason: "fixture account — never touched" };
      }
      if (!target.testSupabase) {
        return {
          cleaned: false,
          reason:
            "not cleaned: E2E_SUPABASE_URL / E2E_SUPABASE_SECRET_KEY absent",
        };
      }
      try {
        const { deleted } = await deleteUserByEmail(target, address.email);
        return deleted
          ? { cleaned: true, reason: "deleted (entitlements cascade)" }
          : { cleaned: true, reason: "no such user (nothing to delete)" };
      } catch (err) {
        return { cleaned: false, reason: `error: ${errorText(err)}` };
      }
    }
    case "mailchimp-member": {
      const address = resolveAddress(entry);
      if ("missing" in address) {
        return {
          cleaned: false,
          reason: `not cleaned: ${address.missing} absent`,
        };
      }
      if (isFixtureAccount(address.email)) {
        return { cleaned: false, reason: "fixture account — never touched" };
      }
      if (!target.mailchimp) {
        return {
          cleaned: false,
          reason:
            "not cleaned: E2E_MAILCHIMP_API_KEY / E2E_MAILCHIMP_AUDIENCE_ID absent",
        };
      }
      try {
        const { archived, reason } = await archiveMember(target, address.email);
        return archived
          ? { cleaned: true, reason }
          : { cleaned: true, reason: `${reason} (nothing to archive)` };
      } catch (err) {
        return { cleaned: false, reason: `error: ${errorText(err)}` };
      }
    }
    case "stripe-session": {
      if (!target.testStripe.secretKey) {
        return {
          cleaned: false,
          reason: "not cleaned: E2E_STRIPE_SECRET_KEY absent",
        };
      }
      try {
        const { expired, status } = await expireSession(target, entry.ref);
        return expired
          ? { cleaned: true, reason: "expired" }
          : {
              cleaned: true,
              reason: `no action needed (status ${status ?? "unknown"})`,
            };
      } catch (err) {
        return { cleaned: false, reason: `error: ${errorText(err)}` };
      }
    }
    case "contact-message":
      return {
        cleaned: false,
        reason:
          "manual: the message stays in the Formspree inbox (MN-003 evidence)",
      };
  }
}

/** Rows that stay in fixtures.json for a later cleanup attempt. */
function residual(row: Row): boolean {
  if (row.cleaned) return false;
  return (
    row.reason.startsWith("not cleaned:") ||
    row.reason.startsWith("kept") ||
    row.reason.startsWith("error:")
  );
}

teardown(
  "cleanup: remove throwaway TEST users, archive Mailchimp test members, write the run record",
  async () => {
    const finishedAt = new Date().toISOString();
    let run: string | null = null;
    try {
      run = runId();
    } catch {
      run = null;
    }
    if (!existsSync(FIXTURES_FILE)) {
      writeRunRecord({
        finishedAt,
        runId: run,
        note: "no fixtures were recorded — nothing to clean",
        counts: {
          recorded: 0,
          cleaned: 0,
          kept: 0,
          manual: 0,
          notCleaned: 0,
          errors: 0,
        },
        fixtures: [],
      });
      console.log("[launch-gate] cleanup: no fixtures recorded.");
      return;
    }

    const target = resolveTarget(process.env);
    const keepUsers = process.env.E2E_KEEP_TEST_USERS === "1";
    const entries = readFixtures();
    const rows: Row[] = [];
    for (const entry of entries) {
      const outcome = await cleanOne(target, entry, keepUsers);
      rows.push({
        kind: entry.kind,
        ref: sanitisedRef(entry),
        createdBy: entry.createdBy,
        count: entry.count,
        run: entry.recordedRun,
        ...outcome,
      });
    }

    const counts = {
      recorded: rows.length,
      cleaned: rows.filter((r) => r.cleaned).length,
      kept: rows.filter((r) => r.reason.startsWith("kept")).length,
      manual: rows.filter((r) => r.reason.startsWith("manual")).length,
      notCleaned: rows.filter((r) => r.reason.startsWith("not cleaned")).length,
      errors: rows.filter((r) => r.reason.startsWith("error:")).length,
    };
    writeRunRecord({
      finishedAt,
      runId: run,
      mode: target.mode,
      origin: target.origin,
      keepTestUsers: keepUsers,
      counts,
      fixtures: rows,
    });

    const remaining = entries.filter((_, i) => residual(rows[i]));
    if (remaining.length > 0) writeFixtures(remaining);
    else unlinkSync(FIXTURES_FILE);

    console.log(`[launch-gate] cleanup: ${JSON.stringify(counts)}`);
    expect(
      rows
        .filter((r) => r.reason.startsWith("error:"))
        .map((r) => `${r.kind} ${r.ref}: ${r.reason}`),
      "Residual test data could not be removed — see qa-evidence/run-record.json and re-run `pnpm exec playwright test --project=cleanup`.",
    ).toEqual([]);
  },
);
