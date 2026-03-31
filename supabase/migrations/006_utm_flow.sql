-- Returns cross-tabulated flow data: (source → content_type, count)
-- Used for Sankey/Alluvial chart in analytics dashboard.

create or replace function public.get_utm_flow(p_from date, p_to date)
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
    return jsonb_build_object('flows', '[]'::jsonb, 'total', 0);
  end if;

  select jsonb_build_object(
    'flows', (
      select coalesce(jsonb_agg(to_jsonb(f)), '[]'::jsonb)
      from (
        select
          coalesce(nullif(utm_source, ''), nullif(ref, ''), 'direct') as source,
          case
            when path like '/blog/%'             then 'blog'
            when path like '/news/%'             then 'news'
            when path like '/til/%'              then 'til'
            when path like '/technical-terms/%'  then 'technical-terms'
            when path like '/silly-questions/%'  then 'silly-questions'
            when path like '/cheatsheets/%'      then 'cheatsheets'
            when path = '/about'                 then 'about'
            when path = '/now'                   then 'now'
            else 'other'
          end as content_type,
          count(*)::int as count
        from public.utm_hits
        where (created_at at time zone 'utc')::date between p_from and p_to
          and path is not null and path != '/'
        group by 1, 2
        order by count desc
      ) f
    ),
    'total', (
      select count(*)::int from public.utm_hits
      where (created_at at time zone 'utc')::date between p_from and p_to
    )
  ) into result;

  return coalesce(result, jsonb_build_object('flows', '[]'::jsonb, 'total', 0));
end;
$$;

comment on function public.get_utm_flow(date, date) is
  'Cross-tabulated UTM source → content type flow counts for Sankey diagram.';
