import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Series — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Series',
    subtitle: 'Grouped reading paths for backend engineering — system design, AWS, Go.',
    breadcrumb: 'Series',
  });
}
