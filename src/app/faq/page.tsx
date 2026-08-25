import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, SlideUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import { BeginYourCrossing } from "@/components/site/begin-your-crossing";

export const metadata: Metadata = {
  title: { absolute: "FAQ | Bouncing Forward" },
  description:
    "Answers to common questions about Bouncing Forward — the framework, free vs All In, the book, the course, and workshops for teams.",
  openGraph: {
    title: "FAQ | Bouncing Forward",
    description:
      "Answers to common questions about Bouncing Forward — the framework, free vs All In, the book, the course, and workshops for teams.",
  },
};

/* Copy source: Bouncing_Forward_FAQs.docx — verbatim. */

type QA = { q: string; a: React.ReactNode };

const groups: { heading: string; items: QA[] }[] = [
  {
    heading: "The basics",
    items: [
      {
        q: "What is Bouncing Forward?",
        a: "A framework and community for anyone facing a setback. It gives you a way to move forward, not just cope.",
      },
      {
        q: "Is this therapy?",
        a: "No. Bouncing Forward isn’t a substitute for professional mental health care. It’s a practical framework for moving forward.",
      },
      {
        q: "Do I need to have experienced something major to belong here?",
        a: "No. You don’t need a great loss to be here — you just need to be human. Setbacks come in every size.",
      },
      {
        q: "Is Bouncing Forward based on a book?",
        a: (
          <>
            Yes — it’s built around Maher Kaddoura’s book of the same name, and
            the framework (the Path and the Compass) comes directly from it. You
            can read more{" "}
            <Link
              href="/book"
              className="font-semibold text-brand-accent-text underline underline-offset-4 hover:text-foreground"
            >
              about the book
            </Link>
            .
          </>
        ),
      },
      {
        q: "Do I need to read the book first?",
        a: "No, but it is beneficial to read the book first to get maximum benefit from all the Bouncing Forward material.",
      },
    ],
  },
  {
    heading: "The framework",
    items: [
      {
        q: "What are the Path and the Compass?",
        a: "The Path is what you do: Accept, Reflect, Imagine, Act. The Compass is what you draw on while you do it: Resilience, Adaptability, Optimism, and Support.",
      },
      {
        q: "Can I do this on my own, or do I need a group?",
        a: "Both work. The workbooks are built for solo, self-paced use; the live workshops are for groups, facilitated.",
      },
      {
        q: "What does the course cover?",
        a: "The course covers Maher’s journey from loss to Bouncing Forward.",
      },
      {
        q: "What’s in the journal?",
        a: "The journal is a 30-day guided journal that walks you through a series of honest questions to help you reflect and move forward.",
      },
    ],
  },
  {
    heading: "Free, All In & payment",
    items: [
      {
        q: "What’s the difference between the free membership and All In?",
        a: "Free gets you The Two-Minute Check, the core content, and a way to start. All In unlocks the full framework, which includes the book, course, journal and everything else as it lands — for a single lifetime payment, not a subscription.",
      },
      {
        q: "What do I get with All In?",
        a: "An electronic copy of the book, the journal, the full course, a monthly letter, and access to everything we add going forward — for a lifetime.",
      },
      {
        q: "Is All In really a one-time payment?",
        a: "Yes — one payment, lifetime access. No recurring fees, no renewal.",
      },
      {
        q: "Is my payment a subscription or one-time?",
        a: "All In is a one-time payment.",
      },
    ],
  },
  {
    heading: "Getting started",
    items: [
      {
        q: "How do I get started?",
        a: (
          <>
            Sign up free by email, or go All In right away. Either way, start
            with{" "}
            <Link
              href="/assess"
              className="font-semibold text-brand-accent-text underline underline-offset-4 hover:text-foreground"
            >
              The Two-Minute Check
            </Link>{" "}
            — it honestly only takes two minutes and gives you a clear assessment
            of what your personal starting point is.
          </>
        ),
      },
    ],
  },
  {
    heading: "For teams & organisations",
    items: [
      {
        q: "Do you offer this for teams or organizations?",
        a: (
          <>
            We offer a 60-minute webinar, a 90-minute workshop, a 4-hour
            workshop, and a 4-weeks × 90-minutes workshop. Please get in touch
            through our{" "}
            <Link
              href="/contact"
              className="font-semibold text-brand-accent-text underline underline-offset-4 hover:text-foreground"
            >
              contact form
            </Link>
            , or see{" "}
            <Link
              href="/enterprise"
              className="font-semibold text-brand-accent-text underline underline-offset-4 hover:text-foreground"
            >
              Enterprise
            </Link>
            .
          </>
        ),
      },
      {
        q: "What workshop formats are available?",
        a: "A 60-minute webinar, a 90-minute session, a half-day workshop, and a 4-week course.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Questions & Answers
          </p>
        </FadeIn>
        <SlideUp>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
            Frequently asked questions
          </h1>
        </SlideUp>
        <SlideUp delay={0.06}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Everything you might want to know about the framework, membership,
            and how to begin. Still stuck?{" "}
            <Link
              href="/contact"
              className="font-semibold text-brand-accent-text underline underline-offset-4 hover:text-foreground"
            >
              Get in touch
            </Link>
            .
          </p>
        </SlideUp>
      </section>

      {/* ── Groups ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20">
        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.heading}>
              <SlideUp>
                <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                  {group.heading}
                </h2>
              </SlideUp>
              <Stagger className="mt-4 divide-y divide-border border-t border-border">
                {group.items.map((item) => (
                  <StaggerItem key={item.q}>
                    <details className="group py-2">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-[family-name:var(--font-display)] text-lg font-bold text-primary transition-colors hover:text-brand-accent-text [&::-webkit-details-marker]:hidden">
                        {item.q}
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="size-5 shrink-0 text-brand-accent-text transition-transform duration-200 group-open:rotate-45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </summary>
                      <div className="pb-4 pr-9 leading-relaxed text-muted-foreground">
                        {item.a}
                      </div>
                    </details>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
