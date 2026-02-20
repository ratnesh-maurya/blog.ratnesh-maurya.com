import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Tag — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

function decodeTag(rawTag: string): string {
  const decoded = decodeURIComponent(rawTag);
  return decoded
    .replace(/-/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function Image({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const tagLabel = decodeTag(tag);
  return buildOgImage({
    title: `Tag: ${tagLabel}`,
    subtitle: `Browse blog posts tagged "${tagLabel}".`,
    breadcrumb: 'Blog',
  });
}
