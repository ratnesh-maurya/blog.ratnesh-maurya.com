/**
 * Generate all OG images at build time into public/og/.
 * Uses @vercel/og; no Next server. Run in postbuild.
 *
 * Design: Bold geometric identity system.
 * Each theme gets a unique pattern + accent personality.
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

// ─── Typography ───────────────────────────────────────────────────────────────
const SERIF = 'Newsreader, "EB Garamond", Georgia, serif';
const SANS  = 'Inter, "Avenir Next", "Segoe UI", sans-serif';

// ─── Theme system ─────────────────────────────────────────────────────────────
type OgThemeName = 'default' | 'blog' | 'news' | 'cheatsheets' | 'silly' | 'technical-terms' | 'til';

type OgTheme = {
  // Background
  bgFrom: string;
  bgTo: string;
  // Card
  cardBg: string;
  cardBorder: string;
  // Accent (label, icon)
  accent: string;
  accentLight: string;
  // Pattern variant key
  pattern: 'grid' | 'dots' | 'diagonals' | 'hexgrid' | 'waves' | 'circuit' | 'crosses';
  // Icon / badge
  icon: string;
  label: string;
};

const THEMES: Record<OgThemeName, OgTheme> = {
  default: {
    bgFrom: '#0f1117',
    bgTo: '#1c2033',
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(255,255,255,0.12)',
    accent: '#7c9ef8',
    accentLight: 'rgba(124,158,248,0.15)',
    pattern: 'grid',
    icon: '#',
    label: 'RATN LABS',
  },
  blog: {
    bgFrom: '#0d1a2e',
    bgTo: '#132240',
    cardBg: 'rgba(255,255,255,0.065)',
    cardBorder: 'rgba(100,160,255,0.18)',
    accent: '#60a5fa',
    accentLight: 'rgba(96,165,250,0.14)',
    pattern: 'dots',
    icon: '//',
    label: 'BLOG',
  },
  news: {
    bgFrom: '#1a0d0d',
    bgTo: '#2a1212',
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(248,113,113,0.20)',
    accent: '#f87171',
    accentLight: 'rgba(248,113,113,0.13)',
    pattern: 'diagonals',
    icon: '>>',
    label: 'NEWS',
  },
  cheatsheets: {
    bgFrom: '#0d1f17',
    bgTo: '#112b1e',
    cardBg: 'rgba(255,255,255,0.065)',
    cardBorder: 'rgba(52,211,153,0.18)',
    accent: '#34d399',
    accentLight: 'rgba(52,211,153,0.13)',
    pattern: 'circuit',
    icon: '[]',
    label: 'CHEATSHEETS',
  },
  silly: {
    bgFrom: '#1f0d1a',
    bgTo: '#2d1226',
    cardBg: 'rgba(255,255,255,0.065)',
    cardBorder: 'rgba(232,121,249,0.20)',
    accent: '#e879f9',
    accentLight: 'rgba(232,121,249,0.13)',
    pattern: 'crosses',
    icon: '?!',
    label: 'SILLY QUESTIONS',
  },
  // Deep indigo + dots — clean, "reference book" feel
  'technical-terms': {
    bgFrom: '#0e0e2c',
    bgTo: '#181840',
    cardBg: 'rgba(255,255,255,0.065)',
    cardBorder: 'rgba(129,140,248,0.22)',
    accent: '#818cf8',
    accentLight: 'rgba(129,140,248,0.14)',
    pattern: 'dots',
    icon: 'T=',
    label: 'TECHNICAL TERMS',
  },
  til: {
    bgFrom: '#001a1a',
    bgTo: '#00201f',
    cardBg: 'rgba(255,255,255,0.065)',
    cardBorder: 'rgba(45,212,191,0.18)',
    accent: '#2dd4bf',
    accentLight: 'rgba(45,212,191,0.13)',
    pattern: 'waves',
    icon: '->',
    label: 'TODAY I LEARNED',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sanitize(text: string, maxLen?: number): string {
  const t = String(text).replace(/^["']|["']$/g, '').trim();
  if (!maxLen || t.length <= maxLen) return t;
  return t.slice(0, maxLen - 1).trim() + '…';
}

function charUnitWidth(char: string): number {
  if (char === ' ') return 0.38;
  if (/[-/.:]/.test(char)) return 0.5;
  if (/[A-ZMW@#%&]/.test(char)) return 1.15;
  if (/[il1'.,:;|]/.test(char)) return 0.62;
  return 0.95;
}

function estimateLineCount(text: string, fontSize: number, maxWidth: number): number {
  const unitPx = fontSize * 0.58;
  const lines = text.split('\n');
  let totalLines = 0;
  for (const line of lines) {
    if (!line) { totalLines += 1; continue; }
    const tokens = line.split(/(\s+|\u200B)/).filter(t => t.length > 0);
    let cur = 0, lc = 1;
    for (const token of tokens) {
      if (token === '\u200B') continue;
      if (/^\s+$/.test(token)) {
        const sw = token.length * charUnitWidth(' ') * unitPx;
        if (cur > 0 && cur + sw <= maxWidth) cur += sw;
        continue;
      }
      let tw = 0;
      for (const c of token) tw += charUnitWidth(c) * unitPx;
      if (tw <= maxWidth) {
        if (cur > 0 && cur + tw > maxWidth) { lc++; cur = tw; }
        else cur += tw;
      } else {
        for (const c of token) {
          const cw = charUnitWidth(c) * unitPx;
          if (cur > 0 && cur + cw > maxWidth) { lc++; cur = 0; }
          cur += cw;
        }
      }
    }
    totalLines += lc;
  }
  return totalLines;
}

function getSoftWrappedTitle(title: string): string {
  return title.replace(/([\-/:])/g, '$1\u200B');
}

function getAdaptiveTitleStyle(title: string): { fontSize: number; lineHeight: number } {
  const containerWidth = 860;
  const minSize = 34;
  const maxSize = 88;
  const maxLines = 4;
  const maxHeight = 260;
  let fontSize = maxSize;
  for (let size = maxSize; size >= minSize; size--) {
    const lh = size <= 50 ? 1.1 : size <= 64 ? 1.06 : 1.03;
    const lines = estimateLineCount(title, size, containerWidth);
    if (lines <= maxLines && lines * size * lh <= maxHeight) { fontSize = size; break; }
  }
  return { fontSize, lineHeight: fontSize <= 50 ? 1.1 : fontSize <= 64 ? 1.06 : 1.03 };
}

function slugifyTag(tag: string): string {
  const decoded = decodeURIComponent(tag);
  return decoded.trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '') || 'tag';
}

// ─── Pattern renderers ────────────────────────────────────────────────────────
// Each returns an absolutely-positioned SVG/div layer

function patternGrid(accent: string) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke={accent} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function patternDots(accent: string) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill={accent} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

function patternDiagonals(accent: string) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.14 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="diag" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="28" stroke={accent} strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag)" />
    </svg>
  );
}

function patternHexgrid(accent: string) {
  // Approximated hexagonal dot grid
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.20 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="hex" width="52" height="30" patternUnits="userSpaceOnUse">
          <polygon points="26,1 50,14 50,28 26,29 2,28 2,14" fill="none" stroke={accent} strokeWidth="0.7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}

function patternWaves(accent: string) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.16 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="waves" width="80" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 12 Q20 0 40 12 Q60 24 80 12" fill="none" stroke={accent} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#waves)" />
    </svg>
  );
}

function patternCircuit(accent: string) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.17 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="circuit" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M8 32 H32 V8 M32 32 H56 M32 56 V32" fill="none" stroke={accent} strokeWidth="0.8" />
          <circle cx="8" cy="32" r="2" fill={accent} />
          <circle cx="56" cy="32" r="2" fill={accent} />
          <circle cx="32" cy="8" r="2" fill={accent} />
          <circle cx="32" cy="56" r="2" fill={accent} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}

function patternCrosses(accent: string) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.16 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="crosses" width="40" height="40" patternUnits="userSpaceOnUse">
          <line x1="20" y1="12" x2="20" y2="28" stroke={accent} strokeWidth="1.2" />
          <line x1="12" y1="20" x2="28" y2="20" stroke={accent} strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crosses)" />
    </svg>
  );
}

function renderPattern(key: OgTheme['pattern'], accent: string) {
  switch (key) {
    case 'dots':      return patternDots(accent);
    case 'diagonals': return patternDiagonals(accent);
    case 'hexgrid':   return patternHexgrid(accent);
    case 'waves':     return patternWaves(accent);
    case 'circuit':   return patternCircuit(accent);
    case 'crosses':   return patternCrosses(accent);
    default:          return patternGrid(accent);
  }
}

// ─── Main OG builder ──────────────────────────────────────────────────────────
function buildOgElement(
  title: string,
  _subtitle: string,
  breadcrumb?: string,
  themeName: OgThemeName = 'default',
): React.ReactElement {
  const theme = THEMES[themeName];
  const wrapped = getSoftWrappedTitle(title);
  const titleStyle = getAdaptiveTitleStyle(wrapped);

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        position: 'relative',
        background: `linear-gradient(135deg, ${theme.bgFrom} 0%, ${theme.bgTo} 100%)`,
        fontFamily: SANS,
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      {renderPattern(theme.pattern, theme.accent)}

      {/* Top-left glow blob */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '-80px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: theme.accentLight,
        filter: 'blur(60px)',
      }} />

      {/* Bottom-right glow blob */}
      <div style={{
        position: 'absolute',
        bottom: '-140px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: theme.accentLight,
        filter: 'blur(80px)',
      }} />

      {/* Left accent bar */}
      <div style={{
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        width: '5px',
        background: `linear-gradient(180deg, ${theme.accent} 0%, transparent 100%)`,
      }} />

      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '1px',
        background: `linear-gradient(90deg, ${theme.accent} 0%, transparent 60%)`,
      }} />

      {/* Main content area */}
      <div style={{
        position: 'absolute',
        inset: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 72px 48px 72px',
      }}>
        {/* Top row: icon badge + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: theme.accentLight,
            border: `1px solid ${theme.cardBorder}`,
            fontSize: '18px',
            color: theme.accent,
            fontWeight: 700,
          }}>
            {theme.icon}
          </div>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
            fontWeight: 700,
            color: theme.accent,
            textTransform: 'uppercase',
          }}>
            {breadcrumb ?? theme.label}
          </div>
        </div>

        {/* Center: title */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          flex: 1,
          justifyContent: 'center',
          paddingTop: '16px',
          paddingBottom: '16px',
        }}>
          {/* Decorative line */}
          <div style={{
            width: '48px',
            height: '2px',
            background: theme.accent,
            marginBottom: '28px',
            borderRadius: '2px',
          }} />
          <div style={{
            fontSize: `${titleStyle.fontSize}px`,
            fontFamily: SERIF,
            fontWeight: 700,
            lineHeight: titleStyle.lineHeight,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            maxWidth: '860px',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}>
            {wrapped}
          </div>
        </div>

        {/* Bottom row: domain + corner pattern */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            {/* Avatar dot cluster */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.bgFrom})`,
                border: '2px solid rgba(255,255,255,0.15)',
              }} />
            </div>
            <div style={{
              fontSize: '12px',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              Ratnesh Maurya · blog.ratnesh-maurya.com
            </div>
          </div>

          {/* Right tag pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '100px',
            padding: '6px 14px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: theme.accent,
            }} />
            {theme.label}
          </div>
        </div>
      </div>

      {/* Corner decoration: right-side geometric shape */}
      <div style={{
        position: 'absolute',
        right: '60px',
        top: '50%',
        width: '180px',
        height: '180px',
        borderRadius: '24px',
        border: `1px solid ${theme.cardBorder}`,
        background: theme.cardBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '72px',
        color: theme.accent,
        opacity: 0.35,
        transform: 'translateY(-50%) rotate(12deg)',
      }}>
        {theme.icon}
      </div>
    </div>
  );
}

// ─── File writer ──────────────────────────────────────────────────────────────
async function writePng(dir: string, name: string, element: React.ReactElement): Promise<boolean> {
  const { ImageResponse } = await import('@vercel/og');
  const fullDir = path.join(outDir, dir);
  const outPath = path.join(fullDir, `${name}.png`);
  if (!FORCE_REGENERATE && fs.existsSync(outPath)) return false;
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

// ─── Section pages ────────────────────────────────────────────────────────────
const SECTION_PAGES: Array<{
  path: string;
  title: string;
  subtitle: string;
  breadcrumb?: string;
  theme?: OgThemeName;
}> = [
  { path: 'home',            title: 'Ratn Labs',                subtitle: 'Systems, Backend & AI Engineering',                                  theme: 'default' },
  { path: 'blog',            title: 'Blog',                     subtitle: 'Posts on systems, backend, and AI.',                                 breadcrumb: 'Blog',             theme: 'blog' },
  { path: 'news',            title: 'News',                     subtitle: 'Daily AI & tech digest.',                                            breadcrumb: 'News',             theme: 'news' },
  { path: 'silly-questions', title: 'Silly Questions',          subtitle: 'Common coding mistakes and lessons learned.',                        breadcrumb: 'Silly Questions',  theme: 'silly' },
  { path: 'technical-terms', title: 'Technical Terms',          subtitle: 'Definitions for indexing, CAP, ACID, replication, and more.',        breadcrumb: 'Technical Terms',  theme: 'technical-terms' },
  { path: 'til',             title: 'TIL',                      subtitle: 'Today I Learned — short dev notes.',                                 breadcrumb: 'TIL',              theme: 'til' },
  { path: 'cheatsheets',     title: 'Cheatsheets',              subtitle: 'Quick reference for Go, Docker, PostgreSQL, Kubernetes.',             breadcrumb: 'Cheatsheets',      theme: 'cheatsheets' },
  { path: 'about',           title: 'About',                    subtitle: 'Backend engineer specialising in system design.',                     breadcrumb: 'About',            theme: 'default' },
  { path: 'now',             title: 'Now',                      subtitle: "What I'm doing now.",                                                breadcrumb: 'Now',              theme: 'default' },
  { path: 'uses',            title: 'Uses',                     subtitle: 'Tools and setup I use.',                                             breadcrumb: 'Uses',             theme: 'default' },
  { path: 'topics',          title: 'Topics',                   subtitle: 'Browse by category and tag.',                                        breadcrumb: 'Topics',           theme: 'default' },
  { path: 'search',          title: 'Search',                   subtitle: 'Search posts, questions, and terms.',                                breadcrumb: 'Search',           theme: 'default' },
  { path: 'newsletter',      title: 'Newsletter',               subtitle: 'Subscribe for updates.',                                             breadcrumb: 'Newsletter',       theme: 'default' },
  { path: 'privacy-policy',  title: 'Privacy Policy',           subtitle: 'How we handle your data.',                                           breadcrumb: 'Privacy',          theme: 'default' },
  { path: 'resources',       title: 'Resources',                subtitle: 'Curated tools and links.',                                           breadcrumb: 'Resources',        theme: 'default' },
  { path: 'series',          title: 'Series',                   subtitle: 'Multi-part posts.',                                                  breadcrumb: 'Series',           theme: 'default' },
  { path: 'glossary',        title: 'Glossary',                 subtitle: 'Backend and system design terms.',                                   breadcrumb: 'Glossary',         theme: 'technical-terms' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const { ImageResponse } = await import('@vercel/og');
  let total = 0;

  // Section pages
  for (const section of SECTION_PAGES) {
    const outPath = path.join(outDir, section.path + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(section.title, section.subtitle, section.breadcrumb, section.theme ?? 'default');
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\n${section.path}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Blog posts
  const blogSlugs = getBlogPostSlugs();
  for (const slug of blogSlugs) {
    const post = await getBlogPostListingMeta(slug);
    if (!post) continue;
    const outPath = path.join(outDir, 'blog', slug + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(sanitize(post.title), sanitize(post.description || 'Ratn Labs', 120), 'Blog', 'blog');
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\nblog/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // News posts
  const newsSlugs = getNewsPostSlugs();
  for (const slug of newsSlugs) {
    const post = await getNewsPostListingMeta(slug);
    if (!post) continue;
    const outPath = path.join(outDir, 'news', slug + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(sanitize(post.title), sanitize(post.description || 'Ratn Labs', 120), 'News', 'news');
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\nnews/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Blog tags
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
    const tagLabel = label.replace(/\b\w/g, c => c.toUpperCase());
    const outPath = path.join(outDir, 'blog', 'tag', slug + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(`Posts tagged "${tagLabel}"`, `Browse blog posts tagged "${tagLabel}" from Ratn Labs.`, 'Blog', 'blog');
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\nblog/tag/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Silly questions
  const sqSlugs = getSillyQuestionSlugs();
  for (const slug of sqSlugs) {
    const q = await getSillyQuestion(slug);
    if (!q) continue;
    const outPath = path.join(outDir, 'silly-questions', slug + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(
        sanitize(q.question),
        sanitize(q.answer?.replace(/<[^>]*>/g, '').slice(0, 120) || 'Silly question', 120),
        'Silly Questions', 'silly'
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

  // Technical terms
  const termSlugs = getTechnicalTermSlugs();
  for (const slug of termSlugs) {
    const term = await getTechnicalTermListingMeta(slug);
    if (!term) continue;
    const outPath = path.join(outDir, 'technical-terms', slug + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(sanitize(term.title), sanitize(term.description || 'Technical term', 120), 'Technical Terms', 'technical-terms');
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\ntechnical-terms/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // TIL
  const tilSlugs = getTILSlugs();
  for (const slug of tilSlugs) {
    const entry = await getTILEntry(slug);
    if (!entry) continue;
    const outPath = path.join(outDir, 'til', slug + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const subtitle = entry.rawContent
        ? sanitize(entry.rawContent.replace(/\s+/g, ' ').slice(0, 120), 120)
        : 'TIL';
      const el = buildOgElement(sanitize(entry.title), subtitle, 'TIL', 'til');
      const res = new ImageResponse(el, { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\ntil/${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Cheatsheets
  const csSlugs = getCheatsheetSlugs();
  for (const slug of csSlugs) {
    const data = getCheatsheet(slug);
    if (!data) continue;
    const outPath = path.join(outDir, 'cheatsheets', slug + '.png');
    if (!FORCE_REGENERATE && fs.existsSync(outPath)) { process.stdout.write('-'); continue; }
    const outPathDir = path.dirname(outPath);
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    try {
      const el = buildOgElement(sanitize(data.title), sanitize(data.description || 'Cheatsheet', 120), 'Cheatsheets', 'cheatsheets');
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

main().catch(e => {
  console.error('build-og-all failed:', e);
  process.exit(1);
});
