import fs from 'fs';
import path from 'path';
import { MAX_PER_DOMAIN, MAX_STORIES } from './config';

export interface TavilyResult {
  title: string;
  url: string;
  content?: string;
  raw_content?: string | null;
  published_date?: string;
  score?: number;
  images?: unknown[];
}

export interface Candidate extends TavilyResult {
  /** Topic ids whose query returned this article. */
  topics: string[];
}

const TRACKING_PARAM = /^(utm_|fbclid$|gclid$|ref$|ref_src$|source$|mc_|igshid$)/i;

/** Canonical form used to compare article URLs across runs. */
export function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw.trim());
    u.hash = '';
    u.protocol = 'https:';
    u.hostname = u.hostname.toLowerCase().replace(/^www\./, '');
    for (const key of [...u.searchParams.keys()]) {
      if (TRACKING_PARAM.test(key)) u.searchParams.delete(key);
    }
    u.searchParams.sort();
    const pathname = u.pathname.replace(/\/+$/, '') || '/';
    return `${u.hostname}${pathname}${u.search}`;
  } catch {
    return raw.trim().toLowerCase();
  }
}

/** Link target for publishing: tracking params removed, parentheses escaped so markdown links can't break. */
export function publishUrl(raw: string): string {
  try {
    const u = new URL(raw.trim());
    for (const key of [...u.searchParams.keys()]) {
      if (TRACKING_PARAM.test(key)) u.searchParams.delete(key);
    }
    return u.toString().replace(/\(/g, '%28').replace(/\)/g, '%29');
  } catch {
    return raw.trim();
  }
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Every non-image link in previously published digests = already covered. */
export function loadCoveredUrls(newsDir: string): Set<string> {
  const covered = new Set<string>();
  if (!fs.existsSync(newsDir)) return covered;
  const link = /(?<!!)\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;
  for (const file of fs.readdirSync(newsDir)) {
    if (!file.endsWith('.md')) continue;
    const text = fs.readFileSync(path.join(newsDir, file), 'utf8');
    for (const m of text.matchAll(link)) covered.add(normalizeUrl(m[1]));
  }
  return covered;
}

/** Dates (YYYY-MM-DD) that already have a digest, read from frontmatter. */
export function existingDigestDates(newsDir: string): Set<string> {
  const dates = new Set<string>();
  if (!fs.existsSync(newsDir)) return dates;
  for (const file of fs.readdirSync(newsDir)) {
    if (!file.endsWith('.md')) continue;
    const head = fs.readFileSync(path.join(newsDir, file), 'utf8').slice(0, 1200);
    const m = head.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m);
    if (m) dates.add(m[1]);
  }
  return dates;
}

function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / (a.size + b.size - shared);
}

function publishedMs(c: TavilyResult): number {
  const t = c.published_date ? Date.parse(c.published_date) : NaN;
  return Number.isNaN(t) ? 0 : t;
}

function bodyLength(c: TavilyResult): number {
  return (c.raw_content || c.content || '').trim().length;
}

export interface SelectOptions {
  covered: Set<string>;
  /** Drop articles older than this many days (articles with no date are kept). */
  days: number;
  now?: number;
}

/**
 * Merges per-topic Tavily results into one ranked, de-duplicated list:
 * unseen URLs only, recent, enough text to summarise, no near-duplicate titles,
 * and a cap per domain.
 */
export function selectCandidates(
  perTopic: Array<{ topic: string; results: TavilyResult[] }>,
  { covered, days, now = Date.now() }: SelectOptions,
): Candidate[] {
  const byUrl = new Map<string, Candidate>();
  for (const { topic, results } of perTopic) {
    for (const r of results) {
      if (!r?.url || !r.title) continue;
      const key = normalizeUrl(r.url);
      if (covered.has(key)) continue;
      const existing = byUrl.get(key);
      if (existing) {
        if (!existing.topics.includes(topic)) existing.topics.push(topic);
        if ((r.score ?? 0) > (existing.score ?? 0)) existing.score = r.score;
        continue;
      }
      byUrl.set(key, { ...r, topics: [topic] });
    }
  }

  const cutoff = now - (days + 1) * 86_400_000;
  const ranked = [...byUrl.values()]
    .filter((c) => bodyLength(c) >= 200)
    .filter((c) => publishedMs(c) === 0 || publishedMs(c) >= cutoff)
    // A story surfaced by several topic queries is a stronger signal than a single hit.
    .sort(
      (a, b) =>
        (b.score ?? 0) + (b.topics.length - 1) * 0.1 - ((a.score ?? 0) + (a.topics.length - 1) * 0.1) ||
        publishedMs(b) - publishedMs(a),
    );

  const picked: Candidate[] = [];
  const perDomain = new Map<string, number>();
  for (const c of ranked) {
    if (picked.length >= MAX_STORIES) break;
    const host = hostnameOf(c.url);
    if ((perDomain.get(host) ?? 0) >= MAX_PER_DOMAIN) continue;
    const tokens = titleTokens(c.title);
    if (picked.some((p) => jaccard(tokens, titleTokens(p.title)) >= 0.7)) continue;
    picked.push(c);
    perDomain.set(host, (perDomain.get(host) ?? 0) + 1);
  }
  // Present newest first; the model decides importance separately.
  return picked.sort((a, b) => publishedMs(b) - publishedMs(a));
}

const BAD_IMAGE = /(logo|avatar|icon|sprite|favicon|badge|pixel|tracking|spacer|placeholder|gravatar|\.svg(\?|$)|\.gif(\?|$))/i;

/** First usable https image for an article, skipping logos, icons and tracking pixels. */
export function pickImage(c: TavilyResult): { url: string; alt: string } | null {
  for (const img of c.images ?? []) {
    const url = typeof img === 'string' ? img : (img as { url?: string })?.url;
    if (!url || !/^https:\/\//i.test(url) || BAD_IMAGE.test(url)) continue;
    const description = typeof img === 'object' && img ? (img as { description?: string }).description : undefined;
    return { url, alt: (description || c.title).replace(/[\[\]]/g, ' ').replace(/\s+/g, ' ').trim() };
  }
  return null;
}
