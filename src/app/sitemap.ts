import { execSync } from 'child_process';
import { statSync } from 'fs';
import path from 'path';
import { getAllBlogPosts, getAllNewsPosts, getAllSillyQuestions, getAllTILEntries, getTechnicalTermSlugs } from '@/lib/content';
import { getStoredOgImageUrl } from '@/lib/og';
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/** Return the last git commit date for a file/dir, falling back to fs.statSync mtime. */
function gitMtime(relPath: string): Date {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${relPath}"`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (iso) return new Date(iso);
  } catch {}
  try {
    return statSync(path.join(process.cwd(), relPath)).mtime;
  } catch {}
  return new Date('2024-01-01');
}

function maxDate(dates: (string | Date | undefined)[]): Date {
  const ms = dates
    .filter(Boolean)
    .map(d => new Date(d as string | Date).getTime())
    .filter(n => !isNaN(n));
  return ms.length ? new Date(Math.max(...ms)) : new Date('2024-01-01');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.ratnesh-maurya.com';

  const [blogPosts, newsPosts, sillyQuestions, tilEntries] = await Promise.all([
    getAllBlogPosts(),
    getAllNewsPosts(),
    getAllSillyQuestions(),
    getAllTILEntries(),
  ]);

  const newsUrls = newsPosts.map((post) => ({
    url: `${baseUrl}/news/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'daily' as const,
    priority: 0.85,
    images: [post.image || getStoredOgImageUrl('home')],
  }));

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.updated || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    images: [getStoredOgImageUrl('blog-slug', post.slug)],
  }));

  const questionUrls = sillyQuestions.map((question) => ({
    url: `${baseUrl}/silly-questions/${question.slug}/`,
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
    url: `${baseUrl}/blog/tag/${tagSlug(tag)}/`,
    lastModified: new Date(latestDate),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
    images: [getStoredOgImageUrl('blog-tag', undefined, tag)],
  }));

  const latestBlog = maxDate(blogPosts.map(p => p.updated || p.date));
  const latestNews = maxDate(newsPosts.map(p => p.date));
  const latestSilly = maxDate(sillyQuestions.map(p => p.date));
  const latestTil = maxDate(tilEntries.map(e => e.date));

  const staticWithOg: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: maxDate([latestBlog, latestNews]), changeFrequency: 'weekly', priority: 1, images: [getStoredOgImageUrl('home')] },
    { url: `${baseUrl}/blog/`, lastModified: latestBlog, changeFrequency: 'weekly', priority: 0.9, images: [getStoredOgImageUrl('blog')] },
    { url: `${baseUrl}/news/`, lastModified: latestNews, changeFrequency: 'daily', priority: 0.9, images: [getStoredOgImageUrl('home')] },
    { url: `${baseUrl}/silly-questions/`, lastModified: latestSilly, changeFrequency: 'weekly', priority: 0.8, images: [getStoredOgImageUrl('silly-questions')] },
    { url: `${baseUrl}/about/`, lastModified: gitMtime('src/app/about/page.tsx'), changeFrequency: 'monthly', priority: 0.8, images: [getStoredOgImageUrl('about')] },
    { url: `${baseUrl}/topics/`, lastModified: latestBlog, changeFrequency: 'weekly', priority: 0.85, images: [getStoredOgImageUrl('topics')] },
    { url: `${baseUrl}/search/`, lastModified: gitMtime('src/app/search/page.tsx'), changeFrequency: 'weekly', priority: 0.7, images: [getStoredOgImageUrl('search')] },
    { url: `${baseUrl}/newsletter/`, lastModified: gitMtime('src/app/newsletter/page.tsx'), changeFrequency: 'monthly', priority: 0.65, images: [getStoredOgImageUrl('newsletter')] },
    { url: `${baseUrl}/privacy-policy/`, lastModified: gitMtime('src/app/privacy-policy/page.tsx'), changeFrequency: 'yearly', priority: 0.3, images: [getStoredOgImageUrl('privacy-policy')] },
    { url: `${baseUrl}/til/`, lastModified: latestTil, changeFrequency: 'weekly', priority: 0.85, images: [getStoredOgImageUrl('til')] },
    { url: `${baseUrl}/glossary/`, lastModified: gitMtime('src/app/glossary/page.tsx'), changeFrequency: 'monthly', priority: 0.8, images: [getStoredOgImageUrl('glossary')] },
    { url: `${baseUrl}/cheatsheets/`, lastModified: gitMtime('src/app/cheatsheets/page.tsx'), changeFrequency: 'monthly', priority: 0.8, images: [getStoredOgImageUrl('cheatsheets')] },
    { url: `${baseUrl}/cheatsheets/go/`, lastModified: gitMtime('src/app/cheatsheets/go/page.tsx'), changeFrequency: 'monthly', priority: 0.75, images: [getStoredOgImageUrl('cheatsheet', 'go')] },
    { url: `${baseUrl}/cheatsheets/docker/`, lastModified: gitMtime('src/app/cheatsheets/docker/page.tsx'), changeFrequency: 'monthly', priority: 0.75, images: [getStoredOgImageUrl('cheatsheet', 'docker')] },
    { url: `${baseUrl}/cheatsheets/postgres/`, lastModified: gitMtime('src/app/cheatsheets/postgres/page.tsx'), changeFrequency: 'monthly', priority: 0.75, images: [getStoredOgImageUrl('cheatsheet', 'postgres')] },
    { url: `${baseUrl}/cheatsheets/kubectl/`, lastModified: gitMtime('src/app/cheatsheets/kubectl/page.tsx'), changeFrequency: 'monthly', priority: 0.75, images: [getStoredOgImageUrl('cheatsheet', 'kubectl')] },
    { url: `${baseUrl}/resources/`, lastModified: gitMtime('src/app/resources/page.tsx'), changeFrequency: 'monthly', priority: 0.7, images: [getStoredOgImageUrl('resources')] },
    { url: `${baseUrl}/series/`, lastModified: latestBlog, changeFrequency: 'weekly', priority: 0.75, images: [getStoredOgImageUrl('series')] },
    { url: `${baseUrl}/technical-terms/`, lastModified: gitMtime('content/technical-terms'), changeFrequency: 'monthly', priority: 0.8, images: [getStoredOgImageUrl('technical-terms')] },
  ];

  const tilUrls = tilEntries.map((e) => ({
    url: `${baseUrl}/til/${e.slug}/`,
    lastModified: new Date(e.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    images: [getStoredOgImageUrl('til-slug', e.slug)],
  }));

  const technicalTermSlugs = getTechnicalTermSlugs();
  const technicalTermUrls = technicalTermSlugs.map((slug) => ({
    url: `${baseUrl}/technical-terms/${slug}/`,
    lastModified: gitMtime(`content/technical-terms/${slug}.md`),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
    images: [getStoredOgImageUrl('technical-term', slug)],
  }));

  return [...staticWithOg, ...newsUrls, ...tilUrls, ...technicalTermUrls, ...tagUrls, ...blogUrls, ...questionUrls];
}
