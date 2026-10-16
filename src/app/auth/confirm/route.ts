import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { accountsConfigured } from "@/lib/auth/entitlements";

/**
 * Email callback for sign-up confirmation AND password recovery.
 *   • PKCE flow → `?code=…`      → exchangeCodeForSession
 *   • OTP flow  → `?token_hash=…&type=…` → verifyOtp
 * Then redirect onward (same-origin only; default /account).
 *
 * A failed or already-used recovery link goes back to the reset request
 * with a clear notice; other failures go to Log in.
 */

/**
 * Same-origin path only. The value is resolved against this request's
 * own address and accepted only when it stays on the same origin, so
 * `//evil.example`, backslash forms, and control characters that the URL
 * parser would strip (tab, newline) can never send someone elsewhere.
 */
function safeNext(raw: string | null, requestUrl: string): string {
  const fallback = "/account";
  if (!raw || raw.length > 512 || !raw.startsWith("/")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(raw)) return fallback;
  try {
    const base = new URL(requestUrl);
    const resolved = new URL(raw, base);
    if (resolved.origin !== base.origin) return fallback;
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"), request.url);
  const isRecovery = type === "recovery" || next.startsWith("/reset-password");
  const failed = new URL(
    isRecovery
      ? "/forgot-password?error=link"
      : "/login?error=confirmation_failed",
    request.url,
  );

  // A callback must never crash: without account settings there is nothing
  // to verify, so land on the same honest failure page.
  if (!accountsConfigured()) return NextResponse.redirect(failed);

  try {
    const supabase = await createClient();
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(next, request.url));
    }
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (!error) return NextResponse.redirect(new URL(next, request.url));
    }
  } catch (err) {
    console.error("Auth callback failed:", err);
  }
  return NextResponse.redirect(failed);
}
