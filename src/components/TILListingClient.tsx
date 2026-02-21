'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ViewCounter } from '@/components/ViewCounter';
import { getStatsByType } from '@/lib/supabase/stats';
import type { TILEntry } from '@/types/blog';

const categoryEmoji: Record<string, string> = {
  Go: '🐹',
  PostgreSQL: '🐘',
  Kubernetes: '☸️',
  AWS: '☁️',
  Docker: '🐳',
  TypeScript: '🔷',
  Elixir: '💧',
  General: '💡',
};

interface TILListingClientProps {
  entries: TILEntry[];
  categories: string[];
}

export function TILListingClient({ entries, categories }: TILListingClientProps) {
  const [stats, setStats] = useState<{ views: Record<string, number>; upvotes: Record<string, number> }>({ views: {}, upvotes: {} });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    getStatsByType('til').then((d) => {
      setStats({ views: d.views, upvotes: d.upvotes });
      setStatsLoaded(true);
    }).catch(() => setStatsLoaded(true));
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(cat => (
          <span key={cat}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <span>{categoryEmoji[cat] ?? '💡'}</span>
            {cat}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <Link key={entry.slug} href={`/til/${entry.slug}`}
            className="block group rounded-xl border p-5 transition-all duration-200"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-lg">{categoryEmoji[entry.category] ?? '💡'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                {entry.category}
              </span>
              <time className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                {format(new Date(entry.date), 'MMM dd, yyyy')}
              </time>
              {statsLoaded && (
                <span className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <ViewCounter type="til" slug={entry.slug} showLabel={false} className="text-xs" initialCount={stats.views[entry.slug] ?? 0} />
                </span>
              )}
            </div>
            <h2 className="text-base font-semibold leading-snug group-hover:text-[var(--accent-500)] transition-colors"
              style={{ color: 'var(--text-primary)' }}>
              {entry.title}
            </h2>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {entry.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-4">📝</p>
          <p className="text-base font-medium">First TIL entry coming soon.</p>
        </div>
      )}
    </>
  );
}
