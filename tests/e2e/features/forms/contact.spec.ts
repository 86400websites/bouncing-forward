import { test, expect } from "../../harness/fixtures";
import { LABEL, identity, runId } from "../../harness/identities";
import { recordFixture, requireDeploymentFact } from "../../harness/run-record";

/**
 * Section C — the Contact form (FM-007 … FM-009). Formspree is SHARED with
 * Production: FM-008 sends exactly one labelled message per run (MN-003
 * confirms it in the inbox); FM-009 stubs the provider inside the browser
 * and fails loudly if a request was not intercepted.
 */

const SENT = "Message sent — thank you.";
const SUBJECTS = [
  "Tell me more about Bouncing Forward",
  "Tell me more about All In",
  "Inquire about booking a workshop",
  "Inquire about upcoming events",
  "I’d like to share my story",
];
const isContactPost = (
  request: import("@playwright/test").Request,
): boolean => {
  if (request.method() !== "POST") return false;
  try {
    return (
      typeof (request.postDataJSON() as { _subject?: unknown })?._subject ===
      "string"
    );
  } catch {
    return false;
  }
};

test(
  "FM-007 the Contact form keeps Send disabled until name, email and message are filled, offers the five subjects, and rejects an invalid email before sending",
  {
    tag: ["@FM-007", "@forms"],
    annotation: {
      type: "note",
      description:
        "FIXED IN CANDIDATE — the email format was not checked before sending.",
    },
  },
  async ({ page }) => {
    const sent: string[] = [];
    page.on("request", (r) => {
      if (isContactPost(r)) sent.push("a contact submission left the browser");
    });
    await page.goto("/contact");
    const send = page.getByRole("button", { name: "Send", exact: true });
    await expect(send).toBeDisabled();
    await page.locator("#c-name").fill("Launch Gate");
    await expect(send).toBeDisabled();
    await page.locator("#c-email").fill("not-an-email");
    await expect(send).toBeDisabled();
    await page
      .locator("#c-message")
      .fill("FM-007 validation check — never sent");
    await expect(send).toBeEnabled();
    await expect(page.locator("#c-subject option")).toHaveText(SUBJECTS);
    await expect(page.locator("#c-subject")).toHaveValue(SUBJECTS[0]);
    await send.click();
    await expect(
      page.getByText("Please enter a valid email address."),
    ).toBeVisible();
    await expect(page.getByText(SENT)).toHaveCount(0);
    await page.waitForTimeout(1000);
    expect(
      sent,
      "the invalid email must stop the submission before any request",
    ).toEqual([]);
    await page.locator("#c-message").fill("   ");
    await expect(send).toBeDisabled();
  },
);

test(
  "FM-008 a valid contact message shows the sent confirmation and actually reaches the inbox",
  {
    tag: ["@FM-008", "@forms", "@desktop-only"],
    annotation: [
      {
        type: "note",
        description:
          "SHARED live Formspree form: exactly one labelled message per run. The subject is a fixed choice, so the [LAUNCH GATE TEST] label goes in the name and the message body.",
      },
      {
        type: "manual",
        description:
          "MN-003: confirm the [LAUNCH GATE TEST] message arrived at info@bouncing-forward.com (and in the Formspree submissions list), then delete it.",
      },
    ],
  },
  async ({ page }, testInfo) => {
    requireDeploymentFact(
      "contactEndpointConfigured",
      "NEXT_PUBLIC_FORMSPREE_ENDPOINT",
    );
    const email = identity("contact");
    const label = `${LABEL} run ${runId()}`;
    recordFixture({ kind: "contact-message", ref: label, createdBy: "FM-008" });
    await page.goto("/contact");
    await page.locator("#c-name").fill(`${LABEL} Bouncing Forward Launch Gate`);
    await page.locator("#c-email").fill(email);
    await page
      .locator("#c-message")
      .fill(
        `${LABEL} Automated Launch Gate check (run ${runId()}). This is a test message from the Launch Gate suite — please delete it (MN-003).`,
      );
    const providerResponse = page.waitForResponse(
      (r) => isContactPost(r.request()),
      { timeout: 20_000 },
    );
    await page.getByRole("button", { name: "Send", exact: true }).click();
    const res = await providerResponse;
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      errors?: { message?: string }[];
    };
    testInfo.annotations.push({
      type: "formspree",
      description: `HTTP ${res.status()} ok=${String(body.ok)}${Array.isArray(body.errors) ? " errors=" + body.errors.map((e) => e.message ?? "?").join("; ") : ""}`,
    });
    await expect(page.getByText(SENT)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("as soon as we can.")).toBeVisible();
    await expect(
      page.getByText("Please enter a valid email address."),
    ).toHaveCount(0);
  },
);

test(
  "FM-009 when the contact provider rejects or fails, the form shows an error and never a false sent",
  {
    tag: ["@FM-009", "@forms", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "FIXED IN CANDIDATE — success now requires the provider to confirm. The provider is stubbed inside the browser (a 200 that says no, a 500, a network failure); the test fails loudly if a request was not intercepted.",
    },
  },
  async ({ page, target }) => {
    requireDeploymentFact(
      "contactEndpointConfigured",
      "NEXT_PUBLIC_FORMSPREE_ENDPOINT",
    );
    let hits = 0;
    const answers: ({
      status: number;
      contentType: string;
      body: string;
    } | null)[] = [
      {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          errors: [
            {
              message:
                "Launch Gate stub: the provider rejected this submission",
            },
          ],
        }),
      },
      { status: 500, contentType: "text/plain", body: "Internal Server Error" },
      null,
    ];
    const offSite = (url: URL) => url.origin !== target.origin;
    await page.route(offSite, async (route) => {
      if (!isContactPost(route.request())) return route.fallback();
      const answer = answers[Math.min(hits++, answers.length - 1)];
      return answer ? route.fulfill(answer) : route.abort("failed");
    });
    try {
      await page.goto("/contact");
      const send = page.getByRole("button", { name: "Send", exact: true });
      await page
        .locator("#c-name")
        .fill(`${LABEL} provider-failure probe (never delivered)`);
      await page.locator("#c-email").fill(identity("contact"));
      await page
        .locator("#c-message")
        .fill(`${LABEL} FM-009 — intercepted in the browser, never sent`);
      const notIntercepted =
        "the contact request was not intercepted — a real message may have reached the inbox; check MN-003";
      await send.click();
      await expect
        .poll(() => hits, { timeout: 10_000, message: notIntercepted })
        .toBe(1);
      await expect(
        page.getByText(
          "Launch Gate stub: the provider rejected this submission",
        ),
      ).toBeVisible();
      await expect(page.getByText(SENT)).toHaveCount(0);
      await expect(send).toBeEnabled();
      await send.click();
      await expect
        .poll(() => hits, { timeout: 10_000, message: notIntercepted })
        .toBe(2);
      await expect(
        page.getByText(
          "Something went wrong sending your message — please try again.",
        ),
      ).toBeVisible();
      await expect(page.getByText(SENT)).toHaveCount(0);
      await send.click();
      await expect
        .poll(() => hits, { timeout: 10_000, message: notIntercepted })
        .toBe(3);
      await expect(
        page.getByText(
          "We couldn’t send your message just now — please try again.",
        ),
      ).toBeVisible();
      await expect(page.getByText(SENT)).toHaveCount(0);
    } finally {
      await page.unroute(offSite);
    }
  },
);
