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
  getSillyQuestion,
  getSillyQuestionSlugs,
  getTechnicalTermListingMeta,
  getTechnicalTermSlugs,
  getTILEntry,
  getTILSlugs,
} from '../src/lib/content';
import { getCheatsheet, getCheatsheetSlugs } from '../src/lib/static-content';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'og');

const BRAND = {
  textPrimary: '#1f1a14',
  textMuted: '#4f463b',
  textMid: '#6b6052',
  textLow: '#8a7e6f',
  separator: '#8f8374',
  displayFont: 'Space Grotesk, Sora, Manrope, Helvetica Neue, sans-serif',
  bodyFont: 'IBM Plex Sans, Avenir Next, Segoe UI, sans-serif',
} as const;

const RETRO = {
  borderColor: '#000000',
  borderWidth: '2px',
  radiusCard: '12px',
  radiusButton: '8px',
  shadow: '4px 4px 0px 0px #000000',
  shadowSm: '2px 2px 0px 0px #000000',
} as const;

type OgThemeName = 'default' | 'blog' | 'cheatsheets' | 'silly' | 'technical-terms' | 'til';

type OgTheme = {
  bgStart: string;
  bgMid: string;
  bgEnd: string;
  accent: string;
  accentLight: string;
  secondaryAccent: string;
  gridColor: string;
  beamColor: string;
  glowColor: string;
  glowSecondary: string;
  badgeBg: string;
  badgeBorder: string;
  stampText: string;
};

const THEMES: Record<OgThemeName, OgTheme> = {
  default: {
    bgStart: '#fff9ec',
    bgMid: '#fff4df',
    bgEnd: '#f6ead4',
    accent: '#1b6ac9',
    accentLight: '#2f7dd8',
    secondaryAccent: '#d18824',
    gridColor: 'rgba(60, 47, 29, 0.10)',
    beamColor: 'rgba(27, 106, 201, 0.10)',
    glowColor: 'rgba(27, 106, 201, 0.16)',
    glowSecondary: 'rgba(209, 136, 36, 0.14)',
    badgeBg: 'rgba(27, 106, 201, 0.08)',
    badgeBorder: 'rgba(27, 106, 201, 0.28)',
    stampText: 'RATNLABS // RETRO ENGINEERING',
  },
  blog: {
    bgStart: '#f8fbff',
    bgMid: '#edf6ff',
    bgEnd: '#e2f0ff',
    accent: '#005bb5',
    accentLight: '#0a6ecf',
    secondaryAccent: '#3f8cff',
    gridColor: 'rgba(19, 55, 95, 0.10)',
    beamColor: 'rgba(0, 91, 181, 0.10)',
    glowColor: 'rgba(0, 91, 181, 0.16)',
    glowSecondary: 'rgba(63, 140, 255, 0.14)',
    badgeBg: 'rgba(0, 91, 181, 0.08)',
    badgeBorder: 'rgba(0, 91, 181, 0.28)',
    stampText: 'RATNLABS // ENGINEERING JOURNAL',
  },
  cheatsheets: {
    bgStart: '#f7fff8',
    bgMid: '#ebfaef',
    bgEnd: '#ddf3e4',
    accent: '#18794e',
    accentLight: '#238b5d',
    secondaryAccent: '#bc8d2f',
    gridColor: 'rgba(28, 69, 49, 0.10)',
    beamColor: 'rgba(24, 121, 78, 0.10)',
    glowColor: 'rgba(24, 121, 78, 0.16)',
    glowSecondary: 'rgba(188, 141, 47, 0.14)',
    badgeBg: 'rgba(24, 121, 78, 0.08)',
    badgeBorder: 'rgba(24, 121, 78, 0.30)',
    stampText: 'RATNLABS // FIELD REFERENCE',
  },
  silly: {
    bgStart: '#fff8f5',
    bgMid: '#ffefe8',
    bgEnd: '#ffe4d8',
    accent: '#c24d2c',
    accentLight: '#d35f3d',
    secondaryAccent: '#cf8d18',
    gridColor: 'rgba(102, 43, 24, 0.10)',
    beamColor: 'rgba(194, 77, 44, 0.10)',
    glowColor: 'rgba(194, 77, 44, 0.15)',
    glowSecondary: 'rgba(207, 141, 24, 0.14)',
    badgeBg: 'rgba(194, 77, 44, 0.08)',
    badgeBorder: 'rgba(194, 77, 44, 0.30)',
    stampText: 'RATNLABS // BUGS & LESSONS',
  },
  'technical-terms': {
    bgStart: '#fffdf8',
    bgMid: '#f9f5ec',
    bgEnd: '#f0eadf',
    accent: '#a16a0f',
    accentLight: '#b57919',
    secondaryAccent: '#4f6fb8',
    gridColor: 'rgba(62, 50, 30, 0.10)',
    beamColor: 'rgba(161, 106, 15, 0.10)',
    glowColor: 'rgba(161, 106, 15, 0.16)',
    glowSecondary: 'rgba(79, 111, 184, 0.12)',
    badgeBg: 'rgba(161, 106, 15, 0.08)',
    badgeBorder: 'rgba(161, 106, 15, 0.28)',
    stampText: 'RATNLABS // SYSTEMS LEXICON',
  },
  til: {
    bgStart: '#f4fffe',
    bgMid: '#e9faf9',
    bgEnd: '#dcf2f0',
    accent: '#1f7d80',
    accentLight: '#2e8f92',
    secondaryAccent: '#cb6e4c',
    gridColor: 'rgba(25, 72, 74, 0.10)',
    beamColor: 'rgba(31, 125, 128, 0.10)',
    glowColor: 'rgba(31, 125, 128, 0.16)',
    glowSecondary: 'rgba(203, 110, 76, 0.12)',
    badgeBg: 'rgba(31, 125, 128, 0.08)',
    badgeBorder: 'rgba(31, 125, 128, 0.28)',
    stampText: 'RATNLABS // LEARNING LOGBOOK',
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
  subtitle: string,
  breadcrumb?: string,
  themeName: OgThemeName = 'default'
): React.ReactElement {
  const theme = THEMES[themeName];

  const titleLength = title.length;

  const titleFontSize =
    titleLength > 90 ? 56 :
      titleLength > 65 ? 66 :
        78;

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `linear-gradient(135deg, ${theme.bgStart} 0%, ${theme.bgMid} 52%, ${theme.bgEnd} 100%)`,
        padding: '64px 72px',
        position: 'relative',
        fontFamily: BRAND.bodyFont,
        overflow: 'hidden',
        border: `${RETRO.borderWidth} solid ${RETRO.borderColor}`,
        borderRadius: RETRO.radiusCard,
        boxShadow: RETRO.shadow,
      }}
    >
      {/* Structural grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${theme.gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          opacity: 0.85,
        }}
      />

      {/* Energetic diagonal light beam */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-320px',
          width: '980px',
          height: '220px',
          transform: 'rotate(-18deg)',
          background: `linear-gradient(90deg, transparent 0%, ${theme.beamColor} 55%, transparent 100%)`,
          filter: 'blur(1px)',
        }}
      />

      {/* Accent glow top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-160px',
          right: '-90px',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 60%)`,
        }}
      />

      {/* Warm glow bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.glowSecondary} 0%, transparent 65%)`,
        }}
      />

      {/* Memorable anchor: angled brand stamp */}
      <div
        style={{
          position: 'absolute',
          top: '26px',
          right: '-66px',
          width: '340px',
          padding: '10px 20px',
          border: `${RETRO.borderWidth} solid ${RETRO.borderColor}`,
          background: 'rgba(255, 250, 241, 0.92)',
          color: BRAND.textPrimary,
          fontFamily: BRAND.displayFont,
          fontWeight: 800,
          fontSize: '14px',
          letterSpacing: '0.11em',
          textAlign: 'center',
          transform: 'rotate(16deg)',
          boxShadow: RETRO.shadowSm,
        }}
      >
        {theme.stampText}
      </div>

      {/* Left timeline bar */}
      <div
        style={{
          position: 'absolute',
          left: '34px',
          top: '40px',
          bottom: '40px',
          width: '3px',
          borderRadius: '3px',
          background: `linear-gradient(180deg, ${theme.accent} 0%, rgba(45, 35, 22, 0.2) 100%)`,
          opacity: 0.9,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          position: 'relative',
          marginLeft: '20px',
          maxWidth: '1010px',
        }}
      >
        {/* Breadcrumb line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '16px',
            color: BRAND.textLow,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ fontWeight: 700, color: BRAND.textMuted }}>RatnLabs</span>
          {breadcrumb && (
            <>
              <span style={{ color: BRAND.separator }}>/</span>
              <span style={{ color: theme.accent, fontWeight: 700 }}>
                {breadcrumb}
              </span>
            </>
          )}
        </div>

        {/* Accent rail */}
        <div
          style={{
            width: '220px',
            height: '12px',
            borderRadius: RETRO.radiusButton,
            background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.secondaryAccent} 100%)`,
            border: `${RETRO.borderWidth} solid ${RETRO.borderColor}`,
            boxShadow: RETRO.shadowSm,
          }}
        />

        {/* Headline panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: 'rgba(255, 255, 255, 0.6)',
            border: `${RETRO.borderWidth} solid ${RETRO.borderColor}`,
            borderLeft: `12px solid ${theme.accent}`,
            borderRadius: RETRO.radiusCard,
            padding: '20px 24px',
            backdropFilter: 'blur(1px)',
            boxShadow: RETRO.shadow,
          }}
        >
          <div
            style={{
              fontSize: `${titleFontSize}px`,
              fontFamily: BRAND.displayFont,
              fontWeight: 900,
              lineHeight: 0.97,
              letterSpacing: '-0.04em',
              color: BRAND.textPrimary,
              textWrap: 'balance',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '23px',
              fontWeight: 600,
              color: BRAND.textMuted,
              lineHeight: 1.28,
              maxWidth: '920px',
              textWrap: 'pretty',
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              color: BRAND.textMid,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Read more at blog.ratnesh-maurya.com
          </span>

          <span
            style={{
              fontSize: '13px',
              color: BRAND.textLow,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            RatnLabs
          </span>
        </div>
      </div>

      {/* Author badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          marginLeft: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: theme.badgeBg,
            border: `${RETRO.borderWidth} solid ${RETRO.borderColor}`,
            borderRadius: RETRO.radiusButton,
            padding: '10px 20px',
            boxShadow: RETRO.shadowSm,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: theme.accent,
              border: `1px solid ${RETRO.borderColor}`,
            }}
          />
          <span
            style={{
              color: theme.accentLight,
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Ratnesh Maurya
          </span>
        </div>

        <span
          style={{
            fontSize: '14px',
            color: BRAND.textMid,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
          }}
        >
          blog.ratnesh-maurya.com
        </span>
      </div>

      {/* Premium frame */}
      <div
        style={{
          position: 'absolute',
          inset: '16px',
          border: `${RETRO.borderWidth} solid ${RETRO.borderColor}`,
          opacity: 0.28,
          pointerEvents: 'none',
          borderRadius: RETRO.radiusCard,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(26, 20, 12, 0.015) 0px, rgba(26, 20, 12, 0.015) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
        }}
      />
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
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        section.title,
        section.subtitle,
        section.breadcrumb,
        section.theme ?? 'default'
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

  console.log(`\nOG images: ${total} written to public/og/`);
}

main().catch((e) => {
  console.error('build-og-all failed:', e);
  process.exit(1);
});
