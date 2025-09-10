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
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {posts.map((post) => (
                <div key={post.slug} className="w-full flex-shrink-0">
                  <article className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-0">
                      <div className="relative w-full overflow-hidden h-48 md:h-[400px]">
                        <BlogCardImage post={post} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-center h-full min-h-[300px] md:min-h-[400px]">
                        <div className="flex items-center text-sm text-gray-500 mb-3 md:mb-4">
                          <span className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                            FEATURED
                          </span>
                          <span className="mx-2 md:mx-3">•</span>
                          <span className="text-xs md:text-sm">{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                          <span className="mx-2 md:mx-3">•</span>
                          <span className="text-xs md:text-sm">{post.readingTime}</span>
                        </div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight line-clamp-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4 md:mb-6 text-base md:text-lg leading-relaxed line-clamp-3 flex-grow">
                          {post.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                          {post.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="bg-white text-gray-700 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full shadow-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-base md:text-lg transition-colors mt-auto"
                        >
                          Read Article
                          <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10"
                onClick={goToPrevious}
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10"
                onClick={goToNext}
                aria-label="Next slide"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Carousel Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {posts.map((_, index) => (
                  <button
                    key={index}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-colors ${index === currentSlide
                      ? 'bg-blue-600'
                      : 'bg-gray-300 hover:bg-gray-400'
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
