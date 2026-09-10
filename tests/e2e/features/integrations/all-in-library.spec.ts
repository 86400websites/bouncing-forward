import { test, expect } from "../../harness/fixtures";
import {
  completeFullAssessment,
  stubNewsletterPost,
} from "../../harness/assessment";
import { identity } from "../../harness/identities";
import {
  expectPdf,
  settle,
  watchSameOriginFailures,
} from "../../harness/pages";

/** Section F — the All In library (IN-002). */

export const LIBRARY: readonly [string, string][] = [
  [
    "Bouncing Forward — the Book Summary",
    "/downloads/all-in/bouncing-forward-book-summary.pdf",
  ],
  ["The Monthly Letter — No. 1", "/downloads/all-in/monthly-letter-1.pdf"],
  [
    "The Walking Pages — worksheet for Letter No. 1",
    "/downloads/all-in/monthly-letter-1-the-walking-pages.pdf",
  ],
  ["The 30-Day Journal", "/downloads/all-in/bf-30-day-journal.pdf"],
  [
    "W1 · Foundation — Introduction to Bouncing Forward",
    "/downloads/all-in/course/w1-foundation-introduction.pdf",
  ],
  [
    "W2 · The Compass — Element 1: Resilience",
    "/downloads/all-in/course/w2-compass-resilience.pdf",
  ],
  [
    "W3 · The Compass — Element 2: Adaptability",
    "/downloads/all-in/course/w3-compass-adaptability.pdf",
  ],
  [
    "W4 · The Compass — Element 3: Optimism",
    "/downloads/all-in/course/w4-compass-optimism.pdf",
  ],
  [
    "W5 · The Compass — Element 4: Support",
    "/downloads/all-in/course/w5-compass-support.pdf",
  ],
  [
    "W6 · The Path — Step 1: Accept",
    "/downloads/all-in/course/w6-path-accept.pdf",
  ],
  [
    "W7 · The Path — Step 2: Reflect",
    "/downloads/all-in/course/w7-path-reflect.pdf",
  ],
  [
    "W8 · The Path — Step 3: Set Goals",
    "/downloads/all-in/course/w8-path-set-goals.pdf",
  ],
  [
    "W9 · The Path — Step 4: Take Action",
    "/downloads/all-in/course/w9-path-take-action.pdf",
  ],
];

test(
  "IN-002 the All In library stays closed until the Full Assessment is finished, then lists its 13 downloads",
  {
    tag: ["@IN-002", "@integrations"],
    annotation: {
      type: "note",
      description:
        "The library gate is browser-only: every PDF answers 200 to a plain request with no unlock (Info — owner decision, FEATURE-LIST defects table).",
    },
  },
  async ({ page, api, target, consoleErrors }) => {
    test.setTimeout(120_000);
    const failures = watchSameOriginFailures(page, target);
    await page.goto("/all-in");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Commit to Bouncing Forward.",
    );
    const lib = page.locator("#library");
    await expect(
      lib.getByText("Your All In library", { exact: true }),
    ).toBeVisible();
    await expect(
      lib.getByRole("heading", {
        level: 3,
        name: "Take the Full Assessment, and this opens.",
      }),
    ).toBeVisible();
    await expect(
      lib.getByRole("link", { name: "Take the Full Assessment ↑" }),
    ).toHaveAttribute("href", "#full-assessment");
    await expect(lib.locator('a[href$=".pdf"]')).toHaveCount(0);

    await stubNewsletterPost(page);
    await completeFullAssessment(page, {
      answers: Array(24).fill(4),
      email: identity("assessment"),
    });
    await expect(
      page.getByText("You’re all in.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Your All In library is open — download everything ↓",
      }),
    ).toHaveAttribute("href", "#library");

    await expect(lib.getByText("Your All In library · open")).toBeVisible();
    await expect(
      lib.getByRole("heading", {
        level: 3,
        name: "Everything below is yours.",
      }),
    ).toBeVisible();
    for (const name of [
      "The book, summarized",
      "The Monthly Letter",
      "The 30-Day Journal",
      "The Course — worksheets",
    ]) {
      await expect(lib.getByRole("heading", { level: 4, name })).toBeVisible();
    }
    await expect(
      lib.getByRole("link", { name: "on the Course page" }),
    ).toHaveAttribute("href", "/course#modules");
    const pdfs = lib.locator('a[href$=".pdf"]');
    await expect(pdfs).toHaveCount(13);
    for (const [i, [title, href]] of LIBRARY.entries()) {
      await expect(pdfs.nth(i)).toHaveAttribute("href", href);
      await expect(pdfs.nth(i)).toHaveAttribute("target", "_blank");
      await expect(pdfs.nth(i)).toContainText(title);
    }
    await page.reload();
    await expect(
      lib.getByRole("heading", {
        level: 3,
        name: "Everything below is yours.",
      }),
    ).toBeVisible();
    for (const [, href] of LIBRARY) await expectPdf(api, href);
    await settle(page);
    expect(failures, "same-origin requests failed").toEqual([]);
    expect(consoleErrors, "the browser console reported errors").toEqual([]);
  },
);
