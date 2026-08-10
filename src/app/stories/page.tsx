import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  PrimaryCta,
  SecondaryCta,
} from "@/components/site/begin-your-crossing";
import { StoriesGrid, type Story } from "@/components/site/stories-grid";

export const metadata: Metadata = {
  title: { absolute: "Stories of Bouncing Forward | Real People, Real Loss" },
  description:
    "From Cape Town to Rio to Ladakh — real people who turned devastation into direction, and found their best chapters still ahead.",
  openGraph: {
    title: "Stories of Bouncing Forward | Real People, Real Loss",
    description:
      "From Cape Town to Rio to Ladakh — real people who turned devastation into direction, and found their best chapters still ahead.",
  },
};

/* Copy source: Website_Rebrief_31_July_2026.docx — Stories (/stories), verbatim. */

const stories: Story[] = [
  {
    headline: "Buying Shoes Where Gangs Once Ruled",
    image: {
      src: "/assets/stories/story-1.png",
      alt: "Illustration — a pair of school shoes set down on a Cape Town street",
    },
    story:
      "He grew up in Manenberg, Cape Town, where gang membership was the only visible path to respect — a student nearly lost his life four times before finishing school. In 2010 he started Hope, buying school shoes for children who can’t afford them, and now walks back into the schools that once fed the gangs to show kids another road.",
    quote:
      "Resilience isn’t walking away from where you came from. It’s walking back in, on your own terms, to change what it once cost you.",
  },
  {
    headline: "Retrenched Into Her Real Career",
    image: {
      src: "/assets/stories/story-2.jpg",
      alt: "Illustration — a bright salon interior",
    },
    story:
      "Retrenched from a financial services job she found safe but dull, a woman with an entrepreneurial spirit opened a Sorbet salon and never looked back — then funded beauty-school tuition for her staff, half-grant and half-loan, so newcomers gain a stake in their own future, not just a job.",
    quote:
      "Adaptability is not becoming someone new. It’s finally becoming who you already were, and then turning around to help someone else do the same.",
  },
  {
    headline: "Building the Door Herself",
    image: {
      src: "/assets/stories/story-3.jpg",
      alt: "Illustration — a woman standing at an open doorway",
    },
    story:
      "When her daughter began regressing with autism, a clinic in a Rio favela told her the answer was simply to enrol the girl in school. She knew that wasn’t true — and went looking for real answers herself. What began as posts in a small online group is now a physical home supporting over 400 mothers across 160 communities.",
    quote:
      "Acceptance never meant giving up on her daughter. It meant facing exactly what was true, and building the door forward from there.",
  },
  {
    headline: "One Sewing Machine, One New Life",
    image: {
      src: "/assets/stories/story-4.jpg",
      alt: "Illustration — a sewing machine on a wooden table",
    },
    story:
      "On Christmas Eve 2004, in a village near Imphal, gunmen shot dead the husband of a young twenty-four year old woman. Days later a stranger gave her enough money for a sewing machine. That machine became the seed of the Manipur Women Gun Survivors Network, which has since helped hundreds of women left behind by violence find their footing.",
    quote:
      "Acceptance was never surrender. It was, hands on the machine, refusing to let the last thing that happened to her be the only thing that defined her.",
  },
  {
    headline: "The Thirty Dollars She Never Forgot",
    image: {
      src: "/assets/stories/story-5.jpg",
      alt: "Illustration — a maternity ward at dawn",
    },
    story:
      "Volunteering in a Cartagena maternity ward, a business woman watched a newborn die because his mother couldn’t afford thirty dollars in medicine. Days later, her own sixteen-month-old son died. In 2000 she founded a foundation in his name, now offering healthcare, schooling, and job training to thousands of teenage mothers.",
    quote:
      "Acceptance was never about making peace with what happened to her son. It was about refusing to let another mother lose a child over thirty dollars.",
  },
  {
    headline: "Staying Rooted at 14,000 Feet",
    image: {
      src: "/assets/stories/story-6.jpg",
      alt: "Illustration — terraced fields high in the mountains",
    },
    story:
      "Twelve when his father died, a young man inherited the family’s land in a Ladakhi village at 14,000 feet, where the soil is thin and most young men leave. He stayed. Now called Mitti Ka Aadmi — the man of the earth — he grows thirty crop varieties where agronomists said only barley could survive.",
    quote:
      "Adaptability was never about becoming someone new. It was about staying rooted, and asking the ground itself what it still had to give.",
  },
  {
    headline: "The Eviction That Never Came",
    image: {
      src: "/assets/stories/story-7.jpg",
      alt: "Illustration — a hillside neighbourhood among greenery",
    },
    story:
      "In 2006, authorities told 600 families in a São Paulo favela they’d need to leave to make way for a park. A young woman with determination to find a solution decided the conversation wasn’t over — leading her neighbours in greening and organising the favela itself, proving removal wasn’t the only route to renewal. The eviction never happened.",
    quote:
      "Imagining a future isn’t dreaming past your circumstances. It’s standing inside them and redesigning what’s possible from where you already are.",
  },
  {
    headline: "Built Stronger Where It Broke Him",
    image: {
      src: "/assets/stories/story-8.jpg",
      alt: "Illustration — a large wave rising toward a coastline",
    },
    story:
      "Nine years old when the 2004 tsunami stopped less than three kilometres from his home in Aceh — close enough to destroy his school. The wreckage he walked through as a boy became the reason he now works as an engineer in disaster preparedness, designing the resilient schools that might have saved more of what he lost.",
    quote:
      "Imagination isn’t escaping the disaster. It’s staring straight at it until you can see the thing that should exist instead.",
  },
  {
    headline: "A Smile That Never Left the Road",
    image: {
      src: "/assets/stories/story-9.jpg",
      alt: "A Smile that never ends",
    },
    story:
      "Their eleven-year-old daughter was killed in a road accident in Jaipur. They kept living, and then they built something — naming their road safety trust Muskaan, after their daughter, whose name meant smile. Over two decades on, it trains schoolchildren across Jaipur and runs campaigns with traffic police.",
    quote:
      "Legacy is not the opposite of loss. It’s what loss becomes when you refuse to let it end with you.",
  },
];

export default function StoriesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                Stories
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl leading-[1.1] font-extrabold sm:text-5xl">
                Loss doesn’t end your story. It’s where you find out what you’re
                building next.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                It’s one thing to read a framework. It’s another to meet someone
                who lived it — ordinary people who turned devastation into
                direction and found their best chapters still ahead.
              </p>
            </SlideUp>
            <SlideUp delay={0.12}>
              <p className="mt-4 max-w-xl text-lg leading-relaxed">
                None of them had luck. They had one honest decision: keep going.
                These stories are your permission to make the same one.
              </p>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/stories/stories-hero.jpg"
              alt="A traveller looking out over a wide landscape — real people who turned loss into direction"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Featured story ───────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SlideUp>
            <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
              Featured story
            </p>
          </SlideUp>
          <div className="mt-6 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SlideUp>
                <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
                  From a Hospital Corridor to a Road That Saves Lives
                </h2>
              </SlideUp>
              <div className="mt-6 space-y-4 text-lg leading-relaxed">
                <SlideUp delay={0.06}>
                  <p>
                    When Maher lost his son Hikmat to a hit-and-run in Amman,
                    his world split in two. There was a version of him that
                    wanted to disappear quietly into the pain.
                  </p>
                </SlideUp>
                <SlideUp delay={0.1}>
                  <p>
                    Instead, he asked a different question: How do I make this
                    better?
                  </p>
                </SlideUp>
                <SlideUp delay={0.14}>
                  <p>
                    That question became the Hikmat Road Safety Program — 1,200
                    playgrounds built, 260 schools made safer, 1,800 dangerous
                    locations identified across Jordan. It was acceptance in its
                    truest form: not giving up, but saying “This is where I am.
                    Now — what can I build from here?”
                  </p>
                </SlideUp>
              </div>
              <SlideUp delay={0.18}>
                <div className="mt-8">
                  <PrimaryCta href="/about" label="Read the Full Story →" />
                </div>
              </SlideUp>
            </div>
            <FadeIn delay={0.1}>
              <Image
                src="/assets/stories/hikmat-road-safety.jpg"
                alt="Illustration of the Hikmat Road Safety Program — children playing safely beside a marked road"
                width={1535}
                height={1024}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="w-full rounded-xl"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Story cards ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SlideUp>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            Tap a story to read it in full.
          </p>
        </SlideUp>
        <div className="mt-8">
          <StoriesGrid stories={stories} />
        </div>
      </section>

      {/* ── Your turn ────────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SlideUp>
            <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
              Your turn
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
              Have you bounced forward?
            </h2>
          </SlideUp>
          <SlideUp delay={0.06}>
            <p className="mt-6 text-lg leading-relaxed">
              Somewhere, someone is standing at the edge of the same forest you
              once stood at — wondering if there’s a way through. Your story
              might be the one that shows them there is.
            </p>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="mt-4 text-lg leading-relaxed">
              Tell us how you turned your hardship into a stepping stone. We
              feature new journeys regularly.
            </p>
          </SlideUp>
          <SlideUp delay={0.14}>
            <div className="mt-8 flex justify-center">
              <PrimaryCta href="/contact" label="Share Your Story →" />
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ── Closing (navy band) ──────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
              Every one of these people stood at the edge of the same forest.
            </h2>
            <p className="text-primary-foreground/85 mt-4 text-lg leading-relaxed">
              Then they found their own way through.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <PrimaryCta href="/assess" label="Take the Check →" invert />
              <SecondaryCta href="/book" label="Read the Book" invert />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
