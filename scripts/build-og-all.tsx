/**
 * Generate all OG images at build time into public/og/.
 * Uses @vercel/og; no Next server. Run in postbuild.
 */
import fs from 'fs';
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'og');
const FORCE_REGENERATE = false;

const BRAND = {
  textPrimary: '#191d23',
  textMuted: '#444c58',
  textLow: '#7b8492',
  cardBg: '#fafaf8',
  pageBg: '#f4f4f1',
  divider: '#d5d8de',
  serifFont: 'Newsreader, "EB Garamond", Georgia, serif',
  sansFont: 'Inter, "Avenir Next", "Segoe UI", sans-serif',
} as const;

type OgThemeName = 'default' | 'blog' | 'news' | 'cheatsheets' | 'silly' | 'technical-terms' | 'til';

type OgTheme = {
  accent: string;
  panelBase: string;
  panelOverlay: string;
  stickerBorder: string;
};

const THEMES: Record<OgThemeName, OgTheme> = {
  default: {
    accent: '#4a6f8e',
    panelBase: '#dde5ec',
    panelOverlay: 'rgba(111, 138, 164, 0.12)',
    stickerBorder: '#c5cfdb',
  },
  blog: {
    accent: '#2f5f86',
    panelBase: '#dce8f3',
    panelOverlay: 'rgba(52, 103, 146, 0.12)',
    stickerBorder: '#cad8e6',
  },
  news: {
    accent: '#3f566c',
    panelBase: '#dce2e8',
    panelOverlay: 'rgba(61, 88, 112, 0.12)',
    stickerBorder: '#c8d0d8',
  },
  cheatsheets: {
    accent: '#4f6f57',
    panelBase: '#dce8df',
    panelOverlay: 'rgba(66, 108, 78, 0.14)',
    stickerBorder: '#c7d8cd',
  },
  silly: {
    accent: '#8a5d56',
    panelBase: '#ebdfdc',
    panelOverlay: 'rgba(130, 87, 80, 0.14)',
    stickerBorder: '#decfcb',
  },
  'technical-terms': {
    accent: '#8a6b3f',
    panelBase: '#eae3d8',
    panelOverlay: 'rgba(126, 98, 56, 0.14)',
    stickerBorder: '#ddd2c1',
  },
  til: {
    accent: '#2f706f',
    panelBase: '#d9e7e5',
    panelOverlay: 'rgba(45, 101, 100, 0.14)',
    stickerBorder: '#c7d8d5',
  },
};

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
  _subtitle: string,
  breadcrumb?: string,
  themeName: OgThemeName = 'default',
  options?: { squareSafe?: boolean }
): React.ReactElement {
  const theme = THEMES[themeName];

  const titleLength = title.length;

  const titleFontSize = options?.squareSafe
    ? (titleLength > 68 ? 52 : titleLength > 50 ? 62 : titleLength > 30 ? 70 : 78)
    : (titleLength > 90 ? 60 : titleLength > 68 ? 70 : titleLength > 40 ? 80 : 90);

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(142deg, #f9fbff 0%, ${theme.panelBase} 62%, #edf1f7 100%)`,
        padding: '26px',
        position: 'relative',
        fontFamily: BRAND.sansFont,
        overflow: 'hidden',
        border: '1px solid #e6ebf3',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-110px',
          right: '-70px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: theme.panelOverlay,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-130px',
          left: '-90px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.52)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(115deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 48%), repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 2px, transparent 2px, transparent 12px)',
        }}
      />

      <div
        style={{
          width: options?.squareSafe ? '560px' : '940px',
          height: options?.squareSafe ? '560px' : '540px',
          background: 'rgba(255,255,255,0.58)',
          border: '1px solid rgba(255,255,255,0.88)',
          borderRadius: '42px',
          boxShadow: '0 22px 50px rgba(60, 82, 110, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          padding: options?.squareSafe ? '32px 34px' : '32px 40px',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontSize: '12px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: BRAND.textLow,
            borderBottom: `1px solid ${BRAND.divider}`,
            paddingBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: theme.accent,
              }}
            />
            <span style={{ fontWeight: 700 }}>OG Image</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: options?.squareSafe ? '20px' : '30px',
            gap: options?.squareSafe ? '14px' : '16px',
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: '13px',
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: theme.accent,
              fontWeight: 600,
            }}
          >
            {breadcrumb ?? 'Category'}
          </div>
          <div
            style={{
              fontSize: `${titleFontSize}px`,
              fontFamily: BRAND.serifFont,
              fontWeight: 700,
              lineHeight: 1.03,
              color: BRAND.textPrimary,
              letterSpacing: '-0.015em',
              textWrap: 'balance',
            }}
          >
            {title}
          </div>

        </div>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: BRAND.textLow,
            borderTop: `1px solid ${BRAND.divider}`,
            paddingTop: '12px',
          }}
        >
          Ratnesh Maurya / blog.ratnesh-maurya.com
        </div>
      </div>
    </div>
  );
}

async function writePng(dir: string, name: string, element: React.ReactElement): Promise<boolean> {
  const { ImageResponse } = await import('@vercel/og');
  const fullDir = path.join(outDir, dir);
  const outPath = path.join(fullDir, `${name}.png`);
  if (fs.existsSync(outPath)) return false; // already built — skip
  if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });
  try {
    const res = new ImageResponse(element, { width: 1200, height: 630 });
    const buf = await res.arrayBuffer();
    fs.writeFileSync(outPath, Buffer.from(buf));
    return true;
  } catch (e) {
    console.error(`\n${dir}/${name}: ${e instanceof Error ? e.message : e}`);
    return false;
  }
}

const SECTION_PAGES: Array<{ path: string; title: string; subtitle: string; breadcrumb?: string; theme?: OgThemeName }> = [
  { path: 'home', title: 'Ratn Labs', subtitle: 'Systems, Backend & AI Engineering', theme: 'default' },
  { path: 'blog', title: 'Blog', subtitle: 'Explore posts on systems, backend, and AI engineering.', breadcrumb: 'Blog', theme: 'blog' },
  { path: 'silly-questions', title: 'Silly Questions & Mistakes', subtitle: 'Common coding mistakes and lessons learned.', breadcrumb: 'Silly Questions', theme: 'silly' },
  { path: 'technical-terms', title: 'Technical Terms', subtitle: 'Definitions for indexing, CAP, ACID, replication, and more.', breadcrumb: 'Technical Terms', theme: 'technical-terms' },
  { path: 'til', title: 'TIL', subtitle: 'Today I Learned — short dev notes.', breadcrumb: 'TIL', theme: 'til' },
  { path: 'cheatsheets', title: 'Cheatsheets', subtitle: 'Quick reference for Go, Docker, PostgreSQL, Kubernetes.', breadcrumb: 'Cheatsheets', theme: 'cheatsheets' },
  { path: 'about', title: 'About', subtitle: 'Backend engineer specialising in system design and scalable architecture.', breadcrumb: 'About', theme: 'default' },
  { path: 'now', title: 'Now', subtitle: "What I'm doing now.", breadcrumb: 'Now', theme: 'default' },
  { path: 'uses', title: 'Uses', subtitle: 'Tools and setup I use.', breadcrumb: 'Uses', theme: 'default' },
  { path: 'topics', title: 'Topics', subtitle: 'Browse by category and tag.', breadcrumb: 'Topics', theme: 'default' },
  { path: 'search', title: 'Search', subtitle: 'Search posts, questions, and terms.', breadcrumb: 'Search', theme: 'default' },
  { path: 'newsletter', title: 'Newsletter', subtitle: 'Subscribe for updates.', breadcrumb: 'Newsletter', theme: 'default' },
  { path: 'privacy-policy', title: 'Privacy Policy', subtitle: 'How we handle your data.', breadcrumb: 'Privacy', theme: 'default' },
  { path: 'resources', title: 'Resources', subtitle: 'Curated tools and links.', breadcrumb: 'Resources', theme: 'default' },
  { path: 'series', title: 'Series', subtitle: 'Multi-part posts.', breadcrumb: 'Series', theme: 'default' },
  { path: 'glossary', title: 'Glossary', subtitle: 'Backend and system design terms.', breadcrumb: 'Glossary', theme: 'technical-terms' },
];

async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const { ImageResponse } = await import('@vercel/og');
  let total = 0;

  for (const section of SECTION_PAGES) {
    const outPath = path.join(outDir, section.path + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        section.title,
        section.subtitle,
        section.breadcrumb,
        section.theme ?? 'default',
        { squareSafe: true }
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
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        sanitize(post.title, 80),
        sanitize(post.description || 'Ratn Labs', 120),
        'Blog',
        'blog'
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

  const newsSlugs = getNewsPostSlugs();
  for (const slug of newsSlugs) {
    const post = await getNewsPostListingMeta(slug);
    if (!post) continue;
    const dir = path.join('news', slug);
    const outPath = path.join(outDir, dir + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        sanitize(post.title, 80),
        sanitize(post.description || 'Ratn Labs', 120),
        'News',
        'news'
      );
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\nnews/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  const allTagLabels = new Set<string>();
  for (const slug of blogSlugs) {
    const post = await getBlogPostListingMeta(slug);
    if (post?.tags) post.tags.forEach((t: string) => allTagLabels.add(t.trim()));
    if (post?.category) allTagLabels.add(post.category.trim());
  }
  const seenTagSlugs = new Set<string>();
  for (const label of allTagLabels) {
    const slug = slugifyTag(label);
    if (seenTagSlugs.has(slug)) continue;
    seenTagSlugs.add(slug);
    const tagLabel = label.replace(/\b\w/g, (c) => c.toUpperCase());
    const dir = path.join('blog', 'tag', slug);
    const outPath = path.join(outDir, dir + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        `Posts tagged "${tagLabel}"`,
        `Browse blog posts tagged "${tagLabel}" from Ratn Labs.`,
        'Blog',
        'blog'
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
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        sanitize(q.question, 80),
        sanitize(q.answer?.replace(/<[^>]*>/g, '').slice(0, 120) || 'Silly question', 120),
        'Silly Questions',
        'silly'
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
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        sanitize(term.title, 80),
        sanitize(term.description || 'Technical term', 120),
        'Technical Terms',
        'technical-terms'
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
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const subtitle = entry.rawContent
        ? sanitize(entry.rawContent.replace(/\s+/g, ' ').slice(0, 120), 120)
        : 'TIL';
      const el = buildOgElement(
        sanitize(entry.title, 80),
        subtitle,
        'TIL',
        'til'
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
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const title = data.title.includes(' — ') ? data.title.split(' — ')[0] : data.title;
      const el = buildOgElement(
        sanitize(title, 80),
        sanitize(data.description || 'Cheatsheet', 120),
        'Cheatsheets',
        'cheatsheets'
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

  console.log(`\nOG images: ${total} new written to public/og/ (- = skipped existing)`);
}

main().catch((e) => {
  console.error('build-og-all failed:', e);
  process.exit(1);
});
