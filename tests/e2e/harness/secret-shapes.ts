/**
 * Recognisers for values that must never appear in a public response, a
 * report row or a log line. Each returns the NAME of the pattern that
 * matched — never the value. Used by IN-010 (/api/health facts only);
 * tests/e2e/tools/report-rows.mjs mirrors the same list in plain JS.
 */

const SHAPES: { name: string; re: RegExp }[] = [
  { name: "stripe-secret-key", re: /\b(sk|rk)_(live|test)_[A-Za-z0-9]{8,}/ },
  { name: "stripe-webhook-secret", re: /\bwhsec_[A-Za-z0-9]{8,}/ },
  { name: "supabase-secret-key", re: /\bsb_secret_[A-Za-z0-9_-]{8,}/ },
  {
    name: "supabase-publishable-key",
    re: /\bsb_publishable_[A-Za-z0-9_-]{8,}/,
  },
  {
    name: "jwt",
    re: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/,
  },
  { name: "mailchimp-api-key", re: /\b[0-9a-f]{32}-us\d+\b/ },
  { name: "postgres-url", re: /\bpostgres(ql)?:\/\//i },
  { name: "bearer-token", re: /\bBearer\s+[A-Za-z0-9._-]{8,}/ },
  { name: "long-base64-run", re: /[A-Za-z0-9+/=]{40,}/ },
];

/** Name of the first secret-looking pattern in `value`, or null. */
export function secretShaped(value: string): string | null {
  for (const shape of SHAPES) {
    if (shape.re.test(value)) return shape.name;
  }
  return null;
}

/** Every secret-looking run in `value` replaced with `[redacted:<name>]`. */
export function redactSecrets(value: string): string {
  let out = value;
  for (const shape of SHAPES) {
    out = out.replace(
      new RegExp(shape.re.source, shape.re.flags + "g"),
      `[redacted:${shape.name}]`,
    );
  }
  return out;
}
