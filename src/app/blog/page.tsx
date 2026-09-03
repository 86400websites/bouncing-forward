import type { Metadata } from "next";
import Link from "next/link";
import {
  FadeIn,
  SlideUp,
  Stagger,
  StaggerItem,
} from "@/components/motion/primitives";
import {
  BeginYourCrossing,
  PrimaryCta,
} from "@/components/site/begin-your-crossing";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: { absolute: "The Blog | Honest Words for the Hardest Seasons" },
  description:
    "The things nobody tells you about a setback, named plainly — the body, anniversaries, friendship, and finding your way forward.",
  openGraph: {
    title: "The Blog | Honest Words for the Hardest Seasons",
    description:
      "The things nobody tells you about a setback, named plainly — the body, anniversaries, friendship, and finding your way forward.",
  },
};

/* Copy source: Website_Rebrief_31_July_2026.docx — Blog index (/blog), verbatim. */

export default function BlogPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="max-w-3xl">
          <FadeIn>
            <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
              The Blog
            </p>
          </FadeIn>
          <SlideUp>
            <h1 className="mt-4 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">
              Honest words for the hardest seasons.
            </h1>
          </SlideUp>
          <SlideUp delay={0.08}>
            <p className="mt-6 text-lg leading-relaxed">
              No platforms, no performances — just the things nobody tells you
              about loss, named plainly. New posts regularly.
            </p>
          </SlideUp>
        </div>
      </section>

      {/* ── Posts (image + title + standfirst, clickable) ────── */}
      <section className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <StaggerItem key={post.slug} className="h-full">
              <article className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group border-border bg-card focus-visible:outline-ring flex h-full flex-col overflow-hidden rounded-lg border transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="group-hover:text-brand-accent-text text-lg leading-snug font-bold">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed italic">
                      {post.subtitle}
                    </p>
                    <span className="text-brand-accent-text mt-4 font-[family-name:var(--font-display)] text-sm font-bold">
                      Read the post →
                    </span>
                  </div>
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Go All In band ───────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
            Ready for everything?
          </h2>
          <p className="text-primary-foreground/80 mx-auto mt-3 max-w-xl">
            The Full Assessment, the course, the journal, the letters — all
            free, all open.
          </p>
          <div className="mt-8 flex justify-center">
            <PrimaryCta href="/all-in" label="Go All In" invert />
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
