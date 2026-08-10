import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  ExternalCta,
  PrimaryCta,
} from "@/components/site/begin-your-crossing";
import { ClaimAccessForm } from "@/components/site/claim-access-form";
import { AMAZON_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "All In | The Complete Bouncing Forward Experience" },
  description:
    "$99 for everything — a downloadable copy of the book, the full nine-module course, the 30-Day Journal, a premium monthly newsletter, and everything new we add.",
  openGraph: {
    title: "All In | The Complete Bouncing Forward Experience",
    description:
      "$99 for everything — a downloadable copy of the book, the full nine-module course, the 30-Day Journal, a premium monthly newsletter, and everything new we add.",
  },
};

/* Copy source: BF-Website-Copy-For-Sozana-2.docx — All In (/all-in), verbatim. */

const NEWSLETTER_HEADING = "Begin Your Next Chapter";
const NEWSLETTER_BODY =
  "The direction you need hasn’t disappeared — it’s waiting to be found. Get the free Taking Stock Inventory, plus a monthly note on finding your way forward.";

export default function AllInPage() {
  return (
    <>
      {/* ── Hero (#a-inside) ─────────────────────────────────── */}
      <section
        id="a-inside"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                All In — Everything, Together
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
                One decision. Everything open.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                All In is the complete Bouncing Forward experience — a
                downloadable copy of the book, the full nine-module course, the
                journal, and a premium monthly newsletter written for the hardest
                seasons. One decision, $99, everything open — including
                everything new we add to Bouncing Forward, as it lands.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryCta href="#a-claim" label="Go All In — $99 →" />
                <ExternalCta href={AMAZON_URL} label="Buy Just the Book — $14.45 →" />
              </div>
              <p className="mt-3 text-sm italic text-muted-foreground">
                2nd edition coming soon.
              </p>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/all-in/all-in-hero.png"
              alt="Everything included in All In — the book, the course, the journal and more, together"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>

        <FadeIn>
          <div className="mt-16 border-t border-border pt-12 text-center">
            <h2 className="mx-auto max-w-2xl text-2xl font-extrabold leading-tight sm:text-3xl">
              Everything the framework offers, in one place.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              The complete course, every guide, every tool — open from day one,
              in whatever order your season asks for.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ── The 30-Day Journal (#a-journal) ──────────────────── */}
      <section className="bg-muted">
        <div
          id="a-journal"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SlideUp>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                  All In · Included
                </p>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                  The 30-Day Journal
                </h2>
              </SlideUp>
              <SlideUp delay={0.06}>
                <p className="mt-6 text-lg leading-relaxed">
                  Thirty days of guided reflection — one honest page at a time,
                  each day with its own prompt and its own quote. Not homework.
                  Company.
                </p>
              </SlideUp>
            </div>
            <FadeIn delay={0.1}>
              <Image
                src="/assets/all-in/journal-cover.png"
                alt="The Bouncing Forward Personal Journal — 30 Days to Bounce Forward"
                width={1055}
                height={1491}
                sizes="(min-width: 1024px) 40vw, 80vw"
                className="mx-auto w-full max-w-xs rounded-xl shadow-lg"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── The Course + Monthly Letter (#a-course, #a-letter) ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <SlideUp>
            <div id="a-course" className="h-full scroll-mt-24 rounded-lg border border-border bg-card p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                All In · Included
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-snug">
                The Course
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The complete Bouncing Forward course — all nine guided modules
                presenting the framework, the Compass and the Path, each with a
                short video, a companion guide, and space to build your own plan.
                Yours in full, included with All In.
              </p>
            </div>
          </SlideUp>
          <SlideUp delay={0.06}>
            <div id="a-letter" className="h-full scroll-mt-24 rounded-lg border border-border bg-card p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                All In · Included
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-snug">
                The Monthly Letter
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                A special monthly newsletter, for members only — on bouncing
                forward from your hardest season. Longer and closer than the
                public note: one honest theme each month, written for wherever
                this season finds you.
              </p>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ── Everything New, as It Lands ──────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              All In · Included
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              Everything New, as It Lands
            </h2>
          </SlideUp>
          <SlideUp delay={0.06}>
            <p className="mt-6 text-lg leading-relaxed">
              Bouncing Forward keeps growing — new tools, new resources, new ways
              through. Whatever we add next is already yours. Going all in means
              never buying it twice.
            </p>
          </SlideUp>
        </div>
      </section>

      {/* ── Claim Your Access (#a-claim, navy) ───────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div
          id="a-claim"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24"
        >
          <FadeIn className="max-w-2xl">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Claim Your Access
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-primary-foreground/85">
              Go All In for $99 and everything opens — a downloadable copy of the
              book included. Already a member? Enter your access code below.
            </p>
            <div className="mt-8">
              <a
                href="#a-claim"
                className="inline-flex items-center rounded-full bg-primary-foreground px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary transition-colors hover:bg-primary-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Go All In — $99
              </a>
            </div>
            <ClaimAccessForm />
            <div className="mt-8">
              <ExternalCta
                href={AMAZON_URL}
                label="Prefer to start with just the book? Buy on Amazon — $14.45 →"
                invert
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing heading={NEWSLETTER_HEADING} body={NEWSLETTER_BODY} />
    </>
  );
}
