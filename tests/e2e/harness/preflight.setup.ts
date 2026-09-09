import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test as setup, expect } from "@playwright/test";
import {
  PROD_SUPABASE_REF,
  PRODUCTION_HOSTS,
  TEST_SUPABASE_REF,
  describeTarget,
  resolveTarget,
} from "./target";

/**
 * Preflight — runs before every project (docs/ENVIRONMENT-PARITY.md §12).
 *
 * Confirms the target is the one we think it is BEFORE any test touches it,
 * using the deployment's own read-only identity route (`/api/health`, fed by
 * the facts Vercel injects at build time) — no hosting API token needed:
 *   preview            → environment is "preview", commit equals the expected
 *                        SHA, the deployment belongs to this project (its
 *                        production URL is ours), it is wired to the TEST
 *                        Supabase project for BOTH the public and the
 *                        privileged client, and Stripe is in test mode;
 *                        protection state matches the bypass configuration.
 *   local              → the origin answers.
 *   production-morning → the canonical Production host answers with no bypass,
 *                        reports "production", PROD Supabase and live Stripe.
 * The bypass secret is sent only when the Preview actually answers 401/403
 * without it, only to that origin, and never across redirects.
 * When VERCEL_TOKEN + VERCEL_PROJECT_ID are present the Vercel API is used as
 * an additional cross-check; it is optional.
 *
 * Writes a sanitised run record (names, hosts, SHAs, refs — never values) to
 * the gitignored qa-evidence/ folder.
 */

type Health = {
  ok?: boolean;
  environment?: string | null;
  commit?: string | null;
  branch?: string | null;
  deploymentId?: string | null;
  deploymentUrl?: string | null;
  productionUrl?: string | null;
  siteUrl?: string | null;
  supabaseProjectRef?: string | null;
  privilegedSupabaseRef?: string | null;
  stripeMode?: string | null;
  stripePriceConfigured?: boolean;
  webhookSecretConfigured?: boolean;
  mailchimpConfigured?: boolean;
  accessCodesConfigured?: boolean;
  contactEndpointConfigured?: boolean;
};

type VercelDeployment = {
  id?: string;
  url?: string;
  name?: string;
  projectId?: string;
  target?: string | null;
  readyState?: string;
  meta?: { githubCommitSha?: string; githubCommitRef?: string };
  gitSource?: { sha?: string; ref?: string };
};

const RECORD_DIR = path.join(process.cwd(), "qa-evidence");

function writeRecord(record: Record<string, unknown>) {
  mkdirSync(RECORD_DIR, { recursive: true });
  writeFileSync(
    path.join(RECORD_DIR, "preflight.json"),
    JSON.stringify(record, null, 2),
  );
}

setup(
  "preflight: verify the target before anything runs",
  async ({ request }) => {
    const target = resolveTarget(process.env);
    const summary = describeTarget(target, process.env);
    console.log(`[launch-gate] target: ${JSON.stringify(summary)}`);

    const record: Record<string, unknown> = {
      checkedAt: new Date().toISOString(),
      ...summary,
    };

    // 1) Protection state (ENVIRONMENT-PARITY.md C3 / P10). No bypass yet.
    const plain = await request.get(`${target.origin}/`, {
      maxRedirects: 0,
      failOnStatusCode: false,
    });
    // Vercel protection answers either 401/403 or a redirect to its own
    // sign-in (vercel.com/sso-api). Both mean "protected".
    const redirectTarget = (() => {
      try {
        return new URL(plain.headers()["location"] ?? "", target.origin)
          .hostname;
      } catch {
        return "";
      }
    })();
    const protectedResponse =
      plain.status() === 401 ||
      plain.status() === 403 ||
      (plain.status() >= 300 &&
        plain.status() < 400 &&
        (redirectTarget === "vercel.com" ||
          redirectTarget.endsWith(".vercel.com")));
    let identityHeaders: Record<string, string> = {};
    let served = plain;

    if (target.mode === "production-morning" || target.mode === "local") {
      expect(
        plain.status(),
        `${target.origin} did not answer 200 without any bypass.`,
      ).toBe(200);
      record.protection = "none-expected";
    } else if (protectedResponse) {
      expect(
        target.bypassSecret,
        "Preview is protected (401/403) and no VERCEL_AUTOMATION_BYPASS_SECRET is set. " +
          "Store the project's Protection Bypass for Automation secret under that name.",
      ).toBeTruthy();
      identityHeaders = {
        "x-vercel-protection-bypass": target.bypassSecret as string,
      };
      served = await request.get(`${target.origin}/`, {
        maxRedirects: 0,
        failOnStatusCode: false,
        headers: identityHeaders,
      });
      expect(
        served.status(),
        "Preview did not accept the automation bypass secret (expected 200).",
      ).toBe(200);
      record.protection = "on-bypassed";
    } else {
      expect(plain.status(), `${target.origin} did not answer 200.`).toBe(200);
      if (target.bypassSecret) {
        console.warn(
          "[launch-gate] VERCEL_AUTOMATION_BYPASS_SECRET is set but this Preview answers without it — " +
            "deployment protection appears to be OFF; the secret will not be sent.",
        );
      }
      record.protection = target.bypassSecret ? "off-secret-unused" : "off";
    }

    if (target.mode !== "local") {
      expect(
        served.headers()["x-vercel-id"],
        "Response carries no x-vercel-id header — this origin is not served by Vercel.",
      ).toBeTruthy();
    }

    // 2) Deployment identity from the candidate itself (P1 / P4 / P11 / P12).
    const healthRes = await request.get(`${target.origin}/api/health`, {
      headers: identityHeaders,
      maxRedirects: 0,
      failOnStatusCode: false,
    });
    expect(
      healthRes.status(),
      "/api/health did not answer 200 — this deployment does not include the Launch Gate identity route (older commit?).",
    ).toBe(200);
    const health = (await healthRes.json()) as Health;
    record.deployment = {
      environment: health.environment ?? null,
      commit: health.commit ?? null,
      branch: health.branch ?? null,
      deploymentId: health.deploymentId ?? null,
      deploymentUrl: health.deploymentUrl ?? null,
      productionUrl: health.productionUrl ?? null,
      siteUrl: health.siteUrl ?? null,
      supabaseProjectRef: health.supabaseProjectRef ?? null,
      privilegedSupabaseRef: health.privilegedSupabaseRef ?? null,
      stripeMode: health.stripeMode ?? null,
      stripePriceConfigured: health.stripePriceConfigured ?? false,
      webhookSecretConfigured: health.webhookSecretConfigured ?? false,
      mailchimpConfigured: health.mailchimpConfigured ?? false,
      accessCodesConfigured: health.accessCodesConfigured ?? false,
      contactEndpointConfigured: health.contactEndpointConfigured ?? false,
    };

    if (target.mode === "preview") {
      expect(
        health.environment,
        "The deployment does not report which environment it is. In Vercel → Settings → Environment Variables, " +
          "enable “Automatically expose System Environment Variables”, then redeploy.",
      ).not.toBeNull();
      expect(
        health.environment,
        "This deployment reports it is PRODUCTION. Refusing.",
      ).toBe("preview");
      expect(
        (health.commit ?? "").toLowerCase(),
        "Deployment serves a different commit than PLAYWRIGHT_EXPECTED_SHA — the Preview is stale or the alias moved.",
      ).toBe(target.expectedSha?.toLowerCase());
      expect(
        PRODUCTION_HOSTS.includes((health.productionUrl ?? "").toLowerCase()),
        `Deployment belongs to a different project (its production address is "${health.productionUrl}").`,
      ).toBe(true);
      expect(
        health.supabaseProjectRef,
        `The Preview's public Supabase client is wired to project "${health.supabaseProjectRef}", not the TEST project. ` +
          "Fix NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the Vercel Preview environment and redeploy.",
      ).toBe(TEST_SUPABASE_REF);
      expect(
        health.privilegedSupabaseRef === null ||
          health.privilegedSupabaseRef === "opaque" ||
          health.privilegedSupabaseRef === TEST_SUPABASE_REF,
        `The Preview's privileged Supabase key belongs to project "${health.privilegedSupabaseRef}", not the TEST project. ` +
          "Fix SUPABASE_SECRET_KEY in the Vercel Preview environment and redeploy.",
      ).toBe(true);
      expect(
        health.privilegedSupabaseRef,
        "The Preview has no SUPABASE_SECRET_KEY — the purchase webhook cannot grant access; payment proofs cannot run.",
      ).not.toBeNull();
      expect(
        health.stripeMode,
        "The Preview's Stripe key is LIVE. Refusing — Preview must use test-mode keys.",
      ).not.toBe("live");
      if (health.stripeMode !== "test") {
        console.warn(
          "[launch-gate] Stripe is not configured on this Preview — payment lines cannot run until STRIPE_SECRET_KEY (test), " +
            "STRIPE_PRICE_PREMIUM and STRIPE_WEBHOOK_SECRET are set for the Preview environment.",
        );
      }
      if (health.privilegedSupabaseRef === "opaque") {
        console.warn(
          "[launch-gate] The privileged Supabase key format does not reveal its project; the privileged half of P1 is proven by P5.",
        );
      }
    }

    if (target.mode === "production-morning") {
      expect(health.environment, "Target does not report production.").toBe(
        "production",
      );
      expect(
        health.supabaseProjectRef,
        "Production is not wired to the PROD Supabase project.",
      ).toBe(PROD_SUPABASE_REF);
      expect(health.stripeMode, "Production Stripe key is not live.").toBe(
        "live",
      );
    }

    // 3) Optional cross-check through Vercel's API when a token is provided.
    if (target.mode === "preview" && target.vercel) {
      const { token, projectId, teamId } = target.vercel;
      const teamQuery = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
      const meta = await request.get(
        `https://api.vercel.com/v13/deployments/${encodeURIComponent(target.host)}${teamQuery}`,
        { headers: { Authorization: `Bearer ${token}` }, maxRedirects: 0 },
      );
      expect(
        meta.ok(),
        `Vercel API could not resolve "${target.host}" (HTTP ${meta.status()}). Check VERCEL_TOKEN scope and VERCEL_TEAM_ID.`,
      ).toBe(true);
      const deployment = (await meta.json()) as VercelDeployment;
      const servedSha =
        deployment.meta?.githubCommitSha ?? deployment.gitSource?.sha ?? "";
      expect(deployment.projectId, "Vercel API: different project.").toBe(
        projectId,
      );
      expect(deployment.target ?? null, "Vercel API: production.").not.toBe(
        "production",
      );
      expect(deployment.readyState, "Vercel API: not READY.").toBe("READY");
      expect(servedSha.toLowerCase(), "Vercel API: commit mismatch.").toBe(
        target.expectedSha?.toLowerCase(),
      );
      record.vercelApi = {
        id: deployment.id ?? null,
        url: deployment.url ?? null,
        project: deployment.name ?? null,
        branch:
          deployment.meta?.githubCommitRef ?? deployment.gitSource?.ref ?? null,
        aliasInUse: Boolean(deployment.url && deployment.url !== target.host),
      };
    }

    writeRecord(record);
  },
);
