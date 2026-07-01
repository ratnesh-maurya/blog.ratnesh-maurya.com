import type { Metadata } from 'next';
import { oembedAlternate } from '@/lib/oembed';

const BASE = 'https://blog.ratnesh-maurya.com';

export interface ArticleMetadataOptions {
  /** Document <title> (template from layout appends site name unless it already includes it) */
  title: string;
  description: string;
  /** Route path with leading slash, e.g. `/news/my-post` */
  path: string;
  /** Absolute or root-relative OG image URL */
  ogImage: string;
  /** Overrides for social cards; default to title/description */
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  /** `article` (default) or `website` */
  type?: 'article' | 'website';
}

/**
 * Shared OG/Twitter/canonical metadata shape used by post-style routes.
 * Routes with richer needs (blog posts with article:* extras) keep their own.
 */
export function createArticleMetadata(opts: ArticleMetadataOptions): Metadata {
  const url = `${BASE}${opts.path.endsWith('/') ? opts.path : opts.path + '/'}`;
  const ogTitle = opts.ogTitle ?? opts.title;
  const ogDescription = opts.ogDescription ?? opts.description;
  return {
    title: opts.title,
    description: opts.description,
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
    alternates: {
      canonical: url,
      types: { ...oembedAlternate(opts.path.replace(/\/$/, '')) },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: opts.type ?? 'article',
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
      ...(opts.modifiedTime ? { modifiedTime: opts.modifiedTime } : {}),
      url,
      siteName: 'Ratn Labs',
      locale: 'en_US',
      images: [{ url: opts.ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      creator: '@ratnesh_maurya',
      site: '@ratnesh_maurya',
      images: [opts.ogImage],
    },
    robots: { index: true, follow: true },
  };
}
