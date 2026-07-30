"use client";

import { useState } from "react";

/*
 * Claim Your Access (BF-Website-Copy — All In).
 *
 * The All In membership requires an account + code redemption backend, which
 * is out of scope for this build (per BF-Check-Build-Instructions §6). Rather
 * than fake unlocking, the form is present and the button returns an honest
 * "not live yet" message. Wire to the redemption endpoint when it exists.
 */
export function ClaimAccessForm() {
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mt-8 max-w-md">
      <label htmlFor="access-code" className="sr-only">
        Access code
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="access-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setSubmitted(false);
          }}
          placeholder="Access code"
          className="w-full rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-5 py-3 text-base text-primary-foreground placeholder:text-primary-foreground/50 outline-none transition-colors focus-visible:border-primary-foreground/60 focus-visible:ring-2 focus-visible:ring-primary-foreground/30"
        />
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={!code.trim()}
          className="shrink-0 rounded-full bg-primary-foreground px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary transition-colors hover:bg-primary-foreground/90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Open All In
        </button>
      </div>
      {submitted ? (
        <p
          role="status"
          className="mt-4 text-sm leading-relaxed text-primary-foreground/75"
        >
          All In isn’t open just yet — access redemption goes live when the
          membership launches. Keep your code safe; it’ll unlock everything the
          moment it does.
        </p>
      ) : null}
    </div>
  );
}
