import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Placeholder for the story illustrations not yet commissioned
 * (DESIGN.md §9 asset gaps: Urgain, Lia Esperança, Rifqi, the Bhargavas,
 * plus the featured Jordan image). Honest, on-brand, flagged — never a
 * stand-in photo of a different person.
 */
export function IllustrationPlaceholder({
  label = "Illustration coming soon",
}: {
  label?: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="size-10 text-brand-accent"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M24 8 L28 24 L24 40 L20 24 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path d="M8 24 L24 20 L40 24 L24 28 Z" fill="currentColor" opacity="0.35" />
      </svg>
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/**
 * Story card (DESIGN.md §6): category eyebrow · illustration · title ·
 * name · country · excerpt · italic closing line.
 */
export function StoryCard({
  category,
  image,
  title,
  name,
  country,
  excerpt,
  closing,
  className,
}: {
  category: string;
  image?: { src: string; alt: string } | null;
  title: string;
  name: string;
  country: string;
  excerpt: string;
  closing: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[4/3]">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        ) : (
          <IllustrationPlaceholder />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
          {category}
        </p>
        <h3 className="mt-2 text-xl font-bold leading-snug">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {name} · {country}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed">{excerpt}</p>
        <p className="mt-4 border-t border-border pt-4 text-sm italic leading-relaxed text-muted-foreground">
          {closing}
        </p>
      </div>
    </article>
  );
}
