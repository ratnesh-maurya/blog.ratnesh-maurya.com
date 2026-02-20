import { MetadataRoute } from 'next';
import { getAllBlogPosts, getAllSillyQuestions, getAllTILEntries } from '@/lib/content';

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
    images: [`${baseUrl}/blog/${post.slug}/opengraph-image`],
  }));

  const questionUrls = sillyQuestions.map((question) => ({
    url: `${baseUrl}/silly-questions/${question.slug}`,
    lastModified: new Date(question.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    images: [`${baseUrl}/silly-questions/${question.slug}/opengraph-image`],
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
    images: [`${baseUrl}/blog/tag/${tagSlug(tag)}/opengraph-image`],
  }));

  const now = new Date();

  const staticWithOg: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      images: [`${baseUrl}/opengraph-image`],
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [`${baseUrl}/blog/opengraph-image`],
    },
    {
      url: `${baseUrl}/silly-questions`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      images: [`${baseUrl}/silly-questions/opengraph-image`],
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${baseUrl}/about/opengraph-image`],
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
      images: [`${baseUrl}/topics/opengraph-image`],
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
      images: [`${baseUrl}/search/opengraph-image`],
    },
    {
      url: `${baseUrl}/uses`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: [`${baseUrl}/uses/opengraph-image`],
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
      images: [`${baseUrl}/newsletter/opengraph-image`],
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
      images: [`${baseUrl}/privacy-policy/opengraph-image`],
    },
    {
      url: `${baseUrl}/til`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
      images: [`${baseUrl}/til/opengraph-image`],
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${baseUrl}/glossary/opengraph-image`],
    },
    {
      url: `${baseUrl}/cheatsheets`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${baseUrl}/cheatsheets/opengraph-image`],
    },
    {
      url: `${baseUrl}/cheatsheets/go`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
      images: [`${baseUrl}/cheatsheets/go/opengraph-image`],
    },
    {
      url: `${baseUrl}/cheatsheets/docker`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
      images: [`${baseUrl}/cheatsheets/docker/opengraph-image`],
    },
    {
      url: `${baseUrl}/cheatsheets/postgres`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
      images: [`${baseUrl}/cheatsheets/postgres/opengraph-image`],
    },
    {
      url: `${baseUrl}/cheatsheets/kubectl`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
      images: [`${baseUrl}/cheatsheets/kubectl/opengraph-image`],
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      images: [`${baseUrl}/resources/opengraph-image`],
    },
    {
      url: `${baseUrl}/series`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
      images: [`${baseUrl}/series/opengraph-image`],
    },
    {
      url: `${baseUrl}/now`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: [`${baseUrl}/now/opengraph-image`],
    },
  ];

  const tilUrls = tilEntries.map((e) => ({
    url: `${baseUrl}/til/${e.slug}`,
    lastModified: new Date(e.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    images: [`${baseUrl}/til/${e.slug}/opengraph-image`],
  }));

  return [...staticWithOg, ...tilUrls, ...tagUrls, ...blogUrls, ...questionUrls];
}
