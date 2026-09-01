/**
 * The nine course modules — YouTube ids and descriptions from Darlene's
 * video sheet (Bouncing_Forward_Videos.xlsx, 1 Sep 2026), worksheets
 * from the All In library.
 */
export type CourseModule = {
  n: number;
  title: string;
  youtubeId: string;
  description: string;
  worksheet: string;
};

export const COURSE_MODULES: CourseModule[] = [
  {
    n: 1,
    title: "Introduction to Bouncing Forward",
    youtubeId: "adFqf6BJDT8",
    description:
      "In January 2008, Maher Kaddoura’s seventeen-year-old son Hikmet was struck and killed by a hit-and-run driver in Amman. This is the introduction to Bouncing Forward — the framework Maher built from the hardest thing he has ever faced: a Compass of four elements to keep you oriented, and a Path of four steps to help you move. It begins with one question. Not “why did this happen?” — but “what now?”",
    worksheet: "/downloads/all-in/course/w1-foundation-introduction.pdf",
  },
  {
    n: 2,
    title: "Element 1 — Resilience",
    youtubeId: "PpxKouwij3E",
    description:
      "Grief arrives in layers — and resilience matters most when life simply continues around you. Maher shares the image at the heart of this element: bamboo in a storm, bending almost to the ground and rising again. Plus the five things he wants you to know about building resilience, including the one sentence that held him.",
    worksheet: "/downloads/all-in/course/w2-compass-resilience.pdf",
  },
  {
    n: 3,
    title: "Element 2 — Adaptability",
    youtubeId: "DJ9gKhwlxik",
    description:
      "After his son’s death, Maher’s old life no longer fit — and the adaptation he chose surprised even him: road safety, the very thing that took his son. Think of your mind as a smartphone: every so often it needs an update, not because the old version was broken, but because the world has changed around you.",
    worksheet: "/downloads/all-in/course/w3-compass-adaptability.pdf",
  },
  {
    n: 4,
    title: "Element 3 — Optimism",
    youtubeId: "krVEVo7n820",
    description:
      "Being pessimistic is effortless — your brain is designed for it. Being optimistic is hard, and in the months after loss it can even feel like a betrayal. Maher’s approach: don’t force optimism, observe it. Two questions to ask at the end of every day, even the hardest ones.",
    worksheet: "/downloads/all-in/course/w4-compass-optimism.pdf",
  },
  {
    n: 5,
    title: "Element 4 — Support",
    youtubeId: "dpFzU5KqUQc",
    description:
      "No one crosses a hard season alone — and the feeling that your pain is too heavy to ask others to bear is always wrong. Maher on saying what you actually need, letting people show up imperfectly, and why support flows in both directions or not at all.",
    worksheet: "/downloads/all-in/course/w5-compass-support.pdf",
  },
  {
    n: 6,
    title: "Step 1 — Accept",
    youtubeId: "s1ZfcVoibYI",
    description:
      "In the hours after the accident, Maher’s mind ran the alternative timelines — the what-ifs that are natural, and a trap. Acceptance is not agreeing that what happened was fair; you can accept a reality while still finding it unjust. It is the shift between two questions: the one with no answer, and the one that demands one.",
    worksheet: "/downloads/all-in/course/w6-path-accept.pdf",
  },
  {
    n: 7,
    title: "Step 2 — Reflect",
    youtubeId: "3Ld_q2WZ5Mk",
    description:
      "One week after his son’s death, Maher sat down with a newspaper and a notepad and began to count — and grief became fury, and fury became purpose. Reflection is the disciplined practice of letting experience become wisdom, built on one question only: what does this loss ask of me?",
    worksheet: "/downloads/all-in/course/w7-path-reflect.pdf",
  },
  {
    n: 8,
    title: "Step 3 — Imagine",
    youtubeId: "yV0B-f3UmI8",
    description:
      "Through a gap in the trees, a mountain appears — and you are no longer simply moving, you are moving towards something. Maher on how one “what if I can…” became 1,200 playgrounds and 260 safer schools: purpose before plans, a goal small enough to start today, and a face attached to it.",
    worksheet: "/downloads/all-in/course/w8-path-set-goals.pdf",
  },
  {
    n: 9,
    title: "Step 4 — Action",
    youtubeId: "0jvcbLt0rVA",
    description:
      "Maher was not a minister and had no mandate — only grief, some experience, and a conviction that became impossible to ignore. So he started where he could. On first steps taken without permission, milestones no one else can see, and why passion inspires but only discipline delivers.",
    worksheet: "/downloads/all-in/course/w9-path-take-action.pdf",
  },
];
