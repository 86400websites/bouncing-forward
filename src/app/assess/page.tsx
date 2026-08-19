import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import { QuickLookFrame } from "@/components/assess/quick-look-frame";

export const metadata: Metadata = {
  title: { absolute: "Where’s Here? — The Quick Look | Bouncing Forward" },
  description:
    "Ten honest statements. About two minutes. No right answers, no timeline, no one keeping score — just a quick, honest look at where you’re standing.",
  openGraph: {
    title: "Where’s Here? — The Quick Look | Bouncing Forward",
    description:
      "Ten honest statements. About two minutes. No right answers, no timeline, no one keeping score — just a quick, honest look at where you’re standing.",
  },
};

/* Copy + image source: Heather correction brief (Where's Here? — Quick Look). */

export default function AssessPage() {
  return (
    <>
      {/* ── Intro (site-styled) ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                Free · Ten honest statements · About two minutes
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
                From here, forward. But first — where’s here?
              </h1>
            </SlideUp>
            <SlideUp delay={0.06}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                Ten statements. Two minutes. No right answers, no timeline, no
                one keeping score.
              </p>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p className="mt-4 max-w-xl text-lg leading-relaxed">
                Just a quick, honest look at where you’re standing.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8">
                <a
                  href="#quick-look"
                  className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Take the quick look →
                </a>
              </div>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/assess/wheres-here-map.png"
              alt="A person reading a map with a marked route and a flag on the horizon — an honest look at where they’re standing"
              width={1254}
              height={1254}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="mx-auto w-full max-w-md rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── The Quick Look tool ──────────────────────────────── */}
      <section
        id="quick-look"
        className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16 sm:px-6 lg:px-8 sm:py-20"
      >
        <QuickLookFrame />
      </section>
    </>
  );
}
