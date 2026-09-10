import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";
import { peekTarget } from "./tests/e2e/harness/target";

/**
 * Approved local runner: harness-only variables may live in a gitignored
 * `.env.e2e.local` (names in tests/e2e/README.md). The application's own
 * env files are never read by the harness, and nothing here prints a value.
 */
const HARNESS_ENV_FILE = ".env.e2e.local";
if (existsSync(HARNESS_ENV_FILE)) process.loadEnvFile(HARNESS_ENV_FILE);

/**
 * Launch Gate harness — Bouncing Forward.
 *
 * Target selection is explicit (PLAYWRIGHT_TARGET + PLAYWRIGHT_BASE_URL) and
 * verified by the `preflight` project before anything else runs. See
 * tests/e2e/README.md for the variable names and docs/ENVIRONMENT-PARITY.md
 * §10 for the safety rules this file implements:
 *   - no traces, screenshots, videos or HTML report (nothing secret-bearing
 *     is ever written to disk or uploaded);
 *   - one worker, no retries (a retry must not hide a reproducible defect);
 *   - the `cleanup` project is the preflight's teardown: throwaway TEST
 *     users and shared-audience test members recorded in
 *     qa-evidence/fixtures.json are removed after every run;
 *   - the `mobile-390` features project skips `@desktop-only` specs;
 *   - Production is reachable only through the `morning` project, which
 *     exists only when PLAYWRIGHT_TARGET=production-morning and selects
 *     `@morning` specs alone.
 */

const peek = peekTarget(process.env);
const productionMorning = peek?.mode === "production-morning";

const desktop = { ...devices["Desktop Chrome"] };
const mobile390 = {
  ...devices["Pixel 5"],
  viewport: { width: 390, height: 844 },
};

const previewProjects = [
  {
    name: "preflight",
    testMatch: /harness\/preflight\.setup\.ts/,
    // Runs after every project that depends on the preflight — whether
    // the specs passed or not — so recorded fixtures are always cleaned.
    teardown: "cleanup",
  },
  {
    name: "cleanup",
    testMatch: /harness\/cleanup\.teardown\.ts/,
  },
  {
    name: "auth-free",
    testMatch: /harness\/auth-free\.setup\.ts/,
    dependencies: ["preflight"],
    use: desktop,
  },
  {
    name: "auth-premium",
    testMatch: /harness\/auth-premium\.setup\.ts/,
    dependencies: ["preflight"],
    use: desktop,
  },
  {
    name: "smoke-desktop",
    testDir: "tests/e2e/smoke",
    dependencies: ["preflight"],
    use: desktop,
  },
  {
    name: "smoke-mobile-390",
    testDir: "tests/e2e/smoke",
    dependencies: ["preflight"],
    use: mobile390,
  },
  {
    name: "proofs",
    testDir: "tests/e2e/proofs",
    dependencies: ["preflight"],
    use: desktop,
  },
  {
    name: "desktop",
    testDir: "tests/e2e/features",
    dependencies: ["preflight", "auth-free", "auth-premium"],
    use: desktop,
  },
  {
    name: "mobile-390",
    testDir: "tests/e2e/features",
    // Everything NOT tagged @desktop-only (writes and expensive lines run
    // once, on desktop — tests/e2e/features/README.md).
    grepInvert: /@desktop-only/,
    dependencies: ["preflight", "auth-free", "auth-premium"],
    use: mobile390,
  },
];

const morningProjects = [
  { name: "preflight", testMatch: /harness\/preflight\.setup\.ts/ },
  {
    name: "morning",
    testDir: "tests/e2e/features",
    grep: /@morning\b/,
    dependencies: ["preflight"],
    use: desktop,
  },
];

export default defineConfig({
  testDir: "tests/e2e",
  outputDir: "test-results",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["json", { outputFile: "qa-evidence/last-run.json" }]],
  use: {
    baseURL: peek?.origin || undefined,
    trace: "off",
    screenshot: "off",
    video: "off",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    locale: "en-US",
  },
  projects: productionMorning ? morningProjects : previewProjects,
});
