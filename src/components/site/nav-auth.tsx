"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * The header's Log In / Account pill (Unretire-style). Auth state is
 * read in the BROWSER so every page stays statically rendered: the
 * server always paints "Log In", and a signed-in visitor sees it flip
 * to "Account" right after hydration. Fail-open: without Supabase env
 * it stays a plain Log In link.
 */
export function NavAuth({ mobile = false }: { mobile?: boolean }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ) {
      return;
    }
    let cancelled = false;
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (!cancelled) setLoggedIn(Boolean(data.user));
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) setLoggedIn(Boolean(session?.user));
      });
      return () => {
        cancelled = true;
        subscription.unsubscribe();
      };
    } catch {
      return; // env malformed — stay a Log In link
    }
  }, []);

  const href = loggedIn ? "/account" : "/login";
  const label = loggedIn ? "Account" : "Log In";

  if (mobile) {
    return (
      <Link
        href={href}
        className="mt-4 rounded-full bg-primary px-5 py-3 text-center font-[family-name:var(--font-display)] text-base font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover"
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-full bg-primary px-5 py-2.5 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {label}
    </Link>
  );
}
