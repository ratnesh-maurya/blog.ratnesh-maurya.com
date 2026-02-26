'use client';

import { getAllStatsForAnalytics, type StatType } from '@/lib/supabase/stats';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function formatNumber(n: number) {
  return n.toLocaleString();
}

const TYPE_LABELS: Record<string, string> = {
  blog: 'Blog',
  'technical-terms': 'Tech Terms',
  'silly-questions': 'Silly Q',
  cheatsheets: 'Cheatsheets',
  til: 'TIL',
  now: 'Now',
  about: 'About',
};

const TYPE_COLORS: Record<string, string> = {
  blog: 'var(--accent-500)',
  'technical-terms': 'var(--accent-400)',
  'silly-questions': 'var(--accent-600)',
  cheatsheets: 'var(--accent-300)',
  til: 'var(--accent-700)',
  now: 'var(--accent-200)',
  about: 'var(--accent-100)',
};

export function ContentOverviewSection() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAllStatsForAnalytics>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllStatsForAnalytics()
      .then(setStats)
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-5 animate-pulse h-48"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          />
        ))}
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

  if (!stats) return null;

  const types = Object.keys(stats.byType) as StatType[];

  const summaryData = types
    .map((t) => ({
      name: TYPE_LABELS[t] ?? t,
      type: t,
      posts: stats.byType[t].slugs.length,
      views: stats.byType[t].views,
      upvotes: stats.byType[t].upvotes,
      avgViews: stats.byType[t].slugs.length > 0
        ? Math.round(stats.byType[t].views / stats.byType[t].slugs.length)
        : 0,
    }))
    .filter((d) => d.posts > 0)
    .sort((a, b) => b.views - a.views);

  const totalPosts = summaryData.reduce((s, d) => s + d.posts, 0);

  return (
    <div className="space-y-6">
      {/* Summary cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryData.slice(0, 4).map((d) => (
          <div
            key={d.type}
            className="rounded-xl border p-4 transition-shadow hover:shadow-md"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              {d.name}
            </p>
            <p className="text-xl font-bold tabular-nums" style={{ color: 'var(--accent-500)' }}>
              {formatNumber(d.posts)}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {formatNumber(d.avgViews)} avg views
            </p>
          </div>
        ))}
      </div>

      {/* Total and chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown bar chart */}
        <div
          className="rounded-xl border p-4 md:p-6"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Content by type
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            {formatNumber(totalPosts)} total pieces of content
          </p>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} stroke="var(--border)" />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  stroke="var(--border)"
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  formatter={(value: number | undefined) => [formatNumber(value ?? 0), 'Posts']}
                />
                <Bar dataKey="posts" radius={[0, 4, 4, 0]}>
                  {summaryData.map((d) => (
                    <Cell key={d.type} fill={TYPE_COLORS[d.type] ?? 'var(--accent-500)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement table */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Engagement breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Type
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Posts
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Views
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Upvotes
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>
                    Avg views
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((d) => (
                  <tr key={d.type} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>{d.name}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums" style={{ color: 'var(--text-secondary)' }}>{formatNumber(d.posts)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-medium" style={{ color: 'var(--accent-500)' }}>{formatNumber(d.views)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums" style={{ color: 'var(--text-secondary)' }}>{formatNumber(d.upvotes)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>{formatNumber(d.avgViews)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
