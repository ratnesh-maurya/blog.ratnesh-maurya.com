import { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/content';
import { BlogListingClient } from '@/components/BlogListingClient';
import { BlogListStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { OgImageInBody } from '@/components/OgImageInBody';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

const decodeTag = (rawTag: string) => {
  const decoded = decodeURIComponent(rawTag);
  return decoded
    .replace(/-/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
};

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const tagLabel = decodeTag(tag);
  const title = `Posts tagged "${tagLabel}"`;
  const description = `Browse all blog posts tagged "${tagLabel}" from Ratn Labs.`;
  const canonicalUrl = `https://blog.ratnesh-maurya.com/blog/tag/${tag}`;
  const ogImage = '/images/blog/building-blog.jpg';

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Ratn Labs",
      type: 'website',
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

export default async function BlogTagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const blogPosts = await getAllBlogPosts();
  const tagLabel = decodeTag(tag);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Blog', url: 'https://blog.ratnesh-maurya.com/blog' },
    { name: `Tag: ${tagLabel}`, url: `https://blog.ratnesh-maurya.com/blog/tag/${tag}` },
  ];

  return (
    <div className="relative overflow-hidden">
      <OgImageInBody src="/images/blog/building-blog.jpg" alt={`Posts tagged "${tagLabel}"`} />
      <BlogListStructuredData posts={blogPosts} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <BlogListingClient
        blogPosts={blogPosts}
        initialTag={tagLabel}
        pageTitle={`Posts tagged "${tagLabel}"`}
        pageDescription={`Articles, deep dives, and write-ups related to "${tagLabel}".`}
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
