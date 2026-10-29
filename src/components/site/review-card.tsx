"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reader review card — shows the first three lines; a "Read more" toggle
 * appears only when the review is longer than that.
 */
export function ReviewCard({ quote, name }: { quote: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const textId = useId();

  // Measure while clamped: does the full text need more than three lines?
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const measure = () => {
      if (!open) setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  return (
    <figure className="border-border bg-card flex h-full flex-col rounded-lg border p-6 sm:p-7">
      <span
        aria-hidden="true"
        className="text-brand-accent font-[family-name:var(--font-display)] text-5xl leading-none font-extrabold"
      >
        “
      </span>
      <blockquote className="mt-2 flex-1">
        <p
          id={textId}
          ref={textRef}
          className={cn("min-h-[3lh] leading-relaxed", !open && "line-clamp-3")}
        >
          {quote}
        </p>
        {overflows || open ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={textId}
            onClick={() => setOpen((o) => !o)}
            className="text-brand-accent-text hover:text-foreground focus-visible:outline-ring mt-3 inline-flex h-6 items-center gap-1 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {open ? "Show less" : "Read more"}
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "size-4 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        ) : (
          /* Same height as the toggle, so short reviews line up with long ones. */
          <span aria-hidden="true" className="mt-3 block h-6" />
        )}
      </blockquote>
      <figcaption className="border-border text-primary mt-5 border-t pt-4 font-[family-name:var(--font-display)] font-bold">
        {name}
      </figcaption>
    </figure>
  );
}
