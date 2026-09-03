"use client";

import Link from "next/link";

/*
 * Site-wide page foot (re-brief 31 Jul 2026): every page ends with a "Home"
 * button and a "Back to the top" button, above the footer.
 *
 * Back-to-top uses a real scroll action rather than an #anchor: the header is
 * position:sticky and therefore always in view, so an anchor to it does
 * nothing in most browsers. window.scrollTo always works.
 */
export function PageFoot() {
  function toTop() {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className="border-border bg-background border-t">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-5 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="border-primary text-primary hover:bg-muted focus-visible:outline-ring inline-flex items-center rounded-full border px-6 py-2.5 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Home
        </Link>
        <button
          type="button"
          onClick={toTop}
          className="border-primary text-primary hover:bg-muted focus-visible:outline-ring inline-flex items-center rounded-full border px-6 py-2.5 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Back to the top ↑
        </button>
      </div>
    </div>
  );
}
