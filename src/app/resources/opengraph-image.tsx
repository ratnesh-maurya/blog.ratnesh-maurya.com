import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Resources — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Resources',
    subtitle: 'Curated books, talks, tools, and newsletters for backend engineers.',
    breadcrumb: 'Resources',
  });
}
