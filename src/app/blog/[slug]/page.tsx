import type { Metadata } from "next";
import Image from "next/image";
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
              className="font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text transition-colors hover:text-foreground"
            >
              ← The Journal
            </Link>
          </FadeIn>
          <SlideUp>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
              {post.title}
            </h1>
          </SlideUp>
          <SlideUp delay={0.06}>
            <p className="mt-4 text-lg italic leading-relaxed text-muted-foreground">
              {post.subtitle}
            </p>
          </SlideUp>
          <div className="mt-8 h-px w-full bg-border" />
        </header>

        {/* ── Hero image ─────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl px-5 pt-10 sm:px-6 lg:px-8">
          <div className="relative w-full overflow-hidden rounded-lg border border-border pb-[66.6667%]">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 48rem, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* ── Post body ──────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl px-5 pb-16 sm:px-6 lg:px-8 sm:pb-20 lg:pb-24">
          {post.blocks.map((block, i) => {
            switch (block.type) {
              case "h2":
                return (
                  <h2
                    key={i}
                    className="mt-10 text-2xl font-extrabold leading-tight sm:text-3xl"
                  >
                    {block.text}
                  </h2>
                );
              case "quote":
                return (
                  <blockquote
                    key={i}
                    className="my-10 border-l-2 border-brand-accent pl-5 text-xl italic leading-relaxed sm:text-2xl"
                  >
                    {block.text}
                  </blockquote>
                );
              case "image":
                return block.src ? (
                  <figure key={i} className="my-10">
                    <div className="relative w-full overflow-hidden rounded-lg border border-border pb-[66.6667%]">
                      <Image
                        src={block.src}
                        alt={block.text}
                        fill
                        sizes="(min-width: 768px) 48rem, 100vw"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-3 text-center text-sm italic text-muted-foreground">
                      {block.text}
                    </figcaption>
                  </figure>
                ) : null;
              case "closing":
                return (
                  <p
                    key={i}
                    className="mt-10 border-t border-border pt-8 text-lg font-semibold leading-relaxed"
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
      <nav
        aria-label="More posts"
        className="border-t border-border bg-muted"
      >
        <div className="mx-auto grid max-w-3xl gap-6 px-5 py-12 sm:grid-cols-2 sm:px-6 lg:px-8">
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="group rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                ← Previous
              </p>
              <p className="mt-2 font-bold leading-snug group-hover:text-brand-accent-text">
                {previous.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group rounded-lg border border-border bg-card p-5 text-right transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                Next →
              </p>
              <p className="mt-2 font-bold leading-snug group-hover:text-brand-accent-text">
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
