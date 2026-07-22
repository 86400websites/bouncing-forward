import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn, SlideUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  ComingSoonCta,
  PrimaryCta,
} from "@/components/site/begin-your-crossing";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Three ways into the framework — a guided course, honest conversations, and short notes to read on the hard mornings. Pick the format that fits how you process.",
};

/* Copy source: Bouncing_Forward_Website_Copy.docx — Page 3 (Learn), verbatim. */

const cards = [
  {
    kicker: "Online Course",
    title: "The Bouncing Forward Course",
    body: "The book’s companion course. Eight guided modules across the 4 Elements and 4 Steps — each with a short video, a downloadable companion guide, and space to build your own Taking Stock plan as you go. Not a lecture. A crossing, one module at a time.",
    cta: "Start the Course",
    image: {
      src: "/assets/learn/course-screen.jpg",
      alt: "A course screen showing a Bouncing Forward module",
    },
  },
  {
    kicker: "Podcast",
    title: "Bouncing Forward — the Podcast",
    body: "Conversations with people who turned their worst chapter into their most purposeful one. Real stories from Jordan and beyond, honest talk about grief, faith, and rebuilding — no clichés about closure.",
    cta: "Tune In",
    image: {
      src: "/assets/learn/podcast.jpg",
      alt: "Podcast microphone artwork",
    },
  },
  {
    kicker: "Journal / Blog",
    title: "The Bouncing Forward Journal",
    body: "A 30-day companion journal plus short, practical notes you can read in five minutes and use the same day. One story, one prompt, one small move — drawn from the framework and from real life.",
    cta: "Read Now",
    image: {
      src: "/assets/learn/open-book.jpg",
      alt: "An open journal ready to write in",
    },
  },
];

export default function LearnPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="max-w-3xl">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              Learn
            </p>
          </FadeIn>
          <SlideUp>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              Three ways into the framework.
            </h1>
          </SlideUp>
          <SlideUp delay={0.08}>
            <p className="mt-6 text-lg leading-relaxed">
              The book gives you the compass and the path. This is where you go
              deeper. A guided course to walk it with you, honest conversations
              to keep you company, and short notes to read on the hard mornings.
              Pick the format that fits how you process — and how you grieve.
            </p>
          </SlideUp>
        </div>
      </section>

      {/* ── Three ways ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-6 lg:px-8 sm:pb-20 lg:pb-24">
        <Stagger className="grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <StaggerItem key={c.title} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={c.image.src}
                    alt={c.image.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                    {c.kicker}
                  </p>
                  <h2 className="mt-2 text-xl font-bold leading-snug">
                    {c.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                  <span className="mt-5 inline-block cursor-default font-[family-name:var(--font-display)] text-sm font-bold text-muted-foreground">
                    {c.cta} → Coming Soon
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── How to use this ──────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              How to Use This
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              You don’t have to do all three.
            </h2>
          </SlideUp>
          <div className="mt-6 space-y-4 text-lg leading-relaxed">
            <SlideUp delay={0.06}>
              <p>
                Some people want the structure of a course when the ground feels
                unsteady. Some want a voice keeping them company on a hard walk.
                Some just want five honest minutes with their morning coffee.
                There’s no right order, and no falling behind.
              </p>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p>
                Start where you are. That’s the whole idea.
              </p>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ── Begin Your Crossing capture ──────────────────────── */}
      <BeginYourCrossing />

      {/* ── Closing band (navy) ──────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              The next chapter hasn’t been written yet.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ComingSoonCta label="Start the Course" invert />
              <PrimaryCta
                href="#begin-your-crossing"
                label="Get the Free Taking Stock Inventory"
                invert
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
