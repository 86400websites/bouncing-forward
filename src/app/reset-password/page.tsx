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
        <h1 className="text-3xl leading-tight font-extrabold">
          Choose a new password.
        </h1>
        <div className="border-border bg-card mt-8 rounded-xl border p-6 sm:p-8">
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
