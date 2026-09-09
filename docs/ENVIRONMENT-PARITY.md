# ENVIRONMENT-PARITY.md — Safe Preview Testing That Reflects Production

Installed for Bouncing Forward on 7 September 2026. Fill only what the project uses.
This document owns environment assignments, differences and proof records. `TECH-ARCHITECTURE.md`
owns the chosen stack and variable names; `PROJECT-STATUS.md` owns progress and decisions.
The existing workflow, secret-handling rules and production access restrictions still apply.

## 0. In plain English — for the owner

**Keep test activity away from customers, while making the test site behave like the live site.**
The code should match; databases, payment modes and delivery destinations should be safely separated.
A dashboard setting is **configured**. A dated check showing the expected result is **verified**.
A green Preview reduces risk; the launch-day checks still matter.

For a simple site, check its pages, forms and destinations. Add database, login and payment checks only
when those features exist. Do not create extra services just to fill this template.

**Existing working sites:** keep their architecture and environments. Inventory and verify them first;
fix demonstrated gaps through normal focused PRs. This file does not require rebuilding a site.

## 1. The two rules

1. **Isolation:** Local/Preview tests must not access customer data, write to production databases,
   charge real money, or send messages to customers.
2. **Fidelity:** use the candidate code and the same relevant schema, access rules, feature settings
   and provider contracts. Record intentional differences and how each will be checked.

A configured split is not permission to run an unrestricted test suite. First verify the target,
then run bounded proof checks, then the full suite (§12).

### 1.1 Evidence vocabulary

| State                 | Meaning                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------- |
| Not Started / Pending | Required work or proof has not happened; name the owning sprint                         |
| Configured            | Settings inspected; behavior not yet demonstrated                                       |
| PASS / Verified       | Dated evidence demonstrates this specific claim                                         |
| FAIL                  | Observed mismatch; record the smallest fix                                              |
| Blocked               | A named prerequisite prevents the check                                                 |
| PARTIAL               | Some evidence is missing; not PASS                                                      |
| Stale                 | Relevant code or configuration changed after the proof                                  |
| N/A                   | Feature/control does not apply, with a reason; never disguises a missing required check |

Accepted risks live in `PROJECT-STATUS.md`, with an owner and compensating control. They cannot
waive the system's production database, payment, secret-handling or merge-blocking boundaries.

### 1.2 Never a secret value

Follow `ENV-VARS-SAFETY.md`. Record variable names, value classes (such as “TEST database URL”),
public hosts/project refs and redacted evidence. Never record keys, passwords, private connection
strings, session tokens or URLs containing bypass/reset tokens. Agents do not open live env files.
Owners enter values directly in approved local/host/CI secret stores.

## 2. Scope and companion rules

| Concern                                         | Existing authority                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| Secrets, environment changes and redeployment   | `ENV-VARS-SAFETY.md`                                                                  |
| Selected stack, variable names and integrations | `TECH-ARCHITECTURE.md` §§2, 6–7                                                       |
| Vercel/Supabase setup, when selected            | `SUPABASE-VERCEL-SETUP.md`                                                            |
| Agent access to databases                       | `SUPABASE-MCP-SAFETY.md`                                                              |
| Migration delivery and recovery                 | `WORKFLOW.md`; `templates/SUPABASE-CHANGE-TEMPLATE.md`                                |
| Security and allowed/denied states              | `SECURITY-CHECKLIST.md`; `QA-CHECKLIST.md`                                            |
| Full-suite and daily testing                    | `testing-setup/TESTING-GUIDE.md`; `testing-setup/templates/MORNING-CHECK-TEMPLATE.md` |

**Project scope:** Supabase database/auth and purchase entitlements; Stripe checkout/webhooks;
Mailchimp newsletter forms and purchase-triggered tags/journeys; public and gated content.
Inventory source: application code and existing project records, inspected 7 September 2026.
No provider dashboard, credential provenance, deployed Preview or database schema was verified in
this preparation. All applicable external proofs remain Pending for the testing setup operator.
Mark unused rows/sections N/A with reasons; retain section and proof IDs so references remain useful.
Do not fill future release/merge evidence at setup: leave it Pending with the owning stage.

## 3. Infrastructure facts — actual and intended

Record facts from approved configuration evidence; do not assume a service is already configured.

| Fact                                               | Current state / evidence date                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project and approved architecture                  | Bouncing Forward; `TECH-ARCHITECTURE.md`; Next.js 15 / React 19 / TypeScript / pnpm 10.34.5 from `package.json`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Actual production origin                           | `https://www.bouncing-forward.com` (canonical; sitemap/robots emit it). 9 September 2026 read-only GETs: `www` HTTP 200, served by Vercel (`x-vercel-id`), headers present — HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy; no CSP (documented decision). `bouncing-forward.com` → 308 → `www`. `bouncing-forward.vercel.app` still answers 200 directly (duplicate host; harness treats all three as Production). Public bundle compiled against PROD Supabase `ilnoazendkckzhbuzias` (P1 public half, Production)                                          |
| Intended domain and canonical host                 | `bouncing-forward.com` per architecture. 8 September 2026 read-only GET: answers a registrar parking page, not Vercel — domain not yet connected; launch-day item                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Hosting project and production branch              | Vercel / project identity Pending (owner supplies `VERCEL_PROJECT_ID` to the harness secret store); `main` per existing workflow                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Preview hosts and protection                       | Pending. No Preview exists yet for `codex/testing-readiness` (publication authorised 9 Sep 2026; PR to follow). The harness preflight (`tests/e2e/harness/preflight.setup.ts`) verifies environment, commit, project and TEST/test-mode wiring through the deployment's own read-only `/api/health` route; the Vercel API (`VERCEL_TOKEN` + `VERCEL_PROJECT_ID`) is an optional extra cross-check. It records the protection state and sends `VERCEL_AUTOMATION_BYPASS_SECRET` only when the origin actually answers 401/403, only to that origin, once, via Vercel's cookie hand-off — never across redirects |
| Database/auth TEST and PROD                        | TEST `hmcojplrqoqhyigvtgyp`; PROD `ilnoazendkckzhbuzias` per `SUPABASE-MCP-SAFETY.md`; current wiring/schema proofs Pending                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Payment testing environment and live account       | Stripe; live selling recorded in project status; test mode, prices and credential provenance Pending                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Sandbox/live webhook destinations and API versions | Handler `/api/stripe/webhook` on a Stripe account **shared with Unretire**. Live endpoint changed by the owner to `https://www.bouncing-forward.com/api/stripe/webhook` (9 Sep 2026); read-only GET: `www` route answers 405 (handler reached), the apex answers 308 — a redirect Stripe does not follow, which explains failed deliveries. Saved settings, subscribed events and delivery evidence Pending (owner, MN-007). Sandbox endpoint for the Preview Pending (created after the Preview exists)                                                                                                       |
| Email, forms, storage and other write destinations | Mailchimp (`/api/newsletter`, purchase webhook), Formspree (contact form, browser → public endpoint, compiled into the live page) and legacy access codes are **shared between Preview and Production by owner decision (9 Sep 2026)** — recorded as non-isolated (§9): controlled test identities/inboxes, one labelled message per run, cleanup recorded, no automated high-volume tests. Auth email delivery: Supabase TEST project (own SMTP/limits) — inspect separately (P3/P9)                                                                                                                          |
| Shared provider account used by other sites?       | Pending; preserve other sites' resources                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Stable callback URL, if needed                     | Pending; use candidate Preview or verified alias at the same candidate SHA (§7.11)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

Never delete or reconfigure another site's products, webhooks, audiences or resources on a shared account.

## 4. Environment matrix — names and classes only

Inventory environment reads in application code, build/framework configuration, hosting overrides and
CI/test configuration. Match application names to `TECH-ARCHITECTURE.md` §6. These rows are examples,
not required variables; use the project's actual names.

| Name / purpose                                     | Visibility           | Local                                                  | Preview                                                | Production                  |
| -------------------------------------------------- | -------------------- | ------------------------------------------------------ | ------------------------------------------------------ | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                         | Public               | TEST URL                                               | TEST URL                                               | PROD URL                    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`             | Public/publishable   | TEST key                                               | TEST key                                               | PROD key                    |
| `SUPABASE_SECRET_KEY`                              | Server-only          | TEST secret                                            | TEST secret                                            | PROD secret                 |
| `STRIPE_SECRET_KEY`                                | Server-only          | Test mode                                              | Test mode                                              | Live mode                   |
| `STRIPE_WEBHOOK_SECRET`                            | Server-only          | Local listener secret                                  | Sandbox endpoint secret                                | Live endpoint secret        |
| `STRIPE_PRICE_PREMIUM`                             | Server configuration | Test price ID                                          | Test price ID                                          | Live price ID               |
| `MAILCHIMP_API_KEY`                                | Server-only          | Shared live credential (owner decision 9 Sep 2026, §9) | Shared live credential (owner decision 9 Sep 2026, §9) | Live credential             |
| `MAILCHIMP_AUDIENCE_ID`, `MAILCHIMP_SERVER_PREFIX` | Server configuration | Shared live audience/server (owner decision, §9)       | Shared live audience/server (owner decision, §9)       | Live audience/server        |
| `NEXT_PUBLIC_SITE_URL`                             | Public               | Local origin                                           | Validated Preview origin or proven fallback            | Canonical production origin |
| `PREMIUM_ACCESS_CODES`                             | Server-only          | Shared live codes (owner decision, §9)                 | Shared live codes (owner decision, §9)                 | Live legacy codes           |

These are intended assignments from code, not verified dashboard values. Current scopes, branch
overrides, key provenance and behavior are Pending. No separate form provider was observed in the
newsletter handler: its destination is Mailchimp. Inventory other routes before declaring it complete.
`PLAYWRIGHT_BASE_URL` is the planned harness target; runner configuration and secret names remain to
be established during Phase 0. Keep harness credentials separate from application variables.

Database URL and keys must belong to the same project. Test/live payment keys, prices and signing
secrets must belong to their matching mode and endpoint. Match price currency, amount and recurring
vs one-time shape; IDs differ by design.

**Site URL:** never require it to be unset universally. Inspect its callers. Leaving it unset in Preview
is safe only when all relevant paths have a verified Preview-aware fallback. Validate request-derived
origins against trusted hosts; never trust arbitrary `Host`/`X-Forwarded-Host` headers. Auth and checkout
must return to the correct environment. Record the intended Preview metadata/noindex policy separately.

**Harness inventory:** list CI fixture/bypass secret names separately with their actual storage locations.
Use only the storage required by the provider; no server secret becomes public. A names-only listing
proves scopes, not that a value belongs to TEST — the owner checks provenance and §12 checks behavior.

Harness variables (installed 8 September 2026; full table in `tests/e2e/README.md`):

| Name                                                              | Class                   | Storage                                    | Guard in the harness                                                                          |
| ----------------------------------------------------------------- | ----------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `PLAYWRIGHT_TARGET`, `PLAYWRIGHT_BASE_URL`                        | Run configuration       | Shell / workflow input                     | Required; `local` \| `preview` \| `production-morning`; origin only                           |
| `PLAYWRIGHT_EXPECTED_SHA`                                         | Run configuration       | Shell / workflow input                     | Required for `preview`; must equal the deployment's commit                                    |
| `VERCEL_TOKEN`, `VERCEL_PROJECT_ID` (+ optional `VERCEL_TEAM_ID`) | Harness secret / config | `.env.e2e.local` / GitHub Actions secrets  | Optional extra cross-check through Vercel's API; set both or neither; forbidden on Production |
| `VERCEL_AUTOMATION_BYPASS_SECRET`                                 | Harness secret          | Vercel Preview env + GitHub Actions secret | Sent only to the verified Preview origin; forbidden on Production                             |
| `E2E_FREE_USER_EMAIL` / `E2E_FREE_USER_PASSWORD`                  | TEST fixture            | GitHub Actions secrets / shell             | Auth setup fails closed without them; forbidden on Production                                 |
| `E2E_PREMIUM_USER_EMAIL` / `E2E_PREMIUM_USER_PASSWORD`            | TEST fixture            | GitHub Actions secrets / shell             | As above                                                                                      |
| `E2E_SUPABASE_URL` / `E2E_SUPABASE_SECRET_KEY`                    | TEST privileged read    | GitHub Actions secrets / shell             | Refused unless the host is `hmcojplrqoqhyigvtgyp.supabase.co`; refused on Production          |
| `MORNING_TEST_EMAIL` / `MORNING_TEST_PASSWORD`, `PRODUCTION_URL`  | Morning check           | GitHub Actions secrets / variable          | Only variables allowed in `production-morning`; workflow disabled                             |

Added 9 September 2026: `E2E_STRIPE_SECRET_KEY` (refused unless a test-mode prefix), `E2E_STRIPE_WEBHOOK_SECRET`
(the Preview's sandbox endpoint secret, for synthetic signed events) and `E2E_LEGACY_ACCESS_CODE` (a shared code,
never printed) — all forbidden on Production. An approved local runner may keep harness variables in a gitignored
`.env.e2e.local` read by `playwright.config.ts`; the application's env files are never read.

Application variables are never read by the harness. The legacy-code lines use `E2E_LEGACY_ACCESS_CODE` (one of the
shared codes, owner decision) unless the owner adds a dedicated test code to the Preview list; it is never printed.

**Per dependency status (8 September 2026):** Supabase Pending (P1/P2/P3/P8/P8b/P9/P11/P12; P1a spec
ready, needs a verified Preview); Stripe Pending (P4/P5/P6/P11/P12); Mailchimp/auth delivery Pending
(P7/P9/P11/P12; contact form is C9 — see §5); Vercel candidate/protection Pending (preflight ready;
no candidate Preview yet; Production half of P10 observed read-only). Testing setup operator owns the
next checks. P13 remains an owner launch check. Reuse existing valid evidence when available; do not
infer PASS from this inventory or from the earlier status note.

## 5. Findings — only when observed

Typical failures: Preview points to live data; a required integration is absent; production canonical
URLs point to localhost; an endpoint is hardcoded to a live destination; callback code is stale.
These are inspection prompts, not claims that the current project has these bugs.

Record a verified issue using `AGENTS.md` severities: **Blocking** or **Should-fix**, with location,
failure scenario, minimal fix and evidence. Track configured and behavior-verified completion separately.
Inventory latent writes too: adding a missing secret may enable a previously inactive live write.

Observed by code inspection on 8 September 2026 (behaviour not yet exercised on a Preview; each has a
feature-list line or cross-check entry in `docs/FEATURE-LIST.md`):

- **Should-fix · `src/app/auth/confirm/route.ts:16`** — the `next` return path is accepted when it merely
  starts with `/`, so `//evil.example` (and backslash variants) resolves off-site after a successful
  confirmation. Minimal fix: require a single leading `/` followed by a non-slash, non-backslash character.
- **Should-fix · `src/app/auth/actions.ts:17`, `src/app/api/checkout/route.ts:28`** — auth-email and
  checkout return origins are derived from `x-forwarded-host` / `host` / `Origin` without an allow-list
  (§4 “Site URL” rule). Preview-aware fallback exists; validate against the known Preview/Production hosts.
- **Should-fix (launch-blocking per `SECURITY-CHECKLIST.md` §5) · `src/app/api/newsletter/route.ts`,
  `src/app/api/premium/route.ts`, auth actions** — no rate limit and no server-verified bot check exist;
  honeypots only. Already an open item in `PROJECT-STATUS.md` (Upstash + Turnstile).
- **C9 · `src/components/site/contact-form.tsx:16`** — the contact form posts from the browser straight to
  the endpoint in the public `NEXT_PUBLIC_FORMSPREE_ENDPOINT`. Unless the Preview build carries a separate
  test form, an automated Preview submission would deliver to the live inbox. Automated delivery tests stay
  blocked; §9 manual procedure applies.
- **Latent write · `src/app/api/stripe/webhook/route.ts`** — the webhook writes entitlements with
  `SUPABASE_SECRET_KEY` and tags the buyer in Mailchimp. Any Preview that receives Stripe events must have
  TEST database and isolated audience credentials verified (P1/P7) before P4–P6 run.

Added 9 September 2026 (code inspection plus the owner's Stripe evidence):

- **Blocking · `src/app/api/stripe/webhook/route.ts`** — the Stripe account is shared with Unretire and every
  endpoint receives every event; the handler acted on any paid `checkout.session.completed`, so a foreign
  subscription checkout could loop in retries (entitlement write for an unknown user) or tag a stranger
  `premium` in Mailchimp. **Fixed in the candidate:** `src/lib/stripe/identify.ts` accepts only one-time
  sessions that carry `metadata.app = bouncing-forward` (stamped on every new session), or legacy sessions
  whose Stripe return address is one of our hosts, or very old account sessions with the original metadata
  shape; everything else is acknowledged as ignored; live/test mode is checked against the configured key.
  Old Payment-Link sessions (no return address on the session) are recognised by the price they bought.
  The legacy `/api/stripe/verify` route applies the same rule. To be proven on the Preview by PY-012/PY-013
  (Pending until a candidate deployment exists).
- The two 8 September findings (`next` return path; header-derived origins) are **fixed in the candidate**
  (`src/app/auth/confirm/route.ts`, `src/lib/request-origin.ts`) and remain Pending until proven on the Preview.
- **C9 update:** the contact form stays on the shared live Formspree form by owner decision. Automated
  submission is limited to one clearly labelled test message per run from a controlled identity, with the
  owner deleting it afterwards (FEATURE-LIST FM-008 / MN-003).
- **Deployment identity without a hosting token (9 Sep 2026):** `src/app/api/health/route.ts` is a read-only route
  returning the facts Vercel injects at build time (environment, commit, branch, deployment id, production address)
  plus identifiers only — the Supabase project ref of the public client, the project ref of the privileged key
  (legacy JWT keys name their project; opaque keys report "opaque"), and whether the Stripe key is live or test,
  plus configured/not-configured flags. No value is ever returned. The preflight refuses a Preview that reports
  production, another commit, another project, a non-TEST database on either client, or a live Stripe key. This
  automates the target half of P1, P4 and P12; `VERCEL_TOKEN`/`VERCEL_PROJECT_ID` became an optional cross-check.

## 6. Setup sequence — safe order

Owners manage real values. Agents prepare names, instructions and verification without reading secrets.

### Phase A — Establish isolated data destinations

- [ ] Identify existing TEST/PROD resources, or create only the required missing TEST resources.
- [ ] Prepare the test schema from reviewed migrations (§7.1); use synthetic data only.
- [ ] Scope database/auth entries correctly; remove live credentials from Local/Preview.
- [ ] Redeploy affected Previews. Complete §12 preflight and P1 before enabling privileged callbacks.

### Phase B — Payments, if used

- [ ] Use the provider's supported sandbox/test mode. Mirror the used prices, coupons and payment methods.
- [ ] Point sandbox webhooks at the candidate deployment (§7.11), with matching event/API contracts.
- [ ] Set test-mode credentials and endpoint-specific signing secrets only after database isolation is verified.
- [ ] Keep live endpoints on Production. Do not create real-card transactions for testing (§8 C1).

### Phase C — Email, forms and other writes

- [ ] Configure test audiences/inboxes/endpoints/storage and required fields/tags. Check secondary effects:
      CRM writes, notifications, automations and billing. A shared account does not make a shared key harmless.
- [ ] If a dependency cannot be isolated, use the restricted manual procedure in §9; automated writes stay blocked.

### Phase D — URLs and access

- [ ] Set environment origins according to their actual callers (§4), and auth settings per §7.6.
- [ ] Where Preview protection is enabled, configure the sanctioned bypass; retain application authentication.
- [ ] Record platform and CI secret locations by name; avoid placing secrets in URLs except where the
      provider requires it, and redact those URLs from all evidence.

### Phase E — Verify what exists

- [ ] Redeploy after environment changes; earlier deployments retain earlier settings.
- [ ] Run the applicable bounded proofs in §12. Setup can finish with future feature proofs Pending;
      their implementing sprint must complete them before testing that feature or enabling its writes.

## 7. Fidelity — keep the useful behavior equivalent

### 7.1 Schema source: migrations first

For new projects, use reviewed versioned migrations as the baseline. For existing projects, compare
those migrations with the actual schema. Only when the baseline is missing or has drifted, capture a
schema-only definition through an authorized read-only channel. Production MCP stays disconnected
unless its existing exception procedure is satisfied; the owner can supply redacted schema evidence.

Inspect captured SQL for embedded secrets, personal data and environment-specific URLs before committing.
Record it as an existing baseline under the selected migration tool's procedure; do not blindly replay
it on Production or generate a destructive down-file to drop existing production tables. Apply only to
TEST with required authorization. Never copy customer rows or auth password hashes to seed a test project.

### 7.2 Schema and access contracts

Compare columns, nullability, keys, constraints, indexes, grants, RLS, policies and relationships the
actual code depends on. A unique `(user, product)` constraint is required only if that application's
upsert depends on it; tier inheritance and cancellation rules come from approved requirements.
Test both authorized access and denial, including cross-user reads/writes.

### 7.3 Existing hand-run SQL

Compare it with the recorded production baseline before adopting it as a migration. Preserve observed
behavior; findings that require a schema change get their own reviewed migration. Do not silently add
indexes, change policies or rewrite existing migration history during documentation work.

### 7.4 Hidden database behavior

Compare triggers, functions, extensions, storage policies and jobs. Check external side effects before
running captured definitions in TEST: a database trigger may still call a live service.

### 7.5 Auth settings

Record both environments for confirmation requirements, enabled sign-in methods, password rules,
session/refresh expiry, email templates, SMTP, captcha and rate limits. Match relevant behavior;
document unavoidable differences and compensating checks. Unknown settings are PARTIAL, not PASS.
Screenshots must be checked for credentials, SMTP secrets, tokens and personal data before sharing.

### 7.6 Auth origins and redirects

| Setting           | TEST                                                               | PROD                                    |
| ----------------- | ------------------------------------------------------------------ | --------------------------------------- |
| Site URL          | Stable test origin; localhost only for an intentionally local flow | Actual canonical production origin      |
| Allowed callbacks | Localhost and narrowly scoped project Preview hosts/paths          | Exact approved production callback URLs |
| Excluded          | Production hosts                                                   | Localhost and Preview hosts             |

Verify delivered signup/reset links resolve to a working page in the intended environment. A correct
host with a 404 is only partial evidence. Preserve an old controlled callback temporarily only when
needed for existing links; record when it will be removed. Recheck after a domain move.
Supabase supports scoped Preview wildcards and recommends exact production paths; see its
[redirect URL guidance](https://supabase.com/docs/guides/auth/redirect-urls).

### 7.7 Application redirect safety

The provider allow-list does not validate the application's own `next`/return path. Validate parsed
origins and allowed paths, including `//evil.example`, backslashes and encoded variants. Exercise
negative cases on TEST. Environment-independent bugs can and should be caught by focused tests.

### 7.8 Email/form contracts

Read the provider's actual field identifiers, types, tags and automation triggers; compare them with
payloads the code sends. A settings screenshot proves configuration, not delivery. Verify each used
field and final destination with a controlled test, including error handling when delivery fails.

### 7.9 Fixtures

Create TEST fixtures through supported provider/admin APIs or the approved seed mechanism. Include
only actual roles/states: anonymous, signed-in without permission, authorized, revoked/expired and
other relevant edge cases. Establish at least one paid state through sandbox checkout when used.
Use owner-controlled test inboxes for anything that sends mail. Passwords stay in secret stores;
record fixture labels and cleanup results. Production negative controls are read-only and scoped to
those test identities, not unrelated customer records.

### 7.10 Migration parity over time

Follow the selected migration process: versioned changes with access controls and recovery plan →
TEST apply/role verification → owner approval → human Production apply. Record both environments.

Compare schema/policies before the full Launch Gate and after relevant changes. A pending reviewed
migration may intentionally make TEST ahead of Production during its PR: record the exact expected
difference, backward compatibility and deployment order. Unexpected drift blocks affected tests/release;
never require a new migration in Production merely to permit its pre-merge Preview test.

### 7.11 Webhooks must exercise the candidate commit

Use an endpoint on the candidate Preview, or a controlled stable alias that serves **the same candidate
commit**. Record and verify both the browser deployment SHA and callback deployment SHA before payment
proofs. An alias that only mirrors `main` does not test a PR's changed webhook handler.

No permanent extra branch is required. Use the host's supported deployment/alias procedure; serialize
runs that share an alias or webhook endpoint so another run cannot move it mid-test. Verify reachability
and deployment metadata, not only HTTP status. Restore any temporary endpoint assignment after the run.
Live webhook destinations stay on Production. No branch-protection or review exception is introduced.
[Vercel documents deployment and branch URLs here](https://vercel.com/docs/deployments/generated-urls).

## 8. Intentional differences and compensating checks

Keep only applicable rows; record evidence or a named launch action for each.

| ID  | Difference / gap                | Check                                                                                                                                                                                                                                                                                  |
| --- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | Payment sandbox vs live         | Sandbox success, decline, authentication and relevant refund paths; owner verifies live configuration/readiness. Use provider-approved testing. Stripe prohibits real payment details for live-mode tests; do not mandate a real purchase/refund. Monitor genuine orders after launch. |
| C2  | Callback URL differs            | Match browser and webhook candidate commits (§7.11); verify the persisted business result.                                                                                                                                                                                             |
| C3  | Preview deployment protection   | Use a sanctioned bypass restricted to the validated origin. Verify the app receives the request and that the unbypassed response matches the configured protection. Test public Production pages without bypass.                                                                       |
| C4  | Regions/latency                 | Record representative timings and investigate failures; justify timeout budgets against expected service behavior, without hiding defects.                                                                                                                                             |
| C5  | Service plans/quotas            | Health preflight; document compute, pause, email and rate-limit differences. Do not assume every free tier behaves identically.                                                                                                                                                        |
| C6  | Domains/cookies                 | Owner verifies live-domain sign-in/out, refresh and reset at launch and after a domain move.                                                                                                                                                                                           |
| C7  | Email deliverability            | Test/capture inboxes for automated flows; owner checks real-domain delivery and spam placement at launch. Admin-generated links alone do not prove email delivery.                                                                                                                     |
| C8  | Marketing automations           | Match fields/tags and observe the relevant journey in an isolated destination; otherwise §9.                                                                                                                                                                                           |
| C9  | Hardcoded live form destination | Isolate it before automated submission, or use §9's controlled manual check; never assume only an inbox is affected.                                                                                                                                                                   |
| C10 | Bot/abuse controls              | Verify allowed and rejected states in TEST, and missing/failed-verification server paths. Owner checks live widget configuration; do not load-test Production.                                                                                                                         |
| C11 | Build-time values               | Redeploy; inspect served URLs and behavior under the recorded per-environment metadata policy.                                                                                                                                                                                         |
| C12 | Data shape/volume               | Synthetic edge-case fixtures; relevant authorized read-only production diagnostics if needed.                                                                                                                                                                                          |
| C13 | Runtime/build settings          | Match framework/runtime versions and relevant build flags; use the selected supported version from the architecture.                                                                                                                                                                   |
| C14 | Zero-cost checkout / renewals   | A 100%-off flow does not prove card charging. Exercise non-zero sandbox payments and supported simulated renewals/failed renewals; record what remains unobservable.                                                                                                                   |
| C15 | Live payment-account readiness  | Owner checks enabled charges/payouts as applicable, outstanding provider requirements, payout destination and business settings; recheck after account changes.                                                                                                                        |
| C16 | Live webhook settings           | Owner checks this site's URL, subscribed events and API version against the handler, including renewals/cancellations when used; verify alerts for failed delivery.                                                                                                                    |

Provider references: [Stripe testing](https://docs.stripe.com/testing),
[Vercel automation bypass](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).
Consult the selected provider's current documentation when implementing its configuration.

## 9. A dependency that cannot be isolated

This is a **manual exception for an email/form delivery check**, not permission for a full suite to use
live services. It never permits live database credentials, real payment tests, customer recipients or
campaign sends from Preview. Automated write tests remain blocked until an isolated destination exists.

Record the exact destination, all downstream effects, owner, test marker and cleanup procedure in
`PROJECT-STATUS.md` §8. The owner may perform a bounded delivery check using only their own inbox and
synthetic content, when already authorized. Record and complete cleanup. Mark that feature MANUAL in
the approved feature list; its result requires human evidence. Never label the dependency isolated,
never include this check in daily automation, and revisit the decision when the provider/flow changes.

## 10. Harness and evidence safety

- Keep existing local typecheck, lint, build, unit tests and safe browser QA. CI is preferred for
  credentialed end-to-end proofs; authorized local test execution may use existing secret stores
  without an agent reading or printing values. No CI-only rewrite is required.
- Resolve the candidate commit to its deployment; verify project, environment and SHA through hosting
  metadata. A hostname pattern alone does not prove Preview. Refuse unknown/live targets for full suites.
- Before any write, validate all destinations and key provenance. Use origin allow-lists and scoped
  credentials. A staging hostname is not enough if its database, email or webhook still points live.
- Send bypass headers only to the exact validated Preview origin, including direct HTTP requests.
  Do not use a context-wide secret header that leaks to third-party requests. Keep deployment protection
  separate from application auth. Vercel supports a bypass query parameter for callback senders that
  cannot set headers; the owner configures it privately and evidence must redact it.
- Disable traces, snapshots, screenshots and report attachments on secret-bearing flows unless proven
  redacted. Do not upload raw HTML reports that expose typed credentials. Keep auth state gitignored;
  publish sanitized results only. Never log process environments or reset/bypass URLs.
- Fixture writes use TEST only, with cleanup and a run record. Serialize shared accounts/aliases/resources.
  Record residual fixture data and remove it before it can affect another result.
- Missing required credentials, zero selected tests, silently omitted projects and skipped required
  assertions must fail the gate. A test that exits early because a product is already owned has not
  tested a new checkout. Never count that as a payment PASS.
- Use bounded waits and record retries/flaky outcomes; a retry must not conceal a reproducible defect.
- Preserve the owner-approved morning check: public reads plus a dedicated least-privilege production
  test-account login when needed. That login creates session/audit activity, so it is not literally
  read-only. Permit only its scoped account credentials; no bypass, service-role/payment/admin secrets,
  signup, purchase, form delivery or mutation suites. Validate its separate target and test selection.
- Failure email alone does not prove a scheduled run occurred. Verify a recent successful run and the
  notification channel; monitor missed runs where uptime is required. A no-submit form check does not
  prove delivery or payment processing; provider alerts/manual checks cover those outcomes.

## 11. What green Preview cannot guarantee

The suite proves only the scenarios it actually exercised at the recorded commit. It cannot fully prove
live credentials, domain/cookie settings, real email delivery, provider-account readiness or customer
traffic. Use the existing `LAUNCH-CHECKLIST.md` for live-domain checks, provider readiness and monitoring.

Payment assertions must verify the expected persisted business result (order/access record) and what
the user can actually access. A redirect, success banner or HTTP 200 alone is insufficient. A failed
webhook write must not be acknowledged as successful; test retry/idempotency behavior. For subscriptions,
test the approved failed-payment, renewal and cancellation policy. These are checks for possible defects,
not claims that any existing website is broken.

Live smoke checks are owner actions using controlled data and the provider's permitted procedures.
Do not manufacture live purchases as tests. Observe genuine orders and renewals through provider alerts
and recorded follow-up. The morning check covers only its selected safe paths, not every delivery/payment.

## 12. Verification — preflight, bounded proofs, then full suite

**Preflight before any external write:** confirm the candidate deployment/project/environment/SHA,
TEST database/auth assignments, sandbox payment mode, callback target, and isolated delivery destinations
that the proposed check can touch. Owner verification of key provenance is required; a names-only listing
is insufficient. If a destination is unknown, block that write. Do not “test the split” by writing blindly.

**No circular gate:** local checks and non-writing configuration probes can run first. The small,
explicitly scoped proof checks below establish safety for the full suite; they do not require that same
full suite to have passed. Setup proofs are not product acceptance tests or a substitute for the approved
feature list. Production-only checks belong to launch, not the prerequisites for a safe Preview run.

| ID  | Applicable proof                | PASS evidence                                                                                                                                                                                                                          |
| --- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | TEST wiring (database/auth)     | Runtime project provenance checked for both public and privileged clients; TEST-only fixture sign-in when auth exists, or equivalent scoped TEST read for database-only sites. Sign-in alone cannot prove the server secret's project. |
| P2  | Signup/write destination        | After preflight, a bounded synthetic signup or relevant data write lands only in TEST; authorized read-only PROD check finds no matching test identity/record.                                                                         |
| P3  | Preview auth return             | Signup/reset email resolves to the intended Preview and the page works. Redact tokens.                                                                                                                                                 |
| P4  | Payment mode                    | After preflight, sandbox checkout appears only in test mode; no matching live event.                                                                                                                                                   |
| P5  | Paid outcome                    | After P4, the expected TEST order/access record exists and the user's authorized content/action works; no corresponding PROD write. Adapt to the site's actual payment outcome.                                                        |
| P6  | Protected webhook reachability  | Request reaches the candidate handler with the sanctioned bypass; unbypassed behavior matches protection settings. Signature rejection proves reachability only; P5 proves the business effect. N/A when no protected webhook.         |
| P7  | Email/form isolation            | Bounded submission lands in the isolated destination with expected fields/tags and no live counterpart. A §9 manual exception is recorded as non-isolated with linked human evidence, never an isolation PASS.                         |
| P8  | Schema/policy parity            | Compare definitions, grants, RLS, triggers/functions and relevant settings. Only documented environment differences or the reviewed pending migration (§7.10) remain.                                                                  |
| P8b | Authorization behavior          | In TEST: the authorized user can perform approved actions; anonymous/other users cannot read or change protected data. Never attempt negative writes on PROD.                                                                          |
| P9  | Auth settings                   | Relevant rows in §7.5 are evidenced for both projects; differences have compensating checks.                                                                                                                                           |
| P10 | Hosting protection              | Preview protection matches its selected policy; public Production pages work without bypass when deployed. Production half may remain Pending until launch.                                                                            |
| P11 | Health                          | Required TEST services respond before each external test run; no unexamined pause/quota failure.                                                                                                                                       |
| P12 | Scope/provenance inspection     | Owner verifies TEST/sandbox provenance and scopes for every relevant credential/destination, including branch overrides. Names/scopes can be recorded; values cannot. Behavior is evidenced by the other applicable proofs.            |
| P13 | Production auth return (launch) | Owner checks PROD Site URL/callback settings and a reset for their own account resolves to a working live page. No automated production reset.                                                                                         |

For each applicable proof record: `[ID] · [PASS/FAIL/PENDING/N/A] · [DATE] · [CANDIDATE SHA] ·
[DEPLOYMENT/CALLBACK SHA] · [SANITIZED EVIDENCE LINK] · [OWNER/NEXT ACTION]`.
Use existing CI, Preview and project records; do not duplicate full reports here. Negative controls
match the specific test identity/event, not total production counts that legitimate users can change.
If an authorized read is unavailable, record the proof as blocked/partial rather than inventing evidence.

### Proof record — 8–9 September 2026 (Phase 0 preparation, candidate SHA pending)

Candidate: branch `codex/testing-readiness`, base `ffae77a803d8be5ccf3d13d592e7f0c0639e5cfd` (= `main`),
setup changes uncommitted; no deployment/callback SHA exists yet. Nothing below is a Preview PASS.

| ID            | State                                                | Evidence / next action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preflight     | Ready, not run on a Preview                          | Harness refuses no-target, Production hosts, hosts that are not `bouncing-forward-….vercel.app`, missing SHA, bypass on Production, PROD Supabase ref, live Stripe key, URL with query — exercised offline 8–9 Sep 2026. Identity is proven through `/api/health` (environment, commit, project, both Supabase refs, Stripe mode); the bypass is sent only to a protected origin via cookie hand-off. Local mode: preflight + SM-001 desktop + 390px + P6a passed against `next start` of this tree on 9 Sep 2026 (harness validation only). |
| P1            | PENDING (Preview) · Production public half observed  | Public half automated as `@proof P1a` (`tests/e2e/proofs/`), read-only, skipped in local mode; 9 Sep 2026 read-only scan of the live bundle shows the PROD ref `ilnoazendkckzhbuzias` — the Preview must show the TEST ref. Privileged half proven by P5.                                                                                                                                                                                                                                                                                    |
| P2            | PENDING                                              | 9 Sep 2026 via `supabase-dev` (read-only): TEST has 0 users and 0 entitlements — fixture accounts not created yet. Needs the accounts + a verified Preview; PROD negative control is an owner read-only check (Profile B).                                                                                                                                                                                                                                                                                                                   |
| P3            | PENDING                                              | Automated link-shape/return check planned via TEST admin-generated link; delivery itself is MANUAL (owner capture inbox).                                                                                                                                                                                                                                                                                                                                                                                                                    |
| P4 · P5 · P6  | PENDING                                              | Need Stripe TEST keys/price/webhook on the candidate Preview at the same SHA (§7.11) and P1 first.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| P6            | PENDING (Preview) · Production reachability observed | `@proof P6a` sends one unsigned request through the bypass and expects rejection. 9 Sep 2026 read-only: the live `www` route answers (405 on GET); the apex answers 308. Sandbox endpoint for the Preview not yet created.                                                                                                                                                                                                                                                                                                                   |
| P7            | NOT ISOLATED (owner decision, 9 Sep 2026)            | Mailchimp audience, Formspree form and access codes are shared with Production. Recorded per §9: controlled identities/inboxes, one labelled message per run, cleanup by the owner, linked human evidence (MN-003/MN-004). Never recorded as an isolation PASS.                                                                                                                                                                                                                                                                              |
| P8 · P8b · P9 | PARTIAL (P8) · PENDING (P8b, P9)                     | 9 Sep 2026 via `supabase-dev` (read-only): TEST `public` has only `entitlements` (RLS on, select-own policy, FK to `auth.users`, unique user+product); no security advisories. Difference vs repo migrations: `001_assessment_submissions` never applied to TEST (unused by code). PROD comparison and auth settings still Pending.                                                                                                                                                                                                          |
| P10           | Production half observed                             | Read-only GET of the Production origin 8 Sep 2026: 200, Vercel-served, headers present (§3). Preview half pending (protection state recorded by preflight).                                                                                                                                                                                                                                                                                                                                                                                  |
| P11           | Local PASS (9 Sep 2026) · Preview PENDING            | Local `next start` answered 200 on `/` and `/api/health`; Preview health and identity are checked by preflight each run.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| P12           | PENDING (owner)                                      | Owner verifies TEST/sandbox provenance for every Preview variable in §4 by name, including branch overrides.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| P13           | Launch                                               | Unchanged.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**Full Preview gate:** all applicable Preview proofs pass and are current; unused features have an N/A
reason. A §9 feature requires the approved MANUAL coverage and completed evidence, not skipped coverage.
Production halves of P10/P13 and live-domain/provider checks are due at launch. Required feature tests
must still pass in the full Launch Gate; partial proof runs cannot issue the launch GO.

**Re-run triggers:** changed environment values/overrides or destinations → affected wiring proofs after
redeploy; schema/policies → P8/P8b and affected flows; auth settings/domain → P3/P9 and P13 when live;
payments/webhook code or alias → P4/P5/P6 plus candidate-SHA check; email/form changes → P7; harness changes
→ target, credential and selection guards plus affected proofs. Recheck P11 each run. Preserve unrelated
valid evidence; do not demand every payment proof for a copy-only sprint.

## 13. Close-out record

- [ ] §3–§4 reflect actual environments; status/architecture point to the same facts.
- [ ] Applicable proofs are dated; future-stage checks are Pending with an owner, never prefilled PASS.
- [ ] Any mismatch has its minimal fix/decision in `PROJECT-STATUS.md` and the appropriate sprint.
- [ ] Test fixtures and temporary callback changes have recorded cleanup.
- [ ] Live-only residuals have explicit launch checklist/monitoring owners.

Delivery/review SHAs and verdicts belong in the existing sprint/Preview/review records. Fill them when
they exist. This reusable template does not require a fictitious PR, approval or merged SHA.

## 14. Keep the record accurate

Link primary evidence; distinguish observation from inference. Preserve useful decisions in Git history
and the decision log, without filling current instructions with old project-specific retractions.
Correct duplicated false claims wherever found. A substantive change invalidates the affected evidence
and review under `WORKFLOW.md`; never call a new head approved by an old review.

## 15. Where this plugs into the existing system

| Moment             | Action                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Setup Gate         | Copy/fill applicable §3–§4; follow §6; establish safe destinations before enabling writes |
| Relevant sprint    | Maintain environment contracts and complete/refresh affected §12 proofs                   |
| Pre-merge `/close` | Verify applicable isolation/parity evidence and the candidate callback commit             |
| Full Launch Gate   | Current Preview proofs, schema comparison where used, complete feature coverage           |
| Launch day         | Real-domain auth/forms and provider readiness; no real-card testing requirement           |
| After launch       | Safe morning checks, verified alerts and targeted rechecks after service changes          |

Next: use `ENV-VARS-SAFETY.md` before handling configuration; `WORKFLOW.md` for any implementation change.
