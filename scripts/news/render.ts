import matter from 'gray-matter';
import { FULL_SECTION_LIMIT } from './config';
import type { Digest, DigestItem } from './digest';
import { hostnameOf, pickImage, publishUrl, type Candidate } from './select';
import { fitText, toISODateInTimezone } from './util';

const KNOWN_OUTLETS: Record<string, string> = {
  'techcrunch.com': 'TechCrunch',
  'theverge.com': 'The Verge',
  'wired.com': 'WIRED',
  'arstechnica.com': 'Ars Technica',
  'venturebeat.com': 'VentureBeat',
  'thenewstack.io': 'The New Stack',
  'infoq.com': 'InfoQ',
  'dev.to': 'DEV Community',
  'github.blog': 'GitHub Blog',
  'zdnet.com': 'ZDNET',
  'engadget.com': 'Engadget',
  'theregister.com': 'The Register',
  'bleepingcomputer.com': 'BleepingComputer',
  'thehackernews.com': 'The Hacker News',
  'krebsonsecurity.com': 'Krebs on Security',
  'simonwillison.net': "Simon Willison's Weblog",
  'pragmaticengineer.com': 'The Pragmatic Engineer',
  'openai.com': 'OpenAI',
  'anthropic.com': 'Anthropic',
  'deepmind.google': 'Google DeepMind',
  'blog.google': 'Google',
  'huggingface.co': 'Hugging Face',
  'go.dev': 'Go Blog',
  'blog.rust-lang.org': 'Rust Blog',
  'blog.cloudflare.com': 'Cloudflare Blog',
};

export function sourceName(url: string): string {
  const host = hostnameOf(url);
  const known = Object.entries(KNOWN_OUTLETS).find(([domain]) => host === domain || host.endsWith(`.${domain}`));
  if (known) return known[1];
  const base = host.split('.').slice(-2, -1)[0] || host;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** Model text goes into the page as markdown, so neutralise anything that would restructure it. */
function clean(text: string): string {
  return text
    .replace(/END_OF_DIGEST/g, '')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/<\/?[a-z][^>]*>/gi, '')
    .trim();
}

/** Headings are parsed into the table of contents without inline markup, so keep them plain. */
function plainHeading(text: string): string {
  return clean(text).replace(/[*_`[\]<>]/g, '').replace(/\s+/g, ' ');
}

function oneLine(text: string): string {
  return clean(text).replace(/\s*\n+\s*/g, ' ');
}

function publishedDate(c: Candidate, timeZone: string): string | null {
  const t = c.published_date ? Date.parse(c.published_date) : NaN;
  return Number.isNaN(t) ? null : toISODateInTimezone(new Date(t), timeZone);
}

function renderFullSection(item: DigestItem, c: Candidate, isTop: boolean, timeZone: string): string {
  const published = publishedDate(c, timeZone);
  const source = sourceName(c.url);
  const meta = [isTop ? 'Top story' : null, item.category, source, published].filter(Boolean).join(' · ');
  const image = pickImage(c);

  const lines: string[] = [`## ${plainHeading(item.headline)}`, '', `*${meta}*`, ''];
  if (image) lines.push(`![${image.alt}](${image.url})`, '');
  lines.push(clean(item.summary), '');
  if (item.caveat) lines.push(`> ⚠️ **Heads up:** ${oneLine(item.caveat)}`, '');
  if (item.keyFacts.length) {
    lines.push('**Key facts**', '', ...item.keyFacts.map((f) => `- ${oneLine(f)}`), '');
  }
  lines.push(`**Why it matters:** ${oneLine(item.whyItMatters)}`, '');
  if (item.takeaway) lines.push(`> ${oneLine(item.takeaway)}`, '');
  lines.push(`[🔗 Read more at ${source}](${publishUrl(c.url)})`);
  return lines.join('\n');
}

export interface RenderedDigest {
  frontmatter: Record<string, unknown>;
  body: string;
  file: string;
}

export function renderDigest(digest: Digest, candidates: Candidate[], date: string, timeZone: string): RenderedDigest {
  // Most important first; newer first on ties (candidates are already newest-first).
  const ordered = [...digest.items].sort((a, b) => b.importance - a.importance || a.index - b.index);

  const full: DigestItem[] = [];
  const quick: DigestItem[] = [];
  ordered.forEach((item, i) => {
    // Always keep the top stories as full sections; low-importance overflow becomes quick hits.
    (i < FULL_SECTION_LIMIT || item.importance >= 3 ? full : quick).push(item);
  });

  const parts: string[] = [clean(digest.intro), ''];

  parts.push('## TL;DR', '');
  for (const item of ordered) {
    parts.push(`- **${oneLine(item.headline)}** — ${oneLine(item.tldr)}`);
  }
  parts.push('');

  full.forEach((item, i) => {
    parts.push('---', '', renderFullSection(item, candidates[item.index], i === 0, timeZone), '');
  });

  if (quick.length) {
    parts.push('---', '', '## Quick hits', '');
    for (const item of quick) {
      const c = candidates[item.index];
      parts.push(`- **[${plainHeading(item.headline)}](${publishUrl(c.url)})** (${sourceName(c.url)}) — ${oneLine(item.tldr)}`);
    }
    parts.push('');
  }

  if (digest.watch.length) {
    parts.push('---', '', '## What to watch', '', ...digest.watch.map((w) => `- ${oneLine(w)}`), '');
  }

  parts.push('---', '', '## Sources', '');
  for (const item of ordered) {
    const c = candidates[item.index];
    const published = publishedDate(c, timeZone);
    parts.push(`- [${plainHeading(item.headline)}](${publishUrl(c.url)}) — ${sourceName(c.url)}${published ? `, ${published}` : ''}`);
  }

  const sources = [...new Set(ordered.map((i) => sourceName(candidates[i.index].url)))];
  const frontmatter = {
    title: fitText(clean(digest.title), 65, 30),
    description: fitText(clean(digest.description), 160, 100),
    date,
    tags: digest.keywords,
    source: 'tavily',
    stories: ordered.length,
    sources,
  };

  const body = parts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  // gray-matter handles quoting/escaping, so titles and tags can contain quotes or colons.
  return { frontmatter, body, file: matter.stringify(`\n${body}\n`, frontmatter) };
}
