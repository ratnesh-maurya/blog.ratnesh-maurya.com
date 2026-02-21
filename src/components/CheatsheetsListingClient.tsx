'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ViewCounter } from '@/components/ViewCounter';
import { getStatsByType } from '@/lib/supabase/stats';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {sheets.map(sheet => (
        <Link key={sheet.slug} href={`/cheatsheets/${sheet.slug}`}
          className="group rounded-xl border p-6 transition-all duration-200"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{sheet.emoji}</span>
            <div>
              <h2 className="text-lg font-bold group-hover:text-[var(--accent-500)] transition-colors"
                style={{ color: 'var(--text-primary)' }}>
                {sheet.title}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sheet.subtitle}</p>
            </div>
          </div>
          {statsLoaded && (
            <span className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <ViewCounter type="cheatsheets" slug={sheet.slug} showLabel={false} className="text-xs" initialCount={stats.views[sheet.slug] ?? 0} />
            </span>
          )}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {sheet.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold"
            style={{ color: 'var(--accent-500)' }}>
            Open cheatsheet
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
