'use client';

import { SankeyChart, type FlowRow } from '@/components/analytics/sankey-chart';
import { useCallback, useEffect, useRef, useState } from 'react';

const PRESETS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoStr(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n + 1);
  return d.toISOString().slice(0, 10);
}

export function SankeySection() {
  const [preset, setPreset] = useState(30);
  const [flows, setFlows] = useState<FlowRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(600);

  // Measure container width for responsive SVG
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setChartWidth(Math.max(w, 300));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const fetchData = useCallback(async (days: number) => {
    setLoading(true);
    setError(null);
    try {
      const from = daysAgoStr(days);
      const to = todayStr();
      const res = await fetch(`/api/analytics/utm-flow?from=${from}&to=${to}`);
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json() as { flows: FlowRow[]; total: number };
      setFlows(json.flows ?? []);
      setTotal(json.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(preset);
  }, [preset, fetchData]);

  // Compute chart height based on number of nodes
  const uniqueSources = new Set(flows.map((f) => f.source)).size;
  const uniqueTargets = new Set(flows.map((f) => f.content_type)).size;
  const maxNodes = Math.max(uniqueSources, uniqueTargets, 3);
  const chartHeight = Math.max(260, maxNodes * 54);

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.days}
            type="button"
            onClick={() => setPreset(p.days)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-transform"
            style={
              preset === p.days
                ? {
                    backgroundColor: 'var(--nb-badge-bg)',
                    color: 'var(--nb-badge-text)',
                    border: '2px solid var(--nb-border)',
                    boxShadow: 'var(--nb-shadow-sm)',
                  }
                : {
                    backgroundColor: 'var(--nb-surface-card)',
                    color: 'var(--text-secondary)',
                    border: '2px solid var(--nb-border)',
                  }
            }
          >
            {p.label}
          </button>
        ))}
        {total > 0 && (
          <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
            {total.toLocaleString()} tracked visits
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--nb-card-5)' }} />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : flows.length === 0 ? (
        <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm">No tracked link data for this period.</p>
          <p className="text-xs mt-1">Visits via UTM or ?ref= links will appear here.</p>
        </div>
      ) : (
        <div ref={containerRef} className="w-full px-8 sm:px-16">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            <span>Source</span>
            <span>Content</span>
          </div>
          <SankeyChart flows={flows} width={chartWidth - 96} height={chartHeight} />
        </div>
      )}

      {/* Legend */}
      {flows.length > 0 && !loading && (
        <p className="text-[11px] mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
          Ribbon width is proportional to visit count. Hover a ribbon for exact numbers.
        </p>
      )}
    </div>
  );
}
