import { SITE_URL } from "@/lib/site";

/**
 * Which addresses this deployment may be reached at. Auth emails and
 * Stripe return links are built from the request's host so a Preview
 * returns to itself — but only when that host is provably ours: the
 * fixed site addresses, or the addresses Vercel injects into THIS
 * deployment at build time. Anything else falls back to the configured
 * site address instead of trusting the header
 * (ENVIRONMENT-PARITY.md §4 "Site URL", SECURITY-CHECKLIST.md §3).
 */
const FIXED_HOSTNAMES = [
  "www.bouncing-forward.com",
  "bouncing-forward.com",
  "bouncing-forward.vercel.app",
];

/** Hosts Vercel assigns to this very deployment (unique URL, branch alias, production domain). */
function deploymentHostnames(): string[] {
  const env = process.env;
  return [
    env.VERCEL_URL,
    env.VERCEL_BRANCH_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL,
  ]
    .filter((h): h is string => Boolean(h))
    .map((h) => h.trim().toLowerCase());
}

/** Parse a Host-style header strictly: hostname[:port] only, nothing else. */
function parseHost(
  hostHeader: string,
): { hostname: string; host: string } | null {
  try {
    const url = new URL(`https://${hostHeader.trim()}`);
    if (url.username || url.password) return null;
    if (url.pathname !== "/" || url.search || url.hash) return null;
    return { hostname: url.hostname.toLowerCase(), host: url.host };
  } catch {
    return null;
  }
}

function isLocalName(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function isTrustedHost(hostHeader: string | null | undefined): boolean {
  if (!hostHeader) return false;
  const parsed = parseHost(hostHeader);
  if (!parsed) return false;
  if (FIXED_HOSTNAMES.includes(parsed.hostname)) return true;
  if (deploymentHostnames().includes(parsed.hostname)) return true;
  // Local development only — never on a Vercel deployment.
  return !process.env.VERCEL_ENV && isLocalName(parsed.hostname);
}

/**
 * Origin for links that must come back to THIS deployment. Uses the
 * forwarded host only when it is trusted, always rebuilt from the parsed
 * hostname and port (never the raw header); https everywhere except
 * local development.
 */
export function originFromHost(
  hostHeader: string | null | undefined,
  protoHeader: string | null | undefined,
): string {
  if (!hostHeader || !isTrustedHost(hostHeader)) return SITE_URL;
  const parsed = parseHost(hostHeader);
  if (!parsed) return SITE_URL;
  const proto =
    isLocalName(parsed.hostname) && protoHeader?.trim() !== "https"
      ? "http"
      : "https";
  return `${proto}://${parsed.host}`;
}

/** Same rule for a browser-supplied `Origin` header. */
export function originFromOriginHeader(
  originHeader: string | null | undefined,
): string {
  if (!originHeader) return SITE_URL;
  try {
    const url = new URL(originHeader);
    return isTrustedHost(url.host) ? url.origin : SITE_URL;
  } catch {
    return SITE_URL;
  }
}
