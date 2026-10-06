import { test, expect } from "../../harness/fixtures";
import { statePath } from "../../harness/auth";
import { runId } from "../../harness/identities";
import {
  DOWNLOAD_DENIED_MESSAGE,
  expectDownloadDenied,
  expectPdf,
  settle,
} from "../../harness/pages";
import { apiAs } from "../../harness/roles";

/**
 * Section B — the paid downloads boundary (AC-011 … AC-015). Denied states
 * are asserted for a visitor and for an account without the Book Package;
 * allowed states for an owner and for a valid legacy access code. The
 * access code is read from E2E_LEGACY_ACCESS_CODE and never printed.
 */

const BOOK = "/api/premium/download?file=book";
const WORKBOOK = "/api/premium/download?file=workbook";

test(
  "AC-011 a visitor cannot download the complete book or the workbook by typing the download URL, with or without a made-up code",
  { tag: ["@AC-011", "@accounts", "@morning"] },
  async ({ api }) => {
    for (const path of [
      BOOK,
      WORKBOOK,
      `${BOOK}&code=made-up-${runId()}`,
      `${WORKBOOK}&code=made-up-${runId()}`,
    ]) {
      const res = await api.get(path);
      expect(
        res.headers()["content-disposition"],
        "no file may be offered",
      ).toBeUndefined();
      expect((await res.text()).startsWith("%PDF")).toBe(false);
      await expectDownloadDenied(api, path, path.split("&")[0]);
    }
  },
);

test.describe("an account without the Book Package", () => {
  test.use({ storageState: statePath("free") });
  test(
    "AC-012 an account holder without the Book Package cannot download the book or workbook, and their account page says No Book Package yet",
    { tag: ["@AC-012", "@accounts"] },
    async ({ page, playwright, target }) => {
      await page.goto("/account");
      await expect(
        page.getByRole("heading", { level: 2, name: "No Book Package yet" }),
      ).toBeVisible();
      await expect(page.getByText("one payment of $9.99")).toBeVisible();
      await expect(
        page.getByRole("link", { name: "See the Book Package →" }),
      ).toHaveAttribute("href", "/premium");
      await expect(
        page.getByRole("link", { name: "The complete book" }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("link", { name: "The companion workbook" }),
      ).toHaveCount(0);
      const asFree = await apiAs(playwright, target, "free");
      try {
        for (const path of [BOOK, WORKBOOK]) {
          const res = await asFree.get(path);
          expect(res.headers()["content-disposition"]).toBeUndefined();
          await expectDownloadDenied(asFree, path);
        }
      } finally {
        await asFree.dispose();
      }
    },
  );
});

test.describe("a Book Package owner", () => {
  test.use({ storageState: statePath("premium") });
  test(
    "AC-013 a Book Package owner can download the complete book and the companion workbook from Your account and from Premium",
    { tag: ["@AC-013", "@accounts", "@desktop-only"] },
    async ({ page, playwright, target }) => {
      await page.goto("/account");
      await expect(
        page.getByRole("heading", { level: 2, name: "The Book Package" }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "The complete book" }),
      ).toHaveAttribute("href", BOOK);
      await expect(
        page.getByRole("link", { name: "The companion workbook" }),
      ).toHaveAttribute("href", WORKBOOK);
      await expect(
        page.getByRole("link", { name: "Everything else in your package" }),
      ).toHaveAttribute("href", "/premium");
      const asOwner = await apiAs(playwright, target, "premium");
      try {
        const book = await expectPdf(asOwner, BOOK, { attachment: true });
        expect(book.filename).toBe("Bouncing-Forward-Book.pdf");
        expect(book.response.headers()["cache-control"] ?? "").toContain(
          "no-store",
        );
        const workbook = await expectPdf(asOwner, WORKBOOK, {
          attachment: true,
        });
        expect(workbook.filename).toBe("Bouncing-Forward-Workbook.pdf");
        await page.goto("/premium");
        await expect(
          page.getByRole("heading", {
            name: "Everything is open. Download what you need, come back for the rest.",
          }),
        ).toBeVisible();
        await expect(
          page.getByText(
            "Tied to your account — log in on any device and it’s all here.",
          ),
        ).toBeVisible();
        for (const [name, path] of [
          ["The complete book", BOOK],
          ["The companion workbook", WORKBOOK],
        ] as const) {
          const href = await page
            .getByRole("link", { name })
            .getAttribute("href");
          expect(href, `${name}: session-authorised link`).toBe(path);
          await expectPdf(asOwner, path, { attachment: true });
        }
      } finally {
        await asOwner.dispose();
      }
    },
  );

  test(
    "AC-014 a Book Package owner sees It’s all yours on Premium with the open download list, and the buy button becomes the account button",
    { tag: ["@AC-014", "@accounts"] },
    async ({ page }) => {
      const checkoutCalls: string[] = [];
      page.on("request", (r) => {
        if (r.url().includes("/api/checkout")) checkoutCalls.push(r.url());
      });
      await page.goto("/premium");
      await expect(page.getByText("Premium — yours for life")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "It’s all yours.",
      );
      await expect(
        page.getByText(/^Your Book Package is open in this account/),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "It’s yours — open your account →" }),
      ).toHaveCount(2);
      await expect(
        page.getByRole("button", { name: "Buy the Book Package — $9.99" }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("link", { name: "Log in to open your Book Package" }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("heading", {
          name: "Everything is open. Download what you need, come back for the rest.",
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 2,
          name: "Yours for life. Keep walking.",
        }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "It’s yours — open your account →" })
        .first()
        .click();
      await expect(page).toHaveURL(/\/account$/);
      await expect(
        page.getByRole("heading", { level: 2, name: "The Book Package" }),
      ).toBeVisible();
      expect(
        checkoutCalls,
        "an owner's Buy must never start a checkout",
      ).toEqual([]);
    },
  );
});

test(
  "AC-015 a legacy access-code holder can open the Premium library and downloads with a valid code, and a wrong code is refused",
  {
    tag: ["@AC-015", "@accounts", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "SHARED: the code is the live one (E2E_LEGACY_ACCESS_CODE), never printed. There is no field to type a code on /premium — the page only reads a remembered code from browser storage, so the library half pre-seeds that storage. The 401 message is never rendered on the page; it is observable over HTTP only.",
    },
  },
  async ({ page, browser, api, target }) => {
    const code = target.legacyAccessCode;
    if (!code)
      throw new Error(
        "[launch-gate] E2E_LEGACY_ACCESS_CODE is required for AC-015 (value withheld).",
      );
    const wrong = `wrong-code-${runId()}`;
    const OPEN =
      "Everything is open. Download what you need, come back for the rest.";

    const valid = await api.post("/api/premium", { data: { code } });
    expect(
      valid.status(),
      "the configured access code was refused (is PREMIUM_ACCESS_CODES set for the Preview?)",
    ).toBe(200);
    expect(await valid.json()).toEqual({ ok: true });
    const refused = await api.post("/api/premium", { data: { code: wrong } });
    expect(refused.status()).toBe(401);
    expect(((await refused.json()) as { message?: string }).message).toBe(
      "That code doesn’t match. Check your confirmation email — the code works on any device, any time.",
    );
    for (const file of ["book", "workbook"]) {
      await expectPdf(
        api,
        `/api/premium/download?file=${file}&code=${encodeURIComponent(code)}`,
        { label: `${file} with the access code`, attachment: true },
      );
      const denied = await api.get(
        `/api/premium/download?file=${file}&code=${encodeURIComponent(wrong)}`,
      );
      expect(denied.status(), `${file} with a wrong code`).toBe(401);
      expect(((await denied.json()) as { message?: string }).message).toBe(
        DOWNLOAD_DENIED_MESSAGE,
      );
    }

    await page.addInitScript(
      (value) => window.localStorage.setItem("bf-premium-code", value),
      code,
    );
    await page.goto("/premium");
    await expect(page.getByRole("heading", { name: OPEN })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByText(
        "Tied to your account — log in on any device and it’s all here.",
      ),
    ).toHaveCount(0);
    const href = await page
      .getByRole("link", { name: "The complete book" })
      .getAttribute("href");
    expect(
      href?.startsWith("/api/premium/download?file=book&code="),
      "the library link must carry the code (value withheld)",
    ).toBe(true);
    await expectPdf(api, href as string, {
      label: "the library's book link",
      attachment: true,
    });

    const other = await browser.newContext({ baseURL: target.origin });
    try {
      await other.addInitScript(
        (value) => window.localStorage.setItem("bf-premium-code", value),
        wrong,
      );
      const { admitContext } = await import("../../harness/fixtures");
      await admitContext(other, target);
      const locked = await other.newPage();
      await locked.goto("/premium");
      await settle(locked);
      await expect(
        locked.getByRole("heading", {
          level: 3,
          name: "Everything in Premium",
        }),
      ).toBeVisible();
      await expect(locked.getByRole("heading", { name: OPEN })).toHaveCount(0);
    } finally {
      await other.close();
    }
  },
);
