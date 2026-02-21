import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Technical Terms — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Technical Terms',
    subtitle: 'Definitions for indexing, clustering, CAP, ACID, replication, and backend concepts.',
    breadcrumb: 'Technical Terms',
  });
}
