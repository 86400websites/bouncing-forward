# Codex Review Record — T2 — gate-run-and-critical-fixes

> Status: **APPROVE** returned for the reviewed head (11 September 2026). PR #38 merged as `0b5b66c`. The brief that produced this record is the prompt pasted in the session; the reviewer's returned record follows verbatim.

- Repo: 86400websites/bouncing-forward
- PR: #38, `claude/t1-gate-suite` → `main`
- Merge-base SHA: 8b5460c0f1cb31774d6576d263ded4fee3b955c5
- Reviewed head SHA: 48b959aaf1271eec2587732dabb03a820cacd404
- Reviewed by: Codex (independent reviewer) on 11 September 2026

## Returned record

PR #38 — independent review record

No findings. No new Blocking or Should-fix defect was verified in the pinned range. Verification limits are recorded below; this is not a Launch Gate GO.

Target confirmed:

- Merge-base: 8b5460c0f1cb31774d6576d263ded4fee3b955c5
- Reviewed head and local HEAD: 48b959aaf1271eec2587732dabb03a820cacd404
- Exactly four product-source files changed. Complete changed-file list: docs/ENVIRONMENT-PARITY.md, docs/PROJECT-STATUS.md, docs/ROADMAP.md, docs/content/page-copy/newsletter-errors.md, docs/test-reports/2026-09-11-critical-fixes.md, docs/test-reports/2026-09-11-test-report.md, playwright.config.ts, src/app/api/newsletter/route.ts, src/app/api/premium/route.ts, src/app/api/stripe/webhook/route.ts, src/lib/mailchimp.ts, tests/e2e/features/accounts/login.spec.ts, tests/e2e/features/accounts/password-reset.spec.ts, tests/e2e/features/forms/newsletter.spec.ts, tests/e2e/features/payments/checkout.spec.ts, tests/e2e/features/payments/purchase.spec.ts, tests/e2e/features/protection/pr-006-error-hygiene.spec.ts, tests/e2e/harness/fixtures.ts, tests/e2e/harness/pages.ts, tests/e2e/harness/stripe.ts, tests/unit/critical-fixes.test.mjs

Inspected the complete diff, governing instructions, requested feature lines and reports, environment/security requirements, form callers, payment classification, entitlement schema/RLS, protected downloads, and Mailchimp automation documentation.

Review conclusions:

- Both site forms send permitted sources. Well-formed unauthorized tags are rejected; malformed sources fall back to newsletter. Casing, whitespace, Unicode, and array values cannot produce a premium tag.
- First-time subscription already requested status_if_new: "subscribed". Mailchimp documents subscribed as immediate subscription and pending as requesting confirmation. No first-time double-opt-in regression was established. A returned pending status now produces an honest error without tagging; actual audience recovery remains unproven.
- Account entitlement writes precede Mailchimp. Tag failures return retryable errors, producing webhook 500 responses while preserving access. The upsert and database uniqueness constraint on (user_id, product) prevent duplicate entitlement rows.
- Retries reapply the same active tag without removing it. No new duplicate-email defect was established, but exactly-once email delivery and journey configuration are not proven by these tests. Permanent provider failures and exhausted retries remain delivery limitations; universal access/email recovery cannot be certified.
- Malformed-body guards and provider-error handling introduce no verified unhandled public-request failure or provider-text exposure. No new secrets, client exposure, authorization weakening, migration, dependency, or security-header change was found.
- Suite changes preserve approved feature assertions and selection. No new skips or disabled tests were introduced. Accepted deferrals and pre-existing failures were not reported as new findings.

Checks:

| Command                                        | Independent result                             |
| ---------------------------------------------- | ---------------------------------------------- |
| node --test tests/unit/critical-fixes.test.mjs | 7 passed, 0 failed                             |
| pnpm typecheck                                 | Stalled, then reported fetch failed; no result |
| pnpm lint                                      | Stalled, then reported fetch failed; no result |
| pnpm build                                     | Stalled without output; stopped; no result     |

No dependency installation or substitute checks were performed. These execution limitations are not verified failures caused by the range.

Evidence:

- Saved preflight identifies Preview deployment bouncing-forward-aoajkf1n3-86400-s-projects.vercel.app at the exact reviewed head.
- Corresponding saved results confirm PR-006, PY-008, PY-012 and PY-014 passed; eight tests including setup/cleanup passed, with no skips or failures. Cleanup recorded two fixtures cleaned and zero errors.
- The committed full-run report describes 8b5460c, not this head. The brief's later c56e9ec result — 105 passed with 12 failing lines — remains owner-supplied evidence; its full-run artifact was not independently confirmed.
- Current head-specific CI was unavailable: gh is absent and the public API lookup failed.
- Playwright was not run. Live env files were not opened. No review record or source changes were written.

**APPROVE** — no Blocking or Should-fix findings in 8b5460c0f1cb31774d6576d263ded4fee3b955c5..48b959aaf1271eec2587732dabb03a820cacd404, subject to the verification limits recorded above.

## Builder's note

The three stalled `pnpm` commands run and pass in the builder's environment on this head (typecheck, lint, build all clean); the stalls were a reviewer-environment limitation, as the reviewer states. The full-run artifact the reviewer could not confirm independently is the `c56e9ec` run recorded in `docs/sprint-prompts/T2-gate-run-and-critical-fixes.md`.
