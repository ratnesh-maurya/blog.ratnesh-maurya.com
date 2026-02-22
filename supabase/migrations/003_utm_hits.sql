-- UTM tracking: one row per visit with UTM params. Aggregations via get_utm_analytics (no raw read for anon).
create table if not exists public.utm_hits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  path text
);

alter table public.utm_hits enable row level security;

create policy "Allow anon insert"
  on public.utm_hits for insert
  to anon with check (true);

create index if not exists idx_utm_hits_created_at
  on public.utm_hits (created_at desc);

create index if not exists idx_utm_hits_source_medium_campaign
  on public.utm_hits (utm_source, utm_medium, utm_campaign);

comment on table public.utm_hits is 'One row per page load with UTM params; for analytics aggregation only.';

-- Returns aggregated UTM analytics for date range. No raw rows exposed.
create or replace function public.get_utm_analytics(p_from date, p_to date)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  result jsonb;
  day_date date;
begin
  if p_from > p_to then
    return jsonb_build_object(
      'bySource', '[]'::jsonb,
      'byMedium', '[]'::jsonb,
      'byCampaign', '[]'::jsonb,
      'daily', '[]'::jsonb,
      'total', 0
    );
  end if;

  select jsonb_build_object(
    'bySource', (
      select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb)
      from (
        select utm_source as "source", count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and utm_source is not null and utm_source != ''
        group by utm_source
        order by count desc
      ) s
    ),
    'byMedium', (
      select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb)
      from (
        select utm_medium as "medium", count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and utm_medium is not null and utm_medium != ''
        group by utm_medium
        order by count desc
      ) m
    ),
    'byCampaign', (
      select coalesce(jsonb_agg(to_jsonb(c)), '[]'::jsonb)
      from (
        select utm_campaign as "campaign", count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and utm_campaign is not null and utm_campaign != ''
        group by utm_campaign
        order by count desc
      ) c
    ),
    'daily', (
      select coalesce(jsonb_agg(row_to_json(d)::jsonb order by d.day), '[]'::jsonb)
      from (
        select (created_at at time zone 'utc')::date as day, count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
        group by (created_at at time zone 'utc')::date
      ) d
    ),
    'total', (
      select count(*)::int from public.utm_hits
      where (created_at at time zone 'utc')::date between p_from and p_to
    )
  ) into result;

  return coalesce(result, jsonb_build_object('bySource', '[]'::jsonb, 'byMedium', '[]'::jsonb, 'byCampaign', '[]'::jsonb, 'daily', '[]'::jsonb, 'total', 0));
end;
$$;

grant execute on function public.get_utm_analytics(date, date) to anon;
grant execute on function public.get_utm_analytics(date, date) to authenticated;

comment on function public.get_utm_analytics(date, date) is 'Aggregated UTM counts by source, medium, campaign, and day for analytics.';
