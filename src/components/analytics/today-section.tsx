'use client';

import { getEventsDailyRange, type EventsDailyRow } from '@/lib/supabase/stats';
import { useCallback, useEffect, useMemo, useState } from 'react';

function formatNumber(n: number) {
  return n.toLocaleString();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

interface TodaySectionProps {
  selectedType: 'all' | import('@/lib/supabase/stats').StatType;
}

export function TodaySection({ selectedType }: TodaySectionProps) {
  const [daily, setDaily] = useState<Awaited<ReturnType<typeof getEventsDailyRange>>>([]);
  const [utmTotal, setUtmTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => todayStr());

  const fetchData = useCallback((date: string) => {
    setLoading(true);
    setError(null);
    Promise.all([
      getEventsDailyRange(date, date),
      fetch(`/api/analytics/utm?from=${date}&to=${date}`).then((r) => (r.ok ? r.json() : { total: 0 })),
    ])
      .then(([events, utm]) => {
        setDaily(events);
        setUtmTotal(typeof utm.total === 'number' ? utm.total : 0);
      })
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate, fetchData]);

  const filteredDaily: EventsDailyRow[] = useMemo(
    () => (selectedType === 'all' ? daily : daily.filter((e) => e.type === selectedType)),
    [daily, selectedType]
  );

  const todayViews = useMemo(() => {
    return filteredDaily.filter((e) => e.event_type === 'view').reduce((s, e) => s + e.count, 0);
  }, [filteredDaily]);
  const todayUpvotes = useMemo(() => {
    return filteredDaily.filter((e) => e.event_type === 'upvote').reduce((s, e) => s + e.count, 0);
  }, [filteredDaily]);

  const displayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  });
  const isToday = selectedDate === todayStr();

  return (
    <div className="mb-2">
      {/* Date picker row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="date"
          value={selectedDate}
          max={todayStr()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm focus:outline-none"
          style={{
            backgroundColor: 'var(--nb-surface-card)',
            border: '1px solid var(--nb-border)',
            color: 'var(--text-primary)',
          }}
        />
        {!isToday && (
          <button
            onClick={() => setSelectedDate(todayStr())}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'var(--nb-card-3)', color: '#1C1C1A', border: '1px solid var(--nb-border)' }}
          >
            Back to today
          </button>
        )}
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {displayDate}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="nb-card-sm p-5 animate-pulse h-28"
              style={{ backgroundColor: 'var(--nb-card-5)' }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--nb-surface-card)' }}>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="nb-card-sm p-5"
            style={{ backgroundColor: 'var(--nb-card-0)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              {isToday ? "Today's views" : 'Views'}
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent-500)' }}>
              {formatNumber(todayViews)}
            </p>
          </div>
          <div
            className="nb-card-sm p-5"
            style={{ backgroundColor: 'var(--nb-card-1)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              {isToday ? "Today's upvotes" : 'Upvotes'}
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(todayUpvotes)}
            </p>
          </div>
          <div
            className="nb-card-sm p-5"
            style={{ backgroundColor: 'var(--nb-card-2)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              {isToday ? "Today's UTM visits" : 'UTM visits'}
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(utmTotal ?? 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
