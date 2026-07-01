'use client';

import { getAllStatsForAnalytics } from '@/lib/supabase/stats';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Point {
  slug: string;
  title: string;
  ageDays: number;
  views: number;
  viewsPerDay: number;
}

/**
 * Content lifecycle: total views vs post age for blog posts.
 * Evergreen posts sit high-right; decayed ones low-right; breakouts high-left.
 */
export function LifecycleSection() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/search-data.json').then((r) => r.json()),
      getAllStatsForAnalytics(),
    ])
      .then(([searchData, stats]) => {
        const posts: Array<{ slug: string; title: string; date: string }> = searchData?.blogPosts ?? [];
        const blogViews = new Map(
          (stats.byType.blog?.slugs ?? []).map((s: { slug: string; views: number }) => [s.slug, s.views])
        );
        const now = Date.now();
        const pts = posts
          .map((p) => {
            const ageDays = Math.max(1, Math.round((now - new Date(p.date).getTime()) / 86400000));
            const views = blogViews.get(p.slug) ?? 0;
            return {
              slug: p.slug,
              title: p.title,
              ageDays,
              views,
              viewsPerDay: Math.round((views / ageDays) * 100) / 100,
            };
          })
          .filter((p) => p.views > 0);
        setPoints(pts);
      })
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="nb-card-sm p-5 animate-pulse h-64" style={{ backgroundColor: 'var(--glass-bg-subtle)' }} />;
  }
  if (error) {
    return (
      <div className="nb-card-sm p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }
  if (points.length === 0) return null;

  const topRate = [...points].sort((a, b) => b.viewsPerDay - a.viewsPerDay).slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="nb-card-sm p-5" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Views vs post age (blog)
        </h3>
        <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
          Top-right = evergreen compounding · bottom-right = aged out · top-left = recent breakout.
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis
                type="number"
                dataKey="ageDays"
                name="Age"
                unit="d"
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                stroke="var(--glass-border)"
              />
              <YAxis
                type="number"
                dataKey="views"
                name="Views"
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                stroke="var(--glass-border)"
                width={56}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  const p = payload?.[0]?.payload as Point | undefined;
                  if (!p) return null;
                  return (
                    <div
                      className="rounded-xl px-3 py-2 text-xs"
                      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      <p className="font-semibold mb-0.5 max-w-[240px]">{p.title}</p>
                      <p style={{ color: 'var(--text-muted)' }}>
                        {p.views.toLocaleString()} views · {p.ageDays}d old · {p.viewsPerDay}/day
                      </p>
                    </div>
                  );
                }}
              />
              <Scatter data={points} fill="var(--accent-500)" fillOpacity={0.75} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="nb-card-sm p-5" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Best views-per-day rate
        </h3>
        <ol className="space-y-2">
          {topRate.map((p, i) => (
            <li key={p.slug} className="flex items-center gap-3">
              <span className="text-xs font-bold w-5 text-right flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
              <a href={`/blog/${p.slug}`} className="text-xs font-medium truncate flex-1 hover:underline" style={{ color: 'var(--text-secondary)' }}>
                {p.title}
              </a>
              <span className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                {p.viewsPerDay}/day
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
