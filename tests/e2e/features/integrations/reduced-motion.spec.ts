import type { Page } from "@playwright/test";
import { test, expect } from "../../harness/fixtures";
import {
  scrollThrough,
  settle,
  watchSameOriginFailures,
} from "../../harness/pages";

/** Section F — reduced motion (IN-009). The browser asks for reduced motion; content must still render fully. */

test.use({ reducedMotion: "reduce" });

async function expectNothingLeftFaded(page: Page) {
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    "the reduced-motion preference did not reach the page",
  ).toBe(true);
  await scrollThrough(page);
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            Array.from(
              document.querySelectorAll('main [style*="opacity"]'),
            ).filter((el) => {
              const style = getComputedStyle(el);
              return (
                style.opacity !== "1" ||
                (style.transform !== "none" && style.transform !== "")
              );
            }).length,
        ),
      {
        timeout: 10_000,
        message: "Some content stayed faded or offset under reduced motion.",
      },
    )
    .toBe(0);
}

test(
  "IN-009 the site works with motion reduced: pages render fully when the browser asks for reduced motion",
  { tag: ["@IN-009", "@integrations"] },
  async ({ page, target, consoleErrors }) => {
    test.setTimeout(120_000);
    const failures = watchSameOriginFailures(page, target);
    await page.goto("/");
    await expectNothingLeftFaded(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "The setback wasn’t your choice. The next step is.",
    );
    for (const name of [
      "Four questions. In order.",
      "Who is this for?",
      "Start here and Move Forward",
      "The next step is yours.",
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name, exact: true }),
      ).toBeVisible();
    }
    for (const name of ["Free", "All In", "Premium"])
      await expect(
        page.getByRole("heading", { level: 3, name, exact: true }),
      ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Read the Book" }).first(),
    ).toBeVisible();
    await expect(page.locator("#byc-email")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    await page.goto("/all-in");
    await expectNothingLeftFaded(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Commit to Bouncing Forward.",
    );
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "All In — free. Yours for life.",
      }),
    ).toBeVisible();
    for (const name of [
      "The full assessment",
      "The 30-Day Journal",
      "The Course",
      "The Monthly Letter from Maher",
      "The Webinar Library",
    ]) {
      await expect(
        page.getByRole("heading", { level: 3, name, exact: true }),
      ).toBeVisible();
    }
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "From here, forward. But first - where’s here?",
      }),
    ).toBeVisible();
    await expect(
      page.locator("#library").getByRole("heading", {
        level: 3,
        name: "Take the Full Assessment, and this opens.",
      }),
    ).toBeVisible();

    // The one explicit reduced-motion rule in the app CSS: the flickering compass points stop animating.
    await page.goto("/assess");
    await page.getByRole("button", { name: "Take the quick look →" }).click();
    for (let i = 0; i < 10; i++) {
      await expect(page.getByText(`${i + 1} of 10`)).toBeVisible();
      await page
        .getByRole("button", { name: "3 out of 5", exact: true })
        .click();
    }
    await expect(page.locator("path.ql-flicker").first()).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          getComputedStyle(document.querySelector(".ql-flicker") as Element)
            .animationName,
      ),
    ).toBe("none");
    await settle(page);
    expect(failures).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);
