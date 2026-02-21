-- Single migration: stats (views, upvotes, reports) + stats_events. Run in Supabase SQL Editor once, then run npm run migrate-views-to-supabase to copy from MongoDB.

create table if not exists public.stats (
  type text not null,
  slug text not null,
  views bigint not null default 0,
  upvotes bigint not null default 0,
  reports bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (type, slug)
);

alter table public.stats enable row level security;

create policy "Allow public read"
  on public.stats for select
  to anon using (true);

create table if not exists public.stats_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('view', 'upvote', 'report')),
  type text not null,
  slug text not null,
  created_at timestamptz not null default now()
);

alter table public.stats_events enable row level security;

create policy "No direct anon access"
  on public.stats_events for all
  to anon using (false) with check (false);

create index if not exists idx_stats_events_type_slug_created
  on public.stats_events (type, slug, created_at desc);

create or replace function public.increment_stat(
  p_type text,
  p_slug text,
  p_metric text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.stats%rowtype;
begin
  if p_metric not in ('view', 'upvote', 'report') then
    raise exception 'invalid metric: %', p_metric;
  end if;

  insert into public.stats_events (event_type, type, slug, created_at)
  values (p_metric, p_type, p_slug, now());

  if p_metric = 'view' then
    insert into public.stats (type, slug, views, upvotes, reports, updated_at)
    values (p_type, p_slug, 1, 0, 0, now())
    on conflict (type, slug) do update set
      views = public.stats.views + 1,
      updated_at = now()
    returning * into r;
  elsif p_metric = 'upvote' then
    insert into public.stats (type, slug, views, upvotes, reports, updated_at)
    values (p_type, p_slug, 0, 1, 0, now())
    on conflict (type, slug) do update set
      upvotes = public.stats.upvotes + 1,
      updated_at = now()
    returning * into r;
  else
    insert into public.stats (type, slug, views, upvotes, reports, updated_at)
    values (p_type, p_slug, 0, 0, 1, now())
    on conflict (type, slug) do update set
      reports = public.stats.reports + 1,
      updated_at = now()
    returning * into r;
  end if;

  return json_build_object('views', r.views, 'upvotes', r.upvotes, 'reports', r.reports);
end;
$$;

grant execute on function public.increment_stat(text, text, text) to anon;
grant execute on function public.increment_stat(text, text, text) to authenticated;

comment on table public.stats is 'View, upvote, and report counts per page (type, slug).';
comment on table public.stats_events is 'One row per view/upvote/report for analytics; no identifier.';
comment on function public.increment_stat is 'Increment view/upvote/report for (type, slug), log event; returns new counts.';
