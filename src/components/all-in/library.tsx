"use client";

import { useEffect, useState } from "react";

/**
 * The All In library — every downloadable that opens with the Full
 * Assessment. Locked until the same device-side unlock the assessment
 * sets (localStorage "bf-allin-open"); listens for the
 * "bf-allin-unlocked" event so it opens live the moment the gate is
 * passed, no reload needed.
 */

const UNLOCK_KEY = "bf-allin-open";

type Item = { title: string; href: string; note?: string };

const bookGroup: Item[] = [
  {
    title: "Bouncing Forward — the Book Summary",
    href: "/downloads/all-in/bouncing-forward-book-summary.pdf",
    note: "The whole framework, summarised — approved by Maher.",
  },
];

const letterGroup: Item[] = [
  {
    title: "The Monthly Letter — No. 1",
    href: "/downloads/all-in/monthly-letter-1.pdf",
    note: "Written by Maher, delivered monthly. This is the first.",
  },
  {
    title: "The Walking Pages — worksheet for Letter No. 1",
    href: "/downloads/all-in/monthly-letter-1-the-walking-pages.pdf",
  },
];

const journalGroup: Item[] = [
  {
    title: "The 30-Day Journal",
    href: "/downloads/all-in/bf-30-day-journal.pdf",
    note: "One honest page a day, for a month.",
  },
];

const courseGroup: Item[] = [
  { title: "W1 · Foundation — Introduction to Bouncing Forward", href: "/downloads/all-in/course/w1-foundation-introduction.pdf" },
  { title: "W2 · The Compass — Element 1: Resilience", href: "/downloads/all-in/course/w2-compass-resilience.pdf" },
  { title: "W3 · The Compass — Element 2: Adaptability", href: "/downloads/all-in/course/w3-compass-adaptability.pdf" },
  { title: "W4 · The Compass — Element 3: Optimism", href: "/downloads/all-in/course/w4-compass-optimism.pdf" },
  { title: "W5 · The Compass — Element 4: Support", href: "/downloads/all-in/course/w5-compass-support.pdf" },
  { title: "W6 · The Path — Step 1: Accept", href: "/downloads/all-in/course/w6-path-accept.pdf" },
  { title: "W7 · The Path — Step 2: Reflect", href: "/downloads/all-in/course/w7-path-reflect.pdf" },
  { title: "W8 · The Path — Step 3: Set Goals", href: "/downloads/all-in/course/w8-path-set-goals.pdf" },
  { title: "W9 · The Path — Step 4: Take Action", href: "/downloads/all-in/course/w9-path-take-action.pdf" },
];

function DownloadRow({ item }: { item: Item }) {
  return (
    <li className="py-3">
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span>
          <span className="font-[family-name:var(--font-display)] font-bold text-primary transition-colors group-hover:text-brand-accent-text">
            {item.title}
          </span>
          {item.note ? (
            <span className="mt-0.5 block text-sm text-muted-foreground">
              {item.note}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className="mt-1 shrink-0 font-bold text-brand-accent-text"
        >
          ↓
        </span>
      </a>
    </li>
  );
}

export function AllInLibrary() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(UNLOCK_KEY) === "1") setOpen(true);
    } catch {
      /* stay locked */
    }
    const onUnlock = () => setOpen(true);
    window.addEventListener("bf-allin-unlocked", onUnlock);
    return () => window.removeEventListener("bf-allin-unlocked", onUnlock);
  }, []);

  if (!open) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
          Your All In library
        </p>
        <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">
          Take the Full Assessment, and this opens.
        </h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          The book summary, the Monthly Letter and its worksheet, and every
          course worksheet — all free, all yours, the moment you finish.
        </p>
        <div className="mt-6">
          <a
            href="#full-assessment"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Take the Full Assessment ↑
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-center text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
        Your All In library · open
      </p>
      <h3 className="mt-3 text-center text-2xl font-extrabold sm:text-3xl">
        Everything below is yours.
      </h3>
      <p className="mt-3 text-center leading-relaxed text-muted-foreground">
        Download what you need, when you need it — and retake the assessment
        anytime to watch your reading change.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-card p-6 sm:p-8">
        <h4 className="text-lg font-bold">The book, summarised</h4>
        <ul className="mt-2 divide-y divide-border">
          {bookGroup.map((i) => (
            <DownloadRow key={i.href} item={i} />
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-6 sm:p-8">
        <h4 className="text-lg font-bold">The Monthly Letter</h4>
        <ul className="mt-2 divide-y divide-border">
          {letterGroup.map((i) => (
            <DownloadRow key={i.href} item={i} />
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-6 sm:p-8">
        <h4 className="text-lg font-bold">The 30-Day Journal</h4>
        <ul className="mt-2 divide-y divide-border">
          {journalGroup.map((i) => (
            <DownloadRow key={i.href} item={i} />
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-6 sm:p-8">
        <h4 className="text-lg font-bold">The Course — worksheets</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          One for every module. New material lands here as it&rsquo;s added.
        </p>
        <ul className="mt-2 divide-y divide-border">
          {courseGroup.map((i) => (
            <DownloadRow key={i.href} item={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}
