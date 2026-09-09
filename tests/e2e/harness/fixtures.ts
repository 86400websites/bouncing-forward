import {
  test as base,
  expect,
  type APIRequestContext,
  type APIResponse,
  type BrowserContext,
} from "@playwright/test";
import {
  resolveTarget,
  titleAllowedForMode,
  type ResolvedTarget,
} from "./target";

/**
 * Shared fixtures for every spec (docs/ENVIRONMENT-PARITY.md §10).
 *
 * - `target`        the strictly resolved target (throws if unsafe).
 * - `context`       browser context admitted through deployment protection
 *                   with Vercel's cookie hand-off: the bypass secret is sent
 *                   ONCE, to the verified origin only, with redirects
 *                   disabled, and Vercel answers with a host-scoped cookie.
 *                   No header is attached afterwards, so a same-origin
 *                   redirect to Stripe, Supabase or YouTube never carries
 *                   the secret.
 * - `api`           same-origin-only HTTP helper for direct endpoint tests,
 *                   admitted the same way; refuses absolute URLs.
 * - `consoleErrors` collects console errors and uncaught page errors.
 *
 * Production-morning mode additionally refuses any test whose title lacks
 * the `@morning` tag (an automatic fixture, so it applies to every test in
 * every file).
 */

type SameOriginRequestOptions = Parameters<APIRequestContext["fetch"]>[1];

export type SameOriginApi = {
  get(path: string, options?: SameOriginRequestOptions): Promise<APIResponse>;
  post(path: string, options?: SameOriginRequestOptions): Promise<APIResponse>;
  fetch(path: string, options?: SameOriginRequestOptions): Promise<APIResponse>;
};

const BYPASS_COOKIE = "_vercel_jwt";

function assertSameOriginPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error(
      `[launch-gate] api fixture accepts same-origin paths only (got "${path}").`,
    );
  }
}

/**
 * One request with the bypass secret to the verified origin, redirects
 * off, asking Vercel to set its host-scoped bypass cookie for the rest
 * of the session.
 */
async function handOffBypass(
  request: APIRequestContext,
  target: ResolvedTarget,
): Promise<void> {
  if (!target.bypassSecret) return;
  const res = await request.get(`${target.origin}/`, {
    maxRedirects: 0,
    failOnStatusCode: false,
    headers: {
      "x-vercel-protection-bypass": target.bypassSecret,
      "x-vercel-set-bypass-cookie": "true",
    },
  });
  if (res.status() !== 200) {
    throw new Error(
      `[launch-gate] The Preview did not accept the automation bypass (HTTP ${res.status()}).`,
    );
  }
}

async function hasBypassCookie(context: BrowserContext, origin: string) {
  const cookies = await context.cookies(origin);
  return cookies.some((c) => c.name === BYPASS_COOKIE);
}

export const test = base.extend<{
  target: ResolvedTarget;
  api: SameOriginApi;
  consoleErrors: string[];
  morningGuard: void;
}>({
  target: async ({}, provide) => {
    await provide(resolveTarget(process.env));
  },

  context: async ({ context, target }, provide) => {
    if (target.bypassSecret) {
      await handOffBypass(context.request, target);
      if (!(await hasBypassCookie(context, target.origin))) {
        // Fallback for a Preview that did not issue the cookie: attach the
        // header per same-origin request. Redirect hops inherit it, so any
        // same-origin redirect to another site is refused here.
        const secret = target.bypassSecret;
        console.warn(
          "[launch-gate] No bypass cookie was issued; attaching the header per same-origin request and refusing cross-site redirects.",
        );
        await context.route(`${target.origin}/**`, async (route) => {
          await route.continue({
            headers: {
              ...route.request().headers(),
              "x-vercel-protection-bypass": secret,
            },
          });
        });
        context.on("response", (response) => {
          const status = response.status();
          const location = response.headers()["location"] ?? "";
          if (status >= 300 && status < 400 && location) {
            const to = new URL(location, response.url());
            if (to.origin !== target.origin) {
              throw new Error(
                `[launch-gate] Refusing to follow a redirect from ${target.origin} to ${to.origin} while the bypass header is attached.`,
              );
            }
          }
        });
      }
    }
    await provide(context);
  },

  api: async ({ playwright, target }, provide) => {
    const ctx = await playwright.request.newContext({
      baseURL: target.origin,
    });
    await handOffBypass(ctx, target);
    const api: SameOriginApi = {
      get: (path, options) => {
        assertSameOriginPath(path);
        return ctx.get(path, { maxRedirects: 0, ...options });
      },
      post: (path, options) => {
        assertSameOriginPath(path);
        return ctx.post(path, { maxRedirects: 0, ...options });
      },
      fetch: (path, options) => {
        assertSameOriginPath(path);
        return ctx.fetch(path, { maxRedirects: 0, ...options });
      },
    };
    await provide(api);
    await ctx.dispose();
  },

  consoleErrors: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    await provide(errors);
  },

  morningGuard: [
    async ({ target }, provide, testInfo) => {
      if (!titleAllowedForMode(testInfo.title, target.mode)) {
        throw new Error(
          `[launch-gate] "${testInfo.title}" is not tagged @morning and the target is Production. Refusing.`,
        );
      }
      await provide();
    },
    { auto: true },
  ],
});

export { expect };
