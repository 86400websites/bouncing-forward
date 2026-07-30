import type { Metadata } from "next";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import { BeginYourCrossing } from "@/components/site/begin-your-crossing";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: { absolute: "Contact | Bouncing Forward" },
  description:
    "Questions about the book, the course, All In, or booking a workshop — write to us.",
  openGraph: {
    title: "Contact | Bouncing Forward",
    description:
      "Questions about the book, the course, All In, or booking a workshop — write to us.",
  },
};

/* Copy source: BF-Website-Copy-For-Sozana-2.docx — Contact (/contact), verbatim. */

const NEWSLETTER_HEADING = "Begin Your Next Chapter";
const NEWSLETTER_BODY =
  "The direction you need hasn’t disappeared — it’s waiting to be found. Get the free Taking Stock Inventory, plus a monthly note on finding your way forward.";

export default function ContactPage() {
  return (
    <>
      {/* ── Hero + form ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                Contact
              </p>
            </FadeIn>
            <SlideUp>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
                We’d like to hear from you.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                A question about the book, the course, or All In. A workshop
                enquiry for your organisation. A story you’re ready to share.
                Whatever brings you here — write to us.
              </p>
            </SlideUp>
          </div>
          <SlideUp delay={0.06}>
            <ContactForm />
          </SlideUp>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing heading={NEWSLETTER_HEADING} body={NEWSLETTER_BODY} />
    </>
  );
}
