# Bouncing Forward Website — Agent Instructions

> Drop this file into the repo root of a new website. It governs **non-primary agents** — code-review agents (e.g. Codex), automation, and any tool other than the main Claude Code engine. The primary engine's rules live in [`CLAUDE.md`](./CLAUDE.md). Stack details are in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md); process is in [`WORKFLOW.md`](./WORKFLOW.md). Replace `Bouncing Forward` and other placeholders.

## Project assumptions

- This repository is the **Bouncing Forward** website on the locked Next.js 15 stack in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md).
- GitHub is the source of truth; `main` is protected and production-ready. Vercel hosts Production and Preview.
- Agents make **focused, reviewable** contributions. Default mode is **review**, not large edits.
- Only code that ships in a production build is in scope. Verify claims against the repo before acting.

## Stack assumptions (verify against the repo first)

- **Framework:** Next.js 15 (App Router), TypeScript strict
- **Package manager:** pnpm (pinned via `packageManager`) — do not use `npm` or `yarn` commands
- **Styling:** Tailwind CSS v4 + shadcn/ui; **Animation:** Framer Motion; **Forms:** react-hook-form + zod (when present)
- **Auth + DB:** Supabase via `@supabase/ssr` with `middleware.ts` session refresh — **only if this site uses auth/DB**
- **Optional integrations:** server-only Route Handlers under `src/app/api/*` plus optional analytics, error tracking, rate limiting, CAPTCHA — each no-ops when its env vars are absent
- **Hosting:** Vercel (preset `nextjs`, install `pnpm install --frozen-lockfile`, build `pnpm run build`)

> **Migration guard.** Current defaults are pnpm, Next.js App Router, and Vercel. Treat `npm` / `VITE_*` / `localhost:5000` / `dist/` / React Router / Replit references as historical, not current. Trust the repo (`package.json`, `next.config.ts`, `src/app/`) over any stale note.

## Review style: serious issues only

- Report **serious issues only** — correctness bugs, security/data-safety problems, broken auth, leaked secrets, App Router boundary mistakes, build/deploy breakage.
- Do **not** raise style nits, formatting, or subjective preferences (lint/Prettier own those).
- Prefer a few high-confidence findings over a long list of maybes. If you're unsure, say so and mark it low-confidence.
- Review the **PR / branch diff**, not the whole repo, unless explicitly asked for a full audit.

## Review priorities (in order)

1. **Correctness** — does the change do what it claims without breaking existing behavior?
2. **Security & data safety** — secrets, auth, input validation, RLS, injection, open redirects.
3. **Server/client boundary** — secrets or heavy logic leaking into client components.
4. **App Router correctness** — routing, metadata, server-side auth checks.
5. **Build & deploy health** — typecheck/lint/build pass; Vercel/env implications handled.
6. **Maintainability** — only when it rises to a real problem, not preference.

## Security checks

- [ ] No secret committed; `.env.local` not in the diff; no secret behind a `NEXT_PUBLIC_*` name
- [ ] Server-only secrets (Supabase secret key, email/API keys, auth tokens, rate-limit/CAPTCHA secrets) used **only** in Server Components, Route Handlers, Server Actions, or `instrumentation.ts`
- [ ] Route Handlers zod-validate request bodies; params/headers/cookies treated as untrusted
- [ ] No `dangerouslySetInnerHTML` / `innerHTML` fed by user-controlled or query data
- [ ] Auth redirect targets validated same-origin (no open redirect via `?next=` and similar)
- [ ] Public write endpoints rate-limited and CAPTCHA-protected where applicable
- [ ] Error responses don't leak stack traces, credentials, internal URLs, or upstream error bodies
- [ ] Security headers in `next.config.ts` and the CSP allow-list not weakened; any leaked key flagged for rotation

## App Router checks

- [ ] Routes under `src/app/`; API endpoints are Route Handlers at `src/app/api/<name>/route.ts` (no `pages/api`)
- [ ] `"use client"` used only where interactivity requires it; Server Components remain the default
- [ ] No secret passed from a Server Component into a Client Component as a prop
- [ ] Protected routes have an **explicit server-side auth check** (file location is not access control)
- [ ] Per-route `metadata` (title, description, canonical, OG) intact for SEO

## Supabase checks (if the site uses auth/DB)

- [ ] Frontend uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] `service_role` / `sb_secret_*` / JWT secret / DB password never reach client code; secret-key paths are trusted server contexts only
- [ ] RLS enabled default-deny on every user-reachable table; new tables ship with policies
- [ ] Controlled reads/writes go through the user's session under RLS or a `SECURITY DEFINER` RPC — no app path relies on the secret key for normal user data
- [ ] Public-facing projections (e.g. verification endpoints) don't leak PII
- [ ] Schema changes include the SQL **and** RLS policies in the PR (applied by hand via the dashboard, not auto-run)

## Vercel deployment checks

- [ ] New/changed env vars are listed in the PR (names only) and noted for Production/Preview/Development; a redeploy is required to take effect
- [ ] `NEXT_PUBLIC_*` (build-time, public) vs server-only (runtime) usage is correct for each new var
- [ ] `vercel.json` and `next.config.ts` stay consistent if build output, scripts, headers, or routing changed
- [ ] Auth email links resolve to the request/Preview origin — Preview must not redirect users to Production
- [ ] Change is testable on a Vercel Preview before merge

## What agents may and may not change

**May:**
- Review and comment on the diff.
- Make the **specific, requested** change on a focused branch when explicitly asked to edit.
- Add/adjust tests or docs directly tied to the requested change.

**May not (without an explicit request):**
- Broad refactors, reformatting, or renaming across files.
- Changing unrelated copy, layout, routing, configs, or dependencies.
- Adding new production dependencies, or swapping locked stack layers.
- Changing env vars, security headers, or CSP.
- Committing to `main`, pushing, merging PRs, or skipping Git hooks (`--no-verify`).

## Secrets & `.env.local` rules

- Never read, echo, copy, or commit `.env.local` or any secret value.
- Never hardcode secrets, credentials, API keys, tokens, or private URLs. Use env vars; reference variables by **name** only.
- Never place a server-only secret behind a `NEXT_PUBLIC_*` name.

## No broad refactors unless requested

- Keep scope to the task. Make the smallest safe change.
- Follow existing code style and file organization; do not introduce a new pattern to a one-line fix.
- If you spot a larger issue outside scope, **report it as a finding** — don't fix it unprompted.

## If an agent edits code (working agreements)

1. Inspect the repo; detect framework, scripts, and entry points (`package.json`, `next.config.ts`, `src/app/`).
2. Read relevant files; explain the planned change briefly; keep scope narrow.
3. Make the smallest safe change; follow existing style.
4. Run available checks: `pnpm run typecheck`, `pnpm run lint`, `pnpm run build` (no `test` script by default). Fix failures you caused; flag pre-existing ones.
5. Run `git status`; confirm `.env.local` is not staged and no secrets are in the diff.
6. Use a focused branch (e.g. `codex/fix-mobile-header`, `codex/improve-contact-section`, `docs/align-workflow`). One agent per branch at a time.
7. Do not push, merge, or commit to `main` unless explicitly instructed.

## How to report findings

For each finding, give:

1. **Severity** — Critical / High / Medium / Low (or Blocking / Non-blocking).
2. **Location** — `path/to/file.ts:line` (and the route/endpoint if relevant).
3. **Issue** — what's wrong, concisely.
4. **Why it matters** — the concrete risk or breakage.
5. **Suggested fix** — the smallest safe correction.
6. **Confidence** — note when a finding is uncertain.

End an edit task with: summary, files changed, checks run + results (typecheck, lint, build), risks/follow-ups, and a suggested PR title + description. End a review task with the prioritized findings list and a clear merge recommendation (approve / request changes / blocking issues).
