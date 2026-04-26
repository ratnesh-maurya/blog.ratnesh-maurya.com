import { BlogListingClient } from '@/components/BlogListingClient';
import { OgImageInBody } from '@/components/OgImageInBody';
import { BlogListStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { getAllBlogPostsForListing } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImagePath } from '@/lib/og';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = getStoredOgImagePath('blog') || '/og/home.png';
  return {
    title: "Blog — Systems, Backend & AI Engineering",
    description: "Practical posts on backend engineering, system design, distributed systems, and AI engineering—written from real-world building and debugging. Start with the latest →",
    keywords: ["blog posts", "web development", "programming", "javascript", "typescript", "react", "nextjs", "technology"],
    authors: [{ name: "Ratnesh Maurya" }],
    alternates: {
      canonical: "https://blog.ratnesh-maurya.com/blog/",
      types: { ...oembedAlternate('/blog') },
    },
    openGraph: {
      title: "Blog — Ratn Labs",
      description: "Backend engineering, system design, distributed systems, and AI engineering—practical posts you can use.",
      url: "https://blog.ratnesh-maurya.com/blog/",
      siteName: "Ratn Labs",
      type: "website",
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: "All Blog Posts" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "All Blog Posts",
      description: "Explore all my thoughts on web development, programming, and technology.",
      creator: '@ratnesh_maurya',
      site: '@ratnesh_maurya',
      images: [ogImage],
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

export default async function BlogPage() {
  const blogPosts = await getAllBlogPostsForListing();

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Blog', url: 'https://blog.ratnesh-maurya.com/blog' }
  ];

  return (
    <div className="relative overflow-hidden">
      <OgImageInBody src={getStoredOgImagePath('blog')} alt="All Blog Posts" />
      <BlogListStructuredData posts={blogPosts} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <BlogListingClient blogPosts={blogPosts} />
    </div>
  );
}
