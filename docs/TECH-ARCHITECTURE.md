# TECH-ARCHITECTURE.md — Locked Stack and Architecture

The authoritative mechanics for `Bouncing Forward`. Fill this file before scaffolding. If another document disagrees about the stack or deployment model, this file wins; if the shipped repository disagrees, report the mismatch and correct documentation only within an authorized task.

## 1. Project summary

| Item               | Decision                                    |
| ------------------ | ------------------------------------------- |
| Project / client   | `Bouncing Forward` / `[CLIENT_NAME]`        |
| Production domain  | `bouncing-forward.com`                      |
| Primary conversion | `[PRIMARY_CONVERSION]`                      |
| Access model       | `[PUBLIC_ONLY / PUBLIC_PLUS_GATED / OTHER]` |
| Content model      | `[STATIC_FILES / CMS / DATABASE / OTHER]`   |
| Repository         | `[REPO_NAME]` on GitHub — source of truth   |

## 2. Locked stack

Record the actual choice; do not leave examples as instructions.

| Layer                       | Choice for this project                                                                                                                                                        | Version / constraint                                                 | Reason                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework or site generator | `[FRAMEWORK]`                                                                                                                                                                  | `[VERSION]`                                                          | `[WHY]`                                                                                                                                                                                                                                                                                                                                                               |
| Language                    | `[LANGUAGE]`                                                                                                                                                                   | `[STRICTNESS]`                                                       |                                                                                                                                                                                                                                                                                                                                                                       |
| Styling / component system  | `[STYLING_SYSTEM]`                                                                                                                                                             | `[VERSION]`                                                          |                                                                                                                                                                                                                                                                                                                                                                       |
| Forms and validation        | `[FORM_APPROACH]`                                                                                                                                                              |                                                                      | Include trusted-boundary validation                                                                                                                                                                                                                                                                                                                                   |
| Auth                        | `[NONE / PROVIDER]`                                                                                                                                                            |                                                                      |                                                                                                                                                                                                                                                                                                                                                                       |
| Database                    | `[NONE / PROVIDER]`                                                                                                                                                            |                                                                      |                                                                                                                                                                                                                                                                                                                                                                       |
| Hosting                     | `Vercel`                                                                                                                                                                       |                                                                      | Must support the approved Preview workflow                                                                                                                                                                                                                                                                                                                            |
| Package manager             | `[PACKAGE_MANAGER]`                                                                                                                                                            | `[PINNED_VERSION]`                                                   | Never mix managers                                                                                                                                                                                                                                                                                                                                                    |
| Verification commands       | `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test:e2e` (Launch Gate — verified Preview only; `test:e2e:smoke` / `test:e2e:proofs` for setup checks), `pnpm build` | Playwright `1.63.0` pinned; Chromium desktop + 390px mobile profiles | The e2e suite is the Launch Gate (`docs/testing-setup/`, `tests/e2e/`), not part of the per-PR Code Check. `N/A — reason` for tests is allowed **only for a fully static site**. A project with auth, gated content, a database, or payments must ship an automated suite (≥1 allowed-state and ≥1 denied-state test per protected boundary) — see `QA-CHECKLIST.md`. |

Example profile only: Next.js + TypeScript + Tailwind + pnpm on Vercel, with optional Supabase. Select it deliberately; it is not the universal default.

**Never:** swap a locked layer or add a production dependency without an explicit, recorded decision.

## 3. Routes and shells

Copy every route from the approved sitemap. Name the approved shell so public, member, campaign, and admin layouts do not get conflated.

| Route / pattern | Purpose     | Access                                    | Approved shell   | Content source |
| --------------- | ----------- | ----------------------------------------- | ---------------- | -------------- |
| `/`             | Home        | Public                                    | `[PUBLIC_SHELL]` | `[SOURCE]`     |
| `/[route]`      | `[PURPOSE]` | `[PUBLIC / SIGNED_IN / ENTITLED / ADMIN]` | `[SHELL]`        | `[SOURCE]`     |

File location and hidden navigation are not access control. Every protected request checks authentication and authorization at a trusted server or data boundary before returning protected data. Admin access requires a separate server-enforced role check.

## 4. Data and files — skip if none

| Store / entity     | Purpose     | Owner     | Read rule | Write rule | Retention / deletion |
| ------------------ | ----------- | --------- | --------- | ---------- | -------------------- |
| `[TABLE_OR_STORE]` | `[PURPOSE]` | `[OWNER]` | `[RULE]`  | `[RULE]`   | `[RULE]`             |

- [ ] Default deny is enforced at the strongest supported boundary.
- [ ] If the chosen platform supports row-level policies (for example Supabase RLS), every user-reachable table has minimum-grant policies before data lands.
- [ ] If it does not, the database is not browser-reachable and every server operation authorizes the caller.
- [ ] Public projections contain only explicitly public fields.
- [ ] Private files require authorized, short-lived delivery or an equivalent protected mechanism.
- [ ] Local, Preview, and Production do not share writable production data.
- [ ] Migrations are classified as additive, reversible, or destructive. Destructive work has an approved backup/PITR and restore plan; down migrations do not recreate lost data.

## 5. Authentication and authorization — skip if none

| Role / state | May access          | Must not access        | Enforcement point |
| ------------ | ------------------- | ---------------------- | ----------------- |
| Anonymous    | `[PUBLIC_SURFACES]` | `[PROTECTED_SURFACES]` | `[BOUNDARY]`      |
| `[ROLE]`     | `[SURFACES]`        | `[SURFACES]`           | `[BOUNDARY]`      |

- Sessions and authorization are rechecked at the trusted boundary for every protected request.
- Client state is presentation, never proof of entitlement.
- Redirect targets are same-origin or allow-listed.
- Auth links generated from a Preview return to that Preview, never silently to Production.

## 6. Environment variables — names only

Public naming differs by framework. Record `[PUBLIC_ENV_PREFIX]`; anything bearing that prefix is world-readable.

| Name                     | Public / server-only | Feature       | Environments                 | Owner     |
| ------------------------ | -------------------- | ------------- | ---------------------------- | --------- |
| `[PUBLIC_SITE_URL_NAME]` | Public               | Canonical URL | Local / Preview / Production | `[OWNER]` |
| `[VAR_NAME]`             | `[CLASS]`            | `[FEATURE]`   | `[SCOPES]`                   | `[OWNER]` |

Test-harness variables (names only; never read by the application — full table and guards in
`tests/e2e/README.md` and `docs/ENVIRONMENT-PARITY.md` §4): `PLAYWRIGHT_TARGET`, `PLAYWRIGHT_BASE_URL`,
`PLAYWRIGHT_EXPECTED_SHA`, `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`,
`VERCEL_AUTOMATION_BYPASS_SECRET`, `E2E_FREE_USER_EMAIL`, `E2E_FREE_USER_PASSWORD`,
`E2E_PREMIUM_USER_EMAIL`, `E2E_PREMIUM_USER_PASSWORD`, `E2E_SUPABASE_URL`, `E2E_SUPABASE_SECRET_KEY`,
`E2E_STRIPE_SECRET_KEY`, `E2E_STRIPE_WEBHOOK_SECRET`, `E2E_LEGACY_ACCESS_CODE`, `E2E_OWNER_MAILBOX`,
`E2E_MAILCHIMP_API_KEY`, `E2E_MAILCHIMP_AUDIENCE_ID`, `E2E_MAILCHIMP_SERVER_PREFIX`,
`MORNING_TEST_EMAIL`, `MORNING_TEST_PASSWORD`, `PRODUCTION_URL`. The read-only `/api/health` route reports
deployment identity (environment, commit, project refs, Stripe mode) for the harness preflight; it returns no values.

- Commit only `.env.example` with safe placeholders. Never commit `.env.local` or another live-value file.
- Never read, print, paste, or pass a server-only value into browser code.
- Changing a deployed value requires a fresh deployment when the platform or framework inlines it.
- Provider-specific names belong in the optional profile `SUPABASE-VERCEL-SETUP.md` only when that profile is selected.

## 7. Integrations

| Integration | Required for core journey? | Failure behavior                             | Env names      | Data sent  |
| ----------- | -------------------------- | -------------------------------------------- | -------------- | ---------- |
| `[SERVICE]` | `[YES / NO]`               | `[HONEST_ERROR / DISABLED / QUEUED / OTHER]` | `[NAMES_ONLY]` | `[FIELDS]` |

Optional integrations may be disabled in local or Preview when documented. In Production, a required delivery, payment, or abuse-prevention dependency fails closed with an honest error; it never reports success while losing work.

**Conversion durability (required).** A required conversion (e.g. the primary form) has **at least two independent capture paths** — never a single mailbox. If it emails a lead, it also persists the submission to a second sink (the form/email provider's dashboard, a second recipient, a data store, or a webhook) so one delivery failure never loses a lead.

**Deliverability (required for email-based conversions).** The sending domain has **SPF, DKIM, and DMARC** configured, and before launch a submission from an _external_ address is verified to land in the inbox — not spam. (Records are added at launch; see `LAUNCH-CHECKLIST.md`.)

## 8. Content operations — complete for content/CMS sites

| Item                              | Decision         |
| --------------------------------- | ---------------- |
| Canonical content source          | `[SOURCE]`       |
| Content types                     | `[TYPES]`        |
| Draft → review → publish workflow | `[WORKFLOW]`     |
| Editor roles                      | `[ROLES]`        |
| Media ownership and optimization  | `[RULES]`        |
| Redirect/migration plan           | `[PLAN]`         |
| Backup/export and restore test    | `[PLAN]`         |
| Client training and handoff       | `[OWNER / DATE]` |

Approved launch copy is the baseline. Later editorial changes follow this workflow rather than silently editing frozen source files.

## 9. Security and deployment

- Security headers and transport controls are defined for the selected framework/host and verified on the deployed response.
- `main` is protected; Production deploys only from `main`.
- Every PR gets an isolated deployed Preview. The supplied profile is Vercel; record an approved equivalent here when different.
- Preview test record: `docs/templates/VERCEL-PREVIEW-TEST-TEMPLATE.md` or its approved equivalent.
- Rollback action: `[HOST_ROLLBACK_ACTION]`. A host rollback restores application artifacts, not database state.
- Relaunch only: the old→new **301/410 redirect map** from predevelopment is implemented and verified on the live domain at launch; the highest-traffic old URLs never resolve to a bare 404.

## 10. Companion documents

- Order: `ROADMAP.md`
- Current state: `PROJECT-STATUS.md`
- Delivery: `WORKFLOW.md`
- Visual rules: `DESIGN.md`
- Security gate: `SECURITY-CHECKLIST.md`
- Provider profile: `SUPABASE-VERCEL-SETUP.md` when selected

Any authorized architecture change updates this file in the same PR.

**Next:** fill `DESIGN.md`, then complete the Setup Gate.
