import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';
import { getBlogPost } from '@/lib/content';

export const alt = 'Blog post — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return buildOgImage({
      title: 'Post Not Found',
      subtitle: 'Ratn Labs',
      breadcrumb: 'Blog',
    });
  }
  return buildOgImage({
    title: post.title,
    subtitle: post.description ?? 'Ratn Labs',
    breadcrumb: 'Blog',
  });
}
