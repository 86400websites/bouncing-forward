# ROADMAP.md — Build Order

The scope and dependency plan for `Bouncing Forward`. Fill it from the approved predevelopment handoff, then run one focused sprint at a time. `PROJECT-STATUS.md` records current state; `WORKFLOW.md` records how work ships.

## Setup Gate — delivery foundation

Setup is a prerequisite, not a product sprint. Complete `docs/templates/NEW-WEBSITE-SETUP-CHECKLIST.md` before Stage 0.

- [ ] Governing docs are filled from the approved handoff; no critical `[PLACEHOLDER]` remains.
- [ ] GitHub repo exists, `main` is protected, CI is required, and direct/force pushes are blocked.
- [ ] The chosen package manager and verification commands are recorded.
- [ ] The approved host builds isolated PR Previews; Vercel is the supplied profile, not a requirement.
- [ ] Production deploys only from `main`; rollback action is recorded and tested where practical.
- [ ] Env-var names are documented without values; live env files are ignored and untracked.
- [ ] Database/auth decision is explicit: none, Supabase, or another recorded choice.

**Exit:** a setup PR has passed local checks, Preview QA, independent review, merge, and Production smoke testing. The repository is ready for product work.

## Stage 0 — fully working barebones website

Build the smallest complete version that performs the website’s approved primary job. Split it into focused sprints when needed, but do not call Stage 0 complete until the whole core journey works.

Required outcome:

- all core routes from the approved sitemap render real approved copy;
- approved shell variants, tokens, responsive layouts, and accessibility baseline are implemented;
- the primary conversion works end to end and produces its real outcome or next step;
- no Production form or CTA reports success while discarding data;
- required security and data controls exist for any auth, database, payment, or gated content needed by the core journey;
- Production build, Preview QA, independent review, and Production smoke test pass.

| Sprint               | Goal / scope                                           | Explicitly out of scope                   | Acceptance criteria                                                                      | Depends on | Status      |
| -------------------- | ------------------------------------------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------- | ---------- | ----------- |
| S0.1 _(example)_     | Public routes, shared shell, tokens, and approved copy | Conversion backend, optional integrations | Every core route renders from 320px through desktop with correct copy and navigation     | Setup Gate | Not Started |
| S0.2 _(example)_     | Primary conversion end to end                          | Secondary forms and analytics             | Valid action delivers; invalid/error paths are honest; abuse controls match architecture | S0.1       | Not Started |
| S0.3 _(conditional)_ | Minimum auth/gate needed for the primary job           | Optional member tools                     | Each role is proven on Preview; unauthorized users receive no protected data             | S0.2       | Not Started |

Delete or replace the examples. If auth/gating is not essential to the primary job, defer it to a later stage.

## Stage 1 — approved MVP additions

Add only approved features that are not required for the barebones primary journey. Order them by dependency: schema before writes, access control before protected content, content model before editors, and provider setup before an integration is enabled.

| Sprint      | Goal / scope          | Explicitly out of scope | Acceptance criteria           | Depends on             | Status      |
| ----------- | --------------------- | ----------------------- | ----------------------------- | ---------------------- | ----------- |
| [SPRINT_ID] | [one focused outcome] | [named exclusions]      | [observable, testable result] | [gate/sprint/decision] | Not Started |

Every sprint gets a record at `docs/sprint-prompts/[SPRINT_ID]-[SLUG].md`.

## Launch Gate

- [ ] All launch-scope sprints are Done; accepted deferrals cite a decision ID and backlog owner.
- [x] Launch Gate harness installed and proven on a verified Preview (sprint T0, PR #36 merged 9 September 2026 — `docs/sprint-prompts/T0-testing-readiness.md`). `docs/FEATURE-LIST.md` v3 approved by the owner on 10 September 2026; the suite (one test per line) is written on `claude/t1-gate-suite`.
- [ ] **Launch Gate passed (GO).** Still **NO-GO** by the gate's own rule (100 % on a full run), but the picture changed on 11 September 2026. First full run at `8b5460c`: 104 passed · 16 failed (`docs/test-reports/2026-09-11-test-report.md`). Then sprint T2 (PR #38, merged `0b5b66c`) fixed the suite and shipped the critical fixes — **FM-011 the Blocker and PR-006 are verified fixed**, last full run at `c56e9ec` 105 passed · 12 failing lines. Remaining red, all by decision or provider: PR-001–PR-004 deferred (Upstash + Turnstile); PG-003, PG-011, PG-018 accepted cosmetic; FM-002/005/006, FM-010, PY-010 blocked by Mailchimp's temporary per-address signup restriction on the test mailbox (fixes unit-tested, unproven live — one controlled check then a full run when it lifts). Records: `docs/sprint-prompts/T2-gate-run-and-critical-fixes.md`, `T3-launch-prep.md`.
- [x] **Morning check live** (sprint T3, PR #39 merged `67a9935`, 11 September 2026): six owner-approved read-only checks (PG-001, PG-005, PG-007, PG-015, AC-011, IN-010) run daily at 01:30 UTC against Production; **Morning Check #1 succeeded** on `main`. The failure-email path is unverified by the owner's choice.
- [x] **Launch prep** (sprint T3): four Amazon listings live (Kindle, Hardcover, Paperback, Workbook); Privacy and Terms settled with no confirm marker left (still noindexed by owner decision); Google Search Console verified and `sitemap.xml` submitted — 21 pages discovered.
- [ ] Full `QA-CHECKLIST.md`, `SECURITY-CHECKLIST.md`, and `LAUNCH-CHECKLIST.md` pass.
- [ ] Primary journey works on the real domain.
- [ ] Content sites have an approved editorial workflow, editor roles, media ownership, redirects, backup/export plan, and client training.
- [ ] Rollback owner and action are known; database recovery limits are understood.

## Post-launch backlog

Deferred or retired scope is never silently deleted. Record the item, value, owner, dependency, decision ID, and reason. Promote one item at a time into a scoped sprint.

## Universal sprint exit gate

- [ ] Allowed paths and acceptance criteria are satisfied; out-of-scope behavior is preserved.
- [ ] `[TYPECHECK_COMMAND]`, `[LINT_COMMAND]`, `[TEST_COMMAND_OR_N/A]`, and `[BUILD_COMMAND]` pass.
- [ ] Manual and accessibility checks for affected journeys pass.
- [ ] Deployed Preview is tested on desktop and mobile; Vercel or the approved equivalent is named in the record.
- [ ] Security sections touched by the diff pass.
- [ ] Codex reviewed the immutable merge-base-to-head range and returned Approve.
- [ ] No substantive change occurred after the reviewed head; otherwise Preview and review were repeated.
- [ ] `PROJECT-STATUS.md` and this roadmap were updated in the same authorized branch.
- [ ] After merge, Production smoke test passes.

Database sprints additionally record migration classification (additive, reversible, or destructive), non-production verification, backup/recovery needs, and the fact that schema rollback cannot restore lost data.

## Ordering rationale

`[One short paragraph explaining why this sequence is the smallest safe path to the primary outcome. Cite decision IDs when the order changes.]`

**Next:** set the active sprint in `PROJECT-STATUS.md`, then run it through `WORKFLOW.md`.
