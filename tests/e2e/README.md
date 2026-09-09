# Launch Gate harness — how to run it safely

Playwright suite for Bouncing Forward. The rules it enforces come from
`docs/ENVIRONMENT-PARITY.md` §10 and §12; the owner-facing explanation is
`docs/testing-setup/TESTING-GUIDE.md`. Variable **names** only — values live
in the owner's secret stores (a gitignored `.env.e2e.local`, the shell, or
GitHub Actions), never in tracked files.

## Targets

Every run must say what it is aiming at. The `preflight` project verifies it
before any test runs and writes a sanitised record to `qa-evidence/preflight.json`.

| `PLAYWRIGHT_TARGET`  | Accepts                                     | Also required                                                       | Refused                                                                                                  |
| -------------------- | ------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `local`              | `http://localhost:*` / `http://127.0.0.1:*` | —                                                                   | any other host                                                                                           |
| `preview`            | a `*.vercel.app` deployment of this project | `PLAYWRIGHT_EXPECTED_SHA`                                           | Production hosts; wrong project; wrong commit; Production database or live Stripe wired into the Preview |
| `production-morning` | the recorded Production host only           | `MORNING_TEST_EMAIL`, `MORNING_TEST_PASSWORD` (when a spec logs in) | any bypass/privileged/TEST variable present; any spec not `@morning`                                     |

`PLAYWRIGHT_BASE_URL` is always required and must be a bare origin (no path,
query or fragment). Zero selected tests fails the run (Playwright default —
never pass `--pass-with-no-tests`).

**How a Preview is verified without a hosting API token.** The site exposes a
read-only identity route, `/api/health`, filled from the facts Vercel injects
at build time. The preflight reads it (sending the bypass secret only when the origin actually answers 401/403) and
requires: environment `preview`, the commit equal to `PLAYWRIGHT_EXPECTED_SHA`,
a production address that is ours (project identity), the TEST Supabase
project for both the public and the privileged client, and a test-mode Stripe
key. `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` (+ `VERCEL_TEAM_ID`) are an optional
extra cross-check through Vercel's API — set both or neither.

## Variables (names only)

| Name                                                                                  | Purpose                                                                                                                                                                       | Where the value lives                     |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `PLAYWRIGHT_TARGET`, `PLAYWRIGHT_BASE_URL`                                            | mode + origin                                                                                                                                                                 | `.env.e2e.local` / shell / workflow input |
| `PLAYWRIGHT_EXPECTED_SHA`                                                             | commit the Preview must serve                                                                                                                                                 | `.env.e2e.local` / shell / workflow input |
| `VERCEL_AUTOMATION_BYPASS_SECRET`                                                     | deployment-protection bypass: sent once to the verified Preview origin using Vercel's cookie hand-off (redirects disabled); never attached to other requests or redirect hops | Vercel Preview env + `.env.e2e.local`     |
| `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`                                 | optional extra cross-check through Vercel's API                                                                                                                               | `.env.e2e.local` / GitHub Actions secrets |
| `E2E_FREE_USER_EMAIL` / `E2E_FREE_USER_PASSWORD`                                      | TEST account without the Book Package                                                                                                                                         | `.env.e2e.local` / GitHub Actions secrets |
| `E2E_PREMIUM_USER_EMAIL` / `E2E_PREMIUM_USER_PASSWORD`                                | TEST account that owns the Book Package                                                                                                                                       | `.env.e2e.local` / GitHub Actions secrets |
| `E2E_OWNER_MAILBOX`                                                                   | owner-controlled mailbox (plain address); tests derive plus-addressed identities such as `+bf-e2e-newsletter`                                                                 | `.env.e2e.local` / GitHub Actions secrets |
| `E2E_SUPABASE_URL` / `E2E_SUPABASE_SECRET_KEY`                                        | TEST-project privileged read for record checks (P1/P5); refused unless the host is the TEST project                                                                           | `.env.e2e.local` / GitHub Actions secrets |
| `E2E_STRIPE_SECRET_KEY`                                                               | Stripe TEST-mode key for payment proofs; a live prefix is refused                                                                                                             | `.env.e2e.local` / GitHub Actions secrets |
| `E2E_STRIPE_WEBHOOK_SECRET`                                                           | signing secret of the Preview's sandbox webhook endpoint, for synthetic signed events                                                                                         | `.env.e2e.local` / GitHub Actions secrets |
| `E2E_LEGACY_ACCESS_CODE`                                                              | one legacy access code for the shared-code lines (shared with Production by owner decision); never printed                                                                    | `.env.e2e.local` / GitHub Actions secrets |
| `E2E_MAILCHIMP_API_KEY` / `E2E_MAILCHIMP_AUDIENCE_ID` / `E2E_MAILCHIMP_SERVER_PREFIX` | read-back and cleanup of the test identity in the shared audience (owner decision); server prefix only if needed                                                              | `.env.e2e.local` / GitHub Actions secrets |
| `MORNING_TEST_EMAIL` / `MORNING_TEST_PASSWORD`                                        | dedicated least-privilege Production login for the approved morning check only                                                                                                | GitHub Actions secrets                    |
| `PRODUCTION_URL`                                                                      | morning-check target — must be exactly `https://www.bouncing-forward.com`                                                                                                     | GitHub Actions variable                   |

`.env.e2e.local` is read by `playwright.config.ts` when it exists and is covered
by the `.env*` ignore rule. Keep it separate from `.env.local`: the application's
own variables are never read by the harness.

## Commands

```bash
pnpm test:e2e:list     # discover specs without running anything
pnpm test:e2e:smoke    # SM-001 on desktop + 390px mobile (after preflight)
pnpm test:e2e:proofs   # read-only setup proofs (P1a, P6a)
pnpm test:e2e          # full suite — Preview only, after feature-list approval
pnpm test:e2e:failed   # re-run only the specs that failed last time
```

Local dry run against a production build (harness validation, never a
Preview pass):

```bash
pnpm build && pnpm start
PLAYWRIGHT_TARGET=local PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm test:e2e:smoke
```

Owner-run, read-only audit of the shared Mailchimp audience (the agent never
reads `.env.local`):

```bash
node --env-file=.env.local tests/e2e/tools/mailchimp-premium-audit.mjs
```

## Evidence

- `qa-evidence/` and `test-results/` are gitignored. Traces, screenshots,
  videos and the HTML report are disabled; the JSON summary carries titles
  and error messages only; it stays on the machine that ran the tests and is never uploaded (error text can include typed values).
- Saved sessions live in `tests/e2e/.auth/` (gitignored).
- `.github/workflows/preview-tests.yml` runs the suite in CI with secrets
  referenced by name; `.github/workflows/morning-check.yml` stays disabled
  (manual trigger only, gated by the `MORNING_CHECK_ENABLED` variable) until
  the gate passes and the owner approves the `@morning` selection.
