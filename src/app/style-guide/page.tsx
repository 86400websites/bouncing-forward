import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Style Guide",
  robots: { index: false, follow: false },
};

/**
 * Sprint 1 visual gate — the living reference for tokens, type, and core
 * component treatments (DESIGN.md §3–6). Not linked from the nav; noindexed.
 * Keep it as pages are built: if a treatment changes, it changes here first.
 */

const swatches = [
  { name: "Brand primary (navy)", cls: "bg-primary", hex: "#0D2741", ink: "text-primary-foreground" },
  { name: "Primary hover", cls: "bg-brand-primary-hover", hex: "#16395C", ink: "text-primary-foreground" },
  { name: "Brand accent — graphics only on white", cls: "bg-brand-accent", hex: "#0CA1D9", ink: "text-primary" },
  { name: "Accent text (AA-safe)", cls: "bg-brand-accent-text", hex: "#067CA8", ink: "text-primary-foreground" },
  { name: "Muted section", cls: "bg-muted", hex: "#F1F6FA", ink: "text-foreground" },
  { name: "Border", cls: "bg-border", hex: "#DCE6EE", ink: "text-foreground" },
];

export default function StyleGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
        Internal · Sprint 1 gate
      </p>
      <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Style Guide</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Tokens, type, and core treatments per DESIGN.md. If it isn&apos;t here,
        it isn&apos;t the system.
      </p>

      {/* Color */}
      <h2 className="mt-16 text-2xl font-extrabold">Color</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {swatches.map((s) => (
          <div key={s.hex} className="overflow-hidden rounded-lg border border-border">
            <div className={`flex h-24 items-end p-3 ${s.cls}`}>
              <span className={`font-[family-name:var(--font-display)] text-xs font-bold ${s.ink}`}>
                {s.hex}
              </span>
            </div>
            <p className="p-3 text-sm text-muted-foreground">{s.name}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Rule: <span className="font-semibold text-foreground">#0CA1D9 is never small text on white</span>{" "}
        (2.95:1). Text accents on light backgrounds use{" "}
        <span className="text-brand-accent-text font-semibold">#067CA8</span> (4.71:1).
      </p>

      {/* Type */}
      <h2 className="mt-16 text-2xl font-extrabold">Type</h2>
      <div className="mt-6 space-y-8 border-l-2 border-brand-accent pl-6">
        <div>
          <p className="text-xs text-muted-foreground">h1 · Archivo 800</p>
          <p className="text-4xl font-extrabold leading-tight sm:text-6xl">Not Back. Forward.</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">h2 · Archivo 800</p>
          <p className="text-3xl font-extrabold">A Compass and a Path for the Hardest Seasons</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">h3 · Archivo 700</p>
          <p className="text-xl font-bold">Resilience — Weathering the Storms of Adversity</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Body · Source Serif 4 400 · 17→18px</p>
          <p className="max-w-2xl">
            Most books about loss tell you how to survive it. This one shows you
            how to cross it. The framework rests on two tools, not one.
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pull-quote · Source Serif 4 italic</p>
          <p className="max-w-2xl text-xl italic leading-relaxed sm:text-2xl">
            &ldquo;Not going back to who you were. Going forward to who you are
            capable of becoming.&rdquo;
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Eyebrow · Archivo 700 caps, accent-text</p>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
            Two tools
          </p>
        </div>
      </div>

      {/* Buttons */}
      <h2 className="mt-16 text-2xl font-extrabold">Buttons</h2>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href="#"
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Start Your Crossing
        </Link>
        <Link
          href="#"
          className="rounded-full border border-primary px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Read the Book
        </Link>
      </div>
      <div className="mt-6 rounded-lg bg-primary p-8">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
          On navy — accent is text-safe here (5.14:1)
        </p>
        <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold text-primary-foreground">
          Why did this happen? What does this ask of me?
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="#"
            className="rounded-full bg-primary-foreground px-6 py-3 text-sm font-bold text-primary transition-opacity hover:opacity-90"
          >
            Inverted CTA
          </Link>
          <Link href="#" className="self-center text-sm font-bold text-brand-accent underline-offset-4 hover:underline">
            Accent link on navy
          </Link>
        </div>
      </div>

      {/* Form */}
      <h2 className="mt-16 text-2xl font-extrabold">Form treatment</h2>
      <div className="mt-6 max-w-md space-y-4 rounded-lg border border-border p-6">
        <div>
          <label htmlFor="sg-name" className="font-[family-name:var(--font-display)] text-sm font-bold">
            First name
          </label>
          <input
            id="sg-name"
            type="text"
            placeholder="Your first name"
            className="mt-2 w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
        <div>
          <label htmlFor="sg-email" className="font-[family-name:var(--font-display)] text-sm font-bold">
            Email address <span className="text-destructive">*</span>
          </label>
          <input
            id="sg-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid="true"
            aria-describedby="sg-email-error"
            className="mt-2 w-full rounded-md border border-destructive bg-background px-4 py-2.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
          />
          <p id="sg-email-error" className="mt-2 text-sm text-destructive">
            Error state: colored border and a message — never color alone.
          </p>
        </div>
        <button
          type="button"
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover"
        >
          Subscribe
        </button>
      </div>

      <p className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
        Route is noindexed and unlinked. Motion primitives arrive in sprint 2.
      </p>
    </div>
  );
}
