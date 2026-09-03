import type { Metadata } from "next";
import Image from "next/image";
import { AMAZON_URL } from "@/lib/site";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import { BeginYourCrossing } from "@/components/site/begin-your-crossing";
import { PremiumAccess } from "@/components/premium/premium-access";
import { CheckoutButton } from "@/components/premium/checkout-button";
import { getAccess } from "@/lib/auth/entitlements";

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
 * The Premium page, account edition: the buy button starts a Stripe
 * Checkout tied to the visitor's account (creating one on the way if
 * needed), and an owner sees their open library. Reads the session, so
 * this page renders dynamically — the rest of the site stays static.
 */
export default async function PremiumPage() {
  const { userId, products } = await getAccess();
  const loggedIn = Boolean(userId);
  const owned = products.includes("premium");

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <SlideUp>
            <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
              {owned
                ? "Premium — yours for life"
                : "Premium — The Book Package"}
            </p>
            <h1 className="mt-4 text-4xl leading-tight font-extrabold sm:text-5xl">
              {owned ? "It’s all yours." : "Go all the way."}
            </h1>
            <p className="mt-6 text-lg leading-relaxed">
              {owned
                ? "Your Book Package is open in this account — the complete book, the companion workbook, and everything in All In, on any device, any time. It never asks again."
                : "Premium is the whole Bouncing Forward journey in your hands: the complete book, the companion workbook, and everything in All In, all attached to your account for life. One price, $9.99, and it never asks again."}
            </p>
            <div className="mt-8">
              <CheckoutButton loggedIn={loggedIn} owned={owned} />
            </div>
            <p
              className={
                owned ? "sr-only" : "text-muted-foreground mt-4 text-sm"
              }
            >
              Prefer a printed copy?{" "}
              <a
                href={AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent-text font-semibold underline-offset-2 hover:underline"
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

      {/* ── Included + account (swaps to the open library) ───── */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <PremiumAccess loggedIn={loggedIn} owned={owned} />
        </div>
      </section>

      {/* ── Bottom band ──────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <SlideUp>
            <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
              {owned
                ? "Yours for life. Keep walking."
                : "One price. The whole journey."}
            </h2>
            <div className="mt-8 flex justify-center">
              <CheckoutButton loggedIn={loggedIn} owned={owned} invert />
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />
    </main>
  );
}
