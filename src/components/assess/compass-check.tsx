"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/*
 * The Compass & Path Check — rebuilt to BF-Check-Build-Instructions.docx.
 *
 * Three governing principles:
 *   1. No numbers, scores, or percentages are ever shown. Results are words
 *      and light — never a grade.
 *   2. The result is a season, not a verdict. All language is "right now",
 *      changeable, non-judgmental.
 *   3. Nothing is stored. All scoring happens in the browser.
 *
 * Copy (statements, per-element/step readings) is verbatim from the doc.
 * The "full version that remembers" is the paid All In build — out of scope.
 */

type Group = "The Compass" | "The Path";

type Question = {
  group: Group;
  key: string;
  statement: string;
};

const QUESTIONS: Question[] = [
  { group: "The Compass", key: "Resilience", statement: "When things knock me down, I find my way back to my feet." },
  { group: "The Compass", key: "Adaptability", statement: "When life stops following the plan, I can adjust." },
  { group: "The Compass", key: "Optimism", statement: "I can imagine good things still ahead for me." },
  { group: "The Compass", key: "Support", statement: "There are people I can lean on — and I let myself lean." },
  { group: "The Path", key: "Accept", statement: "I can look at what happened without turning away." },
  { group: "The Path", key: "Reflect", statement: "I’ve spent honest time with what this loss means for me." },
  { group: "The Path", key: "Imagine", statement: "I can picture a next chapter, even faintly." },
  { group: "The Path", key: "Action", statement: "I’m taking small steps, even when they’re hard." },
];

const ELEMENTS = ["Resilience", "Adaptability", "Optimism", "Support"] as const;
const STEPS = ["Accept", "Reflect", "Imagine", "Action"] as const;
type Element = (typeof ELEMENTS)[number];
type Step = (typeof STEPS)[number];

type Band = "bright" | "flickering" | "faint";
function band(score: number): Band {
  if (score >= 4) return "bright";
  if (score === 3) return "flickering";
  return "faint";
}
const BAND_WORD: Record<Band, string> = {
  bright: "burning bright",
  flickering: "flickering",
  faint: "gone faint",
};

const ELEMENT_COPY: Record<Element, { bright: string; faint: string }> = {
  Resilience: {
    bright: "You keep finding your feet. That strength is real — trust it.",
    faint:
      "Getting up keeps taking everything you have. Tend this light gently: one small routine, kept daily, rebuilds more than willpower does.",
  },
  Adaptability: {
    bright: "You’re bending without breaking. That flexibility will carry you.",
    faint:
      "The new shape of life still feels wrong to the touch. Tend this light by changing one small thing on purpose — choosing a change, however tiny, loosens the grip of the ones you didn’t choose.",
  },
  Optimism: {
    bright: "You can still see light ahead. Keep looking that way.",
    faint:
      "The road ahead is hard to picture right now. That’s honest, not hopeless. Tend this light by borrowing someone else’s story — the Stories page exists for exactly this.",
  },
  Support: {
    bright: "You’re letting people in. That matters more than you may know.",
    faint:
      "You may be carrying this more alone than you need to. Tending this light can be one message to one person. Not to talk about it — just to not be alone in it.",
  },
};

const STEP_COPY: Record<Step, string> = {
  Accept:
    "Accept doesn’t mean approve. It means looking at what happened without turning away — because nothing can be built on a truth you haven’t let land. This is the hardest step, and the fact that you’re here says you’re ready to stand at it.",
  Reflect:
    "You’ve let the truth land. Reflect is where you sit with it — what this loss means, what it asks of you, what it doesn’t get to take. Not rumination. Honest time, on purpose.",
  Imagine:
    "You’ve done the honest looking back. Imagine is where you turn around — picturing a next chapter, even faintly. It isn’t betrayal of what was lost. It’s what the loss makes room for.",
  Action:
    "You can see a next chapter. Action is where it becomes real — one small move, then another. Not a leap. A step.",
};

const IN_MOTION_COPY =
  "All four steps are working. You’re in motion — accepting, reflecting, imagining, and acting. The framework isn’t something you need right now; it’s something you’re living. Keep going.";

const SCALE_ANCHOR_LEFT = "Not at all like me right now";
const SCALE_ANCHOR_RIGHT = "Very much like me right now";

type Phase = "intro" | "questions" | "results";

export function CompassCheck() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  function start() {
    setAnswers({});
    setCurrent(0);
    setPhase("questions");
  }

  function answer(score: number) {
    const key = QUESTIONS[current].key;
    setAnswers((prev) => ({ ...prev, [key]: score }));
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setPhase("results");
    }
  }

  if (phase === "intro") return <Intro onStart={start} />;
  if (phase === "results") return <Results answers={answers} onRetake={start} />;
  return (
    <Questions index={current} question={QUESTIONS[current]} onAnswer={answer} />
  );
}

// ── Intro ────────────────────────────────────────────────────────────
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
        Free · Eight Questions · A Few Honest Minutes
      </p>
      <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
        Which of your lights have gone faint?
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed">
        Resilience. Adaptability. Optimism. Support. Eight questions will show
        you which are burning — and which need tending — and where you’re
        standing on the path.
      </p>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
        Nothing to sign up for, nothing to pay. Your answers stay on this page.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Take the Check →
      </button>
    </div>
  );
}

// ── Questions ────────────────────────────────────────────────────────
function Questions({
  index,
  question,
  onAnswer,
}: {
  index: number;
  question: Question;
  onAnswer: (score: number) => void;
}) {
  const total = QUESTIONS.length;
  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-10">
      {/* progress: 8 segments */}
      <div className="flex gap-1.5" aria-hidden="true">
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i <= index ? "bg-brand-accent" : "bg-muted",
            )}
          />
        ))}
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
        {question.group} · {question.key} · {index + 1} of {total}
      </p>

      <fieldset className="mt-4">
        <legend className="font-[family-name:var(--font-display)] text-2xl font-bold leading-snug sm:text-3xl">
          “{question.statement}”
        </legend>
        <p className="mt-4 italic text-muted-foreground">
          How true is this for you — right now, in this season?
        </p>

        <div className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onAnswer(score)}
              aria-label={`${score} of 5${
                score === 1
                  ? ` — ${SCALE_ANCHOR_LEFT}`
                  : score === 5
                    ? ` — ${SCALE_ANCHOR_RIGHT}`
                    : ""
              }`}
              className="flex min-h-[52px] items-center justify-center rounded-lg border border-border bg-background font-[family-name:var(--font-display)] text-lg font-bold transition-colors hover:border-brand-accent hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {score}
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>{SCALE_ANCHOR_LEFT}</span>
          <span className="text-right">{SCALE_ANCHOR_RIGHT}</span>
        </div>
      </fieldset>
    </div>
  );
}

// ── Results ──────────────────────────────────────────────────────────
function currentStep(answers: Record<string, number>): Step | "motion" {
  for (const step of STEPS) {
    if ((answers[step] ?? 0) <= 3) return step;
  }
  return "motion";
}

function Results({
  answers,
  onRetake,
}: {
  answers: Record<string, number>;
  onRetake: () => void;
}) {
  const lights = ELEMENTS.map((el) => ({
    el,
    score: answers[el] ?? 0,
    band: band(answers[el] ?? 0),
  }));

  // Ties: first in N/E/S/W (array) order wins — a stable sort preserves it.
  const brightest = [...lights].sort((a, b) => b.score - a.score)[0];
  const faintest = [...lights].sort((a, b) => a.score - b.score)[0];
  const allEqual = lights.every((l) => l.score === lights[0].score);
  const allBright = lights.every((l) => l.band === "bright");

  const step = currentStep(answers);

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
        Your Check · This Season’s Reading
      </p>
      <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
        Here’s where you stand — honestly, and without a score.
      </h2>
      <p className="mt-3 italic leading-relaxed text-muted-foreground">
        Lights can be tended. Steps can be taken. Nothing here is permanent.
      </p>

      <CompassVisual lights={lights} />

      {/* Compass reading card */}
      <section className="mt-10 rounded-lg border border-border bg-muted p-6 sm:p-8">
        <h3 className="text-lg font-bold">The Compass · how you’re travelling</h3>
        {allEqual && allBright ? (
          <p className="mt-4 leading-relaxed">
            All four of your lights are burning bright. That doesn’t mean it’s
            been easy — it means what you’re doing is working.
          </p>
        ) : allEqual ? (
          <p className="mt-4 leading-relaxed">
            All four lights are at the same level right now — none out, none
            fully bright. That’s a season, not a verdict. Pick one light and tend
            it first; the others tend to follow.
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            <div>
              <p className="font-semibold">
                {brightest.el} —{" "}
                <span className="italic text-muted-foreground">
                  {BAND_WORD[brightest.band]}
                </span>
              </p>
              <p className="mt-1 leading-relaxed">
                {ELEMENT_COPY[brightest.el].bright}
              </p>
            </div>
            <div>
              <p className="font-semibold">
                {faintest.el} —{" "}
                <span className="italic text-muted-foreground">
                  {BAND_WORD[faintest.band]}
                </span>
              </p>
              <p className="mt-1 leading-relaxed">
                {ELEMENT_COPY[faintest.el].faint}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Path reading card */}
      <section className="mt-6 rounded-lg border border-border bg-muted p-6 sm:p-8">
        <h3 className="text-lg font-bold">The Path · where you’re standing</h3>
        <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3">
          {STEPS.map((s, i) => {
            const isCurrent = step === s;
            const isBefore = step !== "motion" && STEPS.indexOf(step) > i;
            return (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-bold",
                    isCurrent
                      ? "border-brand-accent bg-brand-accent text-white"
                      : isBefore || step === "motion"
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 ? (
                  <span aria-hidden="true" className="text-muted-foreground">
                    →
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
        {step === "motion" ? (
          <>
            <p className="mt-6 text-lg font-bold">You’re in motion.</p>
            <p className="mt-2 leading-relaxed">{IN_MOTION_COPY}</p>
          </>
        ) : (
          <>
            <p className="mt-6 text-lg font-bold">You’re standing at {step}.</p>
            <p className="mt-2 leading-relaxed">{STEP_COPY[step]}</p>
          </>
        )}
      </section>

      {/* All In conversion */}
      <section className="mt-6 rounded-lg bg-primary p-6 text-primary-foreground sm:p-8">
        <h3 className="text-xl font-extrabold">
          Want to watch your lights change over time?
        </h3>
        <p className="mt-3 leading-relaxed text-primary-foreground/85">
          All In keeps your Check results season by season, alongside the full
          journal, the workbooks, and the complete course — so you can see the
          tending work. It comes free with the book.
        </p>
        <a
          href="/all-in"
          className="mt-6 inline-flex items-center rounded-full bg-primary-foreground px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary transition-colors hover:bg-primary-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Explore All In →
        </a>
      </section>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onRetake}
          className="font-[family-name:var(--font-display)] text-sm font-bold text-brand-accent-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Take the Check again
        </button>
      </div>
    </div>
  );
}

// ── Compass SVG (lights, not scores) ─────────────────────────────────
// Wide canvas so E/W labels never clip (doc §5.1: viewBox 0 0 460 390).
function CompassVisual({
  lights,
}: {
  lights: { el: Element; score: number; band: Band }[];
}) {
  const byEl = Object.fromEntries(lights.map((l) => [l.el, l])) as Record<
    Element,
    { el: Element; score: number; band: Band }
  >;
  const cx = 230;
  const cy = 190;
  const r = 120;

  // N, E, S, W → Resilience, Adaptability, Optimism, Support
  const points: {
    el: Element;
    x: number;
    y: number;
    anchor: "middle" | "start" | "end";
    lx: number;
    ly: number;
  }[] = [
    { el: "Resilience", x: cx, y: cy - r, anchor: "middle", lx: cx, ly: cy - r - 34 },
    { el: "Adaptability", x: cx + r, y: cy, anchor: "start", lx: cx + r + 18, ly: cy - 6 },
    { el: "Optimism", x: cx, y: cy + r, anchor: "middle", lx: cx, ly: cy + r + 26 },
    { el: "Support", x: cx - r, y: cy, anchor: "end", lx: cx - r - 18, ly: cy - 6 },
  ];

  const coreR: Record<Band, number> = { bright: 15, flickering: 10, faint: 6 };
  const glowR: Record<Band, number> = { bright: 34, flickering: 24, faint: 14 };
  const glowOpacity: Record<Band, number> = {
    bright: 0.5,
    flickering: 0.35,
    faint: 0.2,
  };

  const ariaLabel =
    "Your compass. " +
    lights.map((l) => `${l.el} is ${BAND_WORD[l.band]}.`).join(" ");

  return (
    <div className="mt-8 flex justify-center">
      <svg
        viewBox="0 0 460 390"
        role="img"
        aria-label={ariaLabel}
        className="w-full"
        style={{ maxWidth: "min(360px, 84vw)" }}
      >
        <style>{`
          @keyframes bf-flicker { 0%,100% { opacity: 0.35 } 50% { opacity: 0.62 } }
          .bf-flicker { animation: bf-flicker 2.4s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) { .bf-flicker { animation: none; } }
        `}</style>

        {/* faint rings + crosshair */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke="var(--border)" strokeWidth="1" />
        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="var(--border)" strokeWidth="1" />
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="var(--border)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r="3" fill="var(--brand-primary)" />

        {points.map((p) => {
          const b = byEl[p.el].band;
          return (
            <g key={p.el}>
              <circle
                cx={p.x}
                cy={p.y}
                r={glowR[b]}
                fill="var(--brand-gold)"
                opacity={glowOpacity[b]}
                className={b === "flickering" ? "bf-flicker" : undefined}
              />
              <circle cx={p.x} cy={p.y} r={coreR[b]} fill="var(--brand-gold)" />
              <text
                x={p.lx}
                y={p.ly}
                textAnchor={p.anchor}
                className="font-[family-name:var(--font-display)]"
                fontSize="13"
                fontWeight="700"
                letterSpacing="0.06em"
                fill="var(--brand-primary)"
              >
                {p.el.toUpperCase()}
              </text>
              <text
                x={p.lx}
                y={p.ly + 16}
                textAnchor={p.anchor}
                fontSize="12"
                fontStyle="italic"
                fill="var(--muted-foreground)"
              >
                {BAND_WORD[byEl[p.el].band]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
