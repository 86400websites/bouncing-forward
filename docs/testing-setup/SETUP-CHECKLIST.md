# Testing Setup — One-Time Checklist

Run once per website. Every box says who does it. Your total hands-on time: ~20 minutes.
When the last box is ticked, testing is a single ask forever after: `/activate-testing`.

> Works for new builds and existing sites alike. Prerequisites: the site lives in a GitHub repo and deploys to Vercel (or the approved equivalent with PR Previews). If the site has accounts, a non-production Supabase project must exist per `docs/SUPABASE-MCP-SAFETY.md`.

---

## Part 1 — Put the files in place

- [x] **You:** copy this folder into the project repo per the copy map in `00-START-HERE.md` (or simply tell Claude Code: _"Install the testing setup from docs/testing-setup — follow its 00-START-HERE copy map"_). _(done 7 Sep 2026)_
- [x] **Claude Code:** place `activate-testing.md` at `.claude/skills/activate-testing/SKILL.md`; place the rest under `docs/testing-setup/`. _(done 7 Sep 2026)_

## Part 2 — Install the tester (one normal PR)

- [x] **Claude Code:** install Playwright in the repo as a dev dependency (`@playwright/test`, via pnpm). Free software — no account, no key, no cost. _(8 Sep 2026: `@playwright/test@1.63.0` pinned exactly, pnpm 10.34.5)_
- [x] **Claude Code:** create the Playwright config: tests live in `tests/e2e/`, the target URL comes from the `PLAYWRIGHT_BASE_URL` environment variable, desktop + mobile (390px) browser profiles, and one auth-setup step per user role. _(8 Sep 2026: `playwright.config.ts`; roles in code are "free account" and "Book Package owner" — there is no admin role)_
- [x] **Claude Code:** create the test users the robot will log in as — typically one **visitor-to-be**, one **member**, one **admin** (whichever roles the site has) — in the **non-production** database only, with obviously-fake names/emails. Never in production. Record their emails (never passwords) in `docs/FEATURE-LIST.md` when it is generated. _(9 Sep 2026: done — the owner ran `tests/e2e/tools/bootstrap-local-runner.mjs`, which created `<owner-mailbox>+bf-e2e-free` and `<owner-mailbox>+bf-e2e-premium` in the TEST project with a generated password kept only in `.env.e2e.local`; Claude Code added the premium entitlement through the TEST connection and verified both accounts, then both signed in on the Preview)_
- [ ] **Claude Code:** confirm environment separation using `docs/ENVIRONMENT-PARITY.md` §12. Verify the target before any external write, then run applicable bounded proofs before the full suite. No live database/payment credentials in Preview; unused services are N/A with reasons. Local checks and safe setup probes do not wait for future launch-day proofs. _(9 Sep 2026: Preview preflight PASS — TEST Supabase on the public client, privileged key present (opaque format), test-mode Stripe, sandbox webhook secret set; P1a and P6a PASS; Mailchimp/Formspree/access codes are shared by owner decision (§9), Stripe sandbox webhook destination and P2–P5/P7 remain Pending with the feature suite. 10 Sep 2026: unchanged — the remaining proofs need the owner's Stripe sandbox destination (item 5 of "Before tests can run" in docs/FEATURE-LIST.md) and the feature suite itself; everything the harness can prove alone is proven)_
- [x] **Claude Code:** add the morning-check workflow file from `templates/MORNING-CHECK-TEMPLATE.md`, **disabled** for now (it is switched on only after the gate passes). _(8 Sep 2026: `.github/workflows/morning-check.yml` — manual trigger only, no cron, gated by the `MORNING_CHECK_ENABLED` variable)_

## Part 3 — Unlock the robot's door (only if Previews are password-protected)

Vercel can protect Preview links so strangers cannot see unfinished work. The robot needs a sanctioned key through that door — never a workaround.

- [x] **You:** in Vercel → the project → Settings → Deployment Protection → enable **Protection Bypass for Automation**. Vercel generates a secret. _(done — Preview protection is Vercel Authentication; 9 Sep 2026 the preflight observed the sign-in redirect and passed with the bypass)_
- [x] **You:** add that secret to the project's environment variables in Vercel (Preview environment) and to GitHub Actions secrets — Claude Code will tell you the exact variable name to use. Paste the value only into those dashboards, never into chat, never into any file. _(done: `VERCEL_AUTOMATION_BYPASS_SECRET` in Vercel Preview, GitHub Actions secrets and the local `.env.e2e.local`)_
- [x] **Claude Code:** reference the secret **by name only**; attach the bypass header only to requests to the verified Preview origin, including direct HTTP tests. Disable secret-bearing traces/reports per `docs/ENVIRONMENT-PARITY.md` §10. If Preview protection is off, skip this part. _(8 Sep 2026: variable name `VERCEL_AUTOMATION_BYPASS_SECRET`; sent only to the verified origin via a scoped route and a same-origin-only API helper; traces, screenshots, video and HTML report off. Whether Preview protection is on is unknown until the first Preview — the preflight records it)_

## Part 4 — Prove it works, then close

- [x] **Claude Code:** write one smoke test (homepage loads with no errors) and run it against a deployed Preview to prove the pipeline is alive end to end. _(9 Sep 2026: PR #36 Preview `bouncing-forward-2d25v8xkf-86400-s-projects.vercel.app`, commit `654444d`, verified by the preflight as environment preview / this project / TEST Supabase / test-mode Stripe — SM-001 passed on desktop and 390px, proofs P1a and P6a passed, both fixture accounts signed in)_
- [x] **You:** merge the setup PR (normal workflow: PR → Preview → review → merge). _(PR #36 merged into `main` on 9 September 2026 as `07ef8c3`; live on Production the same day)_
- [x] **You:** confirm in one line that setup is done, dated, in the PR or project status. _(confirmed by the owner in chat on 10 September 2026: "Yes setup done" — recorded in docs/PROJECT-STATUS.md)_

---

**Done.** From now on the entire testing system is: _"Activate the testing setup"_ → approve the feature list → _"run the tests"_ → read the report. See `TESTING-GUIDE.md` steps 2–5.
