import { MetadataRoute } from 'next';
import { getAllBlogPosts, getAllSillyQuestions, getAllTILEntries, getTechnicalTermSlugs } from '@/lib/content';
import { getStoredOgImageUrl } from '@/lib/og';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.ratnesh-maurya.com';

  const [blogPosts, sillyQuestions, tilEntries] = await Promise.all([
    getAllBlogPosts(),
    getAllSillyQuestions(),
    getAllTILEntries(),
  ]);

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    images: [getStoredOgImageUrl('blog-slug', post.slug)],
  }));

  const questionUrls = sillyQuestions.map((question) => ({
    url: `${baseUrl}/silly-questions/${question.slug}`,
    lastModified: new Date(question.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    images: [getStoredOgImageUrl('silly-question', question.slug)],
  }));

  const tagLatestDate = new Map<string, string>();
  for (const post of blogPosts) {
    if (!post.tags || post.tags.length === 0) continue;
    for (const tag of post.tags) {
      const existing = tagLatestDate.get(tag);
      if (!existing || new Date(post.date) > new Date(existing)) {
        tagLatestDate.set(tag, post.date);
      }
    }
  }

  const tagSlug = (tag: string) =>
    encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, '-'));
  const tagUrls = Array.from(tagLatestDate.entries()).map(([tag, latestDate]) => ({
    url: `${baseUrl}/blog/tag/${tagSlug(tag)}`,
    lastModified: new Date(latestDate),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
    images: [getStoredOgImageUrl('blog-tag', undefined, tag)],
  }));

  const now = new Date();

  const staticWithOg: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1, images: [getStoredOgImageUrl('home')] },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9, images: [getStoredOgImageUrl('blog')] },
    { url: `${baseUrl}/silly-questions`, lastModified: now, changeFrequency: 'weekly', priority: 0.8, images: [getStoredOgImageUrl('silly-questions')] },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8, images: [getStoredOgImageUrl('about')] },
    { url: `${baseUrl}/topics`, lastModified: now, changeFrequency: 'weekly', priority: 0.85, images: [getStoredOgImageUrl('topics')] },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.7, images: [getStoredOgImageUrl('search')] },
    { url: `${baseUrl}/uses`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, images: [getStoredOgImageUrl('uses')] },
    { url: `${baseUrl}/newsletter`, lastModified: now, changeFrequency: 'monthly', priority: 0.65, images: [getStoredOgImageUrl('newsletter')] },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3, images: [getStoredOgImageUrl('privacy-policy')] },
    { url: `${baseUrl}/til`, lastModified: now, changeFrequency: 'weekly', priority: 0.85, images: [getStoredOgImageUrl('til')] },
    { url: `${baseUrl}/glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.8, images: [getStoredOgImageUrl('glossary')] },
    { url: `${baseUrl}/cheatsheets`, lastModified: now, changeFrequency: 'monthly', priority: 0.8, images: [getStoredOgImageUrl('cheatsheets')] },
    { url: `${baseUrl}/cheatsheets/go`, lastModified: now, changeFrequency: 'monthly', priority: 0.75, images: [getStoredOgImageUrl('cheatsheet', 'go')] },
    { url: `${baseUrl}/cheatsheets/docker`, lastModified: now, changeFrequency: 'monthly', priority: 0.75, images: [getStoredOgImageUrl('cheatsheet', 'docker')] },
    { url: `${baseUrl}/cheatsheets/postgres`, lastModified: now, changeFrequency: 'monthly', priority: 0.75, images: [getStoredOgImageUrl('cheatsheet', 'postgres')] },
    { url: `${baseUrl}/cheatsheets/kubectl`, lastModified: now, changeFrequency: 'monthly', priority: 0.75, images: [getStoredOgImageUrl('cheatsheet', 'kubectl')] },
    { url: `${baseUrl}/resources`, lastModified: now, changeFrequency: 'monthly', priority: 0.7, images: [getStoredOgImageUrl('resources')] },
    { url: `${baseUrl}/series`, lastModified: now, changeFrequency: 'weekly', priority: 0.75, images: [getStoredOgImageUrl('series')] },
    { url: `${baseUrl}/technical-terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.8, images: [getStoredOgImageUrl('technical-terms')] },
    { url: `${baseUrl}/now`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, images: [getStoredOgImageUrl('now')] },
  ];

  const tilUrls = tilEntries.map((e) => ({
    url: `${baseUrl}/til/${e.slug}`,
    lastModified: new Date(e.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    images: [getStoredOgImageUrl('til-slug', e.slug)],
  }));

  const technicalTermSlugs = getTechnicalTermSlugs();
  const technicalTermUrls = technicalTermSlugs.map((slug) => ({
    url: `${baseUrl}/technical-terms/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
    images: [getStoredOgImageUrl('technical-term', slug)],
  }));

  return [...staticWithOg, ...tilUrls, ...technicalTermUrls, ...tagUrls, ...blogUrls, ...questionUrls];
}
