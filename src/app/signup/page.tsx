import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "One account for your Book Package — the same login on every device.",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
        <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
          Bouncing Forward
        </p>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold">
          Create your account.
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          One login, every device — your Book Package lives in your account, for
          life.
        </p>
        <div className="border-border bg-card mt-8 rounded-xl border p-6 sm:p-8">
          <Suspense>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
        <p className="text-muted-foreground mt-5 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-accent-text font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
