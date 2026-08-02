"use client";

import { useState } from "react";

/*
 * Contact form (BF-Website-Copy — Contact).
 *
 * The email backend (Resend) is a later step. Rather than fake a submission,
 * Send opens the visitor's mail client pre-addressed to the interim address
 * with their subject and message — a real, working action today. Swap the
 * handler for the API route when the backend lands.
 */

const CONTACT_EMAIL = "heatherswart@live.co.za";

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

  const canSend = name.trim() && email.trim() && message.trim();

  function send() {
    const body = `${message}\n\n— ${name} (${email})`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="space-y-5">
        <Field id="c-name" label="Name">
          <input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </Field>
        <Field id="c-email" label="Email address">
          <input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </Field>
        <Field id="c-subject" label="Subject">
          <select
            id="c-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
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
            className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </Field>
        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Send
        </button>
        <p className="text-sm text-muted-foreground">
          Prefer email? Write to us directly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-brand-accent-text hover:underline"
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
