# Codex Review Brief — T1 — gate-suite

> Saved before review. Append the reviewer's returned record below; the reviewer does not edit the repository.
> Status: **review not yet returned** (brief prepared 10 September 2026). Merge only after an APPROVE at the reviewed head.

You are the independent, findings-only reviewer for this PR. AGENTS.md governs this review. Do not edit,
stage, commit, push, merge, install dependencies, or run migrations. Review issues introduced by the pinned
range; inspect enough surrounding context to validate them without starting an unrelated full audit.

## Review target

- Repo: 86400websites/bouncing-forward
- PR: opened by the owner from `claude/t1-gate-suite` after the push (number to be filled in when known)
- Branch: claude/t1-gate-suite (context only)
- Merge-base SHA: 07ef8c3bc983fa3db9bedbf19613c345dfc15842
- Reviewed head SHA: the PR head — run `git rev-parse origin/claude/t1-gate-suite` and confirm it matches the PR
- Immutable range: 07ef8c3bc983fa3db9bedbf19613c345dfc15842..HEAD_SHA
- Sprint record: docs/sprint-prompts/T1-gate-suite.md
- Expected changed paths: `tests/e2e/features/**` (new), `tests/e2e/harness/**` (new modules + `auth.ts`, `fixtures.ts`, `preflight.setup.ts`), `tests/e2e/tools/report-rows.mjs` (new), `tests/e2e/README.md`, `playwright.config.ts`, `src/components/auth/auth-form.tsx` (one `data-testid`), `docs/FEATURE-LIST.md`, `docs/PROJECT-STATUS.md`, `docs/ROADMAP.md`, `docs/testing-setup/SETUP-CHECKLIST.md`, `docs/sprint-prompts/T1-gate-suite.md`, this file

First confirm both SHAs and the actual changed-file list. Stop and report a target mismatch before reviewing
if the range, head, PR, or scope does not agree.

## Read for context

- AGENTS.md.
- The sprint record above.
- docs/PROJECT-STATUS.md (10 September bullets) and docs/ROADMAP.md (Launch Gate).
- `.claude/skills/activate-testing/SKILL.md` (Phase 2 rules), `tests/e2e/features/README.md` (the conventions every spec must follow), `tests/e2e/README.md`, docs/ENVIRONMENT-PARITY.md §9, §10, §12, docs/SECURITY-CHECKLIST.md §5, docs/SUPABASE-MCP-SAFETY.md, docs/ENV-VARS-SAFETY.md.
- Source the specs assert against: `src/app/api/**`, `src/app/auth/**`, `src/components/**`, `src/lib/stripe/identify.ts`, `src/lib/mailchimp.ts`, `src/lib/premium.ts`.

## Sprint intent

- Goal and exit condition: one Playwright test per approved line of `docs/FEATURE-LIST.md` v3 (92 lines, 137 registered tests), with the shared harness helpers they need, so the full Launch Gate can run on the gate branch's Preview. Exit: every ID registered once on desktop, read-only lines also at 390 px, typecheck/lint/format clean, local read-only dry run leaves only product findings.
- Intentionally out of scope: any product fix (FM-011 allow-list, share images, the 404 scaffold line, rate limits); the full Preview run (Phase 3); the report; the morning check.
- Owner-authorized exceptions: one `data-testid` attribute in `src/components/auth/auth-form.tsx`; Commit/Push authorised on 10 September 2026 (evening).
- Hosting/Preview state: the gate alias `https://bouncing-forward-git-claude-t1-gate-suite-86400-s-projects.vercel.app` deploys on push; the TEST Supabase URL list and the Stripe sandbox destination point at it (owner, 10 September 2026). Smoke + proofs on that Preview are the owner's/operator's next step; the full suite has not run on any Preview yet.
- Database/migration state: no migration. TEST project only: the suite creates and deletes throwaway `+bf-e2e-` users through the admin API; the fixture accounts are never touched. Production untouched.

## Checks and evidence

- Typecheck: `pnpm typecheck` — pass at the head (tests included by `tsconfig`)
- Lint: `pnpm lint` — pass at the head
- Tests: `PLAYWRIGHT_TARGET=preview PLAYWRIGHT_BASE_URL=<gate alias> pnpm exec playwright test --list` — 137 tests in 42 files; the full suite has not run on a Preview yet (Phase 3)
- Production build: `pnpm build` — pass (run for the local dry run)
- Current CI evidence for HEAD_SHA: Code Check on the PR once opened (Prettier is checked LF-normalised; this checkout is CRLF)
- Current tested Preview evidence for HEAD_SHA: pending — the operator runs `pnpm test:e2e:smoke` and `pnpm test:e2e:proofs` on the gate alias right after the push; results in the PR description
- Local evidence: read-only dry run against a production build wired to TEST — 40 of 45 selected lines pass; the 5 failures are product findings (PG-003, PG-011, PG-018, PR-002, PR-004)

Run commands only with the existing environment. Do not install or change anything to make a check pass.
State every command not run and why.

## Hunt list

1. Correctness: each spec proves its approved line (Feature + Proof of PASS), including the denied half of every boundary; the five annotated wording deviations (AC-003f, PR-002, PY-013, PY-015, FM-005) are honest, not weakened assertions; no `test.fail()`, no unapproved `test.skip()` (FM-004's N/A is the only approved one; MANUAL lines skip by design).
2. Authorization: nothing in the harness or specs bypasses or weakens a protection — the bypass secret goes only to the verified Preview origin (cookie hand-off, `fixtures.ts`, `roles.ts`); the `api` fixture is pinned to an empty session; role contexts come only from the saved fixture states; the Stripe helper refuses a session whose return address is off the target (`assertSessionReturnsToTarget`) so a browser is never sent to Production.
3. Secrets/env: no value from `.env.e2e.local` or Vercel can reach a title, message, annotation, URL in an error, or the JSON report — check `fillQuietly`, the withheld-value error messages in `test-supabase.ts`, `public-client.ts`, `stripe.ts`, `mailchimp.ts`, `secret-shapes.ts`, `report-rows.mjs`; `expectPdf` labels never carry a `code=` value; `listTestWebhookEndpoints` strips the query.
4. Data safety: `cleanup.teardown.ts` and `test-supabase.ts` refuse the fixture accounts and any address without `+bf-e2e-`; `archiveMember` likewise; nothing writes to the PROD project (`TEST_SUPABASE_REF` checks); the shared services receive one write per identity per run and every write is registered with `recordFixture`; FM-011's side effect (a `premium` tag on the `tagprobe` identity while the hole is open) is disclosed.
5. Input safety: PR-006 and AC-016/AC-017 probes only send data to the target origin through the `api` fixture; no absolute URL to any other host except the documented example.com return address, which is answered inside the browser (`page.route`).
6. Build/deploy: `playwright.config.ts` changes (teardown, `grepInvert`) do not alter the smoke/proof projects or CI selection; `preflight.setup.ts` local-mode refusals cannot reject a valid Preview; the one `data-testid` is behaviour-neutral; no dependency or lockfile change.
7. Scope/content: actual paths match the list above; approved copy asserted verbatim from the components; `docs/FEATURE-LIST.md` changes are the recorded approval, the FM-011 addition and status/change-log lines — no approved line rewritten.
8. Regressions: the harness changes to `auth.ts`, `fixtures.ts` and `preflight.setup.ts` keep SM-001, P1a and P6a and the morning-check refusals working.

Do not open a live-value env file from the worktree. Never echo a suspected secret value. Identify only
its file, line, and type and recommend rotation.
Report serious, evidence-backed issues only; no style nits.

## Returned record

Begin with:

- Confirmed range: 07ef8c3bc983fa3db9bedbf19613c345dfc15842..HEAD_SHA
- Scope match: [YES / NO — explanation]
- Files/context inspected: [LIST]
- Commands/evidence checked: [RESULTS_AND_SKIPS]

For each finding:

### Finding [N]

- **Severity:** Blocking / Should-fix
- **Location:** [path/file.ext:line plus route/flow]
- **Issue:** [One or two evidence-based sentences.]
- **Failure scenario:** [Concrete input/state → wrong outcome.]
- **Suggested fix:** [Specific minimal fix.]
- **Confidence:** high / medium / low

If there are no findings, state **No findings** and list the correctness, safety, build, and Preview paths
verified. Do not return a bare approval.

End with exactly one:

**Verdict: [APPROVE / REQUEST CHANGES]** — [ONE_LINE_REASON].
Reviewed range: 07ef8c3bc983fa3db9bedbf19613c345dfc15842..HEAD_SHA · Reviewed by [REVIEWER] on [DATE].

The owner or builder appends this returned record to docs/code-reviews/T1-gate-suite-review.md.
Any substantive change after HEAD_SHA invalidates approval and requires updated checks, a refreshed Preview,
and independent review of the new immutable head. A commit that only appends this review record may be
exempt when its documentation-only scope and reviewed head are recorded.
