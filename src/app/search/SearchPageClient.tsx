'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { BlogPost, SillyQuestion } from '@/types/blog';

type FilterType = 'all' | 'blog' | 'question';
type SortType = 'relevance' | 'date' | 'title';

interface SearchResult {
  type: 'blog' | 'question';
  item: BlogPost | SillyQuestion;
  score: number;
}

function scoreText(query: string, text: string): number {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return 0;
  if (t === q) return 15;
  if (t.startsWith(q)) return 12;
  if (t.includes(q)) return 8;
  const words = q.split(/\s+/);
  const matched = words.filter(w => t.includes(w)).length;
  return matched > 0 ? (matched / words.length) * 5 : 0;
}

function searchAll(query: string, posts: BlogPost[], questions: SillyQuestion[], filter: FilterType): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];

  if (filter === 'all' || filter === 'blog') {
    posts.forEach(post => {
      const score =
        scoreText(query, post.title) * 3 +
        scoreText(query, post.description) * 2 +
        scoreText(query, post.category) * 1.5 +
        post.tags.reduce((s, t) => s + scoreText(query, t), 0);
      if (score > 0) results.push({ type: 'blog', item: post, score });
    });
  }

  if (filter === 'all' || filter === 'question') {
    questions.forEach(q => {
      const score =
        scoreText(query, q.question) * 3 +
        (q.answer ? scoreText(query, q.answer.replace(/<[^>]*>/g, '')) * 2 : 0) +
        q.tags.reduce((s, t) => s + scoreText(query, t), 0);
      if (score > 0) results.push({ type: 'question', item: q, score });
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 20);
}

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('relevance');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [questions, setQuestions] = useState<SillyQuestion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/search-data.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) { setPosts(data.blogPosts ?? []); setQuestions(data.sillyQuestions ?? []); }
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) { params.set('q', query); } else { params.delete('q'); }
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  const rawResults = useMemo(() => searchAll(query, posts, questions, filter), [query, posts, questions, filter]);

  const results = useMemo(() => {
    if (sort === 'date') return [...rawResults].sort((a, b) => new Date(b.item.date).getTime() - new Date(a.item.date).getTime());
    if (sort === 'title') return [...rawResults].sort((a, b) => {
      const ta = a.type === 'blog' ? (a.item as BlogPost).title : (a.item as SillyQuestion).question;
      const tb = b.type === 'blog' ? (b.item as BlogPost).title : (b.item as SillyQuestion).question;
      return ta.localeCompare(tb);
    });
    return rawResults;
  }, [rawResults, sort]);

  const suggestions = useMemo(() => {
    const cats = Array.from(new Set(posts.map(p => p.category))).slice(0, 5);
    const tags = Array.from(new Set([...posts.flatMap(p => p.tags), ...questions.flatMap(q => q.tags)])).slice(0, 10);
    return { cats, tags };
  }, [posts, questions]);

  const filterCounts = {
    all: results.length,
    blog: results.filter(r => r.type === 'blog').length,
    question: results.filter(r => r.type === 'question').length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="hero-gradient-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-center"
            style={{ color: 'var(--accent-500)' }}>
            Search
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center mb-8"
            style={{ color: 'var(--text-primary)' }}>
            Find anything
          </h1>

          {/* Search input */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search posts, questions, tags…"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border text-base outline-none transition-all duration-200"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: query ? 'var(--accent-400)' : 'var(--border)',
                color: 'var(--text-primary)',
                boxShadow: query ? '0 0 0 3px var(--accent-50)' : 'none',
              }}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
            Also accessible via <kbd className="px-1.5 py-0.5 rounded text-xs font-mono mx-0.5"
              style={{ backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)' }}>⌘K</kbd> from anywhere
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Filters & Sort (only when there's a query) */}
        {query && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-1.5">
              {(['all', 'blog', 'question'] as FilterType[]).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-150"
                  style={filter === f
                    ? { backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }
                    : { backgroundColor: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                  }>
                  {f === 'all' ? 'All' : f === 'blog' ? 'Posts' : 'Q&As'}
                  <span className="ml-1.5 opacity-70">{filterCounts[f]}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Sort:</span>
              {(['relevance', 'date', 'title'] as SortType[]).map(s => (
                <button key={s} onClick={() => setSort(s)}
                  className="text-xs px-2 py-1 rounded transition-all"
                  style={sort === s
                    ? { color: 'var(--accent-500)', fontWeight: 700 }
                    : { color: 'var(--text-muted)' }
                  }>
                  {s === 'relevance' ? 'Best' : s === 'date' ? 'Latest' : 'A–Z'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoaded ? (
          <div className="py-16 text-center">
            <div className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent-300)', borderTopColor: 'transparent' }} />
          </div>
        ) : query && results.length > 0 ? (
          <>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
            <div className="space-y-2">
              {results.map((result, i) => {
                const isBlog = result.type === 'blog';
                const post = result.item as BlogPost;
                const question = result.item as SillyQuestion;
                const title = isBlog ? post.title : question.question;
                const subtitle = isBlog
                  ? post.description
                  : question.answer?.replace(/<[^>]*>/g, '').substring(0, 140) + '…';
                const href = isBlog ? `/blog/${post.slug}` : `/silly-questions/${question.slug}`;
                const cat = isBlog ? (post.category || 'Post') : 'Q&A';

                return (
                  <Link key={`${result.type}-${result.item.slug}-${i}`} href={href}
                    className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-150 group"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: isBlog ? 'var(--accent-50)' : 'var(--coral-50)',
                        color: isBlog ? 'var(--accent-500)' : 'var(--coral-500)',
                      }}>
                      {isBlog
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      }
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: isBlog ? 'var(--accent-500)' : 'var(--coral-500)' }}>
                          {cat}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {format(new Date(result.item.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm font-semibold leading-snug line-clamp-1 group-hover:text-[var(--accent-500)] transition-colors"
                        style={{ color: 'var(--text-primary)' }}>
                        {title}
                      </p>
                      <p className="text-xs leading-relaxed line-clamp-2 mt-0.5"
                        style={{ color: 'var(--text-muted)' }}>
                        {subtitle}
                      </p>
                    </div>
                    <svg className="w-4 h-4 flex-shrink-0 mt-1 transition-transform duration-150 group-hover:translate-x-0.5"
                      style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </>
        ) : query ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface-muted)' }}>
              <svg className="w-7 h-7" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Try different keywords or browse by topic below
            </p>
          </div>
        ) : (
          /* Empty state — suggestions */
          <div className="space-y-8 pt-2">
            {suggestions.cats.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)' }}>
                  Browse by category
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.cats.map(cat => (
                    <button key={cat} onClick={() => setQuery(cat)}
                      className="text-sm px-4 py-2 rounded-full font-medium transition-all duration-150"
                      style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)', border: '1px solid var(--accent-200)' }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {suggestions.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)' }}>
                  Popular tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.tags.map(tag => (
                    <button key={tag} onClick={() => setQuery(tag)}
                      className="text-sm px-3 py-1.5 rounded-full font-medium transition-all duration-150"
                      style={{ backgroundColor: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <Link href="/blog"
                className="text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                All posts →
              </Link>
              <Link href="/topics"
                className="text-sm font-semibold px-4 py-2 rounded-xl border transition-all duration-200"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}>
                Browse topics →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
