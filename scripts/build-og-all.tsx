/**
 * Generate OG images into public/og/. The images are COMMITTED to git, so a normal
 * build renders only the ones that are missing (e.g. a brand-new news digest) and
 * usually nothing at all. Uses @vercel/og; no Next server. Runs in postbuild.
 *
 *   npm run og:regen     re-render every image (after a template change), then commit public/og
 *   npx tsx scripts/build-og-all.tsx     render only missing images (what the build does)
 *
 * Design: the light "OG Images" card from Claude Design (grid + generative pattern or ghost
 * glyph, accent bar, chip / title / subtitle-or-tags, author footer). The card itself lives in
 * ./og-card.tsx; this file only maps each page type onto it.
 *
 * After changing the visual template, run `npm run og:regen` and commit public/og.
 */
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import React from 'react';
import { fileURLToPath } from 'url';
import {
  getBlogPostListingMeta,
  getBlogPostSlugs,
  getNewsPostListingMeta,
  getNewsPostSlugs,
  getSillyQuestion,
  getSillyQuestionSlugs,
  getTechnicalTermListingMeta,
  getTechnicalTermSlugs,
  getTILEntry,
  getTILSlugs
} from '../src/lib/content';
import { getCheatsheet, getCheatsheetSlugs } from '../src/lib/static-content';
import { buildCard, loadOgFonts, type PatternKind } from './og-card';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
// Written straight into public/og (committed). Existing files are skipped unless --force.
const outDir = path.join(rootDir, 'public', 'og');
const FORCE_ALL = process.argv.includes('--force') || process.env.OG_FORCE === '1';

/** Losslessly recompress a PNG (about a third of satori's output) so the committed files stay small. */
async function compressPng(buf: Buffer): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  return sharp(buf).png({ compressionLevel: 9, effort: 10 }).toBuffer();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sanitize(text: string, maxLen?: number): string {
  const t = String(text).replace(/^["']|["']$/g, '').trim();
  if (!maxLen || t.length <= maxLen) return t;
  return t.slice(0, maxLen - 1).trim() + '…';
}

function slugifyTag(tag: string): string {
  const decoded = decodeURIComponent(tag);
  return decoded.trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '') || 'tag';
}

// UTC so the same file renders the same text on any machine (dates are YYYY-MM-DD).
function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function dayOfMonth(iso?: string): string {
  const d = iso ? new Date(iso) : null;
  return d && !isNaN(d.getTime()) ? String(d.getUTCDate()) : '';
}

const firstChar = (s: string) => ([...s.trim()][0] ?? '').toUpperCase();

// ─── Section pages ────────────────────────────────────────────────────────────
type SectionPage = {
  path: string;
  title: string;
  subtitle: string;
  countKey?: 'blog' | 'news' | 'terms' | 'til' | 'cheatsheets' | 'silly';
};

const SECTION_PAGES: SectionPage[] = [
  { path: 'blog',            title: 'Blog',                       subtitle: 'Backend engineering, system design, distributed systems, and AI engineering — practical posts you can use.', countKey: 'blog' },
  { path: 'news',            title: 'Daily News',                 subtitle: 'Curated daily digests for builders who ship.',                                                              countKey: 'news' },
  { path: 'silly-questions', title: 'Silly Questions & Mistakes', subtitle: 'Silly mistakes while coding, with the lessons learned — so you can debug faster.',                          countKey: 'silly' },
  { path: 'technical-terms', title: 'Technical Terms',            subtitle: 'Definitions for indexing, clustering, CAP, ACID, replication, and other backend and system design terms.',  countKey: 'terms' },
  { path: 'til',             title: 'Today I Learned',            subtitle: 'Short, practical learnings from real engineering work.',                                                    countKey: 'til' },
  { path: 'cheatsheets',     title: 'Cheatsheets',                subtitle: 'Quick reference for Go, Docker, PostgreSQL, and Kubernetes.',                                               countKey: 'cheatsheets' },
  { path: 'about',           title: 'About Ratnesh',              subtitle: 'Software Engineer at Initializ. Writing about systems, backend architecture, and AI engineering.' },
  { path: 'topics',          title: 'Topics',                     subtitle: 'Browse every post by subject.' },
  { path: 'search',          title: 'Search',                     subtitle: 'Search posts, questions, terms, and news.' },
  { path: 'newsletter',      title: 'Newsletter',                 subtitle: 'New posts, cheatsheets, and technical terms — delivered occasionally.' },
  { path: 'privacy-policy',  title: 'Privacy Policy',             subtitle: 'What is collected, and what is not.' },
  { path: 'resources',       title: 'Resources',                  subtitle: 'Books, tools and talks worth your time.' },
  { path: 'series',          title: 'Series',                     subtitle: 'Multi-part deep dives, in order.' },
  { path: 'glossary',        title: 'Glossary',                   subtitle: 'Backend and system design terms.',                                                                          countKey: 'terms' },
  { path: 'contact',         title: 'Contact',                    subtitle: 'Get in touch with Ratnesh Maurya.' },
  { path: 'analytics',       title: 'Analytics',                  subtitle: 'Open stats for this blog.' },
];

// The design hands out patterns by position in its sitemap (home is always dots). Keep that order
// so a page keeps its pattern; pages the design does not list continue the cycle.
const PATTERN_KINDS: PatternKind[] = ['network', 'rings', 'flow', 'bars', 'dots'];
const DESIGN_ORDER = [
  'home', 'blog', 'technical-terms', 'cheatsheets', 'til', 'silly-questions', 'news', 'topics', 'series',
  'resources', 'about', 'bookmarks', 'newsletter', 'contact', 'editorial-policy', 'corrections', 'analytics',
  'privacy-policy', 'search', 'glossary',
];
const patternFor = (page: string): PatternKind =>
  page === 'home' ? 'dots' : PATTERN_KINDS[Math.max(0, DESIGN_ORDER.indexOf(page)) % PATTERN_KINDS.length];

// Short mono glyph for each cheatsheet's ghost; anything else falls back to the slug's first letters.
const SHEET_GHOST: Record<string, string> = { docker: '$_', go: 'go', kubectl: 'k8s', postgres: 'pg' };

// Section pages removed from generation (routes redirect; images unused)
const STALE_SECTION_FILES = ['now.png', 'uses.png'];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const isWorker = process.env.OG_WORKER === '1';
  const shards = Number(process.env.OG_SHARDS || 1);
  const shard = Number(process.env.OG_SHARD || 0);
  const force = isWorker ? process.env.OG_FORCE === '1' : FORCE_ALL;
  const startedAt = Date.now();

  if (!isWorker && force) {
    console.log('Re-rendering every OG image (--force)');
    // Rendering is CPU-bound, so a cold run is split across all cores (the build machine has 2).
    const n = Number(process.env.OG_WORKERS) || Math.min(os.availableParallelism(), 4);
    if (n > 1) {
      console.log(`Rendering on ${n} workers…`);
      const codes = await Promise.all(
        Array.from({ length: n }, (_, i) =>
          new Promise<number>((resolve) => {
            const child = spawn(process.execPath, [...process.execArgv, process.argv[1]], {
              stdio: 'inherit',
              env: { ...process.env, OG_WORKER: '1', OG_FORCE: '1', OG_SHARDS: String(n), OG_SHARD: String(i) },
            });
            child.on('exit', (code) => resolve(code ?? 1));
            child.on('error', () => resolve(1));
          }),
        ),
      );
      if (codes.some((c) => c !== 0)) throw new Error(`OG worker failed (exit codes: ${codes.join(', ')})`);
      console.log(`\nOG images re-rendered on ${n} workers in ${((Date.now() - startedAt) / 1000).toFixed(0)}s. Commit public/og.`);
      return;
    }
  }

  /** Each image belongs to exactly one worker, chosen from its path so all workers agree. */
  const ownedByThisWorker = (relPath: string) => {
    if (!isWorker) return true;
    let h = 0;
    for (const ch of relPath) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h % shards === shard;
  };

  const { ImageResponse } = await import('@vercel/og');
  const fonts = loadOgFonts();
  let total = 0;
  let failed = 0;

  async function write(relPath: string, element: React.ReactElement) {
    if (!ownedByThisWorker(relPath)) return;
    const outPath = path.join(outDir, relPath);
    if (!force && fs.existsSync(outPath)) { process.stdout.write('-'); return; }
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    try {
      const res = new ImageResponse(element, { width: 1200, height: 630, fonts });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, await compressPng(Buffer.from(buf)));
      total++;
      process.stdout.write('.');
    } catch (e) {
      failed++;
      console.error(`\n${relPath}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Content slugs (also power live counts on section cards)
  const blogSlugs = getBlogPostSlugs();
  const newsSlugs = getNewsPostSlugs();
  const termSlugs = getTechnicalTermSlugs();
  const tilSlugs = getTILSlugs();
  const csSlugs = getCheatsheetSlugs();
  const sqSlugs = getSillyQuestionSlugs();

  const counts: Record<NonNullable<SectionPage['countKey']>, string> = {
    blog: `${blogSlugs.length} posts`,
    news: `${newsSlugs.length} digests`,
    terms: `${termSlugs.length} terms`,
    til: `${tilSlugs.length} entries`,
    cheatsheets: `${csSlugs.length} cheatsheets`,
    silly: `${sqSlugs.length} questions`,
  };

  // Home
  await write('home.png', buildCard({
    id: 'home',
    type: 'home',
    path: '/',
    chip: 'Systems · Backend · AI Engineering',
    title: 'Practical engineering for real-world systems',
    subtitle: 'Deep dives on backend, distributed systems, and AI engineering.',
    meta: `${counts.blog} · ${counts.terms} · ${counts.news}`,
    pattern: patternFor('home'),
  }));

  // Section pages
  for (const section of SECTION_PAGES) {
    await write(section.path + '.png', buildCard({
      id: section.path,
      type: 'section',
      path: `/${section.path}/`,
      chip: 'Section',
      title: section.title,
      subtitle: section.subtitle,
      meta: section.countKey ? counts[section.countKey] : undefined,
      pattern: patternFor(section.path),
    }));
  }

  // Remove stale section images for redirected routes
  for (const file of STALE_SECTION_FILES) {
    const p = path.join(outDir, file);
    if (fs.existsSync(p)) { fs.unlinkSync(p); console.log(`\nremoved stale ${file}`); }
  }

  // Blog posts
  const tagPosts = new Map<string, { label: string; posts: Set<string> }>();
  for (const slug of blogSlugs) {
    const post = await getBlogPostListingMeta(slug);
    if (!post) continue;
    await write(path.join('blog', slug + '.png'), buildCard({
      id: `blog/${slug}`,
      type: 'post',
      path: `/blog/${slug}/`,
      chip: post.category || 'Blog',
      title: sanitize(post.title),
      subtitle: sanitize(post.description || '') || undefined,
      meta: [formatDate(post.date), post.readingTime].filter(Boolean).join(' · '),
    }));
    for (const label of [...(post.tags ?? []), post.category]) {
      if (!label || !label.trim()) continue;
      const tagSlug = slugifyTag(label.trim());
      const entry = tagPosts.get(tagSlug) ?? { label: label.trim(), posts: new Set<string>() };
      entry.posts.add(slug);
      tagPosts.set(tagSlug, entry);
    }
  }

  // News posts
  for (const slug of newsSlugs) {
    const post = await getNewsPostListingMeta(slug);
    if (!post) continue;
    await write(path.join('news', slug + '.png'), buildCard({
      id: `news/${slug}`,
      type: 'news',
      path: `/news/${slug}/`,
      chip: 'Daily Digest',
      title: sanitize(post.title),
      subtitle: 'Curated daily digest for builders who ship.',
      meta: formatDate(post.date),
      ghost: dayOfMonth(post.date),
    }));
  }

  // Blog tags
  for (const [slug, { label, posts }] of tagPosts) {
    const tagLabel = label.replace(/\b\w/g, c => c.toUpperCase());
    await write(path.join('blog', 'tag', slug + '.png'), buildCard({
      id: `blog/tag/${slug}`,
      type: 'post',
      path: `/blog/tag/${slug}/`,
      chip: 'Topic',
      title: tagLabel,
      subtitle: `Blog posts about ${tagLabel} from Ratn Labs.`,
      meta: `${posts.size} ${posts.size === 1 ? 'post' : 'posts'}`,
      ghost: '#',
    }));
  }

  // Silly questions
  for (const slug of sqSlugs) {
    const q = await getSillyQuestion(slug);
    if (!q) continue;
    await write(path.join('silly-questions', slug + '.png'), buildCard({
      id: `silly-questions/${slug}`,
      type: 'question',
      path: `/silly-questions/${slug}/`,
      chip: 'Silly Question',
      title: sanitize(q.question),
      meta: 'Mistake · Fix · Lesson',
      ghost: '?',
    }));
  }

  // Technical terms
  for (const slug of termSlugs) {
    const term = await getTechnicalTermListingMeta(slug);
    if (!term) continue;
    await write(path.join('technical-terms', slug + '.png'), buildCard({
      id: `technical-terms/${slug}`,
      type: 'term',
      path: `/technical-terms/${slug}/`,
      chip: 'Technical Term',
      title: sanitize(term.title),
      subtitle: sanitize(term.description || '') || undefined,
      meta: 'Definition · Use cases · Trade-offs',
      ghost: firstChar(term.title),
    }));
  }

  // TIL
  for (const slug of tilSlugs) {
    const entry = await getTILEntry(slug);
    if (!entry) continue;
    await write(path.join('til', slug + '.png'), buildCard({
      id: `til/${slug}`,
      type: 'til',
      path: `/til/${slug}/`,
      chip: entry.category ? `TIL · ${entry.category}` : 'TIL',
      title: sanitize(entry.title),
      tags: (entry.tags ?? []).slice(0, 3),
      meta: formatDate(entry.date),
      ghost: 'TIL',
    }));
  }

  // Cheatsheets
  for (const slug of csSlugs) {
    const data = getCheatsheet(slug);
    if (!data) continue;
    // "Go Cheatsheet — Syntax, Concurrency & CLI" → "Go"
    const name = data.title.split(/\s+[—–-]\s+/)[0].replace(/\s+cheat\s?sheet$/i, '').trim();
    await write(path.join('cheatsheets', slug + '.png'), buildCard({
      id: `cheatsheets/${slug}`,
      type: 'sheet',
      path: `/cheatsheets/${slug}/`,
      chip: 'Cheatsheet',
      title: sanitize(name),
      subtitle: sanitize(data.subtitle || data.description || '') || undefined,
      tags: (data.keywords ?? []).filter(k => k.toLowerCase() !== name.toLowerCase()).slice(0, 3),
      meta: 'Quick reference',
      ghost: SHEET_GHOST[slug] ?? slug.slice(0, 2),
    }));
  }

  if (isWorker) {
    console.log(`\n[worker ${shard + 1}/${shards}] rendered ${total} images in ${((Date.now() - startedAt) / 1000).toFixed(0)}s${failed ? ` (${failed} FAILED)` : ''}`);
    return;
  }
  console.log(`\nOG images: ${total} rendered in ${((Date.now() - startedAt) / 1000).toFixed(0)}s (- = already in public/og)${failed ? ` — ${failed} FAILED` : ''}`);
}

main().catch(e => {
  console.error('build-og-all failed:', e);
  process.exit(1);
});
