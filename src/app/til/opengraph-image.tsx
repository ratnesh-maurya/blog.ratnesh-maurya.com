import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Today I Learned — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Today I Learned',
    subtitle: 'Short, practical learnings from real engineering work.',
    breadcrumb: 'TIL',
  });
}
