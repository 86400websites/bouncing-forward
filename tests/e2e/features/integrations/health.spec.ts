import { test, expect } from "../../harness/fixtures";
import { secretShaped } from "../../harness/secret-shapes";
import {
  PROD_SUPABASE_REF,
  PRODUCTION_HOSTS,
  TEST_SUPABASE_REF,
} from "../../harness/target";

/** Section F — the deployment identity route answers facts only (IN-010). */

const NON_PRODUCTION_KEYS = [
  "accessCodesConfigured",
  "branch",
  "commit",
  "contactEndpointConfigured",
  "deploymentId",
  "deploymentUrl",
  "environment",
  "mailchimpConfigured",
  "ok",
  "privilegedSupabaseRef",
  "productionUrl",
  "siteUrl",
  "stripeMode",
  "stripePriceConfigured",
  "supabaseProjectRef",
  "webhookSecretConfigured",
];
const BOOLEAN_KEYS = [
  "accessCodesConfigured",
  "contactEndpointConfigured",
  "mailchimpConfigured",
  "stripePriceConfigured",
  "webhookSecretConfigured",
];
/**
 * On the live site the route answers a deliberately smaller set: the four
 * facts plus `ok`, and nothing that describes a deployment or a service's
 * configuration. The approved line records exactly this difference.
 */
const PRODUCTION_KEYS = [
  "commit",
  "environment",
  "ok",
  "stripeMode",
  "supabaseProjectRef",
];

test(
  "IN-010 the deployment identity address answers only facts, never a secret value",
  {
    tag: ["@IN-010", "@integrations", "@morning"],
    annotation: {
      type: "note",
      description:
        "Approved as a @morning check on 11 September 2026, so this is one of the few lines the suite may request on Production. There it asserts the deliberately smaller shape the approved line records: ok, environment, commit, supabaseProjectRef and stripeMode only, with the live values. The read is public and changes nothing.",
    },
  },
  async ({ api, target }) => {
    const res = await api.get("/api/health");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"] ?? "").toContain("application/json");
    expect(res.headers()["cache-control"] ?? "").toContain("no-store");
    const raw = await res.text();
    const body = JSON.parse(raw) as Record<string, unknown>;
    const production = target.mode === "production-morning";
    const expectedKeys = production ? PRODUCTION_KEYS : NON_PRODUCTION_KEYS;
    expect(Object.keys(body).sort()).toEqual(expectedKeys);
    expect(body.ok).toBe(true);
    if (!production) {
      for (const key of BOOLEAN_KEYS)
        expect(typeof body[key], `${key} must be a boolean`).toBe("boolean");
    }
    for (const key of expectedKeys) {
      if (BOOLEAN_KEYS.includes(key) || key === "ok") continue;
      expect(
        body[key] === null || typeof body[key] === "string",
        `${key} must be a string or null`,
      ).toBe(true);
    }
    const commit = typeof body.commit === "string" ? body.commit : "";
    if (commit) expect(commit).toMatch(/^[0-9a-f]{40}$/i);
    if (target.mode === "preview") {
      expect(body.environment).toBe("preview");
      expect(commit.toLowerCase()).toBe(target.expectedSha?.toLowerCase());
      expect(PRODUCTION_HOSTS).toContain(
        String(body.productionUrl).toLowerCase(),
      );
      expect(String(body.deploymentUrl)).toMatch(/\.vercel\.app$/);
      expect(body.stripeMode).toBe("test");
      expect(body.supabaseProjectRef).toBe(TEST_SUPABASE_REF);
      expect([TEST_SUPABASE_REF, "opaque"]).toContain(
        body.privilegedSupabaseRef,
      );
    } else if (production) {
      // The live site: the four facts must be the real ones, and nothing
      // that describes a deployment or a service may appear at all.
      expect(body.environment).toBe("production");
      expect(body.stripeMode).toBe("live");
      expect(body.supabaseProjectRef).toBe(PROD_SUPABASE_REF);
      expect(commit, "the live site must report its commit").toMatch(
        /^[0-9a-f]{40}$/i,
      );
    } else {
      expect(body.stripeMode).not.toBe("live");
      expect(body.supabaseProjectRef).not.toBe(PROD_SUPABASE_REF);
    }
    if (typeof body.siteUrl === "string")
      expect(() => new URL(body.siteUrl as string)).not.toThrow();

    const offenders = Object.entries(body)
      .filter(
        ([key, value]) =>
          key !== "commit" && typeof value === "string" && secretShaped(value),
      )
      .map(([key]) => key);
    expect(
      offenders,
      "keys whose value looks like a credential (values withheld)",
    ).toEqual([]);
    expect(
      secretShaped(raw.replace(commit, "")),
      "the raw body carries something shaped like a secret",
    ).toBeNull();
  },
);
