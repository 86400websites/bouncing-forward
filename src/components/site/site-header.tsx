"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS, PRIMARY_CTA, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} — home`}>
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
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "border-b-2 border-transparent pb-0.5 font-[family-name:var(--font-display)] text-sm transition-colors",
                  active
                    ? "border-brand-accent font-bold text-foreground"
                    : "font-semibold text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}
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
          <SheetContent side="right" className="p-6">
            <SheetTitle>{SITE_NAME}</SheetTitle>
            <SheetDescription className="sr-only">Site navigation</SheetDescription>
            <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1">
              {NAV_LINKS.map((l) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <SheetClose asChild key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-3 font-[family-name:var(--font-display)] text-base transition-colors",
                        active
                          ? "bg-muted font-bold text-foreground"
                          : "font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                );
              })}
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
