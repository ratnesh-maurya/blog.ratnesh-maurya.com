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
    {
      loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
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
      )
    }
    backdropFilter: 'blur(10px) saturate(160%)',
      WebkitBackdropFilter: 'blur(10px) saturate(160%)',
        }}
className = "nb-card-sm p-5 animate-pulse h-28"
style = {{ backgroundColor: 'var(--glass-bg-subtle)' }}
            />
          ))}
      </div >
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
    </div >
  );
}
