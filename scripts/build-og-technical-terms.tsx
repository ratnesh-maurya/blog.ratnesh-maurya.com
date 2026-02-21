/**
 * Generate OG images for technical terms at build time (no server).
 * Runs automatically in postbuild. Uses @vercel/og so no Next server is needed.
 */
import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'technical-terms');
const outDir = path.join(rootDir, 'public', 'technical-terms');

const BRAND = {
  bgStart: '#030d0e',
  bgMid: '#060f20',
  bgEnd: '#030d0e',
  accent: '#14b8a6',
  accentLight: '#2dd4bf',
  textPrimary: '#f0fdfa',
  textMid: '#94a3b8',
  textMuted: '#64748b',
  textLow: '#475569',
  separator: '#334155',
  dotColor: 'rgba(20,184,166,0.15)',
  dotOpacity: 0.4,
  glowColor: 'rgba(20,184,166,0.12)',
  glowIndigo: 'rgba(99,102,241,0.1)',
  badgeBg: 'rgba(20,184,166,0.1)',
  badgeBorder: 'rgba(20,184,166,0.25)',
} as const;

function sanitize(text: string, maxLen: number): string {
  const t = text.replace(/^["']|["']$/g, '').trim();
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen - 1).trim() + '…';
}

function buildOgElement(title: string, subtitle: string): React.ReactElement {
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
          <span style={{ color: BRAND.separator }}>›</span>
          <span style={{ color: BRAND.accent }}>Technical Terms</span>
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
        <div style={{ fontSize: 26, color: BRAND.textMuted, fontWeight: 400, marginTop: 4 }}>
          {subtitle}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            background: BRAND.badgeBg,
            border: `1px solid ${BRAND.badgeBorder}`,
            borderRadius: 100,
            padding: '6px 16px',
            alignSelf: 'flex-start',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.accent }} />
          <span style={{ color: BRAND.accentLight, fontSize: 14, fontWeight: 600 }}>Ratnesh Maurya</span>
        </div>
      </div>
    </div>
  );
}

async function main() {
  if (!fs.existsSync(contentDir)) {
    console.log('No content/technical-terms. Skipping OG generation.');
    return;
  }

  const files = fs.readdirSync(contentDir).filter((n) => n.endsWith('.md'));
  if (files.length === 0) {
    console.log('No technical term .md files. Skipping OG generation.');
    return;
  }

  const { ImageResponse } = await import('@vercel/og');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  let ok = 0;
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    try {
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
      const { data } = matter(raw);
      const title = sanitize(String(data?.title ?? slug), 80);
      const description = sanitize(String(data?.description ?? 'Technical term definition'), 120);
      const res = new ImageResponse(buildOgElement(title, description), { width: 1200, height: 630 });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(path.join(outDir, `${slug}.png`), Buffer.from(buf));
      ok++;
      process.stdout.write('.');
    } catch (e) {
      console.error(`\n${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }
  console.log(`\nOG images: ${ok}/${files.length} written to public/technical-terms/`);
}

main().catch((e) => {
  console.error('build-og-technical-terms failed:', e);
  process.exit(1);
});
