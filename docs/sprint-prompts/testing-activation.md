# Activate testing — Bouncing Forward

Paste the following into Claude Code in this repository:

```text
/activate-testing

Complete the testing setup for Bouncing Forward, then prepare the feature list for my approval.
This is an existing live site. Keep this focused on starting reliable tests; leave cosmetic work,
unrelated refactors, and wholesale development-system/template cleanup aside.

Read CLAUDE.md, docs/PROJECT-STATUS.md, .claude/skills/activate-testing/SKILL.md,
docs/testing-setup/SETUP-CHECKLIST.md, and docs/ENVIRONMENT-PARITY.md first.
The updated testing module is already installed in its active locations. development/ is the
reference pack; do not copy it wholesale over the existing project records.

Continue on codex/testing-readiness, inspecting and preserving the existing uncommitted changes.
Authorized scope: testing setup dependencies and pnpm lockfile, Playwright configuration, tests/,
test scripts, .gitignore, testing workflows, .claude/skills/activate-testing/SKILL.md,
docs/testing-setup/, docs/ENVIRONMENT-PARITY.md, docs/FEATURE-LIST.md, docs/test-reports/,
docs/PROJECT-STATUS.md, docs/ROADMAP.md, docs/TECH-ARCHITECTURE.md, and names-only test-variable
documentation. Behavior-neutral data-testid additions may follow feature-list approval.
Commit: NO. Push: NO. Do not merge or change Production configuration/data.

Start at Phase 0. Playwright, its configuration, fixtures, and the Preview smoke test are still
pending. Install using the pinned pnpm version, configure desktop and 390px mobile profiles,
and prepare one homepage smoke test. Setup smoke/proof checks are allowed before feature-list
approval; do not write the full product suite before I approve that list.

Before any external write, verify the actual candidate Preview's project, environment and SHA,
TEST Supabase public AND privileged client destinations, Stripe test keys/prices and webhook
destination at that same SHA, and isolated Mailchimp audience/automations plus auth email delivery.
The public TEST/PROD project refs are recorded in docs/ENVIRONMENT-PARITY.md, but current wiring
has not been verified. Do not treat historical status notes as PASS evidence.
Never read or print live env files or secret values; request dashboard actions by variable name.
Use existing approved provider access/evidence. If access or a secret-store setting is missing,
finish independent local work and give me the exact remaining action. Do not write blindly to
prove isolation, connect Production without the existing approved exception, or apply migrations
without explicit authorization.

Make the harness reject unknown/Production targets for the full suite. Scope any deployment bypass
to the verified Preview origin only; never use a context-wide secret header. Disable sensitive
traces/screenshots/report attachments, keep auth state and artifacts ignored, and fail for missing
required credentials or zero selected tests. Keep the morning workflow disabled and without cron.

Run the repo's typecheck, lint, formatting check and build where the environment permits; report
unavailable checks accurately. Run the smoke test only against a verified deployed Preview.
If the uncommitted setup cannot have a matching candidate deployment under Commit/Push: NO,
finish local preparation and tell me what must be committed/pushed before claiming a Preview pass.
Respect the setup PR review/merge gate; do not claim Phase 0 complete without its evidence.

Once Phase 0 is complete, scan the actual code and approved requirements and draft docs/FEATURE-LIST.md
with stable IDs, including allowed and denied access, payment outcomes and form abuse controls.
Document existing defects or missing controls honestly; do not hide them, mark them PASS, or start
an unrelated repair sprint. Present the list in plain English and stop for my approval before
writing/running the full product suite. Leave morning checks off until the full gate passes and
I approve the selection. Report completed work, checks, and only the critical remaining blockers.
```
