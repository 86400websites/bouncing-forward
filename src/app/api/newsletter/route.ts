import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * POST /api/newsletter — subscribe an email to the Mailchimp audience.
 *
 * Body: { email: string; firstName?: string; source?: string; company?: string }
 *  - `company` is a honeypot field: real people never fill it. If present,
 *    we pretend success and do nothing.
 *  - `source` becomes a Mailchimp tag ("newsletter", "full-assessment", …)
 *    so the team can segment where each subscriber came from.
 *
 * Environment (see .env.local.example):
 *  - MAILCHIMP_API_KEY      e.g. "abc123…-us21" (the suffix is the server)
 *  - MAILCHIMP_AUDIENCE_ID  the List ID from Mailchimp → Audience → Settings
 *  - MAILCHIMP_SERVER_PREFIX optional; derived from the API key if omitted
 *
 * Uses the idempotent upsert (PUT /members/{md5}) so subscribing twice never
 * errors — an existing member simply stays subscribed.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email?: unknown;
  firstName?: unknown;
  source?: unknown;
  company?: unknown;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  // Honeypot — silently accept and drop.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim().slice(0, 80) : "";
  const source =
    typeof body.source === "string" && /^[a-z0-9-]{1,40}$/.test(body.source)
      ? body.source
      : "newsletter";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const server =
    process.env.MAILCHIMP_SERVER_PREFIX || apiKey?.split("-").pop() || "";

  if (!apiKey || !audienceId || !server) {
    // Not configured yet — be honest, never fake a subscription.
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        message:
          "Sign-ups aren’t connected yet — please try again soon, or reach us via the contact page.",
      },
      { status: 503 },
    );
  }

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
        merge_fields: firstName ? { FNAME: firstName } : {},
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as {
        title?: string;
        detail?: string;
      };
      const friendly =
        err.title === "Invalid Resource" &&
        /looks fake|invalid/i.test(err.detail ?? "")
          ? "That email address doesn’t look right — please check it."
          : "Something went wrong on our side — please try again in a moment.";
      return NextResponse.json({ ok: false, message: friendly }, { status: 422 });
    }

    // Tag the member with its source — best effort, never blocks success.
    await fetch(`${base}/members/${hash}/tags`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ tags: [{ name: source, status: "active" }] }),
      cache: "no-store",
    }).catch(() => undefined);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "We couldn’t reach the sign-up service — please try again.",
      },
      { status: 502 },
    );
  }
}
