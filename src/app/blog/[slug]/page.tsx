import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn, SlideUp } from "@/components/motion/primitives";
import { BeginYourCrossing } from "@/components/site/begin-your-crossing";
import { POSTS, getPost } from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: { absolute: post.seoTitle },
    description: post.seoDescription,
    openGraph: {
      type: "article",
      title: post.seoTitle,
      description: post.seoDescription,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = POSTS.findIndex((p) => p.slug === post.slug);
  const previous = index > 0 ? POSTS[index - 1] : null;
  const next = index < POSTS.length - 1 ? POSTS[index + 1] : null;

  return (
    <>
      <article>
        {/* ── Post header ────────────────────────────────────── */}
        <header className="mx-auto max-w-3xl px-5 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
          <FadeIn>
            <Link
              href="/blog"
              className="text-brand-accent-text hover:text-foreground font-[family-name:var(--font-display)] text-sm font-bold transition-colors"
            >
              ← The Journal
            </Link>
          </FadeIn>
          <SlideUp>
            <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold sm:text-5xl">
              {post.title}
            </h1>
          </SlideUp>
          <SlideUp delay={0.06}>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed italic">
              {post.subtitle}
            </p>
          </SlideUp>
          <div className="bg-border mt-8 h-px w-full" />
        </header>

        {/* ── Post body ──────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          {post.blocks.map((block, i) => {
            switch (block.type) {
              case "h2":
                return (
                  <h2
                    key={i}
                    className="mt-10 text-2xl leading-tight font-extrabold sm:text-3xl"
                  >
                    {block.text}
                  </h2>
                );
              case "quote":
                return (
                  <blockquote
                    key={i}
                    className="border-brand-accent my-10 border-l-2 pl-5 text-xl leading-relaxed italic sm:text-2xl"
                  >
                    {block.text}
                  </blockquote>
                );
              case "image":
                /* Post images removed per brief — new simple images to come. */
                return null;
              case "closing":
                return (
                  <p
                    key={i}
                    className="border-border mt-10 border-t pt-8 text-lg leading-relaxed font-semibold"
                  >
                    {block.text}
                  </p>
                );
              default:
                return (
                  <p key={i} className="mt-5 text-lg leading-relaxed">
                    {block.text}
                  </p>
                );
            }
          })}
        </div>
      </article>

      {/* ── Previous / next ──────────────────────────────────── */}
      <nav aria-label="More posts" className="border-border bg-muted border-t">
        <div className="mx-auto grid max-w-3xl gap-6 px-5 py-12 sm:grid-cols-2 sm:px-6 lg:px-8">
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="group border-border bg-card focus-visible:outline-ring rounded-lg border p-5 transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <p className="text-muted-foreground text-xs font-bold tracking-[0.08em] uppercase">
                ← Previous
              </p>
              <p className="group-hover:text-brand-accent-text mt-2 leading-snug font-bold">
                {previous.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group border-border bg-card focus-visible:outline-ring rounded-lg border p-5 text-right transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <p className="text-muted-foreground text-xs font-bold tracking-[0.08em] uppercase">
                Next →
              </p>
              <p className="group-hover:text-brand-accent-text mt-2 leading-snug font-bold">
                {next.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>

      {/* ── Begin Your Crossing capture ──────────────────────── */}
      <BeginYourCrossing />
    </>
  );
}
