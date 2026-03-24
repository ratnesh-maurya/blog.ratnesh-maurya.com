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

function MetaRow({ post, stats, isLoadingStats, compact = false }: {
  post: BlogPost;
  stats: BlogStats;
  isLoadingStats: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${compact ? 'text-[12px]' : 'text-[13px]'}`} style={{ color: 'var(--text-muted)' }}>
      <time dateTime={post.date}>
        {format(new Date(post.date), compact ? 'MMM d, yyyy' : 'MMM d, yyyy')}
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
            className={compact ? 'text-[12px]' : 'text-[13px]'}
            initialCount={stats.views[post.slug] ?? 0}
          />
          <span>views</span>
        </>
      )}
    </div>
  );
}

/* ─── Cover image shared component ─── */
function CoverImage({ post, sizes, priority = false, aspectClass = 'aspect-video' }: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
  aspectClass?: string;
}) {
  if (post.image) {
    return (
      <div className={`relative ${aspectClass} w-full overflow-hidden`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          sizes={sizes}
          priority={priority}
        />
      </div>
    );
  }
  return (
    <div
      className={`relative ${aspectClass} w-full overflow-hidden flex items-center justify-center`}
      style={{ backgroundColor: 'var(--nb-card-2)' }}
    >
      <span className="text-4xl font-bold" style={{ color: 'var(--text-muted)' }}>
        {post.title.charAt(0)}
      </span>
    </div>
  );
}

/* ─── Small side card (left/right columns) ─── */
function SmallCard({ post, stats, isLoadingStats, colorIdx = 0 }: {
  post: BlogPost;
  stats: BlogStats;
  isLoadingStats: boolean;
  onTagClick: (e: React.MouseEvent<HTMLButtonElement>, tag: string) => void;
  colorIdx?: number;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full"
      onClick={() => trackBlogCardClick(post.slug, post.title, 'blog-listing')}
    >
      <article className="nb-card flex flex-col gap-3 h-full p-3" style={{ backgroundColor: `var(--nb-card-${colorIdx % 6})` }}>
        <div className="rounded-lg overflow-hidden" style={{ border: '2px solid var(--nb-border)' }}>
          <CoverImage
            post={post}
            sizes="(max-width: 768px) 100vw, 25vw"
            aspectClass="aspect-[16/9]"
          />
        </div>
        <div>
          <h2
            className="font-extrabold text-[15px] leading-snug mb-1 nb-title-hover"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.title}
          </h2>
          <MetaRow post={post} stats={stats} isLoadingStats={isLoadingStats} compact />
        </div>
      </article>
    </Link>
  );
}

/* ─── Center hero card ─── */
function HeroCard({ post, stats, isLoadingStats }: {
  post: BlogPost;
  stats: BlogStats;
  isLoadingStats: boolean;
  onTagClick: (e: React.MouseEvent<HTMLButtonElement>, tag: string) => void;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full"
      onClick={() => trackBlogCardClick(post.slug, post.title, 'blog-listing')}
    >
      <article className="nb-card flex flex-col gap-4 h-full p-5" style={{ backgroundColor: 'var(--nb-card-featured)' }}>
        <div className="rounded-xl overflow-hidden" style={{ border: '2px solid var(--nb-border)' }}>
          <CoverImage
            post={post}
            sizes="(max-width: 768px) 100vw, 40vw"
            aspectClass="aspect-[16/9]"
            priority
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="nb-badge nb-badge-primary self-start">{post.category}</span>
          <h2
            className="font-extrabold text-xl md:text-2xl lg:text-3xl leading-snug nb-title-hover"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.title}
          </h2>
          {post.description && (
            <p className="text-sm md:text-base leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {post.description}
            </p>
          )}
          <MetaRow post={post} stats={stats} isLoadingStats={isLoadingStats} />
        </div>
      </article>
    </Link>
  );
}

/* ─── Standard card for grid below the 5-panel layout ─── */
function GridCard({ post, stats, isLoadingStats, colorIdx = 0 }: {
  post: BlogPost;
  stats: BlogStats;
  isLoadingStats: boolean;
  onTagClick: (e: React.MouseEvent<HTMLButtonElement>, tag: string) => void;
  colorIdx?: number;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full"
      onClick={() => trackBlogCardClick(post.slug, post.title, 'blog-listing')}
    >
      <article
        className="nb-card flex flex-col gap-3 h-full"
        style={{ backgroundColor: `var(--nb-card-${colorIdx % 6})` }}
      >
        <div className="rounded-t-[10px] overflow-hidden" style={{ borderBottom: '2px solid var(--nb-border)' }}>
          <CoverImage
            post={post}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            aspectClass="aspect-[16/9]"
          />
        </div>
        <div className="px-4 pb-4 flex flex-col gap-2">
          <span className="nb-badge nb-badge-primary self-start">{post.category}</span>
          <h2
            className="font-extrabold text-base leading-snug nb-title-hover"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.title}
          </h2>
          {post.description && (
            <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {post.description}
            </p>
          )}
          <MetaRow post={post} stats={stats} isLoadingStats={isLoadingStats} compact />
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

  /* Show the Hashnode-style 5-panel layout only for the default (no filter) view */
  const showMagazineLayout = !selectedTag && selectedCategory === 'all' && sortBy === 'date' && filteredAndSortedPosts.length >= 3;

  /* For magazine layout: center=[0], left=[1,2], right=[3,4], rest=[5+] */
  const leftPosts = showMagazineLayout ? filteredAndSortedPosts.slice(1, 3) : [];
  const heroPosts = showMagazineLayout ? filteredAndSortedPosts.slice(0, 1) : [];
  const rightPosts = showMagazineLayout ? filteredAndSortedPosts.slice(3, 5) : [];
  const remainingPosts = showMagazineLayout ? filteredAndSortedPosts.slice(5) : filteredAndSortedPosts;

  const cardProps = { stats, isLoadingStats, onTagClick: handleTagClick };

  return (
    <div className="min-h-screen" style={{ color: 'var(--text-primary)', background: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* ━━━ Header ━━━ */}
        <header className="mb-8 pt-4">
          <p className="nb-section-label mb-2">Blog</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {resolvedTitle}
          </h1>
          {resolvedDescription && (
            <p className="mt-2 text-base leading-relaxed max-w-2xl font-medium" style={{ color: 'var(--text-muted)' }}>
              {resolvedDescription}
            </p>
          )}
        </header>

        {/* ━━━ Topic Navigation ━━━ */}
        <nav
          className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ borderBottom: '2px solid var(--nb-border)', WebkitOverflowScrolling: 'touch' }}
        >
          <button
            onClick={() => { setSelectedTag(null); setSelectedCategory('all'); updateUrl(null); }}
            className="nb-badge flex-shrink-0 whitespace-nowrap transition-all duration-150"
            style={!selectedTag && selectedCategory === 'all'
              ? { backgroundColor: 'var(--nb-badge-bg)', color: 'var(--nb-badge-text)', borderColor: 'var(--nb-badge-bg)' }
              : { backgroundColor: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--nb-border)' }
            }
          >
            All posts
          </button>
          {topTags.map(tag => (
            <button
              key={tag}
              onClick={(e) => handleTagClick(e, tag)}
              className="nb-badge flex-shrink-0 whitespace-nowrap transition-all duration-150"
              style={selectedTag === tag
                ? { backgroundColor: 'var(--nb-badge-bg)', color: 'var(--nb-badge-text)', borderColor: 'var(--nb-badge-bg)' }
                : { backgroundColor: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--nb-border)' }
              }
            >
              {tag}
            </button>
          ))}
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

        {filteredAndSortedPosts.length > 0 ? (
          <div className="space-y-10">
            {/* ━━━ Hashnode magazine 5-panel grid ━━━ */}
            {showMagazineLayout && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Left column — 2 small cards */}
                <div className="flex flex-col gap-4">
                  {leftPosts.map((post, i) => (
                    <SmallCard key={post.slug} post={post} {...cardProps} colorIdx={i} />
                  ))}
                </div>

                {/* Center column — 1 large hero (spans 2 cols) */}
                <div className="lg:col-span-2 h-full">
                  {heroPosts.map(post => (
                    <HeroCard key={post.slug} post={post} {...cardProps} />
                  ))}
                </div>

                {/* Right column — 2 small cards */}
                <div className="flex flex-col gap-4">
                  {rightPosts.map((post, i) => (
                    <SmallCard key={post.slug} post={post} {...cardProps} colorIdx={i + 2} />
                  ))}
                </div>
              </div>
            )}

            {/* ━━━ Remaining posts in standard 3-col grid ━━━ */}
            {remainingPosts.length > 0 && (
              <>
                {showMagazineLayout && (
                  <hr className="nb-separator" />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {remainingPosts.map((post, i) => (
                    <GridCard key={post.slug} post={post} {...cardProps} colorIdx={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          /* ━━━ No Results ━━━ */
          <div className="text-center py-20">
            <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No stories found</p>
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
