import { NextResponse, type NextRequest } from "next/server";
import { mailchimpConfigured, mailchimpSubscribe } from "@/lib/mailchimp";

export const runtime = "nodejs";

/**
 * POST /api/webinar — registration for the live webinar
 * "What's your next move... when life changes?" (21 Oct 2026).
 *
 * Adds the person to Mailchimp with ONLY the event tags — never the
 * newsletter/full-assessment/premium tags — honouring the page's
 * promise: details are used solely for this webinar's joining link,
 * reminders and workbook. The two sessions stay separate lists via
 * their own tags (per Heather's brief, 5 Oct).
 */

const SESSIONS: Record<string, string> = {
  "10:00 SAST": "webinar-oct21-1000",
  "19:00 SAST": "webinar-oct21-1900",
};

export async function POST(request: NextRequest) {
  let body: {
    first_name?: string;
    last_name?: string;
    email?: string;
    country?: string;
    session?: string;
    website?: string; // honeypot
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  // Honeypot: bots fill it; humans never see it. Pretend success.
  if (body.website) return NextResponse.json({ ok: true });

  const firstName = (body.first_name ?? "").trim();
  const lastName = (body.last_name ?? "").trim();
  const email = (body.email ?? "").trim();
  const country = (body.country ?? "").trim();
  const session = (body.session ?? "").trim();
  const sessionTag = SESSIONS[session];

  if (!firstName || !lastName) {
    return NextResponse.json(
      { ok: false, message: "Please enter your first and last name." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (!sessionTag) {
    return NextResponse.json(
      { ok: false, message: "Please choose your session." },
      { status: 400 },
    );
  }

  if (!mailchimpConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Registration isn’t connected yet — please try again soon, or write to info@bouncing-forward.com.",
      },
      { status: 503 },
    );
  }

  const tags = ["webinar", sessionTag];
  // Try with the COUNTRY merge field; if the audience doesn't define
  // it, Mailchimp may refuse — retry without so no registration is lost.
  let result = await mailchimpSubscribe({
    email,
    firstName,
    lastName,
    mergeFields: country ? { COUNTRY: country } : undefined,
    tags,
  });
  if (!result.ok && result.status === 400 && country) {
    result = await mailchimpSubscribe({ email, firstName, lastName, tags });
  }

  if (!result.ok) {
    console.error("Webinar registration failed:", result.message);
    return NextResponse.json(
      {
        ok: false,
        message: "Sorry, something went wrong. Please try again in a moment.",
      },
      { status: result.retryable ? 503 : 400 },
    );
  }
  return NextResponse.json({ ok: true });
}
