import { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/content';
import { BlogListingClient } from '@/components/BlogListingClient';
import { getDefaultSocialImage } from '@/components/BlogImage';
import { BlogListStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';

interface TagPageProps {
  params: {
    tag: string;
  };
}

const decodeTag = (rawTag: string) => {
  const decoded = decodeURIComponent(rawTag);
  // Convert slug back to display label with title casing
  return decoded
    .replace(/-/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
};

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tagLabel = decodeTag(params.tag);
  const ogImageUrl = getDefaultSocialImage('og', 'blog');
  const twitterImageUrl = getDefaultSocialImage('twitter', 'blog');
  const fullOgImageUrl = `https://blog.ratnesh-maurya.com${ogImageUrl}`;
  const fullTwitterImageUrl = `https://blog.ratnesh-maurya.com${twitterImageUrl}`;
  const title = `Posts tagged "${tagLabel}"`;
  const description = `Browse all blog posts tagged "${tagLabel}" from Ratn Labs.`;
  const canonicalUrl = `https://blog.ratnesh-maurya.com/blog/tag/${params.tag}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Ratn Labs",
      type: 'website',
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: `Posts tagged "${tagLabel}" - Ratn Labs`,
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

export default async function BlogTagPage({ params }: TagPageProps) {
  const blogPosts = await getAllBlogPosts();
  const tagLabel = decodeTag(params.tag);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Blog', url: 'https://blog.ratnesh-maurya.com/blog' },
    { name: `Tag: ${tagLabel}`, url: `https://blog.ratnesh-maurya.com/blog/tag/${params.tag}` },
  ];

  return (
    <div className="relative overflow-hidden">
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
