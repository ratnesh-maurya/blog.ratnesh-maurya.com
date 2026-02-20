import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Privacy Policy — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Privacy Policy',
    subtitle: 'How we collect, use, and protect your information.',
    breadcrumb: 'Privacy',
  });
}
