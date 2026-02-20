import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Uses — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Uses',
    subtitle: 'The tools, software, and hardware I use daily as a backend engineer.',
    breadcrumb: 'Uses',
  });
}
