"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * The Premium page's heart: the three "Included" blocks and the access
 * code box. A valid code (checked server-side, never in the page)
 * replaces the blocks with the open library. The code is kept on the
 * device so the library stays open on return visits — and the same
 * code works on any other device, any time, exactly as the
 * confirmation email says.
 */

const CODE_KEY = "bf-premium-code";

const blocks = [
  {
    title: "The complete book",
    body: "Maher’s full story and the framework it gave him: the four honest questions, the Path and the Compass. Downloadable, so you can read it on any device, at your own pace.",
    img: "/assets/premium/book.png",
    alt: "The complete book — downloadable edition",
  },
  {
    title: "The companion workbook",
    body: "Every reflection from the book, with space to write your own answers. Work through it once, or come back to it each time life shifts. Downloadable and yours to keep.",
    img: "/assets/premium/workbook.png",
    alt: "The companion workbook — downloadable worksheets",
  },
  {
    title: "Everything in All In",
    body: "The Full Assessment, the short version of the book, the nine-module course with worksheets, the 30-Day Journal, the webinars live plus the full library, the Monthly Letter, and everything new as it lands. All of it opens with your access code, no assessment needed first.",
    img: "/assets/all-in/all-in-hero.png",
    alt: "Everything in All In — the whole package, one orbit",
  },
];

function dl(file: "book" | "workbook", code: string): string {
  return `/api/premium/download?file=${file}&code=${encodeURIComponent(code)}`;
}

export function PremiumAccess() {
  const [phase, setPhase] = useState<"locked" | "checking" | "open">("locked");
  const [code, setCode] = useState("");
  const [savedCode, setSavedCode] = useState("");
  const [message, setMessage] = useState("");

  // A code remembered on this device re-opens everything on arrival.
  useEffect(() => {
    let stored = "";
    try {
      stored = window.localStorage.getItem(CODE_KEY) ?? "";
    } catch {
      /* stay locked */
    }
    if (!stored) return;
    setPhase("checking");
    fetch("/api/premium", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: stored }),
    })
      .then((r) => r.json())
      .then((d: { ok?: boolean }) => {
        if (d.ok) {
          setSavedCode(stored);
          setPhase("open");
        } else {
          setPhase("locked");
        }
      })
      .catch(() => setPhase("locked"));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setMessage("Please enter your access code.");
      return;
    }
    setPhase("checking");
    setMessage("");
    try {
      const res = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (res.ok && data.ok) {
        try {
          window.localStorage.setItem(CODE_KEY, trimmed);
        } catch {
          /* still opens this visit */
        }
        setSavedCode(trimmed);
        setPhase("open");
      } else {
        setPhase("locked");
        setMessage(data.message ?? "That code doesn’t match — please check your confirmation email.");
      }
    } catch {
      setPhase("locked");
      setMessage("We couldn’t check the code just now — please try again.");
    }
  }

  /* ── OPEN: the library replaces the blocks ── */
  if (phase === "open") {
    const rows: { title: string; href: string; kind: "download" | "link"; note?: string }[] = [
      { title: "The complete book", href: dl("book", savedCode), kind: "download" },
      { title: "The companion workbook", href: dl("workbook", savedCode), kind: "download" },
      {
        title: "The short version of the book",
        href: "/downloads/all-in/bouncing-forward-book-summary.pdf",
        kind: "download",
      },
      { title: "The nine-module course, with worksheets", href: "/course", kind: "link" },
      { title: "The webinar library", href: "/all-in", kind: "link" },
    ];
    return (
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-extrabold leading-tight sm:text-4xl">
          Everything is open. Download what you need, come back for the rest.
        </h2>
        <div className="mt-8 rounded-lg border border-border bg-card p-6 sm:p-8">
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.title} className="py-3">
                {r.kind === "download" ? (
                  <a
                    href={r.href}
                    className="group flex items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="font-[family-name:var(--font-display)] font-bold text-primary transition-colors group-hover:text-brand-accent-text">
                      {r.title}
                    </span>
                    <span aria-hidden="true" className="mt-1 shrink-0 font-bold text-brand-accent-text">
                      ↓
                    </span>
                  </a>
                ) : (
                  <Link
                    href={r.href}
                    className="group flex items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="font-[family-name:var(--font-display)] font-bold text-primary transition-colors group-hover:text-brand-accent-text">
                      {r.title}
                    </span>
                    <span aria-hidden="true" className="mt-1 shrink-0 font-bold text-brand-accent-text">
                      →
                    </span>
                  </Link>
                )}
              </li>
            ))}
            <li className="py-3">
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="font-[family-name:var(--font-display)] font-bold text-primary">
                    The 30-Day Journal
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    Arriving shortly — it lands here the moment it’s ready.
                  </span>
                </span>
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/all-in#full-assessment"
            className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Take the Full Assessment
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Your Monthly Letter and the weekly note will arrive by email.
          </p>
        </div>
      </div>
    );
  }

  /* ── LOCKED: the three blocks + the access code box ── */
  return (
    <div>
      <div className="space-y-16 sm:space-y-20">
        {blocks.map((b, i) => (
          <div
            key={b.title}
            className={`grid items-center gap-8 sm:gap-12 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
                Premium — Included
              </p>
              <h3 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
                {b.title}
              </h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg pb-[100%] sm:max-w-lg lg:max-w-none">
              <Image
                src={b.img}
                alt={b.alt}
                fill
                sizes="(min-width: 1024px) 40rem, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Access code */}
      <div className="mx-auto mt-16 max-w-xl rounded-lg border-2 border-brand-accent bg-card p-8 text-center sm:mt-20">
        <div className="relative mx-auto size-24">
          <Image
            src="/assets/premium/access-code.png"
            alt=""
            fill
            sizes="6rem"
            className="object-contain"
          />
        </div>
        <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
          Already bought the Book Package?
        </h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Enter your access code and everything opens. The code is in your
          confirmation email and works on any device, any time.
        </p>
        <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
          <label htmlFor="premium-code" className="sr-only">
            Access code
          </label>
          <input
            id="premium-code"
            type="text"
            autoComplete="off"
            placeholder="Access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 rounded-full border border-input bg-background px-5 py-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <button
            type="submit"
            disabled={phase === "checking"}
            className="rounded-full bg-primary px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {phase === "checking" ? "Checking…" : "Open the Book Package"}
          </button>
        </form>
        <p aria-live="polite" className={message ? "mt-3 text-sm text-red-600" : "sr-only"}>
          {message}
        </p>
      </div>
    </div>
  );
}
