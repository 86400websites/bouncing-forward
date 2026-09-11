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
 *
 * The admission helpers are exported so harness/roles.ts can build
 * role-bound contexts and request contexts the same way.
 */

export type SameOriginRequestOptions = Parameters<
  APIRequestContext["fetch"]
>[1];

export type SameOriginApi = {
  /** The verified origin every path is relative to. */
  readonly origin: string;
  get(path: string, options?: SameOriginRequestOptions): Promise<APIResponse>;
  post(path: string, options?: SameOriginRequestOptions): Promise<APIResponse>;
  fetch(path: string, options?: SameOriginRequestOptions): Promise<APIResponse>;
};

export const BYPASS_COOKIE = "_vercel_jwt";
const BYPASS_HEADER = "x-vercel-protection-bypass";

export function assertSameOriginPath(path: string): void {
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
export async function handOffBypass(
  request: APIRequestContext,
  target: ResolvedTarget,
): Promise<void> {
  if (!target.bypassSecret) return;
  const res = await request.get(`${target.origin}/`, {
    maxRedirects: 0,
    failOnStatusCode: false,
    headers: {
      [BYPASS_HEADER]: target.bypassSecret,
      "x-vercel-set-bypass-cookie": "true",
    },
  });
  // Vercel answers the hand-off with 200, or 307 back to the same page while setting the cookie.
  if (res.status() !== 200 && res.status() !== 307) {
    throw new Error(
      `[launch-gate] The Preview did not accept the automation bypass (HTTP ${res.status()}).`,
    );
  }
}

export async function hasBypassCookie(
  context: BrowserContext,
  origin: string,
): Promise<boolean> {
  const cookies = await context.cookies(origin);
  return cookies.some((c) => c.name === BYPASS_COOKIE);
}

async function requestHasBypassCookie(
  ctx: APIRequestContext,
): Promise<boolean> {
  const state = await ctx.storageState();
  return state.cookies.some((c) => c.name === BYPASS_COOKIE);
}

/**
 * Admits a browser context to the target: cookie hand-off first; when the
 * Preview issues no cookie, the header is attached per same-origin request
 * and any redirect to another origin is refused while it is attached.
 */
/**
 * Vercel's Preview toolbar injects a floating widget of its own
 * (`vercel-live-feedback`) which can sit over the page and swallow clicks —
 * at 390px it covered the quick-look answer buttons. It belongs to the
 * preview host, not to the site, so it is hidden in every context. No site
 * element is touched and no site behaviour changes.
 */
export async function hidePreviewOverlays(
  context: BrowserContext,
): Promise<void> {
  await context.addInitScript(() => {
    const hide = () => {
      const style = document.createElement("style");
      style.textContent =
        "vercel-live-feedback, vercel-toolbar { display: none !important; pointer-events: none !important; }";
      document.head?.appendChild(style);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", hide, { once: true });
    } else {
      hide();
    }
  });
}

export async function admitContext(
  context: BrowserContext,
  target: ResolvedTarget,
): Promise<void> {
  await hidePreviewOverlays(context);
  if (!target.bypassSecret) return;
  if (!(await hasBypassCookie(context, target.origin))) {
    await handOffBypass(context.request, target);
  }
  if (await hasBypassCookie(context, target.origin)) return;
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
        [BYPASS_HEADER]: secret,
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

/**
 * Admits a request context (cookie hand-off). Returns whether the header
 * fallback is needed because no cookie was issued.
 */
export async function admitRequestContext(
  ctx: APIRequestContext,
  target: ResolvedTarget,
): Promise<{ attachHeader: boolean }> {
  if (!target.bypassSecret) return { attachHeader: false };
  if (!(await requestHasBypassCookie(ctx))) await handOffBypass(ctx, target);
  return { attachHeader: !(await requestHasBypassCookie(ctx)) };
}

/**
 * Wraps an admitted request context as a same-origin API. Redirects are
 * never followed automatically; in header-fallback mode that guarantee is
 * enforced (maxRedirects forced to 0) so the secret never crosses origins.
 */
export function sameOriginApi(
  ctx: APIRequestContext,
  target: ResolvedTarget,
  attachHeader: boolean,
): SameOriginApi {
  const prepare = (
    options?: SameOriginRequestOptions,
  ): SameOriginRequestOptions => {
    if (!attachHeader || !target.bypassSecret) {
      return { maxRedirects: 0, ...options };
    }
    return {
      ...options,
      maxRedirects: 0,
      headers: { ...options?.headers, [BYPASS_HEADER]: target.bypassSecret },
    };
  };
  return {
    origin: target.origin,
    get: (path, options) => {
      assertSameOriginPath(path);
      return ctx.get(path, prepare(options));
    },
    post: (path, options) => {
      assertSameOriginPath(path);
      return ctx.post(path, prepare(options));
    },
    fetch: (path, options) => {
      assertSameOriginPath(path);
      return ctx.fetch(path, prepare(options));
    },
  };
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
    await admitContext(context, target);
    await provide(context);
  },

  api: async ({ playwright, target }, provide) => {
    // Always a visitor: the test runner would otherwise hand a file-level
    // `test.use({ storageState })` to this context too, turning the
    // "logged-out" half of a boundary into a signed-in request.
    const ctx = await playwright.request.newContext({
      baseURL: target.origin,
      storageState: { cookies: [], origins: [] },
    });
    const { attachHeader } = await admitRequestContext(ctx, target);
    if (attachHeader) {
      console.warn(
        "[launch-gate] No bypass cookie was issued to the api fixture; attaching the header per same-origin request (redirects never followed).",
      );
    }
    await provide(sameOriginApi(ctx, target, attachHeader));
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
