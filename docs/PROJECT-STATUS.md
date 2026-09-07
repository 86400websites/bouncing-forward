# Bouncing Forward — Project Status

_Last updated: 4 September 2026 (Heather's final fix-list + legal pages sprint)._

## Where the project stands

The site is **live and selling** at https://bouncing-forward.vercel.app —
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

- Automated test suite — prerequisites DONE (test Supabase
  `hmcojplrqoqhyigvtgyp`, keys in Vercel Preview); run
  `/activate-testing` next sprint.
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
