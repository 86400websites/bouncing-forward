import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { codesConfigured, validCode } from "@/lib/premium";

/**
 * GET /api/premium/download?file=book|workbook&code=…
 *
 * Streams the paid Book Package PDFs from private-content/ (which has
 * no public URL) — only when a valid access code comes with the
 * request. This is what keeps the $9.99 files genuinely un-fetchable
 * without a code, while every valid code works on any device, forever.
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
    return NextResponse.json({ ok: false, message: "Unknown file." }, { status: 404 });
  }
  if (!codesConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Access codes aren’t switched on yet — please try again soon." },
      { status: 503 },
    );
  }
  if (!validCode(code)) {
    return NextResponse.json(
      { ok: false, message: "That code doesn’t match." },
      { status: 401 },
    );
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
      { ok: false, message: "The file isn’t available right now — please try again shortly." },
      { status: 500 },
    );
  }
}
