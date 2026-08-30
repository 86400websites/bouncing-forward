import { createHash } from "node:crypto";

/**
 * Shared Mailchimp subscribe — used by /api/newsletter (site forms) and
 * /api/stripe/webhook (Book Package buyers, tagged "premium").
 *
 * Idempotent upsert (PUT /members/{md5}): subscribing twice never
 * errors, an existing member simply stays subscribed and gains tags.
 */

export type SubscribeResult =
  | { ok: true }
  | { ok: false; status: number; message: string; retryable: boolean };

export function mailchimpConfigured(): boolean {
  const key = process.env.MAILCHIMP_API_KEY ?? "";
  const audience = process.env.MAILCHIMP_AUDIENCE_ID ?? "";
  const server =
    process.env.MAILCHIMP_SERVER_PREFIX || key.split("-").pop() || "";
  return Boolean(key && audience && server);
}

export async function mailchimpSubscribe(opts: {
  email: string;
  firstName?: string;
  tags?: string[];
}): Promise<SubscribeResult> {
  const apiKey = process.env.MAILCHIMP_API_KEY ?? "";
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID ?? "";
  const server =
    process.env.MAILCHIMP_SERVER_PREFIX || apiKey.split("-").pop() || "";

  if (!apiKey || !audienceId || !server) {
    return {
      ok: false,
      status: 503,
      message:
        "Sign-ups aren’t connected yet — please try again soon, or reach us via the contact page.",
      retryable: false,
    };
  }

  const email = opts.email.trim();
  const hash = createHash("md5").update(email.toLowerCase()).digest("hex");
  const auth = "Basic " + Buffer.from(`anystring:${apiKey}`).toString("base64");
  const base = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}`;

  try {
    const res = await fetch(`${base}/members/${hash}`, {
      method: "PUT",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
        merge_fields: opts.firstName ? { FNAME: opts.firstName } : {},
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as {
        title?: string;
        detail?: string;
      };
      const fake =
        err.title === "Invalid Resource" &&
        /looks fake|invalid/i.test(err.detail ?? "");
      return {
        ok: false,
        status: 422,
        message: fake
          ? "That email address doesn’t look right — please check it."
          : "Something went wrong on our side — please try again in a moment.",
        retryable: !fake && res.status >= 500,
      };
    }

    // Tags — best effort, never blocks success.
    const tags = (opts.tags ?? []).filter(Boolean);
    if (tags.length > 0) {
      await fetch(`${base}/members/${hash}/tags`, {
        method: "POST",
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: JSON.stringify({
          tags: tags.map((name) => ({ name, status: "active" })),
        }),
        cache: "no-store",
      }).catch(() => undefined);
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 502,
      message: "We couldn’t reach the sign-up service — please try again.",
      retryable: true,
    };
  }
}
