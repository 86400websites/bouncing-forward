import type { Metadata } from "next";
import Image from "next/image";
import { SlideUp, FadeIn } from "@/components/motion/primitives";
import {
  PrimaryCta,
  SecondaryCta,
} from "@/components/site/begin-your-crossing";
import { WebinarRegistrationForm } from "@/components/webinar/registration-form";
import { isWebinarOver } from "@/lib/webinar";

/* Re-check hourly so the page flips to "has taken place" on its own. */
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  if (isWebinarOver()) {
    return {
      title: {
        absolute:
          "What's Your Next Move... When Life Changes? | Bouncing Forward",
      },
      description:
        "A live conversation with Heather Meyer, held on Wednesday 21 October 2026.",
      robots: { index: false },
    };
  }
  return {
    title: {
      absolute:
        "Register | What's Your Next Move... When Life Changes? | Bouncing Forward",
    },
    description:
      "A live conversation with Heather Meyer — Wednesday 21 October 2026, 10:00 and 19:00 SAST. Reserve your seat; we'll email your joining link closer to the day.",
    openGraph: {
      title:
        "What's your next move... when life changes? | A live conversation",
      description:
        "Wednesday 21 October 2026 · 10:00 and 19:00 SAST. Reserve your free seat.",
      images: ["/assets/webinar/bf-webinar-ad.png"],
    },
  };
}

/**
 * Webinar registration — the click-through destination for the social
 * ads (Heather's urgent brief, 5 Oct). Copy and fields verbatim from
 * her bf-webinar-registration.html; registrations flow to Mailchimp
 * via /api/webinar with session-specific tags only.
 */
export default function WebinarPage() {
  const over = isWebinarOver();
  return (
    <main>
      <section className="bg-muted">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          <SlideUp>
            <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
              Bouncing Forward · A live conversation
            </p>
            <h1 className="mt-4 text-4xl leading-tight font-extrabold sm:text-5xl">
              What’s your next move...
              <br />
              When life changes?
            </h1>
            <p className="mt-5 text-lg leading-relaxed">
              With <span className="font-bold">Heather Meyer</span>
            </p>
            <p className="text-muted-foreground mt-2 text-lg leading-relaxed">
              {over
                ? "Held on Wednesday 21 October 2026"
                : "21 October 2026 · 10:00 and 19:00 SAST"}
            </p>
            <div className="relative mx-auto mt-8 hidden w-full max-w-md overflow-hidden rounded-xl lg:block">
              <Image
                src="/assets/webinar/bf-webinar-ad.png"
                alt="What's your next move... when life changes? A live conversation with Heather Meyer — 21 October 2026, 10:00 and 19:00 SAST"
                width={810}
                height={1013}
                priority
                sizes="(min-width: 1024px) 28rem, 100vw"
                className="h-auto w-full"
              />
            </div>
          </SlideUp>
          <FadeIn>
            {over ? <WebinarEnded /> : <WebinarRegistrationForm />}
          </FadeIn>
        </div>
      </section>
    </main>
  );
}

/* Shown once the last session has ended (see WEBINAR_ENDS_AT). */
function WebinarEnded() {
  return (
    <div className="border-border bg-card rounded-xl border p-6 sm:p-8">
      <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
        This webinar has taken place
      </p>
      <h2 className="mt-3 text-2xl leading-tight font-extrabold sm:text-3xl">
        Thank you to everyone who joined us.
      </h2>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Registration for this session is now closed. Join the weekly note to
        hear first about the next live conversation.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <PrimaryCta href="/#begin-your-crossing" label="Join the weekly note" />
        <SecondaryCta href="/" label="Explore Bouncing Forward" />
      </div>
    </div>
  );
}
