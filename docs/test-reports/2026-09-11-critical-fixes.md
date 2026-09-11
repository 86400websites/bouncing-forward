# Critical fixes — 11 September 2026

Implementation handoff, not an independent review or a new Launch Gate verdict.
Original evidence: `2026-09-11-test-report.md` in this directory.

## Follow-up after Claude verification

**Correction: returning-subscriber recovery is not verified.** The original
summary overstated what the mocked unit test proved. Claude's local tests
confirmed the public premium-tag rejection and malformed-body fixes; the owner
reported passing standard checks after renaming the unit-test loader variable
from `module` to `mod`. That correction is preserved.

Two bounded diagnostic PUTs against only the existing `+bf-e2e-newsletter`
fixture captured the actual provider rejection (credentials/identity withheld):

- Before and after each request: HTTP 200, member status `archived`.
- PUT with `status: subscribed`: HTTP 400, title `Invalid Resource`.
- Redacted detail: `[email] has signed up to a lot of lists very recently;
we're not allowing more signups for now`.
- No tags were applied, no contact was unarchived, and no residual changes
  required cleanup. Further live signup attempts stopped.

This evidence identifies a temporary provider signup restriction. It does not
establish that Mailchimp rejects all archived-contact restoration, nor justify
unarchiving first, forcing opt-in, switching identities, or restoring false 200s.
The `status: subscribed` request remains; real recovery needs a later controlled
check after the restriction clears. No cooldown duration was supplied by the API.

Follow-up changes:

- Recognize this observed HTTP 400 response as a retryable provider restriction;
  the public route returns 429 with the copy in
  `docs/content/page-copy/newsletter-errors.md`. The webhook's existing retry
  path can retry this temporary failure instead of acknowledging it permanently.
- For explicit public sign-ups, require the member response to say `subscribed`
  before applying tags or reporting success. HTTP 200 with `archived`,
  `unsubscribed`, `pending`, missing status, or null is not a successful signup.
- Regression checks now cover the observed provider error and non-subscribed
  HTTP-success responses. **7 isolated tests pass**; this is not live recovery
  evidence.

Follow-up standard checks:

- `node --test tests/unit/critical-fixes.test.mjs`: **7 passed, 0 failed**.
- `node node_modules/typescript/bin/tsc --noEmit`: **passed**.
- `node node_modules/next/dist/bin/next build`: **exit 0**, 42 static pages;
  the lint phase still reports the missing local React Hooks plugin.
- Targeted Prettier checks and source `git diff --check`: **passed**.
- `pnpm typecheck` and `pnpm lint` again stalled without output and were
  stopped; the installed binaries above were used instead.
- `node node_modules/eslint/bin/eslint.js`: **blocked** by missing
  `eslint-plugin-react-hooks` in this session. An attempt to check whether this
  was sandbox-related by running ESLint outside the sandbox was rejected by
  automatic approval review because the workspace was out of credits. No
  dependencies or configuration were changed. Claude's earlier lint pass is
  owner-supplied evidence for the previous candidate, not an independent pass
  for these follow-up changes.

PR-003's broad `status >= 400` assertion can pass on a Mailchimp failure. Such a
pass is **not evidence of bot protection**. Upstash/Turnstile remain absent and
deferred. Existing approved E2E specs were not changed. The stale `premium` tag
on `+bf-e2e-tagprobe` was not removed. FM-010 and the webhook portion of PR-006
still require the correctly configured candidate Preview; the full gate remains
unrun. No commit, push, or deployment was authorized or performed.

## Scope

- FM-011: the public newsletter endpoint refuses well-formed tags other than
  `newsletter` and `full-assessment`, before contacting Mailchimp. Missing or
  malformed sources retain the approved FM-005 fallback to `newsletter`.
- FM-002/005/006: explicit public sign-ups now request `status: subscribed` as well
  as `status_if_new`; returning-subscriber recovery remains unverified. Stripe webhook retries
  do not change an existing member's subscription preference.
- FM-010: tag HTTP errors and network failures now return a retryable failure.
  The existing webhook grants account access first, then returns 500 on a tag
  failure so Stripe can retry. Member-upsert throttling (429) is also retryable.
- PR-006: newsletter and legacy access-code handlers reject null/primitive JSON
  with a friendly 400. Existing valid-code handling and newsletter honeypot
  behavior are preserved.

The Mailchimp request follows its [member upsert API](https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/).
Real subscription read-back and journey/inbox delivery still need Preview evidence;
an accepted tag does not prove an email arrived. Journey re-entry settings are
outside this code change.

## Files changed by this task

- `src/app/api/newsletter/route.ts`
- `src/app/api/premium/route.ts`
- `src/lib/mailchimp.ts`
- `tests/unit/critical-fixes.test.mjs` (isolated provider mocks; no external writes)
- `docs/content/page-copy/newsletter-errors.md` (follow-up error copy)
- This handoff.

Existing user edits to the E2E suite, configuration, report, roadmap, and status
were preserved. No existing feature test was changed, skipped, or disabled.
No dependencies, environment values, schema, auth flows, or design were changed.

## Initial implementation verification (before the follow-up)

- `node --test tests/unit/critical-fixes.test.mjs`: **5 passed, 0 failed**.
  Covers public tag restrictions, valid sign-ups/fallback, honeypot, malformed
  JSON, valid/invalid legacy codes, explicit resubscription, provider failures,
  and signed webhook retry with access retained and no duplicate entitlement.
  These are isolated handler checks, not new approved Launch Gate feature lines.
- `pnpm typecheck`, `pnpm lint`, and targeted `pnpm exec prettier --write ...`
  stalled without output and were stopped. Installed binaries were used directly;
  nothing was installed or reconfigured.
- `node node_modules/typescript/bin/tsc --noEmit`: **passed**.
- `node node_modules/eslint/bin/eslint.js`: **blocked**, missing local
  `eslint-plugin-react-hooks`. This task did not change dependencies.
- `node node_modules/prettier/bin/prettier.cjs --check .`: **failed**, warnings
  in 116 files untouched by this task. No broad formatting was applied.
- Targeted Prettier check of the changed source and unit test: **passed**.
- `git diff --check` on the three changed source files: **passed**.
- `node node_modules/next/dist/bin/next build`: **completed, exit 0**, all 42
  static pages generated. Its lint phase reported the same missing React Hooks
  plugin, so this is not a clean lint pass.
- Full/targeted Preview E2E: **not run**. These local changes are uncommitted and
  have no deployed candidate SHA. Testing the existing Preview would test old code.

## Open items and delivery

- Owner explicitly deferred Upstash/Turnstile in this session: “no need for them
  yet.” PR-001–PR-004 remain open; this is not a GO verdict.
- Cosmetic/content findings (404 copy, Course share image, FAQ count, intermittent
  YouTube complaint) remain outside the requested critical-only fixes.
- Manual evidence remains owed. Real email delivery is not proven by unit tests.
- Branch: `claude/t1-gate-suite`; no commit, push, merge, or deployment performed.
  Suggested message: `fix: restrict newsletter tags and retry failed email tagging`.
  FM-011's existing separate-PR requirement remains applicable when publishing;
  this session has not created a PR.
- Roadmap/status closure remains pending Preview verification; the original
  report remains a historical record and has not been rewritten to claim passes.

## Claude rerun prompt

Read `docs/test-reports/2026-09-11-critical-fixes.md` and the original report.
Verify the critical fixes and preserve all existing work. Keep Upstash/Turnstile
deferred and leave cosmetic/content items alone. Run the isolated regression
tests and standard checks. Do not repeatedly retry the restricted Mailchimp test
address or treat PR-003's provider-error pass as bot protection. After the
restriction clears, verify subscription recovery with one controlled attempt.
Once this candidate is deployed to a verified Preview,
rerun the affected forms, complete payment flow, and PR-006, then the full Launch
Gate. Do not weaken tests or claim GO with open failures/manual evidence. Report
results and remaining issues briefly. Commit/Push: NO.
