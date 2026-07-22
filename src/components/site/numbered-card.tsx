import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The signature numbered 01–04 framework unit (DESIGN.md §6).
 *
 * Shared by The Book (sprint 4) and The Compass & The Path (sprint 5):
 * number in Archivo 800 · illustration · heading · optional italic book
 * quote (with hairline accent rule) · one plain line.
 *
 * Book's "What's Inside" uses the lighter form — number + illustration +
 * heading + descriptor, no quote. Compass & Path passes the book quote too.
 */
export function NumberedCard({
  index,
  image,
  title,
  descriptor,
  quote,
  className,
}: {
  index: string;
  image: { src: string; alt: string };
  title: string;
  descriptor: string;
  quote?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-3"
        />
      </div>
      <p className="mt-5 font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[0.08em] text-brand-accent-text">
        {index}
      </p>
      <h4 className="mt-1 text-lg font-bold leading-snug">{title}</h4>
      {quote ? (
        <blockquote className="mt-3 border-l-2 border-brand-accent pl-4 text-sm italic leading-relaxed text-muted-foreground">
          {quote}
        </blockquote>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {descriptor}
      </p>
    </article>
  );
}
