import { test, expect } from "../harness/fixtures";

/**
 * SM-001 — the Phase 0 smoke test (docs/testing-setup/SETUP-CHECKLIST.md
 * Part 4): the homepage loads on the verified target with no errors.
 * Read-only. Runs under the desktop and 390px mobile profiles.
 */
test("@smoke SM-001 homepage loads with no errors", async ({
  page,
  target,
  consoleErrors,
}) => {
  const failedSameOrigin: string[] = [];
  page.on("response", (response) => {
    const url = response.url();
    if (url.startsWith(target.origin) && response.status() >= 400) {
      failedSameOrigin.push(`${response.status()} ${url}`);
    }
  });

  const response = await page.goto("/");
  expect(response, "No response for /").not.toBeNull();
  expect(response!.status()).toBe(200);
  if (target.mode !== "local") {
    expect(
      response!.headers()["x-vercel-id"],
      "Homepage response was not served by Vercel.",
    ).toBeTruthy();
  }

  await expect(page).toHaveTitle(
    "Bouncing Forward | Setbacks Don’t Get the Last Word",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The setback wasn’t your choice. The next step is.",
  );
  await expect(
    page.getByRole("link", { name: "Bouncing Forward — home" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Read the Book" }).first(),
  ).toBeVisible();
  await expect(page.locator("#byc-email")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();

  await page.waitForLoadState("networkidle");
  expect(failedSameOrigin, "Same-origin requests failed").toEqual([]);
  expect(consoleErrors, "Browser console reported errors").toEqual([]);
});
