import { test, expect } from "../../harness/fixtures";
import {
  expectImageLoaded,
  expectPdf,
  settle,
  watchSameOriginFailures,
} from "../../harness/pages";
import { AMAZON_FORMATS, FREE_CHAPTER_PDF, JOURNAL_PDF } from "./inventory";

/** Section A — page content promises (PG-007 … PG-012). Read-only; both projects. */

test(
  "PG-007 Home shows the three tiers and its two free downloads actually download",
  { tag: ["@PG-007", "@pages", "@morning"] },
  async ({ page, api }) => {
    await page.goto("/");
    for (const name of ["Free", "All In", "Premium"]) {
      await expect(
        page.getByRole("heading", { level: 3, name, exact: true }),
      ).toBeVisible();
    }
    const premium = page.locator("#book-package");
    await expect(premium.getByText("$9.99")).toBeVisible();
    await expect(
      premium.getByRole("link", { name: "Buy the Book Package" }),
    ).toHaveAttribute("href", "/premium");
    const chapter = page.getByRole("link", {
      name: "Read the first chapter free →",
    });
    await expect(chapter).toHaveAttribute("href", FREE_CHAPTER_PDF);
    await expect(chapter).toHaveAttribute("target", "_blank");
    await expect(chapter).toHaveAttribute("rel", /noopener/);
    const journal = page.getByRole("link", {
      name: "Download your 7 Step Journal",
    });
    await expect(journal).toHaveAttribute("href", JOURNAL_PDF);
    await expect(journal).toHaveAttribute("target", "_blank");
    await expect(
      page.getByRole("link", { name: "Send me the weekly note" }),
    ).toHaveAttribute("href", "#begin-your-crossing");
    await expect(
      page.getByRole("link", { name: "Go All In" }).first(),
    ).toHaveAttribute("href", "/all-in");
    await expectPdf(api, FREE_CHAPTER_PDF);
    await expectPdf(api, JOURNAL_PDF);
  },
);

test(
  "PG-008 The Book page offers every Amazon format (new tab), the free first chapter, and Buy the Book Package → Premium",
  {
    tag: ["@PG-008", "@pages"],
    annotation: {
      type: "note",
      description:
        'The list says "Buy the Book Package → Premium"; the component label is "Buy the Book Package — $9.99". Since 11 September 2026 the single "Buy on Amazon" button is four labelled links, one per format (Kindle, Hardcover, Paperback, Workbook). The listings themselves are MN-001.',
    },
  },
  async ({ page, api }) => {
    await page.goto("/book");
    // One labelled link per format, in both CTA rows on the page.
    for (const format of AMAZON_FORMATS) {
      const links = page.getByRole("link", {
        name: format.label,
        exact: true,
      });
      await expect(
        links,
        `The Book page offers "${format.label}" in both CTA rows`,
      ).toHaveCount(2);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute("href", format.href);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAttribute("rel", /noreferrer/);
      }
    }
    const chapter = page.getByRole("link", {
      name: "Read the first chapter free →",
    });
    await expect(chapter).toHaveAttribute("href", FREE_CHAPTER_PDF);
    await expect(chapter).toHaveAttribute("target", "_blank");
    await expectPdf(api, FREE_CHAPTER_PDF);
    const buy = page.getByRole("link", {
      name: "Buy the Book Package — $9.99",
    });
    await expect(buy).toHaveCount(2);
    for (const link of await buy.all())
      await expect(link).toHaveAttribute("href", "/premium");
    await buy.first().click();
    await expect(page).toHaveURL(/\/premium$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Go all the way.",
    );
  },
);

test(
  "PG-009 Resources shows the 4-Element Compass and 4-Step Path with their icons, plus the tool cards",
  {
    tag: ["@PG-009", "@pages"],
    annotation: {
      type: "note",
      description:
        'The Stories and Blog cards live in the "Keep going" section, the 7 Step Journal and Where’s Here? cards in "Two tools to begin".',
    },
  },
  async ({ page, target }) => {
    const failures = watchSameOriginFailures(page, target);
    await page.goto("/compass-and-path");
    const path = page.locator("#path");
    await expect(
      path.getByRole("heading", { level: 2, name: "The 4-Step Path" }),
    ).toBeVisible();
    await expect(path.getByRole("heading", { level: 3 })).toHaveText([
      "Accept",
      "Reflect",
      "Imagine",
      "Act",
    ]);
    for (const alt of [
      "Isometric illustration for Accept — a bridge across a divide",
      "Isometric illustration for Reflect — still water mirroring the sky",
      "Isometric illustration for Imagine — a named destination on the horizon",
      "Act — a first step taken on the path",
    ])
      await expectImageLoaded(path.getByRole("img", { name: alt }));
    const compass = page.locator("#compass");
    await expect(
      compass.getByRole("heading", { level: 2, name: "The 4-Element Compass" }),
    ).toBeVisible();
    await expect(compass.getByRole("heading", { level: 3 })).toHaveText([
      "Resilience",
      "Adaptability",
      "Optimism",
      "Support",
    ]);
    for (const alt of [
      "Resilience — bamboo bending in the wind",
      "Adaptability — a seedling within a cycle of arrows",
      "Optimism — a rising sun",
      "Support — hands cupping a growing seedling",
    ])
      await expectImageLoaded(compass.getByRole("img", { name: alt }));
    const inventory = page.locator("#inventory");
    await expect(
      inventory.getByRole("heading", { level: 2, name: "Two tools to begin" }),
    ).toBeVisible();
    await expect(inventory.getByRole("heading", { level: 3 })).toHaveText([
      "The 7 Step Journal",
      "Where’s Here?",
    ]);
    await expect(
      inventory.getByRole("link", { name: "Download →" }),
    ).toHaveAttribute("href", JOURNAL_PDF);
    await expect(
      inventory.getByRole("link", { name: "Find out where here is →" }),
    ).toHaveAttribute("href", "/assess");
    const card = (name: string) =>
      page.locator("a", {
        has: page.getByRole("heading", { level: 3, name, exact: true }),
      });
    await expect(card("Stories")).toHaveAttribute("href", "/stories");
    await expect(card("The Blog")).toHaveAttribute("href", "/blog");
    await settle(page);
    expect(failures, "same-origin requests (icons) failed").toEqual([]);
  },
);

const STORY_CARDS = [
  "Buying Shoes Where Gangs Once Ruled",
  "Laid Off Into Her Real Career",
  "Building the Door Herself",
  "One Sewing Machine, One New Life",
  "The Thirty Dollars She Never Forgot",
  "Staying Rooted at 14,000 Feet",
  "The Eviction That Never Came",
  "Built Stronger Where It Broke Him",
  "A Smile That Never Left the Road",
];

test(
  "PG-010 Stories shows the featured story and the story cards; Share Your Story goes to Contact",
  {
    tag: ["@PG-010", "@pages"],
    annotation: {
      type: "note",
      description:
        'The component renders "Share Your Story →" (with the arrow).',
    },
  },
  async ({ page }) => {
    await page.goto("/stories");
    await expect(
      page.getByText("Featured story", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "From a Hospital Corridor to a Road That Saves Lives",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Read the Full Story →" }),
    ).toHaveAttribute("href", "/about");
    await expect(
      page.getByRole("article").getByRole("heading", { level: 3 }),
    ).toHaveText(STORY_CARDS);
    const first = page.getByRole("button", { name: STORY_CARDS[0] });
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#story-0")).toBeVisible();
    await expect(page.locator("#story-0")).toContainText("Manenberg");
    const share = page.getByRole("link", { name: "Share Your Story →" });
    await expect(share).toHaveAttribute("href", "/contact");
    await share.click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "We’d like to hear from you.",
    );
  },
);

const FAQ_QUESTIONS = [
  "What is Bouncing Forward?",
  "Is this therapy?",
  "Where do I start?",
  "Where can I buy the book, and in which formats?",
  "Who is Maher Kaddoura?",
  "What does the course cover?",
  "What are the Path and the Compass?",
  "What is the two-minute check?",
  "Can I share my own story?",
  "What will I find on the blog?",
  "What does All In cost, and how does it work?",
  "What is the Book Package?",
  "Do you offer Bouncing Forward for teams and organizations?",
];

test(
  "PG-011 FAQ shows its 14 questions and answers, and points to Contact",
  {
    tag: ["@PG-011", "@pages"],
    annotation: {
      type: "note",
      description:
        "The approved line says 14 questions; the page renders 13. The count assertion follows the approved line and FAILS until the owner corrects the line or adds the missing question.",
    },
  },
  async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Frequently asked questions",
    );
    await expect(
      page.getByRole("link", { name: "Get in touch" }),
    ).toHaveAttribute("href", "/contact");
    const items = page.locator("details");
    for (const q of FAQ_QUESTIONS) {
      const item = items.filter({
        has: page.locator("summary", { hasText: q }),
      });
      await expect(item.locator("summary")).toBeVisible();
      await item.locator("summary").click();
      await expect(item).toHaveAttribute("open", "");
      await expect(item.locator("summary + div")).not.toBeEmpty();
    }
    await expect(
      items,
      "The approved line promises 14 questions and answers",
    ).toHaveCount(14);
    await page.getByRole("link", { name: "Get in touch" }).click();
    await expect(page).toHaveURL(/\/contact$/);
  },
);

test(
  "PG-012 Enterprise renders; Explore the Formats jumps to the formats section; its contact buttons go to Contact",
  { tag: ["@PG-012", "@pages"] },
  async ({ page }) => {
    await page.goto("/enterprise");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Your team is carrying more than you can see.",
    );
    const explore = page.getByRole("link", { name: "Explore the Formats" });
    await expect(explore).toHaveAttribute("href", "#formats");
    await explore.click();
    await expect(page).toHaveURL(/#formats$/);
    await expect(
      page.locator("#formats").getByRole("heading", {
        level: 2,
        name: "Choose the depth your organization needs.",
      }),
    ).toBeInViewport();
    for (const name of [
      "The 60-Minute Webinar",
      "The 90-Minute Workshop",
      "The Half-Day Workshop",
      "Four Weeks × 90 Minutes",
    ]) {
      await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
    }
    await expect(
      page.getByRole("link", { name: "Inquire About a Workshop →" }),
    ).toHaveAttribute("href", "/contact");
    const bring = page.getByRole("link", {
      name: "Bring Bouncing Forward to Your Team →",
    });
    await expect(bring).toHaveAttribute("href", "/contact");
    await bring.click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "We’d like to hear from you.",
    );
  },
);
