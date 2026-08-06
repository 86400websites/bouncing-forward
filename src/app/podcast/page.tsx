import type { Metadata } from "next";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import { BeginYourCrossing } from "@/components/site/begin-your-crossing";

export const metadata: Metadata = {
  title: { absolute: "The Podcast | Bouncing Forward" },
  description:
    "Honest conversations about loss, resilience, and finding a way forward. New episodes are announced here first.",
  openGraph: {
    title: "The Podcast | Bouncing Forward",
    description:
      "Honest conversations about loss, resilience, and finding a way forward. New episodes are announced here first.",
  },
};

/* Copy source: 4_August_BF-Website-Copy-Changes-Designer-Brief-3.docx — Podcast (7.1). */

export default function PodcastPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-6 lg:px-8 sm:py-24 lg:py-28">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Podcast
          </p>
        </FadeIn>
        <SlideUp>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
            Bouncing Forward — the Podcast
          </h1>
        </SlideUp>
        <SlideUp delay={0.06}>
          <span className="mt-6 inline-flex items-center rounded-full border border-brand-accent/40 bg-brand-accent/10 px-4 py-1.5 font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text">
            Coming soon
          </span>
        </SlideUp>
        <SlideUp delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed">
            The next conversation is already taking shape. Check back here to find
            out when the next podcast lands — every new episode is announced on
            this page first.
          </p>
        </SlideUp>
      </section>

      <BeginYourCrossing />
    </>
  );
}
