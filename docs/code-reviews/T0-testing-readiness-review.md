# Codex Review Brief — T0 — testing-readiness

> Saved before review. Append the reviewer's returned record below; the reviewer does not edit the repository.
> Status: **review not yet returned** (brief prepared 9 September 2026). Merge only after an APPROVE at the reviewed head.

You are the independent, findings-only reviewer for this PR. AGENTS.md governs this review. Do not edit,
stage, commit, push, merge, install dependencies, or run migrations. Review issues introduced by the pinned
range; inspect enough surrounding context to validate them without starting an unrelated full audit.

## Review target

- Repo: 86400websites/bouncing-forward
- PR: #36 — https://github.com/86400websites/bouncing-forward/pull/36
- Branch: codex/testing-readiness (context only)
- Merge-base SHA: ffae77a803d8be5ccf3d13d592e7f0c0639e5cfd
- Reviewed head SHA: 3c8eea0 (full SHA: run `git rev-parse origin/codex/testing-readiness` and confirm it matches the PR head)
- Immutable range: ffae77a803d8be5ccf3d13d592e7f0c0639e5cfd..3c8eea0
- Sprint record: docs/sprint-prompts/T0-testing-readiness.md
- Expected changed paths: `.github/workflows/{morning-check,preview-tests}.yml`, `.gitignore`, `CLAUDE.md` (one pointer line), `package.json`, `pnpm-lock.yaml`, `playwright.config.ts`, `tests/e2e/**`, `src/app/api/health/route.ts`, `src/app/api/checkout/route.ts`, `src/app/api/stripe/{verify,webhook}/route.ts`, `src/app/auth/{actions.ts,confirm/route.ts}`, `src/app/forgot-password/page.tsx`, `src/app/sitemap.ts`, `src/components/site/contact-form.tsx`, `src/lib/request-origin.ts`, `src/lib/stripe/{checkout,identify}.ts`, `public/google777f049a86d5990c.html`, `docs/**` (ENVIRONMENT-PARITY, FEATURE-LIST, PROJECT-STATUS, TECH-ARCHITECTURE, testing-setup, sprint-prompts, code-reviews), `.claude/skills/activate-testing/SKILL.md`, removal of `bouncing-forward-30august-4.40.zip`.

First confirm both SHAs and the actual changed-file list. Stop and report a target mismatch before reviewing
if the range, head, PR, or scope does not agree.

## Read for context

- AGENTS.md.
- The sprint record above.
- docs/PROJECT-STATUS.md (9 September bullets) and docs/ROADMAP.md (Launch Gate).
- docs/ENVIRONMENT-PARITY.md §4, §5, §10, §12; docs/SECURITY-CHECKLIST.md §3, §5; docs/SUPABASE-MCP-SAFETY.md; docs/ENV-VARS-SAFETY.md; docs/testing-setup/SETUP-CHECKLIST.md; tests/e2e/README.md.

## Sprint intent

- Goal and exit condition: install the Launch Gate harness and prove it on a verified deployed Preview (Phase 0), draft the feature list for owner approval (Phase 1), and ship the owner-authorised focused fixes (password reset callback safety, contact-form honesty, Stripe purchase identification on a shared account, trusted-host origins, sitemap correction, Google verification file). Exit: PR green, Preview smoke + proofs + fixture sign-ins passed, records current.
- Intentionally out of scope: product test specs (await feature-list approval); rate limiting / Turnstile; Sentry; the 404 scaffold line; second capture path for the newsletter; legal-page confirmations.
- Owner-authorized exceptions: application files beyond testing (listed above); Next.js 15.5.20 → 15.5.24 for the audit gate; CLAUDE.md one-line pointer from the module install; commit/push authorised 9 Sep 2026.
- Hosting/Preview state: Vercel Preview of `654444d` (`bouncing-forward-2d25v8xkf-86400-s-projects.vercel.app`) and the branch alias serving `b9e8dc2` verified by the preflight (environment preview, this project, TEST Supabase, test-mode Stripe); SM-001, P1a, P6a and both fixture sign-ins passed 9 Sep 2026. Protection = Vercel Authentication, bypassed with the sanctioned secret (to be rotated — it appeared in an owner screenshot).
- Database/migration state: no migration in this range. TEST project: two fixture users and one entitlement row added through the approved `supabase-dev` connection. Production untouched.

## Checks and evidence

- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Tests: `pnpm test:e2e:smoke` / `pnpm test:e2e:proofs` against the verified Preview only (needs `.env.e2e.local`; never Production)
- Production build: `pnpm build`
- Current CI evidence for HEAD_SHA: Code Check green at `654444d`; confirm the re-run at the PR head on PR #36
- Current tested Preview evidence for HEAD_SHA: preflight/smoke/proofs pass on the alias serving `b9e8dc2` (9 Sep 2026); `3c8eea0` only untracks a zip and edits `.gitignore`

Run commands only with the existing environment. Do not install or change anything to make a check pass.
State every command not run and why.

## Hunt list

1. Correctness: exit criteria work in realistic success, empty, loading, and failure states that apply — especially the auth callback (`code` and `token_hash` paths, recovery vs sign-up), the contact form's provider-confirmed success, and the webhook's ordering (signature → livemode → paid → classify → entitlement → Mailchimp).
2. Authorization: `/api/premium/download`, `/account`, and the checkout paths still authorize server-side; no admin role is introduced.
3. Secrets/env: no live values anywhere (docs, tests, workflows, `public/`); `/api/health` returns identifiers and flags only, reduced on Production; `privilegedRef()` never exposes key material; harness never logs values; uploaded artefact is `preflight.json` only.
4. Data safety: shared Stripe account — `src/lib/stripe/identify.ts` must never let a foreign checkout write an entitlement or tag an email, and must still honour legacy Bouncing Forward shapes (return-URL, Payment-Link by price, old metadata); the Unretire event shape (subscription mode, `metadata.app = unretire`, unretireproject.com return URLs) is ignored with 200; live/test mismatch → 500.
5. Input safety: `safeNext` in `src/app/auth/confirm/route.ts` (protocol-relative, backslash, tab/newline, encoded slashes, long values); `src/lib/request-origin.ts` trusted-host rule (fixed hosts + Vercel-injected deployment hosts only; localhost only off-Vercel); `originFromOriginHeader`.
6. Build/deploy: `export const dynamic` on the health route; Next.js 15.5.24 patch bump; lockfile integrity; workflows reference secrets by name only; `.gitignore` additions.
7. Scope/content: only the paths above; approved copy unchanged (the only new user-visible string reuses the existing “Your reset link has expired or is invalid. Please request a new one.”); sitemap lists only indexable routes; Google file byte-identical to the supplied original.
8. Regressions: login/signup/logout/checkout (logged-in and intent flows), downloads, newsletter, legacy access codes, old Payment-Link returns, redirects; harness guards (Production refusal, zero-test failure, `@morning`-only in production mode).

Do not open a live-value env file from the worktree. Never echo a suspected secret value. Identify only
its file, line, and type and recommend rotation.
Report serious, evidence-backed issues only; no style nits.

## Returned record

_(To be appended by the reviewer.)_

Begin with:

- Confirmed range: ffae77a803d8be5ccf3d13d592e7f0c0639e5cfd..[HEAD_SHA]
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
Reviewed range: ffae77a803d8be5ccf3d13d592e7f0c0639e5cfd..[HEAD_SHA] · Reviewed by [REVIEWER] on [DATE].
