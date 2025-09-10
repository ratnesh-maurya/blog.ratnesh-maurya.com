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
    url: `${baseUrl}/blog/${post.slug}`
  }));

  const questionUrls = sillyQuestions.map((question) => ({
    url: `${baseUrl}/silly-questions/${question.slug}`
  }));

  return [
    {
      url: baseUrl

    },
    {
        url: `${baseUrl}/blog`
    },
    {
      url: `${baseUrl}/silly-questions`
    },
    ...blogUrls,
    ...questionUrls,
  ];
}
