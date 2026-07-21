-- ============================================================
-- 001 — Assessment submissions (Compass & Path Check)
-- Apply by hand via Supabase dashboard → SQL Editor.
-- Apply to the NON-PRODUCTION project first, test, then Production.
-- Rollback: 001_assessment_submissions.down.sql
-- ============================================================

-- The Compass & Path Check is anonymous (no auth in phase 1).
-- The browser NEVER writes to this table directly: the app's
-- /api/assessment Route Handler calls the hardened RPC below with
-- the publishable key. The table itself is default-deny.

create table public.assessment_submissions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  -- The 4-Element Compass (1 = Barely Flickering … 5 = Bright)
  resilience   smallint not null check (resilience  between 1 and 5),
  adaptability smallint not null check (adaptability between 1 and 5),
  optimism     smallint not null check (optimism    between 1 and 5),
  support      smallint not null check (support     between 1 and 5),

  -- The 4-Step Path (1 = Not Yet Possible … 5 = Settled)
  accept       smallint not null check (accept  between 1 and 5),
  reflect      smallint not null check (reflect between 1 and 5),
  imagine      smallint not null check (imagine between 1 and 5),
  action       smallint not null check (action  between 1 and 5),

  -- Derived at insert for easy reporting: the dimension scoring lowest
  weakest_light text not null,

  -- Optional association, set ONLY when the user also subscribes at the
  -- results screen. Email lives primarily in Mailchimp; this column
  -- exists to join assessment history to a subscriber if ever needed.
  email        text check (email is null or (char_length(email) <= 320 and position('@' in email) > 1)),

  source       text not null default 'web'
);

comment on table public.assessment_submissions is
  'Anonymous Compass & Path Check results. Inserts only via submit_assessment() RPC. Default-deny RLS.';

-- RLS: enabled with NO policies = default-deny for anon/authenticated.
alter table public.assessment_submissions enable row level security;

-- Belt-and-braces: revoke direct table privileges from API roles.
revoke all on table public.assessment_submissions from anon, authenticated;

-- ------------------------------------------------------------
-- Hardened SECURITY DEFINER RPC — the only write path.
--   * pinned empty search_path, fully-qualified objects
--   * validates every argument server-side (checks duplicate the
--     table constraints so callers get a clean error, not a 500)
--   * returns only the new row id (no data readback)
-- ------------------------------------------------------------
create or replace function public.submit_assessment(
  p_resilience   smallint,
  p_adaptability smallint,
  p_optimism     smallint,
  p_support      smallint,
  p_accept       smallint,
  p_reflect      smallint,
  p_imagine      smallint,
  p_action       smallint,
  p_email        text default null,
  p_source       text default 'web'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_scores jsonb;
  v_weakest text;
begin
  if p_resilience   not between 1 and 5
  or p_adaptability not between 1 and 5
  or p_optimism     not between 1 and 5
  or p_support      not between 1 and 5
  or p_accept       not between 1 and 5
  or p_reflect      not between 1 and 5
  or p_imagine      not between 1 and 5
  or p_action       not between 1 and 5 then
    raise exception 'scores must be between 1 and 5';
  end if;

  if p_email is not null and (char_length(p_email) > 320 or position('@' in p_email) <= 1) then
    raise exception 'invalid email';
  end if;

  if p_source is null or char_length(p_source) > 40 then
    p_source := 'web';
  end if;

  v_scores := jsonb_build_object(
    'resilience', p_resilience, 'adaptability', p_adaptability,
    'optimism', p_optimism, 'support', p_support,
    'accept', p_accept, 'reflect', p_reflect,
    'imagine', p_imagine, 'action', p_action
  );

  select key into v_weakest
  from jsonb_each_text(v_scores)
  order by value::int asc, key asc
  limit 1;

  insert into public.assessment_submissions (
    resilience, adaptability, optimism, support,
    accept, reflect, imagine, action,
    weakest_light, email, source
  ) values (
    p_resilience, p_adaptability, p_optimism, p_support,
    p_accept, p_reflect, p_imagine, p_action,
    v_weakest, nullif(trim(p_email), ''), p_source
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- Lock the function down: nobody by default, then grant to API roles.
revoke execute on function public.submit_assessment(
  smallint, smallint, smallint, smallint,
  smallint, smallint, smallint, smallint, text, text
) from public;

grant execute on function public.submit_assessment(
  smallint, smallint, smallint, smallint,
  smallint, smallint, smallint, smallint, text, text
) to anon, authenticated;
