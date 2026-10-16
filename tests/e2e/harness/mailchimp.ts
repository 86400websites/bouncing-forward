import { createHash } from "node:crypto";
import { expect } from "@playwright/test";
import { isFixtureAccount, isTestIdentity } from "./identities";
import type { ResolvedTarget } from "./target";

/**
 * Read-back and cleanup in the SHARED Mailchimp audience (owner decision,
 * docs/FEATURE-LIST.md header). Reads any member; archives only `+bf-e2e-`
 * test identities and never a fixture account. The key never leaves the
 * Authorization header; error messages carry HTTP statuses only.
 */

export type MailchimpMember = {
  /** "subscribed" | "unsubscribed" | "pending" | "cleaned" | "archived" | "transactional" */
  status: string;
  /** Tag NAMES (Mailchimp returns { id, name } pairs). */
  tags: string[];
};

const MISSING =
  "[launch-gate] E2E_MAILCHIMP_API_KEY and E2E_MAILCHIMP_AUDIENCE_ID are required for audience read-back and cleanup " +
  "(and E2E_MAILCHIMP_SERVER_PREFIX when the key carries no dc suffix).";

function config(target: ResolvedTarget) {
  if (!target.mailchimp) throw new Error(MISSING);
  const { apiKey, audienceId, serverPrefix } = target.mailchimp;
  return {
    base: `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}`,
    auth: "Basic " + Buffer.from(`anystring:${apiKey}`).toString("base64"),
  };
}

function memberHash(email: string): string {
  return createHash("md5").update(email.trim().toLowerCase()).digest("hex");
}

function refuse(status: number, what: string): never {
  if (status === 401 || status === 403) {
    throw new Error(
      `[launch-gate] Mailchimp refused the key while trying to ${what} (HTTP ${status}) — check E2E_MAILCHIMP_API_KEY and E2E_MAILCHIMP_AUDIENCE_ID.`,
    );
  }
  throw new Error(
    `[launch-gate] Mailchimp answered HTTP ${status} while trying to ${what}.`,
  );
}

/** Status and tag names of a member; null when the address is not in the audience. */
export async function memberOf(
  target: ResolvedTarget,
  email: string,
): Promise<MailchimpMember | null> {
  const { base, auth } = config(target);
  const res = await fetch(
    `${base}/members/${memberHash(email)}?fields=status,tags`,
    { headers: { Authorization: auth }, cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) refuse(res.status, "read a member");
  const body = (await res.json()) as {
    status?: string;
    tags?: { id?: number; name?: string }[];
  };
  return {
    status: body.status ?? "unknown",
    tags: (body.tags ?? [])
      .map((t) => t.name)
      .filter((n): n is string => typeof n === "string"),
  };
}

/**
 * Archives a test member (Mailchimp DELETE = archive, reversible in the
 * dashboard). Tolerates a member that does not exist or is already
 * archived. Refuses any address that is not a bf-e2e identity, and the
 * fixture accounts.
 */
export async function archiveMember(
  target: ResolvedTarget,
  email: string,
): Promise<{ archived: boolean; reason: string }> {
  if (isFixtureAccount(email)) {
    throw new Error(
      "[launch-gate] Refusing to archive a fixture account in the shared audience.",
    );
  }
  if (!isTestIdentity(email)) {
    throw new Error(
      "[launch-gate] Refusing to archive an address that is not a bf-e2e test identity (address withheld).",
    );
  }
  const { base, auth } = config(target);
  const res = await fetch(`${base}/members/${memberHash(email)}`, {
    method: "DELETE",
    headers: { Authorization: auth },
    cache: "no-store",
  });
  if (res.status === 204) return { archived: true, reason: "archived" };
  if (res.status === 404) return { archived: false, reason: "not a member" };
  if (res.status === 405) {
    return { archived: true, reason: "already archived" };
  }
  refuse(res.status, "archive a member");
}

/**
 * Bounded poll until the member exists and carries `tag`; returns the
 * member. Fails with a plain message naming the tag (never the address).
 */
export async function expectTagged(
  target: ResolvedTarget,
  email: string,
  tag: string,
  timeoutMs = 20_000,
): Promise<MailchimpMember> {
  let last: MailchimpMember | null = null;
  await expect
    .poll(
      async () => {
        last = await memberOf(target, email);
        return Boolean(last && last.tags.includes(tag));
      },
      {
        timeout: timeoutMs,
        message: `The test identity did not receive the Mailchimp tag "${tag}" within ${timeoutMs} ms.`,
      },
    )
    .toBe(true);
  return last as unknown as MailchimpMember;
}
