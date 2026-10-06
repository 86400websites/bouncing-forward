import { test, expect } from "../../harness/fixtures";
import { runId } from "../../harness/identities";
import {
  publicSupabaseClient,
  publicSupabaseConfigFromBundle,
  signInPublic,
  signOutLocal,
} from "../../harness/public-client";
import { TEST_SUPABASE_REF } from "../../harness/target";

/**
 * Section F — row-level security on the entitlements table (IN-008, proof
 * P8b). Exercised from the outside with the PUBLIC key a visitor's browser
 * gets, against the TEST project only. Every write attempt must be refused;
 * nothing is created or changed when the policies hold.
 */

const RLS_DENIED = "42501";

test(
  "IN-008 in the database an account reads only its own purchase record, a visitor reads none, and nobody can write through the public key",
  {
    tag: ["@IN-008", "@integrations", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "P8b evidence. The only write path is the Stripe webhook's admin client, never used here. Sign-out is local-scope only so the saved browser sessions stay valid.",
    },
  },
  async ({ page, target }) => {
    test.setTimeout(90_000);
    if (!target.fixtures.free || !target.fixtures.premium) {
      throw new Error(
        "[launch-gate] IN-008 needs both fixture accounts: E2E_FREE_USER_EMAIL / E2E_FREE_USER_PASSWORD and E2E_PREMIUM_USER_EMAIL / E2E_PREMIUM_USER_PASSWORD.",
      );
    }
    const cfg = await publicSupabaseConfigFromBundle(page, target);
    expect(
      new URL(cfg.url).hostname,
      "The public client must point at the TEST project",
    ).toBe(`${TEST_SUPABASE_REF}.supabase.co`);

    const anon = publicSupabaseClient(cfg);
    const free = publicSupabaseClient(cfg);
    const premium = publicSupabaseClient(cfg);
    const { userId: freeId } = await signInPublic(
      free,
      target.fixtures.free,
      "free",
    );
    const { userId: premiumId } = await signInPublic(
      premium,
      target.fixtures.premium,
      "premium",
    );
    try {
      const anonRead = await anon.from("entitlements").select("*");
      expect(anonRead.error).toBeNull();
      expect(anonRead.data, "a visitor must read no entitlement rows").toEqual(
        [],
      );

      const own = await premium
        .from("entitlements")
        .select("user_id, product, status");
      expect(own.error).toBeNull();
      expect(
        own.data,
        "the premium fixture must own exactly one active Book Package row",
      ).toEqual([{ user_id: premiumId, product: "premium", status: "active" }]);

      const freeRead = await free.from("entitlements").select("*");
      expect(freeRead.error).toBeNull();
      expect(
        freeRead.data,
        "the free fixture must see no rows (not even another account's)",
      ).toEqual([]);
      const peek = await free
        .from("entitlements")
        .select("*")
        .eq("user_id", premiumId);
      expect(peek.data).toEqual([]);

      const insertAsFree = await free
        .from("entitlements")
        .insert({ user_id: freeId, product: "premium" })
        .select();
      expect(
        insertAsFree.error?.code,
        "an account must not be able to grant itself the Book Package",
      ).toBe(RLS_DENIED);
      const insertAsAnon = await anon
        .from("entitlements")
        .insert({ user_id: freeId, product: "premium" })
        .select();
      expect(
        insertAsAnon.error?.code,
        "a visitor must not be able to insert a row",
      ).toBe(RLS_DENIED);
      expect((await free.from("entitlements").select("*")).data).toEqual([]);

      const probe = `launch-gate-probe-${runId()}`;
      const updateAsOwner = await premium
        .from("entitlements")
        .update({ stripe_customer_id: probe })
        .eq("user_id", premiumId)
        .select();
      expect(
        updateAsOwner.error?.code === RLS_DENIED ||
          (updateAsOwner.error === null && updateAsOwner.data?.length === 0),
        "an owner must not be able to change their own row",
      ).toBe(true);
      const updateAsAnon = await anon
        .from("entitlements")
        .update({ status: "canceled" })
        .eq("user_id", premiumId)
        .select();
      expect(
        updateAsAnon.error?.code === RLS_DENIED ||
          (updateAsAnon.error === null && updateAsAnon.data?.length === 0),
        "a visitor must not be able to change a row",
      ).toBe(true);
      const after = await premium
        .from("entitlements")
        .select("status, stripe_customer_id")
        .eq("user_id", premiumId)
        .single();
      expect(after.data?.status).toBe("active");
      expect(after.data?.stripe_customer_id).not.toBe(probe);
    } finally {
      await signOutLocal(free);
      await signOutLocal(premium);
    }
  },
);
