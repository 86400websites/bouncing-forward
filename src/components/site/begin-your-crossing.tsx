import Link from "next/link";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { cn } from "@/lib/utils";

/**
 * The site-wide email capture (BF-Website-Copy — "Begin Your Next Chapter").
 *
 * Live: posts to /api/newsletter → Mailchimp (see .env.local.example for the
 * three keys). On success the form offers The First Week (the 7 Step Journal)
 * as an immediate download; if Mailchimp isn't configured the API answers
 * honestly and the form shows the message — we never fake a subscription.
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

          <NewsletterForm submitLabel={submitLabel} />

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
