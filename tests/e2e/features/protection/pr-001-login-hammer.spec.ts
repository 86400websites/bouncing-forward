import { test, expect } from "../../harness/fixtures";
import { fillQuietly } from "../../harness/auth";
import { randomPassword } from "../../harness/identities";

/**
 * Section E — PR-001. Being blocked is the PASS. EXPECTED FAIL today: no
 * application rate limit exists on Log in, and Supabase's own per-IP limit
 * sits above the 20 attempts made here. Bounded to 20 attempts; the wrong
 * passwords are random strings (never the real one) and nothing is printed.
 */

const BLOCK_RE =
  /rate limit|too many|try again (later|in)|locked|blocked|slow down|security purposes/i;

test(
  "PR-001 hammering Log in with wrong passwords gets blocked",
  {
    tag: ["@PR-001", "@protection", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "EXPECTED FAIL / OBSERVE per the approved line: records what happens after 20 rapid failures (known open item: Upstash).",
    },
  },
  async ({ page, target }, testInfo) => {
    test.setTimeout(150_000);
    if (!target.fixtures.free)
      throw new Error(
        "[launch-gate] E2E_FREE_USER_EMAIL and E2E_FREE_USER_PASSWORD are required for PR-001 (only the email is typed; no password value is ever used or printed).",
      );
    await page.goto("/login");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Log in.");
    await fillQuietly(
      page.locator("#auth-email"),
      target.fixtures.free.email,
      "email address",
    );
    const button = page.getByRole("button", { name: "Log in", exact: true });
    const results: { attempt: number; status: number; text: string }[] = [];
    let blockedAt: number | null = null;
    for (let attempt = 1; attempt <= 20; attempt++) {
      await fillQuietly(
        page.locator("#current-password"),
        randomPassword(),
        "password",
      );
      const [res] = await Promise.all([
        page.waitForResponse(
          (r) =>
            r.request().method() === "POST" &&
            new URL(r.url()).pathname === "/login",
          { timeout: 15_000 },
        ),
        button.click(),
      ]);
      await expect(button).toBeEnabled({ timeout: 15_000 });
      const text = (
        (await page.getByTestId("auth-error").textContent()) ?? ""
      ).trim();
      results.push({ attempt, status: res.status(), text });
      if (res.status() === 429 || res.status() === 403 || BLOCK_RE.test(text)) {
        blockedAt = attempt;
        break;
      }
    }
    testInfo.annotations.push({
      type: "observation",
      description: `${results.length} rapid wrong-password attempts; statuses ${[...new Set(results.map((r) => r.status))].join(", ")}; messages ${[...new Set(results.map((r) => r.text))].join(" | ")}`,
    });
    for (const r of results.filter((x) => x.attempt !== blockedAt)) {
      expect(r.text, `attempt ${r.attempt} was not refused`).toContain(
        "Invalid login credentials",
      );
      expect(r.status, `attempt ${r.attempt} errored`).toBeLessThan(500);
    }
    expect(
      blockedAt,
      'No block after 20 rapid wrong-password attempts: every attempt was answered individually with "Invalid login credentials". No application rate limit exists on Log in and Supabase\'s per-IP limit did not trigger (known open item: Upstash).',
    ).not.toBeNull();
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login(\?|$)/);
    await expect(page.getByText("Signed in as")).toHaveCount(0);
  },
);
