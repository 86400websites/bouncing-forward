import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  PrimaryCta,
  SecondaryCta,
} from "@/components/site/begin-your-crossing";

export const metadata: Metadata = {
  title: { absolute: "About Maher Kaddoura | Bouncing Forward" },
  description:
    "After losing his son Hikmat, Maher Kaddoura turned grief into direction — road safety work that saves lives, and the framework behind Bouncing Forward.",
  openGraph: {
    title: "About Maher Kaddoura | Bouncing Forward",
    description:
      "After losing his son Hikmat, Maher Kaddoura turned grief into direction — road safety work that saves lives, and the framework behind Bouncing Forward.",
    images: ["/assets/about/maher-portrait.jpg"],
  },
};

/* Copy source: Website_Rebrief_31_July_2026.docx — The Author (/about), verbatim. */

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                The Author
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl leading-[1.1] font-extrabold sm:text-5xl">
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
            <Image
              src="/assets/about/maher-portrait.jpg"
              alt="Portrait of Maher Kaddoura"
              width={700}
              height={708}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="mx-auto w-full max-w-md rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Where it starts ──────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SlideUp>
            <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
              Where it starts
            </p>
          </SlideUp>
          <SlideUp delay={0.06}>
            <blockquote className="border-brand-accent mt-6 border-l-2 pl-5 text-xl leading-relaxed italic sm:text-2xl">
              “Not going back to who you were. Going forward to who you are
              capable of becoming.”
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
              every faith and tradition along the way. In all that traveling, I
              found one truth that crosses every border: the person who knows
              they are not facing the dark alone can endure almost anything.
            </p>
          </SlideUp>
        </div>
      </section>

      {/* ── The turning point ────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SlideUp>
          <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
            The turning point
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
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
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SlideUp>
                <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                  What I learned the hard way
                </p>
                <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
                  Acceptance isn’t surrender.
                </h2>
              </SlideUp>
              <div className="mt-6 space-y-4 text-lg leading-relaxed">
                <SlideUp delay={0.06}>
                  <p>
                    I am not going to rearrange the furniture of my son’s memory
                    as though he never existed. Acceptance meant acknowledging
                    the full truth: Hikmat was here. He was taken before his
                    time. That fact will never change. The question I had to
                    answer every morning wasn’t “how do I go back?” It was “who
                    am I, carrying this, going forward?”
                  </p>
                </SlideUp>
                <SlideUp delay={0.1}>
                  <p>
                    That question gave birth to the Hikmat Road Safety Program —
                    a project that has since built over 1,200 playgrounds,
                    marked 260 schools in high-risk zones, and identified 1,800
                    dangerous locations across Jordan’s roads. It taught me that
                    real acceptance isn’t giving up. It’s saying: this is where
                    I am — now what can I build from here?
                  </p>
                </SlideUp>
                <SlideUp delay={0.14}>
                  <p>
                    I am not unique in this. The same capacity lives in you. If
                    I could turn my worst chapter forward, so can you.
                  </p>
                </SlideUp>
              </div>
            </div>
            <FadeIn delay={0.1}>
              <Image
                src="/assets/about/road-safety-crossing.png"
                alt="Illustration of the Hikmat Road Safety Program — children crossing safely at a marked school-zone pedestrian crossing"
                width={1448}
                height={1086}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="w-full rounded-xl"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Why Bouncing Forward ─────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SlideUp>
          <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
            Why Bouncing Forward
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
            Because no one hands you a map for this part.
          </h2>
        </SlideUp>
        <div className="mt-6 space-y-4 text-lg leading-relaxed">
          <SlideUp delay={0.06}>
            <p>
              Everywhere I look, I see people carrying a loss they were never
              given the tools to face. Not because they lack strength — because
              no one ever handed them a compass, or told them there was a path
              at all.
            </p>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p>
              I wrote Bouncing Forward to hand you both — and a practical way to
              use them. Not platitudes. Not a five-step cure. A framework,
              grounded in a real hospital corridor and a real road in Jordan,
              built to be used in the middle of real life. Because the most
              dangerous thing about loss isn’t the pain. It’s letting the pain
              be the only thing that ever gets built from it.
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

      {/* ── Closing (navy band) ──────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl leading-tight font-extrabold sm:text-3xl">
              Take a moment. Ask yourself, honestly:
            </h2>
            <p className="mt-6 font-[family-name:var(--font-display)] text-2xl font-extrabold italic sm:text-3xl">
              Why did this happen?
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold italic sm:text-3xl">
              What does this ask of me?
            </p>
            <p className="text-primary-foreground/85 mt-6 text-lg leading-relaxed">
              You don’t need the answer yet. Just the courage to ask.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <PrimaryCta href="/all-in" label="Go All In" invert />
              <SecondaryCta href="/book" label="Read the Book" invert />
              <SecondaryCta
                href="/assess"
                label="Find out where here is"
                invert
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing
        heading="Download your 7 Step Journal"
        body="Seven steps. Seven honest prompts. One small step at the end — free, downloadable, yours to keep. With it comes one note from us a month. No noise, and easy to leave."
        submitLabel="Send me the 7 Step Journal"
      />
    </>
  );
}
