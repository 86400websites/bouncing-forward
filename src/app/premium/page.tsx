import type { Metadata } from "next";
import Image from "next/image";
import { AMAZON_URL } from "@/lib/site";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import { BeginYourCrossing } from "@/components/site/begin-your-crossing";
import { PremiumAccess } from "@/components/premium/premium-access";

export const metadata: Metadata = {
  title: { absolute: "Premium — The Book Package | Bouncing Forward" },
  description:
    "The whole Bouncing Forward journey in your hands: the complete downloadable book, the companion workbook, and everything in All In — one price, $9.99.",
  openGraph: {
    title: "Premium — The Book Package | Bouncing Forward",
    description:
      "The complete downloadable book, the companion workbook, and everything in All In — one price, $9.99.",
  },
};

/**
 * The Buy button. When Stripe goes live, set
 * NEXT_PUBLIC_STRIPE_PAYMENT_LINK (the Payment Link URL) and this
 * becomes the real checkout everywhere it appears — no code changes.
 * Until then it shows the site's honest Coming-Soon treatment.
 */
function BuyPackageCta({ invert = false }: { invert?: boolean }) {
  const link = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          invert
            ? "bg-card text-primary hover:bg-muted"
            : "bg-primary text-primary-foreground hover:bg-brand-primary-hover"
        }`}
      >
        Buy the Book Package — $9.99
      </a>
    );
  }
  return (
    <span
      className={`inline-flex cursor-default items-center rounded-full border px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold ${
        invert
          ? "border-primary-foreground/40 text-primary-foreground/80"
          : "border-border text-muted-foreground"
      }`}
    >
      Buy the Book Package — $9.99 · Coming Soon
    </span>
  );
}

export default function PremiumPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              Premium — The Book Package
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Go all the way.
            </h1>
            <p className="mt-6 text-lg leading-relaxed">
              Premium is the whole Bouncing Forward journey in your hands: the
              complete book, the companion workbook, and everything in All In,
              all open with one access code. One price, $9.99, and it never
              asks again.
            </p>
            <div className="mt-8">
              <BuyPackageCta />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Prefer a printed copy?{" "}
              <a
                href={AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-accent-text underline-offset-2 hover:underline"
              >
                The hardcover and softcover are on Amazon.
              </a>
            </p>
          </SlideUp>
          <FadeIn>
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg pb-[100%] sm:max-w-lg">
              <Image
                src="/assets/premium/hero.png"
                alt="The Bouncing Forward book with the companion workbook"
                fill
                priority
                sizes="(min-width: 1024px) 32rem, 100vw"
                className="object-contain"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Included + access code (swaps to the open library) ── */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <PremiumAccess />
        </div>
      </section>

      {/* ── Bottom band ──────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-6 lg:px-8 sm:py-20">
          <SlideUp>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              One price. The whole journey.
            </h2>
            <div className="mt-8">
              <BuyPackageCta invert />
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />
    </main>
  );
}
