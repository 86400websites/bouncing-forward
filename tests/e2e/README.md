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
| `local`              | `http://localhost:*` / `http://127.0.0.1:*` | —                                                                   | any other host; a build wired to the Production database or a live Stripe key (read from `/api/health`)  |
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
| `E2E_KEEP_TEST_USERS`                                                                 | optional switch (`1`): the `cleanup` project keeps the run's throwaway TEST users for manual evidence (MN-004 / MN-008); remove them later with `--project=cleanup`           | shell, for one run only                   |

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
pnpm exec playwright test --grep @PY-001          # one approved line
pnpm exec playwright test --project=cleanup       # cleanup on its own (after E2E_KEEP_TEST_USERS=1, or a crashed run)
node tests/e2e/tools/report-rows.mjs              # Markdown rows for the report from qa-evidence/last-run.json
```

## Projects

| Project                             | What it runs                                                                                                                             |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `preflight`                         | target verification; writes `qa-evidence/preflight.json`; its **teardown is `cleanup`**                                                  |
| `cleanup`                           | after every dependent project: deletes throwaway TEST users, archives shared-audience test members, writes `qa-evidence/run-record.json` |
| `auth-free`, `auth-premium`         | sign the two fixture accounts in; save `tests/e2e/.auth/<role>.json`                                                                     |
| `smoke-desktop`, `smoke-mobile-390` | SM-001                                                                                                                                   |
| `proofs`                            | read-only setup proofs                                                                                                                   |
| `desktop`                           | every feature spec                                                                                                                       |
| `mobile-390`                        | every feature spec **not** tagged `@desktop-only` (writes and expensive lines run once, on desktop)                                      |
| `morning` (production-morning only) | `@morning` specs alone                                                                                                                   |

## Harness modules (tests/e2e/harness/)

Specs import `test`/`expect` from `fixtures.ts` and reach everything else
through these modules; none logs a value.

| Module             | Purpose                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `target.ts`        | strict target resolution (refuses Production, live keys, the PROD database)                                                                       |
| `fixtures.ts`      | `test`, `expect`, `target`, `api`, `consoleErrors`; bypass admission (`admitContext`, `admitRequestContext`, `sameOriginApi`)                     |
| `auth.ts`          | `statePath`, `fillQuietly`, `submitLogin`, `loginAs`, `signIn`, `sessionCookies`                                                                  |
| `roles.ts`         | `apiAs` (signed-in request context), `openAs` (signed-in browser context)                                                                         |
| `identities.ts`    | `LABEL`, `runId`, `identity(kind)`, `randomPassword`, `isTestIdentity`, `isFixtureAccount`                                                        |
| `run-record.ts`    | `recordFixture`, `preflightRecord`, `requireDeploymentFact`; the qa-evidence files                                                                |
| `test-supabase.ts` | TEST-only admin: throwaway users, entitlements read-back, admin recovery tokens                                                                   |
| `public-client.ts` | the public Supabase config read from the served bundle; a visitor-grade client for RLS checks                                                     |
| `stripe.ts`        | test-mode client, signed synthetic events, hosted Checkout driver, labelled test sessions, sanitised endpoint listing                             |
| `mailchimp.ts`     | `memberOf`, `archiveMember`, `expectTagged` (test identities only)                                                                                |
| `pages.ts`         | same-origin failure watcher, `settle`, `expectPdf`, `expectDownloadDenied`, `expectFriendlyJson`, head parsing, mobile menu, image/scroll helpers |
| `assessment.ts`    | Quick Look / Full Assessment drivers, newsletter stub, confirm dialogs, unlock flag                                                               |
| `secret-shapes.ts` | `secretShaped`, `redactSecrets`                                                                                                                   |

Identity kinds: stable `newsletter`, `assessment`, `honeypot`, `contact`
(one member each in the shared audience, the same address every run);
run-scoped `signup`, `buyer`, `buyer-legacy`, `reset`, `unknown`,
`buyer-b`, `buyer-visitor`, `buyer-foreign`, `buyer-paymentlink`,
`buyer-marker`, `buyer-nomarker` (suffixed with the run id). Every write
is registered with `recordFixture()` so the `cleanup` project can undo it
and the run record shows it.

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

## Bootstrapping the local runner (owner-run)

`tests/e2e/tools/bootstrap-local-runner.mjs` creates or resets the two TEST
fixture accounts through Supabase's admin API and writes every harness
variable it can derive into `.env.e2e.local` (the names in the table above).
It refuses to run against anything but the TEST project, copies only
test-mode Stripe values, and prints names — never values:

```bash
node --env-file=.env.local tests/e2e/tools/bootstrap-local-runner.mjs --owner-mailbox you@example.com --preview-url https://bouncing-forward-git-….vercel.app
```

Afterwards add `E2E_STRIPE_WEBHOOK_SECRET` by hand once the sandbox webhook
exists, and ask Claude Code to add the premium entitlement for the premium
account through the approved TEST connection.

## Evidence

- `qa-evidence/` and `test-results/` are gitignored (a failed test's `error-context.md` page snapshot can name a test identity's address; it stays on this machine). Traces, screenshots,
  videos and the HTML report are disabled; the JSON summary carries titles
  and error messages only; it stays on the machine that ran the tests and is never uploaded (error text can include typed values).
- `qa-evidence/fixtures.json` lists every write a spec registered (identity
  kinds, `cs_test_` ids, message labels — never an address or value);
  `qa-evidence/run-record.json` records what the `cleanup` project did with
  each (cleaned / kept / not cleaned: `<variable>` absent / manual). Entries
  that could not be cleaned stay in `fixtures.json` for the next cleanup;
  an API failure fails the cleanup so residual data is never silent.
- `node tests/e2e/tools/report-rows.mjs` turns `qa-evidence/last-run.json`
  into Markdown rows (`| ID | Title | Result | Project | Note |`) with
  secret-looking text redacted — the only form of the JSON report that
  leaves the machine.
- Saved sessions live in `tests/e2e/.auth/` (gitignored).
- `.github/workflows/preview-tests.yml` runs the suite in CI with secrets
  referenced by name; `.github/workflows/morning-check.yml` stays disabled
  (manual trigger only, gated by the `MORNING_CHECK_ENABLED` variable) until
  the gate passes and the owner approves the `@morning` selection.

## Running the gate again later

The full Launch Gate runs against a Preview whose address three settings
point at: the TEST Supabase URL list (a wildcard covers every Preview of this
project), the Stripe sandbox webhook destination (one fixed address), and the
values in `.env.e2e.local`. That address is the branch alias of the **gate
branch `claude/t1-gate-suite`** —
`https://bouncing-forward-git-claude-t1-gate-suite-86400-s-projects.vercel.app`.

- **Keep the gate branch.** Do not delete it when its PR merges (untick
  "delete branch"). Vercel keeps serving the alias from the branch's latest
  commit, and the alias name is derived from the branch name — renaming the
  branch means updating the Supabase Site URL and the Stripe destination.
- **Before a later gate run** (a major release, or "run the launch gate"):
  bring the gate branch up to date with the candidate — normally
  `git checkout claude/t1-gate-suite && git merge main && git push` — wait
  for Vercel to deploy it, then set `PLAYWRIGHT_BASE_URL` to the alias and
  `PLAYWRIGHT_EXPECTED_SHA` to `git rev-parse HEAD` on that branch (in
  `.env.e2e.local` or the shell) and run `pnpm test:e2e`. The preflight
  refuses a stale alias, so a forgotten push cannot pass as a fresh run.
- **A single sprint's PR Preview** can run everything except the payment
  lines (`pnpm exec playwright test --grep-invert "@payments|@FM-010"`),
  because Stripe delivers webhooks only to the gate address. To run the
  payment lines on another Preview, point the Stripe sandbox destination at
  that Preview for the duration and back again afterwards.
- Nothing else needs re-creating between runs: the fixture accounts, the
  bypass secret and the local variables stay; the `cleanup` project removes
  the run's throwaway data.
