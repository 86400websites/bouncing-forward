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
function isGroup(
  item: NavItem,
): item is { label: string; href?: string; children: { href: string; label: string }[] } {
  return "children" in item;
}

const flatLinks = [
  ...NAV_ITEMS.filter(isFlat),
];
const groups = NAV_ITEMS.filter(isGroup);

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
              Setbacks don’t get the last word.
            </p>
            <p className="mt-3 max-w-xs italic leading-relaxed text-primary-foreground/75">
              &ldquo;Not going back to who you were. Going forward to who you
              are capable of becoming.&rdquo;
            </p>
          </div>

          <nav aria-label="Menu">
            <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              Menu
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {flatLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition-colors hover:text-brand-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {groups.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
                {group.href ? (
                  <Link href={group.href} className="transition-colors hover:text-brand-accent/80">
                    {group.label}
                  </Link>
                ) : (
                  group.label
                )}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.children.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="transition-colors hover:text-brand-accent">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {SITE_NAME} · Maher Kaddoura ·{" "}
            <span className="text-primary-foreground/85">Part of Half a Life</span>
          </p>
          <p className="flex gap-4">
            <Link href="/faq" className="transition-colors hover:text-brand-accent">
              FAQ
            </Link>
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
