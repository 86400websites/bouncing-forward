import { NextResponse, type NextRequest } from "next/server";
import { mailchimpConfigured, mailchimpSubscribe } from "@/lib/mailchimp";
import { isWebinarOver, WEBINAR_SESSION_TAGS } from "@/lib/webinar";

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

const SESSIONS: Record<string, string> = WEBINAR_SESSION_TAGS;

export async function POST(request: NextRequest) {
  // Event over: no new registrations (keeps old session tags clean).
  if (isWebinarOver()) {
    return NextResponse.json(
      {
        ok: false,
        message: "This webinar has taken place. Registration is closed.",
      },
      { status: 410 },
    );
  }

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
  // Registering is an explicit opt-in: restore a previously unsubscribed
  // or archived contact (as the newsletter does), otherwise Mailchimp
  // tags them but never sends the confirmation journey.
  // COUNTRY needs a matching audience field; if Mailchimp rejects the
  // merge fields, retry without it so no registration is lost.
  let result = await mailchimpSubscribe({
    email,
    firstName,
    lastName,
    mergeFields: country ? { COUNTRY: country } : undefined,
    tags,
    resubscribe: true,
  });
  if (
    !result.ok &&
    result.upstreamStatus === 400 &&
    /merge field/i.test(result.upstreamDetail ?? "") &&
    country
  ) {
    console.warn(
      "Webinar registration: retrying without COUNTRY —",
      result.upstreamDetail,
    );
    result = await mailchimpSubscribe({
      email,
      firstName,
      lastName,
      tags,
      resubscribe: true,
    });
  }

  if (!result.ok) {
    console.error(
      "Webinar registration failed:",
      result.upstreamStatus ?? result.status,
      result.upstreamDetail || result.message,
    );
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
