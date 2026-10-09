# Bouncing Forward — Project Status

_Last updated: 9 October 2026 (webinar promo block; weekly blog posts 9–13; Monthly Letter No. 2)._

## Where the project stands

The site is **live and selling** at https://bouncing-forward.com —
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

## Content drop — 9 Oct (Heather)

- **Blog posts 9–13** added verbatim from Bouncing_Forward_Blog_Posts.docx
  with their meta title / description / keywords / slug. Heather's
  cadence is one new post a week, so each carries a `publishOn` date
  (SAST) and the blog revalidates hourly: no redeploy needed. Schedule:
  9 Oct the-story-you-tell · 16 Oct acceptance-is-not-agreeing · 23 Oct
  when-everyone-else-has-moved-on · 30 Oct
  small-decisions-rebuild-confidence · 6 Nov what-do-you-want-now.
  Change a date in `src/lib/blog.ts`. Listing now shows newest first;
  scheduled posts 404 until their date.
- **Monthly Letter No. 2** + **The Walking Pages (No. 2)** exported to
  PDF (A4, Merriweather/Inter as designed) and listed first in the All In
  library. Emailing the letter to the list is a separate Mailchimp send
  (exclude the `webinar` tag per the standing rule).
- **Not in this repo:** UnRetire's 5 blog posts (need the UnRetire repo);
  stories for both sites (Heather sending later).

## Webinar — 21 Oct, 10:00 + 19:00 SAST, Heather Meyer

Live: `/webinar` registration page + `/api/webinar` (Mailchimp tags
`webinar-oct21-1000` / `-1900`, two confirmation journeys active); thin
accent announcement band under the Home hero.

**9 Oct:** Home promo block added directly under the packages section
(Heather's 6 Oct direction) — Roelien's no-photo graphic
(`public/assets/webinar/bf-webinar-promo.png`, resized 3780→2048 px),
then the approved /webinar details and a "Reserve your seat →" button.
Anchor: `/#webinar`.

Still open: keep or drop the hero band now the block exists (Heather);
20 Oct reminder + join-link campaigns to the two tag segments;
post-session workbook email. **Standing rule:** every broad send
(Monthly Letter) targets a segment excluding the `webinar` tag.
Unretire wants the same mechanism — awaiting their copy/HTML + repo
access.

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
