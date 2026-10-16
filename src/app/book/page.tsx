import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  FadeIn,
  SlideUp,
  Stagger,
  StaggerItem,
} from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  PrimaryCta,
} from "@/components/site/begin-your-crossing";
import { NumberedCard } from "@/components/site/numbered-card";
import { AmazonFormats } from "@/components/site/amazon-formats";

export const metadata: Metadata = {
  title: { absolute: "The Book | Bouncing Forward by Maher Kaddoura" },
  description:
    "Not another book about moving on — four honest questions, in order, and a real story to walk them with.",
  openGraph: {
    title: "The Book | Bouncing Forward by Maher Kaddoura",
    description:
      "Not another book about moving on — four honest questions, in order, and a real story to walk them with.",
    images: ["/assets/book/cover-3d.jpeg"],
  },
};

/* Copy source: Bouncing_Forward_Website_Copy.docx — Page 2 (The Book), verbatim. */

const compass = [
  {
    index: "01",
    title: "Resilience",
    descriptor: "Weathering the storms of adversity",
    image: {
      src: "/assets/compass/Resilience.png",
      alt: "Resilience — bamboo bending in the wind",
    },
  },
  {
    index: "02",
    title: "Adaptability",
    descriptor: "Navigating the rapids of change",
    image: {
      src: "/assets/compass/Adaptabilit.png",
      alt: "Adaptability — a seedling within a cycle of arrows",
    },
  },
  {
    index: "03",
    title: "Optimism",
    descriptor: "Lighting the path through the darkness",
    image: {
      src: "/assets/compass/Optimism.png",
      alt: "Optimism — a rising sun",
    },
  },
  {
    index: "04",
    title: "Support",
    descriptor: "Weaving a net of collective strength",
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
    descriptor: "Embracing the inevitable",
    image: {
      src: "/assets/framework/accept.png",
      alt: "Isometric illustration for Accept — a bridge across a divide",
    },
  },
  {
    index: "02",
    title: "Reflect",
    descriptor: "Uncovering insight from a setback",
    image: {
      src: "/assets/framework/reflect.png",
      alt: "Isometric illustration for Reflect — still water mirroring the sky",
    },
  },
  {
    index: "03",
    title: "Imagine",
    descriptor: "Defining the path forward",
    image: {
      src: "/assets/framework/imagine.jpg",
      alt: "Isometric illustration for Imagine — a named destination on the horizon",
    },
  },
  {
    index: "04",
    title: "Act",
    descriptor: "Catalyzing change through initiative",
    image: {
      src: "/assets/framework/act.png",
      alt: "Isometric illustration for Act — a first step taken on the path",
    },
  },
];
export default function BookPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                The Book
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">
                Not another book about moving on.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                Most books about loss ask you to wait for time to help. This one
                asks a better question — what does this ask of me now? — and
                gives you a way to answer it, one step at a time.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/premium"
                  className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Buy the Book Package — $9.99
                </Link>
                <AmazonFormats />
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
              <p className="text-muted-foreground mt-1 text-sm">
                Want the downloadable book and workbook?{" "}
                <Link
                  href="/premium"
                  className="text-brand-accent-text font-semibold underline-offset-2 hover:underline"
                >
                  Buy the Book Package — $9.99
                </Link>
              </p>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/book/cover-3d.jpeg"
              alt="The Bouncing Forward book cover — a navy and blue title treatment with the leaf and knot logo mark"
              width={887}
              height={613}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="mx-auto w-full max-w-md rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── What's Inside ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SlideUp>
          <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
            What’s Inside
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold sm:text-4xl">
            The Path — and what it reveals.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">
            Built on the four questions everyone in a setback is already
            circling — put in order, as a Path with four steps.
          </p>
        </SlideUp>

        {/* The 4-Step Path */}
        <div className="mt-12">
          <SlideUp>
            <h3 className="text-lg font-bold sm:text-xl">
              The 4-Step Path{" "}
              <span className="text-muted-foreground font-normal">
                — How you move
              </span>
            </h3>
          </SlideUp>
          <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {path.map((p) => (
              <StaggerItem key={p.title} className="h-full">
                <NumberedCard {...p} iconClassName="bg-white" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Linking line: Path → Compass */}
        <FadeIn>
          <p className="mt-12 max-w-3xl text-lg leading-relaxed">
            Walking the Path draws on strengths you already carry. The book
            names them — that’s the Compass.
          </p>
        </FadeIn>

        {/* The 4-Element Compass */}
        <div className="mt-12">
          <SlideUp>
            <h3 className="text-lg font-bold sm:text-xl">
              The 4-Element Compass{" "}
              <span className="text-muted-foreground font-normal">
                — How you’re oriented
              </span>
            </h3>
          </SlideUp>
          <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {compass.map((c) => (
              <StaggerItem key={c.title} className="h-full">
                <NumberedCard {...c} iconClassName="bg-white" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
            The direction you’re looking for is already inside you.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PrimaryCta href="/all-in" label="Go All In" />
            <AmazonFormats />
          </div>
        </FadeIn>
      </section>

      {/* ── Begin Your Crossing (Book page copy) ─────────────── */}
      <BeginYourCrossing
        heading="Download your 7 Step Journal"
        body="Seven steps. Seven honest prompts. One small step at the end — free, downloadable, yours to keep. With it comes one note from us a month."
        submitLabel="Send me the 7 Step Journal"
        showFaqLink
      />
    </>
  );
}
