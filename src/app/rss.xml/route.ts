import { getAllBlogPosts } from '@/lib/content';
import { BlogPost } from '@/types/blog';
import fs from 'fs';
import path from 'path';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

const baseUrl = 'https://blog.ratnesh-maurya.com';

function toAbsoluteUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

function getFeaturedImageUrl(post: BlogPost): string {
  return toAbsoluteUrl(post.image || post.socialImage || '');
}

function getImageMimeType(imageUrl: string): string {
  const cleanUrl = imageUrl.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  if (cleanUrl.endsWith('.gif')) return 'image/gif';
  if (cleanUrl.endsWith('.svg')) return 'image/svg+xml';
  if (cleanUrl.endsWith('.avif')) return 'image/avif';
  return 'image/jpeg';
}

function getImageLength(imageUrl: string): number {
  try {
    const pathname = new URL(imageUrl).pathname;
    const localPath = path.join(process.cwd(), 'public', pathname.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) return 0;
    return fs.statSync(localPath).size;
  } catch {
    return 0;
  }
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function injectFeaturedImage(contentHtml: string, post: BlogPost): string {
  if (/<img\b/i.test(contentHtml)) return contentHtml;
  const imageUrl = getFeaturedImageUrl(post);
  if (!imageUrl) return contentHtml;
  const alt = escapeHtmlAttr(post.title || '');
  return `<p><img src="${imageUrl}" alt="${alt}" /></p>${contentHtml}`;
}

function buildEnclosure(post: BlogPost): string {
  const imageUrl = getFeaturedImageUrl(post);
  if (!imageUrl) return '';
  const type = getImageMimeType(imageUrl);
  const length = getImageLength(imageUrl);
  return `<enclosure url="${imageUrl}" length="${length}" type="${type}" />`;
}

function stripMdxComponents(raw: string): string {
  let result = raw.replace(/<[A-Z][A-Za-z]*\b[^>]*\/>/g, '');
  result = result.replace(/<\/?[A-Z][A-Za-z]*\b[^>]*>/g, '');
  result = result.replace(/^import\s.+$/gm, '');
  return result;
}

function absoluteUrls(html: string): string {
  return html.replace(/(src|href)="(\/(images|og)\/[^"]+)"/g, `$1="${baseUrl}$2"`);
}

async function getPostHtml(post: BlogPost): Promise<string> {
  if (post.format === 'md') {
    return absoluteUrls(post.content);
  }
  const md = stripMdxComponents(post.rawContent || post.content);
  const result = await remark().use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(md);
  return absoluteUrls(result.toString());
}

export async function GET() {
  const posts = await getAllBlogPosts();

  const rssItems = (
    await Promise.all(
      posts.map(async (post) => {
        const contentHtml = injectFeaturedImage(await getPostHtml(post), post);
        const enclosure = buildEnclosure(post);
        return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.description}]]></description>
        <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
        <link>${baseUrl}/blog/${post.slug}</link>
        <guid>${baseUrl}/blog/${post.slug}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <author>ratnesh@ratnesh-maurya.com (${post.author})</author>
        <category>${post.category}</category>
        ${enclosure}
      </item>`;
      }),
    )
  ).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
      <channel>
        <title>Ratn Labs</title>
        <description>Systems thinking, backend architecture, and AI engineering. Building scalable systems and sharing technical insights.</description>
        <link>${baseUrl}</link>
        <language>en-us</language>
        <managingEditor>ratnesh@ratnesh-maurya.com (Ratnesh Maurya)</managingEditor>
        <webMaster>ratnesh@ratnesh-maurya.com (Ratnesh Maurya)</webMaster>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
        ${rssItems}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
