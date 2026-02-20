import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Silly Questions & Mistakes — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'Silly Questions & Mistakes',
    subtitle: "We all make silly mistakes while coding. Here are some of mine.",
    breadcrumb: 'Silly Questions',
  });
}
