"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import { IllustrationPlaceholder } from "@/components/site/story-card";
import { cn } from "@/lib/utils";

/*
 * Stories grid (Website_Rebrief_31_July_2026 — Stories).
 * Clickable cards: image + headline visible; clicking a card reveals the
 * full story and its quote in place. Copy is verbatim from the re-brief.
 */

export type Story = {
  headline: string;
  image: { src: string; alt: string } | null;
  story: string;
  quote: string;
};

export function StoriesGrid({ stories }: { stories: Story[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stories.map((s, i) => (
        <StoryTile key={s.headline} story={s} index={i} />
      ))}
    </div>
  );
}

function StoryTile({ story, index }: { story: Story; index: number }) {
  const [open, setOpen] = useState(false);
  const bodyId = `story-${index}`;

  return (
    <article className="border-border bg-card flex h-full flex-col overflow-hidden rounded-lg border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
        className="group focus-visible:outline-ring flex flex-1 flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <div className="relative w-full pb-[66.6667%]">
          {story.image ? (
            <Image
              src={story.image.src}
              alt={story.image.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0">
              <IllustrationPlaceholder />
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-3 p-5">
          <h3 className="group-hover:text-brand-accent-text text-lg leading-snug font-bold">
            {story.headline}
          </h3>
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "text-brand-accent-text mt-1 size-5 shrink-0 transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </button>
      <div
        id={bodyId}
        hidden={!open}
        className="border-border border-t px-5 pt-4 pb-6"
      >
        <p className="text-muted-foreground leading-relaxed">{story.story}</p>
        <blockquote className="border-brand-accent mt-4 border-l-2 pl-4 leading-relaxed italic">
          {story.quote}
        </blockquote>
      </div>
    </article>
  );
}
