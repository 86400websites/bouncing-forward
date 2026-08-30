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
  ExternalCta,
  PrimaryCta,
} from "@/components/site/begin-your-crossing";
import { NumberedCard } from "@/components/site/numbered-card";
import { AMAZON_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Free Resources | The Compass & the Path" },
  description:
    "Put the framework to work: the 4-Step Path, the 4-Element Compass, and the free Where’s Here? check.",
  openGraph: {
    title: "Free Resources | The Compass & the Path",
    description:
      "Put the framework to work: the 4-Step Path, the 4-Element Compass, and the free Where’s Here? check.",
  },
};

/* Copy source: BF-Website-Copy-For-Sozana-2.docx — Resources (/compass-and-path), verbatim. */

const compass = [
  {
    index: "01",
    title: "Resilience",
    descriptor:
      "Not toughness. The bamboo that bends almost flat in a storm — and stands back up when it passes.",
    image: {
      src: "/assets/compass/Resilience.png",
      alt: "Resilience — bamboo bending in the wind",
    },
  },
  {
    index: "02",
    title: "Adaptability",
    descriptor:
      "Loss takes more than a person or a plan — it takes a version of you. Adaptability is finding the shape of who’s left.",
    image: {
      src: "/assets/compass/Adaptabilit.png",
      alt: "Adaptability — a seedling within a cycle of arrows",
    },
  },
  {
    index: "03",
    title: "Optimism",
    descriptor:
      "Not forced positivity. A small, stubborn, renewable conviction that something good can still emerge.",
    image: {
      src: "/assets/compass/Optimis.png",
      alt: "Optimism — a rising sun",
    },
  },
  {
    index: "04",
    title: "Support",
    descriptor:
      "No one faces any significant setback alone. Support flows both ways, or it doesn’t flow at all. Let people in — and let yourself be one of theirs.",
    image: {
      src: "/assets/compass/Suppor.png",
      alt: "Support — hands cupping a growing seedling",
    },
  },
];

const path = [
  {
    index: "01",
    title: "Accept",
    descriptor:
      "Not agreement that it was fair. Just an honest end to the fight against what already happened.",
    image: {
      src: "/assets/framework/accept.png",
      alt: "Isometric illustration for Accept — a bridge across a divide",
    },
  },
  {
    index: "02",
    title: "Reflect",
    descriptor:
      "Not rumination. The disciplined, sometimes uncomfortable practice of asking: what does this ask of me?",
    image: {
      src: "/assets/framework/reflect.png",
      alt: "Isometric illustration for Reflect — still water mirroring the sky",
    },
  },
  {
    index: "03",
    title: "Imagine",
    descriptor:
      "A vision has a name and a deadline. Give your loss somewhere to go.",
    image: {
      src: "/assets/framework/imagine.jpg",
      alt: "Isometric illustration for Imagine — a named destination on the horizon",
    },
  },
  {
    index: "04",
    title: "Act",
    descriptor:
      "You will never feel fully ready. Begin anyway — the doing creates the readiness that waiting never will.",
    image: {
      src: "/assets/framework/act.png",
      alt: "Act — a first step taken on the path",
    },
  },
];
const tools = [
  {
    title: "The Reflection Companion",
    body: "Every “Reflect On…” question from the book, organised by Element and Step. Pick one a week. No pressure, just honesty.",
    cta: { kind: "soon" as const, label: "Explore" },
  },
  {
    title: "Where’s Here?",
    body: "Ten honest statements, two minutes. See where you stand on the Path — the full picture, including the Compass, is inside All In.",
    cta: {
      kind: "link" as const,
      href: "/assess",
      label: "Find out where here is →",
    },
  },
];

const explore = [
  {
    title: "Stories",
    body: "Real people, from Cape Town to Rio to Ladakh, who turned loss into direction.",
    href: "/stories",
    cta: "Meet them →",
  },
  {
    title: "The Blog",
    body: "Honest words for the hardest seasons — the things nobody tells you about loss, named plainly.",
    href: "/blog",
    cta: "Read →",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                Resources
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl leading-[1.1] font-extrabold sm:text-5xl">
                Reading is understanding. Practice is the way through.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                A framework you only understand is just an idea. A framework you
                use becomes a way forward. This is where Bouncing Forward stops
                being a book and starts being your own next chapter — four steps
                to move you forward, four elements to steady how you’re
                oriented, and the tools to begin today.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8">
                <Link
                  href="/all-in"
                  className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center rounded-full px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Go All In
                </Link>
              </div>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/compass/resources-hero.png"
              alt="A person reading a map with a marked route and a flag on the horizon — practice is the way through"
              width={1254}
              height={1254}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="mx-auto w-full max-w-md"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── The framework ────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SlideUp>
                <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                  The Framework
                </p>
                <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
                  Two tools. Not a formula.
                </h2>
              </SlideUp>
              <SlideUp delay={0.06}>
                <p className="mt-6 text-lg leading-relaxed">
                  Bouncing Forward ={" "}
                  <strong className="font-semibold">A Path</strong> (how you
                  move) <strong className="font-semibold">+ A Compass</strong>{" "}
                  (what you’re drawing on while you do)
                </p>
              </SlideUp>
              <SlideUp delay={0.1}>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  Not addition of convenience — dependence. A path with no
                  compass gets you moving, but you can circle for years without
                  knowing it. A compass with no path leaves you oriented and
                  standing still, waiting for a readiness that may never come.
                  Together, the path gives you motion, the compass gives you
                  direction — and that’s how you keep moving when the way isn’t
                  clear.
                </p>
              </SlideUp>
              <SlideUp delay={0.14}>
                <blockquote className="border-brand-accent mt-8 border-l-2 pl-5 text-xl leading-relaxed italic sm:text-2xl">
                  The compass doesn’t tell you where you’re going. It tells you
                  which direction is forward — even when the ground ahead is
                  hard to read.
                </blockquote>
              </SlideUp>
            </div>
            <FadeIn delay={0.1}>
              <Image
                src="/assets/framework/diagram-compass-path.jpg"
                alt="The Bouncing Forward compass and path diagram"
                width={2000}
                height={2000}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="mx-auto w-full max-w-lg rounded-xl"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── The 4-Step Path (#path) — MOVED UP, before Compass ── */}
      <section className="bg-muted">
        <div
          id="path"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
          <SlideUp>
            <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
              How You Move
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
              The 4-Step Path
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed">
              The path moves your feet. These four steps aren’t a formula, and
              they don’t move in a straight line — least of all after a setback.
              They’re stepping stones: one foot after the other, with intention,
              rather than simply enduring.
            </p>
          </SlideUp>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {path.map((p) => (
              <StaggerItem key={p.title} className="h-full">
                <NumberedCard
                  {...p}
                  headingLevel="h3"
                  className="bg-card"
                  iconClassName="bg-white"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Try it now banner — between Path and Compass ──────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn>
          <div className="border-border bg-card grid items-center gap-6 overflow-hidden rounded-lg border sm:grid-cols-[1fr_1.4fr]">
            <div className="relative w-full pb-[100%] sm:pb-[75%]">
              <Image
                src="/assets/assess/wheres-here-map.png"
                alt="A person reading a map with a marked route and a flag on the horizon — an honest look at where they’re standing"
                fill
                sizes="(min-width: 640px) 40vw, 100vw"
                className="absolute inset-0 h-full w-full object-contain p-4"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="max-w-2xl text-lg leading-relaxed">
                Try it now — ten honest statements, two minutes, no one keeping
                score. See where you stand on the Path.
              </p>
              <div className="mt-6 mr-auto flex flex-col gap-3 sm:flex-row">
                <PrimaryCta href="/assess" label="Find out where here is →" />

                <PrimaryCta href="/all-in" label=" Go All In" />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── The 4-Element Compass (#compass) — MOVED DOWN ─────── */}
      <section
        id="compass"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <SlideUp>
          <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
            How You’re Oriented
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
            The 4-Element Compass
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed">
            Life is marked by setbacks. Who you become isn’t shaped by the
            setback itself — it’s shaped by the choices you make while moving
            through it. These four elements aren’t a sequence, and they don’t
            run out. The more you draw on each one, the clearer your next step
            becomes.
          </p>
        </SlideUp>
        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {compass.map((c) => (
            <StaggerItem key={c.title} className="h-full">
              <NumberedCard {...c} headingLevel="h3" iconClassName="bg-white" />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <section
        id="inventory"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <SlideUp>
          <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
            Put It to Work
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
            Two tools to begin
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">
            You don’t have to absorb all eight at once. Start with one of these.
          </p>
        </SlideUp>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {tools.map((t) => (
            <StaggerItem key={t.title} className="h-full">
              <article className="border-border bg-card flex h-full flex-col rounded-lg border p-6">
                <h3 className="text-lg leading-snug font-bold">{t.title}</h3>
                <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                  {t.body}
                </p>
                {t.cta.kind === "link" ? (
                  <Link
                    href={t.cta.href}
                    className="text-brand-accent-text hover:text-foreground focus-visible:outline-ring mt-5 inline-block font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {t.cta.label}
                  </Link>
                ) : (
                  <span className="text-muted-foreground mt-5 inline-block cursor-default font-[family-name:var(--font-display)] text-sm font-bold">
                    {t.cta.label} — Coming Soon
                  </span>
                )}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Start with the source ────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SlideUp>
            <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
              Read the first chapter free.
            </h2>
            <p className="mt-6 text-lg leading-relaxed">
              The framework began as a book — and the first chapter is free to
              read right now. Meet the story behind the Compass and the Path
              before you buy.
            </p>
            <div className="mt-8 flex justify-center">
              <ExternalCta
                href={AMAZON_URL}
                label="Read the First Chapter Free →"
              />
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ── More to explore ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SlideUp>
          <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
            Keep going
          </h2>
        </SlideUp>
        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2">
          {explore.map((e) => (
            <StaggerItem key={e.title} className="h-full">
              <Link
                href={e.href}
                className={cn(
                  "group border-border bg-card focus-visible:outline-ring flex h-full flex-col rounded-lg border p-6 transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-8",
                )}
              >
                <h3 className="group-hover:text-brand-accent-text text-xl font-bold">
                  {e.title}
                </h3>
                <p className="text-muted-foreground mt-3 flex-1 leading-relaxed">
                  {e.body}
                </p>
                <span className="text-brand-accent-text mt-5 font-[family-name:var(--font-display)] text-sm font-bold">
                  {e.cta}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Assess block (shared navy pre-footer) ────────────── */}

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
