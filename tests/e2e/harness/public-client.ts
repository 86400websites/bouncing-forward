import { expect, type Page, type Response } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  TEST_SUPABASE_REF,
  type Credentials,
  type ResolvedTarget,
} from "./target";

/**
 * The PUBLIC Supabase client, exactly as a visitor's browser gets it: the
 * project URL and publishable key are compiled into the served bundle
 * (NEXT_PUBLIC_*), so reading them from the JavaScript the deployment
 * serves proves which project the browser talks to (proof P1a) and lets
 * IN-008 exercise row-level security from the outside with the same
 * credentials a visitor has. Only public values are read; the harness
 * never types a key. Credentials passed to signInPublic never reach an
 * error message.
 */

export type PublicSupabaseConfig = { url: string; publishableKey: string };

const URL_RE = /https:\/\/([a-z0-9]{20})\.supabase\.co/g;
const PUBLISHABLE_RE = /sb_publishable_[A-Za-z0-9_-]{10,}/g;
const JWT_RE = /eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g;

/** True when a JWT's payload says role "anon" — a legacy public key, not a session. */
function isAnonJwt(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(
        token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
        "base64",
      ).toString("utf8"),
    ) as { role?: unknown };
    return payload.role === "anon";
  } catch {
    return false;
  }
}

/**
 * Loads the homepage and scans the same-origin HTML and JavaScript it
 * serves for the public Supabase URL and key. Fails plainly when either
 * is missing or ambiguous.
 */
export async function publicSupabaseConfigFromBundle(
  page: Page,
  target: ResolvedTarget,
): Promise<PublicSupabaseConfig> {
  const urls = new Set<string>();
  const keys = new Set<string>();
  const scan = (body: string) => {
    for (const match of body.matchAll(URL_RE)) urls.add(match[0]);
    for (const match of body.matchAll(PUBLISHABLE_RE)) keys.add(match[0]);
    for (const match of body.matchAll(JWT_RE)) {
      if (isAnonJwt(match[0])) keys.add(match[0]);
    }
  };
  const onResponse = async (response: Response) => {
    const url = response.url();
    if (!url.startsWith(target.origin)) return;
    const type = response.headers()["content-type"] ?? "";
    const isScript =
      /\/_next\/static\/.+\.js(\?|$)/.test(url) || type.includes("javascript");
    if (!isScript && !type.includes("text/html")) return;
    try {
      scan(await response.text());
    } catch {
      // A body that could not be read is not evidence either way.
    }
  };
  page.on("response", onResponse);
  try {
    await page.goto("/");
    await page.waitForLoadState("load");
    await expect
      .poll(() => urls.size > 0 && keys.size > 0, {
        timeout: 15_000,
        message:
          "The served bundle carries no public Supabase URL and key — accounts are not configured on this deployment (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).",
      })
      .toBe(true);
  } finally {
    page.off("response", onResponse);
  }
  if (urls.size !== 1) {
    throw new Error(
      `[launch-gate] The served bundle names ${urls.size} different Supabase projects; expected exactly one.`,
    );
  }
  if (keys.size !== 1) {
    throw new Error(
      `[launch-gate] The served bundle carries ${keys.size} public Supabase keys; expected exactly one.`,
    );
  }
  return { url: [...urls][0], publishableKey: [...keys][0] };
}

/** Throws unless the URL's host is the recorded TEST project. */
export function assertTestProject(url: string): void {
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error(
      "[launch-gate] The public Supabase URL is not a valid URL.",
    );
  }
  if (host !== `${TEST_SUPABASE_REF}.supabase.co`) {
    throw new Error(
      `[launch-gate] The public Supabase client points at project host "${host}", not the TEST project (${TEST_SUPABASE_REF}). Refusing to sign in.`,
    );
  }
}

/** A visitor-grade client with no persistence (each test owns its session). */
export function publicSupabaseClient(
  cfg: PublicSupabaseConfig,
): SupabaseClient {
  assertTestProject(cfg.url);
  return createClient(cfg.url, cfg.publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/** Password sign-in through the public client; credentials never echoed. */
export async function signInPublic(
  client: SupabaseClient,
  creds: Credentials,
  label: string,
): Promise<{ userId: string }> {
  const { data, error } = await client.auth.signInWithPassword({
    email: creds.email,
    password: creds.password,
  });
  if (error || !data.user) {
    throw new Error(
      `[launch-gate] Could not sign the ${label} fixture in through the public client (values withheld; ${error ? `${error.name}${error.status ? ` ${error.status}` : ""}${error.code ? ` ${error.code}` : ""}` : "no user returned"}).`,
    );
  }
  return { userId: data.user.id };
}

/** Ends only this client's session — never a global sign-out of the fixture. */
export async function signOutLocal(client: SupabaseClient): Promise<void> {
  await client.auth.signOut({ scope: "local" });
}
