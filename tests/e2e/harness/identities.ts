import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Test identities for the Launch Gate (docs/FEATURE-LIST.md header,
 * tests/e2e/features/README.md "Shared services").
 *
 * Every address a spec writes anywhere is a plus-tag on the owner's own
 * mailbox (E2E_OWNER_MAILBOX), so confirmation, reset and access emails
 * land where the owner can read them and nothing reaches a stranger.
 *
 *   - Shared-service identities (newsletter, assessment, honeypot,
 *     contact) are STABLE across runs: one member per identity in the
 *     shared Mailchimp audience, archived by the cleanup project.
 *   - Account and buyer identities carry the run id, so a throwaway TEST
 *     user is never reused across runs and a Stripe test purchase always
 *     belongs to exactly one run.
 *
 * Nothing here logs a value; the mailbox itself never appears in an
 * error message.
 */

export const LABEL = "[LAUNCH GATE TEST]";

/** One member each in the shared audience; the same address every run. */
export const STABLE_IDENTITY_KINDS = [
  "newsletter",
  "assessment",
  "honeypot",
  "contact",
  "tagprobe",
] as const;

/** Suffixed with the run id; created and removed within one run. */
export const RUN_SCOPED_IDENTITY_KINDS = [
  "signup",
  "buyer",
  "buyer-legacy",
  "reset",
  "unknown",
  "buyer-b",
  "buyer-visitor",
  "buyer-foreign",
  "buyer-paymentlink",
  "buyer-marker",
  "buyer-nomarker",
] as const;

export type StableIdentityKind = (typeof STABLE_IDENTITY_KINDS)[number];
export type RunScopedIdentityKind = (typeof RUN_SCOPED_IDENTITY_KINDS)[number];
export type IdentityKind = StableIdentityKind | RunScopedIdentityKind;

const ALL_KINDS: readonly string[] = [
  ...STABLE_IDENTITY_KINDS,
  ...RUN_SCOPED_IDENTITY_KINDS,
];

export function isIdentityKind(value: string): value is IdentityKind {
  return ALL_KINDS.includes(value);
}

export function isRunScopedKind(kind: IdentityKind): boolean {
  return (RUN_SCOPED_IDENTITY_KINDS as readonly string[]).includes(kind);
}

const PREFLIGHT_FILE = path.join(
  process.cwd(),
  "qa-evidence",
  "preflight.json",
);
let cachedRunId: string | null = null;

/**
 * Stable for the whole run: derived from the `checkedAt` stamp the
 * preflight wrote to qa-evidence/preflight.json (every project depends on
 * the preflight, so the file exists before any spec runs). Lower-case
 * base-36 of the timestamp — safe inside an email tag, a Stripe metadata
 * value and a made-up access code.
 */
export function runId(): string {
  if (cachedRunId) return cachedRunId;
  if (!existsSync(PREFLIGHT_FILE)) {
    throw new Error(
      "[launch-gate] qa-evidence/preflight.json is missing — the preflight project must run first (every features project depends on it).",
    );
  }
  let checkedAt = "";
  try {
    const parsed = JSON.parse(readFileSync(PREFLIGHT_FILE, "utf8")) as {
      checkedAt?: unknown;
    };
    checkedAt = typeof parsed.checkedAt === "string" ? parsed.checkedAt : "";
  } catch {
    checkedAt = "";
  }
  const ms = Date.parse(checkedAt);
  if (!Number.isFinite(ms)) {
    throw new Error(
      "[launch-gate] qa-evidence/preflight.json carries no valid checkedAt — re-run the preflight project.",
    );
  }
  cachedRunId = ms.toString(36);
  return cachedRunId;
}

function ownerMailboxParts(): { local: string; domain: string } {
  const raw = (process.env.E2E_OWNER_MAILBOX ?? "").trim();
  if (!raw) {
    throw new Error(
      "[launch-gate] E2E_OWNER_MAILBOX is required: every test identity is a plus-tag on the owner's own mailbox. Store the plain address (no plus-tag) under that name.",
    );
  }
  if (!/^[^\s@+]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    throw new Error(
      "[launch-gate] E2E_OWNER_MAILBOX must be a plain mailbox address without a plus-tag; tests add their own tags.",
    );
  }
  const [local, domain] = raw.split("@");
  return { local, domain };
}

export type IdentityOptions = {
  /** Extra tag segment (a-z, 0-9, 1–16 chars) for variants of one kind. */
  label?: string;
  /** Resolve for a specific run (the cleanup uses the run each fixture was recorded in). */
  runId?: string;
};

/**
 * `<local>+bf-e2e-<kind>[-<label>][-<runId>]@<domain>` — the run id is
 * appended for run-scoped kinds only. Throws a plain error naming
 * E2E_OWNER_MAILBOX when the mailbox is absent.
 */
export function identity(
  kind: IdentityKind,
  options?: string | IdentityOptions,
): string {
  if (!isIdentityKind(kind)) {
    throw new Error(
      `[launch-gate] "${String(kind)}" is not an approved identity kind (see tests/e2e/harness/identities.ts).`,
    );
  }
  const opts: IdentityOptions =
    typeof options === "string" ? { label: options } : (options ?? {});
  const { local, domain } = ownerMailboxParts();
  const parts = ["bf-e2e", kind];
  if (opts.label) {
    if (!/^[a-z0-9]{1,16}$/.test(opts.label)) {
      throw new Error(
        "[launch-gate] An identity label must be 1–16 lower-case letters or digits.",
      );
    }
    parts.push(opts.label);
  }
  if (isRunScopedKind(kind)) parts.push(opts.runId ?? runId());
  return `${local}+${parts.join("-")}@${domain}`;
}

/** True for any `+bf-e2e-…` plus-address (the only addresses the harness may write or remove). */
export function isTestIdentity(email: string): boolean {
  const local = email.trim().toLowerCase().split("@")[0] ?? "";
  return local.includes("+bf-e2e-");
}

/**
 * The two long-lived fixture accounts (E2E_FREE_USER_EMAIL /
 * E2E_PREMIUM_USER_EMAIL, or the documented `+bf-e2e-free` /
 * `+bf-e2e-premium` tags) — never created, reset, deleted or archived by
 * any helper.
 */
export function isFixtureAccount(email: string): boolean {
  const wanted = email.trim().toLowerCase();
  for (const name of ["E2E_FREE_USER_EMAIL", "E2E_PREMIUM_USER_EMAIL"]) {
    const value = (process.env[name] ?? "").trim().toLowerCase();
    if (value && value === wanted) return true;
  }
  const local = wanted.split("@")[0] ?? "";
  return local.endsWith("+bf-e2e-free") || local.endsWith("+bf-e2e-premium");
}

/**
 * A fixture ref written by recordFixture(): `<kind>` or `<kind>:<label>`
 * (an identity spec — no address on disk), or a full address. Returns
 * the parsed spec, or null when the ref is an address / not a kind.
 */
export function parseIdentityRef(
  ref: string,
): { kind: IdentityKind; label?: string } | null {
  const [kind, label, extra] = ref.split(":");
  if (extra !== undefined || !kind || !isIdentityKind(kind)) return null;
  return label ? { kind, label } : { kind };
}

/** ≥ 8 characters, letters/digits/`-`/`_`; fresh every call. Never log it. */
export function randomPassword(): string {
  return `Lg-${randomBytes(12).toString("base64url")}`;
}

/** `ab***@domain` — for run records and messages that must name an address. */
export function maskEmail(email: string): string {
  const [user = "", domain = ""] = email.split("@");
  const head = user.slice(0, 2);
  return `${head}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}
