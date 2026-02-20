import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Newsletter — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Newsletter',
    subtitle: 'Get new articles on system design, Go, and backend engineering in your inbox.',
    breadcrumb: 'Newsletter',
  });
}
