import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn, SlideUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  ExternalCta,
} from "@/components/site/begin-your-crossing";
import { NumberedCard } from "@/components/site/numbered-card";
import { AMAZON_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "The Book | Bouncing Forward by Maher Kaddoura" },
  description:
    "Not another book about moving on — a practical framework for life after loss: four elements, four steps, one real story. Read the first chapter free.",
  openGraph: {
    title: "The Book | Bouncing Forward by Maher Kaddoura",
    description:
      "Not another book about moving on — a practical framework for life after loss: four elements, four steps, one real story. Read the first chapter free.",
  },
};

/* Copy source: Bouncing_Forward_Website_Copy.docx — Page 2 (The Book), verbatim. */

const compass = [
  {
    index: "01",
    title: "Resilience",
    descriptor: "Weathering the storms of adversity",
    image: {
      src: "/assets/framework/resilience-a.jpg",
      alt: "Isometric illustration for Resilience — bamboo bending in a storm",
    },
  },
  {
    index: "02",
    title: "Adaptability",
    descriptor: "Navigating the rapids of change",
    image: {
      src: "/assets/framework/adaptability.jpg",
      alt: "Isometric illustration for Adaptability — a figure steering through moving water",
    },
  },
  {
    index: "03",
    title: "Optimism",
    descriptor: "Lighting the path through the darkness",
    image: {
      src: "/assets/framework/optimism.jpg",
      alt: "Isometric illustration for Optimism — a lantern lighting a dark path",
    },
  },
  {
    index: "04",
    title: "Support",
    descriptor: "Weaving a net of collective strength",
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
    descriptor: "Embracing the inevitable",
    image: {
      src: "/assets/framework/accept.jpg",
      alt: "Isometric illustration for Accept — a bridge across a divide",
    },
  },
  {
    index: "02",
    title: "Reflect",
    descriptor: "Uncovering insight from grief",
    image: {
      src: "/assets/framework/reflect.jpg",
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
    title: "Action",
    descriptor: "Catalyzing change through initiative",
    image: {
      src: "/assets/framework/action.jpg",
      alt: "Isometric illustration for Action — a first step taken on the path",
    },
  },
];

const testimonials = [
  {
    quote:
      "I thought I had to choose between grieving and moving forward. This book showed me they’re the same motion.",
    name: "Reader name",
    role: "bereaved parent",
  },
  {
    quote:
      "I expected another book telling me time heals. Instead it gave me a direction to walk in while it does.",
    name: "Reader name",
    role: null,
  },
  {
    quote:
      "Honest, unsentimental, and useful. The Taking Stock Inventory got me writing again within a week.",
    name: "Reader name",
    role: null,
  },
  {
    quote:
      "It named the exact question I’d been avoiding — and then it handed me a way to answer it.",
    name: "Reader name",
    role: null,
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
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                The Book
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
                Not another book about moving on.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                Most books about loss ask you to accept it and wait for time to
                help. This one hands you a framework — four elements and four
                steps — to actively build a life from what’s left. Not advice to
                “stay strong.” A compass and a path for the forest you’re already
                standing in.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8">
                <ExternalCta href={AMAZON_URL} label="Buy on Amazon →" />
              </div>
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

      {/* ── The Promise ──────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              The Promise
            </h2>
          </SlideUp>
          <div className="mt-6 space-y-4 text-lg leading-relaxed">
            <SlideUp delay={0.04}>
              <p>
                They tell you time heals. They tell you to stay strong. They
                tell you it gets easier.
              </p>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p>
                What they don’t tell you is this: grief, faced alone and without
                direction, doesn’t get easier — it just gets quieter, and
                quieter isn’t the same as better. This book is the invitation to
                ask a different question. Not “why did this happen to me?” but
                “what does this ask of me now?”
              </p>
            </SlideUp>
            <SlideUp delay={0.12}>
              <p>
                Because the most dangerous thing about loss isn’t the pain
                itself. It’s letting the pain have the last word.
              </p>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ── What's Inside ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            What’s Inside
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Two tools. One way through.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">
            Everything in Bouncing Forward flows from a single idea:{" "}
            <strong className="font-semibold">
              you need a compass and a path.
            </strong>{" "}
            Four lights to show you the direction. Four steps to get you moving.
          </p>
        </SlideUp>

        {/* The 4-Element Compass */}
        <div className="mt-12">
          <SlideUp>
            <h3 className="text-lg font-bold sm:text-xl">
              The 4-Element Compass{" "}
              <span className="font-normal text-muted-foreground">
                — How you’re oriented
              </span>
            </h3>
          </SlideUp>
          <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {compass.map((c) => (
              <StaggerItem key={c.title} className="h-full">
                <NumberedCard {...c} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* The 4-Step Path */}
        <div className="mt-12">
          <SlideUp>
            <h3 className="text-lg font-bold sm:text-xl">
              The 4-Step Path{" "}
              <span className="font-normal text-muted-foreground">
                — How you move
              </span>
            </h3>
          </SlideUp>
          <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {path.map((p) => (
              <StaggerItem key={p.title} className="h-full">
                <NumberedCard {...p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <FadeIn>
          <p className="mt-12 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            And to put it to work from page one — the{" "}
            <strong className="font-semibold text-foreground">
              Taking Stock Inventory &amp; Personal Action Plan
            </strong>
            , the{" "}
            <strong className="font-semibold text-foreground">
              Reflection Companion
            </strong>
            , and the{" "}
            <strong className="font-semibold text-foreground">
              Compass &amp; Path Check
            </strong>
            .
          </p>
        </FadeIn>
      </section>

      {/* ── What Readers Say ─────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              What Readers Say
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Don’t just take our word for it.
            </h2>
          </SlideUp>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <StaggerItem key={i} className="h-full">
                <figure className="flex h-full flex-col rounded-lg border border-border bg-card p-6 sm:p-8">
                  <blockquote className="flex-1 text-lg italic leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 font-[family-name:var(--font-display)] text-sm font-bold text-muted-foreground">
                    — {t.name}
                    {t.role ? (
                      <span className="font-normal">, {t.role}</span>
                    ) : null}
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
          <FadeIn>
            <p className="mt-6 text-sm italic text-muted-foreground">
              Placeholder endorsements, written in the book’s voice — real
              reader quotes replace these before launch.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            The direction you’re looking for is already inside you.
          </h2>
          <div className="mt-8 flex justify-center">
            <ExternalCta href={AMAZON_URL} label="Buy on Amazon →" />
          </div>
        </FadeIn>
      </section>

      {/* ── Begin Your Crossing (Book page copy) ─────────────── */}
      <BeginYourCrossing
        body="Get the free Taking Stock Inventory and a monthly note on turning hardship into forward motion."
        showFaqLink
      />
    </>
  );
}
