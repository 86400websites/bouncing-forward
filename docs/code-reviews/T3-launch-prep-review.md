# Codex Review Record — T3 — launch-prep

> Status: **APPROVE** returned for the final reviewed head (11 September 2026), after an earlier **REQUEST CHANGES** on the same branch. PR #39 merged as `67a9935`. Both returned records follow verbatim.

- Repo: 86400websites/bouncing-forward
- PR: #39, `claude/launch-prep` → `main`
- Merge-base SHA: 0b5b66c582b4314ae4785a71e6e9fa368816a0d2
- First reviewed head: 2b23f425da8645f9d4195cc6239b6d1a3967f2b0 → REQUEST CHANGES
- Final reviewed head: 7aa1819b5aa930806672304885f0c972ad30487e → APPROVE
- Reviewed by: Codex (independent reviewer) on 11 September 2026

## Round 1 — REQUEST CHANGES at `2b23f42`

Confirmed merge-base 0b5b66c582b4314ae4785a71e6e9fa368816a0d2 and reviewed head 2b23f425da8645f9d4195cc6239b6d1a3967f2b0. Local HEAD matches. Confirmed 14 changed files.

Finding 1 — Morning checks cannot execute

- Severity: Blocking
- Location: .github/workflows/morning-check.yml:20 and :42; tests/e2e/features/pages/loads.spec.ts:12; production guard at tests/e2e/harness/fixtures.ts:266.
- Issue: This range schedules six tests using structured tag metadata, but both the workflow selection check and runtime guard search title text for @morning. Installed Playwright 1.63.0 confirms that --list prints titles without structured tags, and testInfo.title is separate from testInfo.tags.
- Failure scenario: Set MORNING_CHECK_ENABLED=true with a valid production URL → six checks are selected, but grep "@morning" selected.txt fails and stops the job. Fixing only that step still leaves all six tests rejected by morningGuard before their assertions execute.
- Suggested fix: Validate the selected tests through structured reporter data and require a nonempty approved selection. Update the runtime guard to check testInfo.tags.includes("@morning"), retaining the production target and credential restrictions.
- Confidence: High

The incompatible guards predate this range, but this PR first supplies the structured morning selection and schedules its execution, exposing the failure in the newly enabled workflow.

Reviewed the complete diff and surrounding component, fixture, target-resolution, preflight, and health-route code. No additional serious findings: Amazon links retain safe new-tab attributes; recorded feature changes are reflected in assertions; no secret exposure, new privileged client boundary, database change, or production write was introduced.

Checks: node --test tests/unit/critical-fixes.test.mjs — 7 passed, 0 failed. pnpm typecheck, pnpm lint, pnpm build — stalled without output; stopped. No current-head CI or tested Preview evidence was confirmed.

REQUEST CHANGES — merge-base 0b5b66c582b4314ae4785a71e6e9fa368816a0d2; reviewed head 2b23f425da8645f9d4195cc6239b6d1a3967f2b0.

### Builder's response (commit `f9c8a6f`)

Reproduced both halves: `--list` printed zero `@morning` occurrences, and the guard compared only `testInfo.title`. The guard now reads `testInfo.tags` as well as the title; the workflow reads its selection from the JSON reporter and requires a non-empty set where every selected check carries the tag; both accept the tag with or without its `@` (the runtime emits it with one, the JSON reporter strips it). Verified by running the morning project against Production with only `PLAYWRIGHT_TARGET` and `PLAYWRIGHT_BASE_URL` set: preflight plus all six checks passed in 59 s.

## Round 2 — APPROVE at `7aa1819`

Independent review — claude/launch-prep into main

Confirmed merge-base 0b5b66c582b4314ae4785a71e6e9fa368816a0d2 and reviewed head 7aa1819b5aa930806672304885f0c972ad30487e. Local HEAD matches. Confirmed 19 changed files: .github/workflows/morning-check.yml, docs/FEATURE-LIST.md, src/app/book/page.tsx, src/app/premium/page.tsx, src/app/privacy/page.tsx, src/app/terms/page.tsx, src/components/site/amazon-formats.tsx, src/lib/site.ts, tests/e2e/features/accounts/downloads.spec.ts, tests/e2e/features/integrations/health.spec.ts, tests/e2e/features/manual/manual.spec.ts, tests/e2e/features/pages/content.spec.ts, tests/e2e/features/pages/headers.spec.ts, tests/e2e/features/pages/inventory.ts, tests/e2e/features/pages/links.spec.ts, tests/e2e/features/pages/loads.spec.ts, tests/e2e/features/pages/seo.spec.ts, tests/e2e/harness/fixtures.ts, tests/e2e/harness/target.ts

Finding 1 — Privacy operator wording remains ambiguous

- Severity: Should-fix
- Location: src/app/privacy/page.tsx:46, /privacy; introduction at line 37.
- Issue: The new section names 86400 as the website operator, while the introduction still says Bouncing Forward is run by Maher Kaddoura and belongs to Half a Life. The page does not explain whether these describe separate responsibilities.
- Failure scenario: A visitor reads the policy to identify who handles their information and encounters two unexplained descriptions of who runs the service.
- Suggested fix: Align the introduction with the approved operator wording, or explicitly distinguish the website operator from the author/brand relationship.
- Confidence: Medium
- Disposition: Nonblocking; may be deferred as a copy clarification.

Previous blocker resolved. The workflow now reads structured JSON tags and excludes preflight from the morning-selection check. The runtime guard receives testInfo.tags. Both correctly accommodate Playwright's tag representation; this was checked against the installed 1.63.0 implementation.

Other review conclusions:

- Exactly six specs carry @morning. Their selected paths perform reads without login, purchases, signups, or email submissions.
- Only MORNING_CHECK_ENABLED and PRODUCTION_URL are required. Account secrets are optional and unused by this selection. Production target and privileged-credential restrictions remain enforced.
- All four Amazon formats retain _blank and noopener noreferrer. Updated assertions cover both Book rows and Premium; actual listing contents remain a manual check.
- Terms numbering runs continuously through section 12, with no dangling governing-law reference found. Both dates and the 30-day reply window match the approved changes. Noindex remains intentionally enforced.
- Test changes reflect recorded owner approvals. No new skipped or disabled feature tests, secret exposure, authorization weakening, or database changes were found.

Verification: node --test tests/unit/critical-fixes.test.mjs — 7 passed, 0 failed. pnpm typecheck, pnpm lint, pnpm build — stalled without output; stopped. The pnpm stalls are reviewer-environment limitations, not failures attributed to this range. The author reports all four checks passing.

The saved manual-run report shows six morning checks plus preflight passed, with no skips, failures, or flaky results. Its companion preflight file still identifies 48b959a; therefore that run cannot independently establish verification of this reviewed head. Current-head CI and Preview evidence were not confirmed.

No files were edited, dependencies installed, migrations applied, or Playwright tests run. Live env files were not opened. This review does not issue a Launch Gate GO.

**APPROVE** — no Blocking findings; the Should-fix item may be deferred. Merge-base: 0b5b66c582b4314ae4785a71e6e9fa368816a0d2; reviewed head: 7aa1819b5aa930806672304885f0c972ad30487e.

## Disposition of the Should-fix

Deferred by the owner as a copy decision. Recorded as a follow-up in `docs/sprint-prompts/T3-launch-prep.md`. After merge, Morning Check #1 ran on `main` at `67a9935` and succeeded, which is the head-specific execution evidence the reviewer could not confirm.
