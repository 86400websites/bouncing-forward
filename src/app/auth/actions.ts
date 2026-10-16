"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { accountsConfigured } from "@/lib/auth/entitlements";
import { originFromHost } from "@/lib/request-origin";

/**
 * Sign up / log in / logout / password reset — plus the "intent"
 * system ported from Unretire: arriving with intent=premium sends the
 * person straight from auth into Stripe Checkout, so "Buy the Book
 * Package" is one continuous motion even for a brand-new visitor.
 */

/** This deployment's address for auth emails and Stripe return links —
 *  the request host when it is one of ours, else the configured site URL. */
async function getOrigin(): Promise<string> {
  const h = await headers();
  return originFromHost(
    h.get("x-forwarded-host") ?? h.get("host"),
    h.get("x-forwarded-proto"),
  );
}

export type Intent = "premium" | "account";
export type AuthResult = {
  error?: string;
  message?: string;
  /** Email already registered — the form should flip to login. */
  exists?: boolean;
};

function readIntent(formData: FormData): Intent {
  return String(formData.get("intent") ?? "account") === "premium"
    ? "premium"
    : "account";
}

/** After auth: premium intent → Stripe (unless owned); else → account. */
async function continueByIntent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  intent: Intent,
  userId: string,
  email: string | null,
): Promise<never> {
  if (intent === "premium") {
    const { data } = await supabase
      .from("entitlements")
      .select("product")
      .eq("status", "active");
    const owned = (data ?? []).some((r) => r.product === "premium");
    if (owned) redirect("/account");

    let url: string | null = null;
    try {
      url = await createCheckoutSession({
        userId,
        email,
        origin: await getOrigin(),
      });
    } catch (err) {
      console.error("Checkout after auth failed:", err);
    }
    // redirect() throws internally — keep it OUTSIDE try/catch.
    redirect(url ?? "/premium?checkout=error");
  }
  redirect("/account");
}

export async function register(formData: FormData): Promise<AuthResult> {
  if (!accountsConfigured()) {
    return {
      error: "Accounts aren’t switched on yet — please try again soon.",
    };
  }
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const intent = readIntent(formData);

  if (!email || !password) return { error: "Email and password are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "That doesn’t look like a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("already registered") ||
      msg.includes("already been registered")
    ) {
      return { exists: true };
    }
    return { error: error.message };
  }
  // Enumeration-protected "existing user" signal: empty identities.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { exists: true };
  }
  // "Confirm email" still ON in Supabase → no session yet; degrade kindly.
  if (!data.session || !data.user) {
    return {
      message:
        "Account created. Please confirm your email from your inbox, then log in.",
    };
  }

  revalidatePath("/", "layout");
  return continueByIntent(
    supabase,
    intent,
    data.user.id,
    data.user.email ?? email,
  );
}

export async function login(formData: FormData): Promise<AuthResult> {
  if (!accountsConfigured()) {
    return {
      error: "Accounts aren’t switched on yet — please try again soon.",
    };
  }
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const intent = readIntent(formData);

  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return continueByIntent(
    supabase,
    intent,
    data.user.id,
    data.user.email ?? email,
  );
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function requestPasswordReset(
  formData: FormData,
): Promise<AuthResult> {
  if (!accountsConfigured()) {
    return {
      error: "Accounts aren’t switched on yet — please try again soon.",
    };
  }
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });
  if (error) console.error("Password reset request failed:", error);
  // Never reveal whether the address exists.
  return {
    message:
      "If an account exists for that email, a reset link is on its way. Check your inbox.",
  };
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error:
        "Your reset link has expired or is invalid. Please request a new one.",
    };
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/account?password=updated");
}
