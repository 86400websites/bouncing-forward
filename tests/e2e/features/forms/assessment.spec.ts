import { test, expect } from "../../harness/fixtures";
import {
  completeFullAssessment,
  deviceUnlockFlag,
} from "../../harness/assessment";
import { identity } from "../../harness/identities";
import { memberOf } from "../../harness/mailchimp";
import { recordFixture } from "../../harness/run-record";

/**
 * Section C — the Full Assessment's email step (FM-006). The one real
 * write to the shared audience for the "assessment" identity happens
 * here; the integrations specs answer the same request inside the browser.
 */

test(
  "FM-006 finishing the Full Assessment and entering an email opens the results and the All In library, tags the address full-assessment, and access opens even if Mailchimp fails",
  {
    tag: ["@FM-006", "@forms", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "SHARED audience: one controlled identity, registered for archiving; the All In welcome email's arrival is MN-004. The failure half aborts the request inside the browser — nothing is written.",
    },
  },
  async ({ page, target }) => {
    test.setTimeout(120_000);
    const email = identity("assessment");
    await memberOf(target, email); // fails naming the Mailchimp variables before any write happens
    recordFixture({
      kind: "mailchimp-member",
      ref: "assessment",
      createdBy: "FM-006",
    });
    const lib = page.locator("#library");
    await page.goto("/all-in");
    await expect(
      lib.getByRole("heading", {
        name: "Take the Full Assessment, and this opens.",
      }),
    ).toBeVisible();
    expect(await deviceUnlockFlag(page)).toBeNull();

    const answers = Array.from({ length: 24 }, (_, i) => (i % 5) + 1);
    const posted = page.waitForRequest(
      (r) =>
        r.url() === `${target.origin}/api/newsletter` && r.method() === "POST",
      { timeout: 60_000 },
    );
    await completeFullAssessment(page, { answers, email });
    const request = await posted;
    expect(request.postDataJSON()).toMatchObject({ source: "full-assessment" });
    await expect(
      page.getByText("You’re all in.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Your All In library is open — download everything ↓",
      }),
    ).toBeVisible();
    await expect(lib.getByText("Your All In library · open")).toBeVisible();
    await expect(
      lib.getByRole("heading", { name: "Everything below is yours." }),
    ).toBeVisible();
    await expect(
      lib.getByRole("link", { name: "Bouncing Forward — the Book Summary" }),
    ).toBeVisible();
    expect(await deviceUnlockFlag(page)).toBe("1");
    await expect
      .poll(
        async () => {
          const m = await memberOf(target, email);
          return m
            ? { status: m.status, hasTag: m.tags.includes("full-assessment") }
            : null;
        },
        { timeout: 20_000, intervals: [2000] },
      )
      .toEqual({ status: "subscribed", hasTag: true });

    // Access opens even if Mailchimp fails: the request is aborted in the browser.
    await page.evaluate(() => {
      window.localStorage.removeItem("bf-allin-open");
      window.localStorage.removeItem("bf-fa-result");
    });
    await page.reload();
    let aborted = 0;
    await page.route(`${target.origin}/api/newsletter`, (route) => {
      aborted++;
      return route.abort("failed");
    });
    await completeFullAssessment(page, { answers, email });
    await expect
      .poll(() => aborted, {
        message:
          "the assessment did not post its email step on the second pass",
      })
      .toBe(1);
    await expect(
      page.getByText("You’re all in.", { exact: true }),
    ).toBeVisible();
    await expect(
      lib.getByRole("heading", { name: "Everything below is yours." }),
    ).toBeVisible();
    await page.unroute(`${target.origin}/api/newsletter`);
  },
);
