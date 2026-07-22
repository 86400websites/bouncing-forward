import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn, SlideUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  ComingSoonCta,
  PrimaryCta,
  SecondaryCta,
} from "@/components/site/begin-your-crossing";
import {
  IllustrationPlaceholder,
  StoryCard,
} from "@/components/site/story-card";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Real people — not famous, not public figures by trade — who turned devastation into direction. These stories are the permission to make yours.",
};

/* Copy source: Bouncing_Forward_Website_Copy.docx — Page 5 (Stories), verbatim. */

const stories = [
  {
    category: "Compass · Resilience",
    title: "Buying Shoes Where Gangs Once Ruled",
    name: "Sebastian Haricombe",
    country: "South Africa",
    excerpt:
      "Grew up in Manenberg, Cape Town, where gang membership was the only visible path to respect — and nearly lost his life four times before finishing school. In 2010 he started Hope, buying school shoes for children who can’t afford them, and now walks back into the schools that once fed the gangs to show kids another road.",
    closing:
      "Resilience isn’t walking away from where you came from. It’s walking back in, on your own terms, to change what it once cost you.",
    image: {
      src: "/assets/stories/sebastian-shoes.jpg",
      alt: "Isometric illustration — a pair of school shoes on a township road",
    },
  },
  {
    category: "Compass · Adaptability & Support",
    title: "Retrenched Into Her Real Career",
    name: "Monica Haralambous",
    country: "South Africa",
    excerpt:
      "Retrenched from a financial services job she found safe but dull, she opened a Sorbet salon and never looked back — then funded beauty-school tuition for her staff, half-grant and half-loan, so newcomers gain a stake in their own future, not just a job.",
    closing:
      "Adaptability is not becoming someone new. It’s finally becoming who you already were, and then turning around to help someone else do the same.",
    image: {
      src: "/assets/stories/monica-salon.jpg",
      alt: "Isometric illustration — an open salon door and mirror",
    },
  },
  {
    category: "Path · Imagine",
    title: "The Contract Signed in a Windowless Room",
    name: "Yan Hongchang",
    country: "China",
    excerpt:
      "In 1978, in a Chinese village one bad season from starvation, eighteen farmers — Yan among them — secretly signed a contract that was a crime under the law of the time, dividing collective land so each family kept its own harvest. Within a year, production rose sixfold — the seed of China’s agricultural reforms.",
    closing:
      "Imagination sometimes looks like eighteen ordinary people in a windowless room, willing to risk everything for a harvest they hadn’t yet grown.",
    image: {
      src: "/assets/stories/yan-farming-contract.jpg",
      alt: "Isometric illustration — a lantern-lit table with a handwritten contract",
    },
  },
  {
    category: "Compass · Support",
    title: "The Café That Redefined Capable",
    name: "Ashaita Mahajan",
    country: "India",
    excerpt:
      "Watched her cousin Aarti, who has autism, struggle to find a Mumbai workplace willing to see her as capable rather than as a diagnosis — and left a good career to fix it. With her aunt, she built Café Arpan, staffed entirely by adults with intellectual and developmental disabilities, running the counter, not tucked in the back.",
    closing:
      "Support isn’t standing beside someone. It’s building the room they were never given a seat in — and then stepping back so they can run it.",
    image: {
      src: "/assets/stories/ashaita-cafe.jpg",
      alt: "Isometric illustration — a café counter with a cup and saucer",
    },
  },
  {
    category: "Path · Accept",
    title: "Building the Door Herself",
    name: "Rafaela Figueiredo de França",
    country: "Brazil",
    excerpt:
      "When her daughter Maria began regressing with autism, a clinic in a Rio favela told her the answer was simply to enrol the girl in school. She knew that wasn’t true — and went looking for real answers herself. What began as posts in a small online group is now a physical home supporting over 400 mothers across 160 communities.",
    closing:
      "Acceptance never meant giving up on Maria. It meant facing exactly what was true, and building the door forward from there.",
    image: {
      src: "/assets/stories/rafaela-door.jpg",
      alt: "Isometric illustration — a doorway and a mother and child’s hands",
    },
  },
  {
    category: "Path · Accept",
    title: "One Sewing Machine, One New Life",
    name: "Rebika Akham",
    country: "India",
    excerpt:
      "On Christmas Eve 2004, in a village near Imphal, gunmen shot dead the husband of twenty-four-year-old Rebika. Days later a stranger gave her enough money for a sewing machine. That machine became the seed of the Manipur Women Gun Survivors Network, which has since helped hundreds of women left behind by violence find their footing.",
    closing:
      "Acceptance was never surrender. It was Rebika, hands on the machine, refusing to let the last thing that happened to her be the only thing that defined her.",
    image: {
      src: "/assets/stories/rebika-sewing.jpg",
      alt: "Isometric illustration — a sewing machine and thread",
    },
  },
  {
    category: "Path · Accept & Legacy",
    title: "The Thirty Dollars She Never Forgot",
    name: "Catalina Escobar",
    country: "Colombia",
    excerpt:
      "Volunteering in a Cartagena maternity ward, Catalina watched a newborn die because his mother couldn’t afford thirty dollars in medicine. Days later, her own sixteen-month-old son died. In 2000 she founded a foundation in his name, now offering healthcare, schooling, and job training to thousands of teenage mothers.",
    closing:
      "Acceptance was never about making peace with what happened to Juan Felipe. It was about refusing to let another mother lose a child over thirty dollars.",
    image: {
      src: "/assets/stories/catalina-nurse.jpg",
      alt: "Isometric illustration — a hospital bassinet beside a small lantern",
    },
  },
  {
    category: "Compass · Adaptability & Reflect",
    title: "Staying Rooted at 14,000 Feet",
    name: "Urgain Phuntsog",
    country: "India",
    excerpt:
      "Twelve when his father died, he inherited the family’s land in a Ladakhi village at 14,000 feet, where the soil is thin and most young men leave. He stayed. Now called Mitti Ka Aadmi — the man of the earth — he grows thirty crop varieties where agronomists said only barley could survive.",
    closing:
      "Adaptability was never about becoming someone new. It was about staying rooted, and asking the ground itself what it still had to give.",
    image: null,
  },
  {
    category: "Path · Imagine & Action",
    title: "The Eviction That Never Came",
    name: "Maria de Lourdes Andrade Silva (“Lia Esperança”)",
    country: "Brazil",
    excerpt:
      "In 2006, authorities told 600 families in a São Paulo favela they’d need to leave to make way for a park. Lia decided the conversation wasn’t over — leading her neighbours in greening and organising the favela itself, proving removal wasn’t the only route to renewal. The eviction never happened.",
    closing:
      "Imagining a future isn’t dreaming past your circumstances. It’s standing inside them and redesigning what’s possible from where you already are.",
    image: null,
  },
  {
    category: "Compass · Adaptability & Imagine",
    title: "Built Stronger Where It Broke Him",
    name: "Rifqi Irvansyah",
    country: "Indonesia",
    excerpt:
      "Nine years old when the 2004 tsunami stopped less than three kilometres from his home in Aceh — close enough to destroy his school. The wreckage he walked through as a boy became the reason he now works as an engineer in disaster preparedness, designing the resilient schools that might have saved more of what he lost.",
    closing:
      "Imagination isn’t escaping the disaster. It’s staring straight at it until you can see the thing that should exist instead.",
    image: null,
  },
  {
    category: "Path · Action & Legacy",
    title: "A Smile That Never Left the Road",
    name: "Mridul & Pramod Bhargava",
    country: "India",
    excerpt:
      "Their eleven-year-old daughter Durva was killed in a road accident in Jaipur. They kept living, and then they built something — naming their road safety trust Muskaan, after their daughter, whose name meant smile. Over two decades on, it trains schoolchildren across Jaipur and runs campaigns with traffic police.",
    closing:
      "Legacy is not the opposite of loss. It’s what loss becomes when you refuse to let it end with you.",
    image: null,
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
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                Stories
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
                Loss doesn’t end your story. It’s where you find out what you’re
                building next.
              </h1>
            </SlideUp>
            <div className="mt-6 space-y-4 text-lg leading-relaxed">
              <SlideUp delay={0.06}>
                <p>
                  It’s one thing to read a framework. It’s another to meet
                  someone who lived it. These are real people — not famous, not
                  public figures by trade — who turned devastation into
                  direction: a gang-scarred township, a Rio favela, a Ladakhi
                  mountain village, a Rwandan genocide, a Mumbai café counter.
                </p>
              </SlideUp>
              <SlideUp delay={0.1}>
                <p>
                  Everywhere you look, there are people who are not{" "}
                  <em>finished</em> by what happened to them. They are{" "}
                  <strong className="font-semibold">unfinished</strong> —
                  unfinished purpose, unfinished contribution, unfinished
                  forward motion.
                </p>
              </SlideUp>
              <SlideUp delay={0.14}>
                <p>
                  What they had wasn’t luck. It was one honest decision to keep
                  crossing. These stories are the permission to make yours.
                </p>
              </SlideUp>
            </div>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/home/compass-stepping-stones.jpg"
              alt="A person seated outdoors holding a compass, looking out over mountains and a pine forest"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Where it began — featured story ──────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SlideUp>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                  Where It Began — Featured Story
                </p>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                  From a Hospital Corridor to a Road That Saves Lives
                </h2>
              </SlideUp>
              <div className="mt-6 space-y-4 leading-relaxed">
                <SlideUp delay={0.06}>
                  <p>
                    When Maher lost his son Hikmat to a hit-and-run in Amman, his
                    world split in two. There was a version of him that wanted to
                    disappear quietly into the grief.
                  </p>
                </SlideUp>
                <SlideUp delay={0.1}>
                  <p>
                    Instead, he asked a different question:{" "}
                    <em>How do I make this better?</em>
                  </p>
                </SlideUp>
                <SlideUp delay={0.14}>
                  <p>
                    That question became the Hikmat Road Safety Program — 1,200
                    playgrounds built, 260 schools made safer, 1,800 dangerous
                    locations identified across Jordan. It was acceptance in its
                    truest form: not giving up, but saying{" "}
                    <em>
                      “This is where I am. Now — what can I build from here?”
                    </em>
                  </p>
                </SlideUp>
                <SlideUp delay={0.18}>
                  <p>
                    It’s the same question this book, and this framework, asks of
                    you.
                  </p>
                </SlideUp>
              </div>
              <SlideUp delay={0.22}>
                <div className="mt-8">
                  <PrimaryCta href="/about" label="Read the Full Story →" />
                </div>
              </SlideUp>
            </div>
            <FadeIn delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
                <IllustrationPlaceholder label="Featured image coming soon" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── More journeys ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            More Journeys
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            People who bounced forward
          </h2>
        </SlideUp>
        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <StaggerItem key={s.title} className="h-full">
              <StoryCard {...s} />
            </StaggerItem>
          ))}
        </Stagger>
        <FadeIn>
          <p className="mt-6 text-sm italic text-muted-foreground">
            Four illustrations (Urgain, Lia Esperança, Rifqi, the Bhargavas) are
            still being commissioned — shown as placeholders until they land.
          </p>
        </FadeIn>
      </section>

      {/* ── Your turn — share your story ─────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <SlideUp>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                Your Turn
              </p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                Have you bounced forward?
              </h2>
            </SlideUp>
            <SlideUp delay={0.06}>
              <p className="mt-6 leading-relaxed">
                Somewhere, someone is standing at the edge of the same forest you
                once stood at — wondering if there’s a way through. Your story
                might be the one that shows them there is.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Tell us how you turned your hardship into a stepping stone. We
                feature new journeys regularly.
              </p>
            </SlideUp>
            <SlideUp delay={0.1}>
              <div className="mt-8 flex justify-center">
                <ComingSoonCta label="Share Your Story" />
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ── Closing reflection (navy band) ───────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Every one of these people stood at the edge of the same forest.
            </h2>
            <p className="mt-4 italic leading-relaxed text-primary-foreground/75">
              Then they found their own way through.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <PrimaryCta
                href="/assess"
                label="Take the Compass &amp; Path Check"
                invert
              />
              <SecondaryCta href="/book" label="Read the Book" invert />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Begin Your Crossing capture ──────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
