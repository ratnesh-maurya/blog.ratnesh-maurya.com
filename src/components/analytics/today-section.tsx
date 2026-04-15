'use client';

import { getEventsDailyRange, getTopPagesByType, type EventsDailyRow, type StatType } from '@/lib/supabase/stats';
import { useEffect, useMemo, useState } from 'react';

function formatNumber(n: number) {
  return n.toLocaleString();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function displayDateLabel(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function sumByEventType(rows: EventsDailyRow[], eventType: 'view' | 'upvote') {
  return rows.filter((row) => row.event_type === eventType).reduce((sum, row) => sum + row.count, 0);
}

function typeLabel(type: 'all' | StatType) {
  if (type === 'all') return 'all content';
  const labels: Record<StatType, string> = {
    blog: 'blog',
    'technical-terms': 'technical terms',
    'silly-questions': 'silly questions',
    cheatsheets: 'cheatsheets',
    til: 'TIL',
    now: 'now',
    about: 'about',
    news: 'news',
  };
  return labels[type] ?? type;
}

const TYPE_LABELS: Record<string, string> = {
  blog: 'Blog',
  news: 'News',
  'technical-terms': 'Tech Terms',
  'silly-questions': 'Silly Q',
  cheatsheets: 'Cheatsheets',
  til: 'TIL',
  now: 'Now',
  about: 'About',
};

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

interface TodaySectionProps {
  selectedType: 'all' | StatType;
}

interface UtmPathEntry {
  path: string;
  count: number;
}

export function TodaySection({ selectedType }: TodaySectionProps) {
  const [daily, setDaily] = useState<EventsDailyRow[]>([]);
  const [utmTotal, setUtmTotal] = useState<number | null>(null);
  const [utmPaths, setUtmPaths] = useState<UtmPathEntry[]>([]);
  const [topPages, setTopPages] = useState<Array<{ type: string; slug: string; views: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => todayStr());

  useEffect(() => {
    setLoading(true);
    setError(null);
    let active = true;

    Promise.all([
      getEventsDailyRange(selectedDate, selectedDate),
      fetch(`/api/analytics/utm?from=${selectedDate}&to=${selectedDate}`).then((response) =>
        response.ok ? response.json() : { total: 0, byPath: [] }
      ),
      getTopPagesByType(selectedType === 'all' ? undefined : selectedType),
    ])
      .then(([events, utm, pages]) => {
        if (!active) return;
        setDaily(events);
        setUtmTotal(typeof utm?.total === 'number' ? utm.total : 0);
        setUtmPaths(Array.isArray(utm?.byPath) ? utm.byPath : []);
        setTopPages(pages);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedDate, selectedType]);

  const filteredDaily = useMemo(
    () => (selectedType === 'all' ? daily : daily.filter((row) => row.type === selectedType)),
    [daily, selectedType]
  );

  const todayViews = useMemo(() => sumByEventType(filteredDaily, 'view'), [filteredDaily]);
  const todayUpvotes = useMemo(() => sumByEventType(filteredDaily, 'upvote'), [filteredDaily]);
  const isToday = selectedDate === todayStr();
  const dateLabel = displayDateLabel(selectedDate);

  // Views breakdown by content type for selected day
  const viewsByType = useMemo(() => {
    const viewRows = daily.filter((r) => r.event_type === 'view');
    const byType: Record<string, number> = {};
    for (const r of viewRows) {
      byType[r.type] = (byType[r.type] ?? 0) + r.count;
    }
    return Object.entries(byType)
      .map(([type, count]) => ({ type, label: TYPE_LABELS[type] ?? type, count }))
      .sort((a, b) => b.count - a.count);
  }, [daily]);

  const glassCard = {
    backgroundColor: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    boxShadow: 'var(--glass-shadow-sm)',
    backdropFilter: 'blur(10px) saturate(160%)',
    WebkitBackdropFilter: 'blur(10px) saturate(160%)',
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="date"
          value={selectedDate}
          max={todayStr()}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm focus:outline-none"
          style={{
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
          }}
        />
        {!isToday && (
          <button
            type="button"
            onClick={() => setSelectedDate(todayStr())}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={glassCard}
          >
            Back to today
          </button>
        )}
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {dateLabel} · {selectedType === 'all' ? 'all content' : typeLabel(selectedType)}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="nb-card-sm p-5 animate-pulse h-28"
              style={{ backgroundColor: 'var(--glass-bg-subtle)' }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="nb-card-sm p-5" style={glassCard}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                {isToday ? "Today's views" : 'Views'}
              </p>
              <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent-500)' }}>
                {formatNumber(todayViews)}
              </p>
            </div>

            <div className="nb-card-sm p-5" style={glassCard}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                {isToday ? "Today's upvotes" : 'Upvotes'}
              </p>
              <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {formatNumber(todayUpvotes)}
              </p>
            </div>

            <div className="nb-card-sm p-5" style={glassCard}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                {isToday ? "Today's UTM visits" : 'UTM visits'}
              </p>
              <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {formatNumber(utmTotal ?? 0)}
              </p>
            </div>
          </div>

          {/* Views by content type */}
          {selectedType === 'all' && viewsByType.length > 0 && (
            <div className="nb-card-sm p-5" style={glassCard}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                Views by content type
              </p>
              <div className="space-y-2">
                {viewsByType.map((item) => {
                  const pct = todayViews > 0 ? Math.max(2, Math.round((item.count / todayViews) * 100)) : 0;
                  return (
                    <div key={item.type} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-20 shrink-0 text-right" style={{ color: 'var(--text-secondary)' }}>
                        {item.label}
                      </span>
                      <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ backgroundColor: 'var(--surface-muted)' }}>
                        <div
                          className="h-full rounded-md flex items-center px-2"
                          style={{ width: `${pct}%`, backgroundColor: 'var(--accent-500)', minWidth: item.count > 0 ? '24px' : '0' }}
                        >
                          {pct > 15 && (
                            <span className="text-[10px] font-bold text-white">{item.count}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold tabular-nums w-8 shrink-0 text-right" style={{ color: 'var(--accent-500)' }}>
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Page-level access: UTM paths for selected day */}
          {utmPaths.length > 0 && (
            <div className="nb-card-sm overflow-hidden" style={glassCard}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Pages accessed (via tracked links)
                </p>
              </div>
              <ul className="divide-y" style={{ borderColor: 'var(--glass-border)' }}>
                {utmPaths.slice(0, 15).map((p, i) => (
                  <li key={p.path} className="flex items-center gap-3 px-4 py-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: i < 3 ? 'var(--glass-bg-subtle)' : 'transparent',
                        color: i < 3 ? 'var(--accent-600)' : 'var(--text-muted)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="truncate flex-1 min-w-0 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {p.path}
                    </span>
                    <span className="font-bold tabular-nums shrink-0 text-xs" style={{ color: 'var(--accent-500)' }}>
                      {p.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top pages (all-time) for context */}
          {topPages.length > 0 && (
            <div className="nb-card-sm overflow-hidden" style={glassCard}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Top pages (all-time) · {selectedType === 'all' ? 'all types' : typeLabel(selectedType)}
                </p>
              </div>
              <ul className="divide-y" style={{ borderColor: 'var(--glass-border)' }}>
                {topPages.slice(0, 10).map((p, i) => (
                  <li key={`${p.type}-${p.slug}`} className="flex items-center gap-3 px-4 py-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: i < 3 ? 'var(--glass-bg-subtle)' : 'transparent',
                        color: i < 3 ? 'var(--accent-600)' : 'var(--text-muted)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="truncate flex-1 min-w-0">
                      {formatSlug(p.slug)}
                    </span>
                    {selectedType === 'all' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
                        {TYPE_LABELS[p.type] ?? p.type}
                      </span>
                    )}
                    <span className="font-bold tabular-nums shrink-0 text-xs" style={{ color: 'var(--accent-500)' }}>
                      {formatNumber(p.views)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
