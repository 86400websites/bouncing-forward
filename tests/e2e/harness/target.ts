/**
 * Target resolution for the Launch Gate harness.
 *
 * Implements docs/ENVIRONMENT-PARITY.md §10 and §12: the suite refuses to
 * run against an unknown or Production origin, refuses to start without
 * the credentials a mode requires, and keeps deployment-protection bypass
 * scoped to one verified origin. These functions are pure (no I/O) so the
 * rules can be reasoned about without a browser. They read environment
 * variable NAMES; nothing here ever logs a value.
 */

export type TargetMode = "local" | "preview" | "production-morning";

/** Supabase project refs recorded in docs/SUPABASE-MCP-SAFETY.md §10. */
export const TEST_SUPABASE_REF = "hmcojplrqoqhyigvtgyp";
export const PROD_SUPABASE_REF = "ilnoazendkckzhbuzias";

/** Hosts that are, or will become, Production. Never a full-suite target. */
export const PRODUCTION_HOSTS = [
  "bouncing-forward.vercel.app",
  "bouncing-forward.com",
  "www.bouncing-forward.com",
];

export type Credentials = { email: string; password: string };

export type ResolvedTarget = {
  mode: TargetMode;
  /** Scheme + host only, no trailing slash. Every request is relative to it. */
  origin: string;
  host: string;
  /** Candidate commit the Preview must serve (preview mode only). */
  expectedSha: string | null;
  /** Vercel "Protection Bypass for Automation" secret, preview mode only. */
  bypassSecret: string | null;
  /** Vercel REST API access used to verify project / environment / SHA. */
  vercel: { token: string; projectId: string; teamId: string | null } | null;
  /** TEST-project fixture accounts (never Production). */
  fixtures: { free: Credentials | null; premium: Credentials | null };
  /** Dedicated least-privilege Production account for the morning check. */
  morningAccount: Credentials | null;
  /** TEST Supabase privileged read for record checks; refused on Production. */
  testSupabase: { url: string; secretKey: string } | null;
  /** Stripe TEST-mode access for payment proofs; live prefixes are refused. */
  testStripe: { secretKey: string | null; webhookSecret: string | null };
  /** One legacy access code (shared with Production by owner decision); never logged. */
  legacyAccessCode: string | null;
  /** Owner-controlled mailbox; tests derive plus-addressed identities from it. */
  ownerMailbox: string | null;
  /** Shared Mailchimp audience (owner decision) for read-back and cleanup only. */
  mailchimp: {
    apiKey: string;
    audienceId: string;
    serverPrefix: string;
  } | null;
};

/** Every harness variable, so the record and the docs stay in sync. */
export const HARNESS_VARIABLE_NAMES = [
  "PLAYWRIGHT_TARGET",
  "PLAYWRIGHT_BASE_URL",
  "PLAYWRIGHT_EXPECTED_SHA",
  "VERCEL_TOKEN",
  "VERCEL_PROJECT_ID",
  "VERCEL_TEAM_ID",
  "VERCEL_AUTOMATION_BYPASS_SECRET",
  "E2E_FREE_USER_EMAIL",
  "E2E_FREE_USER_PASSWORD",
  "E2E_PREMIUM_USER_EMAIL",
  "E2E_PREMIUM_USER_PASSWORD",
  "E2E_SUPABASE_URL",
  "E2E_SUPABASE_SECRET_KEY",
  "E2E_STRIPE_SECRET_KEY",
  "E2E_STRIPE_WEBHOOK_SECRET",
  "E2E_LEGACY_ACCESS_CODE",
  "E2E_OWNER_MAILBOX",
  "E2E_MAILCHIMP_API_KEY",
  "E2E_MAILCHIMP_AUDIENCE_ID",
  "E2E_MAILCHIMP_SERVER_PREFIX",
  "MORNING_TEST_EMAIL",
  "MORNING_TEST_PASSWORD",
] as const;

/** Variables that must NOT be present when the target is Production. */
const FORBIDDEN_ON_PRODUCTION = [
  "VERCEL_AUTOMATION_BYPASS_SECRET",
  "VERCEL_TOKEN",
  "E2E_FREE_USER_EMAIL",
  "E2E_FREE_USER_PASSWORD",
  "E2E_PREMIUM_USER_EMAIL",
  "E2E_PREMIUM_USER_PASSWORD",
  "E2E_SUPABASE_URL",
  "E2E_SUPABASE_SECRET_KEY",
  "E2E_STRIPE_SECRET_KEY",
  "E2E_STRIPE_WEBHOOK_SECRET",
  "E2E_LEGACY_ACCESS_CODE",
  "E2E_MAILCHIMP_API_KEY",
  "E2E_MAILCHIMP_AUDIENCE_ID",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SUPABASE_SECRET_KEY",
] as const;

export class TargetError extends Error {
  constructor(message: string) {
    super(`[launch-gate] ${message}`);
    this.name = "TargetError";
  }
}

type Env = Record<string, string | undefined>;

function read(env: Env, name: string): string | null {
  const value = env[name]?.trim();
  return value ? value : null;
}

function credentials(
  env: Env,
  emailName: string,
  passwordName: string,
): Credentials | null {
  const email = read(env, emailName);
  const password = read(env, passwordName);
  if (!email && !password) return null;
  if (!email || !password) {
    throw new TargetError(
      `${emailName} and ${passwordName} must be set together (one is missing).`,
    );
  }
  return { email, password };
}

/**
 * Parse PLAYWRIGHT_BASE_URL into a bare origin. Rejects credentials, paths,
 * queries and fragments so a bypass token can never ride along in the URL.
 */
function parseOrigin(raw: string, mode: TargetMode): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new TargetError(
      `PLAYWRIGHT_BASE_URL is not a valid absolute URL (expected e.g. https://host).`,
    );
  }
  if (url.username || url.password) {
    throw new TargetError("PLAYWRIGHT_BASE_URL must not contain credentials.");
  }
  if ((url.pathname !== "/" && url.pathname !== "") || url.search || url.hash) {
    throw new TargetError(
      "PLAYWRIGHT_BASE_URL must be an origin only (no path, query or fragment).",
    );
  }
  const isLocalHost =
    url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(mode === "local" && isLocalHost)) {
    throw new TargetError(
      "PLAYWRIGHT_BASE_URL must use https for deployed targets.",
    );
  }
  return url;
}

/**
 * Non-throwing peek used by playwright.config.ts so `--list` and project
 * selection work before the strict preflight runs.
 */
export function peekTarget(
  env: Env,
): { mode: TargetMode; origin: string } | null {
  const mode = read(env, "PLAYWRIGHT_TARGET");
  const base = read(env, "PLAYWRIGHT_BASE_URL");
  if (mode !== "local" && mode !== "preview" && mode !== "production-morning") {
    return null;
  }
  if (!base) return { mode, origin: "" };
  try {
    return { mode, origin: parseOrigin(base, mode).origin };
  } catch {
    return { mode, origin: "" };
  }
}

/** Strict resolution. Throws a TargetError with the exact fix on any gap. */
export function resolveTarget(env: Env): ResolvedTarget {
  const modeRaw = read(env, "PLAYWRIGHT_TARGET");
  if (
    modeRaw !== "local" &&
    modeRaw !== "preview" &&
    modeRaw !== "production-morning"
  ) {
    throw new TargetError(
      "PLAYWRIGHT_TARGET must be one of: local | preview | production-morning. " +
        "It is deliberately required so a run can never target the wrong site by accident.",
    );
  }
  const mode: TargetMode = modeRaw;

  const base = read(env, "PLAYWRIGHT_BASE_URL");
  if (!base) {
    throw new TargetError(
      "PLAYWRIGHT_BASE_URL is not set. Set it to the exact origin under test.",
    );
  }
  const url = parseOrigin(base, mode);
  const host = url.hostname;
  const isProductionHost = PRODUCTION_HOSTS.includes(host);
  const isLocalHost = host === "localhost" || host === "127.0.0.1";

  const bypassSecret = read(env, "VERCEL_AUTOMATION_BYPASS_SECRET");
  const expectedSha = read(env, "PLAYWRIGHT_EXPECTED_SHA");
  const vercelToken = read(env, "VERCEL_TOKEN");
  const vercelProjectId = read(env, "VERCEL_PROJECT_ID");
  const vercelTeamId = read(env, "VERCEL_TEAM_ID");
  const testSupabaseUrl = read(env, "E2E_SUPABASE_URL");
  const testSupabaseKey = read(env, "E2E_SUPABASE_SECRET_KEY");

  if (mode === "local") {
    if (!isLocalHost) {
      throw new TargetError(
        `PLAYWRIGHT_TARGET=local only accepts http://localhost or http://127.0.0.1 (got host "${host}").`,
      );
    }
  }

  if (mode === "preview") {
    if (isProductionHost) {
      throw new TargetError(
        `"${host}" is a Production host. The full suite never runs against Production ` +
          "(docs/ENVIRONMENT-PARITY.md §10). Use the PR's Preview deployment URL.",
      );
    }
    // Vercel names every deployment of this project "bouncing-forward-…".
    // The rule guards against a mistyped or foreign host receiving the
    // bypass secret; the preflight then proves identity via /api/health.
    if (
      isLocalHost ||
      !host.startsWith("bouncing-forward-") ||
      !host.endsWith(".vercel.app")
    ) {
      throw new TargetError(
        `"${host}" is not a Preview deployment of this project. Expected a bouncing-forward-….vercel.app address for the candidate commit.`,
      );
    }
    if (!expectedSha || !/^[0-9a-f]{40}$/i.test(expectedSha)) {
      throw new TargetError(
        "PLAYWRIGHT_EXPECTED_SHA must be the full 40-character commit SHA the Preview is expected to serve " +
          "(`git rev-parse HEAD` on the pushed branch).",
      );
    }
    // Project / environment / commit are verified through the deployment's
    // own read-only identity route (/api/health). The Vercel API is an
    // optional extra cross-check: set both variables or neither.
    if (Boolean(vercelToken) !== Boolean(vercelProjectId)) {
      throw new TargetError(
        "VERCEL_TOKEN and VERCEL_PROJECT_ID must be set together (or both left unset).",
      );
    }
  }

  if (mode === "production-morning") {
    // Only the canonical host: the apex answers a redirect and the
    // vercel.app host is a duplicate. Both stay refused as suite targets.
    if (host !== "www.bouncing-forward.com") {
      throw new TargetError(
        `PLAYWRIGHT_TARGET=production-morning only accepts https://www.bouncing-forward.com (got "${host}").`,
      );
    }
    const present = FORBIDDEN_ON_PRODUCTION.filter((name) => read(env, name));
    if (present.length > 0) {
      throw new TargetError(
        `Refusing to run against Production with privileged or Preview-only variables present: ${present.join(", ")}. ` +
          "The morning check may use only PLAYWRIGHT_BASE_URL, MORNING_TEST_EMAIL and MORNING_TEST_PASSWORD.",
      );
    }
  }

  let testSupabase: ResolvedTarget["testSupabase"] = null;
  if (testSupabaseUrl || testSupabaseKey) {
    if (!testSupabaseUrl || !testSupabaseKey) {
      throw new TargetError(
        "E2E_SUPABASE_URL and E2E_SUPABASE_SECRET_KEY must be set together.",
      );
    }
    let supabaseHost = "";
    try {
      supabaseHost = new URL(testSupabaseUrl).hostname;
    } catch {
      throw new TargetError("E2E_SUPABASE_URL is not a valid URL.");
    }
    if (supabaseHost === `${PROD_SUPABASE_REF}.supabase.co`) {
      throw new TargetError(
        "E2E_SUPABASE_URL points at the PRODUCTION Supabase project. The harness never holds a Production " +
          "database credential. Replace it with the TEST project and rotate the key if it was exposed.",
      );
    }
    if (supabaseHost !== `${TEST_SUPABASE_REF}.supabase.co`) {
      throw new TargetError(
        `E2E_SUPABASE_URL host "${supabaseHost}" is not the recorded TEST project (${TEST_SUPABASE_REF}).`,
      );
    }
    testSupabase = { url: testSupabaseUrl, secretKey: testSupabaseKey };
  }

  const stripeKey = read(env, "E2E_STRIPE_SECRET_KEY");
  if (stripeKey && !/^(sk|rk)_test_/.test(stripeKey)) {
    throw new TargetError(
      "E2E_STRIPE_SECRET_KEY is not a Stripe TEST-mode key (expected an sk_test_ or rk_test_ prefix). " +
        "The harness never holds a live payment key; rotate it if a live key was exposed.",
    );
  }
  const stripeWebhookSecret = read(env, "E2E_STRIPE_WEBHOOK_SECRET");
  if (stripeWebhookSecret && !stripeWebhookSecret.startsWith("whsec_")) {
    throw new TargetError(
      "E2E_STRIPE_WEBHOOK_SECRET does not look like a webhook signing secret (expected a whsec_ prefix).",
    );
  }

  const mcKey = read(env, "E2E_MAILCHIMP_API_KEY");
  const mcAudience = read(env, "E2E_MAILCHIMP_AUDIENCE_ID");
  const mcServer =
    read(env, "E2E_MAILCHIMP_SERVER_PREFIX") ?? mcKey?.split("-").pop() ?? null;
  if ((mcKey || mcAudience) && !(mcKey && mcAudience && mcServer)) {
    throw new TargetError(
      "E2E_MAILCHIMP_API_KEY and E2E_MAILCHIMP_AUDIENCE_ID must be set together (E2E_MAILCHIMP_SERVER_PREFIX if the key has no suffix).",
    );
  }
  const ownerMailbox = read(env, "E2E_OWNER_MAILBOX");
  if (ownerMailbox && !/^[^\s@+]+@[^\s@]+\.[^\s@]+$/.test(ownerMailbox)) {
    throw new TargetError(
      "E2E_OWNER_MAILBOX must be a plain mailbox address without a plus-tag; tests add their own tags.",
    );
  }

  return {
    mode,
    origin: url.origin,
    host,
    expectedSha: mode === "preview" ? expectedSha : null,
    bypassSecret: mode === "preview" ? bypassSecret : null,
    vercel:
      mode === "preview" && vercelToken && vercelProjectId
        ? {
            token: vercelToken,
            projectId: vercelProjectId,
            teamId: vercelTeamId,
          }
        : null,
    fixtures: {
      free: credentials(env, "E2E_FREE_USER_EMAIL", "E2E_FREE_USER_PASSWORD"),
      premium: credentials(
        env,
        "E2E_PREMIUM_USER_EMAIL",
        "E2E_PREMIUM_USER_PASSWORD",
      ),
    },
    morningAccount: credentials(
      env,
      "MORNING_TEST_EMAIL",
      "MORNING_TEST_PASSWORD",
    ),
    testSupabase,
    testStripe: { secretKey: stripeKey, webhookSecret: stripeWebhookSecret },
    legacyAccessCode: read(env, "E2E_LEGACY_ACCESS_CODE"),
    ownerMailbox,
    mailchimp:
      mcKey && mcAudience && mcServer
        ? { apiKey: mcKey, audienceId: mcAudience, serverPrefix: mcServer }
        : null,
  };
}

/** Sanitised summary for logs and run records: names and presence only. */
export function describeTarget(target: ResolvedTarget, env: Env) {
  return {
    mode: target.mode,
    origin: target.origin,
    expectedSha: target.expectedSha,
    variablesPresent: HARNESS_VARIABLE_NAMES.filter((name) => read(env, name)),
  };
}

/**
 * True when a test carries the tag the current mode requires.
 *
 * Both places a tag can live are checked, because Playwright keeps a
 * structured `tag: ["@morning"]` out of `testInfo.title`: the feature specs
 * declare their tags structurally, while the smoke and proof specs carry
 * theirs in the title text. Checking the title alone would refuse every
 * approved morning check.
 */
export function allowedForMode(
  title: string,
  tags: readonly string[],
  mode: TargetMode,
): boolean {
  if (mode !== "production-morning") return true;
  // The runtime reports tags with their "@"; the JSON reporter strips it.
  // Accept either shape so this guard cannot quietly stop matching.
  const tagged = tags.some((tag) => tag.replace(/^@/, "") === "morning");
  return tagged || /@morning\b/.test(title);
}
