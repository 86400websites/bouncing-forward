import { test, expect } from "../../harness/fixtures";
import { getSameOrigin, sameOriginPath } from "../../harness/pages";
import {
  AMAZON_FORMATS,
  BLOG_POSTS,
  NOINDEX_PAGES,
  PUBLIC_PAGES,
  REDIRECTS,
  SITEMAP_PAGES,
} from "./inventory";

/**
 * Section A — links, redirects, sitemap (PG-002, PG-004, PG-005).
 * Same-origin only: a link that resolves to any other host is asserted
 * safe (new tab, noopener) but never requested.
 */

type Link = { href: string; target: string; rel: string };

/** Anchor targets that must exist even when nothing links to them. */
const REQUIRED_ANCHORS: Record<string, string[]> = {
  "/compass-and-path": ["compass", "path", "inventory"],
  "/all-in": ["a-inside", "a-included", "full-assessment", "library"],
  "/enterprise": ["formats"],
  "/course": ["modules"],
  "/": ["book-package", "begin-your-crossing"],
};

test(
  "PG-002 every link on every page goes somewhere real, including the in-page anchors",
  {
    tag: ["@PG-002", "@pages", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "External links (Amazon, YouTube) are asserted present and safe (new tab, noopener noreferrer) but never opened — MN-001 covers the Amazon listing. Absolute links to any other host, including a NEXT_PUBLIC_SITE_URL host, are never requested.",
    },
  },
  async ({ page, api, target }, testInfo) => {
    test.setTimeout(240_000);
    const idsByPath = new Map<string, Set<string>>();
    const samePaths = new Set<string>();
    const anchors: { from: string; path: string; id: string }[] = [];
    const external: ({ from: string } & Link)[] = [];
    const selfAnchors: string[] = [];

    const collectIds = async (path: string) => {
      if (idsByPath.has(path)) return;
      await page.goto(path);
      await page.waitForLoadState("load");
      const ids = await page.evaluate(() =>
        [...document.querySelectorAll("[id]")].map((e) => e.id),
      );
      idsByPath.set(path, new Set(ids));
    };
    const queue = (from: string, pathWithHash: string) => {
      const [p, hash] = pathWithHash.split("#");
      samePaths.add(p.split("?")[0] || "/");
      if (hash) anchors.push({ from, path: p.split("?")[0] || "/", id: hash });
    };

    for (const { path } of PUBLIC_PAGES) {
      await page.goto(path);
      await page.waitForLoadState("load");
      const links = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")].map((a) => ({
          href: a.getAttribute("href") ?? "",
          target: (a as HTMLAnchorElement).target,
          rel: (a as HTMLAnchorElement).rel,
        })),
      );
      const ids = await page.evaluate(() =>
        [...document.querySelectorAll("[id]")].map((e) => e.id),
      );
      idsByPath.set(path, new Set(ids));
      for (const link of links) {
        const href = link.href.trim();
        if (href === "#") {
          selfAnchors.push(path);
        } else if (href.startsWith("#")) {
          anchors.push({ from: path, path, id: href.slice(1) });
        } else if (/^mailto:/i.test(href)) {
          // Nothing to fetch.
        } else if (/^https?:\/\//i.test(href)) {
          const same = sameOriginPath(href, target);
          if (same === null) external.push({ from: path, ...link, href });
          else queue(path, same);
        } else if (href.startsWith("/")) {
          queue(path, href);
        } else {
          throw new Error(`${path}: unexpected link href shape "${href}"`);
        }
      }
    }

    testInfo.annotations.push({
      type: "note",
      description: `Self-anchors ("#") accepted as placeholders on: ${[...new Set(selfAnchors)].join(", ") || "none"}.`,
    });

    for (const link of external) {
      expect(
        link.target,
        `${link.from}: external link ${link.href} must open in a new tab`,
      ).toBe("_blank");
      expect(
        link.rel,
        `${link.from}: external link ${link.href} lacks noopener`,
      ).toContain("noopener");
      expect(
        link.rel,
        `${link.from}: external link ${link.href} lacks noreferrer`,
      ).toContain("noreferrer");
    }
    // Every format is offered in both CTA rows on The Book page and once
    // under the Premium buy button.
    const amazonOn = (path: string, href: string) =>
      external.filter((l) => l.from === path && l.href === href).length;
    for (const format of AMAZON_FORMATS) {
      expect(
        amazonOn("/book", format.href),
        `The Book page links the ${format.label} listing twice`,
      ).toBe(2);
      expect(
        amazonOn("/premium", format.href),
        `Premium links the ${format.label} listing once`,
      ).toBe(1);
    }

    for (const p of [...samePaths].sort()) {
      const { status, response } = await getSameOrigin(api, p, {
        followOnce: true,
      });
      expect(status, `${p} does not answer 200`).toBe(200);
      if (/^\/downloads\/.+\.pdf$/.test(p)) {
        expect(
          response.headers()["content-type"] ?? "",
          `${p} is not a PDF`,
        ).toContain("application/pdf");
      }
    }
    for (const a of anchors) await collectIds(a.path);
    for (const a of anchors) {
      expect(
        idsByPath.get(a.path)?.has(a.id),
        `${a.from} links to ${a.path}#${a.id}, but that anchor does not exist`,
      ).toBe(true);
    }
    for (const [p, ids] of Object.entries(REQUIRED_ANCHORS)) {
      await collectIds(p);
      for (const id of ids)
        expect(idsByPath.get(p)?.has(id), `${p}#${id} is missing`).toBe(true);
    }

    await page.goto("/course");
    await expect(
      page.locator(
        "iframe[title='Module 1: Introduction to Bouncing Forward']",
      ),
    ).toHaveAttribute(
      "src",
      /^https:\/\/www\.youtube-nocookie\.com\/embed\/adFqf6BJDT8/,
    );
  },
);

test(
  "PG-004 old addresses still work: every retired path redirects permanently to a page that loads",
  {
    tag: ["@PG-004", "@pages"],
    annotation: {
      type: "note",
      description:
        "The address without www → www half is Production-only: bouncing-forward.com answered 308 → www.bouncing-forward.com in a read-only observation on 9 September 2026; the suite never requests a Production host.",
    },
  },
  async ({ api, target }) => {
    for (const [oldPath, newPath] of REDIRECTS) {
      const res = await api.get(oldPath);
      expect([301, 308], `${oldPath} answered ${res.status()}`).toContain(
        res.status(),
      );
      const location = new URL(
        res.headers()["location"] ?? "",
        `${target.origin}/`,
      );
      expect(location.origin, `${oldPath} redirects off-site`).toBe(
        target.origin,
      );
      expect(location.pathname, `${oldPath} redirects to the wrong page`).toBe(
        newPath,
      );
      expect(
        (await api.get(newPath)).status(),
        `${newPath} does not load`,
      ).toBe(200);
    }
  },
);

test(
  "PG-005 the sitemap and robots files are served and list only real, indexable pages",
  {
    tag: ["@PG-005", "@pages", "@morning"],
    annotation: {
      type: "note",
      description:
        "On a Preview the sitemap/robots host is whatever NEXT_PUBLIC_SITE_URL is set to (intentional difference C11); only the paths are asserted and every listed path is requested on the target origin.",
    },
  },
  async ({ api }, testInfo) => {
    const sitemap = await api.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()["content-type"] ?? "").toMatch(/xml/);
    const body = await sitemap.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const hosts = new Set(locs.map((u) => new URL(u).host));
    testInfo.annotations.push({
      type: "note",
      description: `Sitemap host(s): ${[...hosts].join(", ")}`,
    });
    const paths = locs.map((u) => new URL(u).pathname || "/");
    const expected = [
      ...SITEMAP_PAGES,
      ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
    ];
    expect(
      paths.length,
      "The sitemap lists the wrong number of addresses",
    ).toBe(expected.length);
    expect(new Set(paths)).toEqual(new Set(expected));
    expect(paths).not.toContain("/podcast");
    for (const p of NOINDEX_PAGES)
      expect(
        paths,
        `${p} is noindexed and must not be in the sitemap`,
      ).not.toContain(p);
    for (const p of paths)
      expect(
        (await api.get(p)).status(),
        `${p} (listed in the sitemap) does not answer 200`,
      ).toBe(200);

    const robots = await api.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const text = await robots.text();
    expect(text).toMatch(/^User-Agent: \*$/im);
    expect(text).toMatch(/^Allow: \/$/m);
    const sitemapLine = /^Sitemap: (.+)$/m.exec(text);
    expect(sitemapLine, "robots.txt names no sitemap").not.toBeNull();
    expect(new URL(sitemapLine![1].trim()).pathname).toBe("/sitemap.xml");
  },
);
