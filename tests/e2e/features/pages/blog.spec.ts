import { test, expect } from "../../harness/fixtures";
import { BLOG_POSTS } from "./inventory";

/** Section A — the Blog (PG-006). Read-only; both projects. */

test(
  "PG-006 each of the 8 blog posts opens with its title, previous/next links move between posts, and the index lists all 8",
  { tag: ["@PG-006", "@pages"] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const titles = BLOG_POSTS.map((p) => p.title);

    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Honest words for the hardest seasons.",
    );
    const cards = page.getByRole("article");
    await expect(cards).toHaveCount(8);
    await expect(cards.getByRole("heading", { level: 2 })).toHaveText(titles);
    for (const [i, post] of BLOG_POSTS.entries()) {
      const link = cards.nth(i).getByRole("link", { name: "Read the post →" });
      await expect(link).toHaveAttribute("href", `/blog/${post.slug}`);
    }

    await cards.first().getByRole("link", { name: "Read the post →" }).click();
    await expect(page).toHaveURL(new RegExp(`/blog/${BLOG_POSTS[0].slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(titles[0]);
    const nav = () => page.getByRole("navigation", { name: "More posts" });
    await expect(nav().getByRole("link", { name: "← Previous" })).toHaveCount(
      0,
    );
    await expect(
      page.getByRole("link", { name: "← The Blog" }),
    ).toHaveAttribute("href", "/blog");

    for (let i = 0; i < BLOG_POSTS.length - 1; i++) {
      const next = nav().getByRole("link", { name: "Next →" });
      await expect(next).toContainText(titles[i + 1]);
      await next.click();
      await expect(page).toHaveURL(
        new RegExp(`/blog/${BLOG_POSTS[i + 1].slug}$`),
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        titles[i + 1],
      );
    }
    await expect(nav().getByRole("link", { name: "Next →" })).toHaveCount(0);
    await nav().getByRole("link", { name: "← Previous" }).click();
    await expect(page).toHaveURL(new RegExp(`/blog/${BLOG_POSTS[6].slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(titles[6]);
  },
);
