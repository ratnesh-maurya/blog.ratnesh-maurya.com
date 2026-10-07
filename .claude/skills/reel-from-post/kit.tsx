/**
 * Shared chrome + rendering for @ratn_labs Instagram carousels.
 *
 * The kit owns everything that MUST be identical on every carousel: canvas,
 * fonts, type/space/radius scales, logo header, progress bar, handle, page
 * indicator, swipe arrow, CTA slide, code card, and the exports (PNGs,
 * caption, alt text, contact sheet). Slide BODIES are never in here — those
 * are designed per post in reels/<slug>/design.tsx.
 *
 * Usage from reels/<slug>/design.tsx:
 *   import { Frame, CtaSlide, Code, renderCarousel, ACCENTS, T, TYPE, RADIUS, FONT, fit } from '../../.claude/skills/reel-from-post/kit';
 */
import fs from 'fs';
import path from 'path';
import React from 'react';

// ─── Canvas ──────────────────────────────────────────────────────────────────
/** 3:4 portrait — Instagram's grid ratio. Every slide in a carousel must match. */
export const W = 1080;
export const H = 1440;
/** Outer padding. Body width = W − 2·PAD = 936. */
export const PAD = 72;
export const BODY_W = W - 2 * PAD;

const repoRoot = path.resolve(__dirname, '../../..');

export const HANDLE = '@ratn_labs';
export const SITE = 'blog.ratnesh-maurya.com';

// ─── Brand tokens (mirror src/app/globals.css) ───────────────────────────────
export const T = {
  bg: '#FAFAF8',
  surface: '#FFFFFF',
  text: '#1C1C1A',
  text2: '#545450',
  muted: '#6A6A64',
  border: '#E4E4DF',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  shadow: '0 4px 8px -2px rgba(28,28,26,0.08)',
  /** The brand mark is always this blue (site default accent), whatever the carousel accent. */
  brand: '#0066CC',
} as const;

export type Accent = { a50: string; a100: string; a400: string; a500: string; a600: string; a700: string };
export const ACCENTS = {
  blue: { a50: '#EBF5FF', a100: '#CCE8FF', a400: '#33A3FF', a500: '#0066CC', a600: '#005299', a700: '#003D73' },
  green: { a50: '#ECFDF5', a100: '#D1FAE5', a400: '#34D399', a500: '#059669', a600: '#047857', a700: '#065F46' },
  purple: { a50: '#F5F3FF', a100: '#EDE9FE', a400: '#A78BFA', a500: '#7C3AED', a600: '#6D28D9', a700: '#5B21B6' },
  rose: { a50: '#FFF1F2', a100: '#FFE4E6', a400: '#FB7185', a500: '#E11D48', a600: '#BE123C', a700: '#9F1239' },
  orange: { a50: '#FFF7ED', a100: '#FFEDD5', a400: '#FB923C', a500: '#EA580C', a600: '#C2410C', a700: '#9A3412' },
  teal: { a50: '#F0FDFA', a100: '#CCFBF1', a400: '#2DD4BF', a500: '#0D9488', a600: '#0F766E', a700: '#115E59' },
  gold: { a50: '#FFFBEB', a100: '#FEF3C7', a400: '#D4A020', a500: '#B45309', a600: '#92400E', a700: '#78350F' },
} satisfies Record<string, Accent>;

// ─── Scales — use these instead of ad-hoc numbers so carousels stay consistent ─
/** Font sizes (px). Nothing on a slide should be smaller than `label`. */
export const TYPE = {
  display: 104, // hook title
  h1: 72, // slide headline
  h2: 56, // sub-headline, big stat labels
  h3: 40, // card titles
  body: 36, // paragraph text
  small: 30, // secondary lines inside cards
  label: 24, // eyebrows, chips, captions
} as const;
export const RADIUS = { sm: 12, md: 20, lg: 28, pill: 999 } as const;
export const SPACE = { xs: 8, sm: 16, md: 24, lg: 40, xl: 64 } as const;

// ─── Fonts (same files as the site's OG images, plus Geist Mono for code) ─────
export const FONT = {
  sans: 'Geist',
  serif: 'Source Serif 4',
  mono: 'Geist Mono',
} as const;

function loadFonts() {
  const dir = path.join(repoRoot, 'scripts', 'og-fonts');
  const read = (f: string) => fs.readFileSync(path.join(dir, f));
  return [
    { name: 'Geist', data: read('geist-500.ttf'), weight: 500 as const, style: 'normal' as const },
    { name: 'Geist', data: read('geist-700.ttf'), weight: 700 as const, style: 'normal' as const },
    { name: 'Source Serif 4', data: read('source-serif-600.ttf'), weight: 600 as const, style: 'normal' as const },
    { name: 'Geist Mono', data: read('geist-mono-500.ttf'), weight: 500 as const, style: 'normal' as const },
    { name: 'Geist Mono', data: read('geist-mono-700.ttf'), weight: 700 as const, style: 'normal' as const },
  ];
}

// ─── Text fitting ────────────────────────────────────────────────────────────
/**
 * Largest font size (px) at which `text` fits in `maxLines` lines of `width` px.
 * Heuristic: Geist averages ~0.53em per character (bold ~0.56em). Use it for
 * anything whose length you don't control (titles, headlines, term names).
 */
export function fit(text: string, opts: { width: number; maxLines: number; max: number; min?: number; bold?: boolean }): number {
  const { width, maxLines, max, min = 28, bold = true } = opts;
  const em = bold ? 0.56 : 0.53;
  const words = text.split(/\s+/);
  for (let size = max; size >= min; size -= 2) {
    const perLine = Math.floor(width / (size * em));
    let lines = 1;
    let used = 0;
    for (const w of words) {
      const need = used === 0 ? w.length : used + 1 + w.length;
      if (need <= perLine) used = need;
      else {
        lines++;
        used = w.length;
      }
    }
    if (lines <= maxLines) return size;
  }
  return min;
}

// ─── Background patterns (≤8% ink; pick ONE per carousel) ────────────────────
// Gradients must fade to a real colour, never `transparent`: Satori interpolates
// through transparent *black*, which renders as a grey smudge. Hard-edged stops
// (dots, grid lines) are fine.
export type Pattern = 'dots' | 'grid' | 'stripes' | 'rings' | 'none';

function patternStyle(p: Pattern, accent: Accent): React.CSSProperties {
  switch (p) {
    case 'dots':
      return { backgroundImage: `radial-gradient(${accent.a500}22 2px, transparent 2px)`, backgroundSize: '36px 36px' };
    case 'grid':
      return {
        backgroundImage: `linear-gradient(${accent.a500}14 1px, transparent 1px), linear-gradient(90deg, ${accent.a500}14 1px, transparent 1px)`,
        backgroundSize: '54px 54px',
      };
    case 'stripes':
      return { backgroundImage: `repeating-linear-gradient(135deg, ${accent.a500}0F 0px, ${accent.a500}0F 2px, transparent 2px, transparent 28px)` };
    case 'rings':
      return { backgroundImage: `radial-gradient(circle at 100% 0%, ${accent.a100} 0px, ${T.bg} 520px)` };
    default:
      return {};
  }
}

// ─── Brand mark — same construction as the site header logo (Header.tsx) ─────
/**
 * "RatnLabs" with "Labs" in brand blue. Satori needs two separate nodes to colour
 * them differently and lays them out ~0.1em further apart than one word, so
 * "Labs" is pulled back to match the site's tight wordmark.
 */
function Wordmark({ size }: { size: number }) {
  const base = { display: 'flex', fontSize: size, fontWeight: 700, letterSpacing: -size * 0.02 } as const;
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ ...base, color: T.text }}>Ratn</div>
      <div style={{ ...base, color: T.brand, marginLeft: -size * 0.1 }}>Labs</div>
    </div>
  );
}

export function Logo({ size = 52, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: size * 0.25,
          backgroundColor: T.brand,
          border: '1.5px solid rgba(255,255,255,0.3)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          color: '#FFFFFF',
          fontSize: size * 0.5,
          fontWeight: 700,
        }}
      >
        R
      </div>
      {wordmark ? (
        <Wordmark size={size * 0.56} />
      ) : null}
    </div>
  );
}

/** Segmented progress bar: segments up to `n` filled. Tells the reader how long the carousel is. */
function Progress({ n, total, accent }: { n: number; total: number; accent: Accent }) {
  return (
    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ display: 'flex', flex: 1, height: 6, borderRadius: 3, backgroundColor: i < n ? accent.a500 : accent.a100 }} />
      ))}
    </div>
  );
}

function Bookmark({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ─── Frame — every slide except the CTA ──────────────────────────────────────
export interface FrameProps {
  /** 1-based slide number. */
  n: number;
  total: number;
  accent: Accent;
  pattern?: Pattern;
  /** Small chip on the right of the header, e.g. "SYSTEM DESIGN", "DAILY NEWS", "TERM". */
  kicker?: string;
  /** Override the page background (e.g. a tinted hook slide). */
  background?: string;
  /** Vertical placement of the body. Default 'center' so short slides don't leave a dead bottom half. */
  valign?: 'top' | 'center' | 'spread';
  /** Show a "Save for later" chip in the footer. Use on the most reference-worthy slide (usually second-to-last). */
  save?: boolean;
  children: React.ReactNode;
}

export function Frame({ n, total, accent, pattern = 'none', kicker, background, valign = 'center', save = false, children }: FrameProps) {
  const isLast = n === total;
  return (
    <div
      style={{
        width: W,
        height: H,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: background ?? T.bg,
        fontFamily: FONT.sans,
        color: T.text,
        padding: `40px ${PAD}px ${PAD}px`,
        ...patternStyle(pattern, accent),
      }}
    >
      <Progress n={n} total={total} accent={accent} />

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 32 }}>
        <Logo size={52} />
        {kicker ? (
          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 3,
              color: accent.a700,
              backgroundColor: accent.a50,
              border: `1.5px solid ${accent.a100}`,
              padding: '8px 18px',
              borderRadius: RADIUS.pill,
            }}
          >
            {kicker.toUpperCase()}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginTop: 40,
          marginBottom: 32,
          justifyContent: valign === 'top' ? 'flex-start' : valign === 'spread' ? 'space-between' : 'center',
        }}
      >
        {children}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', fontSize: TYPE.label, fontWeight: 700, color: T.text2 }}>{HANDLE}</div>
        <div style={{ display: 'flex', fontSize: 22, fontWeight: 500, color: T.muted, letterSpacing: 2 }}>{`${n} / ${total}`}</div>
        {save ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginLeft: 'auto',
              fontSize: TYPE.label,
              fontWeight: 700,
              color: accent.a700,
              backgroundColor: accent.a50,
              border: `1.5px solid ${accent.a100}`,
              padding: '10px 20px',
              borderRadius: RADIUS.pill,
            }}
          >
            <Bookmark color={accent.a600} />
            Save for later
          </div>
        ) : null}
        {isLast ? null : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: save ? 0 : 'auto',
              width: 72,
              height: 72,
              borderRadius: RADIUS.pill,
              backgroundColor: accent.a500,
              color: '#FFFFFF',
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            →
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Code card ───────────────────────────────────────────────────────────────
const KEYWORDS = new Set(
  'def class return if else elif for while in import from as with try except finally raise yield lambda pass break continue and or not is None True False self func package var const let type struct interface go defer chan select map range switch case default new nil fn pub mut impl use match async await function export public private static void int string bool null this extends implements SELECT FROM WHERE JOIN INSERT UPDATE DELETE INTO VALUES CREATE TABLE INDEX AND OR NOT NULL'.split(
    ' ',
  ),
);

type Tok = { text: string; kind: 'kw' | 'str' | 'num' | 'com' | 'fn' | 'plain' };

function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  const re = /(#.*$|\/\/.*$|--.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|(\b\d[\d_.]*\b)|([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  for (const m of line.matchAll(re)) {
    if (m[1]) out.push({ text: m[1], kind: 'com' });
    else if (m[2]) out.push({ text: m[2], kind: 'str' });
    else if (m[3]) out.push({ text: m[3], kind: 'num' });
    else if (m[4]) out.push({ text: m[4], kind: KEYWORDS.has(m[4]) ? 'kw' : 'fn' });
    else if (m[5]) out.push({ text: m[5], kind: KEYWORDS.has(m[5]) ? 'kw' : 'plain' });
    else out.push({ text: m[0], kind: 'plain' });
  }
  // Merge neighbours of the same kind so each line renders as few nodes as possible.
  return out.reduce<Tok[]>((acc, t) => {
    const prev = acc[acc.length - 1];
    if (prev && prev.kind === t.kind) prev.text += t.text;
    else acc.push({ ...t });
    return acc;
  }, []);
}

/**
 * Monospace code card with light, language-agnostic highlighting.
 * At the default 30px, Geist Mono fits ~46 characters per line in the body
 * width; keep snippets ≤ 10 lines. `highlight` = 1-based lines to emphasise.
 */
export function Code({ code, accent, fontSize = 30, title, highlight = [] }: { code: string; accent: Accent; fontSize?: number; title?: string; highlight?: number[] }) {
  const colors: Record<Tok['kind'], string> = {
    kw: accent.a600,
    str: '#047857',
    num: '#B45309',
    com: T.muted,
    fn: '#1D4ED8',
    plain: T.text,
  };
  const lines = code.replace(/\t/g, '  ').replace(/\n+$/, '').split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: RADIUS.lg, backgroundColor: T.surface, border: `1.5px solid ${T.border}`, boxShadow: T.shadow, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 28px', backgroundColor: accent.a50, borderBottom: `1.5px solid ${accent.a100}` }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{ display: 'flex', width: 14, height: 14, borderRadius: 7, backgroundColor: c }} />
        ))}
        {title ? <div style={{ display: 'flex', marginLeft: 12, fontFamily: FONT.mono, fontSize: 22, fontWeight: 500, color: T.text2 }}>{title}</div> : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
        {lines.map((line, i) => {
          const on = highlight.includes(i + 1);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                padding: '2px 28px 2px 24px',
                fontFamily: FONT.mono,
                fontSize,
                fontWeight: 500,
                lineHeight: 1.5,
                backgroundColor: on ? accent.a50 : T.surface,
                borderLeft: `4px solid ${on ? accent.a500 : T.surface}`,
              }}
            >
              {line.length === 0 ? (
                <div style={{ display: 'flex', whiteSpace: 'pre' }}>{' '}</div>
              ) : (
                tokenize(line).map((t, j) => (
                  <div key={j} style={{ display: 'flex', whiteSpace: 'pre', color: colors[t.kind], fontWeight: t.kind === 'kw' ? 700 : 500 }}>
                    {t.text}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CTA — the same last slide on every carousel ─────────────────────────────
/** Canonical public URL for a piece of content (site uses trailing slashes). */
export function postUrl(kind: 'blog' | 'news' | 'til' | 'technical-terms' | 'silly-questions' | 'cheatsheets', slug: string): string {
  return `https://${SITE}/${kind}/${slug}/`;
}

/** `line` is the one bespoke sentence allowed on it — what the full post adds. */
export function CtaSlide({ total, accent, url, line }: { total: number; accent: Accent; url?: string; line?: string }) {
  const short = url?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <div
      style={{
        width: W,
        height: H,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: T.bg,
        backgroundImage: `radial-gradient(circle at 50% 42%, ${accent.a100} 0px, ${T.bg} 640px)`,
        fontFamily: FONT.sans,
        color: T.text,
        padding: `40px ${PAD}px ${PAD}px`,
        textAlign: 'center',
      }}
    >
      <Progress n={total} total={total} accent={accent} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Logo size={120} wordmark={false} />
        <div style={{ display: 'flex', marginTop: 28 }}>
          <Wordmark size={64} />
        </div>
        <div style={{ display: 'flex', marginTop: 48, fontFamily: FONT.serif, fontSize: 60, fontWeight: 600, lineHeight: 1.15, maxWidth: 860 }}>
          {line ?? 'The full breakdown is on the blog.'}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 56,
            fontSize: 34,
            fontWeight: 700,
            color: '#FFFFFF',
            backgroundColor: accent.a500,
            padding: '22px 44px',
            borderRadius: RADIUS.pill,
          }}
        >
          {SITE}
        </div>
        {short ? <div style={{ display: 'flex', marginTop: 24, fontSize: 24, fontWeight: 500, color: T.muted, maxWidth: 900 }}>{short}</div> : null}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 64, fontSize: 30, fontWeight: 700, color: accent.a700 }}>
          <div style={{ display: 'flex' }}>{`Follow ${HANDLE}`}</div>
          <div style={{ display: 'flex', width: 6, height: 6, borderRadius: 3, backgroundColor: accent.a400 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bookmark color={accent.a700} />
            Save it
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignSelf: 'flex-start', fontSize: 22, fontWeight: 500, color: T.muted, letterSpacing: 2 }}>{`${total} / ${total}`}</div>
    </div>
  );
}

// ─── Output ──────────────────────────────────────────────────────────────────
export interface Slide {
  /** Short kebab label for the filename, e.g. "hook", "how-it-works". */
  label: string;
  /** Alt text for screen readers (IG: Advanced settings → Write alt text). Describe what the slide says/shows. */
  alt: string;
  el: React.ReactElement;
}

export interface CarouselMeta {
  /** Instagram caption → caption.txt. */
  caption: string;
  /** Entry for the /links page (Admin → Reels). reel_url is filled in after posting. */
  links: {
    slug: string;
    title: string;
    description: string;
    links: Array<{ label: string; url: string }>;
  };
}

function validate(slides: Slide[], meta: CarouselMeta) {
  const problems: string[] = [];
  if (slides.length < 2 || slides.length > 10) problems.push(`Instagram carousels take 2–10 slides (got ${slides.length})`);
  slides.forEach((s, i) => {
    if (!s.alt?.trim()) problems.push(`slide ${i + 1} (${s.label}) has no alt text`);
  });
  if (meta.caption.length > 2200) problems.push(`Instagram caption is ${meta.caption.length} chars (max 2200)`);
  if (problems.length) throw new Error(`Carousel is not ready:\n  - ${problems.join('\n  - ')}`);
}

/**
 * Renders the carousel into `dir` (default: the folder of the design file being run):
 *   NN-label.png, caption.txt, alt.txt   → Instagram
 *   links.json                           → /links page entry
 *   contact-sheet.png                    → visual QA
 */
export async function renderCarousel(slides: Slide[], meta: CarouselMeta, dir = path.dirname(path.resolve(process.argv[1]))) {
  validate(slides, meta);
  const { ImageResponse } = await import('@vercel/og');
  const sharp = (await import('sharp')).default;
  const fonts = loadFonts();

  for (const f of fs.readdirSync(dir)) {
    if (/^\d{2}-.*\.png$/.test(f) || f === 'contact-sheet.png') fs.rmSync(path.join(dir, f));
  }

  const files: string[] = [];
  for (const [i, s] of slides.entries()) {
    const name = `${String(i + 1).padStart(2, '0')}-${s.label}.png`;
    const res = new ImageResponse(s.el, { width: W, height: H, fonts });
    fs.writeFileSync(path.join(dir, name), Buffer.from(await res.arrayBuffer()));
    files.push(name);
    process.stdout.write('.');
  }

  const write = (name: string, text: string) => fs.writeFileSync(path.join(dir, name), text.trim() + '\n');
  write('caption.txt', meta.caption);
  write('alt.txt', slides.map((s, i) => `${files[i]}\n${s.alt.trim()}`).join('\n\n'));
  write('links.json', JSON.stringify({ ...meta.links, reel_url: '<paste Instagram post URL>' }, null, 2));

  // Contact sheet: up to 5 per row at 1/4 scale.
  const tw = W / 4;
  const th = H / 4;
  const gap = 16;
  const cols = Math.min(5, files.length);
  const rows = Math.ceil(files.length / cols);
  const tiles = await Promise.all(files.map((f) => sharp(path.join(dir, f)).resize(tw, th).png().toBuffer()));
  await sharp({
    create: { width: cols * tw + (cols + 1) * gap, height: rows * th + (rows + 1) * gap, channels: 3, background: '#D9D9D4' },
  })
    .composite(tiles.map((input, i) => ({ input, left: gap + (i % cols) * (tw + gap), top: gap + Math.floor(i / cols) * (th + gap) })))
    .png()
    .toFile(path.join(dir, 'contact-sheet.png'));

  console.log(`\n✓ ${files.length} slides → ${path.relative(process.cwd(), dir)}/`);
  console.log('  Upload NN-*.png in order · caption.txt · alt.txt · links.json for Admin → Reels');
}
