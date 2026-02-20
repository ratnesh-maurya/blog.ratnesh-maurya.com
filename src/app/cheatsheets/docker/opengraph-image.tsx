import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Docker Cheatsheet — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Docker Cheatsheet',
    subtitle: 'Dockerfile, build, run, compose, volumes, networks.',
    breadcrumb: 'Cheatsheets',
  });
}
