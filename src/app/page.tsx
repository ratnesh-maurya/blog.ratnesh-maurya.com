import { getAllBlogPosts, getAllSillyQuestions } from '@/lib/content';
import { WebsiteStructuredData, OrganizationStructuredData } from '@/components/StructuredData';
import { BlogCardImage, getDefaultSocialImage } from '@/components/BlogImage';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import Link from 'next/link';
import { format } from 'date-fns';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const ogImageUrl = getDefaultSocialImage('og', 'home');
  const twitterImageUrl = getDefaultSocialImage('twitter', 'home');
  const fullOgImageUrl = `https://blog.ratnesh-maurya.com${ogImageUrl}`;
  const fullTwitterImageUrl = `https://blog.ratnesh-maurya.com${twitterImageUrl}`;

  return {
    title: "Blog's By Ratnesh - Backend Engineering & System Design",
    description: "A blog about backend engineering, system design, and the silly mistakes we all make along the way. Learn from my experiences with Golang, Elixir, and scalable systems.",
    keywords: ["backend engineering", "system design", "golang", "elixir", "microservices", "database optimization", "coding mistakes", "developer blog"],
    authors: [{ name: "Ratnesh Maurya" }],
    alternates: {
      canonical: "https://blog.ratnesh-maurya.com",
    },
    openGraph: {
      title: "Blog's By Ratnesh - Backend Engineering & System Design",
      description: "A blog about backend engineering, system design, and the silly mistakes we all make along the way. Learn from my experiences with Golang, Elixir, and scalable systems.",
      url: "https://blog.ratnesh-maurya.com",
      siteName: "Blog's By Ratnesh",
      type: "website",
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: "Blog's By Ratnesh - Backend Engineering & System Design",
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog's By Ratnesh - Backend Engineering & System Design",
      description: "A blog about backend engineering, system design, and the silly mistakes we all make along the way.",
      images: [fullTwitterImageUrl],
      creator: '@ratnesh_maurya',
      site: '@ratnesh_maurya',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function Home() {
  const [blogPosts, sillyQuestions] = await Promise.all([
    getAllBlogPosts(),
    getAllSillyQuestions()
  ]);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 6);
  const recentQuestions = sillyQuestions.slice(0, 3);

  return (
    <>
      <WebsiteStructuredData />
      <OrganizationStructuredData />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-24 lg:py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
                Welcome to{' '}
                <span className="gradient-text-primary">
                  Blog&apos;s By Ratnesh
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Exploring backend engineering, system design, and the{' '}
                <span className="text-blue-600 font-semibold">silly mistakes</span>{' '}
                we all make while building scalable systems
              </p>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{blogPosts.length}+</div>
                  <div className="text-gray-600">Blog Posts</div>
                </div>
                <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{sillyQuestions.length}+</div>
                  <div className="text-gray-600">Silly Questions</div>
                </div>
                <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1.5+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link
                  href="/blog"
                  className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Explore Blog Posts
                </Link>
                <Link
                  href="/silly-questions"
                  className="btn btn-secondary btn-lg px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  View Silly Questions
                </Link>
              </div>

              {/* Scroll Indicator */}
              <div className="mt-16 animate-bounce">
                <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Carousel */}
        <FeaturedCarousel posts={featuredPosts} />

        {/* Recent Posts */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Latest <span className="gradient-text-primary">Blog Posts</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Discover insights, tutorials, and experiences from backend engineering and system design
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
              >
                View all posts
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full group">
                  <article className="card card-interactive h-full flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative overflow-hidden rounded-t-xl">
                      <BlogCardImage post={post} className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <time dateTime={post.date}>{format(new Date(post.date), 'MMM dd, yyyy')}</time>
                        <span className="mx-2">•</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-grow line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md hover:bg-gray-200 transition-colors">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-gray-400 text-xs self-center">+{post.tags.length - 3} more</span>
                        )}
                      </div>
                      <div className="flex items-center text-blue-600 font-medium text-sm mt-auto group-hover:text-blue-700 transition-colors">
                        Read article
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Silly Questions Section */}
        <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-amber-600">Silly Questions</span> & Mistakes
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Learn from common mistakes and silly questions that every developer encounters.
                Sometimes the simplest questions lead to the biggest insights!
              </p>
              <Link
                href="/silly-questions"
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold transition-colors group"
              >
                Explore all questions
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentQuestions.map((question, index) => (
                <Link key={question.slug} href={`/silly-questions/${question.slug}`} className="block h-full group">
                  <article className="bg-white rounded-xl p-6 border border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col group-hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-4">
                      <time className="text-sm text-gray-500" dateTime={question.date}>
                        {format(new Date(question.date), 'MMM dd, yyyy')}
                      </time>
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-amber-700 transition-colors flex-grow leading-tight">
                      {question.question}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {question.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {question.tags.length > 2 && (
                        <span className="text-gray-400 text-xs self-center">+{question.tags.length - 2} more</span>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
