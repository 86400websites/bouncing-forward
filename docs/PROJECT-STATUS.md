# Bouncing Forward — Project Status

_Last updated: 9 September 2026 (Launch Gate preparation on `codex/testing-readiness`)._

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

## Open confirmations (marked in accent on /privacy and /terms)

1. Legal entity name + country (Privacy §1, Terms §1)
2. Refund policy — choose one of the two drafted options (Terms §5)
3. Governing-law country (Terms §12)
4. Reply-within-30-days promise (Privacy §7)
5. Enterprise page: is the webinar free? keep "partnership with Alliance"?
6. Remove `noindex` from /privacy + /terms once 1–4 are settled
7. Darlene: the two free PDFs print the wrong domain
   ("bouncingforward.com" — no hyphen) — fix inside the PDFs
8. Mailchimp journey emails: rename "The First Week" wording (Heather)

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
  for the owner to run (`tests/e2e/tools/`).
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
