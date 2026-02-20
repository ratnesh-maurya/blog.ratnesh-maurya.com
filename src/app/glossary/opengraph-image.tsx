import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Glossary — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Glossary',
    subtitle: 'Clear definitions for backend, system design, and distributed systems terms.',
    breadcrumb: 'Glossary',
  });
}
