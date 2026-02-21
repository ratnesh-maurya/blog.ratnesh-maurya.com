'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { BlogPost, SillyQuestion } from '@/types/blog';
import Link from 'next/link';
import { format } from 'date-fns';

export interface TechnicalTermSearchItem {
  slug: string;
  title: string;
  description: string;
}

export interface TILSearchItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  date: string;
}

interface SearchResult {
  type: 'blog' | 'question' | 'term' | 'til';
  item: BlogPost | SillyQuestion | TechnicalTermSearchItem | TILSearchItem;
  score: number;
  matchedFields: string[];
}

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  blogPosts: BlogPost[];
  sillyQuestions: SillyQuestion[];
  technicalTerms?: TechnicalTermSearchItem[];
  tilEntries?: TILSearchItem[];
}

type FilterType = 'all' | 'blog' | 'question' | 'term' | 'til';
type SortType = 'relevance' | 'date' | 'title';

function searchScore(query: string, text: string): { score: number; matched: boolean } {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return { score: 0, matched: false };
  if (t.includes(q)) {
    const idx = t.indexOf(q);
    return { score: /\s/.test(t[idx - 1] ?? ' ') ? 10 : 8, matched: true };
  }
  const words = q.split(/\s+/);
  let wordMatches = 0;
  for (const w of words) if (t.includes(w)) wordMatches++;
  if (wordMatches > 0) return { score: (wordMatches / words.length) * 5, matched: true };
  let score = 0, qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) if (t[i] === q[qi]) { score++; qi++; }
  const fuzzy = qi === q.length ? (score / t.length) * 2 : 0;
  return { score: fuzzy, matched: fuzzy > 0.3 };
}

function searchContent(
  query: string,
  blogPosts: BlogPost[],
  sillyQuestions: SillyQuestion[],
  technicalTerms: TechnicalTermSearchItem[],
  tilEntries: TILSearchItem[],
  filterType: FilterType
): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];

  if (filterType === 'all' || filterType === 'blog') {
    blogPosts.forEach((post) => {
      const matchedFields: string[] = [];
      let totalScore = 0;
      const t = searchScore(query, post.title);
      if (t.matched) { totalScore += t.score * 3; matchedFields.push('title'); }
      const d = searchScore(query, post.description);
      if (d.matched) { totalScore += d.score * 2; matchedFields.push('description'); }
      const c = searchScore(query, post.category);
      if (c.matched) { totalScore += c.score * 1.5; matchedFields.push('category'); }
      post.tags.forEach((tag) => {
        const r = searchScore(query, tag);
        if (r.matched) { totalScore += r.score; if (!matchedFields.includes('tags')) matchedFields.push('tags'); }
      });
      if (totalScore > 0) results.push({ type: 'blog', item: post, score: totalScore, matchedFields });
    });
  }

  if (filterType === 'all' || filterType === 'question') {
    sillyQuestions.forEach((question) => {
      const matchedFields: string[] = [];
      let totalScore = 0;
      const q = searchScore(query, question.question);
      if (q.matched) { totalScore += q.score * 3; matchedFields.push('question'); }
      if (question.answer) {
        const a = searchScore(query, question.answer);
        if (a.matched) { totalScore += a.score * 2; matchedFields.push('answer'); }
      }
      question.tags.forEach((tag) => {
        const r = searchScore(query, tag);
        if (r.matched) { totalScore += r.score; if (!matchedFields.includes('tags')) matchedFields.push('tags'); }
      });
      if (totalScore > 0) results.push({ type: 'question', item: question, score: totalScore, matchedFields });
    });
  }

  if (filterType === 'all' || filterType === 'term') {
    technicalTerms.forEach((term) => {
      const matchedFields: string[] = [];
      let totalScore = 0;
      const t = searchScore(query, term.title);
      if (t.matched) { totalScore += t.score * 3; matchedFields.push('title'); }
      const d = searchScore(query, term.description);
      if (d.matched) { totalScore += d.score * 2; matchedFields.push('description'); }
      if (totalScore > 0) results.push({ type: 'term', item: term, score: totalScore, matchedFields });
    });
  }

  if (filterType === 'all' || filterType === 'til') {
    tilEntries.forEach((entry) => {
      const matchedFields: string[] = [];
      let totalScore = 0;
      const t = searchScore(query, entry.title);
      if (t.matched) { totalScore += t.score * 3; matchedFields.push('title'); }
      const d = searchScore(query, entry.description);
      if (d.matched) { totalScore += d.score * 2; matchedFields.push('description'); }
      entry.tags.forEach((tag) => {
        const r = searchScore(query, tag);
        if (r.matched) { totalScore += r.score; if (!matchedFields.includes('tags')) matchedFields.push('tags'); }
      });
      if (totalScore > 0) results.push({ type: 'til', item: entry, score: totalScore, matchedFields });
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

export function SearchPopup({ isOpen, onClose, blogPosts, sillyQuestions, technicalTerms = [], tilEntries = [] }: SearchPopupProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('relevance');
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const categories = Array.from(new Set(blogPosts.map((p) => p.category)));
    const tags = Array.from(new Set([
      ...blogPosts.flatMap((p) => p.tags),
      ...sillyQuestions.flatMap((q) => q.tags),
      ...tilEntries.flatMap((e) => e.tags),
    ]));
    return { categories: categories.slice(0, 6), tags: tags.slice(0, 8) };
  }, [blogPosts, sillyQuestions, tilEntries]);

  const getItemDate = (item: SearchResult['item'], type: SearchResult['type']): string =>
    type === 'blog' ? (item as BlogPost).date : type === 'question' ? (item as SillyQuestion).date : type === 'til' ? (item as TILSearchItem).date : '';

  const getItemTitle = (item: SearchResult['item'], type: SearchResult['type']): string =>
    type === 'blog' ? (item as BlogPost).title : type === 'question' ? (item as SillyQuestion).question : (item as TechnicalTermSearchItem | TILSearchItem).title;

  const sortedResults = useMemo(() => {
    const r = searchContent(query, blogPosts, sillyQuestions, technicalTerms, tilEntries, filterType);
    if (sortType === 'date') return r.sort((a, b) => {
      const da = getItemDate(a.item, a.type);
      const db = getItemDate(b.item, b.type);
      if (!da) return 1; if (!db) return -1;
      return new Date(db).getTime() - new Date(da).getTime();
    });
    if (sortType === 'title') return r.sort((a, b) => getItemTitle(a.item, a.type).localeCompare(getItemTitle(b.item, b.type)));
    return r;
  }, [query, blogPosts, sillyQuestions, technicalTerms, tilEntries, filterType, sortType]);


  useEffect(() => { setResults(sortedResults); setSelectedIndex(0); }, [sortedResults]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery(''); setResults([]); setFilterType('all'); setSortType('relevance'); setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(p => Math.min(p + 1, results.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(p => Math.max(p - 1, 0)); }
      else if (e.key === 'Enter' && results[selectedIndex]) {
        const r = results[selectedIndex];
        const href = r.type === 'blog' ? `/blog/${(r.item as BlogPost).slug}`
          : r.type === 'question' ? `/silly-questions/${(r.item as SillyQuestion).slug}`
          : r.type === 'term' ? `/technical-terms/${(r.item as TechnicalTermSearchItem).slug}`
          : `/til/${(r.item as TILSearchItem).slug}`;
        window.location.href = href;
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, results, selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;
    function onMouse(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onMouse);
    return () => document.removeEventListener('mousedown', onMouse);
  }, [isOpen, onClose]);

  // Scroll selected result into view
  useEffect(() => {
    const el = resultsRef.current?.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const filterLabels: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: blogPosts.length + sillyQuestions.length + technicalTerms.length + tilEntries.length },
    { id: 'blog', label: 'Posts', count: blogPosts.length },
    { id: 'question', label: 'Questions', count: sillyQuestions.length },
    { id: 'term', label: 'Terms', count: technicalTerms.length },
    { id: 'til', label: 'TIL', count: tilEntries.length },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-200 ${
        isOpen ? 'visible' : 'invisible pointer-events-none'
      }`}
      style={{
        backgroundColor: isOpen ? 'rgba(0,0,0,0.5)' : 'transparent',
        backdropFilter: isOpen ? 'blur(4px)' : 'none',
        paddingTop: 'clamp(3rem, 8vh, 7rem)',
        paddingInline: '1rem',
      }}
    >
      <div
        ref={popupRef}
        className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-97 -translate-y-3'
        }`}
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts, tags, questions…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-base bg-transparent outline-none border-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded"
              style={{ color: 'var(--text-muted)', backgroundColor: 'var(--surface-muted)' }}
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-xs px-2 py-1 rounded-md font-mono transition-colors"
            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)' }}
          >
            Esc
          </button>
        </div>

        {/* Filter + sort row */}
        <div className="flex items-center justify-between px-4 py-2 gap-2"
          style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-muted)' }}>
          <div className="flex items-center gap-1">
            {filterLabels.map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className="text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-150"
                style={filterType === f.id
                  ? { backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }
                  : { backgroundColor: 'transparent', color: 'var(--text-muted)' }
                }
              >
                {f.label}
                <span className="ml-1 opacity-60">{f.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Sort:</span>
            {(['relevance', 'date', 'title'] as SortType[]).map(s => (
              <button
                key={s}
                onClick={() => setSortType(s)}
                className="text-xs px-2 py-0.5 rounded transition-all"
                style={sortType === s
                  ? { color: 'var(--accent-500)', fontWeight: 600 }
                  : { color: 'var(--text-muted)' }
                }
              >
                {s === 'relevance' ? 'Best' : s === 'date' ? 'Latest' : 'A–Z'}
              </button>
            ))}
          </div>
        </div>

        {/* Results / Empty states */}
        <div className="overflow-y-auto flex-1">
          {results.length > 0 ? (
            <>
              {/* Result count */}
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div ref={resultsRef} className="px-2 pb-2">
                {results.map((result, index) => {
                  const isBlog = result.type === 'blog';
                  const isQuestion = result.type === 'question';
                  const isTerm = result.type === 'term';
                  const isTil = result.type === 'til';
                  const post = result.item as BlogPost;
                  const question = result.item as SillyQuestion;
                  const term = result.item as TechnicalTermSearchItem;
                  const til = result.item as TILSearchItem;
                  const title = getItemTitle(result.item, result.type);
                  const subtitle = isBlog ? post.description : isQuestion ? question.answer?.replace(/<[^>]*>/g, '').substring(0, 120) + '…' : isTerm ? term.description?.substring(0, 120) + '…' : til.description?.substring(0, 120) + '…';
                  const href = isBlog ? `/blog/${post.slug}` : isQuestion ? `/silly-questions/${question.slug}` : isTerm ? `/technical-terms/${term.slug}` : `/til/${til.slug}`;
                  const label = isBlog ? (post.category || 'Post') : isQuestion ? 'Question' : isTerm ? 'Term' : 'TIL';
                  const dateStr = getItemDate(result.item, result.type);
                  const isSelected = index === selectedIndex;
                  const iconColor = isBlog ? 'var(--accent-50)' : isQuestion ? 'var(--coral-50)' : isTerm ? 'var(--accent-50)' : 'var(--surface-muted)';
                  const iconTextColor = isBlog ? 'var(--accent-500)' : isQuestion ? 'var(--coral-500)' : isTerm ? 'var(--accent-500)' : 'var(--text-muted)';

                  return (
                    <Link
                      key={`${result.type}-${result.item.slug}`}
                      href={href}
                      onClick={onClose}
                      className="flex items-start gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-100 group"
                      style={isSelected
                        ? { backgroundColor: 'var(--accent-50)', outline: `1px solid var(--accent-200)` }
                        : { backgroundColor: 'transparent' }
                      }
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: iconColor, color: iconTextColor }}
                      >
                        {isBlog ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : isQuestion ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : isTerm ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: iconTextColor }}>
                            {label}
                          </span>
                          {dateStr && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {format(new Date(dateStr), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold leading-snug line-clamp-1 mb-0.5" style={{ color: 'var(--text-primary)' }}>
                          {title}
                        </p>
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                          {subtitle}
                        </p>
                      </div>

                      {/* Arrow */}
                      <svg className={`w-4 h-4 flex-shrink-0 mt-1 transition-transform duration-150 ${isSelected ? 'translate-x-0.5' : ''}`}
                        style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : query ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--surface-muted)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Try different keywords or browse by category below
              </p>
            </div>
          ) : (
            <div className="p-4">
              {/* Quick suggestions */}
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3 px-1"
                  style={{ color: 'var(--text-muted)' }}>Categories</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.categories.map(cat => (
                    <button key={cat} onClick={() => setQuery(cat)}
                      className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150"
                      style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-100)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-50)'}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3 px-1"
                  style={{ color: 'var(--text-muted)' }}>Popular tags</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.tags.map(tag => (
                    <button key={tag} onClick={() => setQuery(tag)}
                      className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150"
                      style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--neutral-200)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-muted)'}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard hint footer */}
        <div className="px-4 py-2.5 flex items-center gap-4"
          style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface-muted)' }}>
          {[
            { keys: ['↑', '↓'], label: 'Navigate' },
            { keys: ['↵'], label: 'Open' },
            { keys: ['Esc'], label: 'Close' },
          ].map(({ keys, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              {keys.map(k => (
                <kbd key={k}
                  className="text-xs px-1.5 py-0.5 rounded font-mono"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {k}
                </kbd>
              ))}
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
