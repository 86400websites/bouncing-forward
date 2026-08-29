import Link from "next/link";

/*
 * Shared navy pre-footer "Assess block" (BF-Website-Copy — Home & Resources).
 * IMAGE 4 / 27 is "a compass with two lights lit, two dimmed" — rendered here
 * as a small static SVG (no commissioned asset needed), matching the live
 * Check's gold-light language.
 */
function MiniCompass() {
  const cx = 150;
  const cy = 110;
  const r = 58;
  // N & E lit (bright gold), S & W dim (faint) — "two lit, two dimmed".
  // Each light carries its Element title (re-brief: "add the titles to each of the lights").
  const lights = [
    { x: cx, y: cy - r, lit: true, label: "RESILIENCE", lx: cx, ly: cy - r - 16, anchor: "middle" as const },
    { x: cx + r, y: cy, lit: true, label: "ADAPTABILITY", lx: cx + r + 12, ly: cy + 4, anchor: "start" as const },
    { x: cx, y: cy + r, lit: false, label: "OPTIMISM", lx: cx, ly: cy + r + 22, anchor: "middle" as const },
    { x: cx - r, y: cy, lit: false, label: "SUPPORT", lx: cx - r - 12, ly: cy + 4, anchor: "end" as const },
  ];
  return (
    <svg
      viewBox="0 0 320 210"
      role="img"
      aria-label="A compass whose four lights — Resilience, Adaptability, Optimism and Support — show two burning bright and two gone faint."
      className="mx-auto w-full max-w-[300px]"
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="2.5" fill="rgba(255,255,255,0.5)" />
      {lights.map((l, i) => (
        <g key={i}>
          <circle
            cx={l.x}
            cy={l.y}
            r={l.lit ? 20 : 9}
            fill="var(--brand-gold)"
            opacity={l.lit ? 0.45 : 0.18}
          />
          <circle
            cx={l.x}
            cy={l.y}
            r={l.lit ? 9 : 4}
            fill="var(--brand-gold)"
            opacity={l.lit ? 1 : 0.55}
          />
          <text
            x={l.lx}
            y={l.ly}
            textAnchor={l.anchor}
            dominantBaseline="middle"
            className="font-[family-name:var(--font-display)]"
            fontSize="10"
            fontWeight="700"
            letterSpacing="0.06em"
            fill="rgba(255,255,255,0.85)"
          >
            {l.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function AssessBlock({
  showGoAllIn = false,
  headline = "Which of your lights have gone faint?",
  lines = [
    "Resilience. Adaptability. Optimism. Support. Two minutes of honest reflection will show you which lights are burning — and which need tending. It’s where the Bouncing Forward journey begins. Nothing to sign up for, nothing to pay.",
  ],
  ctaLabel = "Find out where here is →",
}: {
  showGoAllIn?: boolean;
  headline?: string;
  lines?: string[];
  ctaLabel?: string;
}) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {headline}
            </h2>
            <div className="mt-5 max-w-xl space-y-3 text-lg leading-relaxed text-primary-foreground/85">
              {lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/assess"
                className="inline-flex items-center rounded-full bg-primary-foreground px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary transition-colors hover:bg-primary-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {ctaLabel}
              </Link>
              {showGoAllIn ? (
                <Link
                  href="/all-in"
                  className="inline-flex items-center rounded-full border border-primary-foreground/40 px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Go All In
                </Link>
              ) : null}
            </div>
          </div>
          <div className="hidden lg:block">
            <MiniCompass />
          </div>
        </div>
      </div>
    </section>
  );
}
