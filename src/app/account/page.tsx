import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/entitlements";
import { logout } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false },
};

/**
 * The account page — where a buyer lands after payment
 * (?checkout=success) and where their Book Package lives forever.
 */
export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; password?: string }>;
}) {
  const { userId, email, products } = await getAccess();
  if (!userId) redirect("/login");
  const premium = products.includes("premium");
  const params = await searchParams;

  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
        <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
          Your account
        </p>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold sm:text-4xl">
          {params.checkout === "success"
            ? "Thank you — it’s yours."
            : "Welcome back."}
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Signed in as{" "}
          <span className="text-foreground font-semibold">{email}</span>
          {params.password === "updated" ? " · password updated" : null}
        </p>

        {premium ? (
          <div className="border-brand-accent bg-card mt-8 rounded-xl border-2 p-6 sm:p-8">
            <h2 className="text-xl font-bold">The Book Package</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Yours for life — download on any device, any time, just by logging
              in.
            </p>
            <ul className="divide-border mt-4 divide-y">
              <li className="py-3">
                <a
                  href="/api/premium/download?file=book"
                  className="group flex items-start justify-between gap-4"
                >
                  <span className="text-primary group-hover:text-brand-accent-text font-[family-name:var(--font-display)] font-bold transition-colors">
                    The complete book
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-brand-accent-text mt-1 shrink-0 font-bold"
                  >
                    ↓
                  </span>
                </a>
              </li>
              <li className="py-3">
                <a
                  href="/api/premium/download?file=workbook"
                  className="group flex items-start justify-between gap-4"
                >
                  <span className="text-primary group-hover:text-brand-accent-text font-[family-name:var(--font-display)] font-bold transition-colors">
                    The companion workbook
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-brand-accent-text mt-1 shrink-0 font-bold"
                  >
                    ↓
                  </span>
                </a>
              </li>
              <li className="py-3">
                <Link
                  href="/premium"
                  className="group flex items-start justify-between gap-4"
                >
                  <span className="text-primary group-hover:text-brand-accent-text font-[family-name:var(--font-display)] font-bold transition-colors">
                    Everything else in your package
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-brand-accent-text mt-1 shrink-0 font-bold"
                  >
                    →
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        ) : params.checkout === "success" ? (
          <div className="border-brand-accent bg-card mt-8 rounded-xl border-2 p-6 sm:p-8">
            <h2 className="text-xl font-bold">
              Payment received — opening now.
            </h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Your Book Package is being attached to this account — it usually
              takes a few seconds.{" "}
              <a
                href="/account"
                className="text-brand-accent-text font-semibold hover:underline"
              >
                Refresh this page
              </a>{" "}
              and your downloads will be here.
            </p>
          </div>
        ) : (
          <div className="border-border bg-card mt-8 rounded-xl border p-6 sm:p-8">
            <h2 className="text-xl font-bold">No Book Package yet</h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              The complete downloadable book and workbook — plus everything in
              All In — is one payment of $9.99, attached to this account for
              life.
            </p>
            <div className="mt-5">
              <Link
                href="/premium"
                className="bg-primary text-primary-foreground hover:bg-brand-primary-hover inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-colors"
              >
                See the Book Package →
              </Link>
            </div>
          </div>
        )}

        <form action={logout} className="mt-8">
          <button
            type="submit"
            className="text-muted-foreground hover:text-foreground text-sm font-semibold underline underline-offset-4"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
