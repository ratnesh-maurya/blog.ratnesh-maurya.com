'use client';

import { getAllStatsForAnalytics, getEventsDailyRange, type EventsDailyRow, type StatType } from '@/lib/supabase/stats';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const TYPE_LABELS: Record<string, string> = {
  blog: 'Blog',
  'silly-questions': 'Silly Questions',
  til: 'TIL',
  'technical-terms': 'Technical Terms',
  now: 'Now',
  about: 'About',
  cheatsheets: 'Cheatsheets',
};

function formatNumber(n: number) {
  return n.toLocaleString();
}

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

const LAST_DAYS = 30;

function getDefaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (LAST_DAYS - 1));
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function PostViewsRangeSection() {
  const [daily, setDaily] = useState<EventsDailyRow[]>([]);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAllStatsForAnalytics>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState(() => getDefaultRange().from);
  const [toDate, setToDate] = useState(() => getDefaultRange().to);

  const fetchData = useCallback((from: string, to: string) => {
    setLoading(true);
    setError(null);
    Promise.all([
      getEventsDailyRange(from, to),
      getAllStatsForAnalytics(),
    ])
      .then(([events, s]) => {
        setDaily(events);
        setStats(s);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load');
        setDaily([]);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData(fromDate, toDate);
  }, [fromDate, toDate, fetchData]);

  const viewsByDay = useMemo(() => {
    const viewEvents = daily.filter((e) => e.event_type === 'view');
    const byDay: Record<string, number> = {};
    for (const e of viewEvents) {
      byDay[e.day] = (byDay[e.day] ?? 0) + e.count;
    }
    return Object.entries(byDay)
      .map(([day, count]) => ({ day, views: count }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [daily]);

  const byType = useMemo(() => {
    const viewEvents = daily.filter((e) => e.event_type === 'view');
    const upEvents = daily.filter((e) => e.event_type === 'upvote');
    const byTypeView: Record<string, number> = {};
    const byTypeUp: Record<string, number> = {};
    for (const e of viewEvents) {
      byTypeView[e.type] = (byTypeView[e.type] ?? 0) + e.count;
    }
    for (const e of upEvents) {
      byTypeUp[e.type] = (byTypeUp[e.type] ?? 0) + e.count;
    }
    const types = new Set([...Object.keys(byTypeView), ...Object.keys(byTypeUp)]);
    return Array.from(types).map((t) => ({
      name: TYPE_LABELS[t] ?? t,
      views: byTypeView[t] ?? 0,
      upvotes: byTypeUp[t] ?? 0,
    }));
  }, [daily]);

  if (loading && viewsByDay.length === 0 && byType.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Date range picker */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>From</label>
        <input
          type="date"
          value={fromDate}
          max={toDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        />
        <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>To</label>
        <input
          type="date"
          value={toDate}
          min={fromDate}
          max={todayStr()}
          onChange={(e) => setToDate(e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        />
        <button
          onClick={() => { setFromDate(getDefaultRange().from); setToDate(getDefaultRange().to); }}
          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
        >
          Last 30 days
        </button>
      </div>

      {viewsByDay.length > 0 && (
        <div className="rounded-xl border p-4 md:p-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Views over time
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  stroke="var(--border)"
                  tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  formatter={(value: number | undefined) => [formatNumber(value ?? 0), 'Views']}
                  labelFormatter={(d) => new Date(d).toLocaleDateString()}
                />
                <Line type="monotone" dataKey="views" name="Views" stroke="var(--accent-500)" strokeWidth={2} dot={{ fill: 'var(--accent-500)', r: 2 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {byType.length > 0 && (
        <div className="rounded-xl border p-4 md:p-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Views & upvotes by type (range)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  formatter={(value: number | undefined) => [formatNumber(value ?? 0)]}
                />
                <Legend />
                <Bar dataKey="views" name="Views" fill="var(--accent-500)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="upvotes" name="Upvotes" fill="var(--accent-400)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {stats && (
        <div>
          <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Top content by views (all time)
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(Object.keys(stats.byType) as StatType[]).map((type) => {
              const top = stats.byType[type].slugs.slice(0, 8);
              if (top.length === 0) return null;
              return (
                <div key={type} className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{TYPE_LABELS[type] ?? type}</span>
                    <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{stats.byType[type].slugs.length} items</span>
                  </div>
                  <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {top.map((row, i) => (
                      <li key={row.slug} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" style={{ color: 'var(--text-secondary)' }}>
                        <span
                          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                          style={{
                            backgroundColor: i < 3 ? 'var(--accent-50)' : 'transparent',
                            color: i < 3 ? 'var(--accent-600)' : 'var(--text-muted)',
                          }}
                        >
                          {i + 1}
                        </span>
                        <span className="truncate flex-1 min-w-0">{formatSlug(row.slug)}</span>
                        <span className="font-medium tabular-nums shrink-0 text-xs" style={{ color: 'var(--accent-500)' }}>
                          {formatNumber(row.views)}
                        </span>
                        {row.upvotes > 0 && (
                          <span className="tabular-nums shrink-0 text-xs flex items-center gap-0.5" style={{ color: 'var(--text-muted)' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(-90 12 12)" /></svg>
                            {formatNumber(row.upvotes)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewsByDay.length === 0 && byType.length === 0 && !loading && (
        <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No view events in this date range.</p>
        </div>
      )}
    </div>
  );
}
