import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  PrimaryCta,
} from "@/components/site/begin-your-crossing";

export const metadata: Metadata = {
  title: { absolute: "The Course | Nine Guided Modules | Bouncing Forward" },
  description:
    "Nine guided modules presenting the Compass and the Path — short videos, companion guides, and your own plan as you go. Included free with All In.",
  openGraph: {
    title: "The Course | Nine Guided Modules | Bouncing Forward",
    description:
      "Nine guided modules presenting the Compass and the Path — short videos, companion guides, and your own plan as you go. Included free with All In.",
  },
};

/* Copy source: BF-Website-Copy-For-Sozana-2.docx — The Course (/course), verbatim. */


export default function CoursePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                The Course
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
                Walk the framework, one module at a time.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                The book gives you the compass and the path. The course walks
                them with you — nine guided modules presenting the full
                framework, built for the weeks when reading isn’t enough and you
                need someone to go first.
              </p>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/learn/course-screen.jpg"
              alt="A Bouncing Forward course module on screen"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Online course ────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              Online Course
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              The Bouncing Forward Course
            </h2>
          </SlideUp>
          <div className="mt-6 space-y-4 text-lg leading-relaxed">
            <SlideUp delay={0.06}>
              <p>
                The book’s companion course. Nine guided modules presenting the
                framework — the 4-Element Compass and the 4-Step Path — each with
                a short video, a downloadable companion guide, and space to build
                your own plan as you go.
              </p>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p>Not a lecture. A path, one module at a time.</p>
            </SlideUp>
          </div>
          <SlideUp delay={0.14}>
            <p className="mt-6 font-semibold">
              The course is part of All In — free, everything open. A downloadable
              copy of the book, all nine modules, the journal, a premium monthly
              newsletter, and everything new we add to Bouncing Forward.
            </p>
          </SlideUp>
          <SlideUp delay={0.18}>
            <div className="mt-8">
              <PrimaryCta href="/all-in" label="Go All In" />
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ── Watch a sample ───────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Watch a Sample
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Module 1: An Introduction to Bouncing Forward
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            See how the course feels before you begin. In this opening module,
            Maher introduces the Compass, the Path, and the honest question the
            whole framework is built to answer.
          </p>
        </SlideUp>
        <FadeIn>
          <div className="mt-8 flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted text-center">
            <svg
              viewBox="0 0 48 48"
              aria-hidden="true"
              className="size-12 text-brand-accent"
            >
              <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <path d="M20 17 L32 24 L20 31 Z" fill="currentColor" />
            </svg>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Sample video coming soon
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ── How to use this ──────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              How to Use This
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Start where you are.
            </h2>
          </SlideUp>
          <div className="mt-6 space-y-4 text-lg leading-relaxed">
            <SlideUp delay={0.06}>
              <p>
                Some people want structure when the ground feels unsteady. Some
                want a voice keeping them company. There’s no right pace, no right
                order, and no falling behind.
              </p>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p>Start where you are. That’s the whole idea.</p>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />

      {/* ── Closing band (navy) ──────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              The next chapter hasn’t been written yet.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <PrimaryCta href="/all-in" label="Go All In" invert />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
