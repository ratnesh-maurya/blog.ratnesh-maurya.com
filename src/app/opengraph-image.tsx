import { ImageResponse } from 'next/og';
import { OG_SIZE } from '@/lib/og-image';

export const alt = 'Ratn Labs — Systems, Backend & AI Engineering';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const runtime = 'edge';

/** OPENGRAPH-SETUP §4 — Root OG image (custom layout). documentation.md theme. */
export default async function Image() {
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
          background: 'linear-gradient(135deg, #030d0e 0%, #060f20 50%, #030d0e 100%)',
          padding: '64px',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(20,184,166,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -60%)',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '55%',
            right: '10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(20,184,166,0.1)',
              border: '1px solid rgba(20,184,166,0.25)',
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
                background: '#14b8a6',
              }}
            />
            <span style={{ color: '#2dd4bf', fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>
              Ratnesh Maurya
            </span>
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.0,
              background: 'linear-gradient(135deg, #f0fdfa 0%, #2dd4bf 45%, #14b8a6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Ratn Labs
          </div>
          <div style={{ fontSize: 28, color: '#94a3b8', fontWeight: 500 }}>
            Systems, Backend & AI Engineering
          </div>
          <div style={{ fontSize: 18, color: '#334155', marginTop: 8 }}>
            blog.ratnesh-maurya.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
