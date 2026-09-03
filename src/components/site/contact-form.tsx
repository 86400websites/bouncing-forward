"use client";

import { useState } from "react";

/*
 * Contact form (BF-Website-Copy — Contact).
 *
 * Live delivery via Formspree: set NEXT_PUBLIC_FORMSPREE_ENDPOINT (the
 * form's URL, e.g. https://formspree.io/f/abcdwxyz) and Send submits
 * there with honest sending/sent/error states. Without it, Send falls
 * back to opening the visitor's mail client pre-addressed — a real,
 * working action either way; we never fake a submission.
 */

const CONTACT_EMAIL = "info@bouncing-forward.com";
const FORMSPREE = (process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "").trim();

const SUBJECTS = [
  "Tell me more about Bouncing Forward",
  "Tell me more about All In",
  "Enquire about booking a workshop",
  "Enquire about upcoming events",
  "I’d like to share my story",
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [gotcha, setGotcha] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const canSend = Boolean(name.trim() && email.trim() && message.trim());

  function sendMailto() {
    const body = `${message}\n\n— ${name} (${email})`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  async function send() {
    if (!canSend || state === "sending") return;
    if (!FORMSPREE) {
      sendMailto();
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _replyto: email,
          _subject: `[Bouncing Forward] ${subject}`,
          _gotcha: gotcha,
        }),
      });
      if (res.ok) {
        setState("done");
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          errors?: { message?: string }[];
        };
        setState("error");
        setError(
          data.errors?.[0]?.message ??
            "Something went wrong sending your message — please try again.",
        );
      }
    } catch {
      setState("error");
      setError("We couldn’t send your message just now — please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="border-brand-accent bg-card rounded-xl border-2 p-6 sm:p-8">
        <p className="text-primary font-[family-name:var(--font-display)] text-lg font-bold">
          Message sent — thank you.
        </p>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          We read everything, and we’ll reply to{" "}
          <span className="text-foreground font-semibold">{email}</span> as soon
          as we can.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border bg-card rounded-xl border p-6 sm:p-8">
      <div className="space-y-5">
        <Field id="c-name" label="Name">
          <input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/40 w-full rounded-md border px-4 py-2.5 text-base transition-colors outline-none focus-visible:ring-2"
          />
        </Field>
        <Field id="c-email" label="Email address">
          <input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/40 w-full rounded-md border px-4 py-2.5 text-base transition-colors outline-none focus-visible:ring-2"
          />
        </Field>
        <Field id="c-subject" label="Subject">
          <select
            id="c-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/40 w-full rounded-md border px-4 py-2.5 text-base transition-colors outline-none focus-visible:ring-2"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field id="c-message" label="Message">
          <textarea
            id="c-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/40 w-full rounded-md border px-4 py-2.5 text-base transition-colors outline-none focus-visible:ring-2"
          />
        </Field>
        {/* Honeypot — hidden from real people, tempting to bots. */}
        <input
          type="text"
          name="_gotcha"
          value={gotcha}
          onChange={(e) => setGotcha(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="button"
          onClick={send}
          disabled={!canSend || state === "sending"}
          className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state === "sending" ? "Sending…" : "Send"}
        </button>
        <p
          aria-live="polite"
          className={error ? "text-sm text-red-600" : "sr-only"}
        >
          {error}
        </p>
        <p className="text-muted-foreground text-sm">
          Prefer email? Write to us directly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-brand-accent-text font-semibold hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
