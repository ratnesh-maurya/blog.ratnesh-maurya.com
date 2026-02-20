import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';
import { getSillyQuestion } from '@/lib/content';

export const alt = 'Silly Question — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = await getSillyQuestion(slug);
  if (!question) {
    return buildOgImage({
      title: 'Question Not Found',
      subtitle: 'Ratn Labs',
      breadcrumb: 'Silly Questions',
    });
  }
  return buildOgImage({
    title: question.question,
    subtitle: `Silly Questions · ${question.category}`,
    breadcrumb: 'Silly Questions',
  });
}
