import { getAllBlogPosts } from '@/lib/content';
import { BlogListingClient } from '@/components/BlogListingClient';
import { BlogListStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
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
    },
    twitter: {
      card: "summary_large_image",
      title: "All Blog Posts",
      description: "Explore all my thoughts on web development, programming, and technology.",
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
    ? `Browse all blog posts tagged "${selectedTag}" from Ratn Labs.`
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

      {/* Subtle marquee watermark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 select-none hidden sm:block" aria-hidden="true">
        <div className="h-20 sm:h-24" style={{ background: 'linear-gradient(to top, var(--accent-50), transparent)' }}>
          <div className="whitespace-nowrap bg-text-marquee h-full flex items-center opacity-[0.07]">
            <span className="gradient-text-primary font-extrabold tracking-[0.5em] uppercase text-4xl sm:text-5xl md:text-6xl">
              Blog&nbsp;·&nbsp;Systems&nbsp;·&nbsp;AI&nbsp;·&nbsp;Backend&nbsp;·&nbsp;Blog&nbsp;·&nbsp;Systems&nbsp;·&nbsp;AI&nbsp;·&nbsp;Backend&nbsp;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
