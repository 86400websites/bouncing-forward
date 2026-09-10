import { test, expect } from "../../harness/fixtures";
import { settle, watchSameOriginFailures } from "../../harness/pages";
import { PUBLIC_PAGES } from "./inventory";

/**
 * Section A — pages that load (docs/FEATURE-LIST.md PG-001, PG-003).
 * Read-only; runs under both the desktop and the 390 px projects.
 */

test(
  "PG-001 every public page loads with no errors, on desktop and on a 390px phone",
  { tag: ["@PG-001", "@pages"] },
  async ({ page, target, consoleErrors }) => {
    test.setTimeout(240_000);
    for (const { path, h1 } of PUBLIC_PAGES) {
      await test.step(path, async () => {
        consoleErrors.length = 0;
        const failures = watchSameOriginFailures(page, target);
        const response = await page.goto(path);
        expect(response, `${path}: no response`).not.toBeNull();
        expect(response!.status(), `${path}: unexpected status`).toBe(200);
        if (target.mode !== "local") {
          expect(
            response!.headers()["x-vercel-id"],
            `${path}: not served by Vercel`,
          ).toBeTruthy();
        }
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
        await settle(page);
        expect(failures, `${path}: same-origin requests failed`).toEqual([]);
        expect(
          consoleErrors,
          `${path}: the browser console reported errors`,
        ).toEqual([]);
      });
    }
  },
);

test(
  "PG-003 a wrong URL shows the site's own 404 page",
  {
    tag: ["@PG-003", "@pages"],
    annotation: {
      type: "note",
      description:
        "EXPECTED FAIL (Low) while the 404 page prints the leftover scaffold line; the assertion is real and flips to PASS once the line is removed.",
    },
  },
  async ({ page }) => {
    const response = await page.goto("/launch-gate-this-path-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page
        .getByRole("banner")
        .getByRole("link", { name: "Bouncing Forward — home" }),
    ).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "This path doesn't exist.",
    );
    await expect(
      page.getByText(
        "The page you're looking for isn't here. The way forward is back to the start.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Scaffold stub — full page arrives in"),
    ).toHaveCount(0);
  },
);
