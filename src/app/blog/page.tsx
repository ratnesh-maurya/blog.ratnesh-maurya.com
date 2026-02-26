import { BlogListingClient } from '@/components/BlogListingClient';
import { OgImageInBody } from '@/components/OgImageInBody';
import { BlogListStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { getAllBlogPostsForListing } from '@/lib/content';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = '/images/blog/building-blog.jpg';
  return {
    title: "All Blog Posts",
    description: "Explore all my thoughts on web development, programming, and technology. Learn from real-world experiences and practical insights.",
    keywords: ["blog posts", "web development", "programming", "javascript", "typescript", "react", "nextjs", "technology"],
    authors: [{ name: "Ratnesh Maurya" }],
    alternates: {
      canonical: "https://blog.ratnesh-maurya.com/blog",
    },
    openGraph: {
      title: "All Blog Posts",
      description: "Explore all my thoughts on web development, programming, and technology. Learn from real-world experiences and practical insights.",
      url: "https://blog.ratnesh-maurya.com/blog",
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

interface BlogPageProps {
  searchParams?: Promise<{
    tag?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const blogPosts = await getAllBlogPostsForListing();

  const resolvedSearchParams = await searchParams;
  const rawTag = resolvedSearchParams?.tag;
  const selectedTag = rawTag ? decodeURIComponent(rawTag).trim() : null;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Blog', url: 'https://blog.ratnesh-maurya.com/blog' }
  ];

  const baseDescription = "Explore all my thoughts on web development, programming, and technology. Learn from real-world experiences and practical insights.";

  const pageTitle = selectedTag ? `Posts tagged "${selectedTag}"` : "All Blog Posts";
  const pageDescription = selectedTag
    ? `Browse all blog posts tagged "${selectedTag}" from Ratn Labs.`
    : baseDescription;

  return (
    <div className="relative overflow-hidden">
      <OgImageInBody src="/images/blog/building-blog.jpg" alt="All Blog Posts" />
      <BlogListStructuredData posts={blogPosts} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <BlogListingClient
        blogPosts={blogPosts}
        initialTag={selectedTag}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
      />
    </div>
  );
}
