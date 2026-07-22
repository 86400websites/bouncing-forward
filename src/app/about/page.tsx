import type { Metadata } from "next";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  PrimaryCta,
  SecondaryCta,
} from "@/components/site/begin-your-crossing";
import { IllustrationPlaceholder } from "@/components/site/story-card";

export const metadata: Metadata = {
  title: "About Maher Kaddoura",
  description:
    "I turned the worst night of my life into the direction for the rest of it. The story behind Bouncing Forward, from a hospital corridor in Amman to a road that saves lives.",
};

/* Copy source: Bouncing_Forward_Website_Copy.docx — Page 6 (About), verbatim. */

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                About
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
                I turned the worst night of my life into the direction for the
                rest of it.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                I’m Maher Kaddoura. Civil engineer by training. Consultant by
                profession. Father, first and always. Bouncing Forward is the
                book I wish someone had handed me in that hospital corridor in
                Amman, in January 2008 — long before I had a framework, a model,
                or any idea that the worst thing that had ever happened to me
                would become the thing that gave my life its fullest meaning.
              </p>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-border">
              <IllustrationPlaceholder label="Portrait coming soon" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Where it starts ──────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              Where It Starts
            </p>
          </SlideUp>
          <SlideUp delay={0.06}>
            <blockquote className="mt-6 border-l-2 border-brand-accent pl-5 text-xl italic leading-relaxed sm:text-2xl">
              Not going back to who you were. Going forward to who you are
              capable of becoming.
            </blockquote>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="mt-8 text-lg leading-relaxed">
              At fifteen, I explored Europe with a sleeping bag and a restless
              curiosity. I studied Civil Engineering at Nottingham University,
              then found my calling in management — working with the US Army in
              Jordan, helping establish Accenture’s Middle East practice, and
              building consulting firms of my own. I have visited ninety
              countries and two hundred and fifty cities, and sat with people of
              every faith and tradition along the way. In all that travelling, I
              found one truth that crosses every border: the person who knows
              they are not facing the dark alone can endure almost anything.
            </p>
          </SlideUp>
        </div>
      </section>

      {/* ── The turning point ────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            The Turning Point
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            The call came at 2am.
          </h2>
        </SlideUp>
        <div className="mt-6 space-y-4 text-lg leading-relaxed">
          <SlideUp delay={0.06}>
            <p>
              Before I picked up, I already knew. You develop a sense for it. My
              son Hikmat — seventeen years old, full of life, at the edge of
              adulthood — had been struck by a car in Amman. The driver fled. My
              wife and I raced to the hospital. She wept. I prayed. Both of us
              suspended between hope and its opposite.
            </p>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p>
              I didn’t know it then — but in that hospital, in the days that
              followed, and in the years of work that came after — something was
              being given to me. Not instead of the pain. Alongside it. A
              direction. A reason to keep building when everything in me wanted
              to stop.
            </p>
          </SlideUp>
          <SlideUp delay={0.14}>
            <p>I call it Bouncing Forward.</p>
          </SlideUp>
        </div>
      </section>

      {/* ── What I learned the hard way ──────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              What I Learned the Hard Way
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Acceptance isn’t surrender.
            </h2>
          </SlideUp>
          <div className="mt-6 space-y-4 text-lg leading-relaxed">
            <SlideUp delay={0.06}>
              <p>
                I am not going to rearrange the furniture of my son’s memory as
                though he never existed. Acceptance meant acknowledging the full
                truth: Hikmat was here. He was taken before his time. That fact
                will never change. The question I had to answer every morning
                wasn’t “how do I go back?” It was “who am I, carrying this, going
                forward?”
              </p>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p>
                That question gave birth to the Hikmat Road Safety Program — a
                project that has since built over 1,200 playgrounds, marked 260
                schools in high-risk zones, and identified 1,800 dangerous
                locations across Jordan’s roads. It taught me that real
                acceptance isn’t giving up. It’s saying:{" "}
                <em>this is where I am — now what can I build from here?</em>
              </p>
            </SlideUp>
            <SlideUp delay={0.14}>
              <p>
                I am not unique in this. The same capacity lives in you. If I
                could turn my worst chapter forward, so can you.
              </p>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ── Why Bouncing Forward ─────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Why Bouncing Forward
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Because no one hands you a map for this part.
          </h2>
        </SlideUp>
        <div className="mt-6 space-y-4 text-lg leading-relaxed">
          <SlideUp delay={0.06}>
            <p>
              Everywhere I look, I see people carrying a loss they were never
              given the tools to cross. Not because they lack strength — because
              no one ever handed them a compass, or told them there was a path
              at all.
            </p>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p>
              I wrote Bouncing Forward to hand you both — and a practical way to
              use them. Not platitudes. Not a five-step cure for grief. A
              framework, grounded in a real hospital corridor and a real road in
              Jordan, built to be used in the middle of real life. Because the
              most dangerous thing about loss isn’t the pain. It’s letting the
              pain be the only thing that ever gets built from it.
            </p>
          </SlideUp>
          <SlideUp delay={0.14}>
            <p>
              Hikmat did not die for nothing. His name means wisdom, in Arabic.
              He earned it.
            </p>
          </SlideUp>
        </div>
      </section>

      {/* ── Closing reflection (navy band) ───────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="italic text-primary-foreground/75">
              Take a moment. Ask yourself, honestly:
            </p>
            <p className="mt-8 text-3xl font-extrabold sm:text-4xl">
              Why did this happen?
            </p>
            <p className="mt-4 text-3xl font-extrabold sm:text-4xl">
              What does this ask of me?
            </p>
            <p className="mt-8 italic leading-relaxed text-primary-foreground/75">
              You don’t need the answer yet. Just the courage to ask.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <PrimaryCta href="/book" label="Read the Book" invert />
              <SecondaryCta
                href="/assess"
                label="Start the Compass &amp; Path Check"
                invert
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Begin Your Crossing capture ──────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
