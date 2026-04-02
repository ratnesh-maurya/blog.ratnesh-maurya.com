'use client';

import { getEventsDailyRange, type EventsDailyRow, type StatType } from '@/lib/supabase/stats';
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

interface TodaySectionProps {
  selectedType: 'all' | StatType;
}

export function TodaySection({ selectedType }: TodaySectionProps) {
  const [daily, setDaily] = useState<EventsDailyRow[]>([]);
  const [utmTotal, setUtmTotal] = useState<number | null>(null);
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
        response.ok ? response.json() : { total: 0 }
      ),
    ])
      .then(([events, utm]) => {
        if (!active) return;
        setDaily(events);
        setUtmTotal(typeof utm?.total === 'number' ? utm.total : 0);
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
  }, [selectedDate]);

  const filteredDaily = useMemo(
    () => (selectedType === 'all' ? daily : daily.filter((row) => row.type === selectedType)),
    [daily, selectedType]
  );

  const todayViews = useMemo(() => sumByEventType(filteredDaily, 'view'), [filteredDaily]);
  const todayUpvotes = useMemo(() => sumByEventType(filteredDaily, 'upvote'), [filteredDaily]);
  const isToday = selectedDate === todayStr();
  const dateLabel = displayDateLabel(selectedDate);

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="nb-card-sm p-5"
            style={{
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow-sm)',
              backdropFilter: 'blur(10px) saturate(160%)',
              WebkitBackdropFilter: 'blur(10px) saturate(160%)',
            }}
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
            style={{
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow-sm)',
              backdropFilter: 'blur(10px) saturate(160%)',
              WebkitBackdropFilter: 'blur(10px) saturate(160%)',
            }}
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
            style={{
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow-sm)',
              backdropFilter: 'blur(10px) saturate(160%)',
              WebkitBackdropFilter: 'blur(10px) saturate(160%)',
            }}
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
