# Sprint Record — T2 — Launch Gate Phase 3 run, suite corrections and critical fixes

> Permanent record of the first full Launch Gate run against a verified Preview, the test-suite faults it exposed, the four critical product fixes that followed, and the re-runs that verified them. Saved 11 September 2026 by `/sprint-prompt save` after PR #38 merged.

## Summary

| Field         | Value                                                                                                                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprint        | T2 — Launch Gate Phase 3 (run → report → fix → re-run) plus the critical fixes it produced                                                                                                                 |
| Branch        | `claude/t1-gate-suite` (the long-lived gate branch, from `8b5460c`). **Kept after merge** — its Preview alias is what the TEST Supabase URL list and the Stripe sandbox destination point at               |
| PR            | #38 → `main`, merged as `0b5b66c` on 11 September 2026                                                                                                                                                     |
| Commits       | `b1628b7` suite corrections · `5ee6ea0` critical product fixes + 7 unit tests · `700672b` records · `c56e9ec` signed webhook payloads as raw bytes · `48b959a` webhook refuses a signed non-object payload |
| Dates         | 10–11 September 2026                                                                                                                                                                                       |
| Operator      | Claude Code (`/activate-testing` Phase 3–4), owner Khalid Siddiqui (86400websites); the critical product fixes were implemented by a second agent session from the report and verified here                |
| Commit / Push | NO throughout the work; authorised by the owner in chat on 11 September 2026 ("Ok lets commit and push"), then again for each follow-up commit                                                             |

## Prompts used

1. `/activate-testing` → "run the tests" (10 September 2026, night). Phase 3 began: preflight, smoke and proofs on the gate alias, then the full suite.
2. Owner, verbatim, opening the session: "Please run the tests now (note that I did not ran the independent review for last merge and I'm aware but we need to complete the tests now)".
3. Owner, after the first report: "Read docs/test-reports/2026-09-11-critical-fixes.md. Verify the fixes without disturbing existing work. Run regression tests and standard checks, then affected tests and the full Launch Gate once this candidate has a verified Preview. Keep Upstash/Turnstile deferred and leave cosmetic issues alone. Don't weaken tests. Report remaining failures briefly. Commit/Push: NO."
4. Owner, after the follow-up fixes: the same instruction with "Avoid repeated Mailchimp signup attempts while its temporary restriction remains."
5. Owner: "Ok lets commit and push then I will send you the PR screenshot then we will be able to run the tests again? we need to ensure we fixed them right?"
6. Owner: "Ok so please fix all then rerun the tests and let me know when we are ready to merge - please note that we can ignore the small issues that are not critical blockers".

No implementation prompt was filled from the sprint template; the skill's Phases 3–4 governed the run and the fix → re-run loop. The critical fixes' own handoff is `docs/test-reports/2026-09-11-critical-fixes.md`.

## What shipped

- **The first full Launch Gate report** — `docs/test-reports/2026-09-11-test-report.md`, verdict **NO-GO**, one row per approved line. Final full run of that phase at head `8b5460c`: 104 passed · 16 failed · 13 skipped · 4 blocked.
- **Suite corrections** (tests only, `src/` untouched): AC-002's Log out ended every session the shared free fixture held, signing out every later spec that reused the saved session (fixed by signing back in after the assertions); four `clearCookies()` calls discarded the deployment-protection bypass cookie and landed on Vercel's sign-in page (now clear only `sb-*`); `getByRole("alert")` also matched Next's empty route announcer; the Preview's floating toolbar swallowed a tap at 390px (hidden per context); timeouts resized for a remote Preview over a slow link, retries kept at zero; PDF downloads given a bounded 120 s; signed webhook payloads sent as a `Buffer` so the transmitted bytes match the signature.
- **Critical product fixes** (`src/app/api/newsletter/route.ts`, `src/app/api/premium/route.ts`, `src/app/api/stripe/webhook/route.ts`, `src/lib/mailchimp.ts`): FM-011's public tag allow-list (only `newsletter` / `full-assessment`, refused before any provider call); PR-006's null/primitive-body guards on all three endpoints; explicit `status: subscribed` for site sign-ups with the provider required to confirm it; tag failures no longer swallowed (retryable, so the webhook returns 500 and Stripe retries); Mailchimp's temporary per-address signup restriction recognised and answered 429 with copy from `docs/content/page-copy/newsletter-errors.md`.
- **`tests/unit/critical-fixes.test.mjs`** — seven isolated tests exercising the real handlers with provider mocks.
- **Records:** the report, the fix handoff, `docs/ENVIRONMENT-PARITY.md` §12 proof record for the run, `docs/PROJECT-STATUS.md`, `docs/ROADMAP.md`.

## Checks and results

| Check                                               | Result                                                                                                                                                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm typecheck`, `pnpm lint`, `pnpm build`         | pass on every head (the reviewer's environment stalled these; they run and pass here)                                                                                                                              |
| `node --test tests/unit/critical-fixes.test.mjs`    | 7 passed (5 in the first version; the lint error `no-assign-module-variable` in that file was fixed by renaming a local variable)                                                                                  |
| Prettier (LF-normalised)                            | clean on every changed file                                                                                                                                                                                        |
| Full gate run 1 (`8b5460c`)                         | 84 passed · 35 failed — mostly suite faults and a spell of local network trouble (a DNS failure, several timeouts); cleanup timed out and was re-run alone (19 of 20 cleaned, 0 errors)                            |
| Full gate runs 2 and 3 (`8b5460c`, suite corrected) | 102 → **104 passed · 16 failed**; every remaining failure a genuine finding                                                                                                                                        |
| Gate run at `700672b` (fixes deployed)              | 103 passed; FM-011 confirmed returning 400 before Mailchimp; PR-006 cleared its newsletter and premium steps for the first time                                                                                    |
| Full gate run at `c56e9ec`                          | **105 passed · 12 failing lines**; **FM-011 passes** once the stale `premium` tag left on the tagprobe contact by pre-fix runs was removed with a guarded one-off script                                           |
| Targeted verification at `48b959a`                  | PR-006 passes in full; PY-008, PY-012, PY-014 still pass. The Buffer change exposed a real hidden defect — a signed `null` payload crashed the webhook with 500 — fixed with the same guard as the other endpoints |
| Payments chain (targeted, after the cookie fix)     | PY-001, FM-010, PY-003, PY-015, PY-005, PY-013 all pass — PY-003/005/013/015 had never completed before                                                                                                            |
| Independent review (PR #38, head `48b959a`)         | **APPROVE**, no findings — `docs/code-reviews/T2-gate-run-and-critical-fixes-review.md`                                                                                                                            |
| Production smoke after merge (read-only)            | `0b5b66c` served; every public page 200; sitemap 21 URLs, no `/podcast`; GSC file 200 at 53 bytes; all five security headers; both free PDFs served; the FM-011 hole confirmed **closed on the live site**         |

## Deviations and learnings

- **Diagnosis corrected in the open.** The first analysis blamed Mailchimp for refusing to re-subscribe archived contacts. The owner's two diagnostic PUTs showed the real cause: a temporary per-address signup restriction ("has signed up to a lot of lists very recently"), triggered by the repeated gate runs on the same test mailbox. The suggested "un-archive first / force opt-in" remedy was wrong and was withdrawn; the fix keeps `status: subscribed` and treats the restriction as retryable.
- **The restriction reaches every plus-address on the mailbox**, so it also blocks buyer tagging (FM-010, PY-010) and, through `describe.serial`, PY-003/005/013/015 in the same run. Returning-subscriber recovery and buyer tagging are therefore **unit-tested but unproven live**; the one controlled attempt prescribed by the handoff still answered 429 at close.
- **PR-003 passes spuriously** whenever the sign-up endpoint errors, because its assertion is `status >= 400`. Never read it as bot protection.
- **Playwright re-encodes a string `data` that is not valid JSON** when the content type is JSON, so the "bad JSON" checks never sent malformed bytes and the "signed non-JSON" webhook check could never pass. Send a `Buffer` when the exact bytes matter.
- **`purchase.spec.ts` is `describe.serial`**: one failure hides the rest. Running `--project=cleanup` alone overwrites `qa-evidence/last-run.json`; copy it aside first.
- **The independent review for PR #37** (the T1 suite) was consciously skipped by the owner; PR #38's review covered the same branch at a later head.
- The subagent session limit interrupted one review workflow; the verification was completed directly. A later 15-agent pre-merge check raised six candidate defects and refuted all six.

## Follow-ups (owners)

1. **Owner + operator:** when Mailchimp's restriction lifts, one controlled sign-up check (FM-002), then a **full gate run** at the current head for the record. Only then can FM-002/005/006/010 and PY-010 be shown green.
2. **Owner decisions still open:** PG-011 (14 vs 13 FAQ items); approval of the proposed line FM-012 (returning unsubscriber); the second capture path for the primary conversion (recommended: fall back to the existing Formspree endpoint on a Mailchimp failure).
3. **Deferred by the owner, recorded, not forgotten:** PR-001–PR-004 (Upstash + Turnstile); PG-003, PG-018, PG-001's intermittent YouTube console complaint; error tracking; uptime monitoring.
4. **Watch:** the webhook now returns 500 when only the marketing tag fails, so a sustained Mailchimp outage produces Stripe retries. Access is granted before the tag is attempted, so no buyer is left without their purchase.
