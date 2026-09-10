import { test, expect } from "../../harness/fixtures";

/**
 * Section E — PR-004. 20 rapid wrong codes to /api/premium (Preview only,
 * no external service, the wrong codes are literals that cannot resemble a
 * real code; E2E_LEGACY_ACCESS_CODE is not read). EXPECTED FAIL today: the
 * code check has no guess limit.
 */

test(
  "PR-004 guessing access codes rapidly gets blocked",
  {
    tag: ["@PR-004", "@protection", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "EXPECTED FAIL / OBSERVE per the approved line. Design note: one shared code serves every buyer and is stored in the browser.",
    },
  },
  async ({ api }, testInfo) => {
    const send = (i: number) =>
      api.post("/api/premium", { data: { code: `bf-e2e-wrong-code-${i}` } });
    const first = await send(0);
    if (first.status() === 503)
      throw new Error(
        "[launch-gate] PREMIUM_ACCESS_CODES is not configured on this deployment (/api/premium answered 503) — set it for the Preview environment; the code check cannot be exercised.",
      );
    const statuses: number[] = [first.status()];
    for (let burst = 0; burst < 2; burst++) {
      const batch = await Promise.all(
        Array.from({ length: 10 }, (_, i) => send(burst * 10 + i + 1)),
      );
      for (const res of batch) {
        const status = res.status();
        statuses.push(status);
        expect([401, 403, 429], `unexpected status ${status}`).toContain(
          status,
        );
        const text = await res.text();
        if (status === 401)
          expect(JSON.parse(text)).toEqual({
            ok: false,
            message:
              "That code doesn’t match. Check your confirmation email — the code works on any device, any time.",
          });
        else {
          expect(text.length).toBeLessThan(400);
          expect(text).not.toMatch(/stack|node_modules|TypeError|<html/i);
        }
      }
    }
    const blocked = statuses.filter((s) => s === 429 || s === 403).length;
    testInfo.annotations.push({
      type: "observation",
      description: `${statuses.length} rapid wrong codes: ${statuses.filter((s) => s === 401).length}×401 refused individually, ${blocked}×blocked`,
    });
    expect(
      blocked,
      "Rapid wrong access codes were all refused individually (401) and never blocked — the code check has no guess limit (known open item: Upstash).",
    ).toBeGreaterThan(0);
  },
);
