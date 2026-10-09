import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false },
};

/** `?error=link` is where an invalid, expired or already-used reset link
 *  lands (see /auth/confirm) — say so instead of showing a blank form. */
export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
        <h1 className="text-3xl leading-tight font-extrabold">
          Reset your password.
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Enter your email and we’ll send a reset link.
        </p>
        {error === "link" ? (
          <p role="alert" className="mt-4 text-sm text-red-600">
            Your reset link has expired or is invalid. Please request a new one.
          </p>
        ) : null}
        <div className="border-border bg-card mt-8 rounded-xl border p-6 sm:p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
