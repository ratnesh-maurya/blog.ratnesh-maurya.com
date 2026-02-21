import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';
import { getCheatsheet } from '@/lib/static-content';

export const alt = 'Cheatsheet — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getCheatsheet(slug);
  const title = data?.title?.split(' — ')[0] ?? slug;
  const subtitle = data?.subtitle ?? data?.description ?? 'Quick reference';
  return buildOgImage({
    title,
    subtitle,
    breadcrumb: 'Cheatsheets',
  });
}
