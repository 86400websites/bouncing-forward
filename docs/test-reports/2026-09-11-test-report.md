# Test Report — Bouncing Forward — 2026-09-11

> One row per feature from `docs/FEATURE-LIST.md` (v3, approved 10 September 2026). Every failure is explained in plain words. This is the first full Launch Gate run the site has ever had.

- Run type: **FULL** (every approved line selected; nothing skipped by hand)
- Environment: Preview `https://bouncing-forward-git-claude-t1-gate-suite-86400-s-projects.vercel.app` · head SHA `8b5460c0f1cb31774d6576d263ded4fee3b955c5` · test-mode keys confirmed by the preflight (environment `preview`, TEST database for both clients, Stripe in test mode, protection on and bypassed)
- Ran: 10 September 2026, 19:04–20:04 UTC (early hours of 11 September local). Duration 21 minutes.
- Totals: **137 registered tests → 104 passed · 16 failed · 13 skipped · 4 blocked**
- By feature line: **94 lines → 64 PASS · 13 FAIL · 12 MANUAL (awaiting your evidence) · 5 not-applicable or blocked**

## Severity, in plain words

| Severity    | Means                                       | Response                                                   |
| ----------- | ------------------------------------------- | ---------------------------------------------------------- |
| **Blocker** | Money, login, or the whole site is affected | Nothing launches with one open                             |
| **High**    | A real feature is broken for some users     | Fixed before launch                                        |
| **Medium**  | Annoying, but the site works                | Fix now or first post-launch sprint — owner's call, logged |
| **Low**     | Cosmetic                                    | Backlog                                                    |

---

## The short version

**Most of the site works.** Every account and access line a robot can check passes (21 of 22 — the 22nd needs your inbox), all 10 assessment and course lines pass, 16 of 19 page lines pass, and every payment line that ran passes — including a real $9.99 test purchase that unlocked the book, the reverse checks that a non-buyer and a stranger cannot get in, and the protection against the other business on the shared Stripe account.

**Thirteen lines fail. Nine were already known and on your list. Four are new.** The verdict is **NO-GO**, which is exactly what a first gate run is for. Nothing here is a surprise about whether the site "works" — the failures are one known blocker, the four missing abuse controls you already track, three cosmetic or wording items, and four newly found problems described below.

---

## The four new findings

### 1. Someone who once left the mailing list can never rejoin (High) — FM-002, FM-005, FM-006

When a person who previously came off the mailing list signs up again on the site, they see **"You're in — welcome."** but they are never actually put back on the list. They receive no 7 Step Journal email and nothing afterwards. The site quietly adds their label but leaves them off the list.

This also means **the test suite cannot be run twice.** The tidy-up at the end of every run takes the test contact off the list, and the next run's sign-up cannot put it back — so these three lines fail on every run after the first. One fix cures both: when someone signs up, put them back on the list rather than only labelling them.

### 2. A buyer's access email can silently fail to send (High, intermittent) — FM-010

After a real test purchase, the label that triggers the Book Package access email did not arrive within a full minute, so the test failed. The same test passed twice earlier today. The cause is visible in the code: after a purchase, the label is applied on a "best effort" basis and any failure is **silently ignored**. The buyer still gets access through their account, so they are not locked out, but the email promising their access can go missing without anyone knowing.

### 3. One kind of bad request crashes the sign-up address (Medium) — PR-006

Sending one specific malformed request to the sign-up address makes the server fail with a generic error instead of the polite message it gives for everything else. Nothing private leaks, and no normal visitor can trigger it, but it is an unhandled crash on a public address. The access-code address is written the same way and very likely behaves the same; the test stopped before reaching it.

### 4. The Course page sometimes logs a browser complaint on a phone (Low) — PG-001

On a 390px phone, the Course page occasionally produced a browser console complaint caused by the embedded YouTube players asking for a feature the page does not grant them. The videos still appear. It happened in one run out of three.

---

## Results

### A. Pages & content

| ID     | Feature                                    | Result | What happened (plain words)                                                                                                                            | Severity | Next step         |
| ------ | ------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ----------------- |
| PG-001 | Every public page loads with no errors     | PASS\* | Passed in this run. In an earlier run the Course page logged a complaint from the YouTube players on a phone — see new finding 4.                      | Low      | Backlog / watch   |
| PG-002 | Every link goes somewhere real             | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-003 | A wrong URL shows the site's own 404 page  | FAIL   | The "page not found" page still prints a leftover building note: "Scaffold stub — full page arrives in —." Visitors see it.                            | Low      | Fix sprint        |
| PG-004 | Old addresses still work                   | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-005 | Sitemap and robots list only real pages    | PASS   | The `/podcast` correction is confirmed on the Preview.                                                                                                 | —        | —                 |
| PG-006 | All 8 blog posts open, index lists them    | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-007 | Home shows three tiers, both PDFs download | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-008 | The Book page offers its three routes      | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-009 | Resources shows Compass, Path, tool cards  | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-010 | Stories renders, Share Your Story links    | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-011 | FAQ shows its 14 questions                 | FAIL   | The page shows **13** questions and answers. The approved line promises 14. Either one is missing from the page, or the list should say 13. Your call. | Medium   | Owner decision    |
| PG-012 | Enterprise renders, anchors and links work | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-013 | Privacy and Terms show "confirm" markers   | PASS   | Still marked and still hidden from search engines, as expected until you settle the open items.                                                        | —        | MN-006            |
| PG-014 | Account pages hidden from search engines   | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-015 | Security headers on every page             | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-016 | Phone menu opens, links work, skip link    | PASS   | —                                                                                                                                                      | —        | —                 |
| PG-017 | Header flips "Log In" to "Account"         | PASS\* | Passed. In one earlier run the click on "Account" did not move the page; it did not repeat in two further runs. Worth watching.                        | Low      | Watch             |
| PG-018 | Titles and social-share data per page      | FAIL   | The Course page has **no social-share image**, so sharing that link shows no picture. Other pages are fine.                                            | Medium   | Fix sprint        |
| PG-019 | Google verification file served exactly    | PASS   | —                                                                                                                                                      | —        | MN-009 still owed |

### B. Accounts & access — all 22 lines pass

| ID      | Feature                                        | Result | What happened (plain words)                                                                     | Severity | Next step |
| ------- | ---------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------- | -------- | --------- |
| AC-001  | Visitor can create an account                  | PASS   | Created in the TEST database only, and removed afterwards.                                      | —        | P2 check  |
| AC-002  | Account holder can log in and log out          | PASS   | —                                                                                               | —        | —         |
| AC-003a | Reset shows the neutral message either way     | PASS   | —                                                                                               | —        | —         |
| AC-003b | The reset email actually arrives               | MANUAL | Needs your inbox screenshot.                                                                    | —        | MN-002    |
| AC-003c | Reset link returns to the same environment     | PASS   | —                                                                                               | —        | —         |
| AC-003d | A new password saves and works                 | PASS   | **The reported "reset does not work" bug does not reproduce.** The whole flow works end to end. | —        | —         |
| AC-003e | An invalid reset link is refused clearly       | PASS   | Shows "Your reset link has expired or is invalid. Please request a new one."                    | —        | —         |
| AC-003f | An expired reset link is refused the same way  | PASS   | —                                                                                               | —        | —         |
| AC-003g | A used reset link cannot be used again         | PASS   | —                                                                                               | —        | —         |
| AC-004  | Existing email sends the person to Log in      | PASS   | —                                                                                               | Low      | Your call |
| AC-005  | A wrong password is refused, no session        | PASS   | —                                                                                               | —        | —         |
| AC-006  | Invalid email or short password refused        | PASS   | —                                                                                               | —        | —         |
| AC-007  | A signed-in session survives reloads           | PASS   | —                                                                                               | —        | —         |
| AC-010  | **A visitor cannot open Your account**         | PASS   | Blocked, as it must be.                                                                         | —        | —         |
| AC-011  | **A visitor cannot download the paid files**   | PASS   | Blocked, with and without a made-up code.                                                       | —        | —         |
| AC-012  | **A non-buyer cannot download the paid files** | PASS   | Blocked, and their account page says "No Book Package yet".                                     | —        | —         |
| AC-013  | A Book Package owner can download both files   | PASS   | Both PDFs download correctly.                                                                   | —        | —         |
| AC-014  | Owner sees "It's all yours." on Premium        | PASS   | —                                                                                               | —        | —         |
| AC-015  | Legacy access code opens the library           | PASS   | Valid code opens it; a wrong code is refused.                                                   | —        | —         |
| AC-016  | Email links cannot redirect off-site           | PASS   | The `//evil.example` fix holds.                                                                 | —        | —         |
| AC-017  | Emails and returns use our own address only    | PASS   | A forged host header does not change them.                                                      | —        | —         |
| AC-018  | There is no admin area                         | PASS   | Confirmed — nothing to protect.                                                                 | —        | —         |

### C. Forms & email

| ID     | Feature                                       | Result | What happened (plain words)                                                                                                                                      | Severity | Next step  |
| ------ | --------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| FM-001 | Sign-up rejects a bad email                   | PASS   | —                                                                                                                                                                | —        | —          |
| FM-002 | A valid sign-up lands in the mailing list     | FAIL   | The welcome box and the download appear, but the contact was **left off the list** because it had been removed by the previous run's tidy-up. See new finding 1. | High     | Fix sprint |
| FM-003 | A bot filling the hidden field is ignored     | PASS   | Silently dropped, no contact created.                                                                                                                            | —        | —          |
| FM-004 | Honest error if sign-ups aren't connected     | N/A    | Not testable here — the Preview has working keys, exactly as the approved line says.                                                                             | —        | —          |
| FM-005 | Sign-up refuses malformed requests            | FAIL   | The refusals themselves are fine. It fails on the same "left off the list" problem as FM-002.                                                                    | High     | Same fix   |
| FM-006 | Full Assessment sign-up opens the library     | FAIL   | The results and the All In library open correctly. Same "left off the list" problem.                                                                             | High     | Same fix   |
| FM-007 | Contact form validates before sending         | PASS   | **The reported contact-form bug does not reproduce.** Button state, five subjects and email validation all behave.                                               | —        | —          |
| FM-008 | A valid contact message is sent               | PASS   | One labelled test message was accepted by the provider.                                                                                                          | —        | MN-003     |
| FM-009 | A provider failure never shows a false "sent" | PASS   | —                                                                                                                                                                | —        | —          |
| FM-010 | A purchase labels the buyer for their email   | FAIL   | The label that triggers the buyer's access email did not arrive within a minute. Passed twice earlier today. See new finding 2.                                  | High     | Fix sprint |
| FM-011 | Sign-up cannot hand out the Book Package      | FAIL   | **Confirmed as reported.** A request marked as a Book Package buyer is accepted, which triggers the access-code email — so a stranger can be sent the paid code. | Blocker  | Its own PR |

### D. Payments

| ID     | Feature                                          | Result  | What happened (plain words)                                                                                                            | Severity | Next step |
| ------ | ------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- |
| PY-001 | A signed-in buyer can buy for $9.99              | PASS    | **A real test purchase went through**, the access record was written and both downloads opened.                                        | —        | —         |
| PY-002 | A declined card shows an honest failure          | PASS    | No access granted.                                                                                                                     | —        | —         |
| PY-003 | Paying unlocks exactly what it should            | BLOCKED | Did not run — FM-010 failed first and this file stops on the first failure. **Verified PASS in a targeted re-run at the same commit.** | —        | Re-run    |
| PY-004 | Backing out of Stripe grants nothing             | PASS    | —                                                                                                                                      | —        | —         |
| PY-005 | No double charge, no duplicate record            | BLOCKED | Same as PY-003. **Verified PASS in the targeted re-run.**                                                                              | —        | Re-run    |
| PY-006 | A visitor is taken through sign-up into Stripe   | PASS    | —                                                                                                                                      | —        | —         |
| PY-007 | An owner clicking Buy goes to their account      | PASS    | No second checkout created.                                                                                                            | —        | —         |
| PY-008 | The webhook refuses anything not signed properly | PASS    | —                                                                                                                                      | —        | —         |
| PY-009 | A 100%-off promotion code                        | MANUAL  | Needs a test-mode promo code from you.                                                                                                 | —        | Owner     |
| PY-010 | Old Payment-Link returns are checked properly    | PASS    | Made-up, unpaid and other-site sessions are all refused.                                                                               | —        | —         |
| PY-011 | Preview keys, price and webhook are test-mode    | PASS    | —                                                                                                                                      | —        | MN-007    |
| PY-012 | The other site's events are ignored safely       | PASS    | **Confirmed fixed.** Answered "ignored", nothing written, nobody labelled.                                                             | —        | —         |
| PY-013 | Genuine purchases of every older shape honoured  | BLOCKED | Same as PY-003. **Verified PASS in the targeted re-run.**                                                                              | —        | Re-run    |
| PY-014 | A failed save makes Stripe retry                 | PASS    | —                                                                                                                                      | —        | MN-008    |
| PY-015 | Another person's payment cannot give me access   | BLOCKED | Same as PY-003. **Verified PASS in the targeted re-run.**                                                                              | —        | Re-run    |
| PY-016 | The live webhook is the `www` address            | MANUAL  | Needs your Stripe dashboard screenshot.                                                                                                | —        | MN-007    |

### E. Protection — being blocked is the PASS

| ID     | Feature                                  | Result | What happened (plain words)                                                                                                                     | Severity | Next step  |
| ------ | ---------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| PR-001 | Hammering Log in gets blocked            | FAIL   | Twenty wrong passwords in a row were each answered normally. Nothing blocked them. This is the missing rate-limiting service you already track. | Blocker  | Fix sprint |
| PR-002 | Rapid-fire sign-ups get rejected         | FAIL   | Thirty sign-ups in a row were all processed. No limit exists. (No request reached the mailing list.)                                            | Blocker  | Fix sprint |
| PR-003 | Forms without a human check are rejected | FAIL   | The sign-up address accepts submissions with no human check at all. Only the hidden-field trick exists.                                         | Blocker  | Fix sprint |
| PR-004 | Guessing access codes gets blocked       | FAIL   | Wrong codes were refused one by one but never locked out.                                                                                       | Blocker  | Fix sprint |
| PR-005 | Paid files protected on the server       | PASS   | Both the allowed and the denied halves proven.                                                                                                  | —        | —          |
| PR-006 | Forced errors return friendly messages   | FAIL   | One malformed request crashes the sign-up address with a generic server error. See new finding 3.                                               | Medium   | Fix sprint |
| PR-007 | Book Package gates checked on the server | PASS   | Proven for a logged-out visitor and for a non-owner.                                                                                            | —        | —          |

### F. Integrations — all 10 lines pass

| ID     | Feature                                     | Result | What happened (plain words)                        | Severity | Next step |
| ------ | ------------------------------------------- | ------ | -------------------------------------------------- | -------- | --------- |
| IN-001 | Course: nine modules, locked and open       | PASS   | Nine players and nine worksheets present.          | —        | MN-005    |
| IN-002 | All In library: locked, then 13 downloads   | PASS   | All 13 files open.                                 | —        | —         |
| IN-003 | Where's Here? walks through 10 statements   | PASS   | Keyboard usable; results render.                   | —        | —         |
| IN-004 | The quick look scores correctly             | PASS   | Every known answer set lands in the right band.    | —        | —         |
| IN-005 | Full Assessment: 24 statements, remembered  | PASS   | Survives reload; a retake replaces it.             | —        | —         |
| IN-006 | The Full Assessment scores correctly        | PASS   | Bands and written report match.                    | —        | —         |
| IN-007 | An owner unlocks All In and the Course      | PASS   | —                                                  | —        | —         |
| IN-008 | Database: an account reads only its own row | PASS   | Others and anonymous read nothing; writes refused. | —        | —         |
| IN-009 | The site works with motion reduced          | PASS   | —                                                  | —        | —         |
| IN-010 | The deployment identity address is safe     | PASS   | Facts only, nothing secret-shaped.                 | —        | —         |

### G. Manual checks — 12 lines awaiting your evidence

| ID      | Feature                                          | Result | Next step                                     |
| ------- | ------------------------------------------------ | ------ | --------------------------------------------- |
| MN-001  | "Buy on Amazon" opens the correct listing        | MANUAL | Click it from The Book and Premium            |
| MN-002  | Sign-up and reset emails arrive and work         | MANUAL | Screenshot, tokens blacked out                |
| MN-003  | The labelled test contact message arrived        | MANUAL | Check the inbox, then delete it               |
| MN-004  | The mailing-list journeys send the right emails  | MANUAL | Check the inbox; also the 3 labelled contacts |
| MN-005  | The nine course videos play                      | MANUAL | Press play on each                            |
| MN-006  | Privacy and Terms open items confirmed           | MANUAL | Settle items 1–4, then PG-013 flips           |
| MN-007  | Every Preview credential and destination is TEST | MANUAL | Dashboards, values redacted                   |
| MN-008  | Re-sending a purchase event restores access      | MANUAL | Stripe → resend the event                     |
| MN-009  | Google verification and sitemap submission       | MANUAL | Search Console                                |
| AC-003b | The reset email actually arrives                 | MANUAL | With MN-002                                   |
| PY-009  | A 100%-off promotion code                        | MANUAL | Needs a test-mode promo code                  |
| PY-016  | The live webhook is the `www` address            | MANUAL | With MN-007                                   |

---

## What was corrected in the tests themselves (no site code changed)

The first full run produced 35 failures. Most were faults in the brand-new test suite, not in the site. They were corrected and the suite re-run twice; the numbers above are from the third run. Every change is in `tests/` or `playwright.config.ts` — **no file under `src/` was touched.**

| What was wrong in the tests                                                                                  | Lines it had wrongly failed                              |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| Logging the shared test account out ended **every** session it had, including the one later tests were using | AC-007, AC-010, AC-012, PG-014, PG-017, PR-005, PR-007   |
| Clearing browser cookies also threw away the pass that lets the tests reach a protected Preview at all       | AC-003g, PY-003, PY-006 (and the 3 lines PY-003 blocked) |
| A message check matched an invisible element the browser adds to every page                                  | AC-003e, AC-003f                                         |
| Time limits too short for large downloads over a slow connection (the site had answered correctly each time) | AC-013, and several one-off timeouts                     |
| The Preview's own floating toolbar sat over a button on a phone and swallowed the tap                        | IN-004                                                   |
| Two checks demanded one exact wording where the site legitimately uses either of two polite refusals         | FM-005, PR-006 (partly)                                  |

The first run also suffered a spell of network trouble on the machine running it, including a name-lookup failure, which produced several payment failures that did not repeat.

## Fix handoff

Grouped for `docs/templates/BUG-FIX-PROMPT-TEMPLATE.md`, most urgent first:

1. **FM-011 — the Blocker you already approved.** Accept only the two real sign-up sources. Proven by FM-002, FM-006, FM-010 and FM-011.
2. **Mailing-list rejoin (new finding 1) + the buyer's access label (new finding 2).** One small area of code covers both: put a returning person back on the list, and stop silently ignoring a failure to label a buyer. Proven by FM-002, FM-005, FM-006, FM-010. **This also makes the gate repeatable** — until it is fixed, three lines will fail on every run after the first.
3. **The four missing abuse controls (PR-001 to PR-004).** The rate-limiting service and the human check that have been on your open list since the start. Launch-blocking.
4. **PR-006** — handle the malformed request politely on the sign-up address, and on the access-code address written the same way.
5. **PG-018** (Course share image), **PG-003** (404 leftover line), **PG-011** (13 vs 14 — your decision first).

While fixing, re-run only the failed lines. Before the verdict, a full re-run — always.

---

## Verdict

**NO-GO**

GO requires all three, no exceptions: **(1)** this report is a FULL run on the current head, **(2)** 100% of tests pass (manual lines have recorded evidence), **(3)** no test was skipped, disabled, or edited without the feature list re-approval noted above.

- Verdict: **NO-GO** · Date: 11 September 2026 · Full-run report: this file
- Condition (1) is met. Conditions (2) and (3) are not: 13 lines fail, 4 more were blocked from running by an earlier failure in the same file, and 12 manual lines have no evidence yet.
- Nothing on this list is a surprise about whether the site fundamentally works. One approved Blocker, four known missing controls, four new findings and three cosmetic items stand between here and GO.
- Next full run: after fix sprints 1–4 above. On GO → `docs/LAUNCH-CHECKLIST.md` Phase 1 ("Launch Gate passed") and Phase 5 of the skill (morning-check selection).

## Two things needing your decision

1. **PG-011** — should the FAQ have 14 questions (one is missing) or 13 (the list is wrong)?
2. **A new line to approve.** The mailing-list rejoin problem is not covered by any approved line. Proposed wording, for your approval before a test is written for it:
   > `FM-012 | Someone who previously came off the mailing list and signs up again is put back on it and receives the 7 Step Journal | The contact's status reads subscribed after the sign-up, not archived, and the journey email arrives`
