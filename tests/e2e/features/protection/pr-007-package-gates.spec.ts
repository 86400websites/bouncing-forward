import { test, expect } from "../../harness/fixtures";
import { statePath } from "../../harness/auth";
import { expectDownloadDenied } from "../../harness/pages";
import { apiAs } from "../../harness/roles";

/**
 * Section E — PR-007: everything gated by the Book Package is checked by the
 * server for a logged-out visitor and for a non-owner. The allowed (owner)
 * side is proven by AC-013 and PR-005; this ID is the denied-only line.
 */

const WRONG = "bf-e2e-not-a-real-code";
const FILES = [
  "/api/premium/download?file=book",
  "/api/premium/download?file=workbook",
];
const OPEN =
  "Everything is open. Download what you need, come back for the rest.";

test.use({ storageState: statePath("free") });

test(
  "PR-007 everything gated by the Book Package is checked by the server for both a logged-out visitor and a non-owner",
  {
    tag: ["@PR-007", "@protection", "@desktop-only"],
    annotation: {
      type: "note",
      description: "Covered by the AC-011 / AC-012 denied lines.",
    },
  },
  async ({ page, api, playwright, target }) => {
    const codeCheck = async (
      client: { post: typeof api.post },
      label: string,
    ) => {
      const res = await client.post("/api/premium", { data: { code: WRONG } });
      if (res.status() === 503)
        throw new Error(
          "[launch-gate] PREMIUM_ACCESS_CODES is not configured on this deployment (/api/premium answered 503).",
        );
      expect(res.status(), `${label}: wrong code`).toBe(401);
      expect(await res.json()).toEqual({
        ok: false,
        message:
          "That code doesn’t match. Check your confirmation email — the code works on any device, any time.",
      });
    };
    for (const path of FILES) {
      await expectDownloadDenied(api, path, `visitor ${path}`);
      await expectDownloadDenied(
        api,
        `${path}&code=${WRONG}`,
        `visitor ${path} with a wrong code`,
      );
    }
    await codeCheck(api, "visitor");
    const html = await (await api.get("/premium")).text();
    expect(html).toContain("Go all the way.");
    expect(html).not.toContain("It’s all yours.");
    expect(html).not.toContain(OPEN);

    const free = await apiAs(playwright, target, "free");
    try {
      for (const path of FILES) {
        await expectDownloadDenied(free, path, `non-owner ${path}`);
        await expectDownloadDenied(
          free,
          `${path}&code=${WRONG}`,
          `non-owner ${path} with a wrong code`,
        );
      }
      await codeCheck(free, "non-owner");
    } finally {
      await free.dispose();
    }
    await page.goto("/premium");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Go all the way.",
    );
    await expect(
      page.getByRole("heading", { name: "Everything in Premium" }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("button", { name: "Buy the Book Package — $9.99" })
        .first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "It’s yours — open your account →" }),
    ).toHaveCount(0);
    await expect(page.getByText(OPEN)).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "The complete book" }),
    ).toHaveCount(0);
    await page.goto("/account");
    await expect(
      page.getByRole("heading", { name: "No Book Package yet" }),
    ).toBeVisible();
  },
);
