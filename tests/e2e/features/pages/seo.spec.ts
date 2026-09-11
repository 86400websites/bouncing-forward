import { test, expect } from "../../harness/fixtures";
import { statePath } from "../../harness/auth";
import { headMeta, htmlTitle } from "../../harness/pages";
import { BLOG_POSTS, PUBLIC_PAGES } from "./inventory";

/** Section A — search-engine facing behaviour (PG-013, PG-014, PG-018, PG-019). */

test(
  "PG-013 Privacy and Terms render Heather's copy with no open details left to confirm, still hidden from search engines",
  {
    tag: ["@PG-013", "@pages"],
    annotation: {
      type: "note",
      description:
        "The owner settled every open detail on 11 September 2026 (MN-006): the operator is named, the refund paragraph and the governing-law section were removed rather than filled in, and the reply window is fixed at 30 days. No confirm marker remains. The pages stay noindexed by the owner's choice, which is the one half of the line's flip still outstanding, so noindex is still asserted.",
    },
  },
  async ({ page }) => {
    const pages = [
      {
        path: "/privacy",
        h1: "Privacy Policy",
        settled: [
          "This website is operated by 86400.",
          "Write to info@bouncing-forward.com and we will reply within 30 days.",
        ],
        gone: ["Depending on where you live", "owned and operated"],
      },
      {
        path: "/terms",
        h1: "Terms of Use",
        settled: ["This site is operated by 86400."],
        gone: [
          "choose one:",
          "The law that applies",
          "Because the Book Package is a download that opens immediately",
        ],
      },
    ];
    for (const { path, h1, settled, gone } of pages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      await expect(
        page.getByText("Last updated: 11 September 2026"),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { level: 2, name: "1. Who we are" }),
      ).toBeVisible();
      await expect(page.locator("meta[name='robots']")).toHaveAttribute(
        "content",
        /noindex/,
      );
      await expect(
        page.locator("mark[title='To confirm before launch']"),
        `${path}: no confirm marker may remain`,
      ).toHaveCount(0);
      for (const text of settled)
        await expect(
          page.getByText(text, { exact: false }),
          `${path}: settled copy "${text}"`,
        ).toBeVisible();
      for (const text of gone)
        await expect(
          page.getByText(text, { exact: false }),
          `${path}: removed copy "${text}" is still on the page`,
        ).toHaveCount(0);
    }
    // Contact is now section 12 on Terms, because the governing-law section
    // was removed rather than renumbered around.
    await page.goto("/terms");
    await expect(
      page.getByRole("heading", { level: 2, name: "12. Contact" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /^13\./ }),
    ).toHaveCount(0);
  },
);

test.describe("noindex on account pages", () => {
  test.use({ storageState: statePath("free") });
  test.describe.configure({ timeout: 120_000 });
  test(
    "PG-014 Log in, Create account, Reset password, Choose a new password, Your account and Style guide are hidden from search engines",
    { tag: ["@PG-014", "@pages"] },
    async ({ page }) => {
      for (const path of [
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/style-guide",
        "/account",
      ]) {
        const response = await page.goto(path);
        expect(response?.status(), `${path}`).toBe(200);
        await expect(page).toHaveURL(
          new RegExp(`${path.replace(/\//g, "\/")}$`),
        );
        await expect(
          page.locator("meta[name='robots']"),
          `${path}: noindex`,
        ).toHaveAttribute("content", /noindex/);
      }
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Welcome back.",
      );
      await expect(page.getByText("Signed in as")).toBeVisible();
    },
  );
});

test(
  "PG-018 page titles and social-share data are set per page and the share image exists",
  {
    tag: ["@PG-018", "@pages"],
    annotation: {
      type: "note",
      description:
        'On a Preview the og:image host follows NEXT_PUBLIC_SITE_URL (intentional difference C11); the image is requested by path on the target origin. og:title on /login and /signup uses " | " while the tab title uses " · " — cosmetic.',
    },
  },
  async ({ api, target }, testInfo) => {
    const entries = [
      ...PUBLIC_PAGES.map((p) => ({ path: p.path, title: p.title })),
      ...BLOG_POSTS.map((p) => ({
        path: `/blog/${p.slug}`,
        title: `${p.title} | Bouncing Forward`,
      })),
    ];
    const titles: string[] = [];
    const imageHosts = new Set<string>();
    for (const { path, title } of entries) {
      const res = await api.get(path);
      expect(res.status(), `${path}`).toBe(200);
      const html = await res.text();
      const actual = htmlTitle(html);
      expect(actual, `${path}: <title>`).toBe(title);
      titles.push(actual ?? "");
      expect(
        headMeta(html, { property: "og:title" }),
        `${path}: og:title`,
      ).toBeTruthy();
      expect(
        headMeta(html, { name: "description" }),
        `${path}: description`,
      ).toBeTruthy();
      const image = headMeta(html, { property: "og:image" });
      expect(image, `${path} has no og:image`).toBeTruthy();
      const imageUrl = new URL(image as string, `${target.origin}/`);
      imageHosts.add(imageUrl.host);
      const img = await api.get(imageUrl.pathname);
      expect(
        img.status(),
        `${path}: og:image ${imageUrl.pathname} does not answer 200`,
      ).toBe(200);
      expect(
        img.headers()["content-type"] ?? "",
        `${path}: og:image is not an image`,
      ).toMatch(/^image\//);
    }
    expect(new Set(titles).size, "Every page needs a unique title").toBe(
      titles.length,
    );
    testInfo.annotations.push({
      type: "note",
      description: `og:image host(s): ${[...imageHosts].join(", ")}`,
    });
  },
);

test(
  "PG-019 the Google Search Console verification file is served with exactly the content Google supplied",
  {
    tag: ["@PG-019", "@pages"],
    annotation: {
      type: "note",
      description:
        "Search Console verification itself is the owner action MN-009.",
    },
  },
  async ({ api }) => {
    const res = await api.get("/google777f049a86d5990c.html");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"] ?? "").toMatch(/text\/html/);
    const text = await res.text();
    expect(text).toBe("google-site-verification: google777f049a86d5990c.html");
    expect(Buffer.byteLength(text, "utf8")).toBe(53);
  },
);
