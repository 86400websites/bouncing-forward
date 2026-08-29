import { NextResponse } from "next/server";
import { codesConfigured, validCode } from "@/lib/premium";

/**
 * POST /api/premium — check a Book Package access code.
 *
 * Codes live in the PREMIUM_ACCESS_CODES environment variable as a
 * comma-separated list (e.g. "BF-FORWARD-2026" or many, one per buyer
 * batch). Matching is case-insensitive and ignores surrounding spaces.
 * The same code works every time, on any device — exactly as the
 * confirmation email promises. When Stripe is connected, purchase-
 * generated codes can simply be appended to the list (or this check
 * swapped for a lookup) without touching the page.
 */

export async function POST(request: Request) {
  let body: { code?: unknown };
  try {
    body = (await request.json()) as { code?: unknown };
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!codesConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Access codes aren’t switched on yet — please try again soon.",
      },
      { status: 503 },
    );
  }

  if (!validCode(body.code)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "That code doesn’t match. Check your confirmation email — the code works on any device, any time.",
      },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
