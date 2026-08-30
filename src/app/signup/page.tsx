import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "One account for your Book Package — the same login on every device.",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
          Bouncing Forward
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight">
          Create your account.
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          One login, every device — your Book Package lives in your account,
          for life.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
          <Suspense>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-accent-text hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
