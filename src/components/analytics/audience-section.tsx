'use client';

import { getReferrerBreakdown } from '@/lib/supabase/stats';
import { useEffect, useState } from 'react';

type Breakdown = Awaited<ReturnType<typeof getReferrerBreakdown>>;

const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
];

/** Classify a raw referrer URL into a channel bucket. */
function classifyReferrer(referrer: string): string {
  if (referrer === '(direct)') return 'Direct';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    if (/google\.|bing\.com|duckduckgo|search\.brave|yandex|baidu/.test(host)) return 'Organic search';
    if (/linkedin\.com|twitter\.com|x\.com|t\.co|facebook|instagram|reddit|news\.ycombinator|lobste\.rs|peerlist/.test(host)) return 'Social / community';
    return 'Referral';
  } catch {
    return 'Referral';
  }
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const COUNTRY_NAME: Record<string, string> = {
  IN: 'India', US: 'United States', GB: 'United Kingdom', DE: 'Germany', CA: 'Canada',
  AU: 'Australia', SG: 'Singapore', NL: 'Netherlands', FR: 'France', JP: 'Japan',
  BR: 'Brazil', ID: 'Indonesia', PK: 'Pakistan', BD: 'Bangladesh', NG: 'Nigeria',
};

function BarList({ title, items, note }: {
  title: string;
  items: Array<{ label: string; count: number }>;
  note?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="nb-card-sm p-5" style={{ backgroundColor: 'var(--glass-bg)' }}>
      <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {items.length === 0 ? (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No data in this range yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs font-medium truncate w-36 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} title={item.label}>
                {item.label}
              </span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--glass-bg-subtle)' }}>
                <div className="h-full rounded-full" style={{ width: `${(item.count / max) * 100}%`, backgroundColor: 'var(--accent-400)' }} />
              </div>
              <span className="text-xs font-semibold w-12 text-right flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                {item.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
      {note && <p className="text-[11px] mt-3" style={{ color: 'var(--text-muted)' }}>{note}</p>}
    </div>
  );
}

export function AudienceSection() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Breakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const to = new Date();
    const from = new Date(to.getTime() - days * 86400000);
    getReferrerBreakdown(isoDate(from), isoDate(to))
      .then(setData)
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

  // Channel rollup from raw referrers
  const channels = new Map<string, number>();
  for (const r of data?.byReferrer ?? []) {
    const c = classifyReferrer(r.referrer);
    channels.set(c, (channels.get(c) ?? 0) + r.count);
  }
  const channelItems = [...channels.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  const referrerItems = (data?.byReferrer ?? [])
    .filter((r) => r.referrer !== '(direct)')
    .slice(0, 10)
    .map((r) => {
      let label = r.referrer;
      try { label = new URL(r.referrer).hostname.replace(/^www\./, ''); } catch { /* keep raw */ }
      return { label, count: r.count };
    });

  const deviceItems = (data?.byDevice ?? []).map((d) => ({
    label: d.device.charAt(0).toUpperCase() + d.device.slice(1),
    count: d.count,
  }));

  const countryItems = (data?.byCountry ?? [])
    .filter((c) => c.country !== 'unknown')
    .slice(0, 10)
    .map((c) => ({ label: COUNTRY_NAME[c.country] ?? c.country, count: c.count }));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r.days}
            type="button"
            onClick={() => setDays(r.days)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'var(--glass-bg)',
              color: days === r.days ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--glass-border)',
              boxShadow: days === r.days ? 'var(--glass-shadow-sm)' : 'none',
            }}
          >
            Last {r.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="nb-card-sm p-5 animate-pulse h-48" style={{ backgroundColor: 'var(--glass-bg-subtle)' }} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BarList
            title="Traffic channels"
            items={channelItems}
            note="Classified from the browser referrer: search engines → organic, social platforms → social, everything else → referral. Referrer capture starts with this deploy."
          />
          <BarList title="Top referring sites" items={referrerItems} />
          <BarList title="Devices" items={deviceItems} />
          <BarList title="Countries" items={countryItems} />
        </div>
      )}
    </div>
  );
}
