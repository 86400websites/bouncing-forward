import { test, expect } from "../../harness/fixtures";

/**
 * Section A — security headers (PG-015). The next.config rule is a single
 * catch-all, so one response of every class is sampled: static page,
 * dynamic page, blog post, noindexed page, route handler, sitemap, static
 * PDF, verification file and a 404.
 */

const SAMPLE = [
  "/",
  "/premium",
  "/blog/losses-nobody-sends-flowers-for",
  "/login",
  "/api/health",
  "/sitemap.xml",
  "/downloads/BF-7-Step-Reflection-Journal.pdf",
  "/google777f049a86d5990c.html",
  "/launch-gate-no-such-page",
];

test(
  "PG-015 every page answers with the security headers",
  { tag: ["@PG-015", "@pages"] },
  async ({ api, target }, testInfo) => {
    const hsts: string[] = [];
    for (const path of SAMPLE) {
      const res = await api.get(path);
      const h = res.headers();
      expect(h["x-frame-options"], `${path}: X-Frame-Options`).toBe("DENY");
      expect(
        h["x-content-type-options"],
        `${path}: X-Content-Type-Options`,
      ).toBe("nosniff");
      expect(h["referrer-policy"], `${path}: Referrer-Policy`).toBe(
        "strict-origin-when-cross-origin",
      );
      expect(h["permissions-policy"], `${path}: Permissions-Policy`).toBe(
        "camera=(), microphone=(), geolocation=()",
      );
      if (target.mode === "local") continue; // plain http: no HSTS
      const value = h["strict-transport-security"] ?? "";
      hsts.push(`${path}: ${value}`);
      expect(value, `${path}: Strict-Transport-Security`).toMatch(
        /^max-age=\d+/,
      );
      expect(value, `${path}: HSTS max-age`).toContain("max-age=63072000");
    }
    testInfo.annotations.push({
      type: "note",
      description:
        hsts.join(" | ") || "HSTS not checked on a local http target.",
    });
  },
);
