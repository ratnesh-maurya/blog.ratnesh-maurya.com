/**
 * Single source of truth for where this blog and the portfolio live.
 * Change the domain here and everything derives from it: metadata/canonicals,
 * JSON-LD, sitemap, robots, RSS/Atom feeds, oEmbed, OG images and the scripts.
 *
 * Not env-driven on purpose: nothing in the Vercel project settings controls the
 * site URL. Edit this file to change it.
 */

/** Host this blog is served from. */
export const SITE_HOST = 'blog.ratneshmaurya.com';
/** Origin (no trailing slash) used for every absolute URL the site emits. */
export const SITE_URL = `https://${SITE_HOST}`;

/** The portfolio, and the parent domain of the other projects (tracker., jsonic., ...). */
export const PORTFOLIO_HOST = 'ratneshmaurya.com';
export const PORTFOLIO_URL = `https://${PORTFOLIO_HOST}`;

/**
 * Former hosts of this blog. They 301 to SITE_URL (configured outside this repo,
 * so there is no redirect for them in the app), but links published before the move
 * still point at them: Instagram captions, rows in the Supabase `reels` table, old
 * oEmbed consumers. Code that decides "is this one of our URLs?" must keep accepting
 * them. Never use these to build a URL.
 */
export const LEGACY_SITE_HOSTS: readonly string[] = ['blog.ratnesh-maurya.com'];

/** Every host that means "this blog": current first, then former ones. */
export const ALL_SITE_HOSTS: readonly string[] = [SITE_HOST, ...LEGACY_SITE_HOSTS];

const normalizeHost = (host: string) => host.trim().toLowerCase().replace(/^www\./, '');

/** True for the current host and any former host of this blog (a leading "www." is ignored). */
export function isSiteHost(host: string): boolean {
  return ALL_SITE_HOSTS.includes(normalizeHost(host));
}

/** True when `url` is an absolute URL on this blog (current or former host). */
export function isSiteUrl(url: string): boolean {
  try {
    return isSiteHost(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Rewrites a former-host URL of this blog to the current host. Anything else is returned unchanged. */
export function toCurrentSiteUrl(url: string): string {
  try {
    const u = new URL(url);
    if (!isSiteHost(u.hostname) || u.hostname === SITE_HOST) return url;
    u.protocol = 'https:';
    u.hostname = SITE_HOST;
    return u.toString();
  } catch {
    return url;
  }
}

/** Regex source (dots escaped) matching any host of this blog, for scanning free text such as captions. */
export const ALL_SITE_HOSTS_PATTERN = ALL_SITE_HOSTS.map((h) => h.replace(/\./g, '\\.')).join('|');
