import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { codesConfigured, validCode } from "@/lib/premium";
import { hasPremium } from "@/lib/auth/entitlements";

/**
 * GET /api/premium/download?file=book|workbook[&code=…]
 *
 * Streams the paid Book Package PDFs from private-content/ (no public
 * URL). Two ways in, checked in order:
 *   1) a signed-in account that owns the Book Package (the new flow);
 *   2) a valid legacy access code — so every code already sent by
 *      email keeps working forever.
 */

const FILES: Record<string, { path: string; name: string }> = {
  book: {
    path: "private-content/book-package/bouncing-forward-book.pdf",
    name: "Bouncing-Forward-Book.pdf",
  },
  workbook: {
    path: "private-content/book-package/bouncing-forward-workbook.pdf",
    name: "Bouncing-Forward-Workbook.pdf",
  },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const file = FILES[url.searchParams.get("file") ?? ""];
  const code = url.searchParams.get("code") ?? "";

  if (!file) {
    return NextResponse.json(
      { ok: false, message: "Unknown file." },
      { status: 404 },
    );
  }

  // Way 1: a signed-in owner. Never throws site-wide — any auth hiccup
  // just falls through to the code check.
  let owner = false;
  try {
    owner = await hasPremium();
  } catch {
    owner = false;
  }

  if (!owner) {
    // Way 2: a legacy access code.
    if (!codesConfigured() || !validCode(code)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Please log in to your account to download — or use the access code from your confirmation email.",
        },
        { status: 401 },
      );
    }
  }

  try {
    const data = await readFile(path.join(process.cwd(), file.path));
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The file isn’t available right now — please try again shortly.",
      },
      { status: 500 },
    );
  }
}
