-- RPC for analytics: daily event counts. Does not expose raw stats_events to anon.
create or replace function public.get_events_daily(since date default (current_date - interval '90 days')::date)
returns table(day date, event_type text, type text, count bigint)
language sql
security definer
set search_path = public
stable
as $$
  select
    (created_at at time zone 'utc')::date as day,
    stats_events.event_type,
    stats_events.type,
    count(*)::bigint
  from public.stats_events
  where (created_at at time zone 'utc')::date >= since
  group by (created_at at time zone 'utc')::date, stats_events.event_type, stats_events.type
  order by day asc, event_type, type;
$$;

grant execute on function public.get_events_daily(date) to anon;
grant execute on function public.get_events_daily(date) to authenticated;

comment on function public.get_events_daily(date) is 'Aggregated event counts by day, event_type, and type for analytics.';