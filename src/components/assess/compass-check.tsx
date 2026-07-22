"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * The Compass & Path Check (sprint 9) — client-side only.
 * Content is verbatim from the deck's Chapter 4 "Taking Stock" inventory:
 * two 5-point scale vocabularies, per-question reflection prompts, an
 * 8-spoke compass visualization, and the weakest-light Personal Action Plan.
 * Persistence + subscribe-at-results arrive in sprint 10.
 */

const COMPASS_SCALE = [
  "Barely Flickering",
  "Faint",
  "Partial",
  "Steady",
  "Bright",
];
const PATH_SCALE = [
  "Not Yet Possible",
  "Beginning",
  "Partial",
  "Most Days",
  "Settled",
];

type Question = {
  group: "The Compass" | "The Path";
  unit: string; // "Element 1" / "Step 1"
  title: string;
  subtitle: string;
  ask: string;
  scale: string[];
  prompt: string;
};

const QUESTIONS: Question[] = [
  {
    group: "The Compass",
    unit: "Element 1",
    title: "Resilience",
    subtitle: "Weathering the storms of adversity",
    ask: "How brightly is this light burning?",
    scale: COMPASS_SCALE,
    prompt:
      "Think of the hardest thing you have already survived. What carried you?",
  },
  {
    group: "The Compass",
    unit: "Element 2",
    title: "Adaptability",
    subtitle: "Navigating the rapids of change",
    ask: "How brightly is this light burning?",
    scale: COMPASS_SCALE,
    prompt: "What has already shifted in you since your loss — however small?",
  },
  {
    group: "The Compass",
    unit: "Element 3",
    title: "Optimism",
    subtitle: "Lighting the path through the darkness",
    ask: "How brightly is this light burning?",
    scale: COMPASS_SCALE,
    prompt:
      "When you imagine your life twelve months from now, what do you actually see?",
  },
  {
    group: "The Compass",
    unit: "Element 4",
    title: "Support",
    subtitle: "Weaving a net of collective strength",
    ask: "How brightly is this light burning?",
    scale: COMPASS_SCALE,
    prompt:
      "Who could hold the weight of what you’re actually carrying — have you let them?",
  },
  {
    group: "The Path",
    unit: "Step 1",
    title: "Accept",
    subtitle: "Embracing the inevitable",
    ask: "How accessible is this step right now?",
    scale: PATH_SCALE,
    prompt: "What specifically is hardest for you to accept about your loss?",
  },
  {
    group: "The Path",
    unit: "Step 2",
    title: "Reflect",
    subtitle: "Uncovering insight from grief",
    ask: "How accessible is this step right now?",
    scale: PATH_SCALE,
    prompt: "When you sit quietly with your own thoughts, what do you meet?",
  },
  {
    group: "The Path",
    unit: "Step 3",
    title: "Imagine",
    subtitle: "Defining the path forward",
    ask: "How accessible is this step right now?",
    scale: PATH_SCALE,
    prompt:
      "Is there something you’re already building, even quietly, even unnamed?",
  },
  {
    group: "The Path",
    unit: "Step 4",
    title: "Action",
    subtitle: "Catalyzing change through initiative",
    ask: "How accessible is this step right now?",
    scale: PATH_SCALE,
    prompt: "What is the smallest possible movement you could make today?",
  },
];

const emptyPlan = {
  person: "",
  goal: "",
  action1: "",
  action2: "",
  action3: "",
  checkin: "",
  sentence: "",
};

// ── 8-spoke compass radar ────────────────────────────────────────────
const CENTER = 150;
const MAX_R = 110;

function spoke(i: number) {
  return ((-90 + i * 45) * Math.PI) / 180;
}
function coord(i: number, value: number): [number, number] {
  const r = (value / 5) * MAX_R;
  return [CENTER + r * Math.cos(spoke(i)), CENTER + r * Math.sin(spoke(i))];
}
function ptsAtLevel(level: number) {
  return QUESTIONS.map((_, i) => coord(i, level).join(","))
    .join(" ");
}

function CompassRadar({ scores }: { scores: number[] }) {
  const dataPoints = scores.map((s, i) => coord(i, s).join(",")).join(" ");
  return (
    <svg
      viewBox="0 0 300 300"
      role="img"
      aria-label={`Compass and Path scores from 1 to 5: ${QUESTIONS.map(
        (q, i) => `${q.title} ${scores[i]}`,
      ).join(", ")}.`}
      className="mx-auto w-full max-w-sm"
    >
      {/* gridline rings */}
      {[1, 2, 3, 4, 5].map((lvl) => (
        <polygon
          key={lvl}
          points={ptsAtLevel(lvl)}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      {/* axes */}
      {QUESTIONS.map((_, i) => {
        const [x, y] = coord(i, 5);
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="var(--border)"
            strokeWidth="1"
          />
        );
      })}
      {/* data polygon */}
      <polygon
        points={dataPoints}
        fill="var(--brand-accent)"
        fillOpacity="0.25"
        stroke="var(--brand-primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* vertices + numbers */}
      {scores.map((s, i) => {
        const [x, y] = coord(i, s);
        const [lx, ly] = coord(i, 5.55);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill="var(--brand-primary)" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-[family-name:var(--font-display)]"
              fontSize="12"
              fontWeight="700"
              fill="var(--brand-accent-text)"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Main ─────────────────────────────────────────────────────────────
export function CompassCheck() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [plan, setPlan] = useState(emptyPlan);

  const q = QUESTIONS[current];
  const selected = answers[current];
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLast = current === QUESTIONS.length - 1;

  const priorities = useMemo(() => {
    if (answers.some((a) => a === null)) return [];
    return QUESTIONS.map((question, i) => ({ question, score: answers[i]! , i }))
      .sort((a, b) => a.score - b.score || a.i - b.i)
      .slice(0, 2);
  }, [answers]);

  function choose(value: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = value;
      return next;
    });
  }

  function reset() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setPlan(emptyPlan);
    setCurrent(0);
    setDone(false);
  }

  // ── Results ────────────────────────────────────────────────────────
  if (done) {
    const scores = answers as number[];
    return (
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
          Your compass
        </p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Here’s your honest map.
        </h3>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <CompassRadar scores={scores} />
          <ol className="space-y-2">
            {QUESTIONS.map((question, i) => {
              const isPriority = priorities.some((p) => p.i === i);
              return (
                <li
                  key={question.title}
                  className={cn(
                    "flex items-baseline justify-between gap-4 rounded-md px-3 py-2 text-sm",
                    isPriority && "bg-muted",
                  )}
                >
                  <span>
                    <span className="font-[family-name:var(--font-display)] font-bold text-brand-accent-text">
                      {i + 1}.
                    </span>{" "}
                    <span className="font-semibold">{question.title}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {question.scale[scores[i] - 1]}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Priority areas */}
        <div className="mt-10 border-t border-border pt-8">
          <h4 className="text-lg font-bold">
            The two lights asking for your attention
          </h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Not a verdict — a starting point. Build your next thirty days around
            these two.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {priorities.map((p) => (
              <div
                key={p.question.title}
                className="rounded-lg border border-border bg-muted p-5"
              >
                <p className="font-bold">{p.question.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.question.subtitle}
                </p>
                <p className="mt-3 text-sm italic leading-relaxed">
                  {p.question.prompt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Personal action plan */}
        <div className="mt-10 border-t border-border pt-8">
          <h4 className="text-lg font-bold">Your Personal Action Plan</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            The same structure the book uses. Fill what you can — there’s no
            wrong answer.
          </p>
          <div className="mt-6 space-y-5">
            <PlanField
              id="plan-person"
              label="One person to let in"
              value={plan.person}
              onChange={(v) => setPlan((p) => ({ ...p, person: v }))}
              placeholder="Who could you tell this week?"
            />
            <PlanField
              id="plan-goal"
              label="One 30-day goal"
              value={plan.goal}
              onChange={(v) => setPlan((p) => ({ ...p, goal: v }))}
              placeholder="Something specific, with a name and a deadline"
            />
            <fieldset>
              <legend className="text-sm font-semibold">
                Three concrete actions
              </legend>
              <div className="mt-2 space-y-2">
                {(["action1", "action2", "action3"] as const).map((k, idx) => (
                  <input
                    key={k}
                    aria-label={`Action ${idx + 1}`}
                    value={plan[k]}
                    onChange={(e) =>
                      setPlan((p) => ({ ...p, [k]: e.target.value }))
                    }
                    placeholder={`Action ${idx + 1}`}
                    className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                ))}
              </div>
            </fieldset>
            <PlanField
              id="plan-checkin"
              label="A 90-day check-in"
              value={plan.checkin}
              onChange={(v) => setPlan((p) => ({ ...p, checkin: v }))}
              placeholder="When will you look at this again?"
            />
            <PlanField
              id="plan-sentence"
              label="One sentence to return to"
              value={plan.sentence}
              onChange={(v) => setPlan((p) => ({ ...p, sentence: v }))}
              placeholder="The line you’ll read on the hard mornings"
            />
          </div>
          <p className="mt-6 text-sm italic text-muted-foreground">
            This plan stays in your browser for now — saving it and getting the
            worksheet by email arrive soon. For today, the noticing is the work.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  // ── Questionnaire ──────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 lg:p-10">
      {/* progress */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
        <span>
          {q.group} · {q.unit}
        </span>
        <span className="text-muted-foreground">
          {current + 1} / {QUESTIONS.length}
        </span>
      </div>
      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={QUESTIONS.length}
      >
        <div
          className="h-full rounded-full bg-brand-accent transition-all"
          style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="text-2xl font-extrabold sm:text-3xl">
          {q.title}
        </legend>
        <p className="mt-2 text-muted-foreground">{q.ask}</p>
        <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">
          {q.prompt}
        </p>

        <div className="mt-6 space-y-3">
          {q.scale.map((label, idx) => {
            const value = idx + 1;
            const isChecked = selected === value;
            return (
              <label
                key={label}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                  isChecked
                    ? "border-brand-accent bg-muted"
                    : "border-border hover:bg-muted",
                )}
              >
                <input
                  type="radio"
                  name={`q-${current}`}
                  value={value}
                  checked={isChecked}
                  onChange={() => choose(value)}
                  className="size-4 accent-[color:var(--brand-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                />
                <span className="text-sm font-semibold sm:text-base">
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Back
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={() => setDone(true)}
            disabled={answeredCount < QUESTIONS.length}
            className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            See my results
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(QUESTIONS.length - 1, c + 1))}
            disabled={selected === null}
            className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function PlanField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
      />
    </div>
  );
}
