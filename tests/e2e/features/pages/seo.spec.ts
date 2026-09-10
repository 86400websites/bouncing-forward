import { test, expect } from "../../harness/fixtures";
import { statePath } from "../../harness/auth";
import { headMeta, htmlTitle } from "../../harness/pages";
import { BLOG_POSTS, PUBLIC_PAGES } from "./inventory";

/** Section A — search-engine facing behaviour (PG-013, PG-014, PG-018, PG-019). */

test(
  "PG-013 Privacy and Terms render Heather's copy with every open detail marked confirm, hidden from search engines",
  {
    tag: ["@PG-013", "@pages"],
    annotation: {
      type: "note",
      description:
        "PROJECT-STATUS open confirmations 1–4 and 6 were still open on 10 September 2026, so the current state (markers present, noindex on) is asserted. When the owner settles them (MN-006) the line flips and this test changes with the owner's approval.",
    },
  },
  async ({ page }) => {
    const pages = [
      {
        path: "/privacy",
        h1: "Privacy Policy",
        marks: [
          "Half a Life / Maher Kaddoura — confirm legal entity name and country",
          "within 30 days — confirm",
        ],
      },
      {
        path: "/terms",
        h1: "Terms of Use",
        marks: [
          "Confirm legal entity name and country.",
          "choose one:",
          "country — confirm with Maher, e.g. Jordan / United Kingdom / South Africa",
        ],
      },
    ];
    for (const { path, h1, marks } of pages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      await expect(
        page.getByText("Last updated: 4 September 2026"),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { level: 2, name: "1. Who we are" }),
      ).toBeVisible();
      await expect(page.locator("meta[name='robots']")).toHaveAttribute(
        "content",
        /noindex/,
      );
      const all = page.locator("mark[title='To confirm before launch']");
      await expect(all, `${path}: confirm markers`).toHaveCount(marks.length);
      for (const text of marks)
        await expect(
          all.filter({ hasText: text }),
          `${path}: marker "${text}"`,
        ).toBeVisible();
    }
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
