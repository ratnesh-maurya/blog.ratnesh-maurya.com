import { ImageResponse } from 'next/og';
import type { OgOptions } from '@/lib/og';

/** documentation.md §2.1 — Deep navy, teal primary, indigo secondary (bluish portfolio theme) */
const BRAND = {
  bgStart: '#030d0e',
  bgMid: '#060f20',
  bgEnd: '#030d0e',
  accent: '#14b8a6',
  accentLight: '#2dd4bf',
  indigo: '#6366f1',
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

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function buildOgImage({
  title,
  subtitle,
  breadcrumb,
  accent = BRAND.accent,
}: OgOptions) {
  return new ImageResponse(
    (
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 16,
              color: BRAND.textLow,
            }}
          >
            <span>blog.ratnesh-maurya.com</span>
            {breadcrumb && (
              <>
                <span style={{ color: BRAND.separator }}>›</span>
                <span style={{ color: accent }}>{breadcrumb}</span>
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
          <div
            style={{
              fontSize: 26,
              color: BRAND.textMuted,
              fontWeight: 400,
              marginTop: 4,
            }}
          >
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
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: accent,
              }}
            />
            <span style={{ color: BRAND.accentLight, fontSize: 14, fontWeight: 600 }}>
              Ratnesh Maurya
            </span>
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
