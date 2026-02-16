import { MetadataRoute } from 'next';
import { getAllBlogPosts, getAllSillyQuestions } from '@/lib/content';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.ratnesh-maurya.com';
  
  const [blogPosts, sillyQuestions] = await Promise.all([
    getAllBlogPosts(),
    getAllSillyQuestions()
  ]);

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const questionUrls = sillyQuestions.map((question) => ({
    url: `${baseUrl}/silly-questions/${question.slug}`,
    lastModified: new Date(question.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Tag index pages for blog posts: /blog/tag/{tag-slug}
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

  const tagUrls = Array.from(tagLatestDate.entries()).map(([tag, latestDate]) => {
    const slug = encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, '-'));
    return {
      url: `${baseUrl}/blog/tag/${slug}`,
      lastModified: new Date(latestDate),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    };
  });

  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/silly-questions`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...tagUrls,
    ...blogUrls,
    ...questionUrls,
  ];
}

