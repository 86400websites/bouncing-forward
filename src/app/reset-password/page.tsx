import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
        <h1 className="text-3xl font-extrabold leading-tight">Choose a new password.</h1>
        <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
