import { getAllBlogPosts } from '@/lib/content';
import { BlogListingClient } from '@/components/BlogListingClient';
import { getDefaultSocialImage } from '@/components/BlogImage';
import { BlogListStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const ogImageUrl = getDefaultSocialImage('og', 'blog');
  const twitterImageUrl = getDefaultSocialImage('twitter', 'blog');
  const fullOgImageUrl = `https://blog.ratnesh-maurya.com${ogImageUrl}`;
  const fullTwitterImageUrl = `https://blog.ratnesh-maurya.com${twitterImageUrl}`;

  return {
    title: "All Blog Posts | Blog's By Ratnesh",
    description: "Explore all my thoughts on web development, programming, and technology. Learn from real-world experiences and practical insights.",
    keywords: ["blog posts", "web development", "programming", "javascript", "typescript", "react", "nextjs", "technology"],
    authors: [{ name: "Ratnesh Maurya" }],
    alternates: {
      canonical: "https://blog.ratnesh-maurya.com/blog",
    },
    openGraph: {
      title: "All Blog Posts | Blog's By Ratnesh",
      description: "Explore all my thoughts on web development, programming, and technology. Learn from real-world experiences and practical insights.",
      url: "https://blog.ratnesh-maurya.com/blog",
      siteName: "Blog's By Ratnesh",
      type: "website",
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: "All Blog Posts - Blog's By Ratnesh",
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: "All Blog Posts | Blog's By Ratnesh",
      description: "Explore all my thoughts on web development, programming, and technology.",
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

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Blog', url: 'https://blog.ratnesh-maurya.com/blog' }
  ];

  return (
    <>
      <BlogListStructuredData posts={blogPosts} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <BlogListingClient blogPosts={blogPosts} />
    </>
  );
}
