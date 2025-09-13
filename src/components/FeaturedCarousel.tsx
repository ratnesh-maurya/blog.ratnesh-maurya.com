'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';
import { BlogCardImage } from '@/components/BlogImage';
import { format } from 'date-fns';
import Link from 'next/link';
import { trackCarouselInteraction } from '@/lib/analytics';

interface FeaturedCarouselProps {
  posts: BlogPost[];
}

export function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (posts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [posts.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    const newSlide = (currentSlide - 1 + posts.length) % posts.length;
    setCurrentSlide(newSlide);
    trackCarouselInteraction('previous', newSlide);
  };

  const goToNext = () => {
    const newSlide = (currentSlide + 1) % posts.length;
    setCurrentSlide(newSlide);
    trackCarouselInteraction('next', newSlide);
  };

  if (posts.length === 0) return null;

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)' }}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-semibold">FEATURED CONTENT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            <span className="gradient-text-primary">Spotlight</span> Articles
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Handpicked insights from backend engineering, system design, and real-world development experiences
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-xl" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {posts.map((post) => (
                <div key={post.slug} className="w-full flex-shrink-0">
                  <article className="relative overflow-hidden" style={{
                    background: 'linear-gradient(135deg, var(--primary-50), var(--surface), var(--primary-25))'
                  }}>
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0">
                      <div className="relative w-full overflow-hidden h-64 lg:h-[450px] group">
                        <BlogCardImage post={post} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2" style={{
                            backgroundColor: 'var(--primary-500)',
                            color: 'var(--text-inverse)'
                          }}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            FEATURED
                          </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex flex-wrap gap-2">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: 'var(--text-primary)'
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-8 lg:p-12 flex flex-col justify-center h-full min-h-[350px] lg:min-h-[450px]">
                        <div className="flex items-center text-sm mb-4 lg:mb-6" style={{ color: 'var(--text-muted)' }}>
                          <time dateTime={post.date} className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {format(new Date(post.date), 'MMM dd, yyyy')}
                          </time>
                          <span className="mx-3">•</span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {post.readingTime}
                          </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 lg:mb-6 leading-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                          <Link href={`/blog/${post.slug}`} className="transition-colors" style={{ color: 'inherit' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                          >
                            {post.title}
                          </Link>
                        </h2>
                        <p className="mb-6 lg:mb-8 text-lg leading-relaxed line-clamp-3 flex-grow" style={{ color: 'var(--text-secondary)' }}>
                          {post.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6 lg:mb-8">
                          {post.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="bg-white/80 backdrop-blur-sm text-gray-700 text-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="btn btn-primary btn-lg inline-flex items-center w-fit group"
                        >
                          Read Full Article
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation */}
          {posts.length > 1 && (
            <>
              <button
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200 z-10 group"
                onClick={goToPrevious}
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200 z-10 group"
                onClick={goToNext}
                aria-label="Next slide"
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Carousel Indicators */}
              <div className="flex justify-center mt-8 space-x-3">
                {posts.map((_, index) => (
                  <button
                    key={index}
                    className={`transition-all duration-300 rounded-full ${index === currentSlide
                      ? 'w-8 h-3 bg-blue-600 shadow-md'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-110'
                      }`}
                    onClick={() => {
                      goToSlide(index);
                      trackCarouselInteraction('indicator', index);
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
