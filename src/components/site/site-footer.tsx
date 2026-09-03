import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS, SITE_NAME, type NavItem } from "@/lib/site";

/*
 * Footer. Re-brief 31 Jul 2026: the footer menu mirrors the header menu.
 * It is derived from the same NAV_ITEMS source so the two never drift —
 * flat top-level links (plus the Log In CTA) in one column, and each
 * dropdown group (Resources, All In) as its own column of child links.
 */

function isFlat(item: NavItem): item is { href: string; label: string } {
  return !("children" in item);
}
function isGroup(item: NavItem): item is {
  label: string;
  href?: string;
  children: { href: string; label: string }[];
} {
  return "children" in item;
}

const flatLinks = [...NAV_ITEMS.filter(isFlat)];
const groups = NAV_ITEMS.filter(isGroup);

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <p className="text-primary-foreground/80 text-sm">
            Everything opens with the Full Assessment — free, for life.
          </p>
          <Link
            href="/all-in"
            className="bg-brand-accent text-primary focus-visible:outline-ring inline-flex items-center rounded-full px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold transition-[filter] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Go All In
          </Link>
        </div>
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
              Setbacks don’t get the last word.
            </p>
            <p className="text-primary-foreground/75 mt-3 max-w-xs leading-relaxed italic">
              &ldquo;Not going back to who you were. Going forward to who you
              are capable of becoming.&rdquo;
            </p>
          </div>

          <nav aria-label="Menu">
            <p className="text-brand-accent font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.08em] uppercase">
              Menu
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {flatLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-brand-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {groups.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <p className="text-brand-accent font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.08em] uppercase">
                {group.href ? (
                  <Link
                    href={group.href}
                    className="hover:text-brand-accent/80 transition-colors"
                  >
                    {group.label}
                  </Link>
                ) : (
                  group.label
                )}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.children.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="hover:text-brand-accent transition-colors"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-primary-foreground/15 text-primary-foreground/65 mt-14 flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {SITE_NAME} · Maher Kaddoura ·{" "}
            <span className="text-primary-foreground/85">
              Part of Half a Life
            </span>
          </p>
          <p className="flex gap-4">
            <Link
              href="/faq"
              className="hover:text-brand-accent transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/privacy"
              className="hover:text-brand-accent transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-brand-accent transition-colors"
            >
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
