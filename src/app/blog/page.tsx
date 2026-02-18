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
    title: "All Blog Posts",
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

interface BlogPageProps {
  searchParams?: Promise<{
    tag?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const blogPosts = await getAllBlogPosts();

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
    ? `Browse all blog posts tagged "${selectedTag}" from Blog's By Ratnesh.`
    : baseDescription;

  return (
    <div className="relative overflow-hidden">
      <BlogListStructuredData posts={blogPosts} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <BlogListingClient
        blogPosts={blogPosts}
        initialTag={selectedTag}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
      />

      {/* Moving bottom background text: blog blog blog ... */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 select-none hidden sm:block">
        <div className="h-20 sm:h-24 md:h-28 bg-gradient-to-t from-primary-50/70 to-transparent">
          <div className="whitespace-nowrap bg-text-marquee h-full flex items-center opacity-20">
            <span className="gradient-text-primary font-extrabold tracking-[0.4em] uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Blog&nbsp;Blog&nbsp;Blog&nbsp;Blog&nbsp;Blog&nbsp;Blog&nbsp;Blog&nbsp;Blog&nbsp;Blog&nbsp;Blog&nbsp;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
