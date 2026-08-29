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

const faqs: QA[] = [
  {
    q: "What is Bouncing Forward?",
    a: "A practical framework for anyone facing a setback, built by Maher Kaddoura from his own story. It gives you a way to move forward, not just cope: a Path to walk and a Compass to steer by.",
  },
  {
    q: "Is this therapy?",
    a: "No. Bouncing Forward is not a substitute for professional mental health care. It is a practical framework for moving forward, and it works alongside whatever support you already have.",
  },
  {
    q: "Where do I start?",
    a: "Start where you are. Free gets you the blog, the stories, the course introduction, the first chapter of the book, The First Week download and the two-minute Where\u2019s Here? check. When you are ready to commit, go All In \u2014 it is free, and the Full Assessment unlocks everything. Premium is the Book Package: the complete downloadable book and workbook, plus everything in All In.",
  },
  {
    q: "Where can I buy the book, and in which formats?",
    a: "The book is on Amazon as a Kindle ebook, an A5 hardcover and an A5 softcover, with the A4 workbook sold separately. You can read the first chapter free on Amazon. For the downloadable book and workbook together, choose the Book Package on the Premium page.",
  },
  {
    q: "Who is Maher Kaddoura?",
    a: "A civil engineer by training and a consultant by profession. He lost his son Hikmat in 2008 and turned that loss into the Hikmat Road Safety Program in Jordan and, later, into Bouncing Forward. The framework comes directly from what he learned walking it himself.",
  },
  {
    q: "What does the course cover?",
    a: "Nine modules, each with a short video from Maher and a worksheet. It walks you through the framework \u2014 the four questions, the Path and the Compass \u2014 and helps you build your own plan as you go. The course is included free in All In.",
  },
  {
    q: "What are the Path and the Compass?",
    a: "The Path is what you do: Accept, Reflect, Imagine, Act. The Compass is what you draw on while you do it: Resilience, Adaptability, Optimism and Support. The Path gets you moving. The Compass keeps you pointed forward.",
  },
  {
    q: "What is the two-minute check?",
    a: "Ten honest statements that show you where you stand on the Path right now. It is free, private and open to everyone. No one is keeping score. The Full Assessment inside All In adds the Compass and maps every strength and every step.",
  },
  {
    q: "Can I share my own story?",
    a: "Yes. If you have turned a hardship into a stepping stone, we would like to hear it. Use the contact form and tell us what happened and what you built from it. We feature new stories regularly.",
  },
  {
    q: "What will I find on the blog?",
    a: "Honest words for the hardest seasons: the things nobody tells you about loss, named plainly. New posts are added regularly, and they are free to read with no sign-up needed.",
  },
  {
    q: "What does All In cost, and how does it work?",
    a: "All In is free. Take the Full Assessment \u2014 twenty-four honest statements, about five minutes \u2014 and everything opens: the short version of the book, the nine-module course with worksheets, the 30-Day Journal, the Monthly Letter, the webinars and everything new as it lands. No payment, no subscription.",
  },
  {
    q: "What is the Book Package?",
    a: "The complete downloadable book and the downloadable companion workbook, for $9.99, with everything in All In included. You receive an access code by email, enter it on the Premium page, and everything opens: the book, the workbook, the Full Assessment, the course, the journal, the webinar library and the Monthly Letter. The code works on any device, any time.",
  },
  {
    q: "Do you offer Bouncing Forward for teams and organisations?",
    a: "Yes. Four formats, delivered by a trained facilitator: a 60-minute webinar, a 90-minute workshop, a half-day workshop and a four-week programme. Get in touch through the contact form, or see the Enterprise page.",
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
            Everything you might want to know about the framework, the three
            ways in, and how to begin. Still stuck?{" "}
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
        <Stagger className="divide-y divide-border border-t border-border">
          {faqs.map((item) => (
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
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
