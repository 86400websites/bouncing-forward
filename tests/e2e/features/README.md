# Feature specs — Launch Gate Phase 2 conventions

Source of truth: `docs/FEATURE-LIST.md` (draft v3, **approved by the owner on
10 September 2026**). Every approved line has exactly one `test()` here.
Nothing in this folder may weaken, bypass or skip a check that the approved
line asks for; a changed line goes back to the owner first.

## Naming and layout

- One `test()` per approved line. The title starts with the ID and states the
  line in plain English: `test("PG-003 a wrong URL shows the site's own 404 page", { tag: ["@PG-003", "@pages"] }, …)`.
- Tags (Playwright `tag` option): `@<ID>` and `@<section>` (`@pages`,
  `@accounts`, `@forms`, `@payments`, `@protection`, `@integrations`,
  `@manual`). Add `@desktop-only` to any test that writes anywhere (accounts,
  forms, payments, protection probes) or is expensive; the `mobile-390`
  project runs everything **not** tagged `@desktop-only`. `@morning` is added
  only after the owner approves the morning-check selection (Phase 5).
- Folders follow the list's sections: `pages/`, `accounts/`, `forms/`,
  `payments/`, `protection/`, `integrations/`, `manual/`. An ID may live in
  another section's file only when a hard ordering dependency requires it
  (FM-010 follows the purchase in `payments/`; PR-003 follows FM-002 in
  `forms/`) — say so in the file header comment.
- `--grep @PY-001` re-runs one line; `pnpm test:e2e:failed` re-runs failures.
- Two non-spec modules sit beside the specs: `pages/inventory.ts` (the
  public page, post, redirect and sitemap inventory with the exact copy) and
  `payments/shared.ts` (Preview preconditions, the throwaway non-owner,
  checkout start, session-bound request contexts). `manual/manual.spec.ts`
  registers every MANUAL line with its human steps.

## Imports and roles

- Always `import { test, expect } from "../../harness/fixtures";` — never
  `@playwright/test` directly. The fixtures resolve and verify the target,
  hand the bypass secret to the verified Preview origin only, collect console
  errors, and refuse non-`@morning` specs on Production.
- Roles: `test.use({ storageState: statePath("free") })` (or `"premium"`)
  from `../../harness/auth`. A visitor is the default, empty context. Every
  protected boundary asserts **both** the allowed and the denied state.
- Direct HTTP: the `api` fixture (same-origin paths only). Never build an
  absolute URL to any host from a spec; never send a request to a Production
  host.

## What a spec may and may not do

- **Env gating fails loudly.** A test that needs a harness variable which is
  absent must FAIL with a plain message naming the variable — never skip.
  `test.skip(condition, "N/A per approved <ID>: …")` is allowed only for the
  conditions the approved line itself names (e.g. FM-004 on a Preview whose
  Mailchimp keys are configured).
- **Shared services** (Mailchimp audience, Formspree form, legacy access
  codes are shared with Production by owner decision): one write per run per
  approved identity, identities only from `harness/identities.ts`, every write
  registered with `recordFixture()` so the `cleanup` project archives it and
  the run record shows it. Never a high-volume probe against them.
- **TEST-only writes**: throwaway accounts come from
  `harness/test-supabase.ts`, which refuses any project but TEST, and are
  registered for cleanup. Never touch Production data; never use the fixture
  accounts for a purchase (an owned product is not a new checkout).
- **Secrets**: never print, log or interpolate a credential, code, key or
  token into a title, assertion message, URL or annotation. Use the harness
  helpers that withhold values. Error text can end up in the JSON report.
- **Copy**: assert the exact strings the components render (they are the
  approved copy). If the feature-list wording differs from the component,
  assert the component's string and add an annotation `{ type: "note" }`
  describing the difference — do not rewrite either.
- **Waits**: bounded (`expect.poll`, explicit timeouts); no retries; never
  `networkidle` on a Vercel Preview (the toolbar keeps a socket open) — use
  `waitForLoadState("load")` plus a short settle as the smoke test does.
- **Selectors**: `getByRole` / `getByLabel` / `getByText` first; `data-testid`
  only for the hooks listed below, added in this sprint as behaviour-neutral
  attributes.
- **Manual lines** (`MN-*`, and lines marked MANUAL): registered in
  `manual/manual.spec.ts` with `annotation: [{ type: "manual", description: <exact human steps> }]`
  and `test.skip(true, "MANUAL — human evidence required")`, so the report
  lists them beside the automated results.
- **Expected failures** (PR-001, PR-002, PR-004: no rate limit exists yet)
  stay real assertions that FAIL today; they are reported as Blockers, never
  marked `test.fail()`.

## data-testid hooks added in this sprint

One hook, one component. Requests were deduplicated against the accessible
locators the forms already expose (`#auth-email`, `#current-password`,
`getByRole("button")`, the approved copy strings); a hook was added only
where none exists. The login error text is supplied by Supabase, not by the
site, so no `getByText` string is stable for it, and a `<p aria-live="polite">`
computes to no `status` role for `getByRole`.

- `src/components/auth/auth-form.tsx` → the `AuthForm` error paragraph (the
  first `<p aria-live="polite">` under the submit button on the Log in and
  Create account pages; empty and `sr-only` until a login or sign-up error is
  set, `text-red-600` once it is) → `data-testid="auth-error"` (PR-001). It
  is always in the DOM: assert its text, never its presence. The
  `ForgotPasswordForm` and `ResetPasswordForm` error paragraphs carry no hook
  (not requested).
