# Supabase SQL — apply order & protocol

Per `TECH-ARCHITECTURE.md` §7 and `WORKFLOW.md` §14: SQL is applied **by hand** via the Supabase dashboard **SQL Editor**, one numbered file at a time, in order. No CLI migrations.

## Apply order

| #   | Up file                             | Down file                             | What it does                                                                                                     |
| --- | ----------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 001 | `001_assessment_submissions.up.sql` | `001_assessment_submissions.down.sql` | Compass & Path Check results table (default-deny RLS) + hardened `submit_assessment()` RPC — the only write path |

## Protocol for every change

1. Write the numbered `.up.sql` **and** matching `.down.sql`; include both + RLS in the PR description.
2. Apply to the **non-production** Supabase project first. Test there (see verification below) before the Vercel Preview test.
3. Keep changes backwards-compatible / additive; deploy schema before the code that depends on it.
4. Apply to Production at the right moment relative to the merge.
5. Remember: a Vercel rollback does **not** roll back the database. Keep a backwards-compatible schema or apply the `.down.sql` deliberately. Prefer forward-fix.

## Verifying 001 after apply

Run as the `anon` role (SQL Editor → role switcher, or via the app):

```sql
-- Must FAIL (default-deny, no direct table access):
select * from public.assessment_submissions;
insert into public.assessment_submissions (resilience, adaptability, optimism, support, accept, reflect, imagine, action, weakest_light)
values (3,3,3,3,3,3,3,3,'resilience');

-- Must SUCCEED (returns a uuid):
select public.submit_assessment(3::smallint,4::smallint,2::smallint,5::smallint,3::smallint,3::smallint,4::smallint,2::smallint);

-- Must FAIL (range check):
select public.submit_assessment(9::smallint,4::smallint,2::smallint,5::smallint,3::smallint,3::smallint,4::smallint,2::smallint);
```

Then as a privileged role, confirm the row landed and `weakest_light` is the lowest-scoring dimension.

## Notes

- The app's `/api/assessment` Route Handler calls the RPC with the **publishable** key. No app path uses the secret key; `SUPABASE_SECRET_KEY` should not be provisioned unless a genuine trusted server need appears.
- `email` is nullable and set only when the user subscribes at the results screen; Mailchimp is the primary home for subscriber data.
- Rate limiting for the endpoint lives in the app layer (Upstash), not in SQL.
