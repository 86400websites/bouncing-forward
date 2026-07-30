import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FadeIn,
  SlideUp,
  Stagger,
  StaggerItem,
} from "@/components/motion/primitives";
import { AssessBlock } from "@/components/site/assess-block";
import {
  BeginYourCrossing,
  ExternalCta,
  PrimaryCta,
  SecondaryCta,
} from "@/components/site/begin-your-crossing";
import { IllustrationPlaceholder } from "@/components/site/story-card";
import { AMAZON_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Bouncing Forward | Grief Doesn’t Get the Last Word" },
  description:
    "A compass and a path for life after loss. The 4-Element Compass and 4-Step Path — built from a real story, for anyone facing their hardest chapter.",
};

/* Copy source: BF-Website-Copy-For-Sozana-2.docx — Home (/), verbatim. */

const whoBullets = [
  "You’ve been handed a loss you didn’t choose, and you’re tired of pretending you’re fine.",
  "You’re tired of empty comfort — “everything happens for a reason.”",
  "Something in you isn’t finished — you just don’t know where to start.",
  "You want a way forward, not a silver lining.",
];

const fourWays = [
  {
    title: "Learn",
    body: "Ten guided modules across the 4 Elements and 4 Steps — a short video, a companion guide, and your own plan as you go.",
    href: "/course",
    cta: "Start Learning →",
  },
  {
    title: "Practice",
    body: "The 4 Elements and 4 Steps, built for the middle of real life — not a classroom.",
    href: "/compass-and-path",
    cta: "Put It to Work →",
  },
  {
    title: "Assess",
    body: "Which lights are burning bright, and which have gone faint? Find out where you stand.",
    href: "/assess",
    cta: "Take the Check →",
  },
  {
    title: "Stories",
    body: "Real people, from Cape Town to Rio to Ladakh, who turned loss into direction.",
    href: "/stories",
    cta: "Meet Them →",
  },
];

const blogCards = [
  {
    slug: "losses-nobody-sends-flowers-for",
    title: "The Losses Nobody Sends Flowers For",
    standfirst:
      "Some grief arrives without a funeral, a card, or anyone acknowledging it happened.",
  },
  {
    slug: "when-there-is-no-goodbye",
    title: "When There Is No Goodbye",
    standfirst:
      "Grieving someone who is still here — and the loss that never quite finishes.",
  },
  {
    slug: "grief-is-not-a-staircase",
    title: "Grief Is Not a Staircase",
    standfirst:
      "Nobody moves through loss in a straight line. The line was never real.",
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
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
                Grief doesn’t get the last word.
              </h1>
            </SlideUp>
            <SlideUp delay={0.06}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                Loss isn’t the finish line. It’s the forest between who you were
                and who you’re capable of becoming.
              </p>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p className="mt-4 max-w-xl text-lg leading-relaxed">
                The 4-Element Compass. The 4-Step Path. Built from a real story,
                for anyone standing at the edge of their hardest chapter.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrimaryCta href="/assess" label="Start With One Question →" />
                <SecondaryCta href="/book" label="Read the Book" />
              </div>
              <p className="mt-3 text-sm italic text-muted-foreground">
                2nd edition coming soon.
              </p>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/home/hero-forest.jpg"
              alt="A traveller at the edge of a forest, light breaking through the trees ahead"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>
        <FadeIn>
          <figure className="mx-auto mt-12 max-w-3xl border-l-2 border-brand-accent pl-5">
            <blockquote className="text-lg italic leading-relaxed sm:text-xl">
              “Not going back to who you were. Going forward to who you are
              capable of becoming.”
            </blockquote>
            <figcaption className="mt-2 font-[family-name:var(--font-display)] text-sm font-bold text-muted-foreground">
              — Maher Kaddoura
            </figcaption>
          </figure>
        </FadeIn>
      </section>

      {/* ── Two tools ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SlideUp>
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                A Compass and a Path for the Hardest Seasons
              </h2>
            </SlideUp>
            <div className="mt-6 space-y-4 text-lg leading-relaxed">
              <SlideUp delay={0.06}>
                <p>
                  Most books help you survive loss. This one shows you where to
                  go next.
                </p>
              </SlideUp>
              <SlideUp delay={0.1}>
                <p>
                  The 4-Element Compass — Resilience, Adaptability, Optimism,
                  Support. Four lights that show you which way is forward.
                </p>
              </SlideUp>
              <SlideUp delay={0.14}>
                <p>
                  The 4-Step Path — Accept, Reflect, Imagine, Action. The
                  sequence that turns standing still into movement.
                </p>
              </SlideUp>
              <SlideUp delay={0.18}>
                <p>
                  One gives you direction. The other gives you motion. Together,
                  they take you into the next chapter.
                </p>
              </SlideUp>
            </div>
            <SlideUp delay={0.22}>
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
              src="/assets/framework/diagram-compass-path.jpg"
              alt="The Bouncing Forward compass and path diagram — Resilience, Adaptability, Optimism and Support around Accept, Reflect, Imagine and Action"
              width={2000}
              height={2000}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="mx-auto w-full max-w-lg rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Who is this for ──────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn className="order-last lg:order-first">
              <Image
                src="/assets/home/who-is-this-for.jpg"
                alt="A quiet, reflective human moment"
                width={1448}
                height={1086}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="w-full rounded-xl"
              />
            </FadeIn>
            <div>
              <SlideUp>
                <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
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
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-accent"
                      />
                      <p className="leading-relaxed">{b}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
              <SlideUp delay={0.1}>
                <div className="mt-8">
                  <ExternalCta
                    href={AMAZON_URL}
                    label="Read the First Chapter Free →"
                  />
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── Four ways to begin ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Choose Your Path
          </h2>
        </SlideUp>
        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fourWays.map((w) => (
            <StaggerItem key={w.title} className="h-full">
              <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
                <h3 className="text-xl font-bold">{w.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {w.body}
                </p>
                <Link
                  href={w.href}
                  className="mt-5 inline-block font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {w.cta}
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── From the blog ────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Honest words for the hardest seasons
            </h2>
          </SlideUp>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {blogCards.map((post) => (
              <StaggerItem key={post.slug} className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="relative aspect-[16/9]">
                    <IllustrationPlaceholder />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold leading-snug group-hover:text-brand-accent-text">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.standfirst}
                    </p>
                    <span className="mt-4 font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text">
                      Read the post →
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <FadeIn>
            <div className="mt-10">
              <PrimaryCta href="/blog" label="Read all posts →" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Assess block (shared navy pre-footer) ────────────── */}
      <AssessBlock />

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />

      {/* ── Closing reflection ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
            Take a moment. Ask yourself, honestly:
          </h2>
          <p className="mt-6 font-[family-name:var(--font-display)] text-3xl font-extrabold italic sm:text-4xl">
            Why did this happen?
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold italic sm:text-4xl">
            What does this ask of me?
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            You don’t need the answer to the first one. Only the courage to ask
            the second.
          </p>
        </FadeIn>
      </section>
    </>
  );
}
