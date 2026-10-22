import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FadeIn,
  SlideUp,
  Stagger,
  StaggerItem,
} from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  PrimaryCta,
  SecondaryCta,
} from "@/components/site/begin-your-crossing";

export const metadata: Metadata = {
  title: { absolute: "Bouncing Forward | Setbacks Don’t Get the Last Word" },
  description:
    "The setback wasn’t your choice. The next step is. Built from a real story, for anyone in their hardest chapter.",
};

/* Copy source: Home_Page-3.docx — Home page rework, verbatim. */

const whoBullets = [
  "You’ve been handed a setback you didn’t choose, and you’re done pretending you’re fine.",
  "You’ve had enough of ‘everything happens for a reason.’",
  "Something in you is ready for what’s next.",
  "You want a way forward, not a silver lining.",
];

const fourWays = [
  {
    title: "Learn",
    body: "Maher walks you through the framework himself — a short video for each module, and your own plan taking shape as you go.",
    href: "/course",
    cta: "Start learning →",
  },
  {
    title: "Practice",
    body: "Tools built for the middle of real life — not a classroom. Small enough to use on the days when everything feels like a lot.",
    href: "/compass-and-path",
    cta: "Put it to work →",
  },
  {
    title: "Assess",
    body: "A few minutes. Complete privacy. No right answers, no timeline, no one keeping score.",
    href: "/assess",
    cta: "Find out where here is →",
  },
  {
    title: "Stories",
    body: "Real people, from Cape Town to Rio to Ladakh who turned loss into direction.",
    href: "/stories",
    cta: "Meet them →",
  },
];

const freeIncludes = [
  "Read the blog and the stories",
  "Watch the course introduction",
  "Read the book’s first chapter",
  "Download your 7 Step Journal", // rendered as a download link below
  "Take the two-minute check",
  "Your email address gets you a weekly note to keep you moving forward",
];

const allInIncludes = [
  "A summarized version of the book",
  "The nine-module course, with worksheets",
  "The 30-Day Journal",
  "A Monthly Letter, with practical tools for your journey",
  "The webinars — live, plus the full library",
  "Everything new, as it lands",
];

const premiumIncludes = [
  "The complete downloadable book",
  "The downloadable companion workbook",
  "Plus everything in All In, including the Full Assessment — all open when you log in",
];

export default function HomePage() {
  return (
    <>
      {/* ── Screen 1 — Hero ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                From here, forward.
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">
                The setback wasn’t your choice. The next step is.
              </h1>
            </SlideUp>
            <SlideUp delay={0.06}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                A setback isn’t the finish line. It’s the ground between who you
                were and who you’re capable of becoming.
              </p>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p className="mt-4 max-w-xl text-lg leading-relaxed">
                Built from a real story, for anyone in their hardest chapter. It
                starts with one honest question: where’s here?
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrimaryCta href="/book" label="Read the Book" />
                <SecondaryCta href="/all-in" label="Go All In" />
                <SecondaryCta href="/assess" label="Find out where here is" />
              </div>
              <div className="mt-5">
                <a
                  href="/downloads/Bouncing-Forward-Chapter-1-Free-A4.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-accent text-primary focus-visible:outline-ring inline-flex items-center gap-2 rounded-full px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold shadow-sm transition-[filter] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Read the first chapter free →
                </a>
              </div>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/home/hero-forest-new.png"
              alt="A traveller with a compass at the edge of a forest, stepping stones leading toward the light"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Screen 2 — Four questions ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SlideUp>
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
                Four questions. In order.
              </h2>
            </SlideUp>
            <div className="mt-6 space-y-4 text-lg leading-relaxed">
              <SlideUp delay={0.06}>
                <p>
                  What happened? What is it asking of you? What’s still
                  possible? What’s the first step?
                </p>
              </SlideUp>
              <SlideUp delay={0.1}>
                <p>
                  Everyone in a setback is already circling these questions.
                  Bouncing Forward puts them in order: a Path with four steps.
                  Accept, Reflect, Imagine, Act.
                </p>
              </SlideUp>
              <SlideUp delay={0.14}>
                <p>
                  Walking it draws on strengths you already have — the path
                  reveals them as you go.
                </p>
              </SlideUp>
            </div>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/home/stepping-stones.png"
              alt="Named stepping stones — Accept, Reflect, Imagine, Act — leading toward the sunrise"
              width={905}
              height={679}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="mx-auto w-full max-w-lg rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Screen 3 — Who is this for ───────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn className="order-last lg:order-first">
              <Image
                src="/assets/home/who-is-this-for-bridge.png"
                alt="A woman crossing a footbridge toward a path winding into the sunrise"
                width={1448}
                height={1086}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="w-full rounded-xl"
              />
            </FadeIn>
            <div>
              <SlideUp>
                <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
                  Who is this for?
                </h2>
              </SlideUp>
              <SlideUp delay={0.06}>
                <p className="mt-6 text-lg leading-relaxed">
                  This isn’t a plan to make the pain disappear. It’s for the day
                  you decide your story keeps going.
                </p>
              </SlideUp>
              <Stagger className="mt-6 space-y-3">
                {whoBullets.map((b) => (
                  <StaggerItem key={b}>
                    <div className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="bg-brand-accent mt-2 size-1.5 shrink-0 rounded-full"
                      />
                      <p className="leading-relaxed">{b}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* ── Screen 4 — Start here and Move Forward ───────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SlideUp>
          <h2 className="mx-auto max-w-3xl text-center text-3xl leading-tight font-extrabold sm:text-4xl">
            Start here and Move Forward
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed">
            Our vision is to see everyone facing hardship, setbacks and loss
            bounce forward — so we built the Bouncing Forward journey, and the
            tools for every step of it: start where you are, commit when you’re
            ready, then go all the way.
          </p>
          <p className="text-primary mt-6 text-center font-[family-name:var(--font-display)] text-lg font-bold">
            Choose your next step.
          </p>
        </SlideUp>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Free */}
          <FadeIn>
            <div className="border-border bg-card flex h-full flex-col rounded-lg border p-8">
              <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                Your First Step
              </p>
              <h3 className="mt-1 text-2xl font-extrabold">Free</h3>
              <p className="mt-5 font-bold">Start here.</p>
              <ul className="mt-4 flex-1 space-y-3">
                {freeIncludes.map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="bg-brand-accent mt-2 size-1.5 shrink-0 rounded-full"
                    />
                    {item.startsWith("Download your 7 Step Journal") ? (
                      <a
                        href="/downloads/BF-7-Step-Reflection-Journal.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="decoration-brand-accent hover:text-brand-accent-text underline underline-offset-4 transition-colors"
                      >
                        {item}
                      </a>
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="#begin-your-crossing"
                  className="border-primary text-primary hover:bg-muted focus-visible:outline-ring inline-flex items-center rounded-full border px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Send me the weekly note
                </Link>
              </div>
            </div>
          </FadeIn>
          {/* All In */}
          <FadeIn delay={0.08}>
            <div className="border-brand-accent bg-card flex h-full flex-col rounded-lg border-2 p-8">
              <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                Commit to Bouncing Forward
              </p>
              <h3 className="mt-1 text-2xl font-extrabold">All In</h3>
              <p className="mt-5 font-bold">
                To go all in, take the Full Assessment. It unlocks everything
                below.
              </p>
              <p className="text-muted-foreground mt-3 text-sm font-bold tracking-[0.08em] uppercase">
                Everything in Free, plus:
              </p>
              <ul className="mt-3 flex-1 space-y-3">
                {allInIncludes.map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="bg-brand-accent mt-2 size-1.5 shrink-0 rounded-full"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/all-in"
                  className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center rounded-full px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Go All In
                </Link>
              </div>
            </div>
          </FadeIn>
          {/* Premium */}
          <FadeIn delay={0.16}>
            <div
              id="book-package"
              className="border-border bg-card flex h-full scroll-mt-24 flex-col rounded-lg border p-8"
            >
              <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                The Book Package
              </p>
              <h3 className="mt-1 text-2xl font-extrabold">Premium</h3>
              <p className="mt-5 font-bold">Go all the way.</p>
              <p className="mt-3 leading-relaxed">
                The Book Package —{" "}
                <span className="text-brand-accent-text font-bold">$9.99</span>:
              </p>
              <ul className="mt-3 flex-1 space-y-3">
                {premiumIncludes.map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="bg-brand-accent mt-2 size-1.5 shrink-0 rounded-full"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-primary mt-4 font-[family-name:var(--font-display)] font-bold">
                One price. The whole journey.
              </p>
              <div className="mt-6">
                <Link
                  href="/premium"
                  className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center rounded-full px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Buy the Book Package
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Screen 5 — The next step is yours ────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SlideUp>
            <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
              The next step is yours.
            </h2>
          </SlideUp>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fourWays.map((w) => (
              <StaggerItem key={w.title} className="h-full">
                <article className="border-border bg-card flex h-full flex-col rounded-lg border p-6">
                  <h3 className="text-xl font-bold">{w.title}</h3>
                  <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                    {w.body}
                  </p>
                  <Link
                    href={w.href}
                    className="text-brand-accent-text hover:text-foreground focus-visible:outline-ring mt-5 inline-block font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {w.cta}
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Screen 6 — Email sign-up (the 7 Step Journal) ────────── */}
      <BeginYourCrossing
        heading="Download your 7 Step Journal"
        body="Seven steps. Seven honest prompts. One small step at the end — free, downloadable, yours to keep. With it comes one note from us a month. No noise, and easy to leave."
        submitLabel="Send me the 7 Step Journal"
      />

      {/* ── Screen 7 — Closing questions ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl leading-tight font-extrabold sm:text-3xl">
            Take a moment. Ask yourself, honestly:
          </h2>
          <p className="mt-6 font-[family-name:var(--font-display)] text-3xl font-extrabold italic sm:text-4xl">
            Why did this happen to me?
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold italic sm:text-4xl">
            What does this ask of me now?
          </p>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            You don’t need the answer to the first. Only the courage to ask the
            second.
          </p>
        </FadeIn>
      </section>
    </>
  );
}
