import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
        <h1 className="text-3xl font-extrabold leading-tight">Reset your password.</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Enter your email and we’ll send a reset link.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
