/**
 * Book Package access codes.
 *
 * Codes live in the PREMIUM_ACCESS_CODES environment variable as a
 * comma-separated list (one shared code, or many). Matching is
 * case-insensitive and ignores surrounding spaces. The same code works
 * every time, on any device — exactly as the confirmation email
 * promises. When Stripe is connected, purchase-generated codes can be
 * appended to the list (or this check swapped for a lookup) without
 * touching the pages.
 */

export function codesConfigured(): boolean {
  return (process.env.PREMIUM_ACCESS_CODES ?? "").trim().length > 0;
}

export function validCode(raw: unknown): boolean {
  const configured = (process.env.PREMIUM_ACCESS_CODES ?? "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
  if (configured.length === 0) return false;
  const code = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  return code.length > 0 && configured.includes(code);
}
