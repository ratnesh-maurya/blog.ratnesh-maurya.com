export interface OgOptions {
  title: string;
  subtitle: string;
  breadcrumb?: string;
  accent?: string;
}

const BASE = 'https://blog.ratnesh-maurya.com';

/** OPENGRAPH-SETUP §3 — default OG image path (resolved with metadataBase) */
export const defaultOgImageUrl = `${BASE}/og/home.png`;

/**
 * Slugify tag for OG path (must match scripts/build-og-all.tsx).
 */
export function slugifyTagForOg(tag: string): string {
  const decoded = decodeURIComponent(tag);
  return decoded
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'tag';
}

/**
 * Path (relative to origin) for the stored OG image for a page.
 * All OG images are pre-built to public/og/ and served at /og/...
 */
export function getStoredOgImagePath(
  route: 'home' | 'blog' | 'blog-slug' | 'blog-tag' | 'silly-questions' | 'silly-question' | 'technical-terms' | 'technical-term' | 'til' | 'til-slug' | 'cheatsheets' | 'cheatsheet' | 'about' | 'now' | 'uses' | 'topics' | 'search' | 'newsletter' | 'privacy-policy' | 'resources' | 'series' | 'glossary',
  slug?: string,
  tag?: string
): string {
  switch (route) {
    case 'home':
      return '/og/home.png';
    case 'blog':
      return '/og/blog.png';
    case 'blog-slug':
      return `/og/blog/${slug}.png`;
    case 'blog-tag':
      return `/og/blog/tag/${tag ? slugifyTagForOg(tag) : 'tag'}.png`;
    case 'silly-questions':
      return '/og/silly-questions.png';
    case 'silly-question':
      return `/og/silly-questions/${slug}.png`;
    case 'technical-terms':
      return '/og/technical-terms.png';
    case 'technical-term':
      return `/og/technical-terms/${slug}.png`;
    case 'til':
      return '/og/til.png';
    case 'til-slug':
      return `/og/til/${slug}.png`;
    case 'cheatsheets':
      return '/og/cheatsheets.png';
    case 'cheatsheet':
      return `/og/cheatsheets/${slug}.png`;
    case 'about':
      return '/og/about.png';
    case 'now':
      return '/og/now.png';
    case 'uses':
      return '/og/uses.png';
    case 'topics':
      return '/og/topics.png';
    case 'search':
      return '/og/search.png';
    case 'newsletter':
      return '/og/newsletter.png';
    case 'privacy-policy':
      return '/og/privacy-policy.png';
    case 'resources':
      return '/og/resources.png';
    case 'series':
      return '/og/series.png';
    case 'glossary':
      return '/og/glossary.png';
    default:
      return '/og/home.png';
  }
}

/** Full URL for stored OG image */
export function getStoredOgImageUrl(
  route: Parameters<typeof getStoredOgImagePath>[0],
  slug?: string,
  tag?: string
): string {
  return BASE + getStoredOgImagePath(route, slug, tag);
}
