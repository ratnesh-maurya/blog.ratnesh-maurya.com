'use client';

import { CustomDropdown } from '@/components/CustomDropdown';
import { ViewCounter } from '@/components/ViewCounter';
import { trackBlogCardClick } from '@/lib/analytics';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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

function MetaRow({ post, stats, isLoadingStats }: {
  post: BlogPost;
  stats: BlogStats;
  isLoadingStats: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--muted)' }}>
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
            className="text-[12px]"
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
      style={{ backgroundColor: 'var(--glass-bg-subtle)' }}
    >
      <span className="text-4xl font-bold" style={{ color: 'var(--muted)' }}>
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
      <article
        className="nb-card flex flex-col gap-3 h-full p-3"
        style={{
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--glass-shadow-sm)',
          backdropFilter: 'blur(10px) saturate(160%)',
          WebkitBackdropFilter: 'blur(10px) saturate(160%)',
        }}
      >
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--line)' }}>
          <CoverImage
            post={post}
            sizes="(max-width: 768px) 100vw, 25vw"
            aspectClass="aspect-[16/9]"
          />
        </div>
        <div>
          <h2
            className="font-semibold text-[15px] leading-snug mb-1 nb-title-hover"
            style={{ color: 'var(--text)' }}
          >
            {post.title}
          </h2>
          <MetaRow post={post} stats={stats} isLoadingStats={isLoadingStats} />
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
      <article
        className="nb-card flex flex-col gap-4 h-full p-5"
        style={{
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--glass-shadow)',
          backdropFilter: 'blur(12px) saturate(160%)',
          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        }}
      >
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--line)' }}>
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
            className="font-semibold text-xl md:text-2xl lg:text-3xl leading-snug nb-title-hover"
            style={{ color: 'var(--text)' }}
          >
            {post.title}
          </h2>
          {post.description && (
            <p className="text-sm md:text-base leading-relaxed line-clamp-2" style={{ color: 'var(--body)' }}>
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
        style={{
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--glass-shadow-sm)',
          backdropFilter: 'blur(10px) saturate(160%)',
          WebkitBackdropFilter: 'blur(10px) saturate(160%)',
        }}
      >
        <div className="rounded-t-[10px] overflow-hidden" style={{ borderBottom: '1px solid var(--line)' }}>
          <CoverImage
            post={post}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            aspectClass="aspect-[16/9]"
          />
        </div>
        <div className="px-4 pb-4 flex flex-col gap-2">
          <span className="nb-badge nb-badge-primary self-start">{post.category}</span>
          <h2
            className="font-semibold text-base leading-snug nb-title-hover"
            style={{ color: 'var(--text)' }}
          >
            {post.title}
          </h2>
          {post.description && (
            <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--body)' }}>
              {post.description}
            </p>
          )}
          <MetaRow post={post} stats={stats} isLoadingStats={isLoadingStats} />
        </div>
      </article>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main listing component
   ═══════════════════════════════════════════════════════════════ */
const STATS_CACHE_KEY = 'blog_stats_cache';
const STATS_CACHE_TTL = 5 * 60 * 1000; // 5 min

export function BlogListingClient({ blogPosts, initialTag: propTag = null, pageTitle, pageDescription }: BlogListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTag = searchParams.get('tag');
  const initialTag = propTag ?? (urlTag ? decodeURIComponent(urlTag).trim() : null);

  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [visibleCount, setVisibleCount] = useState(24);
  const [stats, setStats] = useState<BlogStats>({ views: {}, upvotes: {} });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (propTag != null) return;
    const tag = searchParams.get('tag');
    setSelectedTag(tag ? decodeURIComponent(tag).trim() : null);
  }, [searchParams, propTag]);

  const updateUrl = useCallback((nextTag: string | null) => {
    if (propTag != null) return;
    const url = nextTag ? `/blog?tag=${encodeURIComponent(nextTag.trim())}` : '/blog';
    router.replace(url, { scroll: false });
  }, [propTag, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const cached = sessionStorage.getItem(STATS_CACHE_KEY);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < STATS_CACHE_TTL) {
            setStats(data);
            setIsLoadingStats(false);
            return;
          }
        }
        const { getStatsByType } = await import('@/lib/supabase/stats');
        const data = await getStatsByType('blog');
        sessionStorage.setItem(STATS_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
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
  }, [blogPosts, selectedTag, sortBy]);

  const handleTagClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    const nextTag = selectedTag === tag ? null : tag;
    setSelectedTag(nextTag);
    updateUrl(nextTag);
  };

  const topTags = useMemo(() => getTopTags(blogPosts), [blogPosts]);

  const baseDescription = 'Explore all my thoughts on web development, programming, and technology. Learn from real-world experiences and practical insights.';
  const resolvedDescription = pageDescription ?? (selectedTag
    ? `Browse all blog posts tagged "${selectedTag}" from Ratn Labs.`
    : baseDescription);

  /* Show the Hashnode-style 5-panel layout only for the default (no filter) view */
  const showMagazineLayout = !selectedTag && sortBy === 'date' && filteredAndSortedPosts.length >= 3;

  /* For magazine layout: center=[0], left=[1,2], right=[3,4], rest=[5+] */
  const leftPosts = showMagazineLayout ? filteredAndSortedPosts.slice(1, 3) : [];
  const heroPosts = showMagazineLayout ? filteredAndSortedPosts.slice(0, 1) : [];
  const rightPosts = showMagazineLayout ? filteredAndSortedPosts.slice(3, 5) : [];
  const allRemainingPosts = showMagazineLayout ? filteredAndSortedPosts.slice(5) : filteredAndSortedPosts;
  const remainingPosts = allRemainingPosts.slice(0, visibleCount);
  const hasMore = allRemainingPosts.length > visibleCount;

  const cardProps = { stats, isLoadingStats, onTagClick: handleTagClick };

  return (
    <div className="min-h-screen lg-blog" style={{ color: 'var(--text)', background: 'transparent' }}>
      <div className="wrap" style={{ paddingBlock: 'clamp(48px, 8vw, 96px) 24px' }}>

        {/* ━━━ Header ━━━ */}
        <header className="lg-page-head">
          <p className="lg-greet"><span lang="hi">लेख,</span> {filteredAndSortedPosts.length} posts</p>
          <h1 className="lg-h1 lg-h1-page">
            {pageTitle ?? (selectedTag ? <>Tagged <em>{selectedTag}</em></> : <>The <em>blog</em></>)}
          </h1>
          {resolvedDescription && (
            <p className="lede" style={{ margin: 0 }}>{resolvedDescription}</p>
          )}
        </header>

        {/* ━━━ Topic Navigation ━━━ */}
        <nav
          className="flex flex-nowrap items-center gap-2 overflow-x-auto py-5 mb-10 scrollbar-hide"
          style={{ borderBlock: '1px solid var(--line)', WebkitOverflowScrolling: 'touch' }}
        >
          <button
            onClick={() => { setSelectedTag(null); updateUrl(null); }}
            className="chip flex-shrink-0 whitespace-nowrap"
            aria-pressed={!selectedTag}
          >
            All posts
          </button>
          {topTags.map(tag => (
            <button
              key={tag}
              onClick={(e) => handleTagClick(e, tag)}
              className="chip flex-shrink-0 whitespace-nowrap"
              aria-pressed={selectedTag === tag}
            >
              {tag}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 pl-4 flex-shrink-0">
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
                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setVisibleCount(c => c + 24)}
                      className="btn btn-secondary"
                    >
                      Load more posts ({allRemainingPosts.length - visibleCount} left)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* ━━━ No Results ━━━ */
          <div className="text-center py-20">
            <p className="text-lg mb-2" style={{ color: 'var(--text)' }}>No stories found</p>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              {selectedTag
                ? `No posts tagged "${selectedTag}". Try another topic.`
                : 'No blog posts available yet. Check back soon!'}
            </p>
            {selectedTag && (
              <button
                onClick={() => { setSelectedTag(null); updateUrl(null); }}
                className="btn btn-primary"
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
