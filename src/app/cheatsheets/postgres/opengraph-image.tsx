import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'PostgreSQL Cheatsheet — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'PostgreSQL Cheatsheet',
    subtitle: 'Queries, indexes, JSONB, admin commands.',
    breadcrumb: 'Cheatsheets',
  });
}
