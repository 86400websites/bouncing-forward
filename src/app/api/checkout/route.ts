import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { accountsConfigured, hasPremium } from "@/lib/auth/entitlements";
import { originFromOriginHeader } from "@/lib/request-origin";

export const runtime = "nodejs";

/**
 * POST /api/checkout — start a Book Package purchase for the
 * signed-in user. Not signed in → 401 (the page sends them to
 * signup first). Already own it → skip Stripe, go to the account.
 */
export async function POST(request: NextRequest) {
  if (!accountsConfigured()) {
    return NextResponse.json(
      { error: "Accounts aren’t switched on yet — please try again soon." },
      { status: 503 },
    );
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  // Return to this deployment only when the browser's Origin is one of ours.
  const origin = originFromOriginHeader(request.headers.get("origin"));

  if (await hasPremium()) {
    return NextResponse.json({ url: `${origin}/account` });
  }

  try {
    const url = await createCheckoutSession({
      userId: user.id,
      email: user.email ?? null,
      origin,
    });
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Could not start checkout — please try again." },
      { status: 500 },
    );
  }
}
