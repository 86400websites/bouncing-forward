"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/premium/checkout-button";

/**
 * The Premium page's heart, account edition. Three cards — the book,
 * the workbook, and "Everything in Premium" — where Card 3 now carries
 * the account story and the buy/log-in actions. A signed-in owner sees
 * the open download list instead (downloads authorised by their
 * session, no codes). Legacy access codes from already-sent emails
 * still work via "Use an access code instead", and a Payment-Link
 * ?session_id= return still auto-unlocks the legacy way.
 */

const CODE_KEY = "bf-premium-code";

function dl(file: "book" | "workbook", code?: string): string {
  const base = `/api/premium/download?file=${file}`;
  return code ? `${base}&code=${encodeURIComponent(code)}` : base;
}

export function PremiumAccess({
  loggedIn,
  owned,
}: {
  loggedIn: boolean;
  owned: boolean;
}) {
  const [phase, setPhase] = useState<"locked" | "checking" | "open">(
    owned ? "open" : "locked",
  );
  const [code, setCode] = useState("");
  const [savedCode, setSavedCode] = useState("");
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [message, setMessage] = useState("");

  // Legacy paths only matter when the account doesn't already own it:
  // a remembered code, or a Payment-Link return with ?session_id=.
  useEffect(() => {
    if (owned) return;

    function openWith(codeValue: string) {
      try {
        window.localStorage.setItem(CODE_KEY, codeValue);
      } catch {
        /* still opens this visit */
      }
      setSavedCode(codeValue);
      setPhase("open");
    }
    function checkStored() {
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
    }

    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (sessionId) {
      window.history.replaceState({}, "", window.location.pathname);
      setPhase("checking");
      fetch(`/api/stripe/verify?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((d: { ok?: boolean; code?: string | null; message?: string }) => {
          if (d.ok && d.code) {
            openWith(d.code);
          } else {
            setPhase("locked");
            setMessage(
              d.message ??
                "Thank you — check your email for your access details.",
            );
            checkStored();
          }
        })
        .catch(() => {
          setPhase("locked");
          checkStored();
        });
      return;
    }
    checkStored();
  }, [owned]);

  async function submitCode(e: React.FormEvent) {
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
          /* opens this visit anyway */
        }
        setSavedCode(trimmed);
        setPhase("open");
      } else {
        setPhase("locked");
        setMessage(data.message ?? "That code doesn’t match — please check your email.");
      }
    } catch {
      setPhase("locked");
      setMessage("We couldn’t check the code just now — please try again.");
    }
  }

  /* ── OPEN: the download list ── */
  if (phase === "open") {
    const codeParam = owned ? undefined : savedCode;
    const rows: { title: string; href: string; kind: "download" | "link" }[] = [
      { title: "The complete book", href: dl("book", codeParam), kind: "download" },
      { title: "The companion workbook", href: dl("workbook", codeParam), kind: "download" },
      {
        title: "The short version of the book",
        href: "/downloads/all-in/bouncing-forward-book-summary.pdf",
        kind: "download",
      },
      { title: "The nine-module course, with worksheets", href: "/course", kind: "link" },
      {
        title: "The 30-Day Journal",
        href: "/downloads/all-in/bf-30-day-journal.pdf",
        kind: "download",
      },
      { title: "The webinar library", href: "/all-in", kind: "link" },
    ];
    return (
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-extrabold leading-tight sm:text-4xl">
          Everything is open. Download what you need, come back for the rest.
        </h2>
        {owned ? (
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Tied to your account — log in on any device and it’s all here.
          </p>
        ) : null}
        <div className="mt-8 rounded-lg border border-border bg-card p-6 sm:p-8">
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.title} className="py-3">
                {r.kind === "download" ? (
                  <a href={r.href} className="group flex items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    <span className="font-[family-name:var(--font-display)] font-bold text-primary transition-colors group-hover:text-brand-accent-text">
                      {r.title}
                    </span>
                    <span aria-hidden="true" className="mt-1 shrink-0 font-bold text-brand-accent-text">↓</span>
                  </a>
                ) : (
                  <Link href={r.href} className="group flex items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    <span className="font-[family-name:var(--font-display)] font-bold text-primary transition-colors group-hover:text-brand-accent-text">
                      {r.title}
                    </span>
                    <span aria-hidden="true" className="mt-1 shrink-0 font-bold text-brand-accent-text">→</span>
                  </Link>
                )}
              </li>
            ))}
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

  /* ── LOCKED: three cards; Card 3 = the account story ── */
  const cardShell =
    "grid items-center gap-8 rounded-lg border border-border bg-card p-6 sm:p-10 sm:gap-12 lg:grid-cols-2";
  const imageShell =
    "relative mx-auto w-full max-w-sm overflow-hidden rounded-lg pb-[100%] sm:max-w-md lg:max-w-none";

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className={cardShell}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Premium — Included
          </p>
          <h3 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            The complete book
          </h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Maher’s full story and the framework it gave him: the four honest
            questions, the Path and the Compass. Downloadable, so you can read
            it on any device, at your own pace.
          </p>
        </div>
        <div className={imageShell}>
          <Image src="/assets/premium/book.png" alt="The complete book — downloadable edition" fill sizes="(min-width: 1024px) 36rem, 100vw" className="object-contain" />
        </div>
      </div>

      <div className={`${cardShell} lg:[&>*:first-child]:order-2`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Premium — Included
          </p>
          <h3 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            The companion workbook
          </h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every reflection from the book, with space to write your own
            answers. Work through it once, or come back to it each time life
            shifts. Downloadable and yours to keep.
          </p>
        </div>
        <div className={imageShell}>
          <Image src="/assets/premium/workbook.png" alt="The companion workbook — downloadable worksheets" fill sizes="(min-width: 1024px) 36rem, 100vw" className="object-contain" />
        </div>
      </div>

      <div className={cardShell}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Premium — Your account
          </p>
          <h3 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            Everything in Premium
          </h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Buy the Book Package and everything opens in your account — on any
            device, any time, just by logging in: the complete book, the
            companion workbook, the Full Assessment, the short version of the
            book, the nine-module course with worksheets, the 30-Day Journal,
            the webinar library live and recorded, and the Monthly Letter from
            Maher.
          </p>
          <div className="mt-6">
            <CheckoutButton loggedIn={loggedIn} owned={owned} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Already bought it?{" "}
            <Link href="/login" className="font-semibold text-brand-accent-text hover:underline">
              Log in
            </Link>{" "}
            ·{" "}
            <button
              type="button"
              onClick={() => setShowCodeForm((v) => !v)}
              className="font-semibold text-brand-accent-text hover:underline"
            >
              Use an access code instead
            </button>
          </p>
          {showCodeForm ? (
            <form onSubmit={submitCode} className="mt-4 flex flex-col gap-3 sm:flex-row" noValidate>
              <label htmlFor="premium-code" className="sr-only">
                Access code
              </label>
              <input
                id="premium-code"
                type="text"
                autoComplete="off"
                placeholder="Access code from your email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 rounded-full border border-input bg-background px-5 py-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              <button
                type="submit"
                disabled={phase === "checking"}
                className="rounded-full bg-primary px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phase === "checking" ? "Checking…" : "Open"}
              </button>
            </form>
          ) : null}
          <p aria-live="polite" className={message ? "mt-3 text-sm text-red-600" : "sr-only"}>
            {message}
          </p>
        </div>
        <div className={imageShell}>
          <Image src="/assets/premium/access-code.png" alt="Your Book Package, attached to your account" fill sizes="(min-width: 1024px) 36rem, 100vw" className="object-contain" />
        </div>
      </div>
    </div>
  );
}
