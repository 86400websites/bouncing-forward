import type { Metadata } from "next";
import {
  FadeIn,
  SlideUp,
  Stagger,
  StaggerItem,
} from "@/components/motion/primitives";
import { BeginYourCrossing, PrimaryCta } from "@/components/site/begin-your-crossing";
import { IllustrationPlaceholder } from "@/components/site/story-card";

export const metadata: Metadata = {
  title: { absolute: "Grief Workshops for Organisations | Bouncing Forward" },
  description:
    "90-minute, half-day, and 4-week formats that give teams a shared language and a practical framework for loss in the workplace.",
  openGraph: {
    title: "Grief Workshops for Organisations | Bouncing Forward",
    description:
      "90-minute, half-day, and 4-week formats that give teams a shared language and a practical framework for loss in the workplace.",
  },
};

/* Copy source: BF-Website-Copy-For-Sozana-2.docx — Workshops (/workshops), verbatim. */

const NEWSLETTER_HEADING = "Begin Your Next Chapter";
const NEWSLETTER_BODY =
  "The direction you need hasn’t disappeared — it’s waiting to be found. Get the free Taking Stock Inventory, plus a monthly note on finding your way forward.";

const formats = [
  {
    title: "The 90-Minute Workshop",
    body: "The essentials of the Compass and the Path in a single session — enough to give a team the shared language, and each person one honest step to take.",
  },
  {
    title: "The Half-Day Workshop",
    body: "The full framework, worked through with exercises from the participant workbook — time to go deeper into each Element and each Step, together.",
  },
  {
    title: "The 4-Week Course",
    body: "Four sessions of 90 minutes, one per week — the framework walked at the pace real change actually takes, with practice between sessions and a workbook to keep.",
  },
];

export default function WorkshopsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
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
                Grief walks into the workplace every day. Give your people a way
                forward.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                Loss doesn’t stay home when someone comes to work — bereavement,
                retrenchment, diagnosis, divorce. The Bouncing Forward workshops
                give teams a shared language and a practical framework for the
                hardest seasons, facilitated with honesty and care.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8">
                <PrimaryCta href="/contact" label="Enquire About a Workshop →" />
              </div>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
              <IllustrationPlaceholder label="Workshops image coming soon" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Three formats ────────────────────────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
          <SlideUp>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              Three Formats
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Choose the depth your team needs.
            </h2>
          </SlideUp>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {formats.map((f) => (
              <StaggerItem key={f.title} className="h-full">
                <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 sm:p-8">
                  <h3 className="text-xl font-bold leading-snug">{f.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <SlideUp>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            How It Works
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Built for your room.
          </h2>
        </SlideUp>
        <SlideUp delay={0.06}>
          <p className="mt-6 text-lg leading-relaxed">
            Every workshop is facilitated by the Bouncing Forward team and shaped
            to your context — whether your organisation is navigating
            retrenchments, supporting a bereaved team, or simply building the
            kind of workplace where hard seasons don’t have to be hidden.
            Participants leave with the workbook, the Taking Stock Inventory, and
            a way forward that outlasts the session.
          </p>
        </SlideUp>
        <SlideUp delay={0.1}>
          <div className="mt-8">
            <PrimaryCta href="/contact" label="Enquire About a Workshop →" />
          </div>
        </SlideUp>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing heading={NEWSLETTER_HEADING} body={NEWSLETTER_BODY} />
    </>
  );
}
