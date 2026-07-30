"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS, PRIMARY_CTA, SITE_NAME, type NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function hasChildren(
  item: NavItem,
): item is { label: string; href?: string; children: { href: string; label: string }[] } {
  return "children" in item;
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${SITE_NAME} — home`}
        >
          <Image
            src="/assets/logo/bf-mark.jpg"
            alt=""
            width={1482}
            height={2047}
            className="h-9 w-auto"
            priority
          />
          <span className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop */}
        <nav aria-label="Main" className="hidden items-center gap-5 lg:flex">
          {NAV_ITEMS.map((item) =>
            hasChildren(item) ? (
              <DesktopDropdown
                key={item.label}
                item={item}
                pathname={pathname}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "border-b-2 border-transparent pb-0.5 font-[family-name:var(--font-display)] text-sm transition-colors",
                  isActive(pathname, item.href)
                    ? "border-brand-accent font-bold text-foreground"
                    : "font-semibold text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href={PRIMARY_CTA.href}
            className="rounded-full bg-primary px-5 py-2.5 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {PRIMARY_CTA.label}
          </Link>
        </nav>

        {/* Mobile */}
        <Sheet>
          <SheetTrigger
            className="rounded-md p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="overflow-y-auto p-6">
            <SheetTitle>{SITE_NAME}</SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation
            </SheetDescription>
            <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) =>
                hasChildren(item) ? (
                  <MobileGroup key={item.label} item={item} />
                ) : (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={
                        isActive(pathname, item.href) ? "page" : undefined
                      }
                      className={cn(
                        "rounded-md px-3 py-3 font-[family-name:var(--font-display)] text-base transition-colors",
                        isActive(pathname, item.href)
                          ? "bg-muted font-bold text-foreground"
                          : "font-semibold text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ),
              )}
              <SheetClose asChild>
                <Link
                  href={PRIMARY_CTA.href}
                  className="mt-4 rounded-full bg-primary px-5 py-3 text-center font-[family-name:var(--font-display)] text-base font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover"
                >
                  {PRIMARY_CTA.label}
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function DesktopDropdown({
  item,
  pathname,
}: {
  item: { label: string; href?: string; children: { href: string; label: string }[] };
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const groupActive =
    (item.href && isActive(pathname, item.href)) ||
    item.children.some((c) => isActive(pathname, c.href));

  const labelClasses = cn(
    "font-[family-name:var(--font-display)] text-sm transition-colors",
    groupActive
      ? "font-bold text-foreground"
      : "font-semibold text-muted-foreground hover:text-foreground",
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={cn(
          "flex items-center gap-1 border-b-2 pb-0.5",
          groupActive ? "border-brand-accent" : "border-transparent",
        )}
      >
        {item.href ? (
          <Link href={item.href} className={labelClasses}>
            {item.label}
          </Link>
        ) : (
          <span className={labelClasses}>{item.label}</span>
        )}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`${item.label} menu`}
          onClick={() => setOpen((o) => !o)}
          className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronDownIcon className="size-3.5" aria-hidden="true" />
        </button>
      </div>
      <div
        role="menu"
        className={cn(
          "absolute left-0 top-full z-50 w-60 rounded-lg border border-border bg-card p-2 shadow-lg",
          open ? "block" : "hidden",
        )}
      >
        {item.children.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            role="menuitem"
            tabIndex={open ? undefined : -1}
            className="block rounded-md px-3 py-2 font-[family-name:var(--font-display)] text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileGroup({
  item,
}: {
  item: { label: string; href?: string; children: { href: string; label: string }[] };
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        {item.href ? (
          <SheetClose asChild>
            <Link
              href={item.href}
              className="flex-1 rounded-md px-3 py-3 font-[family-name:var(--font-display)] text-base font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          </SheetClose>
        ) : (
          <span className="flex-1 px-3 py-3 font-[family-name:var(--font-display)] text-base font-semibold text-muted-foreground">
            {item.label}
          </span>
        )}
        <button
          type="button"
          aria-expanded={open}
          aria-label={`${item.label} submenu`}
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronDownIcon
            className={cn("size-4 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </div>
      <div
        className={cn(
          "ml-3 flex-col border-l border-border pl-2",
          open ? "flex" : "hidden",
        )}
      >
        {item.children.map((c) => (
          <SheetClose asChild key={c.href}>
            <Link
              href={c.href}
              tabIndex={open ? undefined : -1}
              className="rounded-md px-3 py-2.5 font-[family-name:var(--font-display)] text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {c.label}
            </Link>
          </SheetClose>
        ))}
      </div>
    </div>
  );
}
