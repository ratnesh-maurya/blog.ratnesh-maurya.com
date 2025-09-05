import { getAllBlogPosts } from '@/lib/content';

export const dynamic = 'force-static';

export async function GET() {
  const posts = await getAllBlogPosts();
  const baseUrl = 'https://blog.ratnesh-maurya.com';

  const rssItems = posts
    .slice(0, 20) // Latest 20 posts
    .map((post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.description}]]></description>
        <link>${baseUrl}/blog/${post.slug}</link>
        <guid>${baseUrl}/blog/${post.slug}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <author>ratnesh@ratnesh-maurya.com (${post.author})</author>
        <category>${post.category}</category>
      </item>
    `)
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Ratnesh Maurya's Blog</title>
        <description>A blog about web development, programming, and the silly mistakes we all make along the way.</description>
        <link>${baseUrl}</link>
        <language>en-us</language>
        <managingEditor>ratnesh@ratnesh-maurya.com (Ratnesh Maurya)</managingEditor>
        <webMaster>ratnesh@ratnesh-maurya.com (Ratnesh Maurya)</webMaster>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
        ${rssItems}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
