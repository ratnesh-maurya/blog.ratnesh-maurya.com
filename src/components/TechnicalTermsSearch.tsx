'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface TermCard {
  slug: string;
  title: string;
  description: string;
}

export function TechnicalTermsSearch({ terms }: { terms: TermCard[] }) {
  const [query, setQuery] = useState('');

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

  return (
    <div className="space-y-6">
      <div className="relative">
        <label htmlFor="technical-terms-search" className="sr-only">
          Search technical terms
        </label>
        <input
          id="technical-terms-search"
          type="search"
          placeholder="Search terms (e.g. index, replication, CAP…)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
      <p id="search-results-count" className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
        {query.trim() ? ` matching "${query}"` : ''}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((term) => (
          <Link
            key={term.slug}
            href={`/technical-terms/${term.slug}`}
            className="group flex flex-col p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-base font-bold mb-2 group-hover:text-[var(--accent-500)] transition-colors"
              style={{ color: 'var(--text-primary)' }}>
              {term.title}
            </h2>
            <p className="text-sm leading-relaxed line-clamp-3 flex-1" style={{ color: 'var(--text-secondary)' }}>
              {term.description}
            </p>
            <span className="mt-3 text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--accent-500)' }}>
              Read definition
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
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
