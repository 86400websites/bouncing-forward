"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The Book Package buy button.
 *  - owned     → go to the account (no double-buying).
 *  - logged out→ signup first, carrying intent=premium so auth flows
 *                straight into Stripe Checkout.
 *  - logged in → create the Checkout Session and go to Stripe.
 */
export function CheckoutButton({
  loggedIn,
  owned,
  invert = false,
}: {
  loggedIn: boolean;
  owned: boolean;
  invert?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cls = `inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60 ${
    invert
      ? "bg-card text-primary hover:bg-muted"
      : "bg-primary text-primary-foreground hover:bg-brand-primary-hover"
  }`;

  if (owned) {
    return (
      <button
        type="button"
        onClick={() => router.push("/account")}
        className={cls}
      >
        It’s yours — open your account →
      </button>
    );
  }

  async function go() {
    if (!loggedIn) {
      router.push("/signup?intent=premium");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "premium" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setLoading(false);
      setError(data.error ?? "Could not start checkout — please try again.");
    } catch {
      setLoading(false);
      setError("Could not start checkout — please try again.");
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-2">
      <button type="button" onClick={go} disabled={loading} className={cls}>
        {loading ? "One moment…" : "Buy the Book Package — $9.99"}
      </button>
      <span
        aria-live="polite"
        className={
          error
            ? `text-sm ${invert ? "text-primary-foreground/90" : "text-red-600"}`
            : "sr-only"
        }
      >
        {error}
      </span>
    </span>
  );
}
