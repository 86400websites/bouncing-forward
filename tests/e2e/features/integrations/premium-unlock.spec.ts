import { test, expect } from "../../harness/fixtures";
import { deviceUnlockFlag } from "../../harness/assessment";
import { statePath } from "../../harness/auth";
import { settle, watchSameOriginFailures } from "../../harness/pages";

/**
 * Section F — an owner's visit to Premium unlocks All In and the Course on
 * that device (IN-007). Uses the premium fixture's saved session; never a
 * checkout.
 */

test.use({ storageState: statePath("premium") });

test(
  "IN-007 a Book Package owner visiting Premium also unlocks the All In library and the Course on that device",
  { tag: ["@IN-007", "@integrations"] },
  async ({ page, context, target }) => {
    test.setTimeout(120_000);
    const failures = watchSameOriginFailures(page, target);
    const lockedLibrary = () =>
      page.locator("#library").getByRole("heading", {
        level: 3,
        name: "Take the Full Assessment, and this opens.",
      });
    const openLibrary = () =>
      page.getByRole("heading", {
        level: 3,
        name: "Everything below is yours.",
      });
    const lockedModules = () =>
      page.getByText("Video and worksheet open with the Full Assessment.", {
        exact: true,
      });
    const players = () => page.locator("#modules ol > li iframe");

    // Denied half: an owner who has not visited Premium on this device is still closed.
    await page.goto("/all-in");
    await expect(lockedLibrary()).toBeVisible();
    expect(await deviceUnlockFlag(page)).toBeNull();

    await page.goto("/premium");
    await expect(page.getByText("Premium — yours for life")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "It’s all yours.",
    );
    await expect(
      page.getByRole("button", { name: "It’s yours — open your account →" }),
    ).toHaveCount(2);
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Everything is open. Download what you need, come back for the rest.",
      }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Tied to your account — log in on any device and it’s all here.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "The complete book" }),
    ).toHaveAttribute("href", "/api/premium/download?file=book");
    await expect(
      page.getByRole("link", {
        name: "The nine-module course, with worksheets",
      }),
    ).toHaveAttribute("href", "/course");
    await expect.poll(() => deviceUnlockFlag(page)).toBe("1");

    await page.goto("/all-in");
    await expect(page.getByText("Your All In library · open")).toBeVisible();
    await expect(openLibrary()).toBeVisible();
    await expect(page.locator('#library a[href$=".pdf"]')).toHaveCount(13);

    await page.goto("/course");
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Take the Full Assessment, and every module opens.",
      }),
    ).toHaveCount(0);
    await expect(lockedModules()).toHaveCount(0);
    await expect(players()).toHaveCount(9);
    await expect(
      page.getByRole("link", { name: "Download this module’s worksheet ↓" }),
    ).toHaveCount(9);

    // Device, not session: drop only the Supabase session cookies (the bypass cookie stays).
    await context.clearCookies({ name: /^sb-/ });
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login/);
    await page.goto("/course");
    await expect(players()).toHaveCount(9);
    await expect(lockedModules()).toHaveCount(0);
    await page.goto("/all-in");
    await expect(openLibrary()).toBeVisible();
    await settle(page);
    expect(failures, "same-origin requests failed").toEqual([]);
  },
);
