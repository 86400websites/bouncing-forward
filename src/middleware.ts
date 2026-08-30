import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/** All routes except static assets — keeps sessions fresh site-wide. */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|downloads/|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)$).*)",
  ],
};
