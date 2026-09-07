import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Terms of Use | Bouncing Forward" },
  description:
    "The terms for using bouncing-forward.com — written to be read, not skipped.",
  openGraph: {
    title: "Terms of Use | Bouncing Forward",
    description:
      "The terms for using bouncing-forward.com — written to be read, not skipped.",
  },
  // Kept until the confirm-items below are settled (per the 4 Sep fix list).
  robots: { index: false, follow: false },
};

/** Accent-highlighted marker for details Heather/Maher must confirm. */
function Confirm({ children }: { children: React.ReactNode }) {
  return (
    <mark
      title="To confirm before launch"
      className="bg-brand-accent/25 text-foreground rounded-sm px-1 font-semibold"
    >
      {children}
    </mark>
  );
}

const h2 = "mt-10 text-xl font-extrabold leading-tight sm:text-2xl";
const p = "mt-4 leading-relaxed text-muted-foreground";
const ul =
  "mt-4 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground";

export default function TermsPage() {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
          Bouncing Forward
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-extrabold sm:text-5xl">
          Terms of Use
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Last updated: 4 September 2026
        </p>

        <p className={p}>
          These are the terms for using bouncing-forward.com and everything on
          it. By using the site you agree to them. They are written to be read,
          not skipped. If you have a question, write to
          info@bouncing-forward.com.
        </p>

        <h2 className={h2}>1. Who we are</h2>
        <p className={p}>
          Bouncing Forward is run by Maher Kaddoura and is part of Half a Life.{" "}
          <Confirm>Confirm legal entity name and country.</Confirm> When we say
          &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;, we mean
          Bouncing Forward.
        </p>

        <h2 className={h2}>2. What Bouncing Forward is, and is not</h2>
        <p className={p}>
          Bouncing Forward is a book, a framework and a set of tools to help
          people move forward after a setback. It is built on Maher&rsquo;s own
          experience.
        </p>
        <p className={p}>
          It is not therapy, counseling or medical care, and it is not a
          substitute for any of them. If you are in crisis or thinking of
          harming yourself, please contact a doctor, a crisis line or emergency
          services in your country now. Nothing on this site is a diagnosis or a
          treatment.
        </p>

        <h2 className={h2}>3. Free, All In and Premium</h2>
        <p className={p}>
          <strong>Free.</strong> The blog, the stories, the course introduction,
          the first chapter of the book, the 7 Step Journal and the two-minute
          Where&rsquo;s Here? check are free to everyone. No account is needed.
        </p>
        <p className={p}>
          <strong>All In.</strong> All In is free. It opens when you take the
          Full Assessment. Your answers stay on your device. All In content is
          for your personal use.
        </p>
        <p className={p}>
          <strong>Premium — the Book Package.</strong> The Book Package costs
          $9.99, paid once. It includes the complete downloadable book, the
          companion workbook and everything in All In, and it opens when you log
          in to your account. Prices are in US dollars and may change; the price
          shown at the time you buy is the price you pay.
        </p>
        <p className={p}>
          <strong>Printed books.</strong> The printed book and workbook are sold
          by Amazon under Amazon&rsquo;s own terms.
        </p>

        <h2 className={h2}>4. Your account</h2>
        <ul className={ul}>
          <li>
            You need an account to open the Book Package. You must give a real
            email address and keep your password to yourself.
          </li>
          <li>
            Your account is for you only. Do not share your login or the
            downloads with other people.
          </li>
          <li>
            You are responsible for what happens under your login. Tell us
            straight away if you think someone else is using it.
          </li>
          <li>We can close an account that breaks these terms.</li>
        </ul>

        <h2 className={h2}>5. Payments and refunds</h2>
        <p className={p}>
          Payment for the Book Package is taken by Stripe. We never see your
          card details.
        </p>
        <p className={p}>
          Because the Book Package is a download that opens immediately,{" "}
          <Confirm>
            choose one: &ldquo;we do not offer refunds once it has been
            opened&rdquo; / &ldquo;we offer a full refund within 14 days if you
            have not downloaded the book or workbook&rdquo;
          </Confirm>
          .
        </p>
        <p className={p}>
          If a payment goes through and the Book Package does not open, write to
          info@bouncing-forward.com and we will fix it or refund you.
        </p>

        <h2 className={h2}>6. What you may and may not do with our content</h2>
        <p className={p}>
          Everything on this site — the book, the workbook, the course videos,
          the journals, the letters, the assessments, the text and the pictures
          — belongs to Maher Kaddoura and Bouncing Forward and is protected by
          copyright.
        </p>
        <p className={p}>You may:</p>
        <ul className={ul}>
          <li>read, watch, download and print it for your own personal use;</li>
          <li>share a link to any page on the site;</li>
          <li>quote a short passage, with credit to Bouncing Forward.</li>
        </ul>
        <p className={p}>You may not:</p>
        <ul className={ul}>
          <li>
            copy, sell, rent, share or post the book, workbook, course, journals
            or letters, in whole or in part;
          </li>
          <li>
            use the Bouncing Forward name, the framework or the materials to run
            workshops, courses or programs without our written agreement (see
            Enterprise, or write to us);
          </li>
          <li>
            remove our name or copyright notice from anything you download.
          </li>
        </ul>

        <h2 className={h2}>7. Your story and what you send us</h2>
        <p className={p}>
          If you send us your story, a comment or a message, you keep ownership
          of it. You give us permission to use it on the site and in our
          materials, with your name if you agree, or without your name if you
          prefer. We will always ask before we publish a story. Please do not
          send us anything that belongs to someone else or that could harm
          another person.
        </p>

        <h2 className={h2}>8. Emails</h2>
        <p className={p}>
          When you sign up for the weekly note or the Monthly Letter, we will
          email you. You can stop at any time by clicking unsubscribe at the
          bottom of any email. See our Privacy Policy for how we handle your
          details.
        </p>

        <h2 className={h2}>9. Workshops and Enterprise</h2>
        <p className={p}>
          Workshops, webinars and programs for organizations are arranged
          separately, in writing, with their own dates, fees and terms. Nothing
          on the Enterprise page is a binding offer until we have agreed it with
          you.
        </p>

        <h2 className={h2}>10. Things we cannot promise</h2>
        <ul className={ul}>
          <li>
            We do our best to keep the site accurate and working, but we cannot
            promise it will always be available or free of mistakes.
          </li>
          <li>
            What you get from Bouncing Forward depends on you. We cannot promise
            a particular result.
          </li>
          <li>
            To the extent the law allows, we are not responsible for any loss
            that comes from using the site or relying on anything on it.
          </li>
          <li>
            Links to other sites are there to help you. We are not responsible
            for those sites.
          </li>
        </ul>

        <h2 className={h2}>11. Changes</h2>
        <p className={p}>
          We may update these terms. The date at the top will change when we do.
          If you keep using the site after that, the new terms apply.
        </p>

        <h2 className={h2}>12. The law that applies</h2>
        <p className={p}>
          These terms are governed by the laws of{" "}
          <Confirm>
            country — confirm with Maher, e.g. Jordan / United Kingdom / South
            Africa
          </Confirm>
          . If there is a dispute we cannot settle by talking, the courts of
          that country will decide it.
        </p>

        <h2 className={h2}>13. Contact</h2>
        <p className={p}>
          Questions about these terms: info@bouncing-forward.com
        </p>
      </div>
    </main>
  );
}
