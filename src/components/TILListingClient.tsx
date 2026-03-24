'use client';

import { ViewCounter } from '@/components/ViewCounter';
import { getStatsByType } from '@/lib/supabase/stats';
import type { TILEntry } from '@/types/blog';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    getStatsByType('til').then((d) => {
      setStats({ views: d.views, upvotes: d.upvotes });
      setStatsLoaded(true);
    }).catch(() => setStatsLoaded(true));
  }, []);

  const filteredEntries = activeCategory
    ? entries.filter(e => e.category === activeCategory)
    : entries;

  return (
    <>
      {/* Category filter tabs — Medium style */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setActiveCategory(null)}
          className="whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition-colors font-medium"
          style={!activeCategory
            ? { backgroundColor: 'var(--text-primary)', color: 'var(--background)' }
            : { color: 'var(--text-muted)' }
          }
        >
          All
        </button>
        {categories.map(cat => (
          <button key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className="whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition-colors font-medium"
            style={activeCategory === cat
              ? { backgroundColor: 'var(--text-primary)', color: 'var(--background)' }
              : { color: 'var(--text-muted)' }
            }
          >
            {categoryEmoji[cat] ?? '💡'} {cat}
          </button>
        ))}
      </nav>

      {/* Entries — flat list with dividers */}
      <div className="flex flex-col">
        {filteredEntries.map((entry, index) => (
          <div key={entry.slug}>
            <Link href={`/til/${entry.slug}`} className="group block py-6">
              <article>
                {/* Category + date line */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{categoryEmoji[entry.category] ?? '💡'}</span>
                  <span className="nb-badge nb-badge-primary">
                    {entry.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-[20px] md:text-[22px] font-bold leading-snug mb-1.5 group-hover:underline decoration-1 underline-offset-2"
                  style={{ color: 'var(--text-primary)' }}>
                  {entry.title}
                </h2>

                {/* Meta row */}
                <div className="flex items-center gap-1 text-[13px] flex-wrap" style={{ color: 'var(--text-muted)' }}>
                  <time dateTime={entry.date}>
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </time>
                  {statsLoaded && stats.views[entry.slug] != null && (
                    <>
                      <span className="mx-1">·</span>
                      <ViewCounter type="til" slug={entry.slug} showLabel={false} className="text-[13px]" initialCount={stats.views[entry.slug] ?? 0} />
                      <span> views</span>
                    </>
                  )}
                  {entry.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="nb-badge nb-badge-muted ml-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
            {index < filteredEntries.length - 1 && (
              <hr className="border-0" style={{ borderTop: '1px solid var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-4">📝</p>
          <p className="text-base font-medium">
            {activeCategory ? `No entries in "${activeCategory}" yet.` : 'First TIL entry coming soon.'}
          </p>
          {activeCategory && (
            <button onClick={() => setActiveCategory(null)}
              className="mt-3 text-sm font-medium" style={{ color: 'var(--accent-500)' }}>
              Show all entries →
            </button>
          )}
        </div>
      )}
    </>
  );
}
