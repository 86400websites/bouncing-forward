import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { compileFunction } from "node:vm";
import ts from "typescript";

// Webinar registration (/api/webinar) against the real mailchimp.ts with a
// fake Mailchimp. Same isolated loader as critical-fixes.test.mjs: no env
// files, no network, no new test dependencies.
const require = createRequire(import.meta.url);
const env = {
  MAILCHIMP_API_KEY: "unit-placeholder",
  MAILCHIMP_AUDIENCE_ID: "unit-audience",
  MAILCHIMP_SERVER_PREFIX: "unit",
};

function load(path, mocks = {}, fetcher) {
  const filename = new URL(`../../src/${path}`, import.meta.url);
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const mod = { exports: {} };
  compileFunction(source, [
    "require",
    "module",
    "exports",
    "process",
    "fetch",
    "console",
  ])(
    (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      assert.ok(!id.startsWith("@/"), `Unmocked application dependency: ${id}`);
      return require(id);
    },
    mod,
    mod.exports,
    { env },
    fetcher ??
      (() => {
        throw new Error("Unexpected network request");
      }),
    { info() {}, warn() {}, error() {} },
  );
  return mod.exports;
}

const webinarLib = load("lib/webinar.ts");
const openWebinar = { ...webinarLib, isWebinarOver: () => false };

function fakeMailchimp({ rejectMergeFields = false, putError } = {}) {
  const calls = [];
  const fetcher = async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ url, body });
    if (url.endsWith("/tags")) return new Response(null, { status: 204 });
    if (putError) return Response.json(putError, { status: 400 });
    if (rejectMergeFields && "COUNTRY" in body.merge_fields) {
      return Response.json(
        {
          title: "Invalid Resource",
          status: 400,
          detail: "Your merge fields were invalid.",
        },
        { status: 400 },
      );
    }
    return Response.json({ status: "subscribed" });
  };
  return { calls, fetcher };
}

function routeWith(mailchimpFetcher, webinar = openWebinar) {
  const mailchimp = load("lib/mailchimp.ts", {}, mailchimpFetcher);
  return load("app/api/webinar/route.ts", {
    "@/lib/mailchimp": mailchimp,
    "@/lib/webinar": webinar,
  });
}

function register(overrides = {}) {
  return new Request("http://localhost/api/webinar", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      first_name: "Ann",
      last_name: "Lee",
      email: "ann@example.invalid",
      country: "Kenya",
      session: "19:00 SAST",
      ...overrides,
    }),
  });
}

test("registration restores the contact, sends name + country, and tags the session", async () => {
  const mc = fakeMailchimp();
  const response = await routeWith(mc.fetcher).POST(register());
  assert.equal(response.status, 200);
  const put = mc.calls.find((c) => !c.url.endsWith("/tags"));
  assert.equal(put.body.status, "subscribed", "explicit opt-in restores");
  assert.deepEqual(put.body.merge_fields, {
    FNAME: "Ann",
    LNAME: "Lee",
    COUNTRY: "Kenya",
  });
  const tags = mc.calls.find((c) => c.url.endsWith("/tags"));
  assert.deepEqual(
    tags.body.tags.map((t) => t.name),
    ["webinar", "webinar-oct21-1900"],
  );
});

test("audience without a COUNTRY field: retries without it and still registers", async () => {
  const mc = fakeMailchimp({ rejectMergeFields: true });
  const response = await routeWith(mc.fetcher).POST(register());
  assert.equal(response.status, 200);
  const puts = mc.calls.filter((c) => !c.url.endsWith("/tags"));
  assert.equal(puts.length, 2);
  assert.deepEqual(puts[1].body.merge_fields, { FNAME: "Ann", LNAME: "Lee" });
  assert.equal(mc.calls.filter((c) => c.url.endsWith("/tags")).length, 1);
});

test("other Mailchimp 400s are not retried and never tag", async () => {
  const mc = fakeMailchimp({
    putError: {
      title: "Invalid Resource",
      detail: "ann@example.invalid looks fake or invalid",
    },
  });
  const response = await routeWith(mc.fetcher).POST(register());
  assert.equal(response.status, 400);
  assert.equal(mc.calls.length, 1, "one PUT, no retry, no tags");
});

test("after the event, registration is closed without contacting Mailchimp", async () => {
  const route = routeWith(undefined, {
    ...webinarLib,
    isWebinarOver: () => true,
  });
  const response = await route.POST(register());
  assert.equal(response.status, 410);
});

test("every session has both a Mailchimp tag and a Zoom link", () => {
  assert.deepEqual(
    Object.keys(webinarLib.WEBINAR_SESSION_TAGS).sort(),
    Object.keys(webinarLib.WEBINAR_ZOOM_LINKS).sort(),
  );
  for (const link of Object.values(webinarLib.WEBINAR_ZOOM_LINKS)) {
    assert.match(link, /^https:\/\/[a-z0-9.]*zoom\.us\//);
  }
});
