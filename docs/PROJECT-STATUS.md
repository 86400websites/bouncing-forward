# Bouncing Forward — Project Status

_Last updated: 10 September 2026 (Launch Gate Phase 2 — suite written on `claude/t1-gate-suite`)._

## Where the project stands

The site is **live and selling** at https://www.bouncing-forward.com —
Stripe live mode verified with a real discounted purchase, Supabase
accounts + entitlements in production, three Mailchimp journeys active
from the authenticated info@bouncing-forward.com domain, nine course
videos embedded, and Mohammad's development system installed and
enforced (Code Check on every PR; Supabase MCP dev/prod per
docs/SUPABASE-MCP-SAFETY.md).

## This sprint (4 Sep)

Heather's site-wide fix list applied: full American-spelling sweep,
login-era copy on Home/FAQ/Premium (access-code UI removed from the
Premium page; log in / create account instead — legacy codes still
honoured automatically), blog slug `a-setback-is-not-a-staircase`
(+redirect), Resources gains the 7 Step Journal tool card, Where's
Here? gains the signup block, metadata fixes (Home og description,
Book/Author og:image, own og for Log In/Create Account), `/learn` and
`/workshops` deleted (redirects kept), compass icon refs corrected
(**files must be renamed — see RENAME-THESE.txt**), and the new
**/privacy** and **/terms** pages carrying Heather's copy with every
open detail visibly marked "confirm".

## Open confirmations

Items 1–4 were settled by the owner on 11 September 2026 (sprint T3, PR #39) and
no confirm marker remains on /privacy or /terms:

1. ~~Legal entity name + country~~ — settled: "operated by 86400" on both pages
2. ~~Refund policy~~ — settled by removing the paragraph (the owner's other site
   states none); the fix-or-refund promise stays
3. ~~Governing-law country~~ — settled by removing the section; Contact is Terms §12
4. ~~Reply-within-30-days promise~~ — settled: "we will reply within 30 days"

Still open:

5. Enterprise page: is the webinar free? keep "partnership with Alliance"?
6. Remove `noindex` from /privacy + /terms — **1–4 are now settled, so this is
   ready whenever the owner says so** (one line in each page's metadata)
7. Darlene: the two free PDFs print the wrong domain
   ("bouncingforward.com" — no hyphen) — fix inside the PDFs
8. Mailchimp journey emails: rename "The First Week" wording (Heather)
9. Privacy intro wording (review Should-fix, 11 Sep): the paragraph above §1
   still says Bouncing Forward "is run by Maher Kaddoura and is part of Half a
   Life", beside "operated by 86400" in §1

## Launch gates still open (Mohammad's system)

- Automated test suite — Phase 0 local preparation done on 8 September 2026
  on `codex/testing-readiness` (uncommitted; Commit/Push: NO): Playwright
  1.63.0 pinned, `playwright.config.ts` with desktop + 390px mobile
  profiles, target preflight that refuses Production/unknown hosts and
  verifies the Preview's project, environment and commit via Vercel's API,
  origin-scoped bypass, two auth-setup roles (free / premium) that fail
  closed without TEST credentials, SM-001 homepage smoke, read-only P1a
  proof, `test:e2e*` scripts, `preview-tests.yml` (manual) and
  `morning-check.yml` (disabled, no cron). Local checks green (typecheck,
  lint, build; Prettier clean on LF-normalised content); SM-001 passed
  locally against `next start` as harness validation only. **Phase 0 is
  not complete:** it still needs commit → push → PR → Preview, the owner's
  Vercel API/bypass values, TEST fixture accounts (in `hmcojplrqoqhyigvtgyp`;
  identities and the token-free verification superseded on 9 Sep — see the
  next bullet), the §12 proofs,
  the smoke pass on that verified Preview, and the setup-PR merge. The
  earlier note about test Supabase keys in Vercel Preview is still not
  verification of database, payment, webhook or email isolation — see
  `docs/ENVIRONMENT-PARITY.md` §3–§5 and §12. `docs/FEATURE-LIST.md` is
  drafted and **awaits owner approval**; no product specs are written and
  the morning check stays disabled. Note: the untracked `development/`
  reference pack fails `prettier --check` (52 files) — keep it out of the
  setup commit or add it to `.prettierignore` by decision.
- 9 September 2026 (same branch, still uncommitted): live host is now
  `https://www.bouncing-forward.com` (apex answers 308 → www; the
  `vercel.app` host still answers directly). Focused fixes prepared for
  review: auth/checkout return addresses only trust our own host names;
  the email-callback return path refuses `//evil.example`; a failed or
  reused reset link now lands on "Reset your password." with a clear
  notice; contact form validates the email and treats only a provider
  confirmation as success; Stripe purchase identification for the
  **shared** Stripe account (`lib/stripe/identify.ts`: one-time mode +
  `metadata.app = bouncing-forward`, with legacy shapes accepted by our
  return address; foreign events answered 200 "ignored", never written or
  emailed; live/test mode checked; the legacy verify route uses the same
  rule). Sitemap corrected (`/podcast` removed; Premium + 8 posts added)
  and the Google verification file added under `public/`. TEST project
  checked through `supabase-dev` (read-only): `entitlements` present with
  RLS, **0 users** — both E2E accounts still to be created; the
  assessment table from migration 001 was never applied there. **Owner
  decision:** Mailchimp, Formspree and legacy access codes stay shared
  between Preview and Production — recorded as non-isolated (§9 manual
  procedure): controlled test identities only, one labelled message per
  run, cleanup recorded, no high-volume abuse tests against them.
  **Incident check owed:** because the old webhook tagged any paid
  checkout on the shared account, verify in Mailchimp whether any
  non-Bouncing-Forward buyer carries the `premium` tag. Live webhook now
  points at `www` (owner change); delivery evidence pending. Owner
  authorised Commit/Push on 9 Sep 2026 and asked to avoid a Vercel API
  token: a read-only `/api/health` identity route now lets the preflight
  verify environment, commit, project and TEST/test-mode wiring directly;
  test identities move to plus-addresses on the owner's mailbox
  (`E2E_OWNER_MAILBOX`); a read-only Mailchimp audit script is provided
  for the owner to run (`tests/e2e/tools/`). Published as `e27a5bf` → PR #36.
  First CI run failed the audit gate on pre-existing Next.js 15.5.20
  critical advisories (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4) — patched
  by pinning `next` and `eslint-config-next` 15.5.24; Vercel's first
  deployment failed because the git author lacked team access (owner
  fixed). Production Supabase URL configuration set by the owner on 9 Sep
  (Site URL `www`; `/**` redirects for `www` and `vercel.app`). Mailchimp
  audit run by the owner: 9 members, 3 tagged `premium` (30 Aug–2 Sep) —
  owner to match them against Bouncing Forward's Stripe payments.
  `tests/e2e/tools/bootstrap-local-runner.mjs` added so the owner creates
  the TEST fixture accounts and `.env.e2e.local` without values in chat.
  **Preview evidence (9 Sep 2026):** PR #36 green (Code Check + Vercel);
  Preview `bouncing-forward-2d25v8xkf-86400-s-projects.vercel.app` of
  `654444d` verified by the preflight (environment preview, this project,
  TEST Supabase, test-mode Stripe, webhook secret set; protection = Vercel
  Authentication, bypassed via the sanctioned secret); SM-001 passed on
  desktop and 390px; proofs P1a/P6a passed; both fixture accounts signed in
  (premium entitlement added through the TEST connection). **Phase 0 is
  complete pending the owner's merge of PR #36**; the feature list awaits
  approval before any product spec is written.
- 10 September 2026: PR #36 was merged into `main` on 9 September
  (`07ef8c3`) and Production has served that commit since — the Google
  verification file answers 200 and the live sitemap no longer lists
  `/podcast` (both observed read-only). **Phase 0 is complete.** Two
  records are still owed: the owner's one-line dated "setup done"
  confirmation, and the independent review verdict for PR #36
  (`docs/code-reviews/T0-testing-readiness-review.md` still reads "review
  not yet returned" although the PR is merged — record the verdict, or
  note that the review was skipped). **Phase 1:** `docs/FEATURE-LIST.md`
  refreshed to draft v3 at head `07ef8c3` on branch `claude/t1-gate-suite`
  (uncommitted; Commit/Push: NO): one line added (IN-010, the read-only
  deployment identity route `/api/health`, found in code), stale
  statements corrected, per-item DONE/OWED on "Before tests can run";
  **awaiting owner approval** before any product spec is written. Owed
  before the full run (not before approval): bypass-secret rotation, TEST
  Supabase URL configuration for the Phase 2 Preview, the Stripe sandbox
  webhook destination plus one test event, and the Mailchimp read-back
  keys present in `.env.e2e.local`. The morning check stays disabled.
- 10 September 2026 (later): the owner **approved** `docs/FEATURE-LIST.md` v3
  in chat. **Phase 2 complete** on `claude/t1-gate-suite` (uncommitted;
  Commit/Push: NO): one Playwright test per approved line — 136 registered
  tests in 42 files (every line on desktop, read-only lines again at 390 px,
  the 12 MANUAL lines registered with their human steps), shared harness
  helpers (identities, TEST-only admin, Stripe test-mode + signed events,
  Mailchimp read-back, `cleanup` teardown project, `report-rows.mjs`), one
  `data-testid` hook in `auth-form.tsx`. Typecheck, lint and Prettier clean.
  Local read-only dry run against a production build wired to TEST: 40 of 45
  selected lines pass; the 5 failures are real findings — PG-003 scaffold
  line, PG-011 renders 13 FAQ items (line says 14), PG-018 no share image on
  the dynamic pages, PR-002 / PR-004 no rate or guess limits. **Blocker
  found by the scan, not tested:** `/api/newsletter` accepts `source:
"premium"` and so mails the shared access code to anyone (proposed line
  FM-011 awaits approval; fix = allow-list the tag). Next: PR → Preview →
  owner actions 2, 4, 5 and 7 of "Before tests can run" → Phase 3 full run
  on that Preview → report → fix sprint(s) → full re-run → GO/NO-GO.
  **Later the same evening (owner, in chat):** Commit/Push authorised for
  the Phase 2 branch; bypass secret rotated; TEST Supabase Site URL set to
  the gate branch's Preview address with a `/**` redirect for it and a
  wildcard for every Preview of the project; the Stripe sandbox destination
  created at that address with both checkout events (checked read-only);
  setup confirmed done ("Yes setup done"); FM-011 approved as a line, with
  its fix to ship as a separate small PR proven by the suite. **Keep the
  branch `claude/t1-gate-suite` after it merges** — its Preview alias is
  what those settings point at; later gate runs merge `main` into it and
  test its Preview (`tests/e2e/README.md`, "Running the gate again later").
  Committed as `aaf502d` and pushed; the gate alias served that commit
  within a minute and the preflight, SM-001 (desktop + 390 px), P1a and
  P6a passed on it with the rotated bypass secret. Independent review and
  the PR are the owner's next steps; Phase 3 runs in a new session.
- 11 September 2026 — **Launch Gate Phase 3 done: the first full Preview run, and its verdict is NO-GO.**
  Report: `docs/test-reports/2026-09-11-test-report.md`. Target: the gate alias at
  head `8b5460c` (preflight PASS — preview environment, TEST database both
  clients, Stripe test mode, protection bypassed). Final full run:
  **104 passed · 16 failed · 13 skipped · 4 blocked** (64 of 94 approved lines
  PASS, 13 FAIL, 12 MANUAL pending, 5 N/A or blocked). Cleanup green on every
  run (22 of 23 fixtures removed, 1 manual, 0 errors) — no residual test data.
  **The site is in better shape than the first run suggested:** the reported
  password-reset bug and contact-form bug both **fail to reproduce** (AC-003a–g
  and FM-007–FM-009 pass), a real $9.99 test purchase completed end to end with
  the access record written and both downloads opening (PY-001), the shared
  Stripe account's foreign events are ignored safely (PY-012), and every
  server-side gate holds for a visitor and a non-owner (PR-005, PR-007, AC-010–AC-013).
  **Four new findings** (details and severities in the report): (1) a person who
  previously came off the mailing list and signs up again is labelled but never
  put back on the list, so they get no email — this also makes the gate
  non-repeatable, because each run's cleanup archives the test contact
  (FM-002/005/006, High); (2) the buyer's `premium` label — which triggers the
  Book Package access email — is applied best-effort and its failure is
  silently swallowed (FM-010, High, intermittent); (3) a `null` JSON body makes
  `/api/newsletter` answer 500 instead of a friendly 400, and `/api/premium` is
  written the same way (PR-006, Medium); (4) the Course page intermittently logs
  a permissions-policy console complaint from the YouTube embeds at 390px
  (PG-001, Low). Known failures unchanged: FM-011 (approved Blocker),
  PR-001–PR-004 (no rate limits, no human check), PG-003, PG-011, PG-018.
  **Suite corrections made this session (tests only — no file under `src/` was
  touched, and no approved line was edited):** the shared free session was being
  destroyed mid-run because logging that account out ends every session it has;
  four `clearCookies()` calls were discarding the deployment-protection bypass
  cookie and landing on Vercel's sign-in page; a notice check matched Next's
  invisible route announcer; PDF downloads and page waits needed bounded but
  longer limits for a slow link; the Preview's own floating toolbar was
  swallowing a tap at 390px; two checks demanded one exact wording where the
  route legitimately uses either of two polite refusals. Files: `playwright.config.ts`,
  `tests/e2e/harness/{fixtures,pages}.ts`, `tests/e2e/features/accounts/{login,password-reset}.spec.ts`,
  `tests/e2e/features/forms/newsletter.spec.ts`, `tests/e2e/features/payments/{checkout,purchase}.spec.ts`,
  `tests/e2e/features/protection/pr-006-error-hygiene.spec.ts`. **Uncommitted — Commit/Push: NO.**
  PY-003, PY-005, PY-013 and PY-015 were blocked in the final full run by
  FM-010 failing earlier in the same serial file; all four passed in a targeted
  re-run at the same head. **Owner decisions owed:** PG-011 (14 vs 13 questions)
  and approval of proposed line FM-012 (returning unsubscriber), both stated in
  the report.
- 11 September 2026 (later) — **T2 and T3 merged; the site is launch-ready by the
  owner's decisions.** PR #38 (`0b5b66c`, review APPROVE at `48b959a`) shipped the
  suite corrections and the critical fixes: **FM-011 the Blocker is closed on the live
  site** (a `premium` tag can no longer be handed out by the public sign-up), PR-006's
  null-body 500s are gone on all three endpoints, the buyer's tag failure now makes
  Stripe retry instead of vanishing, and a returning subscriber is asked to be
  re-subscribed with the provider required to confirm it. PR #39 (`67a9935`, review
  REQUEST CHANGES at `2b23f42` → fixed → APPROVE at `7aa1819`) shipped the four Amazon
  listings, the six-check morning check (**Morning Check #1: Success**), and the settled
  Privacy/Terms copy (operator 86400; refund and governing-law paragraphs removed;
  30-day reply; dated 11 September; noindex kept by owner decision). GSC verified,
  sitemap submitted, 21 discovered. **Unproven, not disproven:** returning-subscriber
  recovery and buyer `premium` tagging, both blocked by Mailchimp's temporary
  per-address signup restriction on the test mailbox — one controlled sign-up check
  then a full gate run when it lifts. **Owner-deferred, recorded:** PR-001–PR-004
  (Upstash + Turnstile), error tracking, uptime monitoring, the second capture path for
  the primary conversion, the deliberate-failure test of the morning-check email, and
  the three cosmetic items. **Owner decisions open:** PG-011 (14 vs 13), proposed line
  FM-012, lifting noindex on the legal pages, and the Privacy intro wording (review
  Should-fix). Records: `docs/sprint-prompts/T2-*.md`, `T3-*.md`,
  `docs/code-reviews/T2-*-review.md`, `T3-*-review.md`.
- Sentry error tracking — needs the free account + DSN.
- Upstash + Turnstile form abuse controls — needs the two free
  accounts (4 values into Vercel).
- Branch protection saved but unenforced (GitHub free plan, private
  repo) — Mohammad's call on GitHub Team.

## How to resume

Latest canonical code = this tree. Deliverables flow: apply zip →
`pnpm run format:check && pnpm run build` → branch → PR → green Code
Check → merge. Full working history lives in the Claude project
transcripts (see journal).
