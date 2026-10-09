import { test, expect } from "../../harness/fixtures";
import { statePath } from "../../harness/auth";
import {
  DOWNLOAD_DENIED_MESSAGE,
  expectDownloadDenied,
  expectPdf,
  expectVisitorRedirectedToLogin,
} from "../../harness/pages";
import { apiAs } from "../../harness/roles";

/**
 * Section E — PR-005: the paid files and the account page are protected on
 * the server, not just hidden. A direct re-assertion of AC-010 … AC-013 at
 * the HTTP boundary: visitor (api), account holder without the package
 * (page + apiAs free), owner (apiAs premium).
 */

const FILES = [
  "/api/premium/download?file=book",
  "/api/premium/download?file=workbook",
];

test.use({ storageState: statePath("free") });

test(
  "PR-005 paid files and the account page are protected on the server, not just hidden",
  {
    tag: ["@PR-005", "@protection", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "Covered by AC-010 to AC-013; both the allowed and the denied states are asserted here at the server boundary.",
    },
  },
  async ({ page, api, playwright, target }) => {
    await test.step("visitor: /account is a server redirect", async () => {
      await expectVisitorRedirectedToLogin(api, "/account");
    });
    await test.step("visitor: paid files refused", async () => {
      for (const path of FILES) await expectDownloadDenied(api, path);
    });
    await test.step("account holder: the no-package state is rendered by the server", async () => {
      await page.goto("/account");
      await expect(page.getByText("Signed in as")).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "No Book Package yet" }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "See the Book Package →" }),
      ).toHaveAttribute("href", "/premium");
      await expect(
        page.getByRole("heading", { name: "The Book Package" }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("link", { name: "The complete book" }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("link", { name: "The companion workbook" }),
      ).toHaveCount(0);
    });
    const free = await apiAs(playwright, target, "free");
    const premium = await apiAs(playwright, target, "premium");
    try {
      await test.step("account holder: paid files refused", async () => {
        for (const path of FILES) {
          const body = await expectDownloadDenied(free, path);
          expect(body.message).toBe(DOWNLOAD_DENIED_MESSAGE);
        }
      });
      await test.step("owner: paid files allowed", async () => {
        const book = await expectPdf(premium, FILES[0], { attachment: true });
        expect(book.filename).toBe("Bouncing-Forward-Book.pdf");
        const workbook = await expectPdf(premium, FILES[1], {
          attachment: true,
        });
        expect(workbook.filename).toBe("Bouncing-Forward-Workbook.pdf");
      });
    } finally {
      await free.dispose();
      await premium.dispose();
    }
  },
);
