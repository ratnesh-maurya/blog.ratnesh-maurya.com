'use client';

import { useEffect, useState } from 'react';

interface ScRow { key: string; clicks: number; impressions: number; ctr: number; position: number }
interface ScData {
  configured: boolean;
  error?: string;
  startDate?: string;
  endDate?: string;
  totals?: { clicks: number; impressions: number; ctr: number; position: number };
  queries?: ScRow[];
  pages?: ScRow[];
}

function ScTable({ title, rows, keyLabel }: { title: string; rows: ScRow[]; keyLabel: string }) {
  return (
    <div className="nb-card-sm p-5 overflow-x-auto" style={{ backgroundColor: 'var(--glass-bg)' }}>
      <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {rows.length === 0 ? (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No rows returned.</p>
      ) : (
        <table className="w-full text-xs" style={{ color: 'var(--text-secondary)' }}>
          <thead>
            <tr className="text-left" style={{ color: 'var(--text-muted)' }}>
              <th className="pb-2 font-semibold">{keyLabel}</th>
              <th className="pb-2 font-semibold text-right">Clicks</th>
              <th className="pb-2 font-semibold text-right">Impr.</th>
              <th className="pb-2 font-semibold text-right">CTR</th>
              <th className="pb-2 font-semibold text-right">Pos.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} style={{ borderTop: '1px solid var(--glass-border)' }}>
                <td className="py-1.5 pr-3 max-w-[260px] truncate" title={r.key}>{r.key}</td>
                <td className="py-1.5 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>{r.clicks.toLocaleString()}</td>
                <td className="py-1.5 text-right">{r.impressions.toLocaleString()}</td>
                <td className="py-1.5 text-right">{r.ctr}%</td>
                <td className="py-1.5 text-right">{r.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function SearchConsoleSection() {
  const [data, setData] = useState<ScData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/search-console')
      .then(async (res) => setData(await res.json().catch(() => ({ configured: false }))))
      .catch(() => setData({ configured: false }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="nb-card-sm p-5 animate-pulse h-40" style={{ backgroundColor: 'var(--glass-bg-subtle)' }} />;
  }

  if (!data || !data.configured) {
    return (
      <div className="nb-card-sm p-6" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Not connected yet</p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Add the indexing service account to the Search Console property (Settings → Users, Full permission) and set
          GOOGLE_INDEXING_CLIENT_EMAIL / GOOGLE_INDEXING_PRIVATE_KEY — queries, impressions, CTR, and positions will
          appear here automatically.
        </p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="nb-card-sm p-6" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Search Console error</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{data.error}</p>
      </div>
    );
  }

  const totals = data.totals!;
  const cards = [
    { label: 'Clicks', value: totals.clicks.toLocaleString() },
    { label: 'Impressions', value: totals.impressions.toLocaleString() },
    { label: 'CTR', value: `${totals.ctr}%` },
    { label: 'Avg position', value: String(totals.position) },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{c.label}</p>
            <p className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{c.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScTable title="Top search queries" rows={data.queries ?? []} keyLabel="Query" />
        <ScTable title="Top pages in search" rows={data.pages ?? []} keyLabel="Page" />
      </div>
      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
        Google Search Console · {data.startDate} → {data.endDate} (data lags ~2 days)
      </p>
    </div>
  );
}
