import { expect, type Page } from "@playwright/test";
import { fillQuietly } from "./auth";

/**
 * Drivers for the Quick Look (10 statements) and Full Assessment (24
 * statements) components in src/components/assess. Every wait is the
 * default expect timeout; nothing retries. The email typed at the gate is
 * an identity from identities.ts and is withheld from failure messages.
 */

export const FULL_ASSESSMENT_RESULT_HEADING =
  "Here’s where you are - honestly, and without a score.";

/**
 * Clicks `${n} out of 5` for each answer and waits for the counter to
 * advance (`${i + 2} of ${total}`), or for the last counter to leave the
 * page after the final answer. The counter may be prefixed by a path
 * label ("Accept · 13 of 24"), so it is matched at the end of the text.
 */
export async function answerStatements(
  page: Page,
  answers: number[],
  total: 10 | 24,
): Promise<void> {
  for (let i = 0; i < answers.length; i++) {
    const n = answers[i];
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      throw new Error(
        `[launch-gate] Assessment answers must be integers 1–5 (answer ${i + 1} is not).`,
      );
    }
    await page
      .getByRole("button", { name: `${n} out of 5`, exact: true })
      .click();
    if (i + 1 < total) {
      await expect(
        page.getByText(new RegExp(`(^|\\s)${i + 2} of ${total}$`)),
      ).toBeVisible();
    } else {
      await expect(
        page.getByText(new RegExp(`(^|\\s)${total} of ${total}$`)),
      ).toBeHidden();
    }
  }
}

/**
 * From the Full Assessment intro: "Take an honest look →", "Begin →", the
 * 24 answers, then the email gate ("Email address" → "Open everything →")
 * when it appears (a device that is already unlocked skips it). Resolves
 * once the results heading is visible.
 */
export async function completeFullAssessment(
  page: Page,
  opts: { answers: number[]; email: string },
): Promise<void> {
  if (opts.answers.length !== 24) {
    throw new Error(
      `[launch-gate] The Full Assessment needs exactly 24 answers (got ${opts.answers.length}).`,
    );
  }
  await page.getByRole("button", { name: "Take an honest look →" }).click();
  await page.getByRole("button", { name: "Begin →" }).click();
  await answerStatements(page, opts.answers, 24);
  // The gate's field is addressed by id: the page's sign-up block carries
  // the same "Email address" label, and the gate fades in after the last
  // answer, so wait for either the gate or the results before deciding.
  const gate = page.locator("#fa-email");
  const results = page.getByText(FULL_ASSESSMENT_RESULT_HEADING);
  await expect(gate.or(results).first()).toBeVisible({ timeout: 15_000 });
  if (await gate.isVisible()) {
    await fillQuietly(gate, opts.email, "assessment email");
    await page.getByRole("button", { name: "Open everything →" }).click();
  }
  await expect(results).toBeVisible({ timeout: 15_000 });
}

/**
 * Answers /api/newsletter in the browser with `{ ok: true }` and records
 * what the page posted (identity text only — never logged). Use it when a
 * spec must not add a member to the shared audience.
 */
export async function stubNewsletterPost(
  page: Page,
): Promise<Array<{ email?: string; source?: string; company?: string }>> {
  const posts: Array<{ email?: string; source?: string; company?: string }> =
    [];
  await page.route("**/api/newsletter", async (route) => {
    try {
      posts.push(
        (route.request().postDataJSON() ?? {}) as {
          email?: string;
          source?: string;
          company?: string;
        },
      );
    } catch {
      posts.push({});
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });
  return posts;
}

/**
 * Accepts every window.confirm (or decides per message) and returns the
 * collected messages. Register before the action that opens the dialog.
 */
export function acceptConfirmDialogs(
  page: Page,
  decide?: (message: string) => boolean,
): string[] {
  const messages: string[] = [];
  page.on("dialog", async (dialog) => {
    messages.push(dialog.message());
    const accept = decide ? decide(dialog.message()) : true;
    if (accept) await dialog.accept();
    else await dialog.dismiss();
  });
  return messages;
}

/** The browser-only All In / Course unlock flag (localStorage "bf-allin-open"). */
export async function deviceUnlockFlag(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    try {
      return window.localStorage.getItem("bf-allin-open");
    } catch {
      return null;
    }
  });
}

/** The saved Full Assessment reading (localStorage "bf-fa-result"), parsed. */
export async function savedReading(page: Page): Promise<number[] | null> {
  return page.evaluate(() => {
    try {
      const raw = window.localStorage.getItem("bf-fa-result");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as number[]) : null;
    } catch {
      return null;
    }
  });
}
