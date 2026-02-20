import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Go Cheatsheet — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Go Cheatsheet',
    subtitle: 'Syntax, goroutines, channels, interfaces, error handling.',
    breadcrumb: 'Cheatsheets',
  });
}
