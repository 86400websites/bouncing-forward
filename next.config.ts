import type { NextConfig } from "next";

/**
 * Security headers per TECH-ARCHITECTURE.md §13.
 * CSP is added in sprint 15 (launch-hardening) once the third-party surface is final
 * (next/font self-hosts, so the allow-list starts near-empty) — adding it
 * blind risks breaking Next's inline runtime. Tracked in SPRINT-PLAN.md.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // The paid Book Package PDFs live OUTSIDE public/ (no web URL) and are
  // streamed only by the code-checked download route. This makes sure
  // Vercel bundles them with that route.
  outputFileTracingIncludes: {
    "/api/premium/download": ["./private-content/book-package/*.pdf"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    // Blog slugs realigned to the canonical SEO doc; keep old URLs alive.
    const blog: [string, string][] = [
      ["the-losses-nobody-sends-flowers-for", "losses-nobody-sends-flowers-for"],
      ["why-month-eight-is-harder-than-week-two", "why-month-eight-is-harder"],
      ["when-people-say-this-will-make-you-stronger", "this-will-make-you-stronger"],
      [
        "becoming-someone-who-has-been-through-something",
        "someone-who-has-been-through-something",
      ],
    ];
    return [
      // Learn was renamed to The Course in the revised brief.
      { source: "/learn", destination: "/course", permanent: true },
      { source: "/workshops", destination: "/enterprise", permanent: true },
      { source: "/enterprises", destination: "/enterprise", permanent: true },
      ...blog.map(([from, to]) => ({
        source: `/blog/${from}`,
        destination: `/blog/${to}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
