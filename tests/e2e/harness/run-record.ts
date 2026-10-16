import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LABEL, isTestIdentity, parseIdentityRef, runId } from "./identities";

/**
 * Run bookkeeping under the gitignored qa-evidence/ folder
 * (docs/ENVIRONMENT-PARITY.md §10 "Fixture writes use TEST only, with
 * cleanup and a run record").
 *
 *   qa-evidence/preflight.json   written by the preflight (target identity)
 *   qa-evidence/fixtures.json    every write a spec made that needs cleanup
 *   qa-evidence/run-record.json  what the cleanup project did about each
 *
 * A fixture ref never carries a value: identities are recorded as their
 * KIND (`"newsletter"`, `"buyer:b"`) and resolved back to an address by
 * identities.ts; Stripe sessions as their `cs_test_` id; contact messages
 * as the label plus run id.
 */

export const EVIDENCE_DIR = path.join(process.cwd(), "qa-evidence");
export const FIXTURES_FILE = path.join(EVIDENCE_DIR, "fixtures.json");
export const PREFLIGHT_FILE = path.join(EVIDENCE_DIR, "preflight.json");
export const RUN_RECORD_FILE = path.join(EVIDENCE_DIR, "run-record.json");

export type FixtureKind =
  "test-user" | "mailchimp-member" | "contact-message" | "stripe-session";

export type FixtureEntry = {
  kind: FixtureKind;
  ref: string;
  /** Test IDs (or spec names) that touched this fixture, in order. */
  createdBy: string[];
  /** How many times it was recorded in the run (one member, N submissions). */
  count: number;
  /** Run the fixture belongs to (resolves run-scoped identities later). */
  recordedRun: string;
  firstRecordedAt: string;
};

function readJson<T>(file: string): T | null {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

export function readFixtures(): FixtureEntry[] {
  const parsed = readJson<FixtureEntry[]>(FIXTURES_FILE);
  return Array.isArray(parsed) ? parsed : [];
}

export function writeFixtures(entries: FixtureEntry[]): void {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  writeFileSync(FIXTURES_FILE, JSON.stringify(entries, null, 2));
}

function validateRef(kind: FixtureKind, ref: string): void {
  const value = ref.trim();
  if (!value) throw new Error("[launch-gate] recordFixture: ref is empty.");
  switch (kind) {
    case "test-user":
    case "mailchimp-member": {
      if (parseIdentityRef(value)) return;
      if (value.includes("@") && isTestIdentity(value)) return;
      throw new Error(
        `[launch-gate] recordFixture(${kind}): ref must be an identity kind from identities.ts (preferred) or a bf-e2e test address (address withheld).`,
      );
    }
    case "stripe-session": {
      if (/^cs_test_[A-Za-z0-9]+$/.test(value)) return;
      throw new Error(
        "[launch-gate] recordFixture(stripe-session): ref must be a cs_test_ Checkout Session id.",
      );
    }
    case "contact-message": {
      if (value.includes(LABEL)) return;
      throw new Error(
        `[launch-gate] recordFixture(contact-message): ref must carry the label ${LABEL}.`,
      );
    }
  }
}

/**
 * Registers one write for the cleanup project. Recording the same
 * kind + ref again in a run is tolerated and counted (one member, several
 * submissions) — never duplicated.
 */
export function recordFixture(input: {
  kind: FixtureKind;
  ref: string;
  createdBy: string;
}): FixtureEntry {
  validateRef(input.kind, input.ref);
  const ref = input.ref.trim();
  const run = runId();
  const entries = readFixtures();
  const existing = entries.find(
    (e) => e.kind === input.kind && e.ref === ref && e.recordedRun === run,
  );
  if (existing) {
    existing.count += 1;
    if (!existing.createdBy.includes(input.createdBy)) {
      existing.createdBy.push(input.createdBy);
    }
    writeFixtures(entries);
    return existing;
  }
  const entry: FixtureEntry = {
    kind: input.kind,
    ref,
    createdBy: [input.createdBy],
    count: 1,
    recordedRun: run,
    firstRecordedAt: new Date().toISOString(),
  };
  entries.push(entry);
  writeFixtures(entries);
  return entry;
}

/** The sanitised deployment facts the preflight read from /api/health. */
export type PreflightDeployment = {
  environment: string | null;
  commit: string | null;
  branch: string | null;
  deploymentId: string | null;
  deploymentUrl: string | null;
  productionUrl: string | null;
  siteUrl: string | null;
  supabaseProjectRef: string | null;
  privilegedSupabaseRef: string | null;
  stripeMode: string | null;
  stripePriceConfigured: boolean;
  webhookSecretConfigured: boolean;
  mailchimpConfigured: boolean;
  accessCodesConfigured: boolean;
  contactEndpointConfigured: boolean;
};

export type PreflightRecord = {
  checkedAt: string;
  mode: "local" | "preview" | "production-morning";
  origin: string;
  expectedSha: string | null;
  /** Harness variable NAMES present when the preflight ran. */
  variablesPresent: string[];
  protection?: "none-expected" | "on-bypassed" | "off" | "off-secret-unused";
  deployment?: PreflightDeployment;
  vercelApi?: {
    id: string | null;
    url: string | null;
    project: string | null;
    branch: string | null;
    aliasInUse: boolean;
  };
};

/** Parsed qa-evidence/preflight.json; throws naming the preflight project when absent. */
export function preflightRecord(): PreflightRecord {
  const parsed = readJson<PreflightRecord>(PREFLIGHT_FILE);
  if (!parsed || typeof parsed.checkedAt !== "string") {
    throw new Error(
      "[launch-gate] qa-evidence/preflight.json is missing or unreadable — the preflight project must run first.",
    );
  }
  return parsed;
}

/**
 * The deployment facts, with a plain FAIL message naming the Preview
 * variable a spec needs when the fact is null/false (e.g.
 * requireDeploymentFact("accessCodesConfigured", "PREMIUM_ACCESS_CODES")).
 */
export function requireDeploymentFact(
  fact: keyof PreflightDeployment,
  variableName: string,
): PreflightDeployment {
  const deployment = preflightRecord().deployment;
  if (!deployment) {
    throw new Error(
      "[launch-gate] The preflight record carries no deployment facts (/api/health was not read) — re-run the preflight.",
    );
  }
  const value = deployment[fact];
  if (value === null || value === false || value === undefined) {
    throw new Error(
      `[launch-gate] The target reports ${fact} = ${String(value)} — set ${variableName} for the Preview environment and redeploy.`,
    );
  }
  return deployment;
}

export function writeRunRecord(record: Record<string, unknown>): void {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  writeFileSync(RUN_RECORD_FILE, JSON.stringify(record, null, 2));
}
