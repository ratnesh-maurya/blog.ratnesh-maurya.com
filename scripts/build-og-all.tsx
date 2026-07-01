/**
 * Generate all OG images at build time into public/og/.
 * Uses @vercel/og; no Next server. Run in postbuild.
 *
 * Design: Liquid Glass — matches the site design system.
 * Light frosted-glass card over soft accent gradient orbs,
 * Geist headlines + Source Serif subtitles, per-section accent
 * hues drawn from the site's real accent palettes (globals.css).
 *
 * Bump TEMPLATE_VERSION whenever the visual template changes —
 * all images regenerate on the next build.
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

const TEMPLATE_VERSION = 2;
const versionFile = path.join(outDir, '.template-version');

// ─── Fonts (committed TTFs, embedded so satori never falls back) ─────────────
const fontDir = path.join(__dirname, 'og-fonts');
function loadFonts() {
  return [
    { name: 'Geist', data: fs.readFileSync(path.join(fontDir, 'geist-500.ttf')), weight: 500 as const, style: 'normal' as const },
    { name: 'Geist', data: fs.readFileSync(path.join(fontDir, 'geist-700.ttf')), weight: 700 as const, style: 'normal' as const },
    { name: 'Source Serif 4', data: fs.readFileSync(path.join(fontDir, 'source-serif-600.ttf')), weight: 600 as const, style: 'normal' as const },
  ];
}

// ─── Accent palettes (mirrors globals.css data-accent scales) ─────────────────
type AccentName = 'blue' | 'green' | 'purple' | 'rose' | 'orange' | 'teal';

type Accent = { a50: string; a100: string; a400: string; a500: string; a600: string; a700: string };

const ACCENTS: Record<AccentName, Accent> = {
  blue:   { a50: '#EBF5FF', a100: '#CCE8FF', a400: '#33A3FF', a500: '#0066CC', a600: '#005299', a700: '#003D73' },
  green:  { a50: '#ECFDF5', a100: '#D1FAE5', a400: '#34D399', a500: '#059669', a600: '#047857', a700: '#065F46' },
  purple: { a50: '#F5F3FF', a100: '#EDE9FE', a400: '#A78BFA', a500: '#7C3AED', a600: '#6D28D9', a700: '#5B21B6' },
  rose:   { a50: '#FFF1F2', a100: '#FFE4E6', a400: '#FB7185', a500: '#E11D48', a600: '#BE123C', a700: '#9F1239' },
  orange: { a50: '#FFF7ED', a100: '#FFEDD5', a400: '#FB923C', a500: '#EA580C', a600: '#C2410C', a700: '#9A3412' },
  teal:   { a50: '#F0FDFA', a100: '#CCFBF1', a400: '#2DD4BF', a500: '#0D9488', a600: '#0F766E', a700: '#115E59' },
};

// Section → accent mapping (site brand is blue; sections get site palette hues)
const SECTION_ACCENT: Record<string, AccentName> = {
  default: 'blue',
  blog: 'blue',
  news: 'rose',
  'technical-terms': 'purple',
  til: 'teal',
  cheatsheets: 'green',
  silly: 'orange',
};

const INK = '#1C1C1A';
const INK_MUTED = '#6A6A64';
const CANVAS = '#FAFAF8';

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
  const unitPx = fontSize * 0.56;
  const lines = text.split('\n');
  let totalLines = 0;
  for (const line of lines) {
    if (!line) { totalLines += 1; continue; }
    const tokens = line.split(/(\s+|​)/).filter(t => t.length > 0);
    let cur = 0, lc = 1;
    for (const token of tokens) {
      if (token === '​') continue;
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
  return title.replace(/([\-/:])/g, '$1​');
}

function getAdaptiveTitleStyle(title: string): { fontSize: number; lineHeight: number } {
  const containerWidth = 920;
  const minSize = 32;
  const maxSize = 76;
  const maxLines = 4;
  const maxHeight = 236;
  let fontSize = minSize;
  for (let size = maxSize; size >= minSize; size--) {
    const lh = size <= 48 ? 1.14 : size <= 62 ? 1.08 : 1.05;
    const lines = estimateLineCount(title, size, containerWidth);
    if (lines <= maxLines && lines * size * lh <= maxHeight) { fontSize = size; break; }
  }
  return { fontSize, lineHeight: fontSize <= 48 ? 1.14 : fontSize <= 62 ? 1.08 : 1.05 };
}

function slugifyTag(tag: string): string {
  const decoded = decodeURIComponent(tag);
  return decoded.trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '') || 'tag';
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Main OG builder ──────────────────────────────────────────────────────────
type OgProps = {
  title: string;
  label: string;            // section label shown in top pill (e.g. "Blog")
  accentName: AccentName;
  subtitle?: string;        // section pages: short description under title
  metaItems?: string[];     // posts: ["Jun 12, 2026", "6 min read"]
  tags?: string[];          // posts: up to 2 tag pills
  countBadge?: string;      // section pages: "70 daily digests"
};

function buildOgElement(props: OgProps): React.ReactElement {
  const accent = ACCENTS[props.accentName];
  const wrapped = getSoftWrappedTitle(props.title);
  const titleStyle = getAdaptiveTitleStyle(wrapped);
  const metaItems = props.metaItems?.filter(Boolean) ?? [];
  const tags = (props.tags ?? []).slice(0, 2);

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        position: 'relative',
        background: CANVAS,
        fontFamily: 'Geist',
        overflow: 'hidden',
      }}
    >
      {/* Gradient orbs — echo the site hero background */}
      <div style={{
        position: 'absolute', top: '-260px', left: '240px', width: '860px', height: '620px',
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%, ${accent.a100} 0%, rgba(255,255,255,0) 68%)`,
      }} />
      <div style={{
        position: 'absolute', bottom: '-300px', left: '-220px', width: '720px', height: '680px',
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%, ${accent.a50} 0%, rgba(255,255,255,0) 70%)`,
      }} />
      <div style={{
        position: 'absolute', top: '120px', right: '-240px', width: '640px', height: '560px',
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%, ${accent.a100} 0%, rgba(255,255,255,0) 66%)`,
        opacity: 0.8,
      }} />

      {/* Glass card */}
      <div style={{
        position: 'absolute',
        top: '44px', left: '44px', right: '44px', bottom: '44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '46px 58px 42px 58px',
        borderRadius: '32px',
        background: 'rgba(255,255,255,0.72)',
        border: '1.5px solid rgba(255,255,255,0.95)',
        boxShadow: '0 24px 60px rgba(28,28,26,0.10)',
      }}>
        {/* Top row: section pill + count/domain */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            background: accent.a50,
            border: `1px solid ${accent.a100}`,
            borderRadius: '100px',
            padding: '9px 20px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent.a500 }} />
            <div style={{
              fontSize: '14px', letterSpacing: '0.16em', fontWeight: 700,
              color: accent.a700, textTransform: 'uppercase',
            }}>
              {props.label}
            </div>
          </div>
          {props.countBadge ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(28,28,26,0.08)',
              borderRadius: '100px',
              padding: '9px 20px',
              fontSize: '14px', fontWeight: 500, color: INK_MUTED,
            }}>
              {props.countBadge}
            </div>
          ) : (
            <div style={{ fontSize: '14px', fontWeight: 500, color: INK_MUTED, letterSpacing: '0.04em' }}>
              blog.ratnesh-maurya.com
            </div>
          )}
        </div>

        {/* Middle: accent bar + title (+ subtitle / meta) */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingTop: '14px', paddingBottom: '14px' }}>
          <div style={{
            width: '56px', height: '4px', borderRadius: '2px',
            background: `linear-gradient(90deg, ${accent.a500}, ${accent.a400})`,
            marginBottom: '26px',
          }} />
          <div style={{
            fontSize: `${titleStyle.fontSize}px`,
            fontFamily: 'Geist',
            fontWeight: 700,
            lineHeight: titleStyle.lineHeight,
            color: INK,
            letterSpacing: '-0.025em',
            maxWidth: '940px',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}>
            {wrapped}
          </div>
          {props.subtitle ? (
            <div style={{
              fontSize: '26px',
              fontFamily: 'Source Serif 4',
              fontWeight: 600,
              color: INK_MUTED,
              marginTop: '20px',
              maxWidth: '820px',
              lineHeight: 1.4,
            }}>
              {props.subtitle}
            </div>
          ) : null}
          {(metaItems.length > 0 || tags.length > 0) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '26px' }}>
              {metaItems.map((item, i) => (
                <div key={`m${i}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {i > 0 ? <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: INK_MUTED, opacity: 0.6 }} /> : null}
                  <div style={{ fontSize: '17px', fontWeight: 500, color: INK_MUTED }}>{item}</div>
                </div>
              ))}
              {tags.map((tag, i) => (
                <div key={`t${i}`} style={{
                  display: 'flex',
                  background: accent.a100,
                  color: accent.a700,
                  borderRadius: '100px',
                  padding: '5px 15px',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginLeft: i === 0 && metaItems.length > 0 ? '6px' : '0px',
                }}>
                  {tag}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Bottom row: author + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '42px', height: '42px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${accent.a400}, ${accent.a600})`,
              color: '#ffffff', fontSize: '18px', fontWeight: 700,
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 12px rgba(28,28,26,0.12)',
            }}>
              R
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: INK }}>Ratnesh Maurya</div>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: INK_MUTED, opacity: 0.6 }} />
              <div style={{ fontSize: '15px', fontWeight: 500, color: INK_MUTED }}>blog.ratnesh-maurya.com</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: accent.a500 }} />
            <div style={{
              fontSize: '13px', letterSpacing: '0.26em', fontWeight: 700,
              color: INK_MUTED, textTransform: 'uppercase',
            }}>
              Ratn Labs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section pages ────────────────────────────────────────────────────────────
type SectionPage = {
  path: string;
  title: string;
  subtitle: string;
  label: string;
  accent?: AccentName;
  countKey?: 'blog' | 'news' | 'terms' | 'til' | 'cheatsheets' | 'silly';
};

const SECTION_PAGES: SectionPage[] = [
  { path: 'home',            title: 'Practical engineering for real-world systems', subtitle: 'Backend, distributed systems & AI engineering — by Ratnesh Maurya.', label: 'Ratn Labs' },
  { path: 'blog',            title: 'Blog',             subtitle: 'Deep dives on systems, backend, and AI.',                        label: 'Blog',            accent: 'blue',   countKey: 'blog' },
  { path: 'news',            title: 'Daily News',       subtitle: 'Curated AI & tech digest for builders who ship.',                label: 'News',            accent: 'rose',   countKey: 'news' },
  { path: 'silly-questions', title: 'Silly Questions',  subtitle: 'Common coding mistakes and lessons learned.',                    label: 'Silly Questions', accent: 'orange', countKey: 'silly' },
  { path: 'technical-terms', title: 'Technical Terms',  subtitle: 'Indexing, CAP, ACID, replication, and more — explained simply.', label: 'Technical Terms', accent: 'purple', countKey: 'terms' },
  { path: 'til',             title: 'Today I Learned',  subtitle: 'Short dev notes from daily work.',                               label: 'TIL',             accent: 'teal',   countKey: 'til' },
  { path: 'cheatsheets',     title: 'Cheatsheets',      subtitle: 'Quick reference for Go, Docker, PostgreSQL, Kubernetes.',        label: 'Cheatsheets',     accent: 'green',  countKey: 'cheatsheets' },
  { path: 'about',           title: 'About Ratnesh',    subtitle: 'Backend engineer specialising in system design.',                label: 'About' },
  { path: 'topics',          title: 'Topics',           subtitle: 'Browse every post by category and tag.',                         label: 'Topics' },
  { path: 'search',          title: 'Search',           subtitle: 'Search posts, questions, terms, and news.',                      label: 'Search' },
  { path: 'newsletter',      title: 'Newsletter',       subtitle: 'Engineering updates without the noise.',                         label: 'Newsletter' },
  { path: 'privacy-policy',  title: 'Privacy Policy',   subtitle: 'How this site handles your data.',                               label: 'Privacy' },
  { path: 'resources',       title: 'Resources',        subtitle: 'Curated books, tools, and talks.',                               label: 'Resources' },
  { path: 'series',          title: 'Series',           subtitle: 'Multi-part learning paths.',                                     label: 'Series' },
  { path: 'glossary',        title: 'Glossary',         subtitle: 'Backend and system design terms.',                               label: 'Glossary',        accent: 'purple', countKey: 'terms' },
  { path: 'contact',         title: 'Contact',          subtitle: 'Get in touch — questions, feedback, collaboration.',             label: 'Contact' },
  { path: 'analytics',       title: 'Analytics',        subtitle: 'Public, transparent traffic stats for this site.',               label: 'Analytics' },
];

// Section pages removed from generation (routes redirect; images unused)
const STALE_SECTION_FILES = ['now.png', 'uses.png'];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Template-version based invalidation: bump TEMPLATE_VERSION → full regen
  const currentVersion = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, 'utf8').trim() : '';
  const force = currentVersion !== String(TEMPLATE_VERSION);
  if (force) console.log(`OG template v${TEMPLATE_VERSION} (was "${currentVersion || 'none'}") — regenerating all images`);

  const { ImageResponse } = await import('@vercel/og');
  const fonts = loadFonts();
  let total = 0;

  async function write(relPath: string, element: React.ReactElement) {
    const outPath = path.join(outDir, relPath);
    if (!force && fs.existsSync(outPath)) { process.stdout.write('-'); return; }
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    try {
      const res = new ImageResponse(element, { width: 1200, height: 630, fonts });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buf));
      total++;
      process.stdout.write('.');
    } catch (e) {
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
    news: `${newsSlugs.length} daily digests`,
    terms: `${termSlugs.length} terms`,
    til: `${tilSlugs.length} notes`,
    cheatsheets: `${csSlugs.length} cheatsheets`,
    silly: `${sqSlugs.length} questions`,
  };

  // Section pages
  for (const section of SECTION_PAGES) {
    await write(section.path + '.png', buildOgElement({
      title: section.title,
      subtitle: section.subtitle,
      label: section.label,
      accentName: section.accent ?? 'blue',
      countBadge: section.countKey ? counts[section.countKey] : undefined,
    }));
  }

  // Remove stale section images for redirected routes
  for (const file of STALE_SECTION_FILES) {
    const p = path.join(outDir, file);
    if (fs.existsSync(p)) { fs.unlinkSync(p); console.log(`\nremoved stale ${file}`); }
  }

  // Blog posts
  for (const slug of blogSlugs) {
    const post = await getBlogPostListingMeta(slug);
    if (!post) continue;
    await write(path.join('blog', slug + '.png'), buildOgElement({
      title: sanitize(post.title),
      label: 'Blog',
      accentName: 'blue',
      metaItems: [formatDate(post.date), post.readingTime].filter(Boolean) as string[],
      tags: post.tags,
    }));
  }

  // News posts
  for (const slug of newsSlugs) {
    const post = await getNewsPostListingMeta(slug);
    if (!post) continue;
    await write(path.join('news', slug + '.png'), buildOgElement({
      title: sanitize(post.title),
      label: 'Daily News',
      accentName: 'rose',
      metaItems: [formatDate(post.date)].filter(Boolean) as string[],
      tags: post.tags,
    }));
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
    await write(path.join('blog', 'tag', slug + '.png'), buildOgElement({
      title: `Posts tagged "${tagLabel}"`,
      subtitle: `Browse blog posts about ${tagLabel} from Ratn Labs.`,
      label: 'Blog',
      accentName: 'blue',
    }));
  }

  // Silly questions
  for (const slug of sqSlugs) {
    const q = await getSillyQuestion(slug);
    if (!q) continue;
    await write(path.join('silly-questions', slug + '.png'), buildOgElement({
      title: sanitize(q.question),
      label: 'Silly Questions',
      accentName: 'orange',
    }));
  }

  // Technical terms
  for (const slug of termSlugs) {
    const term = await getTechnicalTermListingMeta(slug);
    if (!term) continue;
    await write(path.join('technical-terms', slug + '.png'), buildOgElement({
      title: sanitize(term.title),
      subtitle: sanitize(term.description || '', 110) || undefined,
      label: 'Technical Terms',
      accentName: 'purple',
    }));
  }

  // TIL
  for (const slug of tilSlugs) {
    const entry = await getTILEntry(slug);
    if (!entry) continue;
    await write(path.join('til', slug + '.png'), buildOgElement({
      title: sanitize(entry.title),
      label: 'Today I Learned',
      accentName: 'teal',
      metaItems: [formatDate(entry.date)].filter(Boolean) as string[],
      tags: entry.tags,
    }));
  }

  // Cheatsheets
  for (const slug of csSlugs) {
    const data = getCheatsheet(slug);
    if (!data) continue;
    await write(path.join('cheatsheets', slug + '.png'), buildOgElement({
      title: sanitize(data.title),
      subtitle: sanitize(data.description || '', 110) || undefined,
      label: 'Cheatsheets',
      accentName: 'green',
    }));
  }

  fs.writeFileSync(versionFile, String(TEMPLATE_VERSION));
  console.log(`\nOG images: ${total} written to public/og/ (- = skipped existing, template v${TEMPLATE_VERSION})`);
}

main().catch(e => {
  console.error('build-og-all failed:', e);
  process.exit(1);
});
