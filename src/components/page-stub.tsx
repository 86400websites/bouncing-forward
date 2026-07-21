import Link from "next/link";
import { NAV_LINKS, PRIMARY_CTA, SITE_NAME } from "@/lib/site";

/**
 * S0 scaffold stub. Each route renders its real h1 and opening line from the
 * copy deck so the deployment pipeline (Vercel Production check, stage 6) can
 * be verified against every route. Full pages replace these in sprints 3–7 —
 * see SPRINT-PLAN.md.
 */
export function PageStub({
  eyebrow,
  title,
  line,
  sprint,
}: {
  eyebrow: string;
  title: string;
  line: string;
  sprint: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/" className="font-[family-name:var(--font-display)] text-lg font-bold">
            {SITE_NAME}
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={PRIMARY_CTA.href}
              className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover"
            >
              {PRIMARY_CTA.label}
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-24 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-accent-text">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{line}</p>
        <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          Scaffold stub — full page arrives in {sprint}.
        </p>
      </section>

      <footer className="bg-primary py-10 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="font-[family-name:var(--font-display)] font-bold">
            Not Back. Forward.
          </p>
          <p className="mt-2 text-sm opacity-80">
            © 2026 {SITE_NAME} · Maher Kaddoura · Part of Half a Life
          </p>
        </div>
      </footer>
    </div>
  );
}
