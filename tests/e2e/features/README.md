# Feature specs land here after the owner approves `docs/FEATURE-LIST.md`

One spec per approved feature line, named and tagged with its ID, grouped by
the list's sections (`pages/`, `accounts/`, `forms/`, `payments/`,
`protection/`, `integrations/`). Nothing is written here before written
approval — see `.claude/skills/activate-testing/SKILL.md` Phase 2.

Role-based specs reuse the saved sessions from the auth setup projects:

```ts
test.use({ storageState: "tests/e2e/.auth/premium.json" });
```
