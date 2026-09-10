import {
  expect,
  type APIResponse,
  type Locator,
  type Page,
} from "@playwright/test";
import type { SameOriginApi } from "./fixtures";
import type { ResolvedTarget } from "./target";

/**
 * Page-level helpers shared by the feature specs. Everything here is
 * read-only, bounded, and same-origin: a link that resolves to any other
 * host — including a NEXT_PUBLIC_SITE_URL that names Production — is
 * treated as foreign and never requested.
 */

/** Anything with a same-origin `get` — the api fixture, apiAs(), or page.request. */
export type SameOriginClient = {
  get(
    path: string,
    options?: {
      maxRedirects?: number;
      headers?: { [key: string]: string };
      timeout?: number;
    },
  ): Promise<APIResponse>;
};

/** Query keys whose values are replaced in recorded URLs (tokens, codes, session refs). */
export const DEFAULT_REDACTED_QUERY_KEYS = [
  "code",
  "token_hash",
  "token",
  "access_token",
  "refresh_token",
  "session_id",
];

/** The URL with the values of the named query keys replaced by `[redacted]`. */
export function redactUrl(
  url: string,
  keys: string[] = DEFAULT_REDACTED_QUERY_KEYS,
): string {
  try {
    const parsed = new URL(url);
    let changed = false;
    for (const key of keys) {
      if (parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, "[redacted]");
        changed = true;
      }
    }
    if (parsed.hash) {
      parsed.hash = "";
      changed = true;
    }
    return changed ? parsed.toString() : url;
  } catch {
    return url;
  }
}

/**
 * Attach BEFORE goto. Collects `${status} ${url}` for every same-origin
 * response ≥ 400 (as the smoke test does), with sensitive query values
 * redacted so the list is safe in an assertion message.
 */
export function watchSameOriginFailures(
  page: Page,
  target: ResolvedTarget,
  options?: { redactQueryKeys?: string[] },
): string[] {
  const failures: string[] = [];
  const keys = options?.redactQueryKeys ?? DEFAULT_REDACTED_QUERY_KEYS;
  page.on("response", (response) => {
    const url = response.url();
    if (url.startsWith(target.origin) && response.status() >= 400) {
      failures.push(`${response.status()} ${redactUrl(url, keys)}`);
    }
  });
  return failures;
}

/** load + 1500 ms — never networkidle (the Vercel toolbar keeps a socket open). */
export async function settle(page: Page): Promise<void> {
  await page.waitForLoadState("load");
  await page.waitForTimeout(1500);
}

/**
 * pathname + search + hash when `href` resolves to the target origin;
 * null for any other host (never requested) and for non-http schemes.
 */
export function sameOriginPath(
  href: string,
  target: ResolvedTarget,
): string | null {
  let resolved: URL;
  try {
    resolved = new URL(href, `${target.origin}/`);
  } catch {
    return null;
  }
  if (resolved.origin !== target.origin) return null;
  return resolved.pathname + resolved.search + resolved.hash;
}

/**
 * GET with redirects off. On a 3xx whose Location resolves to the target
 * origin, follows exactly one hop when `followOnce` is set; a Location on
 * another origin throws a plain error naming the path (never followed).
 */
export async function getSameOrigin(
  api: SameOriginApi,
  path: string,
  options?: { followOnce?: boolean },
): Promise<{ status: number; path: string; response: APIResponse }> {
  const first = await api.get(path, { maxRedirects: 0 });
  const status = first.status();
  if (status < 300 || status >= 400) {
    return { status, path, response: first };
  }
  const location = first.headers()["location"] ?? "";
  const to = new URL(location, `${api.origin}/`);
  if (to.origin !== api.origin) {
    throw new Error(
      `[launch-gate] ${path} redirects to another origin (${to.origin}); refusing to follow.`,
    );
  }
  const nextPath = to.pathname + to.search + to.hash;
  if (!options?.followOnce) {
    return { status, path: nextPath, response: first };
  }
  const second = await api.get(nextPath, { maxRedirects: 0 });
  return { status: second.status(), path: nextPath, response: second };
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&#x27;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
};

export function decodeEntities(text: string): string {
  return text
    .replace(/&(amp|#x27|#39|quot|lt|gt|nbsp);/g, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    );
}

function headOf(html: string): string {
  const match = /<head[^>]*>([\s\S]*?)<\/head>/i.exec(html);
  return match ? match[1] : html;
}

/**
 * The server-rendered <title>, decoded; null when absent. Next.js streams
 * the metadata of dynamic pages into the body, so the head is searched first
 * and the whole document second.
 */
export function htmlTitle(html: string): string | null {
  const match =
    /<title[^>]*>([\s\S]*?)<\/title>/i.exec(headOf(html)) ??
    /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match ? decodeEntities(match[1].trim()) : null;
}

/** `content` of the first <meta name=… | property=…> in the head; null when absent. */
export function headMeta(
  html: string,
  by: { name?: string; property?: string },
): string | null {
  const attr = by.name ? "name" : "property";
  const wanted = (by.name ?? by.property ?? "").toLowerCase();
  if (!wanted) return null;
  for (const tag of `${headOf(html)}\n${html}`.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs: Record<string, string> = {};
    for (const m of tag[0].matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) {
      attrs[m[1].toLowerCase()] = m[2];
    }
    if ((attrs[attr] ?? "").toLowerCase() === wanted && "content" in attrs) {
      return decodeEntities(attrs.content);
    }
  }
  return null;
}

/**
 * Asserts 200, an application/pdf content-type and a body that starts
 * with %PDF. With `attachment`, also asserts a Content-Disposition
 * attachment. Messages use `label` (default: the path without its query)
 * so a `code=` value can never reach the JSON report.
 */
export async function expectPdf(
  client: SameOriginClient,
  path: string,
  options?: { label?: string; attachment?: boolean },
): Promise<{ response: APIResponse; filename: string | null }> {
  const label = options?.label ?? path.split("?")[0];
  // The paid PDFs are 1.5–2.5 MB and are streamed uncached (private,
  // no-store) from the function, so a slow link needs more than the default
  // action timeout to finish the body. Still bounded.
  const response = await client.get(path, {
    maxRedirects: 0,
    timeout: 120_000,
  });
  expect(
    response.status(),
    `${label} did not answer 200 (got ${response.status()}).`,
  ).toBe(200);
  const type = response.headers()["content-type"] ?? "";
  expect(
    type.startsWith("application/pdf"),
    `${label} is not served as application/pdf (content-type "${type}").`,
  ).toBe(true);
  const body = await response.body();
  expect(
    body.length > 0 && body.subarray(0, 4).toString("latin1") === "%PDF",
    `${label} body is not a PDF file.`,
  ).toBe(true);
  const disposition = response.headers()["content-disposition"] ?? "";
  if (options?.attachment) {
    expect(
      /^attachment/i.test(disposition),
      `${label} is not sent as an attachment (Content-Disposition "${disposition}").`,
    ).toBe(true);
  }
  const filename = /filename="?([^";]+)"?/i.exec(disposition)?.[1] ?? null;
  return { response, filename };
}

/** The exact 401 message /api/premium/download gives a visitor without access. */
export const DOWNLOAD_DENIED_MESSAGE =
  "Please log in to your account to download — or use the access code from your confirmation email.";

/**
 * A visitor's direct request for a signed-in page must never carry the
 * page: Next answers `redirect()` with a 307 to /login, or — when the
 * response had already started streaming — a 200 whose body only carries
 * the client-side redirect to /login and none of the account content.
 */
export async function expectVisitorRedirectedToLogin(
  api: SameOriginApi,
  path: string,
): Promise<void> {
  const res = await api.get(path, { maxRedirects: 0 });
  const body = await res.text();
  expect(body, `${path}: account content reached a visitor`).not.toContain(
    "Signed in as",
  );
  expect(body, `${path}: account content reached a visitor`).not.toContain(
    "Welcome back.",
  );
  if (res.status() === 307 || res.status() === 308 || res.status() === 302) {
    const to = new URL(res.headers()["location"] ?? "", `${api.origin}/`);
    expect(to.origin, `${path}: redirect left the site`).toBe(api.origin);
    expect(to.pathname, `${path}: redirect destination`).toBe("/login");
    return;
  }
  expect(
    res.status(),
    `${path}: a visitor must be redirected (or handed a streamed redirect)`,
  ).toBe(200);
  expect(
    body,
    `${path}: the streamed response carries no redirect to /login`,
  ).toContain("/login");
}

/** Asserts 401 + the exact denial message; returns the parsed body. */
export async function expectDownloadDenied(
  client: SameOriginClient,
  path: string,
  label?: string,
): Promise<Record<string, unknown>> {
  const name = label ?? path.split("?")[0];
  const response = await client.get(path, { maxRedirects: 0 });
  return expectFriendlyJson(response, {
    status: 401,
    message: DOWNLOAD_DENIED_MESSAGE,
    label: name,
  });
}

const INTERNALS_RE =
  /(\bat \w[\w$.]* \(|node_modules|\.tsx?:\d+|TypeError|ReferenceError|SyntaxError|ECONNREFUSED|ENOTFOUND|<html|<!doctype|stack)/i;

/**
 * Asserts a JSON body with the exact short human message (under `message`
 * or `error`), an expected status, no internals and no upstream body.
 */
export async function expectFriendlyJson(
  response: APIResponse,
  opts: {
    status: number | number[];
    key?: "message" | "error";
    message: string | string[];
    label?: string;
  },
): Promise<Record<string, unknown>> {
  const label = opts.label ?? new URL(response.url()).pathname;
  const statuses = Array.isArray(opts.status) ? opts.status : [opts.status];
  expect(
    statuses,
    `${label} answered ${response.status()}; expected ${statuses.join(" or ")}.`,
  ).toContain(response.status());
  const type = response.headers()["content-type"] ?? "";
  expect(
    type.includes("application/json"),
    `${label} did not answer JSON (content-type "${type}").`,
  ).toBe(true);
  const text = await response.text();
  expect(
    text.length,
    `${label} answered a body longer than 400 characters.`,
  ).toBeLessThan(400);
  expect(
    INTERNALS_RE.test(text),
    `${label} body looks like it carries internals or an upstream response.`,
  ).toBe(false);
  const body = JSON.parse(text) as Record<string, unknown>;
  const key = opts.key ?? "message";
  const messages = Array.isArray(opts.message) ? opts.message : [opts.message];
  expect(messages, `${label} did not answer the expected ${key}.`).toContain(
    body[key],
  );
  return body;
}

/** Scrolls into view, then polls until the image has decoded with a real width. */
export async function expectImageLoaded(img: Locator): Promise<void> {
  await img.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        img.evaluate(
          (el) =>
            (el as HTMLImageElement).complete &&
            (el as HTMLImageElement).naturalWidth > 0,
        ),
      { timeout: 10_000, message: "An image did not load." },
    )
    .toBe(true);
}

/** Clicks "Open menu" and returns the sheet dialog once visible (390 px project). */
export async function openMobileMenu(page: Page): Promise<Locator> {
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Bouncing Forward" });
  await expect(dialog).toBeVisible();
  return dialog;
}

/** Scrolls to the bottom in steps (triggering in-view animations), then back to the top. */
export async function scrollThrough(
  page: Page,
  stepPx = 600,
  pauseMs = 150,
): Promise<void> {
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y < height; y += stepPx) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(pauseMs);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(pauseMs);
}
