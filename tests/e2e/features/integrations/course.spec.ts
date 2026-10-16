import { test, expect } from "../../harness/fixtures";
import {
  completeFullAssessment,
  deviceUnlockFlag,
  stubNewsletterPost,
} from "../../harness/assessment";
import { identity } from "../../harness/identities";
import {
  expectPdf,
  settle,
  watchSameOriginFailures,
} from "../../harness/pages";

/**
 * Section F — the Course (IN-001). The unlock is a browser-only flag set by
 * the Full Assessment; the real flow is driven, with the assessment's
 * marketing side-effect (POST /api/newsletter) answered inside the browser
 * so the shared Mailchimp audience is written only by FM-006.
 */

export const MODULE_TITLES = [
  "Introduction to Bouncing Forward",
  "Element 1 — Resilience",
  "Element 2 — Adaptability",
  "Element 3 — Optimism",
  "Element 4 — Support",
  "Step 1 — Accept",
  "Step 2 — Reflect",
  "Step 3 — Imagine",
  "Step 4 — Action",
];
const VIDEO_IDS = [
  "adFqf6BJDT8",
  "PpxKouwij3E",
  "DJ9gKhwlxik",
  "krVEVo7n820",
  "dpFzU5KqUQc",
  "s1ZfcVoibYI",
  "3Ld_q2WZ5Mk",
  "yV0B-f3UmI8",
  "0jvcbLt0rVA",
];
export const WORKSHEETS = [
  "/downloads/all-in/course/w1-foundation-introduction.pdf",
  "/downloads/all-in/course/w2-compass-resilience.pdf",
  "/downloads/all-in/course/w3-compass-adaptability.pdf",
  "/downloads/all-in/course/w4-compass-optimism.pdf",
  "/downloads/all-in/course/w5-compass-support.pdf",
  "/downloads/all-in/course/w6-path-accept.pdf",
  "/downloads/all-in/course/w7-path-reflect.pdf",
  "/downloads/all-in/course/w8-path-set-goals.pdf",
  "/downloads/all-in/course/w9-path-take-action.pdf",
];
const LOCKED_LINE = "Video and worksheet open with the Full Assessment.";
const LOCKED_HEADING = "Take the Full Assessment, and every module opens.";

test(
  "IN-001 the Course shows nine locked modules, then nine players and worksheets once the device is unlocked",
  {
    tag: ["@IN-001", "@integrations"],
    annotation: {
      type: "note",
      description:
        "Playback itself is MN-005. Console errors are not asserted after the YouTube frames load (third-party).",
    },
  },
  async ({ page, api, target }) => {
    test.setTimeout(120_000);
    const failures = watchSameOriginFailures(page, target);
    await page.goto("/course");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Walk the framework, one module at a time.",
    );
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Nine modules. A short video and a worksheet for each.",
      }),
    ).toBeVisible();
    const modules = page.locator("#modules ol > li");
    await expect(
      page.getByRole("heading", { level: 3, name: LOCKED_HEADING }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Take the Full Assessment — free" }),
    ).toHaveAttribute("href", "/all-in#full-assessment");
    await expect(modules).toHaveCount(9);
    for (const [i, title] of MODULE_TITLES.entries()) {
      await expect(modules.nth(i)).toContainText(`Module ${i + 1}`);
      await expect(
        modules.nth(i).getByRole("heading", { level: 3, name: title }),
      ).toBeVisible();
    }
    await expect(page.getByText(LOCKED_LINE, { exact: true })).toHaveCount(9);
    await expect(page.locator("#modules iframe")).toHaveCount(0);
    await expect(
      page.locator(
        "iframe[title='Module 1: Introduction to Bouncing Forward']",
      ),
    ).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/adFqf6BJDT8/);
    await expect(
      page.getByRole("link", { name: "Download this module’s worksheet ↓" }),
    ).toHaveCount(0);

    await stubNewsletterPost(page);
    await page.goto("/all-in#full-assessment");
    await completeFullAssessment(page, {
      answers: Array(24).fill(4),
      email: identity("assessment"),
    });
    await expect(
      page.getByText("You’re all in.", { exact: true }),
    ).toBeVisible();
    await expect.poll(() => deviceUnlockFlag(page)).toBe("1");

    await page.goto("/course");
    await expect(
      page.getByRole("heading", { level: 3, name: LOCKED_HEADING }),
    ).toHaveCount(0);
    await expect(page.getByText(LOCKED_LINE, { exact: true })).toHaveCount(0);
    await expect(modules).toHaveCount(9);
    const frames = page.locator("#modules ol > li iframe");
    await expect(frames).toHaveCount(9);
    for (const [i, id] of VIDEO_IDS.entries()) {
      await expect(frames.nth(i)).toHaveAttribute(
        "src",
        `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
      );
      await expect(frames.nth(i)).toHaveAttribute(
        "title",
        `Module ${i + 1}: ${MODULE_TITLES[i]}`,
      );
    }
    const links = page.getByRole("link", {
      name: "Download this module’s worksheet ↓",
    });
    await expect(links).toHaveCount(9);
    for (const [i, href] of WORKSHEETS.entries()) {
      await expect(links.nth(i)).toHaveAttribute("href", href);
      await expect(links.nth(i)).toHaveAttribute("target", "_blank");
      await expectPdf(api, href);
    }
    await settle(page);
    expect(failures, "same-origin requests failed").toEqual([]);
  },
);
