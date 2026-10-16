import { NextResponse } from "next/server";
import { mailchimpSubscribe } from "@/lib/mailchimp";

/**
 * POST /api/newsletter — subscribe an email to the Mailchimp audience.
 *
 * Body: { email: string; firstName?: string; source?: string; company?: string }
 *  - `company` is a honeypot field: real people never fill it. If present,
 *    we pretend success and do nothing.
 *  - `source` becomes an approved public Mailchimp tag only,
 *    so the team can segment where each subscriber came from.
 *
 * Environment: see .env.local.example. The heavy lifting lives in
 * src/lib/mailchimp.ts, shared with the Stripe webhook.
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
    if (body === null || typeof body !== "object") {
      throw new Error("Invalid request.");
    }
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
    typeof body.firstName === "string"
      ? body.firstName.trim().slice(0, 80)
      : "";
  const source =
    typeof body.source === "string" && /^[a-z0-9-]{1,40}$/.test(body.source)
      ? body.source
      : "newsletter";

  // Paid-email tags must only come from the verified Stripe webhook.
  if (source !== "newsletter" && source !== "full-assessment") {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const result = await mailchimpSubscribe({
    email,
    firstName,
    tags: [source],
    resubscribe: true,
  });
  if (result.ok) return NextResponse.json({ ok: true });
  return NextResponse.json(
    {
      ok: false,
      ...(result.status === 503 ? { code: "not_configured" } : {}),
      message: result.message,
    },
    { status: result.status },
  );
}
