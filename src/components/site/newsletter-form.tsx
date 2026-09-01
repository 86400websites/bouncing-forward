"use client";

import { useState } from "react";

/**
 * The live email-capture form — posts to /api/newsletter (Mailchimp).
 * On success it also offers the 7 Step Journal as an
 * immediate download, so the promise is kept even before the Mailchimp
 * welcome automation exists.
 */
export function NewsletterForm({ submitLabel }: { submitLabel: string }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setState("sending");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim(),
          source: "newsletter",
          company,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (res.ok && data.ok) {
        setState("done");
      } else {
        setState("error");
        setMessage(
          data.message ?? "Something went wrong — please try again in a moment.",
        );
      }
    } catch {
      setState("error");
      setMessage("We couldn’t reach the sign-up service — please try again.");
    }
  }

  if (state === "done") {
    return (
      <div
        id="byc-status"
        aria-live="polite"
        className="mx-auto mt-8 max-w-md rounded-lg border-2 border-brand-accent bg-card p-6"
      >
        <p className="font-[family-name:var(--font-display)] font-bold text-primary">
          You’re in — welcome.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your 7 Step Journal is ready right now:
        </p>
        <a
          href="/downloads/BF-7-Step-Reflection-Journal.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center rounded-full bg-primary px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Download the 7 Step Journal →
        </a>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        aria-describedby="byc-status"
        noValidate
      >
        <label htmlFor="byc-first-name" className="sr-only">
          First name
        </label>
        <input
          id="byc-first-name"
          name="firstName"
          type="text"
          autoComplete="given-name"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="rounded-full border border-input bg-background px-5 py-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:w-44"
        />
        <label htmlFor="byc-email" className="sr-only">
          Email address
        </label>
        <input
          id="byc-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-full border border-input bg-background px-5 py-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:w-64"
        />
        {/* Honeypot — hidden from real people, tempting to bots. */}
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : submitLabel}
        </button>
      </form>
      <p
        id="byc-status"
        aria-live="polite"
        className={message ? "mt-3 text-sm text-red-600" : "sr-only"}
      >
        {message}
      </p>
    </>
  );
}
