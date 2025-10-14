'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { BlogCardImage } from '@/components/BlogImage';
import { CustomDropdown } from '@/components/CustomDropdown';
import { BlogPost } from '@/types/blog';
import { trackBlogCardClick } from '@/lib/analytics';

interface BlogListingClientProps {
  blogPosts: BlogPost[];
}

export function BlogListingClient({ blogPosts }: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPosts.map(post => post.category)));
    return ['all', ...cats.sort()];
  }, [blogPosts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    const filtered = selectedCategory === 'all'
      ? blogPosts
      : blogPosts.filter(post => post.category === selectedCategory);

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  }, [blogPosts, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            All <span className="gradient-text-primary">Blog Posts</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Dive deep into web development, programming insights, and technical tutorials.
            Discover solutions, best practices, and lessons learned from real-world projects.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{blogPosts.length}</div>
              <div className="text-gray-500 text-sm">Total Posts</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{categories.length - 1}</div>
              <div className="text-gray-500 text-sm">Categories</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 p-6 rounded-xl shadow-sm border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex-1">
            <CustomDropdown
              label="Filter by Category"
              options={categories.map(category => ({
                value: category,
                label: category === 'all' ? 'All Categories' : category
              }))}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select category"
            />
          </div>
          <div className="flex-1">
            <CustomDropdown
              label="Sort by"
              options={[
                { value: 'date', label: 'Latest First' },
                { value: 'title', label: 'Title A-Z' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'date' | 'title')}
              placeholder="Select sort order"
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Showing {filteredAndSortedPosts.length} of {blogPosts.length} posts
            </div>
          </div>
        </div>


        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredAndSortedPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
              onClick={() => trackBlogCardClick(post.slug, post.title, 'blog-listing')}
            >
              <article className="card card-interactive h-full flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="relative overflow-hidden rounded-t-xl">
                  <BlogCardImage
                    post={post}
                    className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  {post.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  {/* Meta Information */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <time dateTime={post.date} className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(post.date), 'MMM dd, yyyy')}
                    </time>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readingTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-medium px-3 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-gray-400 text-xs self-center font-medium">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                      Read article
                    </span>
                    <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
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
              {selectedCategory === 'all'
                ? "No blog posts available yet. Check back soon!"
                : `No posts found in "${selectedCategory}" category. Try selecting a different category.`
              }
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
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
