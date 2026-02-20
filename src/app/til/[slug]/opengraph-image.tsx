import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';
import { getTILEntry } from '@/lib/content';

export const alt = 'TIL — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getTILEntry(slug);
  if (!entry) {
    return buildOgImage({
      title: 'TIL Not Found',
      subtitle: 'Ratn Labs',
      breadcrumb: 'TIL',
    });
  }
  return buildOgImage({
    title: entry.title,
    subtitle: `TIL · ${entry.category}`,
    breadcrumb: 'TIL',
  });
}
