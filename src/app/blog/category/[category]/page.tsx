import { Suspense } from 'react';
import { BlogListingFallback } from '@/components/BlogListingFallback';
import { BlogListingClient } from '@/components/BlogListingClient';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BlogListStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { getAllBlogPostsForListing } from '@/lib/content';
import { getStoredOgImageUrl } from '@/lib/og';
import { SITE_URL } from '@/lib/site';
import { getCategories, slugifyTerm } from '@/lib/taxonomy';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Prerender every category at build; unknown categories 404 instead of rendering on demand.
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllBlogPostsForListing();
  return getCategories(posts).map((c) => ({ category: c.slug }));
}

async function loadCategory(rawSlug: string) {
  const slug = slugifyTerm(decodeURIComponent(rawSlug));
  const posts = await getAllBlogPostsForListing();
  const summary = getCategories(posts).find((c) => c.slug === slug);
  if (!summary) return null;
  return { summary, posts: posts.filter((p) => slugifyTerm(p.category ?? '') === slug) };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const found = await loadCategory(category);
  if (!found) return { title: 'Category not found' };
  const { label, slug, count } = found.summary;
  const title = `${label} articles`;
  const description = `${count} ${count === 1 ? 'article' : 'articles'} about ${label} from Ratn Labs: backend engineering, systems and AI notes.`;
  const canonicalUrl = `${SITE_URL}/blog/category/${encodeURIComponent(slug)}/`;
  const ogImage = getStoredOgImageUrl('blog');
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Ratn Labs',
      type: 'website',
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    robots: { index: true, follow: true },
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const found = await loadCategory(category);
  if (!found) notFound();
  const { label, slug } = found.summary;
  const url = `${SITE_URL}/blog/category/${encodeURIComponent(slug)}`;

  return (
    <div>
      <BlogListStructuredData
        posts={found.posts}
        name={`${label} articles — Ratn Labs`}
        description={`Articles filed under ${label} on Ratn Labs.`}
        path={`/blog/category/${encodeURIComponent(slug)}`}
      />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: label, url },
        ]}
      />
      <div className="wrap pt-8">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: label, href: `/blog/category/${encodeURIComponent(slug)}/` },
          ]}
        />
      </div>
      <Suspense fallback={<BlogListingFallback posts={found.posts} title={`${label} articles`} />}>
        <BlogListingClient
        blogPosts={found.posts}
        initialTag={label}
        pageTitle={`${label} articles`}
        pageDescription={`Articles and deep dives filed under ${label}.`}
        />
      </Suspense>
    </div>
  );
}
