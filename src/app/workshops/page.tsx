import type { Metadata } from "next";
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
  SecondaryCta,
} from "@/components/site/begin-your-crossing";

export const metadata: Metadata = {
  title: { absolute: "Business Workshops | Bouncing Forward" },
  description:
    "One framework, four depths of delivery — from a 60-minute first step to a four-week embedded journey. Practical, honest workshops for teams navigating setbacks at work.",
  openGraph: {
    title: "Business Workshops | Bouncing Forward",
    description:
      "One framework, four depths of delivery — from a 60-minute first step to a four-week embedded journey. Practical, honest workshops for teams navigating setbacks at work.",
  },
};

/* Copy source: BF-Website-Copy-Changes.docx — Workshops full rework, verbatim. */

const costs = [
  {
    title: "Engagement",
    body: "Effort quietly drops while attendance stays perfect.",
  },
  {
    title: "Retention",
    body: "Good people leave, often without ever saying why.",
  },
  {
    title: "Withdrawal",
    body: "The quiet stepping-back of your most reliable people.",
  },
];

const formats = [
  {
    name: "The 60-Minute Webinar",
    label: "The First Step",
    tagline: "For large audiences meeting the work for the first time.",
    rows: [
      "One 60-minute online session · groups of 20–80",
      "Every stage of the path touched once, live in the room",
      "Outcome: awareness and shared language — and one honest look at where each person stands",
      "Take-home: a single-page worksheet — the honest first question, and one chosen step",
    ],
    trade: "The trade: reach. First exposure, shared language, and proof that a path exists.",
  },
  {
    name: "The 90-Minute Workshop",
    label: "The Stepping Stone",
    tagline: "For lunch-and-learns, conference slots and community tasters.",
    rows: [
      "One 90-minute on-site session",
      "The full path walked once, out loud",
      "Outcome: the system used once — every participant leaves with a real, self-chosen step",
      "Take-home: participant workbook with a self-reflection section",
    ],
    trade: "The trade: proof. The path is used, not just heard.",
  },
  {
    name: "The Half-Day Workshop",
    label: "The Walk",
    tagline: "For team offsites, wellness days and retreat mornings.",
    rows: [
      "Four hours, including breaks",
      "Paired interviews, practical drills and commitments — practised in the room, not presented from the front",
      "Outcome: skills practice — teams rehearse every move together",
      "Take-home: participant workbook — Chapter 1 completed in the room, Chapter 2 continued at home",
    ],
    trade: "The trade: practice. Every move is made in the room, together.",
  },
  {
    name: "Four Weeks × 90 Minutes",
    label: "The Journey",
    tagline: "For embedded programmes, closed groups and sustained culture change.",
    rows: [
      "Four weekly 90-minute sessions, with spoken practice between them",
      "Weekly check-ins and bridge practices carry the work between sessions",
      "Outcome: embedded behaviour change — habits, peer support and measurable progress",
      "Take-home: four weekly workbooks, each with a Personal Journey section",
    ],
    trade: "The trade: depth. Habits settle in the weeks between sessions.",
  },
];

const isNotItems = [
  "A motivational talk.",
  "Nobody is told to stay positive.",
  "Nothing is promised that a workshop cannot deliver.",
];

export default function WorkshopsPage() {
  return (
    <>
      {/* ── Screen 1 — Hero ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                Workshops · For Organisations
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
                Your team is carrying more than you can see.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                Every organisation runs on people — and setbacks reach every one
                of them. Restructures. Losses. Disappointments. Change nobody
                chose. Most workplaces have no language for those seasons, so
                people carry them alone. Bouncing Forward gives your organisation
                both the language and the practice — an honest, practical
                framework your people walk, not just hear.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryCta href="/contact" label="Enquire About a Workshop →" />
                <SecondaryCta href="#formats" label="Explore the Formats" />
              </div>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/workshops/workshop-hero.png"
              alt="A facilitator leading a small team through the Accept, Reflect, Imagine, Action framework in a bright meeting room"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Screen 2 — Pull quote ────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-6 lg:px-8 sm:py-20">
          <FadeIn>
            <blockquote className="text-3xl font-extrabold leading-tight sm:text-4xl">
              “Setbacks don’t get the last word.”
            </blockquote>
            <p className="mt-4 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground/70">
              — Maher Kaddoura
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Screen 3 — The cost ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            The Cost No One Budgets For
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            It shows up where you can least afford it.
          </h2>
        </SlideUp>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {costs.map((c) => (
            <StaggerItem key={c.title} className="h-full">
              <div className="h-full rounded-lg border border-border bg-card p-6 sm:p-8">
                <h3 className="text-xl font-bold">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <FadeIn>
          <p className="mt-8 max-w-3xl text-lg italic leading-relaxed text-muted-foreground">
            None of these show up in a dashboard until it is too late to act.
          </p>
        </FadeIn>
      </section>

      {/* ── Screen 4 — What it is, and is not ────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Not a motivational talk.
            </h2>
          </SlideUp>
          <SlideUp delay={0.06}>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed">
              Created by Maher Kaddoura and grounded in his own experience of
              rebuilding after profound loss, Bouncing Forward is a framework your
              people walk, not just hear.
            </p>
          </SlideUp>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <FadeIn>
              <div className="h-full rounded-lg border border-border bg-card p-6 sm:p-8">
                <p className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                  It is not
                </p>
                <ul className="mt-4 space-y-2.5">
                  {isNotItems.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-border" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="h-full rounded-lg border border-brand-accent/40 bg-card p-6 sm:p-8">
                <p className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                  It is
                </p>
                <p className="mt-4 leading-relaxed">
                  Honest and practical. Accept where things stand, draw on what
                  you have already survived, name a believable way forward, and
                  take one small step that holds even when plans change. Practised
                  in the room, not presented from the front.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Screen 5 — The four formats ──────────────────────── */}
      <section
        id="formats"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24"
      >
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            One Framework, Four Depths
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Choose the depth your organisation needs.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Same framework. Same storyline. Four depths of delivery — designed as
            a ladder, not a menu of one-offs. Start light, see how your people
            respond, and scale from there.
          </p>
        </SlideUp>
        <Stagger className="mt-10 grid gap-6 lg:grid-cols-2">
          {formats.map((f, i) => (
            <StaggerItem key={f.name} className="h-full">
              <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 sm:p-8">
                <p className="font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text">
                  {String(i + 1).padStart(2, "0")} · {f.label}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold">{f.name}</h3>
                <p className="mt-2 italic text-muted-foreground">{f.tagline}</p>
                <ul className="mt-5 flex-1 space-y-3 border-t border-border pt-5">
                  {f.rows.map((r) => (
                    <li key={r} className="flex gap-3 leading-relaxed">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-border pt-4 font-semibold">
                  {f.trade}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Screen 6 — The storyline ─────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              Inside Every Format
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              One storyline: start with the Path. Reveal the Compass.
            </h2>
          </SlideUp>
          <div className="mt-6 space-y-4 text-lg leading-relaxed">
            <SlideUp delay={0.06}>
              <p>
                Whether your organisation chooses 60 minutes or four weeks, the
                same honest storyline runs underneath. It starts from where things
                truly stand — and moves forward from there.
              </p>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p>
                The Path is what you do: Accept, Reflect, Imagine, Act. The
                Compass is what you draw on: Resilience, Support, Optimism,
                Adaptability. It is never taught — it is revealed. We won’t spoil
                how.
              </p>
            </SlideUp>
          </div>
          <FadeIn>
            <p className="mt-8 border-l-2 border-brand-accent pl-5 text-xl italic leading-relaxed">
              Participants leave with one recognition: “you walked in carrying
              this.”
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Screen 7 — Logistics ─────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Built for Your Room
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            What this asks of you: a room, and your people.
          </h2>
        </SlideUp>
        <SlideUp delay={0.06}>
          <p className="mt-6 text-lg leading-relaxed">
            Every format is delivered on-site by a trained facilitator, with all
            workbooks, wall cards and session materials supplied. Pair, trio and
            whole-room work throughout — suited to intact teams or mixed groups.
            In-room exercises are short and quick; the deeper self-reflection is
            taken home to continue the journey. Many organisations begin with the
            free webinar or a single Stepping Stone session, see how their people
            respond, and scale from there.
          </p>
        </SlideUp>
      </section>

      {/* ── Screen 8 — Enquiry (closing CTA) ─────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <FadeIn>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              We’ll help you choose the right depth — honestly.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/85">
              Tell us about your team and what they are carrying, and we will
              recommend a starting point — including telling you if the lighter
              option is the better fit.
            </p>
            <div className="mt-8 flex justify-center">
              <PrimaryCta
                href="/contact"
                label="Bring Bouncing Forward to Your Team →"
                invert
              />
            </div>
            <p className="mt-8 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground/70">
              Bouncing Forward · Maher Kaddoura · Delivered in partnership with
              Alliance
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Newsletter (stays) ───────────────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
