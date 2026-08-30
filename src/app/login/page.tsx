import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Bouncing Forward account.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
          Bouncing Forward
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight">Log in.</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Your account opens the Book Package on any device.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-brand-accent-text hover:underline">
            Create your account
          </Link>
        </p>
      </div>
    </main>
  );
}
