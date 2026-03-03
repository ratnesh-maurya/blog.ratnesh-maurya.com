const BASE = 'https://blog.ratnesh-maurya.com';
const OEMBED_ENDPOINT = `${BASE}/api/oembed`;

/**
 * Returns the `alternates.types` entry for oEmbed discovery.
 * Merge this into your page's `generateMetadata` → `alternates.types` object
 * so crawlers / embedding platforms find the oEmbed endpoint in server-rendered HTML.
 *
 * Usage:
 *   alternates: { types: { ...oembedAlternate('/blog'), ...otherTypes } }
 */
export function oembedAlternate(pathname: string): Record<string, string> {
  const pageUrl = pathname.startsWith('http') ? pathname : `${BASE}${pathname}`;
  return {
    'application/json+oembed': `${OEMBED_ENDPOINT}?url=${encodeURIComponent(pageUrl)}&format=json`,
  };
}
