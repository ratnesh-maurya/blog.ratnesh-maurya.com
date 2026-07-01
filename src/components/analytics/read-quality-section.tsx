'use client';

import { getReadQuality, type StatType } from '@/lib/supabase/stats';
import { useEffect, useState } from 'react';

interface ReadQualitySectionProps {
  selectedType: 'all' | StatType;
}

type Row = { type: string; slug: string; views: number; read_half: number; read_complete: number };

export function ReadQualitySection({ selectedType }: ReadQualitySectionProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReadQuality(30)
      .then(setRows)
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="nb-card-sm p-5 animate-pulse h-48" style={{ backgroundColor: 'var(--glass-bg-subtle)' }} />;
  }
  if (error) {
    return (
      <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  const filtered = rows
    .filter((r) => selectedType === 'all' || r.type === selectedType)
    .map((r) => ({
      ...r,
      halfRate: r.views > 0 ? Math.min(100, Math.round((r.read_half / r.views) * 100)) : 0,
      completeRate: r.views > 0 ? Math.min(100, Math.round((r.read_complete / r.views) * 100)) : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 12);

  if (filtered.length === 0) {
    return (
      <div className="nb-card-sm p-6" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No engagement data yet. Read-depth events (50% / 90% scroll) start collecting once this deploy is live —
          give it a few days of traffic.
        </p>
      </div>
    );
  }

  return (
    <div className="nb-card-sm p-5" style={{ backgroundColor: 'var(--glass-bg)' }}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Completion rate — views vs actually read
        </h3>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>last 30 days · min 5 views</span>
      </div>
      <div className="space-y-3">
        {filtered.map((row) => (
          <div key={`${row.type}:${row.slug}`}>
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }} title={row.slug}>
                {row.slug.replace(/-/g, ' ')}
              </span>
              <span className="text-[11px] flex-shrink-0 font-semibold" style={{ color: 'var(--text-muted)' }}>
                {row.views} views · {row.halfRate}% reach half · {row.completeRate}% finish
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden flex" style={{ backgroundColor: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border)' }}>
              <div style={{ width: `${row.completeRate}%`, backgroundColor: 'var(--accent-500)' }} />
              <div style={{ width: `${Math.max(0, row.halfRate - row.completeRate)}%`, backgroundColor: 'var(--accent-200)' }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
        Dark bar = readers who finished (90% scroll) · light bar = reached halfway. Low completion on high-view posts
        signals a mismatch between the hook and the content.
      </p>
    </div>
  );
}
