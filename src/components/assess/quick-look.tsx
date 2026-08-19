"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ============================================================
   WHERE'S HERE? — THE QUICK LOOK (native)
   Ten honest statements. Logic + copy ported verbatim from
   Heather's tool; styling rebuilt in the site's design system.
   ============================================================ */

type PathKey = "Accept" | "Reflect" | "Imagine" | "Act";
type CompassKey = "Resilience" | "Adaptability" | "Optimism" | "Support";
type Band = "bright" | "flickering" | "faint";

const PATH_Q: Record<PathKey, string> = {
  Accept: "Where am I now?",
  Reflect: "What has carried me this far?",
  Imagine: "What could be next?",
  Act: "What is one step I can take?",
};

type Question = {
  part: "ground" | "walk" | "carry";
  key: string;
  text: string;
};

const QUESTIONS: Question[] = [
  { part: "ground", key: "Honesty", text: "I can name what happened plainly — without dressing it up, and without playing it down." },
  { part: "ground", key: "Honesty", text: "I’m willing to see where I actually am, not where I think I should be by now." },
  { part: "walk", key: "Accept", text: "I can look honestly at what happened without turning away." },
  { part: "walk", key: "Reflect", text: "I can see what has carried me through hard things before." },
  { part: "walk", key: "Imagine", text: "I can picture one believable next chapter, even faintly." },
  { part: "walk", key: "Act", text: "I’m taking small steps, even when they’re hard." },
  { part: "carry", key: "Resilience", text: "When things knock me down, I find my way back to my feet." },
  { part: "carry", key: "Adaptability", text: "When life stops following the plan, I can adjust." },
  { part: "carry", key: "Optimism", text: "I can imagine good things still ahead for me." },
  { part: "carry", key: "Support", text: "There are people I can lean on — and I let myself lean." },
];

const COMPASS_KEYS: CompassKey[] = ["Resilience", "Adaptability", "Optimism", "Support"];
const PATH_KEYS: PathKey[] = ["Accept", "Reflect", "Imagine", "Act"];

const GROUND_READ: Record<Band, string> = {
  bright: "You came here willing to look straight at it. That honesty is the ground everything else stands on.",
  flickering: "You’re getting closer to looking at this straight on. That willingness is the ground everything else stands on.",
  faint: "Looking straight at what happened is still hard — that isn’t failure, it’s where nearly everyone starts. Honesty is ground that can be practised.",
};

const PATH_STAND: Record<PathKey | "motion", string> = {
  Accept: "The honest look comes first — because nothing can be built on a truth you haven’t let land. The fact that you’re here says you’re ready to take it.",
  Reflect: "You’ve let the truth land. Now look at what has carried you this far — what came through with you, and who was there when it did.",
  Imagine: "You’ve done the honest looking. Now turn around — one believable next chapter, even faintly. It isn’t betrayal. It is what the change makes room for.",
  Act: "You can see a next chapter. Now it becomes real — one small move, then another. Not a leap. A step.",
  motion: "All four questions are answered and alive in you — you’re looking honestly, drawing on what carried you, picturing what’s next, and taking the step. Keep going.",
};

const RECOG: Record<CompassKey, string> = {
  Resilience: "You have come through before. That is not luck — that is something in you.",
  Adaptability: "When the plan changed, you changed with it. You can do that again.",
  Optimism: "Somewhere in you is the ability to picture one good day ahead. It’s still there.",
  Support: "You were never meant to do this alone — and you don’t have to.",
};

function scoreFor(key: string, answers: number[]): number {
  const vals = QUESTIONS.map((q, i) => (q.key === key ? answers[i] : null)).filter(
    (v): v is number => v !== null && v !== undefined,
  );
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
function band(avg: number): Band {
  return avg >= 4 ? "bright" : avg >= 3 ? "flickering" : "faint";
}

/* ---------- SVGs (ported; colours via scoped CSS vars) ---------- */
function compassSVG(avgs: Record<string, number>): string {
  const cx = 230, cy = 190;
  const dirs: Record<CompassKey, [number, number]> = {
    Resilience: [0, -1], Adaptability: [1, 0], Optimism: [0, 1], Support: [-1, 0],
  };
  const labelPos: Record<CompassKey, [number, number]> = {
    Resilience: [230, 22], Adaptability: [346, 236], Optimism: [230, 342], Support: [114, 236],
  };
  const statePos: Record<CompassKey, [number, number]> = {
    Resilience: [230, 38], Adaptability: [346, 252], Optimism: [230, 358], Support: [114, 252],
  };
  const len = (b: Band) => (b === "bright" ? 104 : b === "flickering" ? 76 : 48);
  const op = (b: Band) => (b === "bright" ? 1 : b === "flickering" ? 0.65 : 0.3);
  let points = "";
  for (const k of COMPASS_KEYS) {
    const [dx, dy] = dirs[k];
    const b = band(avgs[k]);
    const L = len(b);
    const tipx = cx + dx * L, tipy = cy + dy * L;
    const bx = 13 * dy, by = 13 * dx;
    const cls = b === "flickering" ? 'class="ql-flicker"' : "";
    const stateWord = b === "bright" ? "a real strength" : b === "flickering" ? "gathering strength" : "needs strengthening";
    const lp = labelPos[k], sp = statePos[k];
    points += `
      <path d="M${tipx},${tipy} L${cx + bx},${cy + by} L${cx - bx},${cy - by} Z" ${cls}
        fill="var(--ql-blue)" fill-opacity="${op(b)}" stroke="var(--ql-navy)" stroke-width="1.6" stroke-linejoin="round"/>
      <text x="${lp[0]}" y="${lp[1]}" text-anchor="middle" class="ql-lab">${k.toUpperCase()}</text>
      <text x="${sp[0]}" y="${sp[1]}" text-anchor="middle" class="ql-state">${stateWord}</text>`;
  }
  const ticks = ([[1, -1], [1, 1], [-1, 1], [-1, -1]] as [number, number][])
    .map(([tx, ty]) => {
      const u = 0.7071;
      return `<line x1="${cx + tx * u * 104}" y1="${cy + ty * u * 104}" x2="${cx + tx * u * 116}" y2="${cy + ty * u * 116}"
        stroke="var(--ql-navy)" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/>`;
    })
    .join("");
  return `
  <svg viewBox="0 0 460 372" role="img" aria-label="Your compass: four strengths — the longer the point, the stronger it stands" style="width:min(360px,84vw);height:auto;display:block">
    <circle cx="${cx}" cy="${cy}" r="116" fill="none" stroke="var(--ql-navy)" stroke-opacity=".18" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="96" fill="none" stroke="var(--ql-navy)" stroke-opacity=".1" stroke-width="1"/>
    ${ticks}${points}
    <circle cx="${cx}" cy="${cy}" r="10" fill="#fff" stroke="var(--ql-navy)" stroke-opacity=".55" stroke-width="1.6"/>
    <circle cx="${cx}" cy="${cy}" r="3.2" fill="var(--ql-navy)"/>
  </svg>`;
}

function mapSVG(step: PathKey | "motion"): string {
  const stepIndex = step === "motion" ? 4 : PATH_KEYS.indexOf(step);
  const pts: Record<PathKey, [number, number]> = {
    Accept: [120, 308], Reflect: [290, 236], Imagine: [455, 300], Act: [605, 206],
  };
  const labelDy: Record<PathKey, number> = { Accept: 30, Reflect: -50, Imagine: 30, Act: 30 };
  const route = `
    <path d="M56,346 C86,332 100,318 120,308 C175,288 240,262 290,236 C350,208 400,276 455,300 C512,322 560,240 605,206 C625,190 640,184 660,176"
      fill="none" stroke="var(--ql-navy)" stroke-opacity=".55" stroke-width="2.4" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  let marks = "";
  PATH_KEYS.forEach((k, i) => {
    const [x, y] = pts[k];
    const state = k === step ? "here" : i < stepIndex ? "behind" : "ahead";
    const ly = y + labelDy[k];
    const sy = ly + 16;
    if (state === "here") {
      marks += `
        <ellipse cx="${x}" cy="${y + 4}" rx="26" ry="9" fill="var(--ql-blue)" opacity=".18"/>
        <circle cx="${x}" cy="${y}" r="5.5" fill="var(--ql-navy)"/>
        <path d="M${x},${y - 42} c-10,0 -17,7.5 -17,16.5 c0,12.5 17,25.5 17,25.5 c0,0 17,-13 17,-25.5 c0,-9 -7,-16.5 -17,-16.5 z"
          fill="var(--ql-blue)" stroke="var(--ql-navy)" stroke-width="2"/>
        <circle cx="${x}" cy="${y - 26}" r="5.5" fill="#fff"/>`;
    } else if (state === "behind") {
      marks += `
        <circle cx="${x}" cy="${y}" r="7.5" fill="var(--ql-blue)" stroke="var(--ql-navy)" stroke-width="2"/>
        <path d="M${x - 3.4},${y} l2.4,2.8 l4.6,-5.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else {
      marks += `<circle cx="${x}" cy="${y}" r="7" fill="#fff" stroke="var(--ql-faint)" stroke-width="2"/>`;
    }
    const nameFill = state === "ahead" ? "var(--ql-faint)" : "var(--ql-navy)";
    marks += `
      <text x="${x}" y="${ly}" text-anchor="middle" class="ql-lab" style="fill:${nameFill}">${k}</text>
      <text x="${x}" y="${sy}" text-anchor="middle" class="ql-state">${
        state === "here" ? "you are here" : state === "behind" ? "taken" : "ahead"
      }</text>`;
  });
  return `
  <svg viewBox="0 96 700 324" role="img" aria-label="Your map: the route through the four questions with a pin where you stand" style="width:100%;height:auto;display:block">
    <rect x="8" y="104" width="684" height="308" rx="14" fill="#fff" stroke="var(--ql-navy)" stroke-opacity=".3" stroke-width="2"/>
    ${route}${marks}
  </svg>`;
}

const scopeStyle: React.CSSProperties = {
  ["--ql-navy" as string]: "#0d2741",
  ["--ql-blue" as string]: "#0ca1d9",
  ["--ql-faint" as string]: "#64748b",
};

export function QuickLook() {
  const [phase, setPhase] = useState<"intro" | "questions" | "results">("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const idx = answers.length;

  function start() {
    setAnswers([]);
    setPhase("questions");
  }
  function answer(n: number) {
    const next = [...answers, n];
    setAnswers(next);
    if (next.length >= QUESTIONS.length) setPhase("results");
  }
  function goBack() {
    if (idx > 0) setAnswers(answers.slice(0, -1));
  }

  /* ---------- INTRO ---------- */
  if (phase === "intro") {
    return (
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
              Free · Ten honest statements · About two minutes
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
              From here, forward. But first — where’s here?
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">
              Ten statements. Two minutes. No right answers, no timeline, no one
              keeping score.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed">
              Just a quick, honest look at where you’re standing.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={start}
                className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Take the quick look →
              </button>
            </div>
          </div>
          <div>
            <Image
              src="/assets/assess/wheres-here-map.png"
              alt="A person reading a map with a marked route and a flag on the horizon — an honest look at where they’re standing"
              width={1254}
              height={1254}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="mx-auto w-full max-w-md"
            />
          </div>
        </div>
      </section>
    );
  }

  /* ---------- QUESTIONS ---------- */
  if (phase === "questions") {
    const q = QUESTIONS[idx];
    const pct = Math.round((idx / QUESTIONS.length) * 100);
    const label =
      q.part === "ground" ? "An honest look" : q.part === "walk" ? PATH_Q[q.key as PathKey] : "";
    return (
      <section className="mx-auto max-w-2xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20">
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand-accent transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {label ? (
            <>
              <span className="text-brand-accent-text">{label}</span> ·{" "}
            </>
          ) : null}
          {idx + 1} of {QUESTIONS.length}
        </p>
        <p className="mt-3 text-2xl font-bold leading-snug text-primary sm:text-3xl">
          “{q.text}”
        </p>
        {idx === 0 ? (
          <p className="mt-3 text-base italic text-muted-foreground">
            How true is this for you — right now, in this season?
          </p>
        ) : null}
        <div className="mt-8 flex gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => answer(n)}
              aria-label={`${n} out of 5`}
              className="flex-1 rounded-lg border border-border bg-card py-4 text-xl font-bold text-primary transition-all hover:-translate-y-0.5 hover:border-brand-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-sm italic text-muted-foreground">
          <span>Not at all like me right now</span>
          <span>Very much like me right now</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm italic text-muted-foreground">
          {idx > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="underline underline-offset-4 hover:text-foreground"
            >
              ← Change my previous answer
            </button>
          ) : null}
          <button
            type="button"
            onClick={start}
            className="underline underline-offset-4 hover:text-foreground"
          >
            Start again from the beginning
          </button>
        </div>
      </section>
    );
  }

  /* ---------- RESULTS ---------- */
  const avgs: Record<string, number> = {};
  [...COMPASS_KEYS, ...PATH_KEYS].forEach((k) => (avgs[k] = scoreFor(k, answers)));
  const ground = band(scoreFor("Honesty", answers));

  let step: PathKey | "motion" = "motion";
  for (const k of PATH_KEYS) {
    if (avgs[k] < 4) {
      step = k;
      break;
    }
  }

  let brightest: CompassKey = COMPASS_KEYS[0];
  for (const k of COMPASS_KEYS) if (avgs[k] > avgs[brightest]) brightest = k;
  const allEqual = COMPASS_KEYS.every((k) => avgs[k] === avgs[COMPASS_KEYS[0]]);

  const pathHeading =
    step === "motion" ? "You’re in motion." : `You’re standing at “${PATH_Q[step]}”.`;

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20" style={scopeStyle}>
      <style>{`
        .ql-lab{font-family:var(--font-display),sans-serif;font-weight:700;font-size:13px;letter-spacing:.06em;fill:var(--ql-navy)}
        .ql-state{font-style:italic;font-size:12.5px;fill:var(--ql-faint)}
        .ql-flicker{animation:qlflicker 2.6s ease-in-out infinite}
        @keyframes qlflicker{0%,100%{opacity:.55}45%{opacity:.85}60%{opacity:.5}75%{opacity:.75}}
        @media (prefers-reduced-motion:reduce){.ql-flicker{animation:none;opacity:.65}}
      `}</style>

      <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
        Your quick reading · this season
      </p>
      <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
        Here’s where you are — honestly, and without a score.
      </h2>
      <p className="mt-5 leading-relaxed text-muted-foreground">{GROUND_READ[ground]}</p>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        You’ve just walked two things without being told their names. The Path —
        the four questions, the ground you’re covering. The Compass — the four
        strengths you draw on as you go.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-card p-6 sm:p-8">
        <h3 className="text-lg font-bold">At a glance</h3>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: mapSVG(step) }}
        />
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The trail runs through the four questions — the pin marks where you’re
          standing.
        </p>
        <p className="mt-3 leading-relaxed">
          <span className="font-semibold">{pathHeading}</span> {PATH_STAND[step]}
        </p>
      </div>

      <p className="mt-10 text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
        The Compass
      </p>
      <p className="mt-2 leading-relaxed text-muted-foreground">
        Four strengths, one name — your Compass. The longer the point, the
        stronger it stands.
      </p>
      <div
        className="mt-4 flex justify-center"
        dangerouslySetInnerHTML={{ __html: compassSVG(avgs) }}
      />
      <p className="mt-4 leading-relaxed">
        {allEqual ? (
          "Your four points are standing level — whichever you reach for, it will hold."
        ) : (
          <>
            Your longest point right now is{" "}
            <span className="font-semibold text-primary">{brightest}</span>.{" "}
            {RECOG[brightest]}
          </>
        )}
      </p>

      <p className="mt-6 italic text-muted-foreground">
        The setback wasn’t your choice. The next step is.
      </p>

      <div className="mt-10 rounded-lg border-2 border-brand-accent bg-card p-6 sm:p-8">
        <h3 className="text-xl font-bold">
          This is the surface. The full reading goes deeper.
        </h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          The complete Where’s Here? assessment lives inside All In — twenty-four
          statements, your full map, a reading of every strength and every step,
          what to do next, and the chance to watch it all change, season by
          season.
        </p>
        <div className="mt-6">
          <Link
            href="/all-in"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Go all in →
          </Link>
        </div>
      </div>

      <p className="mt-10 text-center text-xs font-bold uppercase tracking-[0.16em] text-brand-accent-text">
        From here, forward.
      </p>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={start}
          className="text-sm italic text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Take the quick look again
        </button>
      </div>

      <p className="mt-8 text-center font-[family-name:var(--font-display)] font-bold text-primary">
        Setbacks don’t get the last word.
      </p>
    </section>
  );
}
