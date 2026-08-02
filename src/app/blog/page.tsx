import type { Metadata } from "next";
import Link from "next/link";
import {
  FadeIn,
  SlideUp,
  Stagger,
  StaggerItem,
} from "@/components/motion/primitives";
import { BeginYourCrossing } from "@/components/site/begin-your-crossing";
import { IllustrationPlaceholder } from "@/components/site/story-card";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: { absolute: "The Blog | Honest Words for the Hardest Seasons" },
  description:
    "The things nobody tells you about loss, named plainly — grief, the body, anniversaries, friendship, and finding your way forward.",
  openGraph: {
    title: "The Blog | Honest Words for the Hardest Seasons",
    description:
      "The things nobody tells you about loss, named plainly — grief, the body, anniversaries, friendship, and finding your way forward.",
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
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              The Blog
            </p>
          </FadeIn>
          <SlideUp>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
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
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-6 lg:px-8 sm:pb-20 lg:pb-24">
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <StaggerItem key={post.slug} className="h-full">
              <article className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="relative aspect-[16/9]">
                    <IllustrationPlaceholder />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-bold leading-snug group-hover:text-brand-accent-text">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm italic leading-relaxed text-muted-foreground">
                      {post.subtitle}
                    </p>
                    <span className="mt-4 font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text">
                      Read the post →
                    </span>
                  </div>
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
