import { test, expect } from "../../harness/fixtures";
import { identity } from "../../harness/identities";
import { memberOf } from "../../harness/mailchimp";
import { expectPdf } from "../../harness/pages";
import { preflightRecord, recordFixture } from "../../harness/run-record";

/**
 * Section C — the 7 Step Journal sign-up (FM-001 … FM-005) and PR-003,
 * which lives here because it must follow FM-002 (same identity, same
 * member). The Mailchimp audience is SHARED with Production: one stable
 * identity per line, every write registered for archiving, never a
 * high-volume probe.
 */

const REGION = "Download your 7 Step Journal";
const SUBMIT = "Send me the 7 Step Journal";
const WELCOME = "You’re in — welcome.";
const INVALID = "Please enter a valid email address.";
const JOURNAL_PDF = "/downloads/BF-7-Step-Reflection-Journal.pdf";
const CONTENT_PAGES = [
  "/",
  "/book",
  "/about",
  "/course",
  "/compass-and-path",
  "/assess",
  "/stories",
  "/blog",
  "/blog/a-setback-is-not-a-staircase",
  "/all-in",
  "/premium",
  "/enterprise",
  "/contact",
  "/faq",
];

const signup = (page: import("@playwright/test").Page) =>
  page.getByRole("region", { name: REGION });

test(
  "FM-001 the 7 Step Journal sign-up rejects a bad email with a clear message, in the browser and on the server",
  {
    tag: ["@FM-001", "@forms"],
    annotation: {
      type: "note",
      description:
        '"On every page" means the 14 content pages: the block is not rendered on Privacy, Terms, the account pages, the style guide or the 404 page.',
    },
  },
  async ({ page, api, target }) => {
    test.setTimeout(90_000);
    const posts: string[] = [];
    page.on("request", (r) => {
      if (
        r.method() === "POST" &&
        r.url() === `${target.origin}/api/newsletter`
      )
        posts.push(r.url());
    });
    await page.goto("/");
    const region = signup(page);
    await region.getByLabel("Email address").fill("not-an-email");
    await region.getByRole("button", { name: SUBMIT }).click();
    await expect(region.getByText(INVALID)).toBeVisible();
    await expect(region.getByText(WELCOME)).toHaveCount(0);
    await page.waitForTimeout(1000);
    expect(
      posts,
      "the browser must not send an invalid address to the server",
    ).toEqual([]);

    for (const email of ["not-an-email", "   "]) {
      const res = await api.post("/api/newsletter", {
        data: { email, firstName: "", source: "newsletter", company: "" },
      });
      expect(res.status()).toBe(400);
      expect(await res.json()).toEqual({ ok: false, message: INVALID });
    }
    for (const path of CONTENT_PAGES) {
      const res = await api.get(path);
      expect(res.status(), path).toBe(200);
      const html = await res.text();
      expect(html, `${path}: sign-up block`).toContain('id="byc-email"');
      expect(html, `${path}: sign-up button`).toContain(SUBMIT);
    }
  },
);

test(
  "FM-002 a valid sign-up shows the welcome box with the 7 Step Journal download, and the address lands in Mailchimp tagged newsletter",
  {
    tag: ["@FM-002", "@forms", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "SHARED audience: one controlled identity, one submission per run, member archived by the cleanup project. The welcome email's arrival is MN-004. Single capture path (Mailchimp only) — Should-fix on the list.",
    },
  },
  async ({ page, api, target }) => {
    const email = identity("newsletter");
    await memberOf(target, email); // fails naming the Mailchimp variables before any write happens
    recordFixture({
      kind: "mailchimp-member",
      ref: "newsletter",
      createdBy: "FM-002",
    });
    await page.goto("/");
    const region = signup(page);
    await region.getByLabel("First name").fill("Launch Gate");
    await region.getByLabel("Email address").fill(email);
    const apiResponse = page.waitForResponse(
      (r) =>
        r.url() === `${target.origin}/api/newsletter` &&
        r.request().method() === "POST",
      { timeout: 20_000 },
    );
    await region.getByRole("button", { name: SUBMIT }).click();
    const res = await apiResponse;
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    await expect(region.getByText(WELCOME)).toBeVisible({ timeout: 15_000 });
    await expect(
      region.getByText("Your 7 Step Journal is ready right now:"),
    ).toBeVisible();
    const link = region.getByRole("link", {
      name: "Download the 7 Step Journal →",
    });
    await expect(link).toHaveAttribute("href", JOURNAL_PDF);
    await expect(link).toHaveAttribute("target", "_blank");
    await expectPdf(api, JOURNAL_PDF);
    await expect
      .poll(
        async () => {
          const m = await memberOf(target, email);
          return m
            ? { status: m.status, hasTag: m.tags.includes("newsletter") }
            : null;
        },
        { timeout: 20_000, intervals: [2000] },
      )
      .toEqual({ status: "subscribed", hasTag: true });
  },
);

test(
  "FM-003 a bot that fills the hidden honeypot field is silently ignored",
  { tag: ["@FM-003", "@forms", "@desktop-only"] },
  async ({ page, api, target }) => {
    const email = identity("honeypot");
    const before = await memberOf(target, email);
    expect(
      before?.status ?? null,
      "the honeypot identity is already a live member from an earlier defect — archive it and re-run",
    ).not.toBe("subscribed");
    recordFixture({
      kind: "mailchimp-member",
      ref: "honeypot",
      createdBy: "FM-003",
    });
    const res = await api.post("/api/newsletter", {
      data: {
        email,
        firstName: "Launch Gate Bot",
        source: "newsletter",
        company: "Launch Gate Bot Co",
      },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    await new Promise((r) => setTimeout(r, 3000));
    const after = await memberOf(target, email);
    expect(
      after?.status ?? null,
      "a member was created despite the honeypot",
    ).not.toBe("subscribed");
    expect(after).toEqual(before);
    await page.goto("/");
    const honeypot = signup(page).locator('input[name="company"]');
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
  },
);

test(
  "FM-004 if the sign-up service is not configured, the form shows an honest error instead of a fake success",
  { tag: ["@FM-004", "@forms", "@desktop-only"] },
  async ({ page, api }) => {
    const deployment = preflightRecord().deployment;
    test.skip(
      deployment?.mailchimpConfigured === true,
      "N/A per approved FM-004: this deployment has Mailchimp keys configured (shared audience); the not-configured path is only testable on a deployment without MAILCHIMP_API_KEY / MAILCHIMP_AUDIENCE_ID.",
    );
    const message =
      "Sign-ups aren’t connected yet — please try again soon, or reach us via the contact page.";
    const res = await api.post("/api/newsletter", {
      data: {
        email: identity("newsletter"),
        source: "newsletter",
        company: "",
      },
    });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({
      ok: false,
      code: "not_configured",
      message,
    });
    await page.goto("/");
    const region = signup(page);
    await region.getByLabel("Email address").fill(identity("newsletter"));
    await region.getByRole("button", { name: SUBMIT }).click();
    await expect(region.getByText(message)).toBeVisible({ timeout: 15_000 });
    await expect(region.getByText(WELCOME)).toHaveCount(0);
    await expect(region.getByRole("button", { name: SUBMIT })).toBeEnabled();
  },
);

test(
  "FM-005 the sign-up API refuses malformed requests, and an unexpected source falls back to newsletter",
  {
    tag: ["@FM-005", "@forms", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "The route does not refuse unknown tag names: a source that fails its shape check is silently replaced by newsletter, and any value that passes is applied as a tag (see the FM-011 Blocker finding — never exercised here). The fallback half re-upserts the FM-002 member (idempotent, no new audience member).",
    },
  },
  async ({ api, target }) => {
    const bad = await api.post("/api/newsletter", {
      data: "{not json",
      headers: { "content-type": "application/json" },
    });
    expect(bad.status()).toBe(400);
    expect(await bad.json()).toEqual({
      ok: false,
      message: "Invalid request.",
    });
    for (const data of [{ source: "newsletter" }, []]) {
      const res = await api.post("/api/newsletter", { data });
      expect(res.status()).toBe(400);
      expect(await res.json()).toEqual({ ok: false, message: INVALID });
    }
    const email = identity("newsletter");
    recordFixture({
      kind: "mailchimp-member",
      ref: "newsletter",
      createdBy: "FM-005",
    });
    const res = await api.post("/api/newsletter", {
      data: { email, source: "Not A Tag!", company: "" },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    await expect
      .poll(
        async () => {
          const m = await memberOf(target, email);
          return m ? { status: m.status, tags: [...m.tags].sort() } : null;
        },
        { timeout: 20_000, intervals: [2000] },
      )
      .toEqual({ status: "subscribed", tags: ["newsletter"] });
  },
);

test(
  "PR-003 submitting a public form without the human-check token is rejected",
  {
    tag: ["@PR-003", "@protection", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "EXPECTED FAIL today: no Turnstile (or equivalent) exists — honeypots only (known open item). Scope: the site's own public write endpoint; the contact form posts directly to Formspree (its human check is a Formspree setting, MN-003); login, sign-up and access-code forms are PR-001 / PR-004. While the control is missing the request re-upserts the FM-002 member, registered for archiving.",
    },
  },
  async ({ api }) => {
    const email = identity("newsletter");
    recordFixture({
      kind: "mailchimp-member",
      ref: "newsletter",
      createdBy: "PR-003",
    });
    const res = await api.post("/api/newsletter", {
      data: {
        email,
        firstName: "Launch Gate",
        source: "newsletter",
        company: "",
      },
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean };
    expect(
      res.status(),
      "the sign-up endpoint accepted a submission with no human-check token — no server-verified bot check exists",
    ).toBeGreaterThanOrEqual(400);
    expect(body.ok).toBe(false);
  },
);

test(
  "FM-011 the public sign-up address cannot hand out the Book Package: a sign-up tagged premium is refused",
  {
    tag: ["@FM-011", "@forms", "@desktop-only"],
    annotation: {
      type: "note",
      description:
        "Blocker found by the Phase 2 scan, line approved 10 September 2026. Uses its own controlled identity (the owner's mailbox), registered for archiving. While the hole is open this request tags that identity premium and the access-code journey mails the owner the shared code once per run — black it out in any evidence (MN-004).",
    },
  },
  async ({ api, target }) => {
    const email = identity("tagprobe");
    await memberOf(target, email); // fails naming the Mailchimp variables before any write happens
    recordFixture({
      kind: "mailchimp-member",
      ref: "tagprobe",
      createdBy: "FM-011",
    });
    const res = await api.post("/api/newsletter", {
      data: { email, firstName: "Launch Gate", source: "premium", company: "" },
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean };
    expect(
      res.status(),
      "the sign-up endpoint accepted a request tagged premium — anyone can trigger the Book Package access-code email without paying",
    ).toBe(400);
    expect(body.ok).toBe(false);
    await new Promise((r) => setTimeout(r, 3000));
    const member = await memberOf(target, email);
    expect(
      member?.tags.includes("premium") ?? false,
      "a public sign-up must never carry the premium tag",
    ).toBe(false);
  },
);
