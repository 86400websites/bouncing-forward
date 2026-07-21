import Image from "next/image";
import Link from "next/link";
import { COMPASS_PATH_NAV_LABEL, SITE_NAME } from "@/lib/site";

/**
 * Footer per the copy deck (Home footer, reused on every page).
 * "No dead links ship": destinations without a live page render as
 * non-link "coming soon" text until their phase arrives
 * (SITEMAP-AND-FEATURES.md §2).
 */

function ComingSoon({ label }: { label: string }) {
  return (
    <span className="cursor-default text-primary-foreground/45">
      {label} <span className="text-xs">· soon</span>
    </span>
  );
}

const exploreLinks = [
  { href: "/book", label: "The Book" },
  { href: "/learn", label: "Learn" },
  { href: "/compass-and-path", label: COMPASS_PATH_NAV_LABEL },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About Maher" },
];

const compassPathLinks = [
  { href: "/compass-and-path#compass", label: "The 4 Elements" },
  { href: "/compass-and-path#path", label: "The 4 Steps" },
  { href: "#begin-your-crossing", label: "Taking Stock Inventory" },
  { href: "/assess", label: "Compass & Path Check" },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/logo/bf-mark.jpg"
                alt=""
                width={1482}
                height={2047}
                className="h-10 w-auto rounded-sm"
              />
              <span className="font-[family-name:var(--font-display)] text-lg font-extrabold">
                {SITE_NAME}
              </span>
            </div>
            <p className="mt-5 font-[family-name:var(--font-display)] text-xl font-extrabold">
              Not Back. Forward.
            </p>
            <p className="mt-3 max-w-xs italic leading-relaxed text-primary-foreground/75">
              &ldquo;Not going back to who you were. Going forward to who you
              are capable of becoming.&rdquo;
            </p>
          </div>

          <nav aria-label="Explore">
            <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-brand-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Compass and Path">
            <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              Compass &amp; Path
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {compassPathLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition-colors hover:text-brand-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Connect">
            <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              Connect
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="#begin-your-crossing" className="transition-colors hover:text-brand-accent">
                  Newsletter
                </Link>
              </li>
              <li>
                <ComingSoon label="Podcast" />
              </li>
              <li>
                <ComingSoon label="Blog" />
              </li>
              <li>
                <ComingSoon label="Contact" />
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {SITE_NAME} · Maher Kaddoura ·{" "}
            <span className="text-primary-foreground/85">Part of Half a Life</span>
          </p>
          <p className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-brand-accent">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-brand-accent">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
