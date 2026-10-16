import { test, expect } from "../harness/fixtures";
import { PROD_SUPABASE_REF, TEST_SUPABASE_REF } from "../harness/target";

/**
 * P1 (public half) — docs/ENVIRONMENT-PARITY.md §12.
 *
 * Next.js inlines NEXT_PUBLIC_SUPABASE_URL into the browser bundle at build
 * time, so the compiled JavaScript a deployment serves reveals which
 * Supabase project its public client talks to. This is a read-only check:
 * it loads the homepage and inspects the served scripts. It never signs in
 * and never writes. The privileged (server) half of P1 is proven by P5.
 */
test("@proof P1a the served bundle points the public client at the expected Supabase project", async ({
  page,
  target,
}) => {
  test.skip(
    target.mode === "local",
    "Local builds carry the developer's own environment; provenance is checked on deployed targets.",
  );

  const refs = new Set<string>();
  page.on("response", async (response) => {
    const url = response.url();
    if (
      !url.startsWith(target.origin) ||
      !/\/_next\/static\/.+\.js(\?|$)/.test(url)
    ) {
      return;
    }
    try {
      const body = await response.text();
      for (const match of body.matchAll(
        /https:\/\/([a-z0-9]{20})\.supabase\.co/g,
      )) {
        refs.add(match[1]);
      }
    } catch {
      // A chunk that could not be read is not evidence either way.
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const expected =
    target.mode === "production-morning"
      ? PROD_SUPABASE_REF
      : TEST_SUPABASE_REF;
  expect(
    refs.size,
    "No Supabase project URL was compiled into the served bundle — accounts are not configured on this deployment.",
  ).toBeGreaterThan(0);
  expect(
    [...refs],
    `The public client is compiled against a different Supabase project than the ${target.mode} target allows.`,
  ).toEqual([expected]);
});
