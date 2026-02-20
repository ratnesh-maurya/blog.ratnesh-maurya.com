import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Blog — Ratn Labs by Ratnesh Maurya';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Blog',
    subtitle: 'Explore posts on systems, backend, and AI engineering.',
    breadcrumb: 'Blog',
  });
}
