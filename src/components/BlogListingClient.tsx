'use client';

import { CustomDropdown } from '@/components/CustomDropdown';
import { ViewCounter } from '@/components/ViewCounter';
import { trackBlogCardClick } from '@/lib/analytics';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

/* ───── Unique tags across all posts (for the topic nav) ───── */
function getTopTags(posts: BlogPost[], max = 8): string[] {
  const freq: Record<string, number> = {};
  for (const p of posts) {
    for (const t of p.tags) {
      freq[t] = (freq[t] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([tag]) => tag);
}

export function BlogListingClient({ blogPosts, initialTag: propTag = null, pageTitle, pageDescription }: BlogListingClientProps) {
  const searchParams = useSearchParams();
  const urlTag = searchParams.get('tag');
  const initialTag = propTag ?? (urlTag ? decodeURIComponent(urlTag).trim() : null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [stats, setStats] = useState<BlogStats>({ views: {}, upvotes: {} });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (propTag != null) return;
    const tag = searchParams.get('tag');
    setSelectedTag(tag ? decodeURIComponent(tag).trim() : null);
    setSelectedCategory('all');
  }, [searchParams, propTag]);

  const updateUrl = useCallback((nextTag: string | null) => {
    if (propTag != null) return;
    const url = nextTag ? `/blog?tag=${encodeURIComponent(nextTag.trim())}` : '/blog';
    window.history.replaceState(null, '', url);
  }, [propTag]);

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

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogPosts;
    if (selectedCategory !== 'all') {
      const normCat = selectedCategory.toLowerCase();
      filtered = filtered.filter(post => post.category?.toLowerCase() === normCat);
    }
    if (selectedTag) {
      const normTag = selectedTag.toLowerCase().trim();
      filtered = filtered.filter(post =>
        post.tags.some(t => t.toLowerCase().trim() === normTag) ||
        post.category?.toLowerCase().trim() === normTag
      );
    }
    return filtered.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.title.localeCompare(b.title);
    });
  }, [blogPosts, selectedCategory, selectedTag, sortBy]);

  const handleTagClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    const nextTag = selectedTag === tag ? null : tag;
    setSelectedTag(nextTag);
    setSelectedCategory('all');
    updateUrl(nextTag);
  };

  const topTags = useMemo(() => getTopTags(blogPosts), [blogPosts]);

  const baseDescription = 'Explore all my thoughts on web development, programming, and technology. Learn from real-world experiences and practical insights.';
  const resolvedTitle = pageTitle ?? (selectedTag ? `Posts tagged "${selectedTag}"` : 'All Blog Posts');
  const resolvedDescription = pageDescription ?? (selectedTag
    ? `Browse all blog posts tagged "${selectedTag}" from Ratn Labs.`
    : baseDescription);

  return (
    <div className="min-h-screen" style={{ color: 'var(--text-primary)', background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* ━━━ Header ━━━ */}
        <header className="mb-8">
          <h1 className="text-[30px] md:text-[34px] font-bold tracking-tight leading-tight"
            style={{ color: 'var(--text-primary)' }}>
            {resolvedTitle}
          </h1>
          {resolvedDescription && (
            <p className="mt-2 text-[15px] md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {resolvedDescription}
            </p>
          )}
        </header>

        {/* ━━━ Topic Navigation (Medium-style horizontal tabs) ━━━ */}
        <nav
          className="medium-topic-nav flex flex-nowrap items-center gap-3 overflow-x-auto pb-3 mb-8 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ borderBottom: '1px solid var(--border)', WebkitOverflowScrolling: 'touch' }}
        >
          <button
            onClick={() => { setSelectedTag(null); setSelectedCategory('all'); updateUrl(null); }}
            className={`medium-topic-tab flex-shrink-0 whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition-colors ${!selectedTag ? 'medium-topic-tab--active font-semibold' : ''
              }`}
            style={!selectedTag
              ? { backgroundColor: 'var(--text-primary)', color: 'var(--background)' }
              : { color: 'var(--text-muted)' }
            }
          >
            For you
          </button>
          {topTags.map(tag => (
            <button
              key={tag}
              onClick={(e) => handleTagClick(e, tag)}
              className={`medium-topic-tab flex-shrink-0 whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition-colors ${selectedTag === tag ? 'medium-topic-tab--active font-semibold' : ''
                }`}
              style={selectedTag === tag
                ? { backgroundColor: 'var(--text-primary)', color: 'var(--background)' }
                : { color: 'var(--text-muted)' }
              }
            >
              {tag}
            </button>
          ))}

          {/* Sort control — right side */}
          <div className="ml-auto hidden md:flex items-center gap-2 pl-4 flex-shrink-0">
            <CustomDropdown
              options={[
                { value: 'date', label: 'Latest' },
                { value: 'title', label: 'Title A–Z' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'date' | 'title')}
              placeholder="Sort"
            />
          </div>
        </nav>

        {/* ━━━ Post List ━━━ */}
        <div className="flex flex-col">
          {filteredAndSortedPosts.map((post, index, arr) => {
            const isLatest = index === 0 && sortBy === 'date' && !selectedTag;
            return (
              <div key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-6"
                  onClick={() => trackBlogCardClick(post.slug, post.title, 'blog-listing')}
                >
                  <article className="flex gap-5 items-start">
                    {/* Text side */}
                    <div className="flex-1 min-w-0">
                      {/* Author + Latest badge line */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                          style={{ backgroundColor: 'var(--accent-100)', color: 'var(--accent-600)' }}>
                          {post.author?.charAt(0) || 'R'}
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                          {post.author || 'Ratnesh Maurya'}
                        </span>
                        {isLatest && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                            Latest
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold leading-snug mb-1 group-hover:underline decoration-1 underline-offset-2"
                        style={{ color: 'var(--text-primary)' }}>
                        {post.title}
                      </h2>

                      {/* Description — visible on all screen sizes */}
                      <p className="text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed line-clamp-2 mb-3"
                        style={{ color: 'var(--text-secondary)' }}>
                        {post.description}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-1.5 text-[13px] sm:text-[13px]" style={{ color: 'var(--text-muted)' }}>
                        <time dateTime={post.date}>
                          {format(new Date(post.date), 'MMM d, yyyy')}
                        </time>
                        <span>·</span>
                        <span>{post.readingTime}</span>
                        {!isLoadingStats && stats.views[post.slug] != null && (
                          <>
                            <span>·</span>
                            <ViewCounter type="blog" slug={post.slug} showLabel={false} className="text-[12px] sm:text-[13px]" initialCount={stats.views[post.slug] ?? 0} />
                            <span> views</span>
                          </>
                        )}

                        {/* Bookmark icon */}
                        <button
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          aria-label="Bookmark"
                        >
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 3H7a2 2 0 00-2 2v16l7-5 7 5V5a2 2 0 00-2-2z" />
                          </svg>
                        </button>
                      </div>

                      {/* Tags row — separate line, hidden on mobile */}
                      {post.tags.length > 0 && (
                        <div className="hidden sm:flex items-center gap-1.5 mt-2">
                          {post.tags.slice(0, 2).map(tag => (
                            <button
                              key={tag}
                              onClick={(e) => handleTagClick(e, tag)}
                              className="px-2 py-0.5 rounded-full text-xs transition-colors hover:opacity-80"
                              style={selectedTag === tag
                                ? { backgroundColor: 'var(--text-primary)', color: 'var(--background)' }
                                : { backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }
                              }
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail — smaller on mobile */}
                    {post.image && (
                      <div className="flex-shrink-0 w-[80px] sm:w-[112px] md:w-[140px] relative rounded overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={280}
                          height={187}
                          className="object-cover w-full h-auto rounded"
                          sizes="(max-width: 640px) 80px, 140px"
                        />
                      </div>
                    )}
                  </article>
                </Link>

                {/* Divider between posts */}
                {index < arr.length - 1 && (
                  <hr className="border-0" style={{ borderTop: '1px solid var(--border)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ━━━ No Results ━━━ */}
        {filteredAndSortedPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
              No stories found
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              {selectedTag
                ? `No posts tagged "${selectedTag}". Try another topic.`
                : selectedCategory !== 'all'
                  ? `Nothing in "${selectedCategory}" yet.`
                  : 'No blog posts available yet. Check back soon!'}
            </p>
            {(selectedCategory !== 'all' || selectedTag) && (
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedTag(null); updateUrl(null); }}
                className="text-sm font-medium px-4 py-2 rounded-full transition-colors"
                style={{ backgroundColor: 'var(--text-primary)', color: 'var(--background)' }}
              >
                Browse all stories
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
