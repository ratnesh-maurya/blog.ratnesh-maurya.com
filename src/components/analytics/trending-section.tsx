'use client';

import { getTrendingPosts, type StatType } from '@/lib/supabase/stats';
import { useEffect, useState } from 'react';

interface TrendingSectionProps {
  selectedType: 'all' | StatType;
}

type Row = { type: string; slug: string; recent: number; previous: number };

const WINDOWS = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
];

const TYPE_ROUTE: Record<string, string> = {
  blog: '/blog',
  news: '/news',
  til: '/til',
  cheatsheets: '/cheatsheets',
  'technical-terms': '/technical-terms',
  'silly-questions': '/silly-questions',
};

function momentum(row: Row): number {
  if (row.previous === 0) return row.recent > 0 ? Infinity : 0;
  return (row.recent - row.previous) / row.previous;
}

function DeltaBadge({ row }: { row: Row }) {
  const m = momentum(row);
  const isNew = row.previous === 0 && row.recent > 0;
  const up = m > 0.05;
  const down = m < -0.05;
  const color = isNew || up ? 'var(--success, #059669)' : down ? '#DC2626' : 'var(--text-muted)';
  const label = isNew ? 'NEW' : `${m >= 0 ? '+' : ''}${Math.round(m * 100)}%`;
  return (
    <span
      className="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ color, backgroundColor: 'color-mix(in srgb, currentColor 10%, transparent)' }}
    >
      {label}
    </span>
  );
}

export function TrendingSection({ selectedType }: TrendingSectionProps) {
  const [days, setDays] = useState(7);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTrendingPosts(days)
      .then(setRows)
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, [days]);

  if (error) {
    return (
      <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  const filtered = rows.filter((r) => selectedType === 'all' || r.type === selectedType);
  // Rank by momentum first (breakouts), then recent volume
  const ranked = [...filtered].sort((a, b) => {
    const ma = momentum(a) === Infinity ? 10 : momentum(a);
    const mb = momentum(b) === Infinity ? 10 : momentum(b);
    if (mb !== ma) return mb - ma;
    return b.recent - a.recent;
  }).slice(0, 10);
  const topByVolume = [...filtered].sort((a, b) => b.recent - a.recent).slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {WINDOWS.map((w) => (
          <button
            key={w.days}
            type="button"
            onClick={() => setDays(w.days)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'var(--glass-bg)',
              color: days === w.days ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--glass-border)',
              boxShadow: days === w.days ? 'var(--glass-shadow-sm)' : 'none',
            }}
          >
            Last {w.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="nb-card-sm p-5 animate-pulse h-48" style={{ backgroundColor: 'var(--glass-bg-subtle)' }} />
      ) : filtered.length === 0 ? (
        <div className="nb-card-sm p-6" style={{ backgroundColor: 'var(--glass-bg)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No view events in this window yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[{ title: 'Gaining momentum', sub: `vs previous ${days} days`, data: ranked },
            { title: 'Most viewed', sub: `last ${days} days`, data: topByVolume }].map((col) => (
            <div key={col.title} className="nb-card-sm p-5" style={{ backgroundColor: 'var(--glass-bg)' }}>
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{col.title}</h3>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{col.sub}</span>
              </div>
              <ol className="space-y-2.5">
                {col.data.map((row, i) => (
                  <li key={`${row.type}:${row.slug}`} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-5 flex-shrink-0 text-right" style={{ color: 'var(--text-muted)' }}>
                      {i + 1}
                    </span>
                    <a
                      href={`${TYPE_ROUTE[row.type] ?? ''}/${row.slug}`}
                      className="text-xs font-medium truncate flex-1 hover:underline"
                      style={{ color: 'var(--text-secondary)' }}
                      title={row.slug}
                    >
                      {row.slug.replace(/-/g, ' ')}
                    </a>
                    <span className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                      {row.recent.toLocaleString()}
                    </span>
                    <DeltaBadge row={row} />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
