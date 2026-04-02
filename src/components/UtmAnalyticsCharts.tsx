'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const UTM_CHART_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#f97316',
  '#14b8a6',
  '#a855f7',
];

export interface UtmAnalyticsData {
  bySource:   Array<{ source: string; count: number }>;
  byMedium:   Array<{ medium: string; count: number }>;
  byCampaign: Array<{ campaign: string; count: number }>;
  byContent:  Array<{ content: string; count: number }>;
  byTerm:     Array<{ term: string; count: number }>;
  byRef:      Array<{ ref: string; count: number }>;
  byPath:     Array<{ path: string; count: number }>;
  daily: Array<{ day: string; count: number }>;
  total: number;
  from: string;
  to: string;
}

function formatNumber(n: number) {
  return n.toLocaleString();
}

function getDefaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 89);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function UtmAnalyticsCharts() {
  const [data, setData] = useState<UtmAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/analytics/utm?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || 'Failed to load UTM analytics');
      }
      const j = await res.json();
      setData(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { from: f, to: t } = getDefaultDateRange();
    setFrom(f);
    setTo(t);
    load(f, t);
  }, [load]);

  const handleApplyRange = () => {
    if (from && to) load(from, to);
  };

  if (loading && !data) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
        Loading UTM analytics…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            UTM traffic (by source, medium, campaign)
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-sm"
                style={{ border: '1px solid var(--nb-border)', backgroundColor: 'var(--nb-surface-card)', color: 'var(--text-primary)' }}
              />
            </label>
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-sm"
                style={{ border: '1px solid var(--nb-border)', backgroundColor: 'var(--nb-surface-card)', color: 'var(--text-primary)' }}
              />
            </label>
            <button
              type="button"
              onClick={handleApplyRange}
              className="nb-btn text-sm"
              style={{ backgroundColor: 'var(--nb-card-2)', color: '#1C1C1A' }}
            >
              Apply
            </button>
          </div>
        </div>

        {error && (
          <div className="nb-card-sm p-4 mb-6" style={{ backgroundColor: 'var(--nb-surface-card)' }}>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {data && (
          <>
            <div className="nb-card p-5 mb-6" style={{ backgroundColor: 'var(--nb-card-0)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                Total UTM visits (date range)
              </p>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-500)' }}>
                {formatNumber(data.total)}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {data.from} → {data.to}
              </p>
            </div>

            {data.bySource.length > 0 && (
              <div className="nb-card p-4 md:p-6 mb-8" style={{ backgroundColor: 'var(--nb-card-1)' }}>
                <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  By UTM Source
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.bySource} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="source" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--nb-border)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                        }}
                        formatter={(value: number | undefined) => [value != null ? formatNumber(value) : '—', 'Visits']}
                        labelFormatter={(label) => `Source: ${label}`}
                      />
                      <Bar dataKey="count" name="Visits" radius={[4, 4, 0, 0]}>
                        {data.bySource.map((_, i) => (
                          <Cell key={i} fill={UTM_CHART_COLORS[i % UTM_CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {data.byMedium.length > 0 && (
              <div className="nb-card p-4 md:p-6 mb-8" style={{ backgroundColor: 'var(--nb-card-5)' }}>
                <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  By UTM Medium
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.byMedium} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="medium" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--nb-border)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                        }}
                        formatter={(value: number | undefined) => [value != null ? formatNumber(value) : '—', 'Visits']}
                        labelFormatter={(label) => `Medium: ${label}`}
                      />
                      <Bar dataKey="count" name="Visits" radius={[4, 4, 0, 0]}>
                        {data.byMedium.map((_, i) => (
                          <Cell key={i} fill={UTM_CHART_COLORS[(i + 2) % UTM_CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {data.byCampaign.length > 0 && (
              <div className="nb-card p-4 md:p-6 mb-8" style={{ backgroundColor: 'var(--nb-card-2)' }}>
                <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  By UTM Campaign
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.byCampaign} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="campaign" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} stroke="var(--border)" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--nb-border)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                        }}
                        formatter={(value: number | undefined) => [value != null ? formatNumber(value) : '—', 'Visits']}
                        labelFormatter={(label) => `Campaign: ${label}`}
                      />
                      <Bar dataKey="count" name="Visits" radius={[4, 4, 0, 0]}>
                        {data.byCampaign.map((_, i) => (
                          <Cell key={i} fill={UTM_CHART_COLORS[(i + 4) % UTM_CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {data.byRef.length > 0 && (
              <div className="nb-card p-4 md:p-6 mb-8" style={{ backgroundColor: 'var(--nb-card-3)' }}>
                <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  By Referral (<code>?ref=</code>)
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.byRef} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="ref" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--nb-border)', borderRadius: '10px', color: 'var(--text-primary)' }}
                        formatter={(value: number | undefined) => [value != null ? formatNumber(value) : '—', 'Visits']}
                        labelFormatter={(label) => `Ref: ${label}`}
                      />
                      <Bar dataKey="count" name="Visits" radius={[4, 4, 0, 0]}>
                        {data.byRef.map((_, i) => (
                          <Cell key={i} fill={UTM_CHART_COLORS[(i + 6) % UTM_CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {data.byContent.length > 0 && (
              <div className="nb-card p-4 md:p-6 mb-8" style={{ backgroundColor: 'var(--nb-card-4)' }}>
                <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  By UTM Content
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.byContent} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="content" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--nb-border)', borderRadius: '10px', color: 'var(--text-primary)' }}
                        formatter={(value: number | undefined) => [value != null ? formatNumber(value) : '—', 'Visits']}
                        labelFormatter={(label) => `Content: ${label}`}
                      />
                      <Bar dataKey="count" name="Visits" radius={[4, 4, 0, 0]}>
                        {data.byContent.map((_, i) => (
                          <Cell key={i} fill={UTM_CHART_COLORS[(i + 7) % UTM_CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {data.byTerm.length > 0 && (
              <div className="nb-card p-4 md:p-6 mb-8" style={{ backgroundColor: 'var(--nb-card-0)' }}>
                <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  By UTM Term
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.byTerm} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="term" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--nb-border)', borderRadius: '10px', color: 'var(--text-primary)' }}
                        formatter={(value: number | undefined) => [value != null ? formatNumber(value) : '—', 'Visits']}
                        labelFormatter={(label) => `Term: ${label}`}
                      />
                      <Bar dataKey="count" name="Visits" radius={[4, 4, 0, 0]}>
                        {data.byTerm.map((_, i) => (
                          <Cell key={i} fill={UTM_CHART_COLORS[(i + 3) % UTM_CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {data.byPath.length > 0 && (
              <div className="nb-card overflow-hidden mb-8" style={{ backgroundColor: 'var(--nb-surface-card)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Top landing pages (by referred traffic)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--surface-muted)' }}>
                        <th className="text-left px-4 py-2.5 font-semibold" style={{ color: 'var(--text-primary)' }}>Page</th>
                        <th className="text-right px-4 py-2.5 font-semibold" style={{ color: 'var(--text-primary)' }}>Visits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.byPath.map((row) => (
                        <tr key={row.path} className="border-t" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {row.path}
                          </td>
                          <td className="px-4 py-2.5 text-right font-medium tabular-nums" style={{ color: 'var(--accent-500)' }}>
                            {formatNumber(row.count)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {data.daily.length > 0 && (
              <div className="nb-card p-4 md:p-6 mb-8" style={{ backgroundColor: 'var(--nb-card-3)' }}>
                <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Visits per day
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis
                        dataKey="day"
                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                        stroke="var(--border)"
                        tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="var(--border)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--nb-border)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                        }}
                        formatter={(value: number | undefined) => [value != null ? formatNumber(value) : '—', 'Visits']}
                        labelFormatter={(d) => new Date(d).toLocaleDateString()}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Visits"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 2 }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {data.daily.length > 0 && (
              <div className="nb-card overflow-hidden" style={{ backgroundColor: 'var(--nb-surface-card)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Daily breakdown
                  </h3>
                </div>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-muted)' }}>
                        <th className="text-left px-4 py-2.5 font-semibold" style={{ color: 'var(--text-primary)' }}>Date</th>
                        <th className="text-right px-4 py-2.5 font-semibold" style={{ color: 'var(--text-primary)' }}>Visits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...data.daily].reverse().map((row) => (
                        <tr key={row.day} className="border-t" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(row.day).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-4 py-2.5 text-right font-medium tabular-nums" style={{ color: 'var(--accent-500)' }}>
                            {formatNumber(row.count)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {data.total === 0 && !loading && (
              <div className="nb-card-sm p-8 text-center" style={{ backgroundColor: 'var(--nb-surface-card)' }}>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  No UTM traffic in this date range. Share links with UTM params (e.g. ?utm_source=twitter&utm_medium=social&utm_campaign=share) to see data here.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
