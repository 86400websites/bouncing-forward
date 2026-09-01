import { NextResponse } from "next/server";
import { codesConfigured, firstCode } from "@/lib/premium";

/**
 * GET /api/stripe/verify?session_id=cs_… — called by the Premium page
 * when Stripe redirects back after payment. If the Checkout Session is
 * genuinely PAID (checked server-to-server with the secret key), we
 * hand back the access code so everything opens immediately — the
 * email with the same code still arrives for the buyer's other
 * devices. Session ids are unguessable and payment status is verified
 * against Stripe on every call, so this hands out nothing to anyone
 * who hasn't paid.
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id") ?? "";

  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return NextResponse.json(
      { ok: false, message: "Invalid session reference." },
      { status: 400 },
    );
  }

  const secretKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!secretKey || !codesConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Payment confirmation isn’t switched on yet — your access code will arrive by email.",
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: "We couldn’t confirm that payment." },
        { status: 400 },
      );
    }
    const session = (await res.json()) as { payment_status?: string };
    const settled =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required";
    if (!settled) {
      return NextResponse.json({
        ok: false,
        pending: true,
        message:
          "The payment is still processing — your access code will arrive by email as soon as it completes.",
      });
    }
    return NextResponse.json({ ok: true, code: firstCode() });
  } catch {
    return NextResponse.json(
      { ok: false, message: "We couldn’t reach the payment service — your access code will arrive by email." },
      { status: 502 },
    );
  }
}
