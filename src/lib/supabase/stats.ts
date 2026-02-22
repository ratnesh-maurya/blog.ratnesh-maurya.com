import { supabase } from '@/lib/supabase/client';

export type StatType = 'blog' | 'silly-questions' | 'til' | 'technical-terms' | 'now' | 'about' | 'cheatsheets';

const FOOTER_TYPES: StatType[] = ['blog', 'technical-terms', 'silly-questions', 'cheatsheets'];

export interface StatsRow {
  type: string;
  slug: string;
  views: number;
  upvotes: number;
  reports: number;
  updated_at: string;
}

export async function getStatsByType(type: StatType): Promise<{
  views: Record<string, number>;
  upvotes: Record<string, number>;
  reports: Record<string, number>;
}> {
  const { data, error } = await supabase
    .from('stats')
    .select('slug, views, upvotes, reports')
    .eq('type', type);

  if (error) {
    console.error('getStatsByType error:', error);
    return { views: {}, upvotes: {}, reports: {} };
  }

  const views: Record<string, number> = {};
  const upvotes: Record<string, number> = {};
  const reports: Record<string, number> = {};
  for (const row of data ?? []) {
    views[row.slug] = Number(row.views) || 0;
    upvotes[row.slug] = Number(row.upvotes) || 0;
    reports[row.slug] = Number((row as { reports?: number }).reports) || 0;
  }
  return { views, upvotes, reports };
}

export async function getStatsForSlug(
  type: StatType,
  slug: string
): Promise<{ views: number; upvotes: number; reports: number }> {
  const { data, error } = await supabase
    .from('stats')
    .select('views, upvotes, reports')
    .eq('type', type)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('getStatsForSlug error:', error);
    return { views: 0, upvotes: 0, reports: 0 };
  }
  const row = data as { views?: number; upvotes?: number; reports?: number } | null;
  return {
    views: row ? Number(row.views) : 0,
    upvotes: row ? Number(row.upvotes) : 0,
    reports: row ? Number(row.reports) : 0,
  };
}

export async function incrementStat(
  type: StatType,
  slug: string,
  metric: 'view' | 'upvote' | 'report'
): Promise<{ views: number; upvotes: number; reports: number }> {
  const { data, error } = await supabase.rpc('increment_stat', {
    p_type: type,
    p_slug: slug,
    p_metric: metric,
  });

  if (error) {
    console.error('increment_stat error:', error);
    throw error;
  }

  const result = data as { views: number; upvotes: number; reports: number } | null;
  if (!result) return { views: 0, upvotes: 0, reports: 0 };
  return {
    views: Number(result.views),
    upvotes: Number(result.upvotes),
    reports: Number(result.reports ?? 0),
  };
}

export async function getTotalViews(): Promise<number> {
  const { data, error } = await supabase.from('stats').select('views');

  if (error) {
    console.error('getTotalViews error:', error);
    return 0;
  }

  const total = (data ?? []).reduce((sum, row) => sum + (Number(row.views) || 0), 0);
  return total;
}

export async function getTotalViewsForFooter(): Promise<number> {
  const { data, error } = await supabase
    .from('stats')
    .select('views, type')
    .in('type', FOOTER_TYPES);

  if (error) {
    console.error('getTotalViewsForFooter error:', error);
    return 0;
  }

  const total = (data ?? []).reduce((sum, row) => sum + (Number(row.views) || 0), 0);
  return total;
}

export async function getTotalReports(): Promise<number> {
  const { data, error } = await supabase.from('stats').select('reports');

  if (error) {
    console.error('getTotalReports error:', error);
    return 0;
  }

  const total = (data ?? []).reduce((sum, row) => sum + (Number((row as { reports?: number }).reports) || 0), 0);
  return total;
}

export interface EventsDailyRow {
  day: string;
  event_type: string;
  type: string;
  count: number;
}

export async function getEventsDaily(sinceDays = 90): Promise<EventsDailyRow[]> {
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);
  const sinceStr = since.toISOString().slice(0, 10);
  const { data, error } = await supabase.rpc('get_events_daily', { since: sinceStr });

  if (error) {
    console.error('get_events_daily error:', error);
    return [];
  }

  return (data ?? []).map((r: { day: string; event_type: string; type: string; count: number }) => ({
    day: r.day,
    event_type: r.event_type,
    type: r.type,
    count: Number(r.count) || 0,
  }));
}

export async function getEventsDailyRange(fromStr: string, toStr: string): Promise<EventsDailyRow[]> {
  const { data, error } = await supabase.rpc('get_events_daily', { since: fromStr });

  if (error) {
    console.error('get_events_daily error:', error);
    return [];
  }

  const rows = (data ?? []).map((r: { day: string; event_type: string; type: string; count: number }) => ({
    day: r.day,
    event_type: r.event_type,
    type: r.type,
    count: Number(r.count) || 0,
  }));

  return rows.filter((r: EventsDailyRow) => r.day >= fromStr && r.day <= toStr);
}

export async function getAllStatsForAnalytics(): Promise<{
  byType: Record<StatType, { views: number; upvotes: number; reports: number; slugs: Array<{ slug: string; views: number; upvotes: number }> }>;
  footerTotal: number;
}> {
  const { data, error } = await supabase.from('stats').select('type, slug, views, upvotes, reports');

  if (error) {
    console.error('getAllStatsForAnalytics error:', error);
    return { byType: {} as Record<StatType, { views: number; upvotes: number; reports: number; slugs: Array<{ slug: string; views: number; upvotes: number }> }>, footerTotal: 0 };
  }

  const byType: Record<string, { views: number; upvotes: number; reports: number; slugs: Array<{ slug: string; views: number; upvotes: number }> }> = {};
  let footerTotal = 0;

  for (const row of data ?? []) {
    const t = row.type as StatType;
    if (!byType[t]) {
      byType[t] = { views: 0, upvotes: 0, reports: 0, slugs: [] };
    }
    const v = Number(row.views) || 0;
    const u = Number(row.upvotes) || 0;
    const r = Number((row as { reports?: number }).reports) || 0;
    byType[t].views += v;
    byType[t].upvotes += u;
    byType[t].reports += r;
    byType[t].slugs.push({ slug: row.slug, views: v, upvotes: u });
    if (FOOTER_TYPES.includes(t)) footerTotal += v;
  }

  for (const t of Object.keys(byType)) {
    byType[t].slugs.sort((a, b) => b.views - a.views);
  }

  return { byType: byType as Record<StatType, { views: number; upvotes: number; reports: number; slugs: Array<{ slug: string; views: number; upvotes: number }> }>, footerTotal };
}
