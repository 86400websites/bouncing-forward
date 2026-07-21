# Bouncing Forward — Sprint Plan (Stages 7–10)

> One sprint = one branch = one PR, per `WORKFLOW.md`. Every sprint ends with: local typecheck/lint/build green → PR → CI green → Vercel Preview tested (desktop + mobile) → merge. Use the Claude Code prompt in `WORKFLOW.md` §7 with the task line below.

## Stage 4–6 first (before any sprint)

- [ ] **S0 — Foundational repo** (directly on `main`, once, before branch protection): scaffold Next.js 15 App Router + TypeScript strict + Tailwind v4 + pnpm; add shadcn/ui, Framer Motion; copy the 8 core files + `SITEMAP-AND-FEATURES.md` + `SPRINT-PLAN.md` + `supabase/` into the repo root; move `public-assets/assets/` → `public/assets/`; `.env.example` in, `.env.local` gitignored; barebones route stubs for all 8 routes; CI workflow; first commit → push → import to Vercel → deploy → confirm live → **then enable branch protection on `main`**.
- [ ] **S0b — Supabase provisioning**: create TWO projects (production + non-production); apply `supabase/sql/001` to non-production; record `[SUPABASE_PROJECT_REF]`s; add env vars in Vercel (Production/Preview/Development, environment-specific values); redeploy.

## Sprints (in order)

| # | Branch | Task | Notes / gates |
|---|---|---|---|
| 1 | `feature/design-tokens` | globals.css tokens + next/font (Archivo 700/800, Source Serif 4 400/600) + shadcn theming per DESIGN.md §3–4 | Visual gate: token sample page on Preview |
| 2 | `feature/site-shell` | Nav (label constant in `src/lib/site.ts`), footer (3 columns + Part of Half a Life), motion primitives (`FadeIn`, `SlideUp`, `Stagger`, `StaggerItem` with `useReducedMotion`), base metadata | CSP moved to sprint 15: the allow-list isn't final until Turnstile/analytics land, and a premature CSP breaks Next's inline runtime |
| 3 | `feature/home-page` | Full Home per copy deck | Copy verbatim; image slots per DESIGN.md §9 |
| 4 | `feature/book-page` | The Book | Testimonials render as supplied placeholders; Amazon CTA disabled state |
| 5 | `feature/compass-and-path-page` | Framework deep-dive page | Numbered 01–04 card unit becomes reusable |
| 6 | `feature/stories-page` | Featured story + 10 story cards + Share Your Story CTA (form arrives sprint 10) | 4 story illustrations missing — placeholder treatment, flagged |
| 7 | `feature/learn-page` + `feature/about-page` | Two lighter pages (separate branches, can run back-to-back) | About portrait = asset gap placeholder |
| 8 | `feature/newsletter-capture` | `/api/newsletter` Route Handler → Mailchimp (zod, rate-limit hook, fail-closed in prod) + reusable Begin Your Crossing component wired on all pages + Taking Stock delivery | Test on Preview with a test audience; PR lists env var names only |
| 9 | `feature/assessment` | `/assess` UI: 8 questions, two scale vocabularies, prompts, scoring, results screen with 8-spoke compass visual + weakest-light action-plan structure | Keyboard-operable radio groups; client-side only this sprint |
| 10 | `feature/assessment-persistence` | `/api/assessment` Route Handler → `submit_assessment()` RPC; subscribe-at-results → Mailchimp with score merge fields + weakest-light tag | SQL already applied to non-prod (S0b); apply to Production per protocol at merge |
| 11 | `feature/share-your-story` | Story submission form → Route Handler → Resend (or Supabase table — decide at sprint start) + Turnstile | Fail-closed in Production |
| 12 | `feature/seo-structured-data` | `sitemap.ts`, `robots.ts`, canonicals, JSON-LD (Book/Person/Organization), `opengraph-image.tsx` | Validate with Rich Results test on Preview |
| 13 | `feature/tool-pdfs` | 11 canvases → branded PDFs; Taking Stock gated via capture; others linked on Compass & Path | Source docx in `source-materials/tools/` |
| 14 | `feature/legal-pages` | `/privacy` + `/terms` drafts | Flag for Maher's review before launch |
| 15 | `feature/launch-hardening` | Compression pass on >200KB images, logo SVG, Lighthouse 95+ pass, full `SECURITY-CHECKLIST.md` run, missing-asset swap-in | Blocking gate before domain go-live |

## Deferred (later phases — do not build now)

Course/E-Learning (Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` reserved) · Enterprise page · Blog engine · Podcast pages · Accounts/auth.

## Standing rules

- Copy comes from the deck **verbatim** — book-sourced quotes are sacrosanct.
- No dead links ship: unresolved destinations render as non-link "coming soon" states.
- Every PR: no secrets in diff, env var names only, Preview tested on desktop + mobile before merge.
