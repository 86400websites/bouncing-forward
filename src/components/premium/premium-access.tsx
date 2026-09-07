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
  const [savedCode, setSavedCode] = useState("");
  const [message, setMessage] = useState("");

  // An owner has everything in All In too — "no assessment needed
  // first" — so open the All In library and course on this device.
  useEffect(() => {
    if (!owned) return;
    try {
      window.localStorage.setItem("bf-allin-open", "1");
      window.dispatchEvent(new Event("bf-allin-unlocked"));
    } catch {
      /* fine */
    }
  }, [owned]);

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

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id",
    );
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

  /* ── OPEN: the download list ── */
  if (phase === "open") {
    const codeParam = owned ? undefined : savedCode;
    const rows: { title: string; href: string; kind: "download" | "link" }[] = [
      {
        title: "The complete book",
        href: dl("book", codeParam),
        kind: "download",
      },
      {
        title: "The companion workbook",
        href: dl("workbook", codeParam),
        kind: "download",
      },
      {
        title: "The short version of the book",
        href: "/downloads/all-in/bouncing-forward-book-summary.pdf",
        kind: "download",
      },
      {
        title: "The nine-module course, with worksheets",
        href: "/course",
        kind: "link",
      },
      {
        title: "The 30-Day Journal",
        href: "/downloads/all-in/bf-30-day-journal.pdf",
        kind: "download",
      },
      { title: "The webinar library", href: "/all-in", kind: "link" },
    ];
    return (
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl leading-tight font-extrabold sm:text-4xl">
          Everything is open. Download what you need, come back for the rest.
        </h2>
        {owned ? (
          <p className="text-muted-foreground mt-3 text-center text-sm">
            Tied to your account — log in on any device and it’s all here.
          </p>
        ) : null}
        <div className="border-border bg-card mt-8 rounded-lg border p-6 sm:p-8">
          <ul className="divide-border divide-y">
            {rows.map((r) => (
              <li key={r.title} className="py-3">
                {r.kind === "download" ? (
                  <a
                    href={r.href}
                    className="group focus-visible:outline-ring flex items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <span className="text-primary group-hover:text-brand-accent-text font-[family-name:var(--font-display)] font-bold transition-colors">
                      {r.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-brand-accent-text mt-1 shrink-0 font-bold"
                    >
                      ↓
                    </span>
                  </a>
                ) : (
                  <Link
                    href={r.href}
                    className="group focus-visible:outline-ring flex items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <span className="text-primary group-hover:text-brand-accent-text font-[family-name:var(--font-display)] font-bold transition-colors">
                      {r.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-brand-accent-text mt-1 shrink-0 font-bold"
                    >
                      →
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/all-in#full-assessment"
            className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Take the Full Assessment
          </Link>
          <p className="text-muted-foreground mt-4 text-sm">
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
          <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
            Premium — Included
          </p>
          <h3 className="mt-3 text-2xl leading-tight font-extrabold sm:text-3xl">
            The complete book
          </h3>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Maher’s full story and the framework it gave him: the four honest
            questions, the Path and the Compass. Downloadable, so you can read
            it on any device, at your own pace.
          </p>
        </div>
        <div className={imageShell}>
          <Image
            src="/assets/premium/book.png"
            alt="The complete book — downloadable edition"
            fill
            sizes="(min-width: 1024px) 36rem, 100vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className={`${cardShell} lg:[&>*:first-child]:order-2`}>
        <div>
          <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
            Premium — Included
          </p>
          <h3 className="mt-3 text-2xl leading-tight font-extrabold sm:text-3xl">
            The companion workbook
          </h3>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Every reflection from the book, with space to write your own
            answers. Work through it once, or come back to it each time life
            shifts. Downloadable and yours to keep.
          </p>
        </div>
        <div className={imageShell}>
          <Image
            src="/assets/premium/workbook.png"
            alt="The companion workbook — downloadable worksheets"
            fill
            sizes="(min-width: 1024px) 36rem, 100vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className={cardShell}>
        <div>
          <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
            Premium — Your account
          </p>
          <h3 className="mt-3 text-2xl leading-tight font-extrabold sm:text-3xl">
            Everything in Premium
          </h3>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Buy the Book Package and everything is yours: the complete book, the
            companion workbook, the Full Assessment, the short version of the
            book, the nine-module course with worksheets, the 30-Day Journal,
            the webinar library live and recorded, and the Monthly Letter from
            Maher. All of it opens when you log in, no assessment needed first.
          </p>
          <div className="mt-6">
            <CheckoutButton loggedIn={loggedIn} owned={owned} />
          </div>
          <div className="mt-5">
            <Link
              href="/login"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-ring inline-flex items-center justify-center rounded-full border-2 px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Log in to open your Book Package
            </Link>
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            New here?{" "}
            <Link
              href="/signup"
              className="text-brand-accent-text font-semibold hover:underline"
            >
              Create your account
            </Link>
          </p>
          <p
            aria-live="polite"
            className={message ? "mt-3 text-sm text-red-600" : "sr-only"}
          >
            {message}
          </p>
        </div>
        <div className={imageShell}>
          <Image
            src="/assets/premium/access-code.png"
            alt="Your Book Package, attached to your account"
            fill
            sizes="(min-width: 1024px) 36rem, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
