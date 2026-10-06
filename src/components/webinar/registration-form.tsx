"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Webinar registration form — fields, copy, validation hints and the
 * registered state all verbatim from Heather's bf-webinar-registration
 * HTML (5 Oct brief). On failure the inputs keep what the person
 * typed, exactly as the brief requires.
 */

const COUNTRIES = [
  "South Africa",
  "Botswana",
  "Namibia",
  "Zimbabwe",
  "Kenya",
  "Nigeria",
  "United Kingdom",
  "United States",
  "Australia",
  "Jordan",
  "United Arab Emirates",
  "Other",
];

const inputCls =
  "w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";
const labelCls = "text-sm font-semibold";
const hintCls = "mt-1 text-sm text-red-600";

export function WebinarRegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("South Africa");
  const [session, setSession] = useState("10:00 SAST");
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const firstOk = firstName.trim().length > 0;
  const lastOk = lastName.trim().length > 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    setError("");
    if (!firstOk || !lastOk || !emailOk) return;

    const honeypot =
      (new FormData(e.currentTarget).get("website") as string) ?? "";
    setSending(true);
    try {
      const res = await fetch("/api/webinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          country,
          session,
          website: honeypot,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (res.ok && data.ok) {
        setDone(true);
      } else {
        setError(
          data.message ??
            "Sorry, something went wrong. Please try again in a moment.",
        );
      }
    } catch {
      setError("Sorry, something went wrong. Please try again in a moment.");
    } finally {
      setSending(false);
    }
  }

  /* ── Registered ───────────────────────────────────────────── */
  if (done) {
    return (
      <div className="border-brand-accent bg-card rounded-xl border-2 p-6 text-center sm:p-8">
        <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
          You’re registered.
        </p>
        <h2 className="mt-3 text-2xl leading-tight font-extrabold sm:text-3xl">
          Thank you, {firstName.trim()}. Your seat is reserved.
        </h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Wednesday 21 October 2026 · {session}
        </p>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          We’ve sent a confirmation to{" "}
          <span className="text-foreground font-semibold">{email.trim()}</span>.
          Your joining link will follow closer to the day.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Explore Bouncing Forward
          </Link>
        </div>
      </div>
    );
  }

  /* ── Form ─────────────────────────────────────────────────── */
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border-border bg-card rounded-xl border p-6 sm:p-8"
    >
      <h2 className="text-xl leading-tight font-extrabold sm:text-2xl">
        Reserve your seat
      </h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        We’ll email your joining link closer to the day.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="wb-fn" className={labelCls}>
            First name
          </label>
          <input
            id="wb-fn"
            name="first_name"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`mt-2 ${inputCls}`}
          />
          {touched && !firstOk ? (
            <p className={hintCls}>Enter your first name.</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="wb-ln" className={labelCls}>
            Last name
          </label>
          <input
            id="wb-ln"
            name="last_name"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`mt-2 ${inputCls}`}
          />
          {touched && !lastOk ? (
            <p className={hintCls}>Enter your last name.</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="wb-em" className={labelCls}>
          Email address
        </label>
        <input
          id="wb-em"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-2 ${inputCls}`}
        />
        {touched && !emailOk ? (
          <p className={hintCls}>
            Enter an email address like name@example.com.
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <label htmlFor="wb-co" className={labelCls}>
          Country
        </label>
        <select
          id="wb-co"
          name="country"
          autoComplete="country-name"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={`mt-2 ${inputCls}`}
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="mt-6">
        <legend className={labelCls}>Choose your session</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(["10:00 SAST", "19:00 SAST"] as const).map((s) => (
            <label
              key={s}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                session === s
                  ? "border-brand-accent bg-brand-accent/10"
                  : "border-border hover:border-brand-accent/60"
              }`}
            >
              <input
                type="radio"
                name="session"
                value={s}
                checked={session === s}
                onChange={() => setSession(s)}
                className="mt-1 accent-[var(--brand-accent,#2563eb)]"
              />
              <span>
                <span className="block font-[family-name:var(--font-display)] font-bold">
                  {s}
                </span>
                <span className="text-muted-foreground block text-sm">
                  Wednesday 21 October
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Honeypot — invisible to humans */}
      <div aria-hidden="true" className="absolute top-auto -left-[9999px]">
        <label htmlFor="wb-website">Website</label>
        <input
          id="wb-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
        We’ll only use your details to send you the joining link, reminders and
        the workbook for this webinar.
      </p>

      <button
        type="submit"
        disabled={sending}
        className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring mt-5 inline-flex w-full items-center justify-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "One moment…" : "Register"}
      </button>
      <p
        aria-live="polite"
        className={error ? "mt-3 text-sm text-red-600" : "sr-only"}
      >
        {error}
      </p>
    </form>
  );
}
