import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, SlideUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  ComingSoonCta,
  PrimaryCta,
  SecondaryCta,
} from "@/components/site/begin-your-crossing";

export const metadata: Metadata = {
  description:
    "Loss isn't the finish line. Bouncing Forward is the compass and the path for the crossing — a 4-Element framework and a 4-Step model for anyone standing at the edge of their hardest chapter.",
};

/* Copy source: Bouncing_Forward_Website_Copy.docx — Page 1, verbatim. */

const whoBullets = [
  "You've been handed a loss you didn't choose, and you're tired of pretending you're fine.",
  "You're tired of platitudes about \u201Ceverything happens for a reason.\u201D",
  "You still feel the pull to build something — you just don't know where to start.",
  "You want a way forward, not a silver lining.",
  "You want a framework grounded in a real story, not a theory.",
];

const fourWays = [
  {
    title: "Learn",
    body: "Discover the framework through the book, a guided course, and honest conversations about grief, purpose, and rebuilding.",
    href: "/learn",
  },
  {
    title: "Practice",
    body: "Put it to work. The 4 Elements, the 4 Steps, the Taking Stock Inventory — built for the middle of real life, not a classroom.",
    href: "/compass-and-path",
  },
  {
    title: "Assess",
    body: "Which lights are burning bright, and which have gone faint? Take the Compass & Path Check and see where you actually stand.",
    href: "/assess",
  },
  {
    title: "Stories",
    body: "Real people — from Cape Town to Rio to Ladakh — who turned loss into direction. See how they crossed, and find permission for your own crossing.",
    href: "/stories",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                Turn the page
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
                Not Back. Forward.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed sm:text-xl">
                Loss isn&apos;t the finish line. It&apos;s the forest you have
                to cross — and on the other side is the person you&apos;re
                capable of becoming.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                Bouncing Forward is the compass and the path for that crossing:
                a 4-Element framework and a 4-Step model, built from a real
                story, for anyone standing at the edge of their own hardest
                chapter.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryCta href="/assess" label="Start With One Question →" />
                <SecondaryCta href="/book" label="Read the Book" />
              </div>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/home/hero-forest.jpg"
              alt="A traveller holding a glowing compass at the edge of a dense forest, stepping stones leading toward light on the far side"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>

        <FadeIn>
          <figure className="mx-auto max-w-3xl py-14 text-center sm:py-16">
            <blockquote className="text-xl italic leading-relaxed sm:text-2xl">
              &ldquo;Not going back to who you were. Going forward to who you
              are capable of becoming.&rdquo;
            </blockquote>
            <figcaption className="mt-4 font-[family-name:var(--font-display)] text-sm font-bold text-muted-foreground">
              — Maher Kaddoura
            </figcaption>
          </figure>
        </FadeIn>
      </section>

      {/* ── Two Tools ────────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SlideUp>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                Two tools
              </p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                A Compass and a Path for the Hardest Seasons
              </h2>
              <p className="mt-6 leading-relaxed">
                Most books about loss tell you how to <em>survive</em> it. This
                one shows you how to <em>cross</em> it.
              </p>
              <p className="mt-4 leading-relaxed">
                The Bouncing Forward framework rests on two tools, not one.{" "}
                <strong className="font-semibold">The 4-Element Compass</strong>{" "}
                — Resilience, Adaptability, Optimism, Support — four lights that
                show you which way is forward, even in the dark.{" "}
                <strong className="font-semibold">The 4-Step Path</strong> —
                Accept, Reflect, Imagine, Action — the sequence that turns
                standing still into movement, one foot at a time.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                A compass without a path leaves you oriented but frozen. A path
                without a compass moves you, but you don&apos;t know if
                you&apos;re headed anywhere real. Together, they get you across.
              </p>
              <div className="mt-8">
                <PrimaryCta
                  href="#begin-your-crossing"
                  label="Download the Free Taking Stock Inventory"
                />
              </div>
            </SlideUp>
            <FadeIn delay={0.1}>
              <Image
                src="/assets/framework/diagram-compass-path.jpg"
                alt="The Bouncing Forward framework diagram: Resilience, Adaptability, Optimism and Support form an outer compass frame around the inner path loop of Accept, Reflect, Imagine and Action"
                width={2000}
                height={2000}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="mx-auto w-full max-w-lg rounded-xl"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Who is it for ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <FadeIn className="order-last lg:order-first">
            <Image
              src="/assets/home/who-is-this-for.jpg"
              alt="A quiet, human moment — someone pausing mid-thought, journal in hand"
              width={1448}
              height={1086}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
          <div>
            <SlideUp>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                Who is it for
              </p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                Who is this for?
              </h2>
              <p className="mt-6 leading-relaxed">
                If you&apos;re looking for a five-step plan to make the pain
                disappear, this isn&apos;t it. But if you&apos;ve had the phone
                call — or the diagnosis, or the morning that split your life in
                two — and you&apos;re ready to build something from what&apos;s
                left, you&apos;re exactly where you need to be.
              </p>
            </SlideUp>
            <Stagger className="mt-8 space-y-3">
              {whoBullets.map((b) => (
                <StaggerItem key={b} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-accent"
                  />
                  <p className="leading-relaxed">{b}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <SlideUp delay={0.1}>
              <div className="mt-8">
                <ComingSoonCta label="Read the First Chapter Free" />
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ── Four ways to begin ───────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              Four ways to begin
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
              Choose your path into Bouncing Forward
            </h2>
          </SlideUp>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fourWays.map((w) => (
              <StaggerItem key={w.title}>
                <Link
                  href={w.href}
                  className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <h3 className="text-xl font-bold">{w.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {w.body}
                  </p>
                  <span className="mt-5 font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text transition-colors group-hover:text-foreground">
                    Explore →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Email capture ────────────────────────────────────── */}
      <BeginYourCrossing showFaqLink />

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
              You don&apos;t need the answer to the first one. Only the courage
              to ask the second.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
