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
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * ⚠️ AWAITING MAHER/HEATHER SIGN-OFF (DESIGN.md §12).
 * The route slug /compass-and-path never changes; only this label does.
 * Alternative under consideration: "Practice".
 */
export const COMPASS_PATH_NAV_LABEL = "The Compass & The Path";

export const NAV_LINKS = [
  { href: "/book", label: "The Book" },
  { href: "/learn", label: "Learn" },
  { href: "/compass-and-path", label: COMPASS_PATH_NAV_LABEL },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
] as const;

export const PRIMARY_CTA = { href: "/assess", label: "Start Your Crossing" } as const;
