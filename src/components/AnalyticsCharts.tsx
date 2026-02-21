'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  getAllStatsForAnalytics,
  getEventsDaily,
  type StatType,
  type EventsDailyRow,
} from '@/lib/supabase/stats';

const TYPE_LABELS: Record<string, string> = {
  blog: 'Blog',
  'silly-questions': 'Silly Questions',
  til: 'TIL',
  'technical-terms': 'Technical Terms',
  now: 'Now',
  about: 'About',
  cheatsheets: 'Cheatsheets',
};

const CHART_COLORS = [
  'var(--accent-500)',
  'var(--accent-400)',
  'var(--accent-600)',
  '#0ea5e9',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
];

function formatNumber(n: number) {
  return n.toLocaleString();
}

export function AnalyticsCharts() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAllStatsForAnalytics>> | null>(null);
  const [daily, setDaily] = useState<EventsDailyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAllStatsForAnalytics(), getEventsDaily(90)])
      .then(([s, d]) => {
        setStats(s);
        setDaily(d);
      })
      .catch((e) => {
        setError(e?.message ?? 'Failed to load analytics');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
        Loading analytics…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const types = Object.keys(stats.byType) as StatType[];
  const barData = types.map((t) => ({
    name: TYPE_LABELS[t] ?? t,
    views: stats.byType[t].views,
    upvotes: stats.byType[t].upvotes,
  }));

  const pieData = types
    .filter((t) => stats.byType[t].views > 0)
    .map((t) => ({ name: TYPE_LABELS[t] ?? t, value: stats.byType[t].views }));

  const viewsByDay = (() => {
    const viewEvents = daily.filter((e) => e.event_type === 'view');
    const byDay: Record<string, number> = {};
    for (const e of viewEvents) {
      byDay[e.day] = (byDay[e.day] ?? 0) + e.count;
    }
    return Object.entries(byDay)
      .map(([day, count]) => ({ day, views: count }))
      .sort((a, b) => a.day.localeCompare(b.day));
  })();

  const totalViews = types.reduce((s, t) => s + stats.byType[t].views, 0);
  const totalUpvotes = types.reduce((s, t) => s + stats.byType[t].upvotes, 0);
  const totalReports = types.reduce((s, t) => s + stats.byType[t].reports, 0);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Footer total views
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent-500)' }}>
              {formatNumber(stats.footerTotal)}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Blog + Technical Terms + Silly Q + Cheatsheets
            </p>
          </div>
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              All views
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(totalViews)}
            </p>
          </div>
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Total upvotes
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(totalUpvotes)}
            </p>
          </div>
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Reports
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(totalReports)}
            </p>
          </div>
        </div>
      </section>

      {barData.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Views & upvotes by content type
          </h2>
          <div
            className="rounded-xl border p-4 md:p-6"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                    stroke="var(--border)"
                  />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                    formatter={(value: number | undefined) => [formatNumber(value ?? 0)]}
                    labelFormatter={(label) => label}
                  />
                  <Legend />
                  <Bar dataKey="views" name="Views" fill="var(--accent-500)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="upvotes" name="Upvotes" fill="var(--accent-400)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {pieData.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            View share by type
          </h2>
          <div
            className="rounded-xl border p-4 md:p-6"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieData} layout="vertical" margin={{ left: 8, right: 24 }} barCategoryGap="12%">
                  <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                    formatter={(value: number | undefined) => [formatNumber(value ?? 0), 'Views']}
                    labelFormatter={(label) => label}
                  />
                  <Bar dataKey="value" name="Views" radius={[0, 4, 4, 0]}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {viewsByDay.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Views over time (last 90 days)
          </h2>
          <div
            className="rounded-xl border p-4 md:p-6"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    stroke="var(--border)"
                    tickFormatter={(d) => {
                      const date = new Date(d);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                    formatter={(value: number | undefined) => [formatNumber(value ?? 0), 'Views']}
                    labelFormatter={(d) => new Date(d).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    name="Views"
                    stroke="var(--accent-500)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--accent-500)', r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Top content by views
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {types.map((type) => {
            const top = stats.byType[type].slugs.slice(0, 10);
            if (top.length === 0) return null;
            return (
              <div
                key={type}
                className="rounded-xl border overflow-hidden"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {TYPE_LABELS[type] ?? type}
                  </h3>
                </div>
                <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {top.map((row, i) => (
                    <li
                      key={row.slug}
                      className="flex items-center justify-between px-4 py-2.5 text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="truncate mr-2">
                        {i + 1}. {row.slug}
                      </span>
                      <span className="font-medium tabular-nums shrink-0" style={{ color: 'var(--accent-500)' }}>
                        {formatNumber(row.views)} views
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
