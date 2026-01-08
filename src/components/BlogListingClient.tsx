'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { CustomDropdown } from '@/components/CustomDropdown';
import { ViewCounter } from '@/components/ViewCounter';
import { BlogPost } from '@/types/blog';
import { trackBlogCardClick } from '@/lib/analytics';

interface BlogListingClientProps {
  blogPosts: BlogPost[];
}

interface BlogStats {
  views: Record<string, number>;
  upvotes: Record<string, number>;
}

export function BlogListingClient({ blogPosts }: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [stats, setStats] = useState<BlogStats>({ views: {}, upvotes: {} });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch stats from master API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/blog');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching blog stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPosts.map(post => post.category)));
    return ['all', ...cats.sort()];
  }, [blogPosts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
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
    setSelectedTag(selectedTag === tag ? null : tag);
    setSelectedCategory('all'); // Reset category when filtering by tag
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-24 py-12">

        {/* Filtering/Sorting Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-4 mb-12 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Total Posts:</span> {blogPosts.length}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Sort by:</span>
            </div>
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

        {/* Blog Posts */}
        <div className="space-y-6">
          {filteredAndSortedPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
              onClick={() => trackBlogCardClick(post.slug, post.title, 'blog-listing')}
            >
              <article className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Content */}
                <div className="w-full p-4 md:p-4 flex flex-col justify-between">
                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => handleTagClick(e, tag)}
                          className={`inline-block text-sm font-medium px-3 py-1 rounded-full transition-colors ${selectedTag === tag
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <time dateTime={post.date} className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(post.date), 'MMM dd, yyyy')}
                    </time>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readingTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {isLoadingStats ? (
                        <span className="text-sm text-gray-500">–––</span>
                      ) : (
                        <ViewCounter
                          slug={post.slug}
                          showLabel={false}
                          className="text-sm"
                          initialCount={stats.views[post.slug] ?? 0}
                        />
                      )}
                    </span>
                    {isLoadingStats ? (
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        –––
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        {stats.upvotes[post.slug]?.toLocaleString() || 0} upvotes
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-6">
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
