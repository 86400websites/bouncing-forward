# Personal Website Build System

A small, reusable documentation system for starting and running new websites with a disciplined, safe, AI-assisted workflow.

This is **not** a website. It is the **operating manual** you copy into a new repo so that every site you build follows the same locked stack, the same Git discipline, and the same safety rules — whether it's a marketing site, a SaaS app, a content/blog site, a course site, a lead-gen page, or a personal brand site.

---

## Who this is for

- **You** — the owner/founder building or commissioning the site.
- **Claude Code** — the primary engine for focused code changes, debugging, and improvements.
- **Other coding/review agents** (e.g. Codex) — optional second-pass reviewers.
- **Any human collaborator** who needs the rules of the road fast.

If a tool, agent, or person reads these eight files, they have everything they need to build on this stack consistently and safely.

---

## The eight core files

Copy all eight into the root of every new website repo. Read them in this order.

| # | File | What it answers |
|---|---|---|
| 1 | **`README.md`** (this file) | What the system is, how to start a new site, what never to do. |
| 2 | **`WORKFLOW.md`** | *How we work.* The day-to-day branch → PR → Preview → merge loop, rollback, and env safety. |
| 3 | **`TECH-ARCHITECTURE.md`** | *What we build on.* The locked stack, folder structure, env-var model, Supabase + Vercel architecture, security/SEO/performance checklists. |
| 4 | **`SUPABASE-VERCEL-SETUP.md`** | *How to connect data + hosting safely.* Env-var matrix, Supabase browser/server clients, auth redirect URLs, Preview/Production setup. |
| 5 | **`SECURITY-CHECKLIST.md`** | *What to verify before merge and launch.* Secrets, RLS, auth, server/client boundary, headers, dependencies. |
| 6 | **`CLAUDE.md`** | *Rules for Claude Code* in this repo — how to inspect, plan, make small safe changes, and report. |
| 7 | **`AGENTS.md`** | *Rules for other agents* (Codex, reviewers, automation) — review priorities, what they may and may not change. |
| 8 | **`DESIGN.md`** | *How it looks and moves.* Brand, type, color, layout, motion, accessibility — a template to fill in per project. |

`README.md`, `WORKFLOW.md`, `TECH-ARCHITECTURE.md`, `SUPABASE-VERCEL-SETUP.md`, and `SECURITY-CHECKLIST.md` are the **decision/process layer**. `CLAUDE.md` and `AGENTS.md` are the **agent-instruction layer**. `DESIGN.md` is the **visual layer**. Keep all three layers in sync — `TECH-ARCHITECTURE.md` is the source of truth when any two disagree.

---

## Default stack (locked by default, override consciously)

| Layer | Default |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Language | **TypeScript** (strict) |
| Package manager | **pnpm 10** |
| Styling | **Tailwind CSS v4** |
| Components | **shadcn/ui** |
| Animation | **Framer Motion** |
| Forms | **react-hook-form + zod** |
| Auth + Database | **Supabase** via `@supabase/ssr` (only if the site needs accounts/data) |
| Hosting | **Vercel** |
| Source control | **GitHub** |
| Editor | **VS Code** |
| Primary build engine | **Claude Code** |
| Optional reviewer | **Codex** (or another review agent) |

Optional, add only when a feature needs them: Mailchimp (marketing email), Resend (transactional email), PostHog (analytics), Sentry (error tracking), Upstash Redis (rate limiting), Cloudflare Turnstile (CAPTCHA). Each should **no-op cleanly when its env vars are absent**, so local dev and Preview work without provisioning every provider up front. (In **Production**, live forms and anti-abuse controls must be configured rather than silently no-op — see `TECH-ARCHITECTURE.md`.)

`TECH-ARCHITECTURE.md` is the canonical, detailed version of this table.

---

## The safe build philosophy

Six principles every site on this system inherits:

1. **GitHub is the source of truth.** All code and history live there.
2. **`main` is always production.** It must stay deployable at all times.
3. **One change = one branch = one Pull Request.** No bundling unrelated work.
4. **Pull Requests are the review checkpoint.** Nothing reaches `main` without one.
5. **Vercel Preview is tested before merge.** Local green is necessary but not sufficient.
6. **Secrets never touch the repo.** No `.env.local`, no keys in code, no secret behind a `NEXT_PUBLIC_*` name. Supabase `service_role` / secret keys stay server-only.

Underneath those: make the **smallest safe change**, preserve existing behavior unless the task changes it, and never edit production directly.

---

## Correct order to use the docs when starting a new website

1. **Read `README.md`** (this file) — orient yourself.
2. **Read `TECH-ARCHITECTURE.md`** — confirm the stack and decide which optional integrations this site actually needs.
3. **Fill in `DESIGN.md`** — define the brand, type, and color for *this* site before building screens.
4. **Skim `WORKFLOW.md`** — internalize the branch → PR → Preview → merge loop.
5. **Drop `CLAUDE.md` and `AGENTS.md` into the repo root** — they configure Claude Code and any review agent automatically.
6. **Run the new website setup flow below**, then start your first feature branch.

---

## New website setup flow (short version)

Replace every `[PLACEHOLDER]` with the real value for this project.

1. Create a new **GitHub repository** (private by default) named for `bouncing-forward`.
2. Scaffold the app locally on the locked stack (Next.js 15 App Router, TypeScript, Tailwind v4, src dir), then add shadcn/ui, Framer Motion, and — only if needed — Supabase (`@supabase/ssr`). See `TECH-ARCHITECTURE.md`.
3. Commit `pnpm-lock.yaml`. Never commit `package-lock.json` or `yarn.lock`.
4. Copy the **eight core files** into the repo root and tailor the placeholders (`Bouncing Forward`, `[PRODUCTION_DOMAIN]`, etc.).
5. Confirm `.env.local` is in `.gitignore`. Create `.env.local` with at least `NEXT_PUBLIC_SITE_URL=http://localhost:3000` (add Supabase keys if auth/DB is in scope).
6. Push the first commit to `main`, then import the repo into **Vercel** (accept the `nextjs` preset).
7. Add the env vars in **Vercel → Settings → Environment Variables** for Production, Preview, and Development — **same names, environment-specific values** (don't copy Production `NEXT_PUBLIC_SITE_URL` into Preview; matrix in `SUPABASE-VERCEL-SETUP.md`).
8. Add a CI workflow that runs `pnpm install --frozen-lockfile`, typecheck, lint, build, and a secret scan (e.g. gitleaks) — make it a **required** status check (snippet in `TECH-ARCHITECTURE.md`).
9. Turn on **branch protection** for `main`: require a PR, require CI green, no direct pushes, no force-push.
10. Deploy once, confirm the live URL works, then **from day one** use the branch + PR + Preview workflow.

Full, checkbox version: `WORKFLOW.md`.

---

## What not to do

- ❌ Don't commit `.env.local` or any secret (keys, tokens, connection strings, DB passwords).
- ❌ Don't put a secret behind a `NEXT_PUBLIC_*` name, or use a Supabase `service_role` / secret key in browser code.
- ❌ Don't commit directly to `main` or force-push/rewrite its history.
- ❌ Don't merge a PR without a green CI run **and** a tested Vercel Preview.
- ❌ Don't bundle unrelated changes into one branch or PR.
- ❌ Don't add dependencies you don't need, or make unrelated refactors.
- ❌ Don't skip Git hooks or CI (`--no-verify`) without an explicit, recorded reason.
- ❌ Don't treat old `npm` / `VITE_*` / `localhost:5000` / `dist/` / React Router / Replit references as current — they are historical migration context. The current default is pnpm + Next.js App Router + Vercel.

---

## Customize per project (don't over-standardize)

These eight files are the reusable skeleton. Each new site still needs you to decide:

- `bouncing-forward`, `Bouncing Forward`, `Maher Kaddoura`
- `[PRODUCTION_DOMAIN]`, `bouncing-forward`, `[VERCEL_TEAM_SLUG]` (the Vercel Preview wildcard for your team), `[SUPABASE_PROJECT_REF]`
- `people navigating profound loss or hardship who want a practical way forward` and `the Bouncing Forward book, the free Taking Stock Inventory, and the Compass & Path Check` (shapes copy, design, and SEO)
- Which optional integrations are in scope (`[OPTIONAL_INTEGRATION]` — Supabase, Mailchimp, Resend, PostHog, Sentry, etc.)
- The full `DESIGN.md` brand layer (type, color, motion register)

If a value must stay secret, it goes in `.env.local` / Vercel env vars — never in these docs. Use placeholder names only here.

---

## Optional advanced modules (create later, only if needed)

This version is intentionally lean — just the eight core files. When a project genuinely needs more, you can later add focused modules such as:

- Reusable prompt templates (Claude sprint prompts, Codex review prompts)
- A per-project threat-model template (the reusable controls already live in `SECURITY-CHECKLIST.md`)
- Course / membership / gated-content modules
- Per-site checklists (launch, SEO, accessibility audits)

Don't create these until a real need appears. Keep the core system small and reusable.
