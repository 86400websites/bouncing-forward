import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The signature numbered 01–04 framework unit (DESIGN.md §6).
 *
 * Shared by The Book (sprint 4) and The Compass & The Path (sprint 5):
 * number in Archivo 800 · illustration · heading · optional subtitle ·
 * optional italic book quote (with hairline accent rule) · optional plain line.
 *
 * `headingLevel` keeps the page outline correct: Book nests these under a
 * group h3 (so cards are h4), Compass & Path nests them directly under the
 * section h2 (so cards are h3).
 */
export function NumberedCard({
  index,
  image,
  title,
  subtitle,
  quote,
  descriptor,
  headingLevel = "h4",
  className,
  iconClassName,
}: {
  index: string;
  image: { src: string; alt: string };
  title: string;
  subtitle?: string;
  quote?: string;
  descriptor?: string;
  headingLevel?: "h3" | "h4";
  className?: string;
  iconClassName?: string;
}) {
  const headingClass = "mt-1 text-lg font-bold leading-snug";
  return (
    <article
      className={cn(
        "border-border bg-card flex h-full flex-col rounded-lg border p-6 transition-all hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-md pb-[75%]",
          iconClassName ?? "bg-muted",
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          className="absolute inset-0 h-full w-full object-contain p-3"
        />
      </div>
      <p className="text-brand-accent-text mt-5 font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[0.08em]">
        {index}
      </p>
      {headingLevel === "h3" ? (
        <h3 className={headingClass}>{title}</h3>
      ) : (
        <h4 className={headingClass}>{title}</h4>
      )}
      {subtitle ? (
        <p className="text-muted-foreground mt-1 text-sm font-semibold">
          {subtitle}
        </p>
      ) : null}
      {quote ? (
        <blockquote className="border-brand-accent text-muted-foreground mt-3 border-l-2 pl-4 text-sm leading-relaxed italic">
          {quote}
        </blockquote>
      ) : null}
      {descriptor ? (
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {descriptor}
        </p>
      ) : null}
    </article>
  );
}
