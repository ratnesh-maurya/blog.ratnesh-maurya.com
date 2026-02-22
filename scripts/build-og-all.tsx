/**
 * Generate all OG images at build time into public/og/.
 * Uses @vercel/og; no Next server. Run in postbuild.
 */
import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import {
  getBlogPostSlugs,
  getBlogPostListingMeta,
  getSillyQuestionSlugs,
  getSillyQuestion,
  getTechnicalTermSlugs,
  getTechnicalTermListingMeta,
  getTILSlugs,
  getTILEntry,
} from '../src/lib/content';
import { getCheatsheetSlugs, getCheatsheet } from '../src/lib/static-content';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'og');

/* Light blueish theme — matches site light theme (globals.css accent/primary-blue) */
const BRAND = {
  bgStart: '#F0F8FF',
  bgMid: '#E3F2FF',
  bgEnd: '#D6EBFA',
  accent: '#0088E6',
  accentLight: '#006BB8',
  coral: '#E8664A',
  textPrimary: '#00182E',
  textMuted: '#00305C',
  textMid: '#004D8A',
  textLow: '#475569',
  separator: '#94a3b8',
  dotColor: 'rgba(0,53,122,0.22)',
  dotOpacity: 0.85,
  stripeColor: 'rgba(0,53,122,0.12)',
  stripeWidth: 3,
  glowColor: 'rgba(51,163,255,0.15)',
  glowIndigo: 'rgba(99,102,241,0.06)',
  badgeCoralBg: 'rgba(232,102,74,0.1)',
  badgeCoralBorder: 'rgba(232,102,74,0.25)',
} as const;

function sanitize(text: string, maxLen: number): string {
  const t = String(text).replace(/^["']|["']$/g, '').trim();
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen - 1).trim() + '…';
}

function slugifyTag(tag: string): string {
  const decoded = decodeURIComponent(tag);
  return decoded
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'tag';
}

function buildOgElement(
  title: string,
  subtitle: string,
  breadcrumb?: string,
  accent: string = BRAND.accent
): React.ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        background: `linear-gradient(135deg, ${BRAND.bgStart} 0%, ${BRAND.bgMid} 50%, ${BRAND.bgEnd} 100%)`,
        padding: 64,
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 18px, ${BRAND.stripeColor} 18px, ${BRAND.stripeColor} ${18 + BRAND.stripeWidth}px), repeating-linear-gradient(-45deg, transparent, transparent 18px, ${BRAND.stripeColor} 18px, ${BRAND.stripeColor} ${18 + BRAND.stripeWidth}px)`,
          opacity: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${BRAND.dotColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: BRAND.dotOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND.glowColor} 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '55%',
          right: '15%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND.glowIndigo} 0%, transparent 70%)`,
        }}
      />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: BRAND.textLow }}>
          <span>blog.ratnesh-maurya.com</span>
          {breadcrumb && (
            <>
              <span style={{ color: BRAND.separator }}>›</span>
              <span style={{ color: BRAND.coral }}>{breadcrumb}</span>
            </>
          )}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.0,
            color: BRAND.textPrimary,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 26, color: BRAND.textMuted, fontWeight: 500, marginTop: 4 }}>
          {subtitle}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            background: BRAND.badgeCoralBg,
            border: `1px solid ${BRAND.badgeCoralBorder}`,
            borderRadius: 100,
            padding: '6px 16px',
            alignSelf: 'flex-start',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.coral }} />
          <span style={{ color: BRAND.coral, fontSize: 14, fontWeight: 600 }}>Ratnesh Maurya</span>
        </div>
      </div>
    </div>
  );
}

async function writePng(dir: string, name: string, element: React.ReactElement): Promise<boolean> {
  const { ImageResponse } = await import('@vercel/og');
  const fullDir = path.join(outDir, dir);
  if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });
  try {
    const res = new ImageResponse(element, { width: 1200, height: 630 });
    const buf = await res.arrayBuffer();
    fs.writeFileSync(path.join(fullDir, `${name}.png`), Buffer.from(buf));
    return true;
  } catch (e) {
    console.error(`\n${dir}/${name}: ${e instanceof Error ? e.message : e}`);
    return false;
  }
}

const SECTION_PAGES: Array<{ path: string; title: string; subtitle: string; breadcrumb?: string }> = [
  { path: 'home', title: 'Ratn Labs', subtitle: 'Systems, Backend & AI Engineering' },
  { path: 'blog', title: 'Blog', subtitle: 'Explore posts on systems, backend, and AI engineering.', breadcrumb: 'Blog' },
  { path: 'silly-questions', title: 'Silly Questions & Mistakes', subtitle: 'Common coding mistakes and lessons learned.', breadcrumb: 'Silly Questions' },
  { path: 'technical-terms', title: 'Technical Terms', subtitle: 'Definitions for indexing, CAP, ACID, replication, and more.', breadcrumb: 'Technical Terms' },
  { path: 'til', title: 'TIL', subtitle: 'Today I Learned — short dev notes.', breadcrumb: 'TIL' },
  { path: 'cheatsheets', title: 'Cheatsheets', subtitle: 'Quick reference for Go, Docker, PostgreSQL, Kubernetes.', breadcrumb: 'Cheatsheets' },
  { path: 'about', title: 'About', subtitle: 'Backend engineer specialising in system design and scalable architecture.', breadcrumb: 'About' },
  { path: 'now', title: 'Now', subtitle: "What I'm doing now.", breadcrumb: 'Now' },
  { path: 'uses', title: 'Uses', subtitle: 'Tools and setup I use.', breadcrumb: 'Uses' },
  { path: 'topics', title: 'Topics', subtitle: 'Browse by category and tag.', breadcrumb: 'Topics' },
  { path: 'search', title: 'Search', subtitle: 'Search posts, questions, and terms.', breadcrumb: 'Search' },
  { path: 'newsletter', title: 'Newsletter', subtitle: 'Subscribe for updates.', breadcrumb: 'Newsletter' },
  { path: 'privacy-policy', title: 'Privacy Policy', subtitle: 'How we handle your data.', breadcrumb: 'Privacy' },
  { path: 'resources', title: 'Resources', subtitle: 'Curated tools and links.', breadcrumb: 'Resources' },
  { path: 'series', title: 'Series', subtitle: 'Multi-part posts.', breadcrumb: 'Series' },
  { path: 'glossary', title: 'Glossary', subtitle: 'Backend and system design terms.', breadcrumb: 'Glossary' },
];

async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const { ImageResponse } = await import('@vercel/og');
  let total = 0;

  for (const section of SECTION_PAGES) {
    const outPath = path.join(outDir, section.path + '.png');
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        section.title,
        section.subtitle,
        section.breadcrumb
      );
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\n${section.path}: ${e instanceof Error ? e.message : e}`);
    }
  }

  const blogSlugs = getBlogPostSlugs();
  for (const slug of blogSlugs) {
    const post = await getBlogPostListingMeta(slug);
    if (!post) continue;
    const dir = path.join('blog', slug);
    const outPath = path.join(outDir, dir + '.png');
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        sanitize(post.title, 80),
        sanitize(post.description || 'Ratn Labs', 120),
        'Blog'
      );
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\nblog/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  const allTags = new Set<string>();
  for (const slug of blogSlugs) {
    const post = await getBlogPostListingMeta(slug);
    if (post?.tags) post.tags.forEach((t: string) => allTags.add(t));
  }
  for (const tag of allTags) {
    const slug = slugifyTag(tag);
    const tagLabel = tag.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    const dir = path.join('blog', 'tag', slug);
    const outPath = path.join(outDir, dir + '.png');
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        `Posts tagged "${tagLabel}"`,
        `Browse blog posts tagged "${tagLabel}" from Ratn Labs.`,
        'Blog'
      );
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\nblog/tag/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  const sqSlugs = getSillyQuestionSlugs();
  for (const slug of sqSlugs) {
    const q = await getSillyQuestion(slug);
    if (!q) continue;
    const dir = path.join('silly-questions', slug);
    const outPath = path.join(outDir, dir + '.png');
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        sanitize(q.question, 80),
        sanitize(q.answer?.replace(/<[^>]*>/g, '').slice(0, 120) || 'Silly question', 120),
        'Silly Questions',
        '#E8664A'
      );
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\nsilly-questions/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  const termSlugs = getTechnicalTermSlugs();
  for (const slug of termSlugs) {
    const term = await getTechnicalTermListingMeta(slug);
    if (!term) continue;
    const dir = path.join('technical-terms', slug);
    const outPath = path.join(outDir, dir + '.png');
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        sanitize(term.title, 80),
        sanitize(term.description || 'Technical term', 120),
        'Technical Terms'
      );
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\ntechnical-terms/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  const tilSlugs = getTILSlugs();
  for (const slug of tilSlugs) {
    const entry = await getTILEntry(slug);
    if (!entry) continue;
    const dir = path.join('til', slug);
    const outPath = path.join(outDir, dir + '.png');
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const subtitle = entry.rawContent
        ? sanitize(entry.rawContent.replace(/\s+/g, ' ').slice(0, 120), 120)
        : 'TIL';
      const el = buildOgElement(
        sanitize(entry.title, 80),
        subtitle,
        'TIL'
      );
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\ntil/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  const csSlugs = getCheatsheetSlugs();
  for (const slug of csSlugs) {
    const data = getCheatsheet(slug);
    if (!data) continue;
    const dir = path.join('cheatsheets', slug);
    const outPath = path.join(outDir, dir + '.png');
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const title = data.title.includes(' — ') ? data.title.split(' — ')[0] : data.title;
      const el = buildOgElement(
        sanitize(title, 80),
        sanitize(data.description || 'Cheatsheet', 120),
        'Cheatsheets'
      );
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\ncheatsheets/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(`\nOG images: ${total} written to public/og/`);
}

main().catch((e) => {
  console.error('build-og-all failed:', e);
  process.exit(1);
});
