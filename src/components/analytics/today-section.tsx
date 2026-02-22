'use client';

import { useState, useEffect, useMemo } from 'react';
import { getEventsDailyRange } from '@/lib/supabase/stats';

function formatNumber(n: number) {
  return n.toLocaleString();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function TodaySection() {
  const [daily, setDaily] = useState<Awaited<ReturnType<typeof getEventsDailyRange>>>([]);
  const [utmTotal, setUtmTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => todayStr(), []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getEventsDailyRange(today, today),
      fetch(`/api/analytics/utm?from=${today}&to=${today}`).then((r) => (r.ok ? r.json() : { total: 0 })),
    ])
      .then(([events, utm]) => {
        setDaily(events);
        setUtmTotal(typeof utm.total === 'number' ? utm.total : 0);
      })
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, [today]);

  const todayViews = useMemo(() => {
    return daily.filter((e) => e.event_type === 'view').reduce((s, e) => s + e.count, 0);
  }, [daily]);
  const todayUpvotes = useMemo(() => {
    return daily.filter((e) => e.event_type === 'upvote').reduce((s, e) => s + e.count, 0);
  }, [daily]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
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

  const displayDate = new Date(today).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="mb-2">
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        {displayDate}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl border p-5 transition-shadow hover:shadow-md"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Today&apos;s views
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent-500)' }}>
            {formatNumber(todayViews)}
          </p>
        </div>
        <div
          className="rounded-xl border p-5 transition-shadow hover:shadow-md"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Today&apos;s upvotes
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {formatNumber(todayUpvotes)}
          </p>
        </div>
        <div
          className="rounded-xl border p-5 transition-shadow hover:shadow-md"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Today&apos;s UTM visits
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {formatNumber(utmTotal ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
