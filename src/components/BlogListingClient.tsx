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

/* ───── Author avatar with initials ───── */
function AuthorAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name
    .split(' ')
    .map(w => w.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const dims = size === 'md' ? 'w-7 h-7 text-[11px]' : 'w-5 h-5 text-[9px]';

  return (
    <div
      className={`${dims} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{ backgroundColor: 'var(--accent-100)', color: 'var(--accent-600)' }}
    >
      {initials}
    </div>
  );
}

/* ───── Hero card (first post, spans 2 cols + 2 rows on desktop) ───── */
function HeroCard({
  post,
  stats,
  isLoadingStats,
  onTagClick,
}: {
  post: BlogPost;
  stats: BlogStats;
  isLoadingStats: boolean;
  onTagClick: (e: React.MouseEvent<HTMLButtonElement>, tag: string) => void;
}) {
  const authorName = post.author || 'Ratnesh Maurya';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block md:col-span-2 md:row-span-2"
      onClick={() => trackBlogCardClick(post.slug, post.title, 'blog-listing')}
    >
      <article className="h-full flex flex-col">
        {/* Cover image */}
        {post.image ? (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority
            />
          </div>
        ) : (
          <div
            className="relative aspect-video rounded-xl overflow-hidden mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-50)' }}
          >
            <span className="text-4xl font-bold" style={{ color: 'var(--accent-500)' }}>
              {post.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map(tag => (
              <button
                key={tag}
                onClick={(e) => onTagClick(e, tag)}
                className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors hover:opacity-80"
                style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className="font-extrabold text-2xl md:text-3xl leading-snug mb-2 transition-colors duration-200"
          style={{ color: 'var(--text-primary)' }}
        >
          {post.title}
        </h2>

        {/* Description */}
        {post.description && (
          <p
            className="text-base leading-relaxed line-clamp-2 mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            {post.description}
          </p>
        )}

        {/* Author strip */}
        <div className="mt-auto flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
          <AuthorAvatar name={authorName} size="md" />
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {authorName}
          </span>
          <span>·</span>
          <time dateTime={post.date}>
            {format(new Date(post.date), 'MMM d, yyyy')}
          </time>
          <span>·</span>
          <span>{post.readingTime}</span>
          {!isLoadingStats && stats.views[post.slug] != null && (
            <>
              <span>·</span>
              <ViewCounter
                type="blog"
                slug={post.slug}
                showLabel={false}
                className="text-[13px]"
                initialCount={stats.views[post.slug] ?? 0}
              />
              <span>views</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}

/* ───── Standard card ───── */
function PostCard({
  post,
  stats,
  isLoadingStats,
  onTagClick,
}: {
  post: BlogPost;
  stats: BlogStats;
  isLoadingStats: boolean;
  onTagClick: (e: React.MouseEvent<HTMLButtonElement>, tag: string) => void;
}) {
  const authorName = post.author || 'Ratnesh Maurya';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block"
      onClick={() => trackBlogCardClick(post.slug, post.title, 'blog-listing')}
    >
      <article className="h-full flex flex-col rounded-xl transition-shadow duration-300 hover:shadow-lg"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        {/* Cover image */}
        {post.image ? (
          <div className="relative aspect-video rounded-t-xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div
            className="relative aspect-video rounded-t-xl overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-50)' }}
          >
            <span className="text-3xl font-bold" style={{ color: 'var(--accent-500)' }}>
              {post.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Card body */}
        <div className="flex flex-col flex-1 p-4">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {post.tags.slice(0, 2).map(tag => (
                <button
                  key={tag}
                  onClick={(e) => onTagClick(e, tag)}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          <h2
            className="font-extrabold text-xl leading-snug mb-1.5 transition-colors duration-200"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.title}
          </h2>

          {/* Description */}
          {post.description && (
            <p
              className="text-sm leading-relaxed line-clamp-2 mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              {post.description}
            </p>
          )}

          {/* Author strip */}
          <div className="mt-auto flex items-center gap-2 text-[12px]" style={{ color: 'var(--text-muted)' }}>
            <AuthorAvatar name={authorName} />
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {authorName}
            </span>
            <span>·</span>
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMM d')}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
            {!isLoadingStats && stats.views[post.slug] != null && (
              <>
                <span>·</span>
                <ViewCounter
                  type="blog"
                  slug={post.slug}
                  showLabel={false}
                  className="text-[12px]"
                  initialCount={stats.views[post.slug] ?? 0}
                />
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main listing component
   ═══════════════════════════════════════════════════════════════ */
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

  /* Should we show the hero card? Only for default view (no tag, sorted by date) with at least 1 post */
  const showHero = !selectedTag && sortBy === 'date' && filteredAndSortedPosts.length > 0;
  const heroPost = showHero ? filteredAndSortedPosts[0] : null;
  const gridPosts = showHero ? filteredAndSortedPosts.slice(1) : filteredAndSortedPosts;

  return (
    <div className="min-h-screen" style={{ color: 'var(--text-primary)', background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* ━━━ Header ━━━ */}
        <header className="mb-8">
          <h1 className="text-[30px] md:text-[34px] font-bold tracking-tight leading-tight"
            style={{ color: 'var(--text-primary)' }}>
            {resolvedTitle}
          </h1>
          {resolvedDescription && (
            <p className="mt-2 text-[15px] md:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              {resolvedDescription}
            </p>
          )}
        </header>

        {/* ━━━ Topic Navigation (horizontal scrollable tabs) ━━━ */}
        <nav
          className="flex flex-nowrap items-center gap-3 overflow-x-auto pb-3 mb-8 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ borderBottom: '1px solid var(--border)', WebkitOverflowScrolling: 'touch' }}
        >
          <button
            onClick={() => { setSelectedTag(null); setSelectedCategory('all'); updateUrl(null); }}
            className={`flex-shrink-0 whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition-colors ${!selectedTag ? 'font-semibold' : ''}`}
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
              className={`flex-shrink-0 whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition-colors ${selectedTag === tag ? 'font-semibold' : ''}`}
              style={selectedTag === tag
                ? { backgroundColor: 'var(--text-primary)', color: 'var(--background)' }
                : { color: 'var(--text-muted)' }
              }
            >
              {tag}
            </button>
          ))}

          {/* Sort control */}
          <div className="ml-auto hidden md:flex items-center gap-2 pl-4 flex-shrink-0">
            <CustomDropdown
              options={[
                { value: 'date', label: 'Latest' },
                { value: 'title', label: 'Title A-Z' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'date' | 'title')}
              placeholder="Sort"
            />
          </div>
        </nav>

        {/* ━━━ Card Grid ━━━ */}
        {filteredAndSortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Hero card */}
            {heroPost && (
              <HeroCard
                post={heroPost}
                stats={stats}
                isLoadingStats={isLoadingStats}
                onTagClick={handleTagClick}
              />
            )}

            {/* Remaining cards */}
            {gridPosts.map(post => (
              <PostCard
                key={post.slug}
                post={post}
                stats={stats}
                isLoadingStats={isLoadingStats}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        ) : (
          /* ━━━ No Results ━━━ */
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
