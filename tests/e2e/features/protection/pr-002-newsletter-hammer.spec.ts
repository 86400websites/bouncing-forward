import { test, expect } from "../../harness/fixtures";

/**
 * Section E — PR-002. Bounded, Mailchimp-safe probe: every request carries
 * an email that fails the server's own format check, so the handler answers
 * 400 BEFORE Mailchimp is ever called — nothing reaches the shared audience.
 * 30 requests maximum. EXPECTED FAIL today: no rate limit exists. A limiter
 * placed only after validation would not be observed; the failure message
 * says so.
 */

test(
  "PR-002 rapid-fire sign-ups to the 7 Step Journal form get rejected",
  {
    tag: ["@PR-002", "@protection", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        'The approved line says NOT RUN against the shared audience; this bounded probe honours that reason (invalid input rejected before any Mailchimp call) while producing a real result. Owner may re-word the line to "bounded, upstream-free probe".',
    },
  },
  async ({ api }, testInfo) => {
    const send = () =>
      api.post("/api/newsletter", {
        data: {
          email: "not-an-email",
          firstName: "Launch Gate",
          source: "newsletter",
        },
      });
    const statuses: number[] = [];
    let mitigated = 0;
    for (let burst = 0; burst < 3; burst++) {
      const batch = await Promise.all(Array.from({ length: 10 }, send));
      for (const res of batch) {
        const status = res.status();
        statuses.push(status);
        expect(
          [400, 429],
          `unexpected status ${status} — a 200 would mean a request passed validation; a 5xx is an error-hygiene failure`,
        ).toContain(status);
        const text = await res.text();
        if (status === 400)
          expect(JSON.parse(text)).toEqual({
            ok: false,
            message: "Please enter a valid email address.",
          });
        else {
          expect(text.length).toBeLessThan(400);
          expect(text).not.toMatch(
            /stack|node_modules|TypeError|<html|mailchimp/i,
          );
          if (res.headers()["x-vercel-mitigated"]) mitigated++;
        }
      }
    }
    const count429 = statuses.filter((s) => s === 429).length;
    testInfo.annotations.push({
      type: "observation",
      description: `30 rapid requests: ${statuses.filter((s) => s === 400).length}×400, ${count429}×429${mitigated ? ` (${mitigated} by the platform)` : ""}`,
    });
    expect(
      count429,
      "30 rapid sign-up requests were each processed individually (400) and none was rate-limited — no application rate limit exists on /api/newsletter (known launch-blocking item: Upstash). No request reached Mailchimp.",
    ).toBeGreaterThan(0);
  },
);
