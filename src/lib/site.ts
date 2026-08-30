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

/** Live Amazon listing (BF-Website-Copy + mockup). Opens in a new tab. */
export const AMAZON_URL =
  "https://www.amazon.com/Bouncing-Forward-Hardships-Stepping-Resilience/dp/B0DWRVYCHS";

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

