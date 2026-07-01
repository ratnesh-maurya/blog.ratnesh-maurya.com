-- Analytics revamp: referrer/device/geo capture, engagement events,
-- web vitals storage, trending + read-quality + today RPCs.
-- Run in Supabase SQL Editor after 006.

-- ─── 1. utm_hits: referrer + device + country ────────────────────────────────
alter table public.utm_hits add column if not exists referrer text;
alter table public.utm_hits add column if not exists device text;   -- mobile | tablet | desktop
alter table public.utm_hits add column if not exists country text;  -- ISO 3166-1 alpha-2 from edge header

create index if not exists idx_utm_hits_referrer on public.utm_hits (referrer) where referrer is not null;

-- ─── 2. Engagement events: read_half / read_complete ─────────────────────────
alter table public.stats_events drop constraint if exists stats_events_event_type_check;
alter table public.stats_events add constraint stats_events_event_type_check
  check (event_type in ('view', 'upvote', 'report', 'read_half', 'read_complete'));

-- log_engagement: append-only event, does NOT touch aggregate stats counters
create or replace function public.log_engagement(
  p_type text,
  p_slug text,
  p_event text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event not in ('read_half', 'read_complete') then
    raise exception 'invalid engagement event: %', p_event;
  end if;
  insert into public.stats_events (event_type, type, slug, created_at)
  values (p_event, p_type, p_slug, now());
end;
$$;

grant execute on function public.log_engagement(text, text, text) to anon;
grant execute on function public.log_engagement(text, text, text) to authenticated;

-- ─── 3. Web vitals ────────────────────────────────────────────────────────────
create table if not exists public.web_vitals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  metric text not null check (metric in ('LCP', 'CLS', 'INP', 'FCP', 'TTFB')),
  value double precision not null,
  rating text check (rating in ('good', 'needs-improvement', 'poor')),
  path text
);

alter table public.web_vitals enable row level security;

-- Inserts flow through /api/vitals (server route using anon key), same as utm_hits
create policy "Allow anon insert" on public.web_vitals
  for insert to anon with check (true);
create policy "No anon read" on public.web_vitals
  for select to anon using (false);

create index if not exists idx_web_vitals_metric_created on public.web_vitals (metric, created_at desc);

-- ─── 4. RPC: trending posts (recent vs previous window) ───────────────────────
create or replace function public.get_trending_posts(p_days int default 7)
returns jsonb
language sql
security definer
set search_path = public
as $$
  with recent as (
    select type, slug, count(*) as views
    from public.stats_events
    where event_type = 'view'
      and created_at >= now() - make_interval(days => p_days)
    group by type, slug
  ),
  previous as (
    select type, slug, count(*) as views
    from public.stats_events
    where event_type = 'view'
      and created_at >= now() - make_interval(days => p_days * 2)
      and created_at <  now() - make_interval(days => p_days)
    group by type, slug
  )
  select coalesce(jsonb_agg(row order by (row->>'recent')::bigint desc), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'type', coalesce(r.type, p.type),
      'slug', coalesce(r.slug, p.slug),
      'recent', coalesce(r.views, 0),
      'previous', coalesce(p.views, 0)
    ) as row
    from recent r
    full outer join previous p on p.type = r.type and p.slug = r.slug
    order by coalesce(r.views, 0) desc
    limit 50
  ) t;
$$;

grant execute on function public.get_trending_posts(int) to anon;
grant execute on function public.get_trending_posts(int) to authenticated;

-- ─── 5. RPC: read quality (views vs read-completion) ──────────────────────────
create or replace function public.get_read_quality(p_days int default 30)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(row order by (row->>'views')::bigint desc), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'type', type,
      'slug', slug,
      'views', count(*) filter (where event_type = 'view'),
      'read_half', count(*) filter (where event_type = 'read_half'),
      'read_complete', count(*) filter (where event_type = 'read_complete')
    ) as row
    from public.stats_events
    where created_at >= now() - make_interval(days => p_days)
      and event_type in ('view', 'read_half', 'read_complete')
    group by type, slug
    having count(*) filter (where event_type = 'view') >= 5
    order by count(*) filter (where event_type = 'view') desc
    limit 50
  ) t;
$$;

grant execute on function public.get_read_quality(int) to anon;
grant execute on function public.get_read_quality(int) to authenticated;

-- ─── 6. RPC: web vitals summary (p75/p50 per metric + worst LCP paths) ────────
create or replace function public.get_web_vitals_summary(p_days int default 30)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'byMetric', coalesce((
      select jsonb_agg(row order by row->>'metric')
      from (
        select jsonb_build_object(
          'metric', metric,
          'p50', round(percentile_cont(0.5) within group (order by value)::numeric, 4),
          'p75', round(percentile_cont(0.75) within group (order by value)::numeric, 4),
          'count', count(*),
          'goodPct', round(100.0 * count(*) filter (where rating = 'good') / count(*), 1)
        ) as row
        from public.web_vitals
        where created_at >= now() - make_interval(days => p_days)
        group by metric
      ) m
    ), '[]'::jsonb),
    'worstLcpPaths', coalesce((
      select jsonb_agg(row)
      from (
        select jsonb_build_object(
          'path', path,
          'p75', round(percentile_cont(0.75) within group (order by value)::numeric, 0),
          'count', count(*)
        ) as row
        from public.web_vitals
        where metric = 'LCP'
          and path is not null
          and created_at >= now() - make_interval(days => p_days)
        group by path
        having count(*) >= 3
        order by percentile_cont(0.75) within group (order by value) desc
        limit 10
      ) t
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.get_web_vitals_summary(int) to anon;
grant execute on function public.get_web_vitals_summary(int) to authenticated;

-- ─── 7. RPC: views today (cheap poll for live ticker) ─────────────────────────
create or replace function public.get_views_today()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'today', (
      select count(*) from public.stats_events
      where event_type = 'view' and created_at >= date_trunc('day', now())
    ),
    'lastHour', (
      select count(*) from public.stats_events
      where event_type = 'view' and created_at >= now() - interval '1 hour'
    )
  );
$$;

grant execute on function public.get_views_today() to anon;
grant execute on function public.get_views_today() to authenticated;

-- ─── 8. RPC: referrer breakdown (organic/direct/social classification client-side) ─
create or replace function public.get_referrer_breakdown(p_from date, p_to date)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'byReferrer', coalesce((
      select jsonb_agg(row)
      from (
        select jsonb_build_object('referrer', coalesce(referrer, '(direct)'), 'count', count(*)) as row
        from public.utm_hits
        where created_at >= p_from and created_at < p_to + 1
        group by coalesce(referrer, '(direct)')
        order by count(*) desc
        limit 30
      ) t
    ), '[]'::jsonb),
    'byDevice', coalesce((
      select jsonb_agg(jsonb_build_object('device', coalesce(device, 'unknown'), 'count', cnt))
      from (
        select device, count(*) as cnt from public.utm_hits
        where created_at >= p_from and created_at < p_to + 1
        group by device order by cnt desc
      ) t
    ), '[]'::jsonb),
    'byCountry', coalesce((
      select jsonb_agg(row)
      from (
        select jsonb_build_object('country', coalesce(country, 'unknown'), 'count', count(*)) as row
        from public.utm_hits
        where created_at >= p_from and created_at < p_to + 1
        group by country
        order by count(*) desc
        limit 20
      ) t
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.get_referrer_breakdown(date, date) to anon;
grant execute on function public.get_referrer_breakdown(date, date) to authenticated;

comment on table public.web_vitals is 'Core Web Vitals samples reported from real clients via /api/vitals.';
comment on function public.get_trending_posts is 'Per-post views for last N days vs previous N days (momentum).';
comment on function public.get_read_quality is 'Views vs read_half/read_complete per post — completion-rate quality signal.';
