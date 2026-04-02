'use client';

import { getEventsDailyRange, type EventsDailyRow, type StatType } from '@/lib/supabase/stats';
import { useEffect, useMemo, useState } from 'react';

function formatNumber(n: number) {
  return n.toLocaleString();
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateStr(date: Date) {
  return date.toISOString().slice(0, 10);
}

const TYPE_LABELS: Record<string, string> = {
  blog: 'Blog',
  'technical-terms': 'Tech terms',
  'silly-questions': 'Silly Q',
  cheatsheets: 'Cheatsheets',
  til: 'TIL',
  now: 'Now',
  about: 'About',
};

function sumEvents(rows: EventsDailyRow[], eventType: 'view' | 'upvote') {
  return rows.filter((r) => r.event_type === eventType).reduce((s, r) => s + r.count, 0);
}

export interface TopInsightsStripProps {
  selectedType: 'all' | StatType;
}

export function TopInsightsStrip({ selectedType }: TopInsightsStripProps) {
  const [rows, setRows] = useState<EventsDailyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { prevFrom, prevTo, curFrom, curTo } = useMemo(() => {
    // Windows: prev 7 days, then current 7 days, both inclusive.
    // Example: if today is 2026-03-19:
    // current = [today-6 .. today], prev = [today-13 .. today-7]
    const today = new Date();
    const curToDate = new Date(today.toISOString().slice(0, 10) + 'T00:00:00');
    const curFromDate = addDays(curToDate, -6);
    const prevToDate = addDays(curFromDate, -1);
    const prevFromDate = addDays(prevToDate, -6);
    return {
      prevFrom: toDateStr(prevFromDate),
      prevTo: toDateStr(prevToDate),
      curFrom: toDateStr(curFromDate),
      curTo: toDateStr(curToDate),
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Fetch a single range covering both windows for efficiency
    getEventsDailyRange(prevFrom, curTo)
      .then(setRows)
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, [prevFrom, curTo]);

  const filtered = useMemo(
    () => (selectedType === 'all' ? rows : rows.filter((r) => r.type === selectedType)),
    [rows, selectedType]
  );

  const { curRows, prevRows } = useMemo(() => {
    const prev = filtered.filter((r) => r.day >= prevFrom && r.day <= prevTo);
    const cur = filtered.filter((r) => r.day >= curFrom && r.day <= curTo);
    return { curRows: cur, prevRows: prev };
  }, [filtered, prevFrom, prevTo, curFrom, curTo]);

  const curViews = useMemo(() => sumEvents(curRows, 'view'), [curRows]);
  const prevViews = useMemo(() => sumEvents(prevRows, 'view'), [prevRows]);
  const curUpvotes = useMemo(() => sumEvents(curRows, 'upvote'), [curRows]);
  const prevUpvotes = useMemo(() => sumEvents(prevRows, 'upvote'), [prevRows]);

  const topType = useMemo(() => {
    const byType: Record<string, number> = {};
    for (const r of curRows) {
      if (r.event_type !== 'view') continue;
      byType[r.type] = (byType[r.type] ?? 0) + r.count;
    }
    const entries = Object.entries(byType).sort((a, b) => b[1] - a[1]);
    const [type, views] = entries[0] ?? [];
    if (!type) return null;
    return { type, label: TYPE_LABELS[type] ?? type, views: views ?? 0 };
  }, [curRows]);

  const deltaPct = (cur: number, prev: number) => {
    if (prev <= 0) return cur > 0 ? 100 : 0;
    return Math.round(((cur - prev) / prev) * 100);
  };

  const viewsDelta = deltaPct(curViews, prevViews);
  const upvotesDelta = deltaPct(curUpvotes, prevUpvotes);

  const rangeLabel = `${new Date(curFrom + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}–${new Date(curTo + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

  return (
    <div
      className="nb-card p-4 md:p-5"
      style={{
        backgroundColor: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow-sm)',
        backdropFilter: 'blur(10px) saturate(160%)',
        WebkitBackdropFilter: 'blur(10px) saturate(160%)',
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Top insights
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Last 7 days ({rangeLabel}) vs previous 7 days
          </p>
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Uses Supabase events (views/upvotes)
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="nb-card-sm p-4 h-20 animate-pulse"
              style={{ backgroundColor: 'var(--glass-bg-subtle)' }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
          <p className="text-sm text-red-500">{error}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Try widening the range from the “Post views” section if data is sparse.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Views (7d)
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-xl font-bold tabular-nums" style={{ color: 'var(--accent-500)' }}>
                {formatNumber(curViews)}
              </p>
              <span
                className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: viewsDelta >= 0 ? 'var(--glass-bg-subtle)' : 'rgba(185, 28, 28, 0.08)',
                  color: viewsDelta >= 0 ? 'var(--accent-700)' : 'rgb(185 28 28)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {viewsDelta >= 0 ? '+' : ''}
                {viewsDelta}%
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Prev: {formatNumber(prevViews)}
            </p>
          </div>

          <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Upvotes (7d)
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {formatNumber(curUpvotes)}
              </p>
              <span
                className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: upvotesDelta >= 0 ? 'var(--glass-bg-subtle)' : 'rgba(185, 28, 28, 0.08)',
                  color: upvotesDelta >= 0 ? 'var(--accent-700)' : 'rgb(185 28 28)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {upvotesDelta >= 0 ? '+' : ''}
                {upvotesDelta}%
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Prev: {formatNumber(prevUpvotes)}
            </p>
          </div>

          <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Top type (views)
            </p>
            {topType ? (
              <>
                <p className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {topType.label}
                </p>
                <p className="text-xs mt-1 tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {formatNumber(topType.views)} views in last 7 days
                </p>
              </>
            ) : (
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                Not enough data yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
