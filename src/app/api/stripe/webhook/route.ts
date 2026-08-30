import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { mailchimpConfigured, mailchimpSubscribe } from "@/lib/mailchimp";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/stripe/webhook — Stripe calls this after events on the
 * account. We care about a completed, PAID Checkout for the $9.99 Book
 * Package: the buyer's email is added to Mailchimp tagged "premium",
 * which triggers the access-code email (Automation C in
 * docs/mailchimp-automations.md) and joins them to the weekly note and
 * Monthly Letter — exactly as the brief specifies.
 *
 * The signature is verified by hand (HMAC-SHA256 over `t.payload` with
 * STRIPE_WEBHOOK_SECRET) so no Stripe SDK is needed and the lockfile
 * stays untouched. Docs: https://stripe.com/docs/webhooks/signatures
 *
 * Return codes matter: Stripe retries non-2xx for ~3 days. So we return
 * 500 when a retry could help (Mailchimp down or not yet configured —
 * buyers are not lost while keys are being set up) and 200 when it
 * couldn't (nothing to do, or a permanently bad email).
 */

const TOLERANCE_SECONDS = 300;

function verifySignature(payload: string, header: string, secret: string): boolean {
  let timestamp = "";
  const candidates: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=", 2);
    if (k === "t") timestamp = v ?? "";
    if (k === "v1" && v) candidates.push(v);
  }
  if (!timestamp || candidates.length === 0) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  return candidates.some((c) => {
    const buf = Buffer.from(c, "utf8");
    return buf.length === expectedBuf.length && timingSafeEqual(buf, expectedBuf);
  });
}

type CheckoutSession = {
  payment_status?: string;
  customer_email?: string | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  customer?: string | { id?: string } | null;
  metadata?: { supabase_user_id?: string; product?: string } | null;
};

/**
 * Account purchases (created by /api/checkout or the signup flow) carry
 * the buyer's Supabase user id in metadata — grant the entitlement.
 * Legacy Payment-Link purchases have no metadata and skip this.
 */
async function grantEntitlement(session: CheckoutSession): Promise<void> {
  const userId = session.metadata?.supabase_user_id;
  if (!userId || session.metadata?.product !== "premium") return;
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SECRET_KEY
  ) {
    console.error("Entitlement skipped: Supabase env not configured.");
    return;
  }
  const admin = createAdminClient();
  const { error } = await admin.from("entitlements").upsert(
    {
      user_id: userId,
      product: "premium",
      status: "active",
      stripe_customer_id:
        typeof session.customer === "string"
          ? session.customer
          : (session.customer?.id ?? null),
    },
    { onConflict: "user_id,product" },
  );
  if (error) throw new Error(`Entitlement upsert failed: ${error.message}`);
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  if (!secret.trim()) {
    return NextResponse.json(
      { ok: false, message: "Webhook secret not configured." },
      { status: 503 },
    );
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";
  if (!verifySignature(payload, signature, secret)) {
    return NextResponse.json(
      { ok: false, message: "Invalid signature." },
      { status: 400 },
    );
  }

  let event: { type?: string; data?: { object?: CheckoutSession } };
  try {
    event = JSON.parse(payload) as typeof event;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid payload." }, { status: 400 });
  }

  const session = event.data?.object;
  const paidNow =
    (event.type === "checkout.session.completed" &&
      session?.payment_status === "paid") ||
    event.type === "checkout.session.async_payment_succeeded";

  if (!paidNow || !session) {
    // Not a paid checkout (or an event type we don't act on) — acknowledge.
    return NextResponse.json({ ok: true, ignored: event.type ?? "unknown" });
  }

  // 1) Grant account access first — this is what the buyer paid for.
  //    A failure here returns 500 so Stripe retries until it lands.
  try {
    await grantEntitlement(session);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Entitlement write failed — Stripe will retry." },
      { status: 500 },
    );
  }

  // 2) Then the email side (Mailchimp tag → access email + weekly notes).
  const email = (session.customer_details?.email ?? session.customer_email ?? "").trim();
  if (!email) {
    return NextResponse.json({ ok: true, note: "No email on session." });
  }
  const firstName = (session.customer_details?.name ?? "").trim().split(/\s+/)[0] ?? "";

  if (!mailchimpConfigured()) {
    // Retryable on purpose: Stripe will keep retrying (~3 days), so
    // buyers made while Mailchimp keys are still being set up are not lost.
    return NextResponse.json(
      { ok: false, message: "Mailchimp not configured yet — Stripe will retry." },
      { status: 500 },
    );
  }

  const result = await mailchimpSubscribe({
    email,
    firstName: firstName || undefined,
    tags: ["premium"],
  });

  if (result.ok) return NextResponse.json({ ok: true });
  if (result.retryable) {
    return NextResponse.json({ ok: false, message: result.message }, { status: 500 });
  }
  // Permanent (e.g. Mailchimp rejects the address) — retrying won't help.
  return NextResponse.json({ ok: true, note: result.message });
}
