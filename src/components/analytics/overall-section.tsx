'use client';

import { useState, useEffect } from 'react';
import { getAllStatsForAnalytics, type StatType } from '@/lib/supabase/stats';

function formatNumber(n: number) {
  return n.toLocaleString();
}

const CARD_STYLES = [
  { label: 'Footer total views', sub: 'Blog + Technical Terms + Silly Q + Cheatsheets', accent: true },
  { label: 'All views', sub: 'Across all content types', accent: false },
  { label: 'Total upvotes', sub: 'All time', accent: false },
  { label: 'Reports', sub: 'All time', accent: false },
];

export function OverallSection() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-5 animate-pulse h-28"
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
  const totalViews = types.reduce((s, t) => s + stats.byType[t].views, 0);
  const totalUpvotes = types.reduce((s, t) => s + stats.byType[t].upvotes, 0);
  const totalReports = types.reduce((s, t) => s + stats.byType[t].reports, 0);
  const values = [stats.footerTotal, totalViews, totalUpvotes, totalReports];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_STYLES.map((style, i) => (
        <div
          key={style.label}
          className="rounded-xl border p-5 transition-shadow hover:shadow-md"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            {style.label}
          </p>
          <p
            className="text-2xl font-bold tabular-nums"
            style={style.accent ? { color: 'var(--accent-500)' } : { color: 'var(--text-primary)' }}
          >
            {formatNumber(values[i] ?? 0)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {style.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
