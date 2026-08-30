import { createClient } from "@supabase/supabase-js";

/**
 * Admin client — SECRET key, bypasses RLS. The ONLY trusted server
 * path allowed to WRITE entitlements. Import ONLY in the Stripe
 * webhook; never anywhere driven by user input.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
