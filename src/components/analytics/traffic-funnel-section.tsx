'use client';

import { getEventsDailyRange } from '@/lib/supabase/stats';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UtmDay {
  bySource: Array<{ source: string; count: number }>;
  byMedium: Array<{ medium: string; count: number }>;
  byRef: Array<{ ref: string; count: number }>;
  byPath: Array<{ path: string; count: number }>;
  total: number;
}

interface ContentBucket {
  type: string;
  label: string;
  views: number;
  color: string;
}

const CONTENT_COLORS: Record<string, string> = {
  blog: 'var(--accent-500)',
  news: 'var(--accent-400)',
  'technical-terms': 'var(--accent-600)',
  'silly-questions': 'var(--accent-300)',
  til: 'var(--accent-700)',
  cheatsheets: 'var(--accent-200)',
  about: 'var(--accent-100)',
  now: 'var(--accent-800, var(--accent-700))',
};

const CONTENT_LABELS: Record<string, string> = {
  blog: 'Blog',
  news: 'News',
  'technical-terms': 'Tech Terms',
  'silly-questions': 'Silly Q',
  til: 'TIL',
  cheatsheets: 'Cheatsheets',
  about: 'About',
  now: 'Now',
};

const SOURCE_COLORS = [
  'var(--accent-500)', 'var(--accent-400)', 'var(--accent-600)', 'var(--accent-300)',
  'var(--accent-700)', 'var(--accent-200)', 'var(--accent-100)', 'var(--accent-800, var(--accent-700))',
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function FunnelBar({ label, count, total, color, sublabel }: {
  label: string; count: number; total: number; color: string; sublabel?: string;
}) {
  const pct = total > 0 ? Math.max(2, Math.round((count / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-28 shrink-0 text-right">
        <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
        {sublabel && (
          <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>{sublabel}</span>
        )}
      </div>
      <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--surface-muted)' }}>
        <div
          className="h-full rounded-lg flex items-center px-2 transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color, minWidth: count > 0 ? '28px' : '0' }}
        >
          {pct > 12 && (
            <span className="text-[11px] font-bold text-white">{count}</span>
          )}
        </div>
      </div>
      <div className="w-10 shrink-0 text-right">
        <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--accent-500)' }}>{count}</span>
      </div>
    </div>
  );
}

function FunnelConnector() {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-28 shrink-0" />
      <div className="flex-1 flex justify-center">
        <div className="h-6 w-px" style={{ backgroundColor: 'var(--glass-border)' }} />
      </div>
      <div className="w-10 shrink-0" />
    </div>
  );
}

function SectionHead({ title, count, total }: {
  title: string; count: number; total: number; color?: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div
      className="flex items-center justify-between px-4 py-2 rounded-xl mb-3"
      style={{
        backgroundColor: 'var(--glass-bg-subtle)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-500)' }}>
        {title}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-lg font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{count}</span>
        {total > 0 && (
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            ({pct}% of total)
          </span>
        )}
      </div>
    </div>
  );
}

export function TrafficFunnelSection() {
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [events, setEvents] = useState<Awaited<ReturnType<typeof getEventsDailyRange>>>([]);
  const [utm, setUtm] = useState<UtmDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const [evts, utmRes] = await Promise.all([
        getEventsDailyRange(date, date),
        fetch(`/api/analytics/utm?from=${date}&to=${date}`).then((r) =>
          r.ok ? r.json() : { bySource: [], byMedium: [], byRef: [], byPath: [], total: 0 }
        ),
      ]);
      setEvents(evts);
      setUtm(utmRes);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate, fetchData]);

  // ── derived totals ──────────────────────────────────────
  const totalViews = useMemo(
    () => events.filter((e) => e.event_type === 'view').reduce((s, e) => s + e.count, 0),
    [events]
  );

  const contentBuckets: ContentBucket[] = useMemo(() => {
    const byType: Record<string, number> = {};
    for (const e of events) {
      if (e.event_type !== 'view') continue;
      byType[e.type] = (byType[e.type] ?? 0) + e.count;
    }
    return Object.entries(byType)
      .map(([type, views]) => ({
        type,
        label: CONTENT_LABELS[type] ?? type,
        views,
        color: CONTENT_COLORS[type] ?? '#6366f1',
      }))
      .sort((a, b) => b.views - a.views);
  }, [events]);

  const utmTotal = utm?.total ?? 0;
  const sources = utm?.bySource.slice(0, 8) ?? [];
  const refs = utm?.byRef.slice(0, 8) ?? [];
  const topPages = utm?.byPath.slice(0, 10) ?? [];

  const isToday = selectedDate === todayStr();
  const displayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div>
      {/* ── Day picker ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="date"
          value={selectedDate}
          max={todayStr()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm focus:outline-none"
          style={{
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
          }}
        />
        {!isToday && (
          <button
            onClick={() => setSelectedDate(todayStr())}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{
              backgroundColor: 'var(--glass-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow-sm)',
              backdropFilter: 'blur(10px) saturate(160%)',
              WebkitBackdropFilter: 'blur(10px) saturate(160%)',
            }}
          >
            Back to today
          </button>
        )}
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{displayDate}</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--glass-bg-subtle)' }} />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : totalViews === 0 && utmTotal === 0 ? (
        <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm">No traffic recorded for this day.</p>
        </div>
      ) : (
        <div className="space-y-0">

          {/* ── Level 0: Total ── */}
          <div
            className="nb-card p-5 mb-2"
            style={{
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow-sm)',
              backdropFilter: 'blur(10px) saturate(160%)',
              WebkitBackdropFilter: 'blur(10px) saturate(160%)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                  Total views
                </p>
                <p className="text-4xl font-black tabular-nums" style={{ color: 'var(--accent-500)' }}>
                  {totalViews.toLocaleString()}
                </p>
              </div>
              {utmTotal > 0 && (
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                    via tracked links
                  </p>
                  <p className="text-4xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>
                    {utmTotal.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Level 1: Content type ── */}
          {contentBuckets.length > 0 && (
            <>
              <FunnelConnector />
              <div className="nb-card p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
                <SectionHead title="By content type" count={totalViews} total={totalViews} />
                <div className="space-y-2">
                  {contentBuckets.map((b) => (
                    <FunnelBar
                      key={b.type}
                      label={b.label}
                      count={b.views}
                      total={totalViews}
                      color={b.color}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Level 2: UTM source ── */}
          {sources.length > 0 && (
            <>
              <FunnelConnector />
              <div className="nb-card p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
                <SectionHead title="By UTM source" count={utmTotal} total={totalViews} />
                <div className="space-y-2">
                  {sources.map((s, i) => (
                    <FunnelBar
                      key={s.source}
                      label={s.source}
                      count={s.count}
                      total={utmTotal}
                      color={SOURCE_COLORS[i % SOURCE_COLORS.length]}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Level 3: Ref ── */}
          {refs.length > 0 && (
            <>
              <FunnelConnector />
              <div className="nb-card p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
                <SectionHead title="By referral (?ref=)" count={refs.reduce((s, r) => s + r.count, 0)} total={totalViews} />
                <div className="space-y-2">
                  {refs.map((r, i) => (
                    <FunnelBar
                      key={r.ref}
                      label={r.ref}
                      count={r.count}
                      total={refs.reduce((s, x) => s + x.count, 0)}
                      color={SOURCE_COLORS[(i + 3) % SOURCE_COLORS.length]}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Level 4: Top pages ── */}
          {topPages.length > 0 && (
            <>
              <FunnelConnector />
              <div className="nb-card p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
                <SectionHead title="Top landing pages" count={topPages.reduce((s, p) => s + p.count, 0)} total={utmTotal} />
                <div className="space-y-2">
                  {topPages.map((p, i) => (
                    <FunnelBar
                      key={p.path}
                      label={p.path.split('/').pop() ?? p.path}
                      sublabel={p.path}
                      count={p.count}
                      total={topPages.reduce((s, x) => s + x.count, 0)}
                      color={SOURCE_COLORS[(i + 1) % SOURCE_COLORS.length]}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Summary sentence ── */}
          {utmTotal > 0 && (
            <div
              className="mt-4 rounded-xl px-4 py-3 text-sm"
              style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)' }}
            >
              On <strong style={{ color: 'var(--text-primary)' }}>{displayDate}</strong>,
              {' '}<strong style={{ color: 'var(--accent-500)' }}>{totalViews}</strong> total views were recorded.
              {' '}<strong style={{ color: 'var(--text-primary)' }}>{utmTotal}</strong> came via tracked links
              {sources[0] && (
                <> — top source: <strong style={{ color: 'var(--text-primary)' }}>{sources[0].source}</strong> ({sources[0].count})</>
              )}
              {refs[0] && (
                <>, top referral: <strong style={{ color: 'var(--text-primary)' }}>?ref={refs[0].ref}</strong> ({refs[0].count})</>
              )}
              {contentBuckets[0] && (
                <>, most viewed: <strong style={{ color: 'var(--text-primary)' }}>{contentBuckets[0].label}</strong> ({contentBuckets[0].views})</>
              )}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
