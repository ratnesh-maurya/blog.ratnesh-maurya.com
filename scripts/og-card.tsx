/* eslint-disable @next/next/no-img-element -- satori renders these <img> tags; next/image does not apply */
/**
 * The OG card: 1200×630, warm paper, one design for every page type. Mirrors the Open Graph image
 * on ratneshmaurya.com (the "Ledger" design): a mono header row over a hairline rule, a large
 * Instrument Serif title whose last word on short titles is the italic marigold→kumkum gradient,
 * a faint Devanagari watermark (रत्न) top-right, and a footer with the subtitle/tags and the
 * blog address next to a gradient dot.
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
 * Satori does not shape Devanagari conjuncts (रत्न would render as र त ् न), so the watermark is a
 * PNG rendered once by a browser from Tiro Devanagari Hindi in the paper "water" colour.
 */
const WATERMARK = `data:image/png;base64,${fs.readFileSync(path.join(__dirname, 'og-assets', 'ratn-watermark.png')).toString('base64')}`;

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
  const raw = (file: string) => fs.readFileSync(path.join(fontDir, file));
  return [
    // Geist keeps the kerning workaround; the serif, mono and Devanagari faces need their GPOS.
    { name: 'Geist', data: withoutKerning(raw('geist-400.woff')), weight: 400 as const, style: 'normal' as const },
    { name: 'Geist', data: withoutKerning(raw('geist-500.ttf')), weight: 500 as const, style: 'normal' as const },
    { name: 'Instrument Serif', data: raw('instrument-serif-400.ttf'), weight: 400 as const, style: 'normal' as const },
    { name: 'Instrument Serif', data: raw('instrument-serif-400-italic.ttf'), weight: 400 as const, style: 'italic' as const },
    { name: 'JetBrains Mono', data: raw('jetbrains-mono-400.ttf'), weight: 400 as const, style: 'normal' as const },
    { name: 'JetBrains Mono', data: raw('jetbrains-mono-500.ttf'), weight: 500 as const, style: 'normal' as const },
    { name: 'Tiro Devanagari Hindi', data: raw('tiro-devanagari-400.ttf'), weight: 400 as const, style: 'normal' as const },
  ];
}

// ─── Design tokens (Ledger, light theme: matches the portfolio OG image) ───────────────────────
const W = 1200;
const H = 630;
const PAPER = '#FBFAF7';
const INK = '#17150F';
const BODY = '#4A463E';
const MUTED = '#6B675E';
const LINE = '#E7E3DA';
const TAG_BG = '#F4F1EA';
const SAFFRON = 'linear-gradient(90deg, #FF7A18, #E8336D)';

export type CardType = 'home' | 'section' | 'post' | 'term' | 'sheet' | 'til' | 'news' | 'question';
export type PatternKind = 'dots' | 'network' | 'rings' | 'bars' | 'flow';

export interface CardProps {
  /** Output path without ".png" (e.g. "blog/my-post"). */
  id: string;
  type: CardType;
  /** Route shown after the host in the header, e.g. "/blog/my-post/". */
  path: string;
  /** Mono label, top-right of the header row. */
  chip: string;
  title: string;
  subtitle?: string;
  /** Mono tag chips. Replace the subtitle when present. */
  tags?: string[];
  /** Mono text in the header after the chip (e.g. "12 min read"). */
  meta?: string;
  /** Kept for the build scripts; the Ledger card always uses the Devanagari watermark. */
  ghost?: string;
  /** Kept for the build scripts; the Ledger card has no generative pattern. */
  pattern?: PatternKind;
}

/** Title size by length; short page titles get the poster treatment like the portfolio name. */
function titleSize(type: CardType, len: number): number {
  if (type === 'home' || type === 'section') return len < 10 ? 168 : len < 16 ? 136 : len < 24 ? 112 : 92;
  return len < 30 ? 116 : len < 48 ? 100 : len < 70 ? 84 : 70;
}

function fit(text: string, maxChars: number): string {
  return text.length <= maxChars ? text : text.slice(0, maxChars - 1) + '…';
}

// ─── The card ─────────────────────────────────────────────────────────────────────────────────
export function buildCard(props: CardProps): React.ReactElement {
  const isPage = props.type === 'home' || props.type === 'section';
  const tags = props.tags ?? [];
  const hasTags = tags.length > 0;
  const hasSub = !!props.subtitle && !hasTags;
  const size = titleSize(props.type, props.title.length);

  // Short page titles: last word is the italic gradient word (e.g. "Ratn *Labs*", "The *blog*").
  const words = props.title.trim().split(/\s+/);
  const splitLast = isPage && words.length >= 1 && props.title.length <= 24;
  const lead = splitLast ? words.slice(0, -1).join(' ') : props.title;
  const last = splitLast ? words[words.length - 1] : '';

  const mono = 'JetBrains Mono';
  const header = fit((SITE_HOST + props.path).toUpperCase(), 44);
  const right = [props.chip, props.meta].filter(Boolean).join(' · ').toUpperCase();

  return (
    <div
      style={{
        width: `${W}px`,
        height: `${H}px`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        padding: '56px 64px 64px',
        background: PAPER,
        color: INK,
        fontFamily: 'Geist',
      }}
    >
      {/* Devanagari watermark, top-right, like नमस्ते on the portfolio card */}
      <img
        alt=""
        src={WATERMARK}
        width={560}
        height={333}
        style={{ position: 'absolute', right: '-30px', top: '-70px', width: '560px', height: '333px' }}
      />

      {/* Header row: address left, chip right, over a 1px ink rule */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '32px',
          paddingBottom: '18px',
          borderBottom: `2px solid ${INK}`,
          fontFamily: mono,
          fontSize: '19px',
          letterSpacing: '0.08em',
          color: MUTED,
        }}
      >
        <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>{header}</div>
        <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>{fit(right, 30)}</div>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minHeight: 0 }}>
        {splitLast ? (
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Instrument Serif', fontSize: `${size}px`, lineHeight: 0.92, letterSpacing: '-0.03em' }}>
            {lead ? <div style={{ display: 'flex' }}>{lead}</div> : null}
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                fontStyle: 'italic',
                backgroundImage: SAFFRON,
                backgroundClip: 'text',
                color: 'transparent',
                paddingRight: '0.08em',
                paddingBottom: '0.08em',
              }}
            >
              {last}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'block',
              fontFamily: 'Instrument Serif',
              fontSize: `${size}px`,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              maxWidth: '1000px',
              lineClamp: 3,
              wordBreak: 'break-word',
            }}
          >
            {props.title}
          </div>
        )}
      </div>

      {/* Footer: subtitle or tags left, address with a gradient dot right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px' }}>
        {hasTags ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', maxWidth: '760px' }}>
            {tags.slice(0, 4).map((tag, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  fontFamily: mono,
                  fontSize: '19px',
                  color: BODY,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: TAG_BG,
                  border: `1px solid ${LINE}`,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        ) : hasSub ? (
          <div style={{ display: 'block', fontSize: '25px', lineHeight: 1.35, color: INK, maxWidth: '740px', lineClamp: 2 }}>
            {props.subtitle}
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: '25px', color: INK }}>Ratnesh Maurya · Systems, Backend &amp; AI</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', whiteSpace: 'nowrap' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundImage: SAFFRON }} />
          <div style={{ display: 'flex', fontFamily: 'Instrument Serif', fontSize: '34px', color: INK }}>{SITE_HOST}</div>
        </div>
      </div>
    </div>
  );
}
