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
import { NumberedCard } from "@/components/site/numbered-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Compass & The Path",
  description:
    "Reading is understanding. Practice is crossing. Four elements to steady how you’re oriented, four steps to move you forward, and the tools to begin today.",
};

/* Copy source: Bouncing_Forward_Website_Copy.docx — Page 4 (Practice), verbatim. */

const compass = [
  {
    index: "01",
    title: "Resilience",
    subtitle: "Weathering the Storms of Adversity",
    quote:
      "Resilience is the unexpected light that emerges in the darkest times, transforming personal tragedy into shared purpose and a renewed direction.",
    descriptor:
      "Not toughness. The bamboo that bends almost flat in a storm — and stands back up when it passes.",
    image: {
      src: "/assets/framework/resilience-a.jpg",
      alt: "Isometric illustration for Resilience — bamboo bending in a storm",
    },
  },
  {
    index: "02",
    title: "Adaptability",
    subtitle: "Navigating the Rapids of Change",
    quote:
      "Adaptability is the decision to dance with change rather than be swept away by it.",
    descriptor:
      "Loss takes more than a person or a plan — it takes a version of you. Adaptability is finding the shape of who’s left.",
    image: {
      src: "/assets/framework/adaptability.jpg",
      alt: "Isometric illustration for Adaptability — a figure steering through moving water",
    },
  },
  {
    index: "03",
    title: "Optimism",
    subtitle: "Lighting the Path Through the Darkness",
    quote:
      "Optimism is not pretending the forest is a meadow. It is choosing to believe there is a way through.",
    descriptor:
      "Not forced positivity. A small, stubborn, renewable conviction that something good can still emerge.",
    image: {
      src: "/assets/framework/optimism.jpg",
      alt: "Isometric illustration for Optimism — a lantern lighting a dark path",
    },
  },
  {
    index: "04",
    title: "Support",
    subtitle: "Weaving a Net of Collective Strength",
    quote:
      "No one crosses any significant forest alone. Every great transformation was made possible by someone who stood beside the traveller when they could not stand by themselves.",
    descriptor:
      "Support flows both ways, or it doesn’t flow at all. Let people in — and let yourself be one of theirs.",
    image: {
      src: "/assets/framework/support.jpg",
      alt: "Isometric illustration for Support — hands forming a net of strength",
    },
  },
];

const path = [
  {
    index: "01",
    title: "Accept",
    subtitle: "Embracing the Inevitable",
    quote:
      "Acceptance is not surrender. It is the bridge between who you were before the loss and who you are still capable of becoming.",
    descriptor:
      "Not agreement that it was fair. Just an honest end to the fight against what already happened.",
    image: {
      src: "/assets/framework/accept.jpg",
      alt: "Isometric illustration for Accept — a bridge across a divide",
    },
  },
  {
    index: "02",
    title: "Reflect",
    subtitle: "Uncovering Insight From Grief",
    quote:
      "Reflection transforms pain into purpose — turning what happened to us into what we do with it.",
    descriptor:
      "Not rumination. The disciplined, sometimes uncomfortable practice of asking: what does this ask of me?",
    image: {
      src: "/assets/framework/reflect.jpg",
      alt: "Isometric illustration for Reflect — still water mirroring the sky",
    },
  },
  {
    index: "03",
    title: "Imagine",
    subtitle: "Defining the Path Forward",
    quote:
      "Bouncing Forward requires clear goals — specific, named destinations that organize every step that follows.",
    descriptor:
      "A vision has a name and a deadline. Give your loss somewhere to go.",
    image: {
      src: "/assets/framework/imagine.jpg",
      alt: "Isometric illustration for Imagine — a named destination on the horizon",
    },
  },
  {
    index: "04",
    title: "Action",
    subtitle: "Catalyzing Change Through Initiative",
    quote:
      "Turning vision into reality demands action. Not perfect action. Not fearless action. Just the next step, taken.",
    descriptor:
      "You will never feel fully ready. Begin anyway — the doing creates the readiness that waiting never will.",
    image: {
      src: "/assets/framework/action.jpg",
      alt: "Isometric illustration for Action — a first step taken on the path",
    },
  },
];

const tools = [
  {
    title: "The Taking Stock Inventory & Personal Action Plan",
    body: "An honest, eight-part inventory straight from the book — rate how brightly each Element is burning and how accessible each Step feels right now, then build a specific 30-day plan.",
    cta: { kind: "link" as const, href: "#begin-your-crossing", label: "Download free →" },
  },
  {
    title: "The Reflection Companion",
    body: "Every “Reflect On…” question from the book, organised by Element and Step. Pick one a week. No pressure, just honesty.",
    cta: { kind: "soon" as const, label: "Explore" },
  },
  {
    title: "The Compass & Path Check",
    body: "A short, honest check across all eight dimensions of the framework. See which lights are burning bright, and which need your attention.",
    cta: { kind: "link" as const, href: "/assess", label: "Take the assessment →" },
  },
];

function TryItFree({
  text,
  cta,
  className,
}: {
  text: string;
  cta: React.ReactNode;
  className?: string;
}) {
  return (
    <FadeIn>
      <div
        className={cn(
          "mt-10 flex flex-col gap-5 rounded-lg border border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8",
          className,
        )}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Try it free
          </p>
          <p className="mt-2 max-w-2xl leading-relaxed">{text}</p>
        </div>
        <div className="shrink-0">{cta}</div>
      </div>
    </FadeIn>
  );
}

export default function CompassAndPathPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                The Compass &amp; The Path
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
                Reading is understanding. Practice is crossing.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                A framework you only understand is just an idea. A framework you{" "}
                <em>use</em> becomes a way through. This is where Bouncing
                Forward stops being a book and starts being your own crossing —
                four elements to steady how you’re oriented, four steps to move
                you forward, and the tools to begin today.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8">
                <PrimaryCta
                  href="#begin-your-crossing"
                  label="Download the Free Taking Stock Inventory"
                />
              </div>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/framework/compass-lantern-stepping-stones.jpg"
              alt="Hands holding a lantern and compass above stepping stones leading across a dark forest floor toward light"
              width={1535}
              height={1024}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── The Framework ────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SlideUp>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                  The Framework
                </p>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                  Two tools. Not a formula.
                </h2>
              </SlideUp>
              <SlideUp delay={0.06}>
                <p className="mt-6 text-lg leading-relaxed">
                  Bouncing Forward ={" "}
                  <strong className="font-semibold">A Compass</strong> (which way
                  is forward){" "}
                  <strong className="font-semibold">+ A Path</strong> (how you
                  get there)
                </p>
              </SlideUp>
              <SlideUp delay={0.1}>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Not addition of convenience — dependence. A compass with no
                  path leaves you oriented and standing still, waiting for a
                  readiness that may never come. A path with no compass gets you
                  moving, but you can circle for years without knowing it.
                  Together, one gives you direction, the other gives you motion —
                  and that’s how a forest gets crossed.
                </p>
              </SlideUp>
              <SlideUp delay={0.14}>
                <blockquote className="mt-8 border-l-2 border-brand-accent pl-5 text-xl italic leading-relaxed sm:text-2xl">
                  The compass doesn’t tell you where you’re going. It tells you
                  which direction is forward — even when the trees are too dense
                  to see.
                </blockquote>
              </SlideUp>
            </div>
            <FadeIn delay={0.1}>
              <Image
                src="/assets/framework/diagram-compass-path.jpg"
                alt="The Bouncing Forward compass and path diagram: an outer ring of Resilience, Adaptability, Optimism and Support around an inner loop of Accept, Reflect, Imagine and Action"
                width={2000}
                height={2000}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="mx-auto w-full max-w-lg rounded-xl"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── How you're oriented — the 4-Element Compass ──────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            How You’re Oriented
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            The 4-Element Compass
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed">
            Life is marked by storms. Our identity isn’t shaped by the storm
            itself — it’s shaped by the choices we make while crossing it. These
            four elements aren’t a sequence. Think of them as four lights always
            burning inside you. The brighter you keep each one, the clearer your
            way forward.
          </p>
        </SlideUp>
        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {compass.map((c) => (
            <StaggerItem key={c.title} className="h-full">
              <NumberedCard {...c} headingLevel="h3" />
            </StaggerItem>
          ))}
        </Stagger>
        <TryItFree
          className="bg-muted"
          text="Try the 4-Element Compass in the free Taking Stock Inventory — a taste of these questions straight from the book."
          cta={<PrimaryCta href="#begin-your-crossing" label="Get the Free Inventory" />}
        />
      </section>

      {/* ── How you move — the 4-Step Path ───────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              How You Move
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              The 4-Step Path
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed">
              The compass opens your eyes. The path moves your feet. These four
              steps aren’t a formula and they don’t move in a straight line —
              least of all in grief. But they’re stepping stones: one foot in
              front of the other, with intention, rather than simply enduring.
            </p>
          </SlideUp>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {path.map((p) => (
              <StaggerItem key={p.title} className="h-full">
                <NumberedCard {...p} headingLevel="h3" />
              </StaggerItem>
            ))}
          </Stagger>
          <TryItFree
            className="bg-card"
            text="Explore the Reflection Companion — the “Reflect On…” prompts from every chapter, gathered in one place."
            cta={<ComingSoonCta label="Explore the Reflection Companion" />}
          />
        </div>
      </section>

      {/* ── Put it to work — three tools ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Put It to Work
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Three tools to begin
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">
            You don’t have to absorb all eight at once. Start with one of these.
          </p>
        </SlideUp>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {tools.map((t) => (
            <StaggerItem key={t.title} className="h-full">
              <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-bold leading-snug">{t.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t.body}
                </p>
                {t.cta.kind === "link" ? (
                  <Link
                    href={t.cta.href}
                    className="mt-5 inline-block font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {t.cta.label}
                  </Link>
                ) : (
                  <span className="mt-5 inline-block cursor-default font-[family-name:var(--font-display)] text-sm font-bold text-muted-foreground">
                    {t.cta.label} — Coming Soon
                  </span>
                )}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Begin Your Crossing capture ──────────────────────── */}
      <BeginYourCrossing showFaqLink />

      {/* ── Closing reflection (navy band) ───────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Which light has gone faint?
            </h2>
            <p className="mt-4 italic leading-relaxed text-primary-foreground/75">
              Noticing is the beginning of the practice.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <PrimaryCta
                href="/assess"
                label="Take the Compass &amp; Path Check"
                invert
              />
              <SecondaryCta
                href="#begin-your-crossing"
                label="Get the Free Inventory"
                invert
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
