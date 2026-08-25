import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The site-wide email capture (BF-Website-Copy — "Begin Your Next Chapter").
 *
 * Sprint 8 wires this to /api/newsletter → Mailchimp with zod validation,
 * rate limiting, and the Taking Stock Inventory delivery. Until that endpoint
 * exists, the form renders disabled with an honest note — we never fake a
 * successful subscription.
 */
export function BeginYourCrossing({
  heading = "Take The First Week with you",
  body = "Seven days. Seven honest prompts. One small step at the end — free, downloadable, yours to keep. With it comes one note from us a month. No noise, and easy to leave.",
  submitLabel = "Send me The First Week",
  showFaqLink = false,
}: {
  heading?: string;
  body?: string;
  submitLabel?: string;
  showFaqLink?: boolean;
}) {
  return (
    <section
      id="begin-your-crossing"
      aria-labelledby="byc-heading"
      className="scroll-mt-24 bg-muted"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="byc-heading" className="text-3xl font-extrabold sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-muted-foreground">{body}</p>

          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            aria-describedby="byc-status"
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
              disabled
              className="rounded-full border border-input bg-background px-5 py-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-44"
            />
            <label htmlFor="byc-email" className="sr-only">
              Email address
            </label>
            <input
              id="byc-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              disabled
              className="rounded-full border border-input bg-background px-5 py-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-64"
            />
            <button
              type="submit"
              disabled
              className="rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitLabel}
            </button>
          </form>
          <p id="byc-status" className="sr-only" aria-live="polite" />

          {showFaqLink ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Have a question?{" "}
              <Link
                href="/faq"
                className="font-semibold text-brand-accent-text underline underline-offset-4 hover:text-foreground"
              >
                Read the FAQ
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Small helper for CTAs whose destination doesn't exist yet — never a dead link. */
export function ComingSoonCta({
  label,
  invert = false,
}: {
  label: string;
  invert?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex cursor-default items-center rounded-full border px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold",
        invert
          ? "border-primary-foreground/30 text-primary-foreground/70"
          : "border-border text-muted-foreground",
      )}
    >
      {label} — Coming Soon
    </span>
  );
}

export function PrimaryCta({
  href,
  label,
  invert = false,
}: {
  href: string;
  label: string;
  invert?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        invert
          ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          : "bg-primary text-primary-foreground hover:bg-brand-primary-hover",
      )}
    >
      {label}
    </Link>
  );
}

export function SecondaryCta({
  href,
  label,
  invert = false,
}: {
  href: string;
  label: string;
  invert?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        invert
          ? "border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
          : "border-primary text-primary hover:bg-muted",
      )}
    >
      {label}
    </Link>
  );
}

/** External CTA (e.g. Amazon). Opens in a new tab with safe rel. */
export function ExternalCta({
  href,
  label,
  invert = false,
}: {
  href: string;
  label: string;
  invert?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center rounded-full px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        invert
          ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          : "bg-primary text-primary-foreground hover:bg-brand-primary-hover",
      )}
    >
      {label}
    </a>
  );
}
