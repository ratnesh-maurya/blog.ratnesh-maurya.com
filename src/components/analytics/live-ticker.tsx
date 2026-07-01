'use client';

import { getViewsToday } from '@/lib/supabase/stats';
import { useEffect, useState } from 'react';

/** Live "views today" pill — polls every 60s while the tab is visible. */
export function LiveTicker() {
  const [counts, setCounts] = useState<{ today: number; lastHour: number } | null>(null);

  useEffect(() => {
    const poll = () => {
      if (document.visibilityState !== 'visible') return;
      getViewsToday().then(setCounts).catch(() => { /* keep last value */ });
    };
    poll();
    const timer = window.setInterval(poll, 60000);
    const onVisible = () => { if (document.visibilityState === 'visible') poll(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      if (timer) window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  if (!counts) return null;

  return (
    <div
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow-sm)',
        color: 'var(--text-secondary)',
      }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: 'var(--accent-400)' }}
        />
        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--accent-500)' }} />
      </span>
      <span>
        <strong style={{ color: 'var(--text-primary)' }}>{counts.today.toLocaleString()}</strong> views today
      </span>
      <span style={{ color: 'var(--text-muted)' }}>·</span>
      <span>{counts.lastHour.toLocaleString()} last hour</span>
    </div>
  );
}
