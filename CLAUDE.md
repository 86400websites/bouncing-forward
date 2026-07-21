# Bouncing Forward Website — Claude Code Instructions

> Drop this file into the repo root of a new website. It configures how Claude Code works in this project. Replace `Bouncing Forward` and any other placeholders with the real values. Companion docs in the same repo: [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md) (the locked stack), [`WORKFLOW.md`](./WORKFLOW.md) (the branch → PR → Preview → merge process), [`DESIGN.md`](./DESIGN.md) (the visual system), [`AGENTS.md`](./AGENTS.md) (rules for other agents).

## Project context

This repository contains the **Bouncing Forward** website, built on the locked Next.js 15 stack described in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md).

GitHub is the source of truth. Vercel hosts production and preview deployments. Claude Code is the primary engine for focused code changes, debugging, cleanup, and improvements.

> **Migration guard.** The current defaults are **pnpm**, **Next.js App Router**, and **Vercel**. If you find `npm`, `VITE_*`, `localhost:5000`, `dist/`, React Router, or Replit in older notes, treat it as historical context, not current practice. Trust the repo over any stale note.

## Current stack (verify before assuming)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript strict
- **Package manager:** pnpm (pinned via `packageManager` in `package.json`) — use `pnpm`, never `npm` or `yarn`
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animation:** Framer Motion
- **Forms:** react-hook-form + zod (when the site has forms)
- **Auth + DB:** Supabase via `@supabase/ssr` (browser + server clients + `middleware.ts` session refresh) — **only if this site uses auth/DB**
- **Optional integrations (only if present in this repo):** server-only Route Handlers under `src/app/api/*` for things like marketing email, transactional email; plus optional analytics, error tracking, rate limiting, and CAPTCHA. Each no-ops cleanly when its env vars are absent.
- **Hosting:** Vercel
- **Source control:** GitHub

If the on-disk reality disagrees with this list, **trust the code** (especially `package.json`, `next.config.ts`, and `TECH-ARCHITECTURE.md`).

## How to behave in this project

- Make the **smallest safe change** that solves the task.
- **Preserve current behavior** unless the task explicitly changes it.
- Keep scope narrow — one focused change at a time.
- Follow the existing coding style and file organization.
- When in doubt, choose the smallest safe option and say what you chose.

## Before making changes (inspect)

1. Inspect the repository structure.
2. Confirm the framework, package manager, scripts, and app entry points from the repo itself (`package.json`, `next.config.ts`, `src/app/`).
3. Read the relevant files before editing them.

## Plan before changing

4. Summarize the intended change briefly **before editing**.
5. For anything non-trivial (auth, data, payments, env handling, security headers, routing), propose a short plan first and keep it focused.

## When making changes

1. Work only on the current branch.
2. Do not make unrelated refactors.
3. Do not change unrelated UI, copy, routing, environment variables, or project structure unless required by the task.
4. Preserve existing routes, components, copy, layout, styling, and assets unless the task says otherwise.
5. Avoid adding new dependencies unless clearly necessary (see Dependency rules below).
6. Never hardcode secrets, API keys, tokens, credentials, or private URLs — use environment variables.

### Respect Next.js App Router conventions

- Routes live under `src/app/`. A folder with `page.tsx` is a route; `layout.tsx` wraps its subtree.
- API endpoints are **Route Handlers** at `src/app/api/<name>/route.ts` — never legacy `pages/api`.
- Use `loading.tsx` / `error.tsx` / `not-found.tsx` where they fit; co-locate metadata via the `metadata` export or `generateMetadata`.
- File location does **not** provide access control — every protected route needs an explicit server-side auth check.

### Handle server / client boundaries correctly

- **Server Components are the default.** Add `"use client"` only when a component needs state, effects, browser APIs, or event handlers.
- Read **server-only** env vars and call provider SDKs / the server Supabase client only in Server Components, Route Handlers, Server Actions, or `instrumentation.ts`.
- Client Components may read **only** `NEXT_PUBLIC_*` env vars. Never pass a secret into a Client Component as a prop — it ships to the browser.
- Keep secret use and heavy data fetching on the server; pass minimal, already-safe data down.

### Protect env vars and Supabase secrets

- In frontend (browser-reachable) code, use **only** public env vars prefixed `NEXT_PUBLIC_*` (e.g. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- Never put a server-only secret behind a `NEXT_PUBLIC_*` name.
- Never use Supabase `service_role` / `sb_secret_*` / JWT secret / database password in frontend code. The secret key bypasses Row Level Security and belongs only in trusted server contexts.
- Server-only secrets (e.g. Supabase secret key, `MAILCHIMP_API_KEY`, `RESEND_API_KEY`, `SENTRY_AUTH_TOKEN`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_TOKEN`) must only be read server-side.
- Never commit `.env.local`. If a new env var is needed, note it (name only) for the user to add in Vercel; don't invent values.
- If the change touches a Route Handler: validate inputs with zod, keep secrets server-side, and don't leak stack traces or upstream error bodies to the client.

### Dependency rules

- Prefer the existing stack and standard library before adding anything.
- Add a dependency only when it clearly earns its place; explain why in your summary.
- Never switch the locked layers (framework, package manager, styling, hosting) without an explicit request.

## After making changes (commands to run)

1. Run the relevant checks: `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`. (There is no `test` script by default; run it only if the repo defines one.)
2. If a check fails because of your change, fix it before reporting done.
3. Do not ignore failing checks. If a check fails for a pre-existing reason, say so clearly.
4. Run `git status` and confirm `.env.local` is not staged and no secrets are in the diff.

## Git rules

GitHub `main` is the stable, protected, production-ready branch.

Preferred process:

1. Start from the latest `main`.
2. Create or use a focused task branch.
3. Make the requested change.
4. Run local checks.
5. Commit with a clear message.
6. Prepare the branch for review (push only if asked).
7. Merge into `main` only after CI + Vercel Preview pass and any requested review is done.

**Do not push directly to `main`. Do not push at all unless the owner explicitly asks. Do not merge PRs unless explicitly asked. Do not skip Git hooks (`--no-verify`).**

Branch names: `claude/fix-mobile-header`, `claude/update-homepage-copy`, `claude/improve-contact-section`, `claude/fix-build-error`, `docs/align-workflow`.

Commit messages (short, imperative): `Fix mobile header layout`, `Update homepage section copy`, `Improve contact form validation`.

## Hosting note

If a change affects build output, scripts, security headers, routing, or env handling, keep `vercel.json` and `next.config.ts` consistent — and call this out in your change summary. `next.config.ts` ships security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) and wraps optional integrations when their env vars are present.

## Local development

- Install: `pnpm install --frozen-lockfile`
- Dev: `pnpm run dev` → `http://localhost:3000`
- Typecheck / Lint / Build: `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`
- Production smoke: `pnpm run start`

Copy `.env.example` to `.env.local` for local secrets. `.env.local` is gitignored.

## Output format after each task

End every task with:

1. Summary of what changed.
2. Files changed.
3. Commands/checks run.
4. Results of those checks (typecheck, lint, build).
5. Any risks or follow-up items.
6. Suggested commit message.

## Clarification behavior

If the task is clear, proceed. Ask a clarification question only if the missing information would significantly change the implementation. When in doubt, choose the smallest safe change.
