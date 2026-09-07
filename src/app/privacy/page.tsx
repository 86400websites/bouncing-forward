import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | Bouncing Forward" },
  description:
    "What information Bouncing Forward collects, why, and what you can do about it — in plain English.",
  openGraph: {
    title: "Privacy Policy | Bouncing Forward",
    description:
      "What information Bouncing Forward collects, why, and what you can do about it — in plain English.",
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

export default function PrivacyPage() {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
          Bouncing Forward
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-extrabold sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Last updated: 4 September 2026
        </p>

        <p className={p}>
          Bouncing Forward is run by Maher Kaddoura and is part of Half a Life.
          This page explains what information we collect when you use
          bouncing-forward.com, why we collect it, and what you can do about it.
          We have kept it short and plain on purpose. If anything is unclear,
          write to us at info@bouncing-forward.com.
        </p>

        <h2 className={h2}>1. Who we are</h2>
        <p className={p}>
          The website is owned and operated by{" "}
          <Confirm>
            Half a Life / Maher Kaddoura — confirm legal entity name and country
          </Confirm>
          . When we say &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;,
          we mean Bouncing Forward. You can reach us at
          info@bouncing-forward.com.
        </p>

        <h2 className={h2}>2. What we collect, and why</h2>
        <p className={p}>
          We only collect what we need to give you what you asked for.
        </p>
        <p className={p}>
          <strong>The weekly note and the 7 Step Journal.</strong> When you give
          us your first name and email address, we use them to send you the 7
          Step Journal and the weekly note. That is all we use them for.
        </p>
        <p className={p}>
          <strong>All In.</strong> When you take the Full Assessment, your
          answers stay on your device. They are not sent to us and we never see
          them. We place a small file (a cookie) on your device so All In stays
          open on that device. We ask for your email address once, so we can
          send you one email with links to everything in All In, and to send you
          the Monthly Letter.
        </p>
        <p className={p}>
          <strong>Your account.</strong> If you create an account to log in, we
          store your email address and a password. We store the password in a
          form we cannot read. We use your account to open the Book Package and
          your All In library when you log in.
        </p>
        <p className={p}>
          <strong>Buying the Book Package.</strong> Payment is handled by
          Stripe. They collect your card details, not us. We receive your name,
          email address and a record that you paid, so we can open the Book
          Package in your account and send you a receipt.
        </p>
        <p className={p}>
          <strong>Contact form.</strong> When you write to us, we keep your
          name, email address and message so we can reply.
        </p>
        <p className={p}>
          <strong>Sharing your story.</strong> If you send us your story, we
          keep it and may contact you about it. We will not publish your story
          or your name without your clear permission.
        </p>
        <p className={p}>
          <strong>Site use.</strong> Like most websites, our hosting provider
          records basic technical details when you visit, such as your rough
          location, browser type and the pages you open. We do not use an
          analytics tool. This information does not tell us who you are.
        </p>

        <h2 className={h2}>3. What we do not do</h2>
        <ul className={ul}>
          <li>We do not sell your information. Ever.</li>
          <li>We do not rent or trade our email list.</li>
          <li>We do not send you anything you did not ask for.</li>
          <li>
            We do not see your assessment answers. They stay on your device.
          </li>
        </ul>

        <h2 className={h2}>4. Who we share it with</h2>
        <p className={p}>
          We share your information only with the companies that help us run the
          site, and only so they can do that job:
        </p>
        <ul className={ul}>
          <li>
            <strong>Mailchimp</strong> sends the weekly note and the Monthly
            Letter.
          </li>
          <li>
            <strong>Stripe</strong> handles payments for the Book Package.
          </li>
          <li>
            <strong>Vercel</strong> hosts the website.
          </li>
          <li>
            <strong>Amazon.</strong> If you click a link to buy the printed
            book, you leave our site and Amazon&rsquo;s own privacy policy
            applies.
          </li>
        </ul>
        <p className={p}>
          We may also share information if the law requires us to.
        </p>

        <h2 className={h2}>5. Cookies</h2>
        <p className={p}>We use a small number of cookies:</p>
        <ul className={ul}>
          <li>
            A cookie that keeps All In open on your device after you take the
            Full Assessment.
          </li>
          <li>A cookie that keeps you logged in to your account.</li>
        </ul>
        <p className={p}>
          You can delete cookies at any time in your browser settings. If you
          delete them, you may need to take the Full Assessment again or log in
          again.
        </p>

        <h2 className={h2}>6. How long we keep it</h2>
        <ul className={ul}>
          <li>
            Weekly note and Monthly Letter lists: until you unsubscribe. Every
            email has an unsubscribe link at the bottom.
          </li>
          <li>Your account: until you ask us to delete it.</li>
          <li>
            Payment records: for as long as tax and accounting rules require.
          </li>
          <li>
            Contact messages and stories: for as long as we need them to reply
            to you or to feature your story, if you have agreed to that.
          </li>
        </ul>

        <h2 className={h2}>7. Your rights</h2>
        <p className={p}>You can ask us, at any time, to:</p>
        <ul className={ul}>
          <li>tell you what information we hold about you;</li>
          <li>correct it;</li>
          <li>delete it;</li>
          <li>
            stop sending you emails (or just click unsubscribe in any email).
          </li>
        </ul>
        <p className={p}>
          Write to info@bouncing-forward.com and we will reply{" "}
          <Confirm>within 30 days — confirm</Confirm>. Depending on where you
          live, you may have further rights under local privacy law, and we will
          respect them.
        </p>

        <h2 className={h2}>8. Keeping it safe</h2>
        <p className={p}>
          We take reasonable steps to protect your information. Passwords are
          stored in a form we cannot read, and payments are handled by a
          specialist provider. No website can promise complete security, but we
          do our best and we will tell you if something goes wrong with your
          information.
        </p>

        <h2 className={h2}>9. Children</h2>
        <p className={p}>
          Bouncing Forward is written for adults. We do not knowingly collect
          information from anyone under 18. If you think a child has given us
          their details, tell us and we will delete them.
        </p>

        <h2 className={h2}>10. Links to other sites</h2>
        <p className={p}>
          Our site links to other sites, such as Amazon and YouTube. Those sites
          have their own privacy policies. We are not responsible for what they
          do with your information.
        </p>

        <h2 className={h2}>11. Changes to this policy</h2>
        <p className={p}>
          If we change this policy, we will change the date at the top of this
          page. If the change is important, we will tell you by email.
        </p>

        <h2 className={h2}>12. Contact</h2>
        <p className={p}>Questions about privacy: info@bouncing-forward.com</p>
      </div>
    </main>
  );
}
