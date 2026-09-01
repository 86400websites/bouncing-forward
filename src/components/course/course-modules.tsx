"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COURSE_MODULES } from "@/lib/course";
import { VideoEmbed } from "@/components/course/video-embed";

const UNLOCK_KEY = "bf-allin-open";

/**
 * The nine modules. Open for anyone who has unlocked All In on this
 * device (the Full Assessment) or owns the Book Package (passed in from
 * the server). Locked visitors still see every title and description —
 * the videos and worksheets are what the assessment opens.
 */
export function CourseModules({ owned }: { owned: boolean }) {
  const [open, setOpen] = useState(owned);

  useEffect(() => {
    if (owned) {
      setOpen(true);
      return;
    }
    try {
      if (window.localStorage.getItem(UNLOCK_KEY) === "1") setOpen(true);
    } catch {
      /* stay locked */
    }
    const onUnlock = () => setOpen(true);
    window.addEventListener("bf-allin-unlocked", onUnlock);
    return () => window.removeEventListener("bf-allin-unlocked", onUnlock);
  }, [owned]);

  return (
    <div>
      {!open ? (
        <div className="mb-10 rounded-lg border-2 border-brand-accent bg-card p-6 text-center sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Included free with All In
          </p>
          <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            Take the Full Assessment, and every module opens.
          </h3>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">
            Nine videos from Maher, a worksheet for each — free, yours for
            life, the moment you finish the assessment.
          </p>
          <div className="mt-6">
            <Link
              href="/all-in#full-assessment"
              className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Take the Full Assessment — free
            </Link>
          </div>
        </div>
      ) : null}

      <ol className="space-y-10 sm:space-y-14">
        {COURSE_MODULES.map((m) => (
          <li
            key={m.n}
            id={`module-${m.n}`}
            className="scroll-mt-24 rounded-lg border border-border bg-card p-6 sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              Module {m.n}
            </p>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
              {m.title}
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">{m.description}</p>
            {open ? (
              <>
                <div className="mt-6">
                  <VideoEmbed id={m.youtubeId} title={`Module ${m.n}: ${m.title}`} />
                </div>
                <div className="mt-4">
                  <a
                    href={m.worksheet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text hover:underline"
                  >
                    Download this module’s worksheet ↓
                  </a>
                </div>
              </>
            ) : (
              <p className="mt-5 text-sm italic text-muted-foreground">
                Video and worksheet open with the Full Assessment.
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
