import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'About — Ratnesh Maurya';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'About',
    subtitle: 'Backend engineer specialising in system design, distributed systems, and scalable architecture.',
    breadcrumb: 'About',
  });
}
