import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Cheatsheets — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Cheatsheets',
    subtitle: 'Quick reference for Go, Docker, PostgreSQL, and Kubernetes.',
    breadcrumb: 'Cheatsheets',
  });
}
