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
        <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
          Bouncing Forward
        </p>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold">Log in.</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Your account opens the Book Package on any device.
        </p>
        <div className="border-border bg-card mt-8 rounded-xl border p-6 sm:p-8">
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
        </div>
        <p className="text-muted-foreground mt-5 text-sm">
          New here?{" "}
          <Link
            href="/signup"
            className="text-brand-accent-text font-semibold hover:underline"
          >
            Create your account
          </Link>
        </p>
      </div>
    </main>
  );
}
