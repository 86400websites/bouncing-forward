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
import { FullAssessment } from "@/components/assess/full-assessment";
import { AllInLibrary } from "@/components/all-in/library";

export const metadata: Metadata = {
  title: { absolute: "All In | The Complete Bouncing Forward Experience" },
  description:
    "All In is free — take the Full Assessment, twenty-four honest statements in about five minutes, and everything opens: a summarized book and workbook, the course, the 30-Day Journal, the Monthly Letter, and the webinar library.",
  openGraph: {
    title: "All In | The Complete Bouncing Forward Experience",
    description:
      "All In is free — take the Full Assessment, twenty-four honest statements in about five minutes, and everything opens: a summarized book and workbook, the course, the 30-Day Journal, the Monthly Letter, and the webinar library.",
  },
};

/* Copy source: BF-Website-Copy-For-Sozana-2.docx — All In (/all-in), verbatim. */

const allInFeatures = [
  {
    title: "The full assessment",
    body: "24 Self-assessment questions with honest feedback and steps to keep you moving forward.",
    img: "/assets/all-in/assessment.png",
  },
  {
    title: "A summarized version of the book (electronic version)",
    body: "The framework behind everything else in the package.",
    img: "/assets/all-in/book.png",
  },
  {
    title: "The 30-Day Journal",
    body: "One page a day for a month. Small, steady prompts that help you find your footing.",
    img: "/assets/all-in/journal.png",
  },
  {
    title: "The Course",
    body: "The course with downloadable worksheets for every module — and new course material added to your account as it lands.",
    img: "/assets/all-in/course.png",
  },
  {
    title: "The Monthly Letter from Maher",
    body: "Written by Maher and delivered every month, exclusively to members. Practical tools you can put to work straight away. And every letter is stored for you, so when you need one again — this month’s or one from a year ago — it’s right where you left it.",
    img: "/assets/all-in/monthly-letter.png",
  },
  {
    title: "The Webinar Library",
    body: "Free access to every Bouncing Forward webinar. Each one is stored in your member library, so you can return to any session whenever you need it.",
    img: "/assets/all-in/webinar-library.png",
  },
];

export default function AllInPage() {
  return (
    <>
      {/* ── Hero (#a-inside) ─────────────────────────────────── */}
      <section
        id="a-inside"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
                All In — Everything, Together
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl leading-[1.1] font-extrabold sm:text-5xl">
                Commit to Bouncing Forward.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                All In is everything Bouncing Forward offers, in one place — and
                it’s free. A short version of the book and workbook, the
                nine-module course, the 30-Day Journal, a Monthly Letter, the
                webinars, and everything new as it lands.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed">
                How it works is simple: take the Full Assessment below —
                twenty-four honest statements, about five minutes — and
                everything opens. Your email once, your honest answers, and
                you’re all in.
              </p>
            </SlideUp>
            <SlideUp delay={0.16}>
              <div className="mt-8">
                <PrimaryCta
                  href="#full-assessment"
                  label="Take the Full Assessment"
                />
                <SecondaryCta
                  href="/premium"
                  label="Buy the Book Package — $9.99"
                />
              </div>
            </SlideUp>
          </div>
          <FadeIn delay={0.1}>
            <Image
              src="/assets/all-in/all-in-hero.png"
              alt="Everything included in All In — the book, the course, the journal and more, together"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full rounded-xl"
            />
          </FadeIn>
        </div>

        <FadeIn>
          <div className="border-border mt-16 border-t pt-12 text-center">
            <h2 className="mx-auto max-w-2xl text-2xl leading-tight font-extrabold sm:text-3xl">
              Everything the framework offers, in one place.
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg leading-relaxed">
              The complete course, every guide, every tool — open from day one,
              in whatever order your season asks for.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ── All In — free. Yours for life. (#a-included) ─────── */}
      <section className="bg-muted">
        <div
          id="a-included"
          className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
          <SlideUp>
            <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
              All In — free. Yours for life.
            </h2>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              All In gives you lifetime access — no annual membership renewal.
            </p>
            <p className="text-brand-accent-text mt-8 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.08em] uppercase">
              Everything in Free, plus:
            </p>
          </SlideUp>

          <Stagger className="mt-8 space-y-6">
            {allInFeatures.map((f) => (
              <StaggerItem key={f.title}>
                <div className="border-border bg-card grid gap-5 rounded-lg border p-6 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-8 sm:p-8">
                  <div className="bg-muted relative w-full overflow-hidden rounded-md pb-[75%] sm:pb-[100%]">
                    <Image
                      src={f.img}
                      alt={f.title}
                      fill
                      sizes="(min-width: 640px) 160px, 90vw"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{f.title}</h3>
                    <p className="text-muted-foreground mt-2 leading-relaxed">
                      {f.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn>
            <div className="mt-10">
              <PrimaryCta
                href="#full-assessment"
                label="Take the Full Assessment"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── The Full Assessment (#full-assessment) ───────────── */}
      <section>
        <div
          id="full-assessment"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
          <FullAssessment />
        </div>
      </section>

      {/* ── Your All In library (#library) ───────────────────── */}
      <section className="bg-muted">
        <div
          id="library"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
          <AllInLibrary />
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
