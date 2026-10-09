import { existsSync } from "node:fs";
import type {
  Browser,
  BrowserContext,
  PlaywrightWorkerArgs,
} from "@playwright/test";
import { statePath, type Role } from "./auth";
import {
  admitContext,
  admitRequestContext,
  sameOriginApi,
  type SameOriginApi,
} from "./fixtures";
import type { ResolvedTarget } from "./target";

/**
 * Role-bound contexts for tests that must assert BOTH halves of a boundary
 * in one test(): a visitor page plus a signed-in request context, or a
 * second browser context signed in as the free/premium fixture.
 *
 * Both load the saved session written by the auth-free / auth-premium
 * setup projects (the state carries the Supabase cookies and, in cookie
 * mode, the _vercel_jwt bypass cookie) and apply the same admission as the
 * fixtures: cookie hand-off first, header fallback only when no cookie was
 * issued, redirects never followed with the header attached.
 */

export type RoleApi = SameOriginApi & { dispose(): Promise<void> };

function resolveStatePath(roleOrStatePath: Role | string): string {
  const file =
    roleOrStatePath === "free" || roleOrStatePath === "premium"
      ? statePath(roleOrStatePath)
      : roleOrStatePath;
  if (!existsSync(file)) {
    throw new Error(
      `[launch-gate] No saved session for "${roleOrStatePath}" — run the auth-free / auth-premium setup project first ` +
        "(E2E_FREE_USER_EMAIL / E2E_FREE_USER_PASSWORD, E2E_PREMIUM_USER_EMAIL / E2E_PREMIUM_USER_PASSWORD).",
    );
  }
  return file;
}

/** A same-origin request context signed in as the role; dispose() when done. */
export async function apiAs(
  playwright: PlaywrightWorkerArgs["playwright"],
  target: ResolvedTarget,
  roleOrStatePath: Role | string,
): Promise<RoleApi> {
  const ctx = await playwright.request.newContext({
    baseURL: target.origin,
    storageState: resolveStatePath(roleOrStatePath),
  });
  const { attachHeader } = await admitRequestContext(ctx, target);
  const api = sameOriginApi(ctx, target, attachHeader);
  return { ...api, dispose: () => ctx.dispose() };
}

/**
 * A second browser context signed in as the role (pass viewport/device
 * options through `options` when the project's profile matters). Close it
 * when done.
 */
export async function openAs(
  browser: Browser,
  target: ResolvedTarget,
  roleOrStatePath: Role | string,
  options?: Parameters<Browser["newContext"]>[0],
): Promise<BrowserContext> {
  const context = await browser.newContext({
    ...options,
    baseURL: target.origin,
    storageState: resolveStatePath(roleOrStatePath),
  });
  await admitContext(context, target);
  return context;
}
