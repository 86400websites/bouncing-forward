# Bouncing Forward — Design System

> **Companion to [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md).** TECH-ARCHITECTURE fixes the *mechanics* (Tailwind v4, shadcn/ui, `next/font`, `next/image`, Framer Motion). This file fixes the *taste* for Bouncing Forward. All brand values below are filled in and contrast-verified; items marked **[PROPOSED]** are 86400's recommendations awaiting Maher/Heather sign-off and are safe to build with in the meantime.

---

## 0. The non-negotiable

**The site must look modern, alive, and captivating — never like a PowerPoint deck or a static brochure.** For this brand specifically: the subject is grief and loss, so "alive" means *quietly alive* — warm, dignified, editorial. Never bouncy, never clinical, never grief-stock-photography somber.

Universal anti-patterns (avoid regardless):
- Generic centered-everything layouts with no rhythm or hierarchy.
- Stock-photo soup — this brand has its own isometric illustration set; use it.
- Cramped spacing. A book about crossing a forest needs room to breathe.
- A dead, static hero. The first 3 seconds decide whether someone stays.
- Type with no hierarchy. Type is ~80% of the design.

---

## 1. Brand brief

- **Brand name:** Bouncing Forward
- **Audience:** People navigating profound loss or hardship — bereavement, diagnosis, retrenchment, a life split in two — who are past platitudes and want a practical way forward. Adults, global, emotionally raw but action-oriented.
- **Core offer:** The book (Amazon, coming soon), the free Taking Stock Inventory (lead magnet), and the Compass & Path Check (assessment). Course arrives in a later phase.
- **Personality (5 adjectives):** honest · warm · dignified · grounded · quietly hopeful
- **Register / archetype:** **Editorial** — serif-forward reading experience, generous whitespace, restrained refined motion. Sister register to the UnRetire site, which this mirrors page-for-page.
- **Reference sites:** half-a-life.vercel.app/unretire (structural 1:1 parity — section order and component types), plus the editorial register of long-read publications (NYT features / The Atlantic) for typography and pacing.
- **The one-sentence test:** "When someone lands, it should feel like *a steady hand on the shoulder — someone who has crossed this forest and is handing you the compass.*"

---

## 2. Light / dark decision

**This project: LIGHT_ONLY.** White/near-white pages with navy ink; the navy inverts to become the dark closing-reflection bands and footer. No dark mode toggle — do not add one.

---

## 3. Color system

Brand source: Navy `#0D2741` · Accent Blue `#0CA1D9` · leaf/knot logo mark. All ratios below computed against WCAG AA.

| Token | Value | Contrast (verified) | Use |
|---|---|---|---|
| Brand primary (navy) | `#0D2741` | 15.18:1 on white — PASS | Headings, body ink, primary CTAs, dark bands, footer |
| Brand primary hover | `#16395C` | 11.84:1 on white — PASS | Hover state for navy elements |
| Brand accent | `#0CA1D9` | 2.95:1 on white — **FAILS for text** | **Graphics only on white:** icons, borders, illustration accents, underlines, the logo mark. Never small text on white. |
| Brand accent (on navy) | `#0CA1D9` | 5.14:1 on navy — PASS | Footer links, accents inside dark bands |
| Accent text (darkened) | `#067CA8` | 4.71:1 on white — PASS | Eyebrow labels, inline links, any accent-colored text on light backgrounds |
| Foreground / text | `#0D2741` | 15.18:1 — PASS | Body text, headings (navy doubles as ink) |
| Secondary text | `#42586E` | 7.36:1 — PASS | Supporting copy, captions, story attributions |
| Border / divider | `#DCE6EE` | — | Borders, dividers, input outlines |
| Background | `#FFFFFF` | — | Page background |
| Surface / card | `#FFFFFF` | — | Cards (with border or soft shadow) |
| Muted / alt section | `#F1F6FA` | navy on it: 13.95:1 — PASS | Alternate section backgrounds (cool paper-blue) |

> ⚠️ **The one rule everyone must know:** the brand accent `#0CA1D9` is *not* a text color on white — it fails AA at 2.95:1. The copy deck's "eyebrow labels in small blue caps" use `--brand-accent-text` (`#067CA8`) on light backgrounds and the true accent `#0CA1D9` only on navy. Icons, rules, and illustrations keep the true accent everywhere.

### CSS variables (`src/styles/globals.css`)

```css
@layer base {
  :root {
    /* Brand */
    --brand-primary: #0D2741;
    --brand-primary-hover: #16395C;
    --brand-accent: #0CA1D9;          /* graphics on white; text only on navy */
    --brand-accent-text: #067CA8;     /* AA-safe accent for text on white */

    /* shadcn/ui tokens */
    --background: #FFFFFF;
    --foreground: #0D2741;
    --card: #FFFFFF;
    --card-foreground: #0D2741;
    --popover: #FFFFFF;
    --popover-foreground: #0D2741;
    --primary: #0D2741;
    --primary-foreground: #FFFFFF;
    --secondary: #F1F6FA;
    --secondary-foreground: #0D2741;
    --muted: #F1F6FA;
    --muted-foreground: #42586E;
    --accent: #0CA1D9;
    --accent-foreground: #0D2741;
    --border: #DCE6EE;
    --input: #DCE6EE;
    --ring: #0CA1D9;
    --radius: 0.5rem;                 /* cards/inputs; primary buttons are pill (rounded-full) [PROPOSED] */
  }
}
```

---

## 4. Typography

**[PROPOSED pairing — echoes the book cover: heavy grotesque title + serif reading text.]**

- **Display font:** **Archivo** (weights 700, 800 only) — headings, nav, buttons, eyebrow labels. Its condensed-leaning boldness echoes the "BOUNCING FORWARD" cover treatment.
- **Body font:** **Source Serif 4** (weights 400, 600 only) — paragraphs, pull-quotes, story text. Bookish, editorial, matches the back-cover text register.
- **Fallback stacks:** display → `system-ui, sans-serif`; body → `Georgia, serif`.

**Loading rule (non-negotiable):** via `next/font` only — never a `<link>` to Google Fonts.

```ts
// src/app/layout.tsx
import { Archivo, Source_Serif_4 } from "next/font/google";

const display = Archivo({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-display",
});
const body = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-body",
});
```
```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme inline {
  --font-display: var(--font-display), system-ui, sans-serif;
  --font-body: var(--font-body), Georgia, serif;
}
```

> **Only 400/600/700/800 exist in this project.** Do not write `font-medium` (500) or display-300 anywhere — unloaded weights fall back and look broken.

### Type scale

| Role | Size (mobile → desktop) | Face / weight | Line height |
|---|---|---|---|
| Body | 17px → 18px | Source Serif 4 / 400 | 1.6 |
| Pull-quote | 20px → 24px | Source Serif 4 / 400 italic | 1.5 |
| h1 | 2.5rem → 4rem | Archivo / 800 | 1.1 |
| h2 | 1.75rem → 2.25rem | Archivo / 800 | 1.15 |
| h3 | 1.125rem → 1.25rem | Archivo / 700 | 1.3 |
| Eyebrow label | 12px, tracked +0.08em, caps | Archivo / 700, `--brand-accent-text` | — |
| Button | 14px → 15px | Archivo / 700 | — |

- Body never below 16px. All-caps reserved for eyebrows only.
- One `<h1>` per page matching intent; `h1 → h2 → h3` in order, never skip.
- Book-sourced pull-quotes (the italic lines under each Element/Step) are a signature component — give them room and a hairline `--brand-accent` rule.

---

## 5. Layout principles

- **Max content width:** `max-w-7xl` (1280px) with gutters `px-5 sm:px-6 lg:px-8`; long-read text columns cap at `max-w-3xl` for comfortable measure.
- **Section vertical rhythm:** `py-16 sm:py-20 lg:py-24`. Default to more whitespace.
- **UnRetire parity:** section *order and component types* mirror UnRetire page-for-page (hero → framework band → icon cards → testimonials → email capture → closing reflection band → footer). Parity is structural, not pixel-identical — Bouncing Forward's own type and palette apply.
- **Rhythm device:** alternate white and `--muted` sections; navy bands reserved for the closing reflection and footer so their weight lands.
- **Asymmetry where it earns its place** — offset the isometric illustrations against text columns rather than centering everything.
- Responsive from 320px; tap targets ≥ 44×44px.

---

## 6. Component rules

- **Buttons:** *primary* = navy pill (`bg-primary text-primary-foreground rounded-full`), hover `--brand-primary-hover`; *secondary* = outline navy on white; on navy bands, invert (white pill, navy text). Button text in Archivo 700. **[PROPOSED: pill shape — soft geometry echoing the knot mark.]**
- **Forms (react-hook-form + zod):** white surface, `--border` 1px; focus ring `--ring`; error = colored border **and** message (never color alone); labels above inputs. The "Begin Your Crossing" capture (first name + email + subscribe) is one reusable component used on every page.
- **Navigation:** `bf-mark` logo top-left; links: The Book · Learn · **[The Compass & The Path | Practice — AWAITING SIGN-OFF, label is a single constant in `src/lib/site.ts`]** · Stories · About; right-aligned primary CTA **Start Your Crossing** → `/assess`. Mobile: shadcn `Sheet`. Active state: weight + accent underline.
- **Cards:** `--radius` 0.5rem, `--border` 1px or soft shadow, hover lift ≤ 4px translate + shadow (no scale beyond 1.02).
- **Numbered framework cards (01–04):** number in Archivo 800 `--brand-accent-text`, icon/illustration, heading, italic book quote, one plain line — the signature repeating unit on Book and Compass & Path pages.
- **Story cards:** category eyebrow (e.g. `COMPASS · RESILIENCE`), illustration, title, name · country in `--muted-foreground`, excerpt, italic closing line.

---

## 7. shadcn/ui & Tailwind v4 usage

- Tailwind v4 CSS-first: `@import "tailwindcss";` + tokens in `globals.css` via `@theme inline`. No hardcoded hex in markup — everything through tokens so a rebrand is a one-file change.
- shadcn/ui primitives themed via §3 variables; compose, don't hand-roll. Keep custom variants in the component file.

---

## 8. Motion / Framer Motion guidelines

**This project's register: RESTRAINED.** Grief-adjacent content demands calm, deliberate motion — presence, not performance.

- Easing: `[0.22, 1, 0.36, 1]` · reveal duration 400–600ms · reveal distance 16–24px · hover scale ≤ 1.02 · no parallax, no cursor effects, no auto-playing carousels.
- Scroll-triggered reveals (`whileInView`, once), stagger lists at 80ms, page transitions 200–300ms.
- Wrap in `LazyMotion` + `domAnimation`; primitives in `src/components/motion/` (`FadeIn`, `SlideUp`, `Stagger`, `Reveal`) and reuse everywhere.
- **Always respect `prefers-reduced-motion`** via `useReducedMotion` — fall back to opacity fade or nothing.
- One permitted moment of quiet theatre: the hero's "light through the forest" may breathe (slow opacity/scale drift, ≥8s loop, reduced-motion-safe).

---

## 9. Image / media guidance

- All images via `next/image` — never raw `<img>`. `priority` + explicit dimensions on the hero.
- All under `/public/assets/`, referenced by path. The supplied library is already organized:
  - `/assets/logo/` — `bf-mark.jpg`, `bf-title.jpg` *(convert mark to SVG or transparent PNG for nav/footer use — build task)*
  - `/assets/book/` — `cover-3d.jpeg`, `cover-back-front.jpeg`
  - `/assets/home/` — `hero-forest.jpg`, `who-is-this-for.jpg`, `compass-stepping-stones.jpg`
  - `/assets/framework/` — `diagram-compass-path.jpg`, `compass-lantern-stepping-stones.jpg`, 4 Elements (`resilience-a/b/c`, `adaptability`, `optimism`, `support`), 4 Steps (`accept`, `reflect`, `imagine`, `action`)
  - `/assets/learn/` — `course-screen.jpg`, `podcast.jpg`, `open-book.jpg`
  - `/assets/stories/` — `sebastian-shoes`, `monica-salon`, `yan-farming-contract`, `ashaita-cafe`, `rafaela-door`, `rebika-sewing`, `catalina-nurse`
- **Art direction:** the isometric navy/accent-blue illustration style is the house style for narrative imagery. Warm human photography only where the deck calls for it (Who-is-this-for). No stock-grief imagery, ever.
- **Known asset gaps (commission before launch):** Maher portrait (About) · featured-story image (Jordan road/playground) · Stories-page hero (road toward light) · 4 missing story illustrations: Urgain (Ladakh terraces), Lia Esperança (favela greening), Rifqi (school blueprint/seawall), Bhargavas (school-crossing sign). Use tasteful placeholders from the existing set during development; replace before launch.
- Compress (squoosh.app) toward ≤200KB where possible; several supplied files run 300–800KB — `next/image` optimizes delivery, but a compression pass is a pre-launch task. Meaningful `alt` text on everything.

---

## 10. Responsive design rules

- Mobile-first; verify every breakpoint from 320px up. Single column on mobile; grids at `md`/`lg`.
- 16px+ body, ≥44px tap targets, no horizontal scroll. Test on Vercel Preview at multiple widths before merge.

---

## 11. Accessibility rules (WCAG AA minimum)

- All §3 pairs are pre-verified — do not introduce new color pairs without checking 4.5:1 (body) / 3:1 (large/UI).
- Never color alone for meaning; visible focus ring (`--ring`) on all interactive elements; skip-to-content link; `lang="en"`; semantic landmarks and ordered headings.
- Assessment tool: fully keyboard-operable scale inputs (radio groups, not click-only divs), visible labels for every point on the 5-point scales.
- Respect `prefers-reduced-motion` (§8).

---

## 12. Decisions recorded / awaiting

| Decision | Status |
|---|---|
| Register: editorial, restrained | **Locked** |
| Light mode only | **Locked** |
| Palette + AA-safe accent-text variant | **Locked** (values verified above) |
| Nav label: "The Compass & The Path" vs "Practice" | **Awaiting Maher/Heather** — route slug is `/compass-and-path` either way; label is one constant |
| Type pairing: Archivo + Source Serif 4 | [PROPOSED] — swap at Stage 2 gate if desired; one-file change |
| Pill primary buttons | [PROPOSED] |
| Logo mark as SVG/transparent PNG | Build task (source is JPG on white) |

---

## 13. What not to over-customize too early

- No sprawling token system on day one — the §3 palette and §4 scale are enough until a real screen needs more.
- No dark mode, no second primary color, no third typeface.
- Don't hand-build what shadcn/ui provides; theme the primitive.
- Don't over-animate — restrained register, always.
- Don't finalize art direction against placeholder content; lock on real copy (supplied) and real imagery (mostly supplied; gaps listed in §9).
