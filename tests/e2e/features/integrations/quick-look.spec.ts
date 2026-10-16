import type { Page } from "@playwright/test";
import { test, expect } from "../../harness/fixtures";
import { settle, watchSameOriginFailures } from "../../harness/pages";

/**
 * Section F — Where’s Here?, the quick look (IN-003, IN-004). Read-only;
 * nothing is stored. The list's band names (bright / flickering / faint)
 * are internal: the page renders "a real strength" / "gathering strength" /
 * "needs strengthening" beside each compass point, and the point geometry
 * (reach 104 / 76 / 48 px, fill-opacity 1 / 0.65 / 0.3) encodes the band.
 */

const COMPASS =
  "Your compass: four strengths — the longer the point, the stronger it stands";
const MAP =
  "Your map: the route through the four questions with a pin where you stand";
const compassStates = (page: Page) =>
  page.getByRole("img", { name: COMPASS }).locator("text.ql-state");
const mapStates = (page: Page) =>
  page.getByRole("img", { name: MAP }).locator("text.ql-state");

/** Answers the ten statements by click (default) or keyboard. */
async function answerQuickLook(
  page: Page,
  answers: number[],
  keyboard = false,
) {
  for (let i = 0; i < 10; i++) {
    await expect(page.getByText(`${i + 1} of 10`)).toBeVisible();
    const button = page.getByRole("button", {
      name: `${answers[i]} out of 5`,
      exact: true,
    });
    if (keyboard) {
      await button.focus();
      await page.keyboard.press(i % 2 ? "Space" : "Enter");
    } else {
      await button.click();
    }
  }
}

test(
  "IN-003 Where’s Here? walks through 10 statements by keyboard, then shows the compass, the map and a reading, and offers the Full Assessment",
  { tag: ["@IN-003", "@integrations"] },
  async ({ page, target, consoleErrors }) => {
    const failures = watchSameOriginFailures(page, target);
    await page.goto("/assess");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "From here, forward. But first — where’s here?",
    );
    await expect(
      page.getByText("Free · Ten Statements · Two Honest Minutes"),
    ).toBeVisible();
    await page.getByRole("button", { name: "Take the quick look →" }).click();
    await expect(page.getByText("1 of 10")).toBeVisible();
    await expect(
      page.getByText(
        "“I can name what happened plainly — without dressing it up, and without playing it down.”",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("How true is this for you — right now, in this season?"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^[1-5] out of 5$/ }),
    ).toHaveCount(5);
    // Answer one, step back, then answer the set by keyboard.
    await page.getByRole("button", { name: "4 out of 5", exact: true }).click();
    await expect(page.getByText("2 of 10")).toBeVisible();
    await page
      .getByRole("button", { name: "← Change my previous answer" })
      .click();
    await expect(page.getByText("1 of 10")).toBeVisible();
    await answerQuickLook(page, [4, 5, 5, 4, 3, 2, 5, 4, 3, 2], true);

    await expect(
      page.getByText("Your quick reading · this season"),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Here’s where you are — honestly, and without a score.",
      }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "You came here willing to look straight at it. That honesty is the ground everything else stands on.",
      ),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: MAP })).toBeVisible();
    await expect(mapStates(page)).toHaveText([
      "taken",
      "taken",
      "you are here",
      "ahead",
    ]);
    await expect(
      page.getByText("You’re standing at “What could be next?”.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: COMPASS })).toBeVisible();
    await expect(compassStates(page)).toHaveText([
      "a real strength",
      "a real strength",
      "gathering strength",
      "needs strengthening",
    ]);
    await expect(
      page.getByText(
        "Your longest point right now is Resilience. You have come through before. That is not luck — that is something in you.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "This is the surface. The full reading goes deeper.",
      }),
    ).toBeVisible();
    const goAllIn = page
      .getByRole("link", { name: "Go All In →" })
      .filter({ has: page.locator(':scope[href="/all-in#full-assessment"]') });
    await expect(goAllIn.first()).toHaveAttribute(
      "href",
      "/all-in#full-assessment",
    );
    await goAllIn.first().click();
    await expect(page).toHaveURL(/\/all-in#full-assessment$/);
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "From here, forward. But first - where’s here?",
      }),
    ).toBeVisible();
    await settle(page);
    expect(failures).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

type Run = {
  answers: number[];
  states: string[];
  d: string[];
  opacity: string;
  flicker: boolean;
  map: string[];
  texts: string[];
};

const BRIGHT_D = [
  "M230,86 L217,190 L243,190 Z",
  "M334,190 L230,203 L230,177 Z",
  "M230,294 L243,190 L217,190 Z",
  "M126,190 L230,177 L230,203 Z",
];
const FAINT_D = [
  "M230,142 L217,190 L243,190 Z",
  "M278,190 L230,203 L230,177 Z",
  "M230,238 L243,190 L217,190 Z",
  "M182,190 L230,177 L230,203 Z",
];
const FLICKER_D = [
  "M230,114 L217,190 L243,190 Z",
  "M306,190 L230,203 L230,177 Z",
  "M230,266 L243,190 L217,190 Z",
  "M154,190 L230,177 L230,203 Z",
];

const RUNS: Run[] = [
  {
    answers: Array(10).fill(5),
    states: Array(4).fill("a real strength"),
    d: BRIGHT_D,
    opacity: "1",
    flicker: false,
    map: ["taken", "taken", "taken", "taken"],
    texts: [
      "You came here willing to look straight at it. That honesty is the ground everything else stands on.",
      "You’re in motion.",
      "Your four points are standing level — whichever you reach for, it will hold.",
    ],
  },
  {
    answers: Array(10).fill(2),
    states: Array(4).fill("needs strengthening"),
    d: FAINT_D,
    opacity: "0.3",
    flicker: false,
    map: ["you are here", "ahead", "ahead", "ahead"],
    texts: [
      "Looking straight at what happened is still hard — that isn’t failure, it’s where nearly everyone starts. Honesty is ground that can be practiced.",
      "You’re standing at “Where am I now?”.",
      "Your four points are standing level — whichever you reach for, it will hold.",
    ],
  },
  {
    answers: Array(10).fill(3),
    states: Array(4).fill("gathering strength"),
    d: FLICKER_D,
    opacity: "0.65",
    flicker: true,
    map: ["you are here", "ahead", "ahead", "ahead"],
    texts: [
      "You’re getting closer to looking at this straight on. That willingness is the ground everything else stands on.",
      "You’re standing at “Where am I now?”.",
    ],
  },
  {
    answers: [5, 5, 5, 5, 5, 5, 5, 2, 3, 4],
    states: [
      "a real strength",
      "needs strengthening",
      "gathering strength",
      "a real strength",
    ],
    d: [BRIGHT_D[0], FAINT_D[1], FLICKER_D[2], BRIGHT_D[3]],
    opacity: "",
    flicker: false,
    map: ["taken", "taken", "taken", "taken"],
    texts: [
      "Your longest point right now is Resilience. You have come through before. That is not luck — that is something in you.",
      "You’re in motion.",
    ],
  },
];

test(
  "IN-004 the quick look scores correctly: all 5s read bright, all 2s faint, 3s flickering, and point lengths follow the averages",
  {
    tag: ["@IN-004", "@integrations"],
    annotation: {
      type: "note",
      description:
        "Band words on the page: a real strength / gathering strength / needs strengthening (bright / flickering / faint are the code's internal names).",
    },
  },
  async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/assess");
    await page.getByRole("button", { name: "Take the quick look →" }).click();
    for (const [n, run] of RUNS.entries()) {
      if (n > 0) {
        await page
          .getByRole("button", { name: "Take the quick look again" })
          .click();
      }
      await answerQuickLook(page, run.answers);
      await expect(compassStates(page)).toHaveText(run.states);
      await expect(mapStates(page)).toHaveText(run.map);
      const paths = page.getByRole("img", { name: COMPASS }).locator("path");
      for (const [i, d] of run.d.entries()) {
        await expect(
          paths.nth(i),
          `run ${n + 1}: point ${i + 1} reach`,
        ).toHaveAttribute("d", d);
        if (run.opacity)
          await expect(paths.nth(i)).toHaveAttribute(
            "fill-opacity",
            run.opacity,
          );
        if (run.flicker) await expect(paths.nth(i)).toHaveClass(/ql-flicker/);
        else if (run.opacity)
          await expect(paths.nth(i)).not.toHaveClass(/ql-flicker/);
      }
      for (const text of run.texts)
        await expect(
          page.getByText(text, { exact: true }),
          `run ${n + 1}`,
        ).toBeVisible();
    }
  },
);
