import { test, expect } from "../../harness/fixtures";
import { openAs } from "../../harness/roles";

/** Section B — there is no admin area (AC-018). Recorded so nobody assumes one exists. */

test(
  "AC-018 there is no admin area in the code",
  {
    tag: ["@AC-018", "@accounts"],
    annotation: {
      type: "note",
      description:
        "The approved line says nothing to test; these assertions only record that no admin surface answers and no admin link is offered.",
    },
  },
  async ({ page, api, browser, target }) => {
    for (const path of ["/admin", "/api/admin"]) {
      expect((await api.get(path)).status(), path).toBe(404);
    }
    const trailing = await api.get("/admin/");
    if (trailing.status() >= 300 && trailing.status() < 400) {
      const location = new URL(
        trailing.headers()["location"] ?? "",
        `${target.origin}/`,
      );
      expect(location.origin).toBe(target.origin);
      expect(location.pathname).toBe("/admin");
    } else {
      expect(trailing.status()).toBe(404);
    }
    const response = await page.goto("/admin");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "This path doesn't exist.",
    );
    await expect(
      page.getByRole("link", { name: "Bouncing Forward — home" }),
    ).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await page.goto("/");
    await expect(page.locator('a[href*="admin" i]')).toHaveCount(0);
    await expect(page.getByRole("link", { name: /admin/i })).toHaveCount(0);
    expect(await (await api.get("/sitemap.xml")).text()).not.toContain(
      "/admin",
    );
    if (target.fixtures.free) {
      const ctx = await openAs(browser, target, "free");
      try {
        const member = await ctx.newPage();
        await member.goto("/account");
        await expect(member.locator('a[href*="admin" i]')).toHaveCount(0);
      } finally {
        await ctx.close();
      }
    }
  },
);
