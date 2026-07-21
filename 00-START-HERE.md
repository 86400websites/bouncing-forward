# Bouncing Forward — Foundation Package

Everything needed to run Stage 4 (foundational repo) through Stage 10 (sprints) in Claude Code. Built on the 8-file Personal Website Build System with the locked decisions: **standalone repo · Supabase in full use from day one · nav label pending Maher/Heather sign-off**.

## What's in this package

| Path | What it is |
|---|---|
| `README.md` `WORKFLOW.md` `TECH-ARCHITECTURE.md` `SUPABASE-VERCEL-SETUP.md` `SECURITY-CHECKLIST.md` `CLAUDE.md` `AGENTS.md` | The 8-file system, tailored: Bouncing Forward / bouncing-forward / Maher Kaddoura filled in |
| `DESIGN.md` | **Fully filled** brand layer — palette (contrast-verified), type pairing, motion register, component rules, asset map, and the accent-color accessibility rule everyone must know |
| `SITEMAP-AND-FEATURES.md` | Stage 1 deliverable — routes, copy status, the no-copy link decisions, feature list, integration matrix |
| `SPRINT-PLAN.md` | Stages 7–10 pre-built: S0 scaffold checklist + 15 ordered one-branch sprints |
| `supabase/sql/` | `001` up + down SQL (assessment table, default-deny RLS, hardened RPC) + apply-protocol README |
| `.env.example` | Tailored env template (Stripe reserved, commented out) |
| `public-assets/assets/` | All 29 web images, renamed kebab-case and organized into `logo/ book/ home/ framework/ learn/ stories/` — becomes `public/assets/` in the repo |
| `source-materials/tools/` | The 11 tool canvas .docx files (PDF conversion is sprint 13) |
| `source-materials/oversized-originals/` | The 1MB+ PNG originals + print PDF, kept out of the web bundle |

## Three placeholders still open (fill at provisioning — everything works without them until then)

1. `[PRODUCTION_DOMAIN]` — no custom domain yet; production runs on `bouncing-forward.vercel.app` until one is chosen. When bought, find-replace across the docs + Vercel/Supabase URL config per `SUPABASE-VERCEL-SETUP.md`.
2. `[VERCEL_TEAM_SLUG]` — from your Vercel account (same as UnRetire's); needed for the Supabase Preview redirect wildcard only when auth arrives (not phase 1).
3. `[SUPABASE_PROJECT_REF]` — two values, one per project (production + non-production), created at step S0b.

## Kickoff in Claude Code (Stage 4)

1. Create the private GitHub repo `bouncing-forward`.
2. Drop this package's root files into the repo root; move `public-assets/assets/` → `public/assets/`.
3. Open the repo in VS Code, start Claude Code — it reads `CLAUDE.md` automatically.
4. Run S0 from `SPRINT-PLAN.md` (scaffold → first commit → Vercel import → live check → branch protection ON).
5. Run S0b (two Supabase projects; apply `supabase/sql/001` to non-production first).
6. Start sprint 1 with the `WORKFLOW.md` §7 prompt.

## Decisions made in this package (changeable, flagged)

- **Route slug `/compass-and-path`** regardless of the pending label decision — the label is one constant in `src/lib/site.ts`, so sign-off changes one line, no redirects.
- **Type pairing [PROPOSED]:** Archivo (display) + Source Serif 4 (body), echoing the book cover. Swap at the Stage 2 gate if Maher/Heather prefer otherwise — one-file change.
- **Accent color rule:** the brand blue `#0CA1D9` fails WCAG AA as text on white (2.95:1) — DESIGN.md defines an AA-safe darkened variant `#067CA8` for eyebrow labels and links. Graphics keep the true brand blue.
- **Assessment privacy posture:** results stored anonymously; email attached only when the visitor chooses to subscribe at the results screen. Subscriber data lives primarily in Mailchimp.
- **No dead links ship:** the 7 referenced-but-copyless destinations (FAQ, podcast, journal, contact, first chapter, Reflection Companion, Amazon) each get a coming-soon/omit treatment per `SITEMAP-AND-FEATURES.md` §2.

## Asset gaps to commission before launch

Maher portrait (About) · featured-story image (Jordan road/playground) · Stories hero · story illustrations for Urgain, Lia Esperança, Rifqi, and the Bhargavas. Also: logo mark needs an SVG/transparent-PNG cut (current source is JPG on white), and a compression pass on the ~10 images over 200KB (sprint 15).
