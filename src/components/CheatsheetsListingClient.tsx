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
    <div className="flex flex-col">
      {sheets.map((sheet, index) => (
        <div key={sheet.slug}>
          <Link href={`/cheatsheets/${sheet.slug}`}
            className="group block py-6">
            <article className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0 mt-0.5">{sheet.emoji}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-[20px] md:text-[22px] font-bold leading-snug mb-1 group-hover:underline decoration-1 underline-offset-2"
                  style={{ color: 'var(--text-primary)' }}>
                  {sheet.title}
                </h2>
                <p className="text-[15px] mb-3" style={{ color: 'var(--text-secondary)' }}>{sheet.subtitle}</p>

                <div className="flex items-center gap-1 text-[13px] flex-wrap" style={{ color: 'var(--text-muted)' }}>
                  {statsLoaded && stats.views[sheet.slug] != null && (
                    <>
                      <ViewCounter type="cheatsheets" slug={sheet.slug} showLabel={false} className="text-[13px]" initialCount={stats.views[sheet.slug] ?? 0} />
                      <span> views</span>
                    </>
                  )}
                  {sheet.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="ml-1.5 px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto text-xs font-semibold flex items-center gap-1"
                    style={{ color: 'var(--accent-500)' }}>
                    Open
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          </Link>
          {index < sheets.length - 1 && (
            <hr className="border-0" style={{ borderTop: '1px solid var(--border)' }} />
          )}
        </div>
      ))}
    </div>
  );
}
