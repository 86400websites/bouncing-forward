"use client";

import { useEffect, useState } from "react";

/* ============================================================
   THE FULL ASSESSMENT (All In)
   Twenty-four honest statements · about five minutes.
   Logic, copy, and visuals ported verbatim from Heather's
   All_In_Full_Assessment.html; styling rebuilt in the site's
   design system. First completion asks for an email once
   (client-side only — nothing is stored on the site); after
   that, retakes are unlimited.
   ============================================================ */

type PathKey = "Accept" | "Reflect" | "Imagine" | "Act";
type CompassKey = "Resilience" | "Adaptability" | "Optimism" | "Support";
type Key = PathKey | CompassKey;
type Band = "bright" | "flickering" | "faint";

const UNLOCK_KEY = "bf-allin-open";
const RESULT_KEY = "bf-fa-result"; // the saved reading: 24 answers, replaced on retake

const PATH_Q: Record<PathKey, string> = {
  Accept: "Where am I now?",
  Reflect: "What has carried me this far?",
  Imagine: "What could be next?",
  Act: "What is one step I can take?",
};

const RECOG: Record<CompassKey, string> = {
  Resilience:
    "You have come through before. That is not luck - that is something in you.",
  Adaptability:
    "When the plan changed, you changed with it. You can do that again.",
  Optimism:
    "Somewhere in you is the ability to picture one good day ahead. It’s still there.",
  Support: "You were never meant to do this alone - and you don’t have to.",
};

type Question = { part: "walk" | "carry"; key: Key; text: string };

const QUESTIONS: Question[] = [
  {
    part: "walk",
    key: "Accept",
    text: "I can look honestly at what happened without turning away.",
  },
  {
    part: "walk",
    key: "Accept",
    text: "I’ve stopped spending my energy fighting the fact that it happened.",
  },
  {
    part: "walk",
    key: "Accept",
    text: "I spend less time in the what-ifs than I used to.",
  },
  {
    part: "walk",
    key: "Reflect",
    text: "I can see what has carried me through hard things before.",
  },
  {
    part: "walk",
    key: "Reflect",
    text: "I can think about what this setback means for me without needing to distract myself.",
  },
  {
    part: "walk",
    key: "Reflect",
    text: "I know who was there when I came through before — and what that tells me.",
  },
  {
    part: "walk",
    key: "Imagine",
    text: "I can picture one believable next chapter, even faintly.",
  },
  {
    part: "walk",
    key: "Imagine",
    text: "What I want next is connected to the people and things that matter most to me.",
  },
  {
    part: "walk",
    key: "Imagine",
    text: "Planning forward feels like honouring what changed, not betraying it.",
  },
  {
    part: "walk",
    key: "Act",
    text: "I’m taking small steps, even when they’re hard.",
  },
  { part: "walk", key: "Act", text: "I can start before I feel ready." },
  {
    part: "walk",
    key: "Act",
    text: "When the plan breaks, I stay committed to the purpose.",
  },
  {
    part: "carry",
    key: "Resilience",
    text: "When things knock me down, I find my way back to my feet.",
  },
  {
    part: "carry",
    key: "Resilience",
    text: "I can admit when I’m not fine, instead of performing being fine.",
  },
  {
    part: "carry",
    key: "Resilience",
    text: "When I doubt myself, I remember the hard things I have already come through.",
  },
  {
    part: "carry",
    key: "Adaptability",
    text: "When life stops following the plan, I can adjust.",
  },
  {
    part: "carry",
    key: "Adaptability",
    text: "I’m letting my sense of who I am shift, rather than forcing the old shape to fit.",
  },
  {
    part: "carry",
    key: "Adaptability",
    text: "I’ve kept at least one new door open that wasn’t open before.",
  },
  {
    part: "carry",
    key: "Optimism",
    text: "I can imagine good things still ahead for me.",
  },
  {
    part: "carry",
    key: "Optimism",
    text: "I can separate how I feel today from the story of my whole life.",
  },
  {
    part: "carry",
    key: "Optimism",
    text: "I hold a quiet belief that something good can still come from this.",
  },
  {
    part: "carry",
    key: "Support",
    text: "There are people I can lean on — and I let myself lean.",
  },
  {
    part: "carry",
    key: "Support",
    text: "I can say what I actually need, instead of hoping people will guess.",
  },
  {
    part: "carry",
    key: "Support",
    text: "I let myself receive care as readily as I give it.",
  },
];

const COMPASS_KEYS: CompassKey[] = [
  "Resilience",
  "Adaptability",
  "Optimism",
  "Support",
];
const PATH_KEYS: PathKey[] = ["Accept", "Reflect", "Imagine", "Act"];

const ICONS: Record<Key, string> = {
  Accept: "/assets/assess/full/accept.webp",
  Reflect: "/assets/assess/full/reflect.webp",
  Imagine: "/assets/assess/full/imagine.webp",
  Act: "/assets/assess/full/act.webp",
  Resilience: "/assets/assess/full/resilience.webp",
  Adaptability: "/assets/assess/full/adaptability.webp",
  Optimism: "/assets/assess/full/optimism.webp",
  Support: "/assets/assess/full/support.webp",
};

type Report = { state: string; read: string; tend: string };
const REPORTS: Record<
  Key,
  { is: string; bright: Report; flickering: Report; faint: Report }
> = {
  Resilience: {
    is: RECOG.Resilience,
    bright: {
      state: "a real strength",
      read: "Hard days pass, and you keep finding your feet. What you are doing is working.",
      tend: "Before you say you’re fine, keep checking whether you are.",
    },
    flickering: {
      state: "gathering strength",
      read: "Some days you find your footing, some days you don’t. That is what carrying real weight looks like - not failure.",
      tend: "One small routine, kept daily. Rhythm rebuilds more than willpower.",
    },
    faint: {
      state: "needs strengthening",
      read: "Getting up is taking everything you have right now. That is the weight of the setback, not a failure.",
      tend: "One small kept promise a day - and let one person see how heavy it is.",
    },
  },
  Adaptability: {
    is: RECOG.Adaptability,
    bright: {
      state: "a real strength",
      read: "You are bending without breaking - letting the picture of your future update.",
      tend: "Keep one new door open - a conversation, a direction, a person.",
    },
    flickering: {
      state: "gathering strength",
      read: "Part of you is adjusting; part is still rebuilding what was. That is loyalty, not stubbornness.",
      tend: "Change one small thing on purpose this week.",
    },
    faint: {
      state: "needs strengthening",
      read: "The new shape of life still feels wrong to the touch. Your adapting will take as long as it takes.",
      tend: "Ask: what from before still fits who I am now?",
    },
  },
  Optimism: {
    is: RECOG.Optimism,
    bright: {
      state: "a real strength",
      read: "You can separate how today feels from the story of your whole life. Keep practising it.",
      tend: "One observation a day: what, today, quietly went well?",
    },
    flickering: {
      state: "gathering strength",
      read: "Some days the road is visible; some days it closes over. The work is simply not to close the door.",
      tend: "Borrow a living example - someone who has carried this and come through.",
    },
    faint: {
      state: "needs strengthening",
      read: "The future is hard to picture right now. That is the setback’s doing, not yours.",
      tend: "Once a day, name one small thing that still worked.",
    },
  },
  Support: {
    is: RECOG.Support,
    bright: {
      state: "a real strength",
      read: "Care is flowing both ways. You are carrying this as a shared weight, not a private one.",
      tend: "Thank one person whose support has carried you: what you did mattered.",
    },
    flickering: {
      state: "gathering strength",
      read: "You have people - and you are half letting them in. Your weight is not too heavy to share.",
      tend: "Tell one person what you actually need this week.",
    },
    faint: {
      state: "needs strengthening",
      read: "You may be carrying this far more alone than you need to.",
      tend: "One message to one person - just to not be alone in it.",
    },
  },
  Accept: {
    is: "An honest look at where you’re standing. Not where you were. Not where you think you should be by now.",
    bright: {
      state: "steady underfoot",
      read: "You can look at what happened without turning away - and spend your energy on what begins from here.",
      tend: "One true sentence a day: this happened, and it is part of my life now.",
    },
    flickering: {
      state: "partly taken",
      read: "Most days you can look at it; some days the what-ifs pull you back.",
      tend: "Swap the question: not “why did this happen?” but “who am I, going forward?”",
    },
    faint: {
      state: "still ahead",
      read: "Part of you hasn’t yet let it land. That is often a form of love, not a problem to solve.",
      tend: "Once a day, say one true thing about what happened - no comfort after it.",
    },
  },
  Reflect: {
    is: "You have come through hard things before. Look at how - and at who was there when you did.",
    bright: {
      state: "steady underfoot",
      read: "You can sit with what happened and ask the question that gives it direction: what does this ask of me?",
      tend: "Keep a weekly pause: what happened, what carried me, what next?",
    },
    flickering: {
      state: "partly taken",
      read: "You reflect - and sometimes you circle the same place without arriving.",
      tend: "At day’s end: what did I feel today that I didn’t say out loud? Write it down.",
    },
    faint: {
      state: "still ahead",
      read: "Stillness feels threatening right now - but what we avoid, we cannot use.",
      tend: "Five minutes, once this week: sit, and name what you meet.",
    },
  },
  Imagine: {
    is: "Not the perfect future. One believable one.",
    bright: {
      state: "steady underfoot",
      read: "You can hold a direction - and your goals carry faces, not just ambitions.",
      tend: "Every so often, ask: does this still honour the reason I began?",
    },
    flickering: {
      state: "partly taken",
      read: "A next chapter appears and disappears. Planning forward isn’t betrayal - it is what the change makes room for.",
      tend: "Write one sentence: something you want to be different in six months.",
    },
    faint: {
      state: "still ahead",
      read: "The future feels far away right now. Don’t reach for the horizon yet - reach for a direction.",
      tend: "Name the smallest true want: one call, one conversation, one walk.",
    },
  },
  Act: {
    is: "Small enough to do today. Real enough to count.",
    bright: {
      state: "steady underfoot",
      read: "You are moving - beginning before you feel ready, adjusting as you go. Momentum is made, not waited for.",
      tend: "Mark the milestones no one else can see.",
    },
    flickering: {
      state: "partly taken",
      read: "You move in bursts, then stall. Every so often, stop and ask: what is this for?",
      tend: "When you stall, do the next smallest thing - this hour, not tomorrow.",
    },
    faint: {
      state: "still ahead",
      read: "You may be waiting to feel ready - readiness rarely arrives on its own. Ask: is this rest, or is it frozen?",
      tend: "One small thing today. Not a plan - a movement.",
    },
  },
};

const PATH_STAND: Record<PathKey | "motion", string> = {
  Accept:
    "The honest look comes first - and being here says you’re ready to take it.",
  Reflect:
    "You’ve let the truth land. Now look at what has carried you this far.",
  Imagine:
    "You’ve done the honest looking. Now picture one believable next chapter, even faintly.",
  Act: "You can see a next chapter. Now one small move, then another - not a leap, a step.",
  motion: "All four questions are alive in you. Keep going.",
};

/* ---------------- scoring ---------------- */
function avgFor(key: Key, answers: number[]): number {
  const vals = QUESTIONS.map((q, i) =>
    q.key === key ? answers[i] : null,
  ).filter((v): v is number => v !== null && v !== undefined);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
function band(avg: number): Band {
  return avg >= 4 ? "bright" : avg >= 3 ? "flickering" : "faint";
}

/* ---------------- SVGs (ported; colours via scoped CSS vars) ---------------- */
function compassSVG(avgs: Record<string, number>): string {
  const cx = 300,
    cy = 222,
    R = 132;
  const reach = (b: Band) =>
    b === "bright" ? 112 : b === "flickering" ? 78 : 46;
  const dirs: Record<
    CompassKey,
    [number, number, string, number, number, number]
  > = {
    Resilience: [0, -1, "middle", 0, -R - 30, -R - 12],
    Adaptability: [1, 0, "start", R + 14, -2, 16],
    Optimism: [0, 1, "middle", 0, R + 34, R + 51],
    Support: [-1, 0, "end", -R - 14, -2, 16],
  };
  let ticks = "";
  for (let a = 0; a < 360; a += 15) {
    const rad = (a * Math.PI) / 180,
      long = a % 90 === 0;
    const r1 = R - (long ? 16 : 8),
      r2 = R - 1;
    ticks += `<line x1="${(cx + Math.sin(rad) * r1).toFixed(1)}" y1="${(cy - Math.cos(rad) * r1).toFixed(1)}" x2="${(cx + Math.sin(rad) * r2).toFixed(1)}" y2="${(cy - Math.cos(rad) * r2).toFixed(1)}" stroke="var(--fa-navy)" stroke-opacity="${long ? ".45" : ".2"}" stroke-width="${long ? 1.6 : 1}"/>`;
  }
  let points = "";
  for (const k of COMPASS_KEYS) {
    const [dx, dy] = dirs[k];
    const b = band(avgs[k]);
    const L = reach(b);
    const o = b === "bright" ? 1 : b === "flickering" ? 0.72 : 0.4;
    const w = 15;
    const tx = cx + dx * L,
      ty = cy + dy * L;
    const px = -dy * w,
      py = dx * w;
    points += `
      <path d="M${tx},${ty} L${cx + px},${cy + py} L${cx},${cy} Z" fill="var(--fa-navy)" fill-opacity="${o}"/>
      <path d="M${tx},${ty} L${cx - px},${cy - py} L${cx},${cy} Z" fill="var(--fa-blue)" fill-opacity="${o}"/>
      <path d="M${tx},${ty} L${cx + px},${cy + py} L${cx},${cy} L${cx - px},${cy - py} Z" fill="none" stroke="var(--fa-navy)" stroke-width="1.5" stroke-linejoin="round"/>`;
  }
  let labels = "";
  for (const k of COMPASS_KEYS) {
    const d = dirs[k];
    const anchor = d[2],
      lx = d[3],
      ly = d[4],
      sy = d[5];
    const b = band(avgs[k]);
    const stateWord =
      b === "bright"
        ? "a real strength"
        : b === "flickering"
          ? "gathering strength"
          : "needs strengthening";
    labels += `
      <text x="${cx + lx}" y="${cy + ly}" text-anchor="${anchor}" class="fa-lab">${k.toUpperCase()}</text>
      <text x="${cx + lx}" y="${cy + sy}" text-anchor="${anchor}" class="fa-state">${stateWord}</text>`;
  }
  return `
  <svg viewBox="0 0 600 480" role="img" aria-label="Your compass: four points, each reaching as far as that strength currently stands" style="width:min(560px,100%);height:auto;display:block;margin:0 auto">
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="var(--fa-navy)" stroke-opacity=".35" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${R - 20}" fill="none" stroke="var(--fa-navy)" stroke-opacity=".12" stroke-width="1"/>
    ${ticks}${points}
    <circle cx="${cx}" cy="${cy}" r="7" fill="#fff" stroke="var(--fa-navy)" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="2.4" fill="var(--fa-navy)"/>
    ${labels}
  </svg>`;
}

function waypoint(
  x: number,
  y: number,
  k: string,
  state: "here" | "behind" | "ahead",
  labelSide?: "right",
): string {
  let m = "";
  if (state === "here") {
    m += `
      <ellipse cx="${x}" cy="${y + 4}" rx="26" ry="9" fill="var(--fa-blue)" opacity=".18"/>
      <circle cx="${x}" cy="${y}" r="5.5" fill="var(--fa-navy)"/>
      <path d="M${x},${y - 42} c-10,0 -17,7.5 -17,16.5 c0,12.5 17,25.5 17,25.5 c0,0 17,-13 17,-25.5 c0,-9 -7,-16.5 -17,-16.5 z" fill="var(--fa-blue)" stroke="var(--fa-navy)" stroke-width="2"/>
      <circle cx="${x}" cy="${y - 26}" r="5.5" fill="#fff"/>
      <line x1="${x + 26}" y1="${y + 2}" x2="${x + 26}" y2="${y - 30}" stroke="var(--fa-navy)" stroke-width="2"/>
      <path d="M${x + 26},${y - 30} l22,7 l-22,7 z" fill="var(--fa-blue)" stroke="var(--fa-navy)" stroke-width="1.6" stroke-linejoin="round"/>`;
  } else if (state === "behind") {
    m += `
      <circle cx="${x}" cy="${y}" r="7.5" fill="var(--fa-blue)" stroke="var(--fa-navy)" stroke-width="2"/>
      <path d="M${x - 3.4},${y} l2.4,2.8 l4.6,-5.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else {
    m += `<circle cx="${x}" cy="${y}" r="7" fill="#fff" stroke="var(--fa-faint)" stroke-width="2"/>`;
  }
  const nameFill = state === "ahead" ? "var(--fa-faint)" : "var(--fa-navy)";
  let lx: number, anchor: string, ly1: number, ly2: number;
  if (state === "here") {
    lx = x;
    anchor = "middle";
    ly1 = y + 34;
    ly2 = y + 50;
  } else if (labelSide === "right") {
    lx = x + 18;
    anchor = "start";
    ly1 = y - 4;
    ly2 = y + 15;
  } else {
    lx = x;
    anchor = "middle";
    ly1 = y + 26;
    ly2 = y + 42;
  }
  m += `
    <text x="${lx}" y="${ly1}" text-anchor="${anchor}" class="fa-lab" style="fill:${nameFill}">${k}</text>
    <text x="${lx}" y="${ly2}" text-anchor="${anchor}" class="fa-state">${state === "here" ? "you are here" : state === "behind" ? "taken" : "ahead"}</text>`;
  return m;
}

function mapSVG(step: PathKey | "motion"): string {
  const stepIndex = step === "motion" ? 4 : PATH_KEYS.indexOf(step);
  const pts: Record<PathKey, [number, number]> = {
    Accept: [120, 226],
    Reflect: [290, 152],
    Imagine: [455, 218],
    Act: [605, 124],
  };
  const labelDy: Record<PathKey, number> = {
    Accept: 30,
    Reflect: -50,
    Imagine: 30,
    Act: 30,
  };
  const route = `
    <path d="M52,264 C82,250 98,236 120,226 C175,206 240,180 290,152 C350,124 400,194 455,218 C512,240 560,158 605,124 C625,108 642,100 662,94" fill="none" stroke="var(--fa-navy)" stroke-opacity=".55" stroke-width="2.4" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  let marks = "";
  PATH_KEYS.forEach((k, i) => {
    const [x, y] = pts[k];
    const state = k === step ? "here" : i < stepIndex ? "behind" : "ahead";
    if (state === "here") {
      marks += waypoint(x, y, k, "here");
    } else {
      const ly = y + labelDy[k];
      const sy = ly + (labelDy[k] > 0 ? 16 : -16);
      marks +=
        state === "behind"
          ? `<circle cx="${x}" cy="${y}" r="7.5" fill="var(--fa-blue)" stroke="var(--fa-navy)" stroke-width="2"/><path d="M${x - 3.4},${y} l2.4,2.8 l4.6,-5.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
          : `<circle cx="${x}" cy="${y}" r="7" fill="#fff" stroke="var(--fa-faint)" stroke-width="2"/>`;
      const nameFill = state === "ahead" ? "var(--fa-faint)" : "var(--fa-navy)";
      marks += `
      <text x="${x}" y="${ly}" text-anchor="middle" class="fa-lab" style="fill:${nameFill}">${k}</text>
      <text x="${x}" y="${sy}" text-anchor="middle" class="fa-state">${state === "behind" ? "taken" : "ahead"}</text>`;
    }
  });
  if (step === "motion") {
    marks += `
      <path d="M672,88 l-4,15 l-10,-9 z" fill="var(--fa-blue)" stroke="var(--fa-navy)" stroke-width="1.6" stroke-linejoin="round"/>
      <text x="628" y="76" text-anchor="middle" class="fa-state">still moving</text>`;
  }
  return `
  <svg viewBox="0 0 700 310" role="img" aria-label="Your map: the route through the four questions, with a pin marking where you stand" style="width:100%;height:auto;display:block">
    <rect x="8" y="8" width="684" height="294" rx="14" fill="#fff" stroke="var(--fa-navy)" stroke-opacity=".3" stroke-width="2"/>
    ${route}${marks}
  </svg>`;
}

function mapSVGMobile(step: PathKey | "motion"): string {
  const stepIndex = step === "motion" ? 4 : PATH_KEYS.indexOf(step);
  const pts: Record<PathKey, [number, number]> = {
    Accept: [76, 86],
    Reflect: [204, 206],
    Imagine: [76, 326],
    Act: [204, 446],
  };
  const route = `
    <path d="M50,64 C64,72 68,80 76,86 C120,116 168,176 204,206 C240,236 112,296 76,326 C40,356 168,416 204,446 C222,461 236,470 254,480" fill="none" stroke="var(--fa-navy)" stroke-opacity=".55" stroke-width="2.4" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  let marks = "";
  PATH_KEYS.forEach((k, i) => {
    const [x, y] = pts[k];
    const state = k === step ? "here" : i < stepIndex ? "behind" : "ahead";
    marks += waypoint(x, y, k, state, "right");
  });
  if (step === "motion") {
    marks += `
      <path d="M262,468 l16,-2 l-6,15 z" fill="var(--fa-blue)" stroke="var(--fa-navy)" stroke-width="1.6" stroke-linejoin="round"/>
      <text x="234" y="500" text-anchor="middle" class="fa-state">still moving</text>`;
  }
  return `
  <svg viewBox="0 0 300 520" role="img" aria-label="Your map: the route through the four questions, with a pin marking where you stand" style="width:min(320px,100%);height:auto;display:block;margin:0 auto">
    <rect x="6" y="6" width="288" height="508" rx="14" fill="#fff" stroke="var(--fa-navy)" stroke-opacity=".3" stroke-width="2"/>
    ${route}${marks}
  </svg>`;
}

const scopeStyle: React.CSSProperties = {
  ["--fa-navy" as string]: "#0d2741",
  ["--fa-blue" as string]: "#0ca1d9",
  ["--fa-faint" as string]: "#64748b",
};

/* ---------------- report block ---------------- */
function ReportBlock({
  k,
  isPath,
  answers,
}: {
  k: Key;
  isPath: boolean;
  answers: number[];
}) {
  const avg = avgFor(k, answers);
  const b = band(avg);
  const R = REPORTS[k][b];
  return (
    <div className="border-border bg-card rounded-lg border p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-lg leading-snug font-bold">
          {isPath ? PATH_Q[k as PathKey] : k}{" "}
          <span className="text-brand-accent-text text-sm font-semibold whitespace-nowrap">
            · {isPath ? `${k} · ` : ""}
            {R.state}
          </span>
        </h4>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ICONS[k]} alt="" className="size-12 shrink-0 rounded-md" />
      </div>
      <p className="text-muted-foreground mt-2 text-sm italic">
        {REPORTS[k].is}
      </p>
      <div
        className="bg-muted mt-3 h-2 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={`${k}: ${R.state}`}
      >
        <div
          className={`h-full rounded-full ${isPath ? "bg-primary/70" : "bg-brand-accent"}`}
          style={{ width: `${Math.round((avg / 5) * 100)}%` }}
        />
      </div>
      <p className="mt-3 leading-relaxed">{R.read}</p>
    </div>
  );
}

/* ================================================================
   COMPONENT
   ================================================================ */
export function FullAssessment() {
  const [phase, setPhase] = useState<
    "intro" | "part" | "questions" | "gate" | "results"
  >("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [justUnlocked, setJustUnlocked] = useState(false);
  const idx = answers.length;

  useEffect(() => {
    try {
      const open = window.localStorage.getItem(UNLOCK_KEY) === "1";
      if (open) setUnlocked(true);
      if (open) {
        const raw = window.localStorage.getItem(RESULT_KEY);
        const saved: unknown = raw ? JSON.parse(raw) : null;
        if (
          Array.isArray(saved) &&
          saved.length === QUESTIONS.length &&
          saved.every((v) => typeof v === "number" && v >= 1 && v <= 5)
        ) {
          // The marker holds their last reading — show it, not the intro.
          setAnswers(saved as number[]);
          setPhase("results");
        }
      }
    } catch {
      /* private mode — treat as first visit */
    }
  }, []);

  function persistResult(a: number[]) {
    try {
      window.localStorage.setItem(RESULT_KEY, JSON.stringify(a));
    } catch {
      /* fine — the reading still shows this session */
    }
  }

  function begin() {
    setAnswers([]);
    setPhase("part");
  }
  function startOver() {
    if (
      answers.length === 0 ||
      window.confirm(
        "Start again from the beginning? Your answers so far will be cleared.",
      )
    ) {
      setAnswers([]);
      setPhase("intro");
    }
  }
  function answer(n: number) {
    const next = [...answers, n];
    setAnswers(next);
    if (next.length >= QUESTIONS.length) {
      if (unlocked) persistResult(next); // a retake replaces the saved reading
      setPhase(unlocked ? "results" : "gate");
    }
  }
  function goBack() {
    if (idx > 0) setAnswers(answers.slice(0, -1));
  }
  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // Best-effort Mailchimp subscribe (tagged "full-assessment") — never
    // blocks access: the reading opens whether or not this succeeds.
    fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), source: "full-assessment" }),
    }).catch(() => undefined);
    try {
      window.localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      /* fine — the reading still opens this session */
    }
    persistResult(answers);
    setUnlocked(true);
    setJustUnlocked(true);
    window.dispatchEvent(new Event("bf-allin-unlocked"));
    setPhase("results");
  }

  /* ---------- INTRO ---------- */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
          The Full Assessment · Twenty-four honest statements · About five
          minutes
        </p>
        <h3 className="mt-3 text-3xl leading-tight font-extrabold sm:text-4xl">
          From here, forward. But first - where’s here?
        </h3>
        <p className="mt-4 text-lg leading-relaxed">
          No right answers, no score - just the clearest view of where you
          stand.
        </p>
        <p className="border-brand-accent mt-4 border-l-[3px] pl-4 text-lg leading-relaxed">
          Retake it anytime - your reading will change with the seasons.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          Your answers stay private - they never leave this device.
        </p>
        <div className="mt-7">
          <button
            type="button"
            onClick={begin}
            className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Take an honest look →
          </button>
        </div>
      </div>
    );
  }

  /* ---------- PART INTRO ---------- */
  if (phase === "part") {
    return (
      <div className="mx-auto max-w-2xl">
        <h3 className="text-2xl font-extrabold sm:text-3xl">Four questions</h3>
        <p className="mt-3 text-lg leading-relaxed">
          Where am I now? What has carried me this far? What could be next? What
          is one step I can take?
        </p>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          The first twelve statements are about the ground you’re covering. The
          last twelve are about the strengths you draw on as you go.
        </p>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Mark how true each one is for you in this season - not on your best
          day, not on your worst. Honestly, here, now.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setPhase("questions")}
            className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Begin →
          </button>
        </div>
      </div>
    );
  }

  /* ---------- QUESTIONS ---------- */
  if (phase === "questions") {
    const q = QUESTIONS[idx];
    const pct = Math.round((idx / QUESTIONS.length) * 100);
    return (
      <div className="mx-auto max-w-2xl">
        <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-brand-accent h-full rounded-full transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-muted-foreground mt-4 text-xs font-bold tracking-[0.12em] uppercase">
          {q.part === "walk" ? (
            <>
              <span className="text-brand-accent-text">
                {PATH_Q[q.key as PathKey]}
              </span>{" "}
              ·{" "}
            </>
          ) : null}
          {idx + 1} of {QUESTIONS.length}
        </p>
        <p className="text-primary mt-3 text-2xl leading-snug font-bold sm:text-3xl">
          “{q.text}”
        </p>
        {idx === 0 ? (
          <p className="text-muted-foreground mt-3 text-base italic">
            How true is this for you - right now, in this season?
          </p>
        ) : null}
        <div className="mt-8 flex gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => answer(n)}
              aria-label={`${n} out of 5`}
              className="border-border bg-card text-primary hover:border-brand-accent focus-visible:outline-ring flex-1 rounded-lg border py-4 text-xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {n}
            </button>
          ))}
        </div>
        <div className="text-muted-foreground mt-3 flex justify-between text-sm italic">
          <span>Not at all like me right now</span>
          <span>Very much like me right now</span>
        </div>
        <div className="text-muted-foreground mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm italic">
          {idx > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="hover:text-foreground underline underline-offset-4"
            >
              ← Change my previous answer
            </button>
          ) : null}
          <button
            type="button"
            onClick={startOver}
            className="hover:text-foreground underline underline-offset-4"
          >
            Start again from the beginning
          </button>
        </div>
      </div>
    );
  }

  /* ---------- EMAIL GATE (first completion only) ---------- */
  if (phase === "gate") {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
          One last step
        </p>
        <h3 className="mt-3 text-3xl leading-tight font-extrabold sm:text-4xl">
          Your email once - and everything opens.
        </h3>
        <p className="mt-4 text-lg leading-relaxed">
          Your reading is ready. Leave your email to open it - along with
          everything in All In. You’ll only ever be asked once; after this,
          retake the assessment as often as you like.
        </p>
        <form
          onSubmit={unlock}
          className="mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="fa-email" className="sr-only">
            Email address
          </label>
          <input
            id="fa-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="border-border bg-card focus-visible:border-brand-accent focus-visible:ring-brand-accent/30 w-full flex-1 rounded-full border px-5 py-3 text-base transition-colors outline-none focus-visible:ring-2"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-brand-primary-hover focus-visible:outline-ring inline-flex items-center justify-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Open everything →
          </button>
        </form>
        <p className="text-muted-foreground mt-4 text-sm">
          Your answers and your reading stay on this device - they’re never
          saved or sent anywhere. Your email joins the Bouncing Forward list,
          and it’s easy to leave.
        </p>
      </div>
    );
  }

  /* ---------- RESULTS ---------- */
  const avgs: Record<string, number> = {};
  [...COMPASS_KEYS, ...PATH_KEYS].forEach(
    (k) => (avgs[k] = avgFor(k, answers)),
  );

  let brightest: CompassKey = COMPASS_KEYS[0];
  let faintest: CompassKey = COMPASS_KEYS[0];
  for (const k of COMPASS_KEYS) {
    if (avgs[k] > avgs[brightest]) brightest = k;
    if (avgs[k] < avgs[faintest]) faintest = k;
  }
  const allEqual = COMPASS_KEYS.every((k) => avgs[k] === avgs[COMPASS_KEYS[0]]);
  const step: PathKey | "motion" =
    PATH_KEYS.find((k) => avgs[k] <= 3) || "motion";
  const pathHeading =
    step === "motion"
      ? "You’re in motion."
      : `You’re standing at “${PATH_Q[step]}”.`;

  return (
    <div className="mx-auto max-w-3xl" style={scopeStyle}>
      <style>{`
        .fa-lab{font-family:var(--font-display),sans-serif;font-weight:700;font-size:13px;letter-spacing:.06em;fill:var(--fa-navy)}
        .fa-state{font-style:italic;font-size:12.5px;fill:var(--fa-faint)}
        .fa-map-d{display:none}
        @media (min-width:640px){.fa-map-d{display:block}.fa-map-m{display:none}}
        @media print{.fa-noprint{display:none}}
      `}</style>

      {justUnlocked ? (
        <div className="border-brand-accent bg-card mb-8 rounded-lg border-2 p-5">
          <p className="text-primary font-[family-name:var(--font-display)] font-bold">
            You’re all in.
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Everything in All In is open to you - and you can retake this
            assessment whenever you like, to watch your reading change.
          </p>
        </div>
      ) : null}

      <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
        Your reading · this season
      </p>
      <h3 className="mt-3 text-3xl leading-tight font-extrabold sm:text-4xl">
        Here’s where you are - honestly, and without a score.
      </h3>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        You’ve just walked the Path - four questions - and the Compass, the four
        strengths you draw on as you go. A map of where you are, not a verdict
        on who you are.
      </p>

      {/* At a glance */}
      <div className="border-border bg-card mt-8 rounded-lg border p-6 sm:p-8">
        <h4 className="text-lg font-bold">At a glance</h4>
        <div
          className="fa-map-d mt-4"
          dangerouslySetInnerHTML={{ __html: mapSVG(step) }}
        />
        <div
          className="fa-map-m mt-4"
          dangerouslySetInnerHTML={{ __html: mapSVGMobile(step) }}
        />
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          The trail runs through the four questions - the pin marks where you’re
          standing.
        </p>
        <p className="mt-3 leading-relaxed">
          <span className="font-semibold">{pathHeading}</span>{" "}
          {PATH_STAND[step]}
        </p>
        {allEqual ? (
          <p className="mt-3 leading-relaxed">
            {band(avgs[COMPASS_KEYS[0]]) === "bright"
              ? "All four of your strengths are standing firm. That doesn’t mean it has been easy - it means what you are doing is working."
              : "All four strengths are at a similar level right now. That is a season, not a verdict. Build one first; the others tend to follow."}
          </p>
        ) : (
          <>
            <p className="mt-3 leading-relaxed">
              {brightest} is your greatest strength right now - lean on it. It
              will help you build the others.
            </p>
            <p className="mt-2 leading-relaxed">
              {faintest} needs the most strengthening - not your biggest
              failure. Your next place to work.
            </p>
          </>
        )}
        <p className="text-muted-foreground mt-3 text-sm italic">
          The setback wasn’t your choice. The next step is.
        </p>
      </div>

      {/* The Path */}
      <p className="text-brand-accent-text mt-10 text-xs font-bold tracking-[0.08em] uppercase">
        The Path
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        Four questions - and where you stand with each.
      </p>
      <div className="mt-4 space-y-4">
        {PATH_KEYS.map((k) => (
          <ReportBlock key={k} k={k} isPath answers={answers} />
        ))}
      </div>

      {/* The Compass */}
      <p className="text-brand-accent-text mt-10 text-xs font-bold tracking-[0.08em] uppercase">
        The Compass
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        Four strengths, one name - your Compass. The further a point reaches,
        the more firmly that strength is standing.
      </p>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: compassSVG(avgs) }}
      />
      <div className="mt-4 space-y-4">
        {COMPASS_KEYS.map((k) => (
          <ReportBlock key={k} k={k} isPath={false} answers={answers} />
        ))}
      </div>

      {/* What to do next */}
      <p className="text-brand-accent-text mt-10 text-xs font-bold tracking-[0.08em] uppercase">
        What to do next
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        Small, practical actions to build from here. Start with one.
      </p>
      <div className="mt-4 space-y-4">
        <div className="border-border bg-card rounded-lg border p-6 sm:p-7">
          <h4 className="text-lg font-bold">On the Path</h4>
          <div className="mt-3 space-y-3">
            {PATH_KEYS.map((k) => (
              <div key={k} className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ICONS[k]}
                  alt=""
                  className="size-9 shrink-0 rounded"
                />
                <p className="leading-relaxed">
                  <span className="font-bold">{k}</span>{" "}
                  <span className="text-muted-foreground">
                    {REPORTS[k][band(avgFor(k, answers))].tend}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-border bg-card rounded-lg border p-6 sm:p-7">
          <h4 className="text-lg font-bold">For your Compass</h4>
          <div className="mt-3 space-y-3">
            {COMPASS_KEYS.map((k) => (
              <div key={k} className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ICONS[k]}
                  alt=""
                  className="size-9 shrink-0 rounded"
                />
                <p className="leading-relaxed">
                  <span className="font-bold">{k}</span>{" "}
                  <span className="text-muted-foreground">
                    {REPORTS[k][band(avgFor(k, answers))].tend}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-primary mt-10 text-center font-[family-name:var(--font-display)] font-bold">
        The setback doesn’t write the ending.
      </p>

      <div className="fa-noprint mt-8 text-center">
        <a
          href="#library"
          className="bg-brand-accent text-primary focus-visible:outline-ring inline-flex items-center rounded-full px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold shadow-sm transition-[filter] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Your All In library is open — download everything ↓
        </a>
      </div>

      <div className="fa-noprint text-muted-foreground mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm italic">
        <button
          type="button"
          onClick={() => window.print()}
          className="hover:text-foreground underline underline-offset-4"
        >
          Print or save this reading
        </button>
        <button
          type="button"
          onClick={startOver}
          className="hover:text-foreground underline underline-offset-4"
        >
          Take the Assessment again
        </button>
      </div>
    </div>
  );
}
