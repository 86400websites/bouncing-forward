import type { Page } from "@playwright/test";
import { test, expect } from "../../harness/fixtures";
import {
  FULL_ASSESSMENT_RESULT_HEADING,
  acceptConfirmDialogs,
  answerStatements,
  completeFullAssessment,
  deviceUnlockFlag,
  savedReading,
  stubNewsletterPost,
} from "../../harness/assessment";
import { identity } from "../../harness/identities";
import { settle, watchSameOriginFailures } from "../../harness/pages";

/**
 * Section F — the Full Assessment (IN-005 flow, IN-006 scoring). The email
 * gate posts to /api/newsletter; that call is answered inside the browser
 * and its body recorded, so the shared audience is written only by FM-006.
 * window.confirm is accepted/dismissed explicitly (Playwright dismisses by
 * default, which would silently no-op "Start again" and the retake).
 */

const START_OVER_MESSAGE =
  "Start again from the beginning? Your answers so far will be cleared.";
const MAP =
  "Your map: the route through the four questions, with a pin marking where you stand";
const COMPASS =
  "Your compass: four points, each reaching as far as that strength currently stands";

async function restart(page: Page) {
  await page.getByRole("button", { name: "Take an honest look →" }).click();
  await page.getByRole("button", { name: "Begin →" }).click();
}

test(
  "IN-005 the Full Assessment walks through 24 statements with Back and Start over, asks for an email, shows results, remembers them, and a retake replaces them",
  { tag: ["@IN-005", "@integrations", "@desktop-only"] },
  async ({ page, target, consoleErrors }) => {
    test.setTimeout(150_000);
    const failures = watchSameOriginFailures(page, target);
    const decisions = [true, false, true, true];
    let decision = 0;
    const dialogs = acceptConfirmDialogs(
      page,
      () => decisions[decision++] ?? true,
    );
    const posted = await stubNewsletterPost(page);
    const email = identity("assessment");

    await page.goto("/all-in#full-assessment");
    await expect(
      page.getByText(
        "The Full Assessment · Twenty-four honest statements · About five minutes",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "From here, forward. But first - where’s here?",
      }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Your answers stay private - they never leave this device.",
      ),
    ).toBeVisible();
    await page.getByRole("button", { name: "Take an honest look →" }).click();
    await expect(
      page.getByRole("heading", { level: 3, name: "Four questions" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Begin →" }).click();

    // Back.
    await expect(page.getByText(/1 of 24$/)).toBeVisible();
    await expect(
      page.getByText(
        "“I can look honestly at what happened without turning away.”",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "← Change my previous answer" }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "3 out of 5", exact: true }).click();
    await expect(page.getByText(/2 of 24$/)).toBeVisible();
    await expect(
      page.getByText(
        "“I’ve stopped spending my energy fighting the fact that it happened.”",
      ),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "← Change my previous answer" })
      .click();
    await expect(page.getByText(/1 of 24$/)).toBeVisible();

    // Start over: accepted → intro; dismissed → stays; accepted again → intro.
    await page.getByRole("button", { name: "3 out of 5", exact: true }).click();
    await expect(page.getByText(/2 of 24$/)).toBeVisible();
    await page
      .getByRole("button", { name: "Start again from the beginning" })
      .click();
    await expect(
      page.getByRole("button", { name: "Take an honest look →" }),
    ).toBeVisible();
    expect(dialogs[0]).toBe(START_OVER_MESSAGE);
    await restart(page);
    await page.getByRole("button", { name: "3 out of 5", exact: true }).click();
    await expect(page.getByText(/2 of 24$/)).toBeVisible();
    await page
      .getByRole("button", { name: "Start again from the beginning" })
      .click();
    await expect(page.getByText(/2 of 24$/)).toBeVisible();
    await page
      .getByRole("button", { name: "Start again from the beginning" })
      .click();
    await expect(
      page.getByRole("button", { name: "Take an honest look →" }),
    ).toBeVisible();

    // Complete: 24 answers, then the email gate, then results.
    await completeFullAssessment(page, { answers: Array(24).fill(4), email });
    await expect(
      page.getByText("You’re all in.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Everything in All In is open to you - and you can retake this assessment whenever you like, to watch your reading change.",
      ),
    ).toBeVisible();
    for (const name of [
      "Accept: steady underfoot",
      "Reflect: steady underfoot",
      "Imagine: steady underfoot",
      "Act: steady underfoot",
      "Resilience: a real strength",
      "Adaptability: a real strength",
      "Optimism: a real strength",
      "Support: a real strength",
    ]) {
      await expect(page.getByRole("img", { name })).toBeVisible();
    }
    await expect(
      page.getByText("You’re in motion.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "All four of your strengths are standing firm. That doesn’t mean it has been easy - it means what you are doing is working.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Your All In library is open — download everything ↓",
      }),
    ).toBeVisible();
    await expect.poll(() => deviceUnlockFlag(page)).toBe("1");
    expect(await savedReading(page)).toEqual(Array(24).fill(4));
    expect(
      posted.length,
      "the assessment did not post its email step",
    ).toBeGreaterThan(0);
    expect(
      posted[0]?.email === email && posted[0]?.source === "full-assessment",
      "the assessment posted the wrong identity or tag (values withheld)",
    ).toBe(true);

    // Remembered on this device.
    await page.reload();
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: FULL_ASSESSMENT_RESULT_HEADING,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Take an honest look →" }),
    ).toHaveCount(0);
    await expect(page.getByText("You’re all in.", { exact: true })).toHaveCount(
      0,
    );
    await expect(
      page.getByRole("img", { name: "Resilience: a real strength" }),
    ).toBeVisible();

    // A retake replaces the reading; the email gate does not return.
    await page
      .getByRole("button", { name: "Take the Assessment again" })
      .click();
    await restart(page);
    await answerStatements(page, Array(24).fill(2), 24);
    await expect(page.locator("#fa-email")).toHaveCount(0);
    await expect(
      page.getByRole("img", { name: "Resilience: needs strengthening" }),
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Accept: still ahead" }),
    ).toBeVisible();
    await expect(
      page.getByText("You’re standing at “Where am I now?”.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "All four strengths are at a similar level right now. That is a season, not a verdict. Build one first; the others tend to follow.",
      ),
    ).toBeVisible();
    expect(await savedReading(page)).toEqual(Array(24).fill(2));
    await page.reload();
    await expect(
      page.getByRole("img", { name: "Accept: still ahead" }),
    ).toBeVisible();
    await settle(page);
    expect(failures).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

type ScoreSet = {
  label: string;
  answers: number[];
  bars: [string, string, number | null][]; // key, state, percent (null = not asserted)
  headings: string[];
  texts: string[];
  tips: RegExp[];
  map: string[];
};

const SETS: ScoreSet[] = [
  {
    label: "all 5s",
    answers: Array(24).fill(5),
    bars: [
      ["Accept", "steady underfoot", 100],
      ["Reflect", "steady underfoot", 100],
      ["Imagine", "steady underfoot", 100],
      ["Act", "steady underfoot", 100],
      ["Resilience", "a real strength", 100],
      ["Adaptability", "a real strength", 100],
      ["Optimism", "a real strength", 100],
      ["Support", "a real strength", 100],
    ],
    headings: [
      "Where am I now? · Accept · steady underfoot",
      "What has carried me this far? · Reflect · steady underfoot",
      "What could be next? · Imagine · steady underfoot",
      "What is one step I can take? · Act · steady underfoot",
      "Resilience · a real strength",
      "Adaptability · a real strength",
      "Optimism · a real strength",
      "Support · a real strength",
    ],
    texts: [
      "Hard days pass, and you keep finding your feet. What you are doing is working.",
      "You can look at what happened without turning away - and spend your energy on what begins from here.",
      "You’re in motion.",
      "All four of your strengths are standing firm. That doesn’t mean it has been easy - it means what you are doing is working.",
    ],
    tips: [/^M300,110 L/, /^M412,222 L/, /^M300,334 L/, /^M188,222 L/],
    map: ["taken", "taken", "taken", "taken"],
  },
  {
    label: "all 2s",
    answers: Array(24).fill(2),
    bars: [
      ["Accept", "still ahead", 40],
      ["Reflect", "still ahead", 40],
      ["Imagine", "still ahead", 40],
      ["Act", "still ahead", 40],
      ["Resilience", "needs strengthening", 40],
      ["Adaptability", "needs strengthening", 40],
      ["Optimism", "needs strengthening", 40],
      ["Support", "needs strengthening", 40],
    ],
    headings: [
      "Where am I now? · Accept · still ahead",
      "Resilience · needs strengthening",
      "Support · needs strengthening",
    ],
    texts: [
      "Getting up is taking everything you have right now. That is the weight of the setback, not a failure.",
      "Part of you hasn’t yet let it land. That is often a form of love, not a problem to solve.",
      "You’re standing at “Where am I now?”.",
      "All four strengths are at a similar level right now. That is a season, not a verdict. Build one first; the others tend to follow.",
    ],
    tips: [/^M300,176 L/, /^M346,222 L/, /^M300,268 L/, /^M254,222 L/],
    map: ["you are here", "ahead", "ahead", "ahead"],
  },
  {
    label: "mixed",
    answers: [
      5, 5, 5, 3, 3, 3, 2, 2, 2, 4, 4, 4, 5, 4, 4, 3, 3, 4, 1, 2, 3, 4, 4, 3,
    ],
    bars: [
      ["Accept", "steady underfoot", 100],
      ["Reflect", "partly taken", 60],
      ["Imagine", "still ahead", 40],
      ["Act", "steady underfoot", 80],
      ["Resilience", "a real strength", null],
      ["Adaptability", "gathering strength", null],
      ["Optimism", "needs strengthening", 40],
      ["Support", "gathering strength", null],
    ],
    headings: [
      "What has carried me this far? · Reflect · partly taken",
      "What could be next? · Imagine · still ahead",
      "Adaptability · gathering strength",
      "Optimism · needs strengthening",
    ],
    texts: [
      "You reflect - and sometimes you circle the same place without arriving.",
      "The future feels far away right now. Don’t reach for the horizon yet - reach for a direction.",
      "Part of you is adjusting; part is still rebuilding what was. That is loyalty, not stubbornness.",
      "The future is hard to picture right now. That is the setback’s doing, not yours.",
      "You have people - and you are half letting them in. Your weight is not too heavy to share.",
      "Resilience is your greatest strength right now - lean on it. It will help you build the others.",
      "Optimism needs the most strengthening - not your biggest failure. Your next place to work.",
      "You’re standing at “What has carried me this far?”.",
    ],
    tips: [/^M300,110 L/, /^M378,222 L/, /^M300,268 L/, /^M222,222 L/],
    map: ["taken", "you are here", "ahead", "ahead"],
  },
];

test(
  "IN-006 the Full Assessment scores correctly for known answer sets: every question and compass element shows the band its average deserves, and the report matches",
  {
    tag: ["@IN-006", "@integrations"],
    annotation: {
      type: "note",
      description:
        "Band words on the page: steady underfoot / partly taken / still ahead for the four questions; a real strength / gathering strength / needs strengthening for the compass (bright / flickering / faint are the code's internal names).",
    },
  },
  async ({ page }) => {
    test.setTimeout(180_000);
    acceptConfirmDialogs(page);
    await stubNewsletterPost(page);
    await page.goto("/all-in#full-assessment");
    for (const [n, set] of SETS.entries()) {
      if (n === 0) {
        await completeFullAssessment(page, {
          answers: set.answers,
          email: identity("assessment"),
        });
      } else {
        await page
          .getByRole("button", { name: "Take the Assessment again" })
          .click();
        await restart(page);
        await answerStatements(page, set.answers, 24);
      }
      await expect(
        page.getByRole("heading", {
          level: 3,
          name: FULL_ASSESSMENT_RESULT_HEADING,
        }),
      ).toBeVisible();
      for (const [key, state, pct] of set.bars) {
        const bar = page.getByRole("img", { name: `${key}: ${state}` });
        await expect(bar, `${set.label}: ${key}`).toBeVisible();
        if (pct !== null)
          await expect(
            bar.locator("div").first(),
            `${set.label}: ${key} width`,
          ).toHaveAttribute("style", new RegExp("width: ?" + pct + "%"));
      }
      for (const name of set.headings)
        await expect(
          page.getByRole("heading", { level: 4, name }),
          `${set.label}`,
        ).toBeVisible();
      for (const text of set.texts)
        await expect(
          page.getByText(text, { exact: true }),
          `${set.label}`,
        ).toBeVisible();
      const compass = page.getByRole("img", { name: COMPASS });
      await expect(compass.locator("text.fa-state")).toHaveText(
        set.bars.slice(4).map(([, state]) => state),
      );
      for (const [i, tip] of set.tips.entries())
        await expect(
          compass.locator("path").nth(3 * i),
          `${set.label}: compass point ${i + 1}`,
        ).toHaveAttribute("d", tip);
      const mapStates = await page
        .getByRole("img", { name: MAP })
        .filter({ visible: true })
        .locator("text.fa-state")
        .allTextContents();
      expect(mapStates.slice(0, 4), `${set.label}: map`).toEqual(set.map);
    }
  },
);
