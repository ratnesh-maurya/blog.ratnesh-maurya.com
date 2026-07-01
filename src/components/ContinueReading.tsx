'use client';

import { getContinueReading, type ReadingHistoryEntry } from '@/lib/reading-history';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const TYPE_LABEL: Record<string, string> = {
  blog: 'Blog',
  news: 'News',
  til: 'TIL',
  cheatsheets: 'Cheatsheet',
  'technical-terms': 'Term',
  'silly-questions': 'Question',
};

/**
 * "Continue reading" strip for the homepage. Renders nothing until
 * localStorage has in-progress reads, so first-time visitors see no shift.
 */
export function ContinueReading() {
  const [entries, setEntries] = useState<ReadingHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getContinueReading(3));
  }, []);

  if (entries.length === 0) return null;

  return (
    <section className="py-8" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="nb-section-label mb-3">Continue Reading</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <Link
              key={`${entry.type}:${entry.slug}`}
              href={`${entry.href}?resume=1`}
              className="group rounded-2xl p-4 transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow-sm)',
                backdropFilter: 'blur(10px) saturate(160%)',
                WebkitBackdropFilter: 'blur(10px) saturate(160%)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-700)' }}
                >
                  {TYPE_LABEL[entry.type] ?? entry.type}
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {entry.progress}% read
                </span>
              </div>
              <p
                className="text-sm font-semibold leading-snug mb-3 line-clamp-2 group-hover:underline"
                style={{ color: 'var(--text-primary)' }}
              >
                {entry.title}
              </p>
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--accent-50)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${entry.progress}%`, backgroundColor: 'var(--accent-500)' }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
