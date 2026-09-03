import { createClient } from "@/lib/supabase/server";

/** Bouncing Forward sells one thing: the $9.99 Book Package. */
export type Product = "premium";

/** True once the three Supabase env vars exist. Everything auth-shaped
 *  degrades to "signed out" (never a 500) while this is false. */
export function accountsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

/**
 * Current user (or null) plus their active products. Runs under the
 * user's own session + RLS — can only ever see their own rows.
 */
export async function getAccess(): Promise<{
  userId: string | null;
  email: string | null;
  products: Product[];
}> {
  if (!accountsConfigured()) {
    return { userId: null, email: null, products: [] };
  }
  let user: { id: string; email?: string } | null = null;
  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    return { userId: null, email: null, products: [] };
  }
  if (!user) return { userId: null, email: null, products: [] };

  const { data, error } = await supabase
    .from("entitlements")
    .select("product")
    .eq("status", "active");

  const products = error ? [] : (data ?? []).map((r) => r.product as Product);
  return { userId: user.id, email: user.email ?? null, products };
}

export async function hasPremium(): Promise<boolean> {
  const { products } = await getAccess();
  return products.includes("premium");
}
