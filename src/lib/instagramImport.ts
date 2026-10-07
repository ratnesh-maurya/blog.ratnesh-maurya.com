import { PREVIEW_UA, fetchInstagramCover, isInstagramPostUrl } from '@/lib/reelThumbs';

const FETCH_TIMEOUT_MS = 10_000;
const SITE_HOST = 'blog.ratnesh-maurya.com';
const SECTION_SUFFIXES = new Set(['Technical Terms', 'Daily News', 'News', 'TIL', 'Silly Questions', 'Cheatsheets', 'Blog']);
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export type ReelDraft = {
  slug: string;
  title: string;
  description: string;
  reel_url: string;
  /** Instagram's current cover link — preview only; saving stores a permanent copy. */
  thumb_url: string | null;
  posted_at: string;
  links: Array<{ label: string; url: string }>;
};

/** https://www.instagram.com/p/CODE/ — drops tracking params like ?img_index=1 and the username path form. */
export function canonicalInstagramUrl(url: string): string {
  const m = url.trim().match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels)\/([\w-]+)/i);
  if (!m) throw new Error('Paste an Instagram post or reel link (instagram.com/p/… or /reel/…)');
  return `https://www.instagram.com/${m[1].toLowerCase() === 'p' ? 'p' : 'reel'}/${m[2]}/`;
}

function metaContent(html: string, key: string): string | null {
  for (const tag of html.match(/<meta\s[^>]*>/gi) ?? []) {
    const name = tag.match(/(?:property|name)="([^"]+)"/i)?.[1];
    if (name !== key) continue;
    const content = tag.match(/content="([^"]*)"/i)?.[1];
    if (content !== undefined) return decodeEntities(content);
  }
  return null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** Caption, post date (YYYY-MM-DD) and cover image from the preview tags Instagram serves to link crawlers. */
export function parseInstagramMeta(html: string): { caption: string; date: string | null; image: string | null } {
  const description = metaContent(html, 'og:description') ?? '';
  const title = metaContent(html, 'og:title') ?? '';

  let caption = '';
  let date: string | null = null;
  const fromDesc = description.match(/ on ([A-Z][a-z]+) (\d{1,2}), (\d{4}): "([\s\S]*)"\.?\s*$/);
  if (fromDesc) {
    const month = MONTHS.indexOf(fromDesc[1].toLowerCase()) + 1;
    if (month > 0) date = `${fromDesc[3]}-${String(month).padStart(2, '0')}-${fromDesc[2].padStart(2, '0')}`;
    caption = fromDesc[4];
  } else {
    caption = title.match(/: "([\s\S]*)"\s*$/)?.[1] ?? '';
  }
  return { caption: caption.trim(), date, image: metaContent(html, 'og:image') };
}

const TRAILING_PUNCT = /[.,;:!?)\]]+$/;

/** URLs written in a caption, with or without https://, limited to hosts worth linking. */
export function extractLinks(caption: string): string[] {
  const found: string[] = [];
  const re = /https?:\/\/[^\s"'<>]+|\b(?:blog\.ratnesh-maurya\.com|ratnesh-maurya\.com|github\.com)\/[^\s"'<>]*/gi;
  for (const m of caption.matchAll(re)) {
    let url = m[0].replace(TRAILING_PUNCT, '');
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    try {
      const host = new URL(url).hostname.replace(/^www\./, '');
      if (host.endsWith('instagram.com')) continue;
      found.push(url);
    } catch {
      // not a URL
    }
  }
  const seen = new Set<string>();
  return found.filter((u) => {
    const key = u.toLowerCase().replace(/\/$/, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function labelFor(url: string): string {
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, '');
  if (host === SITE_HOST) {
    const section = u.pathname.split('/').filter(Boolean)[0];
    return (
      ({ blog: 'Blog post', 'technical-terms': 'Technical term', news: 'Daily news digest', til: 'Today I learned', cheatsheets: 'Cheatsheet', 'silly-questions': 'Silly question' } as Record<string, string>)[section] ??
      'Blog'
    );
  }
  if (host === 'github.com') return 'GitHub repo';
  return host;
}

const MAX_SLUG = 50;

export function slugify(text: string): string {
  const full = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (full.length <= MAX_SLUG) return full;
  // Cut at a word boundary rather than mid-word.
  const head = full.slice(0, MAX_SLUG + 1);
  const cut = head.lastIndexOf('-');
  return (cut > 20 ? head.slice(0, cut) : full.slice(0, MAX_SLUG)).replace(/-+$/, '');
}

/** "Bloom Filter | Technical Terms | Ratn Labs" → "Bloom Filter". */
export function cleanPageTitle(raw: string): string {
  const parts = raw.split(' | ').map((p) => p.trim());
  if (parts.at(-1) === 'Ratn Labs') parts.pop();
  if (parts.length > 1 && SECTION_SUFFIXES.has(parts.at(-1) ?? '')) parts.pop();
  return parts.join(' | ');
}

/** Title and description of one of our own pages. Only our domain is ever fetched. */
async function fetchPageMeta(url: string): Promise<{ title: string | null; description: string | null }> {
  try {
    if (new URL(url).hostname !== SITE_HOST) return { title: null, description: null };
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), headers: { 'user-agent': 'Mozilla/5.0 (reel-import)' } });
    if (!res.ok) return { title: null, description: null };
    const html = await res.text();
    const rawTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
    return { title: rawTitle ? cleanPageTitle(decodeEntities(rawTitle)) : null, description: metaContent(html, 'description') };
  } catch {
    return { title: null, description: null };
  }
}

/** Caption paragraphs that are prose — not the hook line, link lines, or hashtags. */
function proseParagraphs(caption: string): string[] {
  return caption
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !/^#/.test(p) && !/https?:\/\/|blog\.ratnesh-maurya\.com|link in bio/i.test(p));
}

export async function importInstagramPost(rawUrl: string): Promise<ReelDraft & { notes: string[] }> {
  const reelUrl = canonicalInstagramUrl(rawUrl);
  if (!isInstagramPostUrl(reelUrl)) throw new Error('Not an Instagram post URL');

  const res = await fetch(reelUrl, { headers: { 'user-agent': PREVIEW_UA }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Instagram returned HTTP ${res.status} for that link`);
  const meta = parseInstagramMeta(await res.text());
  if (!meta.caption) throw new Error('Could not read a caption from that post (private, deleted, or Instagram blocked the request)');

  const notes: string[] = [];
  const linkUrls = extractLinks(meta.caption);
  const links = linkUrls.map((url) => ({ label: labelFor(url), url }));
  const siteLink = linkUrls.find((u) => new URL(u).hostname === SITE_HOST);
  const page = siteLink ? await fetchPageMeta(siteLink) : { title: null, description: null };

  const lines = meta.caption.split('\n').map((l) => l.trim()).filter(Boolean);
  const hook = lines[0] ?? '';
  const prose = proseParagraphs(meta.caption);
  const title = (page.title ?? cleanPageTitle(hook)).slice(0, 120).trim();
  // The hook is the first paragraph, so the first *body* paragraph is the second. Never reuse the title as the description.
  const body = (prose[1] ?? page.description ?? '').replace(/\s*\n\s*/g, ' ').trim();
  const description = body.toLowerCase() === title.toLowerCase() ? '' : body.slice(0, 300);

  if (!siteLink) notes.push('No blog link found in the caption — add the related links by hand.');
  else if (!page.title) notes.push('Could not read the blog page title — used the first line of the caption.');
  if (!meta.date) notes.push('Could not read the post date — set it by hand.');

  const slugSource = siteLink ? new URL(siteLink).pathname.split('/').filter(Boolean).at(-1) ?? title : title;
  return {
    slug: slugify(slugSource) || slugify(title) || 'reel',
    title,
    description,
    reel_url: reelUrl,
    // Preview only (the server stores its own copy on save); prefer the uncropped first slide.
    thumb_url: (await fetchInstagramCover(reelUrl).catch(() => null)) ?? meta.image,
    posted_at: meta.date ?? new Date().toISOString().slice(0, 10),
    links,
    notes,
  };
}
