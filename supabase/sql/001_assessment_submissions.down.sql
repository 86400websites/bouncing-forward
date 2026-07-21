-- ============================================================
-- 001 ROLLBACK — Assessment submissions
-- Apply by hand via Supabase dashboard → SQL Editor.
-- WARNING: dropping the table deletes all stored assessment results.
-- Export first if any real data exists:
--   select * from public.assessment_submissions;
-- ============================================================

drop function if exists public.submit_assessment(
  smallint, smallint, smallint, smallint,
  smallint, smallint, smallint, smallint, text, text
);

drop table if exists public.assessment_submissions;
