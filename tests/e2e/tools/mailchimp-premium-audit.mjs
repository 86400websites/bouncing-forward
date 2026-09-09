/**
 * Owner-run, READ-ONLY audit of the shared Mailchimp audience.
 *
 * Lists every member carrying the `premium` tag (the tag the purchase
 * webhook adds), with the address masked and the last-changed date, so the
 * owner can compare the list against Bouncing Forward's own Stripe payments
 * and spot anyone tagged by mistake while the Stripe account was shared.
 *
 * Run it yourself so no agent ever reads the live env file:
 *
 *   node --env-file=.env.local tests/e2e/tools/mailchimp-premium-audit.mjs
 *
 * Reads MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID and (optionally)
 * MAILCHIMP_SERVER_PREFIX from the process environment. Prints no key.
 * Changes nothing.
 */

const apiKey = process.env.MAILCHIMP_API_KEY ?? "";
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID ?? "";
const server =
  process.env.MAILCHIMP_SERVER_PREFIX || apiKey.split("-").pop() || "";
const TAG = process.argv[2] ?? "premium";

if (!apiKey || !audienceId || !server) {
  console.error(
    "Missing MAILCHIMP_API_KEY / MAILCHIMP_AUDIENCE_ID (and server prefix). Run with: node --env-file=.env.local …",
  );
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`anystring:${apiKey}`).toString("base64");
const base = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}`;

function mask(email) {
  const [user, domain] = email.split("@");
  const head = user.slice(0, 2);
  return `${head}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

async function page(offset) {
  const url =
    `${base}/members?count=500&offset=${offset}` +
    "&fields=members.email_address,members.status,members.tags,members.last_changed,members.timestamp_opt,total_items";
  const res = await fetch(url, { headers: { Authorization: auth } });
  if (!res.ok) {
    throw new Error(
      `Mailchimp answered ${res.status} — check the audience id and key scope.`,
    );
  }
  return res.json();
}

const tagged = [];
let offset = 0;
let total = Infinity;
while (offset < total) {
  const data = await page(offset);
  total = data.total_items ?? 0;
  for (const m of data.members ?? []) {
    if ((m.tags ?? []).some((t) => t.name === TAG)) {
      tagged.push({
        email: mask(m.email_address),
        status: m.status,
        lastChanged: m.last_changed,
        joined: m.timestamp_opt,
        otherTags: (m.tags ?? [])
          .map((t) => t.name)
          .filter((n) => n !== TAG)
          .join(", "),
      });
    }
  }
  offset += 500;
  if (!data.members?.length) break;
}

tagged.sort((a, b) =>
  String(b.lastChanged).localeCompare(String(a.lastChanged)),
);
console.log(`Audience members: ${total}. Tagged "${TAG}": ${tagged.length}.`);
console.log(
  "Compare each row with Bouncing Forward's successful Stripe payments; anyone here without a matching payment was tagged by the shared-account problem.",
);
console.table(tagged);
