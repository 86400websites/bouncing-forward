# Sprint Record — T0 — Testing readiness (Launch Gate Phase 0)

> Permanent record of the sprint that installed the Launch Gate harness, proved it on a deployed Preview, and prepared the feature list for owner approval. Saved with `/sprint-prompt save` on 9 September 2026 before merge; the owner merges PR #36.

## Summary

| Field         | Value                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprint        | T0 — Testing readiness (Launch Gate Phase 0 + Phase 1 draft)                                                                                                   |
| Branch        | `codex/testing-readiness` (from `main` at `ffae77a803d8be5ccf3d13d592e7f0c0639e5cfd`)                                                                          |
| PR            | #36 — https://github.com/86400websites/bouncing-forward/pull/36 (open; owner merges)                                                                           |
| Commits       | `e27a5bf` harness + fixes + records · `654444d` Next.js 15.5.24 + bootstrap script · `b9e8dc2` Preview evidence + harness fixes · `3c8eea0` untrack August zip |
| Dates         | 8–9 September 2026                                                                                                                                             |
| Operator      | Claude Code (`/activate-testing`), owner Khalid Siddiqui (86400websites)                                                                                       |
| Commit / Push | Authorised by the owner on 9 September 2026 (“commit yes push yes”) after the candidate was reviewed; NO before that                                           |

## Prompts used

1. The activation prompt in `docs/sprint-prompts/testing-activation.md` (8 September 2026 — Phase 0, safe-Preview verification, feature list draft; Commit: NO, Push: NO).
2. The second-round `/activate-testing` prompt (9 September 2026), verbatim:

```text
Complete the testing setup for Bouncing Forward, then guide us through:
manual Preview testing → automated tests → fixes → full automated rerun
→ final manual Preview testing.

Explain everything in simple English. Give me only the dashboard actions
you actually need, in the order I should do them.

Read CLAUDE.md, docs/PROJECT-STATUS.md,
.claude/skills/activate-testing/SKILL.md,
docs/testing-setup/SETUP-CHECKLIST.md,
docs/ENVIRONMENT-PARITY.md, and docs/FEATURE-LIST.md.
Inspect the current files rather than assuming old status notes are accurate.

CURRENT STATE
- The site is live at https://www.bouncing-forward.com.
- Production and Preview Stripe variables have been added in Vercel.
- Supabase variables exist for both environments.
- TEST values are prepared locally in .env.local.
- Never open, print, copy, or modify files containing actual secret values.
  Ask me to enter dashboard values privately, referring to variable names only.
- Preserve existing uncommitted work on codex/testing-readiness.
- The testing setup and Google Search Console preparation are not yet deployed.
- Full feature tests have not been written; the feature list needs my approval.

AUTHORIZATION AND SCOPE
Complete local testing setup and the focused fixes listed below.
Allowed changes: testing configuration, tests, testing workflows and scripts,
necessary testing dependencies/lockfile, relevant testing/status documentation,
and the application files directly required for password reset, contact-form
delivery, Stripe purchase identification/webhook handling, Google verification
and sitemap corrections. Preserve approved copy/design and unrelated behavior.

Commit: NO. Push: NO.
Prepare a concrete, reviewed summary of what must be published, then ask for
commit/push authorization. Do not merge, deploy to Production, change provider
settings, apply database migrations, or resend live Stripe events automatically.
Do not include unrelated local files or the development reference pack.

MANUALLY REPORTED BUGS
1. Reset Password does not work.
2. The contact form does not work.

Treat these as reported failures, not diagnosed causes. Ask me what I did,
what happened, and what I expected if that information is needed.
Inspect and reproduce safely, identify code versus configuration causes,
make focused fixes, and add regression coverage after feature-list approval.

Password reset coverage must include:
- Requesting the reset.
- Email delivery to a controlled inbox.
- Returning to the correct environment.
- Saving a new password and logging in with it.
- Rejecting invalid, expired, or reused reset links.

Contact-form coverage must include:
- Valid submission and actual inbox delivery.
- Invalid input.
- Clear success/failure behavior.
- No false success when delivery fails.

STRIPE ISSUE
The live webhook URL has been changed to:
https://www.bouncing-forward.com/api/stripe/webhook

The previous address without www returned HTTP 308.
Confirm saved settings and delivery evidence; do not assume the URL change
alone proves that payments grant access.

A failed event supplied by the owner belonged to Unretire:
metadata.app = unretire, mode = subscription, return URLs on unretireproject.com.
Bouncing Forward currently lacks sufficient purchase-origin checks.

Fix purchase identification so Bouncing Forward safely ignores unrelated
events from the shared Stripe account before database writes or emails.
Validate the intended product/payment environment using trusted evidence.
Preserve legitimate Bouncing Forward purchases, including existing purchases
and supported legacy flows; do not blindly reject historical purchases
just because a newly introduced metadata field is absent.
Do not replay the Unretire event into Bouncing Forward.

PREVIEW SETUP
The Vercel overview screenshot showed Production and older branch Previews.
We still need a verified Preview of the current candidate code.

Prepare the branch for publication. After authorization and publication,
verify the actual Preview's project, environment, code version and settings.
Do not assume bouncing-forward.vercel.app is Preview: it is recorded as Production.

Then give me exact, complete copy-paste addresses for:
- Stripe Sandbox webhook destination.
- TEST Supabase allowed redirect URLs.
- Any required Preview site-address setting.

Verify that the sandbox webhook reaches the same candidate code being tested,
including sanctioned access through Preview protection.
Local Stripe testing uses its own listener/signing secret; .env.local does not
configure deployed Preview.

SHARED EMAIL / FORM / ACCESS-CODE SETTINGS
I have chosen to retain shared Mailchimp, Formspree and legacy access-code
settings between Preview and Production.

Respect that decision and record the setup honestly as shared, not isolated.
Use only controlled test identities/inboxes and clearly labelled test messages.
Do not contact customers or run high-volume abuse tests against shared services.
Explain any specific test that cannot safely run under these settings.
Record required manual evidence and cleanup; never mark blocked coverage PASS.

TEST RUNNER
Use the actual Bouncing Forward variable names:
E2E_FREE_USER_EMAIL
E2E_FREE_USER_PASSWORD
E2E_PREMIUM_USER_EMAIL
E2E_PREMIUM_USER_PASSWORD

Verify both TEST accounts exist and have the appropriate access.
Identify the remaining runner credentials by name, including Vercel deployment
verification and TEST database evidence access. GitHub configuration may follow
later if an approved local runner can execute against the verified Preview.
Do not assume Vercel application variables are available to the test runner.

FEATURE COVERAGE
Refresh docs/FEATURE-LIST.md against the current code and requirements.
Include the reported password-reset/contact bugs and the Stripe issue.
Strengthen coverage for:
- Duplicate purchase attempts and duplicate charges.
- Payment succeeds but access storage fails; retry restores access.
- Another user's payment reference cannot grant access.
- Invalid/expired/reused password-reset links.
- Correct assessment scoring, not merely displaying a result.

Present the updated list for my written approval before writing the full
feature suite. Setup smoke/proof checks may run beforehand.
Distinguish missing setup from product bugs and test failures.

GOOGLE SEARCH CONSOLE
Inspect and preserve the prepared public/google777f049a86d5990c.html file
and sitemap corrections. Confirm the verification content matches the supplied
file and the sitemap lists real, intended indexable pages.
These changes still require review and deployment.
After deployment, give me the verification URL and sitemap URL.
Do not claim GSC verification or sitemap submission has happened.

EXECUTION AND FINISH
Complete independent local preparation while dashboard actions are pending.
Run appropriate existing checks; report unavailable checks accurately.
Do not conceal missing dependencies, failed checks, skipped tests or absent evidence.

Once Preview setup is verified:
1. Give me a short manual testing checklist.
2. Incorporate my findings and obtain feature-list approval.
3. Write/run the automated suite.
4. Fix verified defects and rerun failed tests during repair.
5. Run the entire suite against the final candidate.
6. Give me the final manual recheck checklist.

Keep Production morning checks disabled.
End each stage with: completed, remaining blockers, and my next exact action.
```

## What shipped

- **Launch Gate harness** (`playwright.config.ts`, `tests/e2e/`): explicit target modes (`local` / `preview` / `production-morning`); preflight that verifies a deployment through the read-only `/api/health` identity route (environment, commit, project, TEST Supabase for the public and privileged client, Stripe key mode) and refuses Production, foreign hosts, wrong commits, live keys or the PROD database; bypass secret sent once via Vercel's cookie hand-off, never across redirects; SM-001 smoke (desktop + 390px), proofs P1a/P6a, one auth-setup per role; `test:e2e*` scripts; manual `preview-tests.yml`; `morning-check.yml` disabled (no cron, variable-gated, refuses zero `@morning` specs); owner-run tools `bootstrap-local-runner.mjs` and `mailchimp-premium-audit.mjs`.
- **Application fixes (owner-authorised):** `src/lib/request-origin.ts` (trusted-host origins for auth emails and Stripe returns); `src/app/auth/confirm/route.ts` (resolved-URL return-path check incl. control characters, never crashes, reset failures land on `/forgot-password?error=link` with a notice); `src/app/forgot-password/page.tsx` notice; `src/components/site/contact-form.tsx` (email validated first, success only on provider confirmation); `src/lib/stripe/identify.ts` + webhook + verify route (shared-account purchase identification: one-time mode, `metadata.app` marker, legacy return-URL / Payment-Link-by-price / old metadata shapes honoured, foreign events answered 200 “ignored”, live/test mismatch → 500); `src/lib/stripe/checkout.ts` marker; `src/app/api/health/route.ts` (reduced on Production); `src/app/sitemap.ts` (`/podcast` removed, Premium + 8 posts added); `public/google777f049a86d5990c.html`.
- **Dependencies:** `@playwright/test` 1.63.0; `next` + `eslint-config-next` 15.5.24 (audit gate).
- **Records:** `docs/FEATURE-LIST.md` v2 (awaiting approval), `docs/ENVIRONMENT-PARITY.md`, `docs/PROJECT-STATUS.md`, `docs/TECH-ARCHITECTURE.md`, `docs/testing-setup/*`, `tests/e2e/README.md`; `.gitignore` (harness artefacts, `development/`, `.pnpm-store/`, root Google file, August zip); `bouncing-forward-30august-4.40.zip` untracked (local copy kept).

## Checks and results

| Check                                                 | Result                                                                                                                                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm typecheck`, `pnpm lint`, `pnpm build`           | pass at every commit (local)                                                                                                                                                 |
| `pnpm format:check`                                   | fails locally on ~180 untouched CRLF files (Windows checkout artefact); the LF-normalised, CI-equivalent check passes on every changed file; CI “Formatting is clean” passed |
| `pnpm audit --prod --audit-level=critical`            | failed at `e27a5bf` on pre-existing Next.js 15.5.20 advisories; passes from `654444d` (0 critical; 2 moderate, 5 high remain, not gating)                                    |
| Code Check (CI)                                       | green at `654444d`; re-runs on `b9e8dc2` / `3c8eea0` (docs, tests, .gitignore only) — confirm on the PR                                                                      |
| Preview preflight / smoke / proofs / fixture sign-ins | pass on the Preview of `654444d` and on the branch alias serving `b9e8dc2` (9 Sep 2026); sanitised records in the gitignored `qa-evidence/`                                  |
| Secret-pattern scan of the diff                       | none                                                                                                                                                                         |
| Independent Codex review (WORKFLOW §6)                | **not yet run** — brief prepared at `docs/code-reviews/T0-testing-readiness-review.md`; required at head `3c8eea0` before merge                                              |

## Deviations and learnings

- Commit/Push started as NO and were authorised by the owner mid-sprint after the candidate summary; all publication happened on the sprint branch under that authorisation.
- Scope widened beyond pure testing on the owner's instruction (reset, contact, Stripe identification, GSC, sitemap) plus two supporting application files needed to avoid a Vercel API token (`/api/health`, `request-origin`). Next.js was bumped one patch line for the audit gate.
- The multi-agent review workflows hit session limits twice; the three reviewers' findings were triaged manually and the material ones fixed before publishing (tab/newline return-path bypass, fill-value leakage into uploaded reports, bypass header on cross-site redirects, over-broad trusted-host rule, Payment-Link sessions, silent live/test mismatch).
- Preview protection is Vercel Authentication: unauthenticated clients get a redirect to Vercel sign-in, which the owner's logged-in browser hid; the preflight now recognises that form.
- The owner pasted a Stripe screenshot showing the bypass secret in the webhook URL → **rotate the Protection Bypass for Automation secret** and update Vercel Preview, GitHub, `.env.e2e.local` and the Stripe destination.
- The TEST project had no users; the owner created both fixtures with the bootstrap script; the premium entitlement was added through the approved TEST connection.

## Follow-ups (owners)

1. Rotate the bypass secret (owner) — before any further Preview run.
2. Independent Codex review at head `3c8eea0` (owner runs the brief) → merge PR #36 → one-line “setup done” note (owner).
3. Send a Stripe test event to the sandbox destination to prove the Preview's `STRIPE_WEBHOOK_SECRET` matches (owner; 200 = match).
4. Approve or amend `docs/FEATURE-LIST.md` (owner) → Phase 2 write specs → Phase 3 full run on the Preview → fix loop → GO/NO-GO (next session, `/activate-testing`).
5. Manual Preview checks owed by the owner: premium downloads, reset flow end to end, one labelled contact message, Buy-as-visitor → Create account.
6. Mailchimp: match the three `premium`-tagged members against Bouncing Forward's Stripe payments (owner).
7. Housekeeping decisions: `docs.zip` still tracked; three truncated-name compass icon copies; assessment table in migrations unused; `/privacy` + `/terms` confirm items.
