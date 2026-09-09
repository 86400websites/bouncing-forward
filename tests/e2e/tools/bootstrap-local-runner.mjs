/**
 * Owner-run bootstrap for the local Launch Gate runner.
 *
 * Creates (or resets) the two TEST fixture accounts through Supabase's
 * admin API and writes every harness variable it can derive into the
 * gitignored `.env.e2e.local` — so no password or key ever passes through
 * a chat or a tracked file. Run it yourself with the TEST values loaded:
 *
 *   node --env-file=.env.local tests/e2e/tools/bootstrap-local-runner.mjs \
 *     --owner-mailbox you@example.com \
 *     --preview-url https://bouncing-forward-git-….vercel.app
 *
 * Safety rails:
 *   - refuses to run unless NEXT_PUBLIC_SUPABASE_URL is the TEST project
 *     (hmcojplrqoqhyigvtgyp) — it never touches Production;
 *   - refuses a live Stripe key; copies only test-mode values;
 *   - prints variable NAMES and the fixture emails, never a value.
 *
 * What it writes (names): PLAYWRIGHT_TARGET, PLAYWRIGHT_BASE_URL,
 * PLAYWRIGHT_EXPECTED_SHA, VERCEL_AUTOMATION_BYPASS_SECRET, E2E_OWNER_MAILBOX,
 * E2E_FREE_USER_EMAIL, E2E_FREE_USER_PASSWORD, E2E_PREMIUM_USER_EMAIL,
 * E2E_PREMIUM_USER_PASSWORD, E2E_SUPABASE_URL, E2E_SUPABASE_SECRET_KEY,
 * E2E_STRIPE_SECRET_KEY, E2E_MAILCHIMP_API_KEY, E2E_MAILCHIMP_AUDIENCE_ID,
 * E2E_MAILCHIMP_SERVER_PREFIX, E2E_LEGACY_ACCESS_CODE.
 */

import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const TEST_REF = "hmcojplrqoqhyigvtgyp";
const ENV_FILE = ".env.e2e.local";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const ownerMailbox = arg("--owner-mailbox");
const previewUrl = arg("--preview-url");

if (!ownerMailbox || !/^[^\s@+]+@[^\s@]+\.[^\s@]+$/.test(ownerMailbox)) {
  console.error(
    "Pass --owner-mailbox you@example.com (a plain address; the script adds its own +tags).",
  );
  process.exit(1);
}

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const secretKey = (process.env.SUPABASE_SECRET_KEY ?? "").trim();
let ref = "";
try {
  ref = new URL(supabaseUrl).hostname.split(".")[0];
} catch {
  ref = "";
}
if (ref !== TEST_REF) {
  console.error(
    `Refusing: NEXT_PUBLIC_SUPABASE_URL is not the TEST project (${TEST_REF}). Load the TEST values (e.g. --env-file=.env.local with TEST settings).`,
  );
  process.exit(1);
}
if (!secretKey) {
  console.error(
    "Refusing: SUPABASE_SECRET_KEY (TEST) is not set in the loaded env.",
  );
  process.exit(1);
}

const [local, domain] = ownerMailbox.split("@");
const accounts = {
  free: `${local}+bf-e2e-free@${domain}`,
  premium: `${local}+bf-e2e-premium@${domain}`,
};
const password = randomBytes(18).toString("base64url");

const headers = {
  apikey: secretKey,
  Authorization: `Bearer ${secretKey}`,
  "Content-Type": "application/json",
};

async function listUsers() {
  const res = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=1000`,
    {
      headers,
    },
  );
  if (!res.ok) throw new Error(`admin list users → HTTP ${res.status}`);
  const data = await res.json();
  return data.users ?? [];
}

async function ensureUser(email) {
  const existing = (await listUsers()).find(
    (u) => (u.email ?? "").toLowerCase() === email.toLowerCase(),
  );
  if (existing) {
    const res = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${existing.id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ password, email_confirm: true }),
      },
    );
    if (!res.ok) throw new Error(`admin update ${email} → HTTP ${res.status}`);
    return { id: existing.id, action: "password reset" };
  }
  const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (!res.ok) throw new Error(`admin create ${email} → HTTP ${res.status}`);
  const user = await res.json();
  return { id: user.id, action: "created" };
}

function readEnvFile() {
  if (!existsSync(ENV_FILE)) return new Map();
  const map = new Map();
  for (const line of readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) map.set(m[1], m[2]);
  }
  return map;
}

function stripeTestKey() {
  const key = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!key) return null;
  if (!/^(sk|rk)_test_/.test(key)) {
    console.warn(
      "STRIPE_SECRET_KEY in the loaded env is not test-mode — not copied.",
    );
    return null;
  }
  return key;
}

let expectedSha = "";
try {
  expectedSha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
} catch {
  expectedSha = "";
}

const results = {};
for (const [role, email] of Object.entries(accounts)) {
  results[role] = await ensureUser(email);
}

const env = readEnvFile();
const set = (name, value) => {
  if (value) env.set(name, value);
};
set("PLAYWRIGHT_TARGET", previewUrl ? "preview" : env.get("PLAYWRIGHT_TARGET"));
set("PLAYWRIGHT_BASE_URL", previewUrl);
set("PLAYWRIGHT_EXPECTED_SHA", expectedSha);
set(
  "VERCEL_AUTOMATION_BYPASS_SECRET",
  (process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? "").trim(),
);
set("E2E_OWNER_MAILBOX", ownerMailbox);
set("E2E_FREE_USER_EMAIL", accounts.free);
set("E2E_FREE_USER_PASSWORD", password);
set("E2E_PREMIUM_USER_EMAIL", accounts.premium);
set("E2E_PREMIUM_USER_PASSWORD", password);
set("E2E_SUPABASE_URL", supabaseUrl);
set("E2E_SUPABASE_SECRET_KEY", secretKey);
set("E2E_STRIPE_SECRET_KEY", stripeTestKey());
set("E2E_MAILCHIMP_API_KEY", (process.env.MAILCHIMP_API_KEY ?? "").trim());
set(
  "E2E_MAILCHIMP_AUDIENCE_ID",
  (process.env.MAILCHIMP_AUDIENCE_ID ?? "").trim(),
);
set(
  "E2E_MAILCHIMP_SERVER_PREFIX",
  (process.env.MAILCHIMP_SERVER_PREFIX ?? "").trim(),
);
set(
  "E2E_LEGACY_ACCESS_CODE",
  (process.env.PREMIUM_ACCESS_CODES ?? "").split(",")[0]?.trim(),
);

const lines = [
  "# Launch Gate local runner — written by tests/e2e/tools/bootstrap-local-runner.mjs",
  "# Gitignored. Names documented in tests/e2e/README.md. Never commit or share.",
  ...[...env.entries()].map(([k, v]) => `${k}=${v}`),
  "",
];
writeFileSync(ENV_FILE, lines.join("\n"));

console.log("TEST project:", ref);
for (const [role, r] of Object.entries(results)) {
  console.log(`${role}: ${accounts[role]} — ${r.action} (id ${r.id})`);
}
console.log(`Wrote ${ENV_FILE} with: ${[...env.keys()].join(", ")}`);
console.log(
  "Next: tell Claude Code the two accounts exist; it adds the premium entitlement through the TEST connection.",
);
