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
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
          Your account
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
          {params.checkout === "success"
            ? "Thank you — it’s yours."
            : "Welcome back."}
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Signed in as <span className="font-semibold text-foreground">{email}</span>
          {params.password === "updated" ? " · password updated" : null}
        </p>

        {premium ? (
          <div className="mt-8 rounded-xl border-2 border-brand-accent bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold">The Book Package</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Yours for life — download on any device, any time, just by
              logging in.
            </p>
            <ul className="mt-4 divide-y divide-border">
              <li className="py-3">
                <a href="/api/premium/download?file=book" className="group flex items-start justify-between gap-4">
                  <span className="font-[family-name:var(--font-display)] font-bold text-primary transition-colors group-hover:text-brand-accent-text">
                    The complete book
                  </span>
                  <span aria-hidden="true" className="mt-1 shrink-0 font-bold text-brand-accent-text">↓</span>
                </a>
              </li>
              <li className="py-3">
                <a href="/api/premium/download?file=workbook" className="group flex items-start justify-between gap-4">
                  <span className="font-[family-name:var(--font-display)] font-bold text-primary transition-colors group-hover:text-brand-accent-text">
                    The companion workbook
                  </span>
                  <span aria-hidden="true" className="mt-1 shrink-0 font-bold text-brand-accent-text">↓</span>
                </a>
              </li>
              <li className="py-3">
                <Link href="/premium" className="group flex items-start justify-between gap-4">
                  <span className="font-[family-name:var(--font-display)] font-bold text-primary transition-colors group-hover:text-brand-accent-text">
                    Everything else in your package
                  </span>
                  <span aria-hidden="true" className="mt-1 shrink-0 font-bold text-brand-accent-text">→</span>
                </Link>
              </li>
            </ul>
          </div>
        ) : params.checkout === "success" ? (
          <div className="mt-8 rounded-xl border-2 border-brand-accent bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold">Payment received — opening now.</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Your Book Package is being attached to this account — it usually
              takes a few seconds.{" "}
              <a href="/account" className="font-semibold text-brand-accent-text hover:underline">
                Refresh this page
              </a>{" "}
              and your downloads will be here.
            </p>
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold">No Book Package yet</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The complete downloadable book and workbook — plus everything in
              All In — is one payment of $9.99, attached to this account for
              life.
            </p>
            <div className="mt-5">
              <Link
                href="/premium"
                className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover"
              >
                See the Book Package →
              </Link>
            </div>
          </div>
        )}

        <form action={logout} className="mt-8">
          <button
            type="submit"
            className="text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
