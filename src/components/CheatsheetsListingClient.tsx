'use client';

import { ViewCounter } from '@/components/ViewCounter';
import { getStatsByType } from '@/lib/supabase/stats';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Sheet {
  slug: string;
  title: string;
  subtitle: string;
  emoji: string;
  tags: string[];
}

interface CheatsheetsListingClientProps {
  sheets: Sheet[];
}

export function CheatsheetsListingClient({ sheets }: CheatsheetsListingClientProps) {
  const [stats, setStats] = useState<{ views: Record<string, number>; upvotes: Record<string, number> }>({ views: {}, upvotes: {} });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    getStatsByType('cheatsheets').then((d) => {
      setStats({ views: d.views, upvotes: d.upvotes });
      setStatsLoaded(true);
    }).catch(() => setStatsLoaded(true));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {sheets.map((sheet) => (
        <Link
          key={sheet.slug}
          href={`/cheatsheets/${sheet.slug}`}
          className="on-card group flex flex-col rounded-2xl p-6 transition-all duration-150 hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow-sm)',
            backdropFilter: 'blur(10px) saturate(160%)',
            WebkitBackdropFilter: 'blur(10px) saturate(160%)',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">{sheet.emoji}</span>
            {statsLoaded && stats.views[sheet.slug] != null && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
                <ViewCounter type="cheatsheets" slug={sheet.slug} showLabel={false} className="text-xs" initialCount={stats.views[sheet.slug] ?? 0} />
                <span>views</span>
              </span>
            )}
          </div>

          <h2 className="text-lg font-extrabold leading-snug mb-1.5 group-hover:text-[var(--accent-500)] transition-colors"
            style={{ color: 'var(--text-primary)' }}>
            {sheet.title}
          </h2>
          <p className="text-sm leading-relaxed mb-4 flex-1"
            style={{ color: 'var(--text-secondary)' }}>
            {sheet.subtitle}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {sheet.tags.slice(0, 3).map(tag => (
              <span key={tag} className="nb-badge nb-badge-muted">
                {tag}
              </span>
            ))}
          </div>

          <span className="mt-auto text-xs font-semibold flex items-center gap-1"
            style={{ color: 'var(--accent-500)' }}>
            Open cheatsheet
            <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
