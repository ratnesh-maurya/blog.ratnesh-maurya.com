'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CustomDropdown } from '@/components/CustomDropdown';
import { ViewCounter } from '@/components/ViewCounter';
import { BlogPost } from '@/types/blog';
import { trackBlogCardClick } from '@/lib/analytics';

const categoryAccent: Record<string, { dot: string; badge: string }> = {
  'AI':          { dot: '#7C3AED', badge: 'rgba(124,58,237,0.12)' },
  'Backend':     { dot: '#0EA5E9', badge: 'rgba(14,165,233,0.12)' },
  'Systems':     { dot: '#10B981', badge: 'rgba(16,185,129,0.12)' },
  'Frontend':    { dot: '#F59E0B', badge: 'rgba(245,158,11,0.12)' },
  'JavaScript':  { dot: '#F59E0B', badge: 'rgba(245,158,11,0.12)' },
  'TypeScript':  { dot: '#3B82F6', badge: 'rgba(59,130,246,0.12)' },
  'DevOps':      { dot: '#EF4444', badge: 'rgba(239,68,68,0.12)' },
  'Database':    { dot: '#8B5CF6', badge: 'rgba(139,92,246,0.12)' },
  'Default':     { dot: 'var(--accent-400)', badge: 'var(--accent-50)' },
};

function getCategoryAccent(category: string) {
  const key = Object.keys(categoryAccent).find(k => category?.toLowerCase().includes(k.toLowerCase())) ?? 'Default';
  return categoryAccent[key];
}

interface BlogListingClientProps {
  blogPosts: BlogPost[];
  initialTag?: string | null;
  pageTitle?: string;
  pageDescription?: string;
}

interface BlogStats {
  views: Record<string, number>;
  upvotes: Record<string, number>;
  reports?: Record<string, number>;
}

export function BlogListingClient({ blogPosts, initialTag = null, pageTitle, pageDescription }: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [stats, setStats] = useState<BlogStats>({ views: {}, upvotes: {} });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const router = useRouter();

  // Keep internal tag filter in sync with URL-driven initialTag
  useEffect(() => {
    setSelectedTag(initialTag ?? null);
    setSelectedCategory('all');
  }, [initialTag]);

  // Fetch stats from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { getStatsByType } = await import('@/lib/supabase/stats');
        const data = await getStatsByType('blog');
        setStats(data);
      } catch (error) {
        console.error('Error fetching blog stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category (case-insensitive)
    if (selectedCategory !== 'all') {
      const normCat = selectedCategory.toLowerCase();
      filtered = filtered.filter(post => post.category?.toLowerCase() === normCat);
    }

    // Filter by tag — case-insensitive, and also matches against post.category
    // so that category-hub URLs (/blog/tag/system-design) work correctly
    if (selectedTag) {
      const normTag = selectedTag.toLowerCase().trim();
      filtered = filtered.filter(post =>
        post.tags.some(t => t.toLowerCase().trim() === normTag) ||
        post.category?.toLowerCase().trim() === normTag
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  }, [blogPosts, selectedCategory, selectedTag, sortBy]);

  // Handle tag click
  const handleTagClick = (e: React.MouseEvent<HTMLButtonElement>, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    const nextTag = selectedTag === tag ? null : tag;
    setSelectedTag(nextTag);
    setSelectedCategory('all'); // Reset category when filtering by tag

    if (nextTag) {
      const encoded = encodeURIComponent(nextTag.trim());
      router.push(`/blog?tag=${encoded}`);
    } else {
      router.push('/blog');
    }
  };

  const resolvedTitle = pageTitle || 'All Blog Posts';

  return (
    <div className="min-h-screen hero-gradient-bg" style={{ color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24 py-12">

        {/* Page header */}
        <header className="mb-10">
          <div className="flex items-start gap-4 mb-2">
            <div className="hidden sm:block w-1 h-14 rounded-full mt-1 flex-shrink-0"
              style={{ background: 'linear-gradient(180deg, var(--accent-400) 0%, var(--accent-200) 100%)' }} />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
                style={{ color: 'var(--text-primary)' }}>
                {resolvedTitle}
              </h1>
              {pageDescription && (
                <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {pageDescription}
                </p>
              )}
            </div>
          </div>

          {selectedTag && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Filtered by tag:</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                #{selectedTag}
              </span>
              <button
                onClick={() => { setSelectedTag(null); router.push('/blog'); }}
                className="text-xs px-2 py-0.5 rounded-full transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
              >
                ✕ Clear
              </button>
            </div>
          )}
        </header>

        {/* Filtering/Sorting Bar */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-4 mb-10 pb-4"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-6">
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                {filteredAndSortedPosts.length}
              </span>{' '}
              {filteredAndSortedPosts.length === 1 ? 'post' : 'posts'}
              {filteredAndSortedPosts.length !== blogPosts.length && (
                <span> of <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{blogPosts.length}</span></span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
            <CustomDropdown
              options={[
                { value: 'date', label: 'Latest First' },
                { value: 'title', label: 'Title A-Z' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'date' | 'title')}
              placeholder="Sort by"
            />
          </div>
        </div>

        {/* Blog Posts — grid: one featured full-width, then 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {filteredAndSortedPosts.map((post, index) => {
            const accent = getCategoryAccent(post.category);
            const isFeatured = index === 0 && !selectedTag && sortBy === 'date';
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`block group ${isFeatured ? 'md:col-span-2' : ''}`}
                onClick={() => trackBlogCardClick(post.slug, post.title, 'blog-listing')}
              >
                <article
                  className="rounded-xl border overflow-hidden blog-card-glass relative"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {/* Category dot accent — left edge */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl transition-all duration-200"
                    style={{ backgroundColor: accent.dot, opacity: 0.6 }} />

                  <div className="w-full px-5 md:px-7 py-5 md:py-6 flex flex-col justify-between">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h2
                        className="text-xl md:text-2xl font-bold leading-snug transition-colors duration-200 flex-1 group-hover:text-[var(--accent-500)]"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {post.title}
                      </h2>
                      {isFeatured && (
                        <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full self-start"
                          style={{ backgroundColor: 'var(--gold-100)', color: 'var(--gold-500)' }}>
                          Latest
                        </span>
                      )}
                      {post.category && (
                        <span className="flex-shrink-0 hidden md:inline-flex text-xs font-medium px-2.5 py-1 rounded-full items-center gap-1.5"
                          style={{ backgroundColor: accent.badge, color: accent.dot }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent.dot }} />
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="mb-4 leading-relaxed line-clamp-2 text-sm md:text-base"
                      style={{ color: 'var(--text-muted)' }}>
                      {post.description}
                    </p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <button
                            key={tag}
                            onClick={(e) => handleTagClick(e, tag)}
                            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-200${tagIndex >= 3 ? ' hidden sm:inline-block' : ''}`}
                            style={selectedTag === tag
                              ? { backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }
                              : { backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }
                            }
                            onMouseEnter={e => {
                              if (selectedTag !== tag) {
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-100)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (selectedTag !== tag) {
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-50)';
                              }
                            }}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs pt-3"
                      style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      <time dateTime={post.date} className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 01-2 2z" />
                        </svg>
                        {format(new Date(post.date), 'MMM dd, yyyy')}
                      </time>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.readingTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {isLoadingStats ? '–' : (
                          <ViewCounter type="blog" slug={post.slug} showLabel={false} className="text-xs" initialCount={stats.views[post.slug] ?? 0} />
                        )}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        {isLoadingStats ? '–' : `${stats.upvotes[post.slug]?.toLocaleString() || 0} upvotes`}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* No Results */}
        {filteredAndSortedPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-50)' }}>
              <svg className="w-10 h-10" style={{ color: 'var(--accent-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No posts found</h3>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              {selectedCategory === 'all' && !selectedTag
                ? "No blog posts available yet. Check back soon!"
                : selectedTag
                  ? `No posts found with tag "${selectedTag}". Try selecting a different tag.`
                  : `No posts found in "${selectedCategory}" category. Try selecting a different category.`
              }
            </p>
            {(selectedCategory !== 'all' || selectedTag) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTag(null);
                  router.push('/blog');
                }}
                className="btn btn-secondary btn-md"
              >
                Show All Posts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
