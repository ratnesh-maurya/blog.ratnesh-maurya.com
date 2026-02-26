'use client';

import { ViewCounter } from '@/components/ViewCounter';
import { getStatsByType } from '@/lib/supabase/stats';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

interface TermCard {
  slug: string;
  title: string;
  description: string;
}

export function TechnicalTermsSearch({ terms }: { terms: TermCard[] }) {
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [stats, setStats] = useState<{ views: Record<string, number>; upvotes: Record<string, number> }>({ views: {}, upvotes: {} });
  const [statsLoaded, setStatsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getStatsByType('technical-terms').then((d) => {
      setStats({ views: d.views, upvotes: d.upvotes });
      setStatsLoaded(true);
    }).catch(() => setStatsLoaded(true));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return terms;
    const q = query.trim().toLowerCase();
    return terms.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q)
    );
  }, [terms, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, TermCard[]> = {};
    for (const term of filtered) {
      const letter = (term.title[0] ?? '#').toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const allLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const term of terms) {
      letters.add((term.title[0] ?? '#').toUpperCase());
    }
    return Array.from(letters).sort();
  }, [terms]);

  const activeLetters = useMemo(() => {
    return new Set(grouped.map(([letter]) => letter));
  }, [grouped]);

  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    const el = document.getElementById(`letter-${letter}`);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Search input */}
      <div className="relative">
        <label htmlFor="technical-terms-search" className="sr-only">
          Search technical terms
        </label>
        <input
          id="technical-terms-search"
          type="search"
          placeholder="Search terms (e.g. index, replication, CAP…)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveLetter(null); }}
          className="w-full rounded-xl border px-4 py-3 pl-10 text-base"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
          aria-describedby="search-results-count"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Alphabet navigation */}
      <div className="flex flex-wrap gap-1">
        {allLetters.map((letter) => {
          const isActive = activeLetters.has(letter);
          const isSelected = activeLetter === letter;
          return (
            <button
              key={letter}
              onClick={() => isActive && scrollToLetter(letter)}
              disabled={!isActive}
              className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--accent-500)' : isActive ? 'var(--accent-50)' : 'transparent',
                color: isSelected ? '#fff' : isActive ? 'var(--accent-600)' : 'var(--text-muted)',
                opacity: isActive ? 1 : 0.4,
                cursor: isActive ? 'pointer' : 'default',
              }}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <p id="search-results-count" className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
        {query.trim() ? ` matching "${query}"` : ''}
      </p>

      {/* Terms — grouped by letter */}
      <div className="flex flex-col">
        {grouped.map(([letter, letterTerms]) => (
          <div key={letter} id={`letter-${letter}`}>
            <div className="sticky top-16 z-10 py-2 px-1 -mx-1 backdrop-blur-sm"
              style={{ backgroundColor: 'color-mix(in srgb, var(--background) 85%, transparent)' }}>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--accent-500)' }}>
                {letter}
              </span>
              <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                {letterTerms.length}
              </span>
            </div>
            {letterTerms.map((term, index) => (
              <div key={term.slug}>
                <Link
                  href={`/technical-terms/${term.slug}`}
                  className="group block py-5 pl-3"
                >
                  <article>
                    <h2 className="text-[18px] md:text-[20px] font-bold leading-snug mb-1 group-hover:underline decoration-1 underline-offset-2"
                      style={{ color: 'var(--text-primary)' }}>
                      {term.title}
                    </h2>
                    <p className="text-[14px] leading-relaxed line-clamp-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {term.description}
                    </p>
                    <div className="flex items-center gap-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                      {statsLoaded && stats.views[term.slug] != null && (
                        <>
                          <ViewCounter type="technical-terms" slug={term.slug} showLabel={false} className="text-[13px]" initialCount={stats.views[term.slug] ?? 0} />
                          <span> views</span>
                          <span className="mx-1">·</span>
                        </>
                      )}
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--accent-500)' }}>
                        Read definition
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Link>
                {index < letterTerms.length - 1 && (
                  <hr className="border-0" style={{ borderTop: '1px solid var(--border)' }} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          No terms match your search. Try a different keyword.
        </p>
      )}
    </div>
  );
}
