-- Extend get_utm_analytics to return byContent, byTerm, byRef, and byPath breakdowns.

create or replace function public.get_utm_analytics(p_from date, p_to date)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  result jsonb;
begin
  if p_from > p_to then
    return jsonb_build_object(
      'bySource',   '[]'::jsonb,
      'byMedium',   '[]'::jsonb,
      'byCampaign', '[]'::jsonb,
      'byContent',  '[]'::jsonb,
      'byTerm',     '[]'::jsonb,
      'byRef',      '[]'::jsonb,
      'byPath',     '[]'::jsonb,
      'daily',      '[]'::jsonb,
      'total',      0
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
        group by utm_source order by count desc
      ) s
    ),
    'byMedium', (
      select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb)
      from (
        select utm_medium as "medium", count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and utm_medium is not null and utm_medium != ''
        group by utm_medium order by count desc
      ) m
    ),
    'byCampaign', (
      select coalesce(jsonb_agg(to_jsonb(c)), '[]'::jsonb)
      from (
        select utm_campaign as "campaign", count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and utm_campaign is not null and utm_campaign != ''
        group by utm_campaign order by count desc
      ) c
    ),
    'byContent', (
      select coalesce(jsonb_agg(to_jsonb(ct)), '[]'::jsonb)
      from (
        select utm_content as "content", count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and utm_content is not null and utm_content != ''
        group by utm_content order by count desc
      ) ct
    ),
    'byTerm', (
      select coalesce(jsonb_agg(to_jsonb(tr)), '[]'::jsonb)
      from (
        select utm_term as "term", count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and utm_term is not null and utm_term != ''
        group by utm_term order by count desc
      ) tr
    ),
    'byRef', (
      select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb)
      from (
        select ref as "ref", count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and ref is not null and ref != ''
        group by ref order by count desc
      ) r
    ),
    'byPath', (
      select coalesce(jsonb_agg(to_jsonb(pp)), '[]'::jsonb)
      from (
        select path, count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and path is not null and path != ''
        group by path order by count desc
        limit 20
      ) pp
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

  return coalesce(result, jsonb_build_object(
    'bySource', '[]'::jsonb, 'byMedium', '[]'::jsonb, 'byCampaign', '[]'::jsonb,
    'byContent', '[]'::jsonb, 'byTerm', '[]'::jsonb, 'byRef', '[]'::jsonb,
    'byPath', '[]'::jsonb, 'daily', '[]'::jsonb, 'total', 0
  ));
end;
$$;

comment on function public.get_utm_analytics(date, date) is
  'Aggregated UTM counts by source, medium, campaign, content, term, ref, path, and day.';
