/* eslint-disable @next/next/no-img-element -- satori renders these <img> tags; next/image does not apply */
/**
 * The OG card: 1200×630, light, one design for every page type. Ported from the Claude Design
 * project "OG Images" (`OG Images.dc.html` + `og-data.js`) to what satori can render.
 *
 * Layers, back to front: blue grid faded toward the top-right, an optional generative SVG
 * pattern (home + section pages), a giant ghost glyph (pages without a pattern), a 6px accent
 * bar, then header / chip + title + subtitle-or-tags / footer.
 *
 * Satori has no CSS mask compositing, so the grid and the pattern are drawn as ONE SVG
 * (masks and gradients included, rasterised by resvg) and embedded as an <img>.
 */
import fs from 'fs';
import path from 'path';
import React from 'react';
import { fileURLToPath } from 'url';
import { SITE_HOST } from '../src/lib/site';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Fonts + avatar (committed, embedded so satori never falls back or hits the network) ──────
const fontDir = path.join(__dirname, 'og-fonts');

/**
 * Satori's layout and its glyph drawing disagree about Geist's GPOS kerning, which leaves
 * visibly uneven word gaps ("world  systems"). Renaming the kerning tables in the font
 * directory makes both agree. Handles TTF (16-byte entries) and WOFF (20-byte entries).
 */
function withoutKerning(font: Buffer): Buffer {
  const out = Buffer.from(font);
  const woff = out.toString('latin1', 0, 4) === 'wOFF';
  const count = out.readUInt16BE(woff ? 12 : 4);
  const first = woff ? 44 : 12;
  const size = woff ? 20 : 16;
  for (let i = 0; i < count; i++) {
    const at = first + i * size;
    const tag = out.toString('latin1', at, at + 4);
    if (tag === 'GPOS' || tag === 'kern') out.write(`X${tag.slice(1)}`, at, 'latin1');
  }
  return out;
}

export function loadOgFonts() {
  const read = (file: string) => withoutKerning(fs.readFileSync(path.join(fontDir, file)));
  const f = (name: string, file: string, weight: 400 | 500 | 600 | 700) => ({
    name,
    data: read(file),
    weight,
    style: 'normal' as const,
  });
  return [
    f('Geist', 'geist-400.woff', 400),
    f('Geist', 'geist-500.ttf', 500),
    f('Geist', 'geist-600.woff', 600),
    f('Geist', 'geist-700.ttf', 700),
    f('Geist Mono', 'geist-mono-400.woff', 400),
    f('Geist Mono', 'geist-mono-500.ttf', 500),
    f('Geist Mono', 'geist-mono-700.ttf', 700),
  ];
}

const AVATAR = `data:image/jpeg;base64,${fs.readFileSync(path.join(__dirname, 'og-assets', 'avatar.jpg')).toString('base64')}`;

// ─── Design tokens ────────────────────────────────────────────────────────────────────────────
const W = 1200;
const H = 630;
const INK = '#1C1C1A';
const MUTED = '#545450';
const SOFT = '#6A6A64';
const BORDER = '#E4E4DF';
const CANVAS = '#F9FCFF';
// Design asks for 650; the pipeline ships 500/600/700 only, and 700 holds up better at poster sizes.
const TITLE_WEIGHT = 700;

export type CardType = 'home' | 'section' | 'post' | 'term' | 'sheet' | 'til' | 'news' | 'question';
export type PatternKind = 'dots' | 'network' | 'rings' | 'bars' | 'flow';

const ACCENT: Record<CardType, string> = {
  home: '#0066CC',
  section: '#0066CC',
  post: '#0066CC',
  term: '#0D9488',
  sheet: '#059669',
  til: '#7C3AED',
  news: '#DC2626',
  question: '#B8288C',
};

export interface CardProps {
  /** Output path without ".png" (e.g. "blog/my-post"). Seeds the pattern. */
  id: string;
  type: CardType;
  /** Route shown in the pill after the host, e.g. "/blog/my-post/". */
  path: string;
  /** Mono label above the title. */
  chip: string;
  title: string;
  subtitle?: string;
  /** Mono tag chips. Replace the subtitle when present. */
  tags?: string[];
  /** Mono text bottom-right. */
  meta?: string;
  /** Giant glyph bottom-right, drawn only when the card has no pattern. */
  ghost?: string;
  /** Generative pattern; home + section pages only. */
  pattern?: PatternKind;
}

// ─── Pattern (SVG) ────────────────────────────────────────────────────────────────────────────
/** Seeded RNG so a page always gets the same pattern. */
function rng(seed: string) {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function patternSvg(kind: PatternKind, id: string, color: string, strength: number): string {
  const R = rng(id);
  const a = (o: number) => (o * strength).toFixed(3);
  const out: string[] = [];

  if (kind === 'dots') {
    const s1 = R() * 6, s2 = R() * 6, f = 0.006 + R() * 0.006;
    for (let x = 15; x < W; x += 30) {
      for (let y = 15; y < H; y += 30) {
        const v = (Math.sin(x * f + s1) * Math.cos(y * f * 1.3 + s2) + Math.sin((x + y) * f * 0.7 + s1)) / 2;
        const n = Math.pow((v + 1) / 2, 2);
        out.push(`<circle cx="${x}" cy="${y}" r="${(1.2 + n * 5.2).toFixed(2)}" fill="${color}" fill-opacity="${a(0.12 + n * 0.75)}"/>`);
      }
    }
  } else if (kind === 'network') {
    const pts = Array.from({ length: 34 }, () => [520 + R() * 660, 40 + R() * 550]);
    pts.forEach((p, i) => {
      pts
        .map((q, j) => [j, Math.hypot(p[0] - q[0], p[1] - q[1])] as const)
        .filter((d) => d[0] !== i)
        .sort((m, n) => m[1] - n[1])
        .slice(0, 2)
        .forEach(([j]) => {
          out.push(`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke="${color}" stroke-opacity="${a(0.35)}" stroke-width="1.5"/>`);
        });
    });
    pts.forEach((p, i) => {
      const hot = i % 7 === 0;
      const r = hot ? 8 : 3 + R() * 3;
      out.push(`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r.toFixed(2)}" fill="${hot ? color : '#FFFFFF'}" fill-opacity="${hot ? a(0.9) : 1}" stroke="${color}" stroke-opacity="${a(0.7)}" stroke-width="2"/>`);
    });
  } else if (kind === 'rings') {
    const cx = 1060 + R() * 160, cy = 80 + R() * 470;
    for (let r = 30, i = 0; r < 760; r += 34, i++) {
      const dash = i % 3 === 1 ? ' stroke-dasharray="3 9"' : '';
      out.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="none" stroke="${color}" stroke-opacity="${a(0.55 - i * 0.022)}" stroke-width="${i % 4 === 0 ? 2.5 : 1.2}"${dash}/>`);
    }
    for (let i = 0; i < 4; i++) {
      const r = 96 + i * 102, t0 = R() * 6.28, t1 = t0 + 0.6 + R() * 0.9;
      const d = `M${(cx + r * Math.cos(t0)).toFixed(1)} ${(cy + r * Math.sin(t0)).toFixed(1)} A${r} ${r} 0 0 1 ${(cx + r * Math.cos(t1)).toFixed(1)} ${(cy + r * Math.sin(t1)).toFixed(1)}`;
      out.push(`<path d="${d}" fill="none" stroke="${color}" stroke-opacity="${a(0.9)}" stroke-width="5" stroke-linecap="round"/>`);
    }
  } else if (kind === 'bars') {
    const s = R() * 6;
    for (let x = 560, i = 0; x < W; x += 20, i++) {
      const h = 40 + Math.abs(Math.sin(i * 0.35 + s) * 160 + Math.sin(i * 0.11 + s * 2) * 90) + R() * 30;
      out.push(`<rect x="${x}" y="${(315 - h / 2).toFixed(1)}" width="8" height="${h.toFixed(1)}" rx="4" fill="${color}" fill-opacity="${a(0.18 + (h / 320) * 0.5)}"/>`);
    }
  } else {
    const s = R() * 6;
    for (let k = 0; k < 20; k++) {
      let d = '';
      for (let x = 480; x <= W; x += 12) {
        const y = 40 + k * 29 + Math.sin(x * 0.009 + s + k * 0.32) * (18 + k * 2.2);
        d += (x === 480 ? 'M' : 'L') + x + ' ' + y.toFixed(1);
      }
      const hot = k % 5 === 2;
      out.push(`<path d="${d}" fill="none" stroke="${color}" stroke-opacity="${a(hot ? 0.85 : 0.28)}" stroke-width="${hot ? 3 : 1.4}"/>`);
    }
  }
  return out.join('');
}

/**
 * Grid (+ pattern) as a standalone SVG. The CSS in the design masked these with gradients:
 *  - grid: radial, opaque near the top-right corner, gone by 70% of the ellipse
 *  - pattern: horizontal ramp 30%→72% of the width, intersected with a vertical fade 72%→86%
 */
function backgroundSvg(pattern: { kind: PatternKind; id: string; color: string; strength: number } | null): string {
  const grid: string[] = [];
  for (let x = 0; x < W; x += 56) grid.push(`M${x + 0.5} 0V${H}`);
  for (let y = 0; y < H; y += 56) grid.push(`M0 ${y + 0.5}H${W}`);

  const fade = (id: string, gradient: string) =>
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#${gradient})"/></mask>`;
  const stops = (...s: [number, number][]) =>
    s.map(([o, a]) => `<stop offset="${o}" stop-color="#fff" stop-opacity="${a}"/>`).join('');

  const defs =
    `<radialGradient id="gr" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(${W} 0) scale(${W * 0.75} ${H * 0.9})">${stops([0, 1], [0.1, 1], [0.7, 0], [1, 0])}</radialGradient>` +
    `<linearGradient id="gx" gradientUnits="userSpaceOnUse" x1="${W * 0.3}" y1="0" x2="${W * 0.72}" y2="0">${stops([0, 0], [1, 1])}</linearGradient>` +
    `<linearGradient id="gy" gradientUnits="userSpaceOnUse" x1="0" y1="${H * 0.72}" x2="0" y2="${H * 0.86}">${stops([0, 1], [1, 0])}</linearGradient>` +
    fade('mg', 'gr') + fade('mx', 'gx') + fade('my', 'gy');

  const body =
    `<g mask="url(#mg)"><path d="${grid.join('')}" stroke="rgba(0,102,204,0.07)" stroke-width="1" fill="none"/></g>` +
    (pattern
      ? `<g mask="url(#mx)"><g mask="url(#my)">${patternSvg(pattern.kind, pattern.id, pattern.color, pattern.strength)}</g></g>`
      : '');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${body}</svg>`;
}

// ─── Text sizing (from the design's per-length tables) ────────────────────────────────────────
function titleSize(type: CardType, len: number, hasPattern: boolean): number {
  if (type === 'section') {
    if (hasPattern) return len < 10 ? 112 : len < 14 ? 92 : len < 18 ? 76 : 64;
    return len < 16 ? 120 : len < 26 ? 96 : 80;
  }
  return len < 34 ? 76 : len < 52 ? 66 : len < 72 ? 58 : 50;
}

function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/** Geist Mono advance is 0.6em; the pill is max 620px wide with 12px padding + 1px border each side. */
function fitPath(text: string, fontSize: number, maxWidth: number): string {
  const maxChars = Math.floor((maxWidth - 26) / (fontSize * 0.6));
  return text.length <= maxChars ? text : text.slice(0, maxChars - 1) + '…';
}

// ─── The card ─────────────────────────────────────────────────────────────────────────────────
export function buildCard(props: CardProps): React.ReactElement {
  const accent = ACCENT[props.type];
  const isPage = props.type === 'home' || props.type === 'section';
  const hasPattern = isPage && !!props.pattern;
  const ghost = !hasPattern ? props.ghost ?? '' : '';
  const tags = props.tags ?? [];
  const hasTags = tags.length > 0;
  const hasSub = !!props.subtitle && !hasTags;
  const narrow = hasPattern; // pattern pages keep text clear of the artwork

  const bg = `data:image/svg+xml;base64,${Buffer.from(
    backgroundSvg(hasPattern ? { kind: props.pattern!, id: props.id, color: accent, strength: 1 } : null),
  ).toString('base64')}`;

  const size = titleSize(props.type, props.title.length, hasPattern);
  // Satori breaks `textWrap: balance` when it is combined with `lineClamp` (the title collapses into a
  // narrow column and gets cut). So balance titles that fit in 3 lines (~0.52em per character), and
  // let only the very long ones fall back to a plain 3-line clamp with an ellipsis.
  const charsPerLine = (narrow ? 760 : 1000) / (size * 0.52);
  const balance = props.title.length <= charsPerLine * 2.2;

  const ghostSize = ghost.length <= 1 ? 560 : ghost.length <= 2 ? 440 : 340;
  const mono = 'Geist Mono';

  return (
    <div
      style={{
        width: `${W}px`,
        height: `${H}px`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        padding: '60px 72px',
        background: CANVAS,
        color: INK,
        fontFamily: 'Geist',
      }}
    >
      <img alt="" src={bg} width={W} height={H} style={{ position: 'absolute', left: '0px', top: '0px', width: `${W}px`, height: `${H}px` }} />

      {ghost ? (
        <div
          style={{
            position: 'absolute',
            right: '-24px',
            bottom: '-110px',
            display: 'flex',
            fontFamily: mono,
            fontWeight: 700,
            fontSize: `${ghostSize}px`,
            lineHeight: 1,
            letterSpacing: '-0.06em',
            color: withAlpha(accent, 0.08),
            whiteSpace: 'nowrap',
          }}
        >
          {ghost}
        </div>
      ) : null}

      <div style={{ position: 'absolute', left: '0px', top: '0px', width: `${W}px`, height: '6px', background: accent }} />

      {/* Header: logo + wordmark, path pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: INK,
              color: '#FAFAF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '24px',
            }}
          >
            R
          </div>
          <div style={{ display: 'flex', fontSize: '26px', fontWeight: 600, letterSpacing: '-0.02em' }}>
            <div>Ratn</div>
            <div style={{ color: SOFT }}>Labs</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: mono,
            fontSize: '19px',
            color: MUTED,
            whiteSpace: 'nowrap',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.78)',
            border: '1px solid rgba(0,0,0,0.07)',
          }}
        >
          {fitPath(SITE_HOST + props.path, 19, 620)}
        </div>
      </div>

      {/* Body: chip, title, subtitle or tags */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          minHeight: 0,
          padding: '20px 0',
          gap: '22px',
          maxWidth: `${narrow ? 760 : 1000}px`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: mono,
            fontSize: '20px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: accent,
          }}
        >
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: accent }} />
          <div style={{ display: 'flex' }}>{props.chip}</div>
        </div>
        <div
          style={{
            display: 'block',
            fontSize: `${size}px`,
            fontWeight: TITLE_WEIGHT,
            lineHeight: 1.06,
            letterSpacing: '-0.035em',
            wordBreak: 'break-word',
            ...(balance ? { textWrap: 'balance' } : { lineClamp: 3 }),
          }}
        >
          {props.title}
        </div>
        {hasSub ? (
          <div
            style={{
              display: 'block',
              fontSize: `${hasPattern ? 24 : 28}px`,
              lineHeight: 1.35,
              color: MUTED,
              maxWidth: '860px',
              lineClamp: 2,
            }}
          >
            {props.subtitle}
          </div>
        ) : null}
        {hasTags ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {tags.map((tag, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  fontFamily: mono,
                  fontSize: '19px',
                  color: '#3A3A38',
                  padding: '8px 16px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '8px',
                  background: '#FFFFFF',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Footer: author, meta */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          paddingTop: '26px',
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img alt="" src={AVATAR} width={40} height={40} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div style={{ display: 'flex', fontSize: '22px', fontWeight: 500 }}>Ratnesh Maurya</div>
          <div style={{ display: 'flex', fontSize: '22px', color: SOFT }}>· Systems, Backend &amp; AI</div>
        </div>
        <div style={{ display: 'flex', fontFamily: mono, fontSize: '20px', color: MUTED, whiteSpace: 'nowrap' }}>
          {props.meta ?? ''}
        </div>
      </div>
    </div>
  );
}
