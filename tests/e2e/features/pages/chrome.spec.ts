import { test, expect } from "../../harness/fixtures";
import { sessionCookies } from "../../harness/auth";
import { openMobileMenu, settle } from "../../harness/pages";

/**
 * Section A — the shared chrome (PG-016, PG-017). The phone variant runs
 * under the 390 px project; under the desktop project the same tests
 * assert the desktop navigation so both projects exercise the line.
 */

const MOBILE_BREAKPOINT = 1024;
const isPhone = (width: number | undefined) =>
  (width ?? 1280) < MOBILE_BREAKPOINT;

const TOP_LINKS: [string, string][] = [
  ["The Book", "/book"],
  ["The Author", "/about"],
  ["The Course", "/course"],
  ["Resources", "/compass-and-path"],
  ["All In", "/all-in"],
  ["Premium", "/premium"],
  ["Enterprise", "/enterprise"],
  ["Contact", "/contact"],
  ["Log In", "/login"],
];
const RESOURCES_LINKS: [string, string][] = [
  ["The 4-Element Compass", "/compass-and-path#compass"],
  ["The 4-Step Path", "/compass-and-path#path"],
  ["Where’s Here?", "/assess"],
  ["Stories", "/stories"],
  ["Blog", "/blog"],
];
const ALL_IN_LINKS: [string, string][] = [
  ["What’s Inside", "/all-in#a-inside"],
  ["What’s Included", "/all-in#a-included"],
  ["Take the Full Assessment", "/all-in#full-assessment"],
  ["Your Library", "/all-in#library"],
];

test(
  "PG-016 on a phone the menu button opens the full menu, links work, the menu closes, and Skip to content works with the keyboard",
  { tag: ["@PG-016", "@pages"] },
  async ({ page }, testInfo) => {
    await page.goto("/");
    const phone = isPhone(page.viewportSize()?.width);
    const button = page.getByRole("button", { name: "Open menu" });
    if (phone) {
      await expect(button).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();
      const dialog = await openMobileMenu(page);
      const nav = dialog.getByRole("navigation", { name: "Mobile" });
      for (const [name, href] of TOP_LINKS) {
        const link = nav.getByRole("link", { name, exact: true });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", href);
      }
      for (const [group, links] of [
        ["Resources", RESOURCES_LINKS],
        ["All In", ALL_IN_LINKS],
      ] as const) {
        const toggle = nav.getByRole("button", { name: `${group} submenu` });
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        for (const [name, href] of links) {
          const link = nav.getByRole("link", { name, exact: true });
          await expect(link).toBeVisible();
          await expect(link).toHaveAttribute("href", href);
        }
      }
      await nav.getByRole("link", { name: "The Book", exact: true }).click();
      await expect(page).toHaveURL(/\/book$/);
      await expect(dialog).toBeHidden();
      const again = await openMobileMenu(page);
      await again.getByRole("button", { name: "Close" }).click();
      await expect(again).toBeHidden();
    } else {
      testInfo.annotations.push({
        type: "note",
        description:
          "Desktop project: the phone menu is hidden; the desktop navigation and the skip link are asserted instead (the approved line is the phone; the 390 px project covers it).",
      });
      await expect(button).toBeHidden();
      const main = page.getByRole("navigation", { name: "Main" });
      await expect(main).toBeVisible();
      for (const [name, href] of TOP_LINKS)
        await expect(
          main.getByRole("link", { name, exact: true }),
        ).toHaveAttribute("href", href);
      const resources = main.getByRole("button", { name: "Resources menu" });
      await resources.hover();
      await expect(resources).toHaveAttribute("aria-expanded", "true");
      await expect(main.getByRole("menuitem")).toHaveCount(5);
      await expect(main.getByRole("menuitem").first()).toBeVisible();
    }

    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
    await page.keyboard.press("Tab");
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            Boolean(document.activeElement?.closest("#main")),
          ),
        {
          message:
            "After the skip link, focus did not move into the main content.",
        },
      )
      .toBe(true);
  },
);

test(
  "PG-017 the header shows Log In to a visitor and flips to Account once signed in",
  { tag: ["@PG-017", "@pages"] },
  async ({ page, context }, testInfo) => {
    await page.goto("/");
    const phone = isPhone(page.viewportSize()?.width);
    const pill = async (name: "Log In" | "Account") => {
      if (phone) {
        const dialog = page.getByRole("dialog", { name: "Bouncing Forward" });
        if (!(await dialog.isVisible().catch(() => false)))
          await openMobileMenu(page);
        return dialog.getByRole("link", { name, exact: true });
      }
      return page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name, exact: true });
    };

    await settle(page); // the pill is painted "Log In" on the server and only re-evaluated after hydration
    const visitor = await pill("Log In");
    await expect(visitor).toBeVisible();
    await expect(visitor).toHaveAttribute("href", "/login");
    await expect(await pill("Account")).toHaveCount(0);

    // Sign the same context in with the free fixture's session cookies only
    // (the deployment-protection cookie already in the context is kept).
    await context.addCookies(sessionCookies("free"));
    await page.goto("/");
    const account = await pill("Account");
    await expect(account).toBeVisible({ timeout: 10_000 });
    await expect(account).toHaveAttribute("href", "/account");
    await expect(await pill("Log In")).toHaveCount(0);
    const requested = page
      .waitForRequest((r) => new URL(r.url()).pathname === "/account", {
        timeout: 15_000,
      })
      .then(() => "the click requested /account")
      .catch(() => "the click issued no request for /account");
    await account.click();
    testInfo.annotations.push({
      type: "observation",
      description: await requested,
    });
    await expect(page).toHaveURL(/\/account$/, { timeout: 15_000 });
    await expect(page.getByText("Signed in as")).toBeVisible();
  },
);
