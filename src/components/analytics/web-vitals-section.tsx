'use client';

import { getWebVitalsSummary } from '@/lib/supabase/stats';
import { useEffect, useState } from 'react';

type Summary = Awaited<ReturnType<typeof getWebVitalsSummary>>;

// p75 thresholds per Google: good / needs-improvement boundaries
const THRESHOLDS: Record<string, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2500, poor: 4000, unit: 'ms' },
  CLS: { good: 0.1, poor: 0.25, unit: '' },
  INP: { good: 200, poor: 500, unit: 'ms' },
  FCP: { good: 1800, poor: 3000, unit: 'ms' },
  TTFB: { good: 800, poor: 1800, unit: 'ms' },
};

function ratingColor(metric: string, p75: number): string {
  const t = THRESHOLDS[metric];
  if (!t) return 'var(--text-primary)';
  if (p75 <= t.good) return '#059669';
  if (p75 <= t.poor) return '#D97706';
  return '#DC2626';
}

function formatValue(metric: string, value: number): string {
  if (metric === 'CLS') return value.toFixed(3);
  return `${Math.round(value)}ms`;
}

export function WebVitalsSection() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWebVitalsSummary(30)
      .then(setSummary)
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="nb-card-sm p-5 animate-pulse h-40" style={{ backgroundColor: 'var(--glass-bg-subtle)' }} />;
  }
  if (error) {
    return (
      <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }
  if (!summary || summary.byMetric.length === 0) {
    return (
      <div className="nb-card-sm p-6" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No web-vitals samples yet. Real-user metrics start collecting once this deploy is live.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summary.byMetric.map((m) => (
          <div key={m.metric} className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              {m.metric}
            </p>
            <p className="text-xl font-black" style={{ color: ratingColor(m.metric, m.p75) }}>
              {formatValue(m.metric, m.p75)}
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              p75 · {m.count.toLocaleString()} samples · {m.goodPct}% good
            </p>
          </div>
        ))}
      </div>

      {summary.worstLcpPaths.length > 0 && (
        <div className="nb-card-sm p-5" style={{ backgroundColor: 'var(--glass-bg)' }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Slowest pages by LCP (p75)
          </h3>
          <div className="space-y-2">
            {summary.worstLcpPaths.map((p) => (
              <div key={p.path} className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{p.path}</span>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: ratingColor('LCP', p.p75) }}>
                  {Math.round(p.p75)}ms <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({p.count})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
