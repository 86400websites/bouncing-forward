import { NextResponse } from "next/server";
import { configuredStripeMode } from "@/lib/stripe/identify";

export const dynamic = "force-dynamic";

/**
 * GET /api/health — read-only deployment identity for the Launch Gate
 * preflight (docs/ENVIRONMENT-PARITY.md §10, §12).
 *
 * Answers "which deployment is this and what is it wired to?" using the
 * facts Vercel injects at build time plus the NAMES/classes of the
 * app's own settings. It never returns a secret value: project refs and
 * the live/test mode of the Stripe key are identifiers, not credentials.
 * This is what lets the test harness refuse to run against the wrong
 * environment, the wrong commit, or a Preview accidentally wired to the
 * Production database or live payments.
 *
 * On Production only the four facts the morning check needs are
 * returned; the fuller picture is for Previews and local builds.
 */

function refFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.split(".")[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * The project the privileged (server) Supabase key belongs to. Legacy
 * server keys are JWTs whose payload names the project; the newer opaque
 * key format does not. Only the ref is read — never the key.
 */
function privilegedRef(): string | null {
  const key = process.env.SUPABASE_SECRET_KEY ?? "";
  if (!key) return null;
  const parts = key.split(".");
  if (parts.length !== 3) return "opaque";
  try {
    const payload = JSON.parse(
      Buffer.from(
        parts[1].replace(/-/g, "+").replace(/_/g, "/"),
        "base64",
      ).toString("utf8"),
    ) as { ref?: unknown };
    return typeof payload.ref === "string" ? payload.ref : "opaque";
  } catch {
    return "opaque";
  }
}

export function GET() {
  const env = process.env;
  const environment = env.VERCEL_ENV ?? null;
  const identity = {
    ok: true,
    environment,
    commit: env.VERCEL_GIT_COMMIT_SHA ?? null,
    supabaseProjectRef: refFromUrl(env.NEXT_PUBLIC_SUPABASE_URL),
    stripeMode: configuredStripeMode(),
  };
  const headers = { "Cache-Control": "no-store" };

  if (environment === "production") {
    return NextResponse.json(identity, { headers });
  }
  return NextResponse.json(
    {
      ...identity,
      branch: env.VERCEL_GIT_COMMIT_REF ?? null,
      deploymentId: env.VERCEL_DEPLOYMENT_ID ?? null,
      deploymentUrl: env.VERCEL_URL ?? null,
      productionUrl: env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
      siteUrl: env.NEXT_PUBLIC_SITE_URL?.trim() || null,
      privilegedSupabaseRef: privilegedRef(),
      stripePriceConfigured: Boolean(env.STRIPE_PRICE_PREMIUM),
      webhookSecretConfigured: Boolean(env.STRIPE_WEBHOOK_SECRET?.trim()),
      mailchimpConfigured: Boolean(
        env.MAILCHIMP_API_KEY && env.MAILCHIMP_AUDIENCE_ID,
      ),
      accessCodesConfigured: Boolean(env.PREMIUM_ACCESS_CODES?.trim()),
      contactEndpointConfigured: Boolean(
        env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim(),
      ),
    },
    { headers },
  );
}
