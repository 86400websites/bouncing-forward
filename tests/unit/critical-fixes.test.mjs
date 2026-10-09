import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { compileFunction } from "node:vm";
import ts from "typescript";

// Exercise the actual handlers with isolated providers, without loading env
// files or contacting Mailchimp, Stripe, or Supabase. No new test dependencies.
const require = createRequire(import.meta.url);
const env = {
  MAILCHIMP_API_KEY: "unit-placeholder",
  MAILCHIMP_AUDIENCE_ID: "unit-audience",
  MAILCHIMP_SERVER_PREFIX: "unit",
  STRIPE_WEBHOOK_SECRET: "unit-signature-placeholder",
  NEXT_PUBLIC_SUPABASE_URL: "https://unit.invalid",
  SUPABASE_SECRET_KEY: "unit-placeholder",
  PREMIUM_ACCESS_CODES: "unit-code",
};

function load(path, mocks = {}, fetcher, variables = env) {
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
    { env: variables },
    fetcher ??
      (() => {
        throw new Error("Unexpected network request");
      }),
    { info() {}, error() {} },
  );
  return mod.exports;
}

function request(body) {
  return new Request("http://localhost/api/test", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

test("public sign-ups cannot apply paid or arbitrary tags; approved sources and fallback still work", async () => {
  const calls = [];
  const route = load("app/api/newsletter/route.ts", {
    "@/lib/mailchimp": {
      mailchimpSubscribe: async (opts) => {
        calls.push(opts);
        return { ok: true };
      },
    },
  });
  for (const source of ["premium", "admin", "another-tag"]) {
    const res = await route.POST(
      request({ email: "unit@example.invalid", source }),
    );
    assert.equal(res.status, 400);
    assert.equal((await res.json()).ok, false);
  }
  assert.equal(calls.length, 0);
  for (const source of [
    "newsletter",
    "full-assessment",
    undefined,
    "Not A Tag!",
  ]) {
    const res = await route.POST(
      request({ email: "unit@example.invalid", source }),
    );
    assert.equal(res.status, 200);
    assert.equal(calls.at(-1).resubscribe, true);
    assert.deepEqual(calls.at(-1).tags, [
      source === "full-assessment" ? source : "newsletter",
    ]);
  }
  const before = calls.length;
  assert.equal((await route.POST(request({ email: "bad" }))).status, 400);
  assert.equal(
    (
      await route.POST(
        request({ email: "unit@example.invalid", company: "bot" }),
      )
    ).status,
    200,
  );
  assert.equal(calls.length, before);
});

test("newsletter and legacy code endpoints refuse null and primitive JSON; valid codes still work", async () => {
  const premium = load("lib/premium.ts");
  const routes = [
    load("app/api/newsletter/route.ts", { "@/lib/mailchimp": {} }),
    load("app/api/premium/route.ts", { "@/lib/premium": premium }),
  ];
  for (const route of routes) {
    for (const body of [null, false, 42, "invalid"]) {
      const res = await route.POST(request(body));
      assert.equal(res.status, 400);
      assert.deepEqual(await res.json(), {
        ok: false,
        message: "Invalid request.",
      });
    }
    const bad = await route.POST(
      new Request("http://localhost", { method: "POST", body: "{bad" }),
    );
    assert.equal(bad.status, 400);
  }
  assert.equal((await routes[0].POST(request([]))).status, 400);
  assert.equal(
    (await routes[1].POST(request({ code: " UNIT-CODE " }))).status,
    200,
  );
  assert.equal((await routes[1].POST(request({ code: "wrong" }))).status, 401);
});

test("explicit rejoin requests subscribed status and requires provider confirmation; webhook preserves preferences", async () => {
  const calls = [];
  const mailchimp = load("lib/mailchimp.ts", {}, async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return url.endsWith("/tags")
      ? new Response(null, { status: 204 })
      : Response.json({ status: "subscribed" });
  });
  for (const resubscribe of [true, undefined]) {
    assert.deepEqual(
      await mailchimp.mailchimpSubscribe({
        email: "unit@example.invalid",
        tags: [resubscribe ? "newsletter" : "premium"],
        resubscribe,
      }),
      { ok: true },
    );
    const member = calls.at(-2).body;
    assert.equal(member.status_if_new, "subscribed");
    assert.equal(member.status, resubscribe ? "subscribed" : undefined);
    assert.equal(calls.at(-1).body.tags[0].status, "active");
  }
});

test("observed Mailchimp signup restriction stays an honest retryable error and never applies tags", async () => {
  let calls = 0;
  const mailchimp = load("lib/mailchimp.ts", {}, async () => {
    calls++;
    return Response.json(
      {
        title: "Invalid Resource",
        status: 400,
        detail:
          "unit@example.invalid has signed up to a lot of lists very recently; we're not allowing more signups for now",
      },
      { status: 400 },
    );
  });
  const route = load("app/api/newsletter/route.ts", {
    "@/lib/mailchimp": mailchimp,
  });
  const response = await route.POST(
    request({ email: "unit@example.invalid", source: "newsletter" }),
  );
  assert.equal(response.status, 429);
  assert.deepEqual(await response.json(), {
    ok: false,
    message:
      "Sign-ups are temporarily unavailable for this email address. Please try again later.",
  });
  assert.equal(
    calls,
    1,
    "must not retry inline, unarchive, change opt-in state, or apply tags",
  );
  const result = await mailchimp.mailchimpSubscribe({
    email: "unit@example.invalid",
    tags: ["premium"],
  });
  assert.equal(result.ok, false);
  assert.equal(
    result.retryable,
    true,
    "the buyer webhook must request Stripe retry rather than acknowledge a permanent failure",
  );
  assert.equal(calls, 2);
});

test("HTTP success with a non-subscribed member never produces newsletter success or tag writes", async () => {
  for (const body of [
    { status: "archived" },
    { status: "unsubscribed" },
    { status: "pending" },
    {},
    null,
  ]) {
    let calls = 0;
    const mailchimp = load("lib/mailchimp.ts", {}, async () => {
      calls++;
      return Response.json(body);
    });
    const route = load("app/api/newsletter/route.ts", {
      "@/lib/mailchimp": mailchimp,
    });
    const response = await route.POST(
      request({ email: "unit@example.invalid", source: "full-assessment" }),
    );
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, false);
    assert.equal(calls, 1);
  }
});

test("Mailchimp tag HTTP/network failures and member throttling are retryable, never false success", async () => {
  for (const failure of [400, 401, 429, 500, "network"]) {
    const mailchimp = load("lib/mailchimp.ts", {}, async (url) => {
      if (!url.endsWith("/tags")) return new Response("{}", { status: 200 });
      if (failure === "network") throw new Error("private upstream diagnostic");
      return new Response("private upstream diagnostic", { status: failure });
    });
    const result = await mailchimp.mailchimpSubscribe({
      email: "unit@example.invalid",
      tags: ["premium"],
    });
    assert.equal(result.ok, false);
    assert.equal(result.retryable, true);
    assert.equal(result.status, 502);
    assert.ok(!result.message.includes("private"));
  }
  const throttled = load(
    "lib/mailchimp.ts",
    {},
    async () => new Response("{}", { status: 429 }),
  );
  assert.equal(
    (await throttled.mailchimpSubscribe({ email: "unit@example.invalid" }))
      .retryable,
    true,
  );
});

test("signed buyer webhook keeps access granted on tag failure and succeeds on retry", async () => {
  const grants = new Map();
  let failTag = true;
  let tagAttempts = 0;
  const mailchimp = load("lib/mailchimp.ts", {}, async (url) => {
    if (url.endsWith("/tags")) {
      tagAttempts++;
      assert.equal(
        grants.size,
        1,
        "access must be granted before email delivery",
      );
      return new Response(null, { status: failTag ? 503 : 204 });
    }
    return new Response("{}", { status: 200 });
  });
  const route = load("app/api/stripe/webhook/route.ts", {
    "@/lib/mailchimp": mailchimp,
    "@/lib/supabase/admin": {
      createAdminClient: () => ({
        from: () => ({
          upsert: async (row, opts) => {
            assert.equal(opts.onConflict, "user_id,product");
            grants.set(`${row.user_id}:${row.product}`, row);
            return { error: null };
          },
        }),
      }),
    },
    "@/lib/stripe/identify": {
      classifyCheckoutSession: (session) => ({
        ours: session.metadata.app === "bouncing-forward",
        reason: "foreign",
      }),
      livemodeMatchesConfiguration: () => true,
      lookUpPriceIds: async () => [],
    },
  });
  function signed(app = "bouncing-forward") {
    const payload = JSON.stringify({
      id: "evt_unit",
      type: "checkout.session.completed",
      livemode: false,
      data: {
        object: {
          id: "cs_test_unit",
          payment_status: "paid",
          customer_email: "unit@example.invalid",
          metadata: { app, product: "premium", supabase_user_id: "unit-user" },
        },
      },
    });
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac("sha256", env.STRIPE_WEBHOOK_SECRET)
      .update(`${timestamp}.${payload}`)
      .digest("hex");
    return new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body: payload,
      headers: { "stripe-signature": `t=${timestamp},v1=${signature}` },
    });
  }
  assert.equal((await route.POST(signed())).status, 500);
  assert.equal(grants.size, 1);
  failTag = false;
  assert.equal((await route.POST(signed())).status, 200);
  assert.equal(grants.size, 1);
  assert.equal(tagAttempts, 2);
  assert.equal((await route.POST(signed("other-site"))).status, 200);
  assert.equal(tagAttempts, 2);
  assert.equal((await route.POST(request({}))).status, 400);
});
