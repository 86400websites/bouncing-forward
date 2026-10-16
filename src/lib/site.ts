/**
 * Site-wide constants. Single source of truth for names, labels, and nav.
 */

export const SITE_NAME = "Bouncing Forward";
export const SITE_TAGLINE =
  "Turning life's hardships into stepping stones for growth and resilience";

/**
 * Canonical origin for metadata/sitemap/robots/OG.
 * Auth redirects (when auth arrives) derive from the request origin instead —
 * see SUPABASE-VERCEL-SETUP.md.
 */
export const SITE_URL =
  // `||` (not `??`): an env var saved as an empty string must also fall
  // back — `new URL("")` would crash every page at startup.
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://bouncing-forward.vercel.app";

/**
 * Live Amazon listings, one per format. Every link opens in a new tab.
 * The Kindle listing is the original one; the owner supplied the hardcover,
 * paperback and workbook listings on 11 September 2026.
 */
export const AMAZON_KINDLE_URL =
  "https://www.amazon.com/Bouncing-Forward-Hardships-Stepping-Resilience/dp/B0DWRVYCHS";
export const AMAZON_HARDCOVER_URL = "https://www.amazon.com/dp/B0HH3N6SQ1";
export const AMAZON_PAPERBACK_URL = "https://www.amazon.com/dp/B0HJD4DTFW";
export const AMAZON_WORKBOOK_URL = "https://www.amazon.com/dp/B0HHDXSSK3";

/** Display order used everywhere the formats are offered. */
export const AMAZON_FORMATS = [
  { label: "Kindle", href: AMAZON_KINDLE_URL },
  { label: "Hardcover", href: AMAZON_HARDCOVER_URL },
  { label: "Paperback", href: AMAZON_PAPERBACK_URL },
  { label: "Workbook", href: AMAZON_WORKBOOK_URL },
] as const;

/**
 * ⚠️ AWAITING MAHER/HEATHER SIGN-OFF (DESIGN.md §12).
 * The route slug /compass-and-path never changes; only this label does.
 * The revised mockup labels it "Resources".
 */
export const COMPASS_PATH_NAV_LABEL = "Resources";

/**
 * Top-level navigation, modelled on BF-Website-Mockup.html.
 * A NavItem is either a flat link or a dropdown with children.
 * Some destinations (/course, /all-in, /enterprise, /contact) are built in
 * later steps; links are wired now and resolve as those pages land.
 */
export type NavChild = { href: string; label: string };
export type NavItem =
  | { href: string; label: string }
  | { label: string; href?: string; children: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  { href: "/book", label: "The Book" },
  { href: "/about", label: "The Author" },
  { href: "/course", label: "The Course" },
  {
    label: "Resources",
    href: "/compass-and-path",
    children: [
      { href: "/compass-and-path#compass", label: "The 4-Element Compass" },
      { href: "/compass-and-path#path", label: "The 4-Step Path" },
      { href: "/assess", label: "Where’s Here?" },
      { href: "/stories", label: "Stories" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    label: "All In",
    href: "/all-in",
    children: [
      { href: "/all-in#a-inside", label: "What’s Inside" },
      { href: "/all-in#a-included", label: "What’s Included" },
      { href: "/all-in#full-assessment", label: "Take the Full Assessment" },
      { href: "/all-in#library", label: "Your Library" },
    ],
  },
  { href: "/premium", label: "Premium" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/contact", label: "Contact" },
];
