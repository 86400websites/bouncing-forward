import type { APIResponse } from "@playwright/test";
import { test, expect } from "../../harness/fixtures";
import { expectFriendlyJson } from "../../harness/pages";
import { signedWebhookRequest } from "../../harness/stripe";

/**
 * Section E — PR-006: forcing errors on every endpoint returns a friendly
 * message, never internals. Three probes with a JSON body of `null` are
 * expected to FAIL today (unhandled TypeError → 500) and are kept as real
 * assertions.
 */

const UPSTREAM =
  /api\.stripe\.com|resource_missing|No such checkout|mailchimp\.com|supabase\.co|gotrue|ECONNREFUSED/i;
const JSON_HEADERS = { "content-type": "application/json" };
const DENIED =
  "Please log in to your account to download — or use the access code from your confirmation email.";
const CODE_WRONG =
  "That code doesn’t match. Check your confirmation email — the code works on any device, any time.";
const CODES_OFF =
  "Access codes aren’t switched on yet — please try again soon.";
const ACCOUNTS_OFF = "Accounts aren’t switched on yet — please try again soon.";

async function friendly(
  res: APIResponse,
  opts: Parameters<typeof expectFriendlyJson>[1],
) {
  const body = await expectFriendlyJson(res, opts);
  expect(
    await res.text(),
    `${opts.label ?? ""} carries an upstream body`,
  ).not.toMatch(UPSTREAM);
  return body;
}

test(
  "PR-006 forcing errors on every endpoint returns a friendly message, never internals",
  { tag: ["@PR-006", "@protection", "@desktop-only"] },
  async ({ api, target }, testInfo) => {
    test.setTimeout(90_000);
    await test.step("POST /api/newsletter", async () => {
      await friendly(
        await api.post("/api/newsletter", {
          data: "{bad",
          headers: JSON_HEADERS,
        }),
        {
          status: 400,
          // Either short refusal is fine: the parse guard, or the email
          // check when the body parses to something that is not an object.
          message: ["Invalid request.", "Please enter a valid email address."],
          label: "newsletter bad JSON",
        },
      );
      await friendly(await api.post("/api/newsletter", { data: {} }), {
        status: 400,
        message: "Please enter a valid email address.",
        label: "newsletter missing email",
      });
      await friendly(
        await api.post("/api/newsletter", { data: { email: 123 } }),
        {
          status: 400,
          message: "Please enter a valid email address.",
          label: "newsletter wrong type",
        },
      );
      await friendly(
        await api.post("/api/newsletter", {
          data: "null",
          headers: JSON_HEADERS,
        }),
        {
          status: 400,
          message: "Invalid request.",
          label: "newsletter null body",
        },
      );
    });
    await test.step("POST /api/premium", async () => {
      await friendly(
        await api.post("/api/premium", { data: "{bad", headers: JSON_HEADERS }),
        { status: 400, message: "Invalid request.", label: "premium bad JSON" },
      );
      const empty = await api.post("/api/premium", { data: {} });
      if (empty.status() === 503)
        testInfo.annotations.push({
          type: "note",
          description:
            "PREMIUM_ACCESS_CODES is not configured on this deployment; the 503 message is friendly but the 401 branch was not exercised.",
        });
      await friendly(empty, {
        status: [401, 503],
        message: [CODE_WRONG, CODES_OFF],
        label: "premium empty body",
      });
      await friendly(
        await api.post("/api/premium", { data: { code: 12345 } }),
        {
          status: [401, 503],
          message: [CODE_WRONG, CODES_OFF],
          label: "premium wrong type",
        },
      );
      await friendly(
        await api.post("/api/premium", { data: "null", headers: JSON_HEADERS }),
        {
          status: 400,
          message: "Invalid request.",
          label: "premium null body",
        },
      );
    });
    await test.step("POST /api/checkout (visitor)", async () => {
      for (const [label, options] of [
        ["no body", {}],
        ["bad JSON", { data: "{bad", headers: JSON_HEADERS }],
      ] as const) {
        const res = await api.post("/api/checkout", options);
        if (res.status() === 503)
          testInfo.annotations.push({
            type: "note",
            description:
              "Accounts are not configured on this deployment; /api/checkout answered its friendly 503.",
          });
        await friendly(res, {
          status: [401, 503],
          key: "error",
          message: ["Not signed in.", ACCOUNTS_OFF],
          label: `checkout ${label}`,
        });
      }
    });
    await test.step("GET /api/stripe/verify", async () => {
      await friendly(await api.get("/api/stripe/verify"), {
        status: 400,
        message: "Invalid session reference.",
        label: "verify no id",
      });
      await friendly(
        await api.get("/api/stripe/verify?session_id=not-a-session"),
        {
          status: 400,
          message: "Invalid session reference.",
          label: "verify malformed id",
        },
      );
      const missing = await api.get(
        "/api/stripe/verify?session_id=cs_test_bfE2eDoesNotExist000",
      );
      const body = await friendly(missing, {
        status: [400, 502, 503],
        message: [
          "We couldn’t confirm that payment.",
          "We couldn’t reach the payment service — your access code will arrive by email.",
          "Payment confirmation isn’t switched on yet — your access code will arrive by email.",
        ],
        label: "verify unknown id",
      });
      expect(body).not.toHaveProperty("code");
    });
    await test.step("POST /api/stripe/webhook", async () => {
      await friendly(
        await api.post("/api/stripe/webhook", {
          data: "{}",
          headers: JSON_HEADERS,
        }),
        {
          status: 400,
          message: "Invalid signature.",
          label: "webhook unsigned",
        },
      );
      await friendly(
        await api.post("/api/stripe/webhook", {
          data: "{bad",
          headers: { ...JSON_HEADERS, "stripe-signature": "t=abc,v1=nothex" },
        }),
        {
          status: 400,
          message: "Invalid signature.",
          label: "webhook malformed signature",
        },
      );
      await friendly(
        await api.post(
          "/api/stripe/webhook",
          signedWebhookRequest(target, "{bad"),
        ),
        {
          status: 400,
          message: "Invalid payload.",
          label: "webhook signed non-JSON",
        },
      );
      const signedNull = await api.post(
        "/api/stripe/webhook",
        signedWebhookRequest(target, "null"),
      );
      expect(
        signedNull.status(),
        "a signed null payload must not crash the webhook",
      ).toBeLessThan(500);
      expect(await signedNull.text()).not.toMatch(
        /stack|node_modules|TypeError|<html/i,
      );
    });
    await test.step("GET /api/premium/download", async () => {
      await friendly(await api.get("/api/premium/download"), {
        status: 404,
        message: "Unknown file.",
        label: "download no file",
      });
      await friendly(
        await api.get("/api/premium/download?file=../../package.json"),
        { status: 404, message: "Unknown file.", label: "download traversal" },
      );
      await friendly(await api.get("/api/premium/download?file=book&code="), {
        status: 401,
        message: DENIED,
        label: "download empty code",
      });
      await friendly(
        await api.get(
          "/api/premium/download?file=book&code=bf-e2e-not-a-real-code",
        ),
        { status: 401, message: DENIED, label: "download wrong code" },
      );
    });
    await test.step("GET /auth/confirm", async () => {
      const cases: [string, string][] = [
        ["/auth/confirm", "/login?error=confirmation_failed"],
        [
          "/auth/confirm?code=bf-e2e-garbage",
          "/login?error=confirmation_failed",
        ],
        [
          "/auth/confirm?type=bogus&token_hash=x",
          "/login?error=confirmation_failed",
        ],
        [
          "/auth/confirm?token_hash=bf-e2e-garbage&type=recovery",
          "/forgot-password?error=link",
        ],
        [
          "/auth/confirm?token_hash=bf-e2e-garbage&type=recovery&next=%2F%2Fevil.example",
          "/forgot-password?error=link",
        ],
      ];
      for (const [path, expected] of cases) {
        const res = await api.get(path);
        expect(res.status(), path).toBe(307);
        const to = new URL(
          res.headers()["location"] ?? "",
          `${target.origin}/`,
        );
        expect(to.origin, path).toBe(target.origin);
        expect(to.pathname + to.search, path).toBe(expected);
        expect(await res.text()).not.toMatch(UPSTREAM);
      }
    });
    await test.step("wrong methods", async () => {
      const probes = [
        ["get", "/api/newsletter"],
        ["get", "/api/premium"],
        ["get", "/api/checkout"],
        ["get", "/api/stripe/webhook"],
        ["post", "/api/stripe/verify"],
        ["post", "/api/premium/download"],
      ] as const;
      for (const [method, path] of probes) {
        const res =
          method === "get"
            ? await api.get(path)
            : await api.post(path, { data: {} });
        expect(res.status(), `${method.toUpperCase()} ${path}`).toBe(405);
        const text = await res.text();
        expect(text.length, `${path}: 405 body`).toBeLessThanOrEqual(100);
        expect(text).not.toMatch(/stack|node_modules|TypeError|<html/i);
      }
    });
  },
);
