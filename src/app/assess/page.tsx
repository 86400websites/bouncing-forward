import type { Metadata } from "next";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import { BeginYourCrossing, PrimaryCta } from "@/components/site/begin-your-crossing";
import { CompassCheck } from "@/components/assess/compass-check";

export const metadata: Metadata = {
  title: "The Compass & Path Check",
  description:
    "An honest, two-minute check across the eight dimensions of the Bouncing Forward framework. Rate where you are today — 8 questions, honest, not graded.",
};

/* Copy source: Bouncing_Forward_Website_Copy.docx — Page 7 (Assess), verbatim. */

export default function AssessPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-16 text-center sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Assess · The Compass &amp; Path Check
          </p>
        </FadeIn>
        <SlideUp>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
            Which lights are burning bright — and which have gone faint?
          </h1>
        </SlideUp>
        <SlideUp delay={0.08}>
          <p className="mt-6 text-lg leading-relaxed">
            An honest, two-minute check across the eight dimensions of the
            Bouncing Forward framework: the 4-Element Compass and the 4-Step
            Path, drawn directly from the book’s own Taking Stock inventory. Rate
            where you are today — not who you were before the loss. Just here,
            now.
          </p>
        </SlideUp>
        <SlideUp delay={0.12}>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.08em] text-muted-foreground">
            8 questions · about 2 minutes · honest, not graded
          </p>
        </SlideUp>
        <SlideUp delay={0.16}>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Most people measure a hard season by how well they’re coping on the
            outside. Almost no one checks which parts of the crossing are
            actually working. This short check shows you which lights are burning
            steady, and which need your attention.
          </p>
        </SlideUp>
        <SlideUp delay={0.2}>
          <div className="mt-8 flex justify-center">
            <PrimaryCta href="#compass-check" label="Check my compass →" />
          </div>
        </SlideUp>
      </section>

      {/* ── What it means ────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              What It Means
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              A crossing isn’t measured by a high score. It’s measured by an
              honest map.
            </h2>
          </SlideUp>
          <SlideUp delay={0.06}>
            <blockquote className="mt-6 border-l-2 border-brand-accent pl-5 text-xl italic leading-relaxed sm:text-2xl">
              The map that lies about the terrain is not a kindness to the
              traveller. It is a danger.
            </blockquote>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="mt-8 text-lg leading-relaxed">
              The point of this check isn’t to score well on every dimension —
              it’s to notice, honestly, which lights have gone quiet, and which
              steps still feel out of reach. That noticing is the whole
              beginning of the work.
            </p>
          </SlideUp>
        </div>
      </section>

      {/* ── The check (interactive tool) ─────────────────────── */}
      <section
        id="compass-check"
        className="mx-auto max-w-4xl scroll-mt-24 px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24"
      >
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            The Compass &amp; Path Check
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Eight honest questions.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Answer for today, not for who you were before. Each one carries a
            reflection to sit with as you rate it — there are no right answers,
            and nothing is graded.
          </p>
        </SlideUp>
        <div className="mt-10">
          <CompassCheck />
        </div>
      </section>

      {/* ── Begin Your Crossing capture ──────────────────────── */}
      <BeginYourCrossing
        body="Want the worksheet version to revisit each month? Get the free Taking Stock Inventory and a monthly note on turning hardship into forward motion."
        showFaqLink
      />
    </>
  );
}
