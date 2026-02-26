'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function useAccentHex(fallback = '#0d9488') {
  const [hex, setHex] = useState(fallback);
  const read = useCallback(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--accent-500').trim();
    if (v) setHex(v);
  }, []);
  useEffect(() => {
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-accent', 'data-theme'] });
    return () => observer.disconnect();
  }, [read]);
  return hex;
}

const DEMO_BAR_DATA = [
  { name: 'Blog', views: 4800 },
  { name: 'Technical Terms', views: 3100 },
  { name: 'TIL', views: 1200 },
  { name: 'Silly Qs', views: 800 },
];

const DEMO_PIE_DATA = [
  { name: 'Organic', value: 62 },
  { name: 'Direct', value: 21 },
  { name: 'Referral', value: 10 },
  { name: 'Social', value: 7 },
];

const CHART_COLORS_TAIL = ['#6366f1', '#d97706', '#475569']; // indigo, amber, slate

const CACHING_ADOPTION_DATA = [
  { name: 'Cache Aside', value: 65 },
  { name: 'Write Through', value: 15 },
  { name: 'Read Through', value: 8 },
  { name: 'Write Back', value: 7 },
  { name: 'Write Around', value: 5 },
  { name: 'Refresh-Ahead', value: 2 },
];

const CACHING_ADOPTION_COLORS_TAIL = ['#4f46e5', '#f59e0b', '#db2777', '#64748b', '#10b981'];

const CACHING_TRADEOFF_DATA = [
  { name: 'Cache Aside', consistency: 5, writeSpeed: 6 },
  { name: 'Write Through', consistency: 10, writeSpeed: 2 },
  { name: 'Read Through', consistency: 5, writeSpeed: 5 },
  { name: 'Write Back', consistency: 2, writeSpeed: 9 },
  { name: 'Write Around', consistency: 8, writeSpeed: 7 },
  { name: 'Refresh-Ahead', consistency: 6, writeSpeed: 5 },
];

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export function DemoBarChart() {
  const mounted = useIsMounted();
  const accent = useAccentHex();
  const CHART_COLORS = [accent, ...CHART_COLORS_TAIL];

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="my-8 rounded-2xl p-4 md:p-6"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Demo chart
      </p>
      <p className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        Views by section
      </p>
      <div
        className="w-full overflow-hidden"
        style={{ height: 256, minHeight: 256 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DEMO_BAR_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              stroke="var(--border)"
            />
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              stroke="var(--border)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                color: 'var(--text-primary)',
              }}
            />
            <Legend />
            <Bar
              dataKey="views"
              name="Views"
              fill={accent}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DemoPieChart() {
  const mounted = useIsMounted();
  const accent = useAccentHex();
  const CHART_COLORS = [accent, ...CHART_COLORS_TAIL];

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="my-8 rounded-2xl p-4 md:p-6"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Demo chart
      </p>
      <p className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        Traffic sources
      </p>
      <div
        className="w-full overflow-hidden"
        style={{ height: 256, minHeight: 256 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DEMO_PIE_DATA}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name} (${value}%)`}
            >
              {DEMO_PIE_DATA.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                color: 'var(--text-primary)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CachingAdoptionPieChart() {
  const mounted = useIsMounted();
  const accent = useAccentHex();
  const CACHING_ADOPTION_COLORS = [accent, ...CACHING_ADOPTION_COLORS_TAIL];
  if (!mounted) return null;

  return (
    <div
      className="my-8 rounded-2xl p-4 md:p-6"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Industry adoption
      </p>
      <p className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        Estimated usage in distributed systems (%)
      </p>
      <div className="w-full overflow-hidden" style={{ height: 280, minHeight: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={CACHING_ADOPTION_DATA}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              labelLine={false}
            >
              {CACHING_ADOPTION_DATA.map((_, i) => (
                <Cell key={i} fill={CACHING_ADOPTION_COLORS[i % CACHING_ADOPTION_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                color: 'var(--text-primary)',
              }}
              formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Usage']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {CACHING_ADOPTION_DATA.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CACHING_ADOPTION_COLORS[i % CACHING_ADOPTION_COLORS.length] }}
            />
            <span className="truncate">{item.name}</span>
            <span className="ml-auto font-semibold" style={{ color: 'var(--text-primary)' }}>
              {item.value}%
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        <strong>Insight:</strong> Cache Aside dominates due to resilience—if the cache fails, the app can still read from the database.
      </p>
    </div>
  );
}

export function CachingTradeoffChart() {
  const mounted = useIsMounted();
  const accent = useAccentHex();
  if (!mounted) return null;

  return (
    <div
      className="my-8 rounded-2xl p-4 md:p-6"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Trade-off
      </p>
      <p className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        Consistency vs write speed (1–10)
      </p>
      <div className="w-full overflow-hidden" style={{ height: 280, minHeight: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={CACHING_TRADEOFF_DATA}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 80, bottom: 8 }}
          >
            <XAxis
              type="number"
              domain={[0, 11]}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              stroke="var(--border)"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              stroke="var(--border)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                color: 'var(--text-primary)',
              }}
            />
            <Legend />
            <Bar
              dataKey="consistency"
              name="Data safety (consistency)"
              fill="#4f46e5"
              radius={[0, 4, 4, 0]}
              barSize={10}
            />
            <Bar
              dataKey="writeSpeed"
              name="Write speed"
              fill={accent}
              radius={[0, 4, 4, 0]}
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        <strong>Insight:</strong> Write Back is fastest for writes but riskiest; Write Through is safest but slowest on writes.
      </p>
    </div>
  );
}
