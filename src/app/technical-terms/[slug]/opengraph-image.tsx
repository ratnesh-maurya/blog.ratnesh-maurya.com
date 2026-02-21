import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';
import { getTechnicalTerm } from '@/lib/content';

export const alt = 'Technical Term — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

function sanitizeForOg(text: string, maxLen: number): string {
  const trimmed = text.replace(/^["']|["']$/g, '').trim();
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.slice(0, maxLen - 1).trim() + '…';
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = await getTechnicalTerm(slug);
  const title = sanitizeForOg(term?.title ?? slug, 80);
  const subtitle = sanitizeForOg(term?.description ?? 'Technical term definition', 120);
  return buildOgImage({
    title,
    subtitle,
    breadcrumb: 'Technical Terms',
  });
}
