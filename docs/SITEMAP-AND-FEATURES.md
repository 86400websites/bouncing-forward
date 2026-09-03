# Bouncing Forward — Sitemap & Features (Stage 1)

> Stage 1 deliverable per the build spreadsheet. Locked decisions: **standalone repo** on the 8-file system · **Supabase in full use from day one** (assessment results stored) · nav label for the Practice page **awaiting Maher/Heather sign-off** (slug is stable regardless). Source of copy: `Bouncing_Forward_Website_Copy.docx` (mirrors UnRetire page-for-page; Enterprise + E-Learning excluded this phase).

---

## 1. Sitemap

| Route                | Page                                                                         | Copy status                                         | Notes                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                  | Home                                                                         | ✅ Full copy                                        | Hero, Two Tools band, Who is it for, Four Ways to Begin, email capture, closing reflection (navy), footer                             |
| `/book`              | The Book                                                                     | ✅ Full copy                                        | Hero + Amazon CTA (coming soon), The Promise, What's Inside (4+4 icon grid), testimonials (placeholder quotes), capture, footer       |
| `/learn`             | Learn                                                                        | ✅ Full copy                                        | Three cards: Course / Podcast / Journal — all three destinations are future-phase; CTAs point to capture or external links until live |
| `/compass-and-path`  | The Compass & The Path _(label pending sign-off; may display as "Practice")_ | ✅ Full copy                                        | Framework deep-dive: 4-Element Compass, 4-Step Path, three tools band                                                                 |
| `/stories`           | Stories                                                                      | ✅ Full copy                                        | Featured story (Hikmat/road-safety) + 10 story cards + Share Your Story CTA                                                           |
| `/about`             | About Maher                                                                  | ✅ Full copy                                        | Portrait slot (asset gap), turning-point narrative, closing questions                                                                 |
| `/assess`            | The Compass & Path Check                                                     | ✅ Full copy incl. all 8 questions, scales, prompts | Interactive assessment → results screen → action-plan structure → capture                                                             |
| `/privacy`, `/terms` | Legal                                                                        | ❌ No copy in deck                                  | Footer links to both — needs copy before launch (standard policy pages; draft for Maher's review is a sprint task)                    |

**Nav:** The Book · Learn · [Compass & Path label] · Stories · About + CTA **Start Your Crossing** → `/assess`
**Footer:** three link columns (Explore / Compass & Path / Connect) + "Part of Half a Life" + © + Privacy · Terms

## 2. Referenced destinations with no copy (decision needed per item)

The copy links to these; none has a page in the deck. Recommended handling for launch:

| Reference                          | Appears on          | Recommendation                                                                                        |
| ---------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| FAQ ("Browse the FAQ →")           | Home, Book, Assess  | Small `/faq` page — needs ~8 Q&As from Maher/Heather, or drop the link this phase                     |
| Podcast ("Tune In →")              | Learn, footer       | External link to podcast platform when live; until then, card shows "Coming soon" without a dead link |
| Blog / Journal ("Read Now →")      | Learn, footer       | Same treatment — future phase                                                                         |
| Contact                            | Footer              | `mailto:` or a small contact form via existing Route Handler pattern                                  |
| "Read the First Chapter Free"      | Home                | Gated PDF via the capture flow (needs chapter-1 PDF from Maher) or omit until supplied                |
| Reflection Companion ("Explore →") | Compass & Path (×2) | No source material supplied — omit CTA this phase or deliver as a gated PDF once provided             |
| "Buy on Amazon — Coming Soon"      | Home, Book          | Disabled/label state until the Amazon listing exists                                                  |

**Rule: no dead links ship.** Anything not resolvable at launch renders as a non-link "coming soon" state or is omitted.

## 3. Feature list (drives the sprint plan)

1. **Site shell** — nav, footer, motion primitives, metadata base, security headers, fonts, tokens (per DESIGN.md)
2. **Seven content pages** with UnRetire structural parity, built from the copy deck verbatim (book-sourced quotes must not be paraphrased)
3. **"Begin Your Crossing" email capture** — first name + email → Mailchimp audience via server-only Route Handler (`/api/newsletter`); zod-validated; rate-limited; fail-closed in Production; delivers the Taking Stock Inventory
4. **Compass & Path Check** (`/assess`) — 8 questions, two 5-point scale vocabularies (Compass: Barely Flickering → Bright; Path: Not Yet Possible → Settled), per-question reflection prompts, results screen showing the 8-spoke compass visualization + weakest-light routing into the action-plan structure (two priority areas, one person to let in, one 30-day goal, three actions, 90-day check-in, one sentence)
5. **Assessment persistence (Supabase, day one)** — results stored via hardened `SECURITY DEFINER` RPC; schema + RLS in `supabase/sql/`; optional email association only when the user also subscribes
6. **Assessment → Mailchimp bridge** — on subscribe-at-results, scores/weakest-light passed as merge fields + tags (enables the pillar-routed offer email pattern later)
7. **Share Your Story** — form on `/stories` → Route Handler → delivery (email via Resend, or Supabase table — decide at sprint)
8. **Tool downloads** — 11 canvases supplied as .docx; convert to branded PDFs; Taking Stock Inventory is the gated lead magnet, others deliverable on the Compass & Path page
9. **SEO layer** — `sitemap.ts`, `robots.ts`, per-route metadata + canonicals, JSON-LD (`Book`, `Person` for Maher, `Organization`, `FAQPage` if FAQ ships), OG images (1200×630)
10. **Legal pages** — privacy + terms drafts for review
11. **Asset pipeline** — supplied library already organized under `/public-assets/assets/`; remaining tasks: logo → SVG/transparent PNG, compression pass, commission 7 missing assets (see DESIGN.md §9)

## 4. Explicitly out of scope this phase

Enterprise page · E-Learning/course delivery · payments (**Stripe** — wired at course phase; noted so env naming stays consistent) · user accounts/auth (assessment is anonymous-capable by design) · blog engine · podcast hosting.

## 5. Integration matrix (phase 1)

| Provider      | Phase 1 role                                               | Env vars (names only)                                                                                                                                   |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase      | Assessment result storage (RPC insert, no auth)            | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (+ `SUPABASE_SECRET_KEY` only if a trusted server path ever needs it — none planned) |
| Mailchimp     | Newsletter + lead magnet + assessment tags                 | `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_AUDIENCE_ID`                                                                                 |
| Upstash Redis | Rate limiting on public write endpoints                    | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                                                                                                    |
| Turnstile     | CAPTCHA on public forms (recommended for Share Your Story) | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`                                                                                                |
| Resend        | Share Your Story / contact delivery (if chosen)            | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`                                                                                                |
| Stripe        | **Not in phase 1**                                         | reserved: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`                                                            |

Per the system: integrations no-op cleanly when env vars are absent in local/Preview; in Production, live forms fail closed and anti-abuse is configured.
