import { NextRequest, NextResponse } from 'next/server';
import { getBlogPost, getSillyQuestion, getTechnicalTerm, getTILEntry } from '@/lib/content';
import { getStoredOgImageUrl } from '@/lib/og';

const BASE = 'https://blog.ratnesh-maurya.com';
const AUTHOR = 'Ratnesh Maurya';
const PROVIDER = 'Ratn Labs';

interface OEmbedResponse {
  version: '1.0';
  type: 'rich' | 'link';
  title: string;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  html?: string;
  width?: number;
  height?: number;
  cache_age?: number;
}

function buildResponse(
  title: string,
  description: string,
  pageUrl: string,
  thumbnailUrl: string,
): OEmbedResponse {
  const safeDesc = description.replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const safeTitle = title.replace(/"/g, '&quot;').replace(/</g, '&lt;');

  return {
    version: '1.0',
    type: 'rich',
    title,
    author_name: AUTHOR,
    author_url: 'https://ratnesh-maurya.com',
    provider_name: PROVIDER,
    provider_url: BASE,
    thumbnail_url: thumbnailUrl,
    thumbnail_width: 1200,
    thumbnail_height: 630,
    width: 600,
    height: 200,
    cache_age: 86400,
    html: `<blockquote style="margin:0;padding:16px 20px;border-left:4px solid #3b82f6;background:#f8fafc;border-radius:8px;font-family:system-ui,sans-serif"><a href="${pageUrl}" target="_blank" rel="noopener" style="text-decoration:none"><strong style="font-size:18px;color:#0f172a">${safeTitle}</strong></a><p style="margin:8px 0 0;font-size:14px;color:#475569;line-height:1.5">${safeDesc}</p><p style="margin:8px 0 0;font-size:12px;color:#94a3b8">${PROVIDER} — ${AUTHOR}</p></blockquote>`,
  };
}

async function resolveUrl(pathname: string): Promise<OEmbedResponse | null> {
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/');

  if (segments[0] === 'blog' && segments.length === 2) {
    const post = await getBlogPost(segments[1]);
    if (!post) return null;
    return buildResponse(
      post.title,
      post.description,
      `${BASE}/blog/${post.slug}`,
      post.socialImage || getStoredOgImageUrl('blog-slug', post.slug),
    );
  }

  if (segments[0] === 'silly-questions' && segments.length === 2) {
    const q = await getSillyQuestion(segments[1]);
    if (!q) return null;
    return buildResponse(
      q.question,
      q.answer.replace(/<[^>]*>/g, '').slice(0, 200),
      `${BASE}/silly-questions/${q.slug}`,
      getStoredOgImageUrl('silly-question', q.slug),
    );
  }

  if (segments[0] === 'technical-terms' && segments.length === 2) {
    const term = await getTechnicalTerm(segments[1]);
    if (!term) return null;
    return buildResponse(
      term.title,
      term.description,
      `${BASE}/technical-terms/${term.slug}`,
      getStoredOgImageUrl('technical-term', term.slug),
    );
  }

  if (segments[0] === 'til' && segments.length === 2) {
    const entry = await getTILEntry(segments[1]);
    if (!entry) return null;
    return buildResponse(
      entry.title,
      `Today I Learned: ${entry.title}`,
      `${BASE}/til/${entry.slug}`,
      getStoredOgImageUrl('til-slug', entry.slug),
    );
  }

  const sectionMap: Record<string, { title: string; desc: string; route: Parameters<typeof getStoredOgImageUrl>[0] }> = {
    '': { title: 'Ratn Labs', desc: 'Systems, Backend & AI Engineering', route: 'home' },
    'blog': { title: 'All Blog Posts', desc: 'Explore posts on systems, backend, and AI engineering.', route: 'blog' },
    'silly-questions': { title: 'Silly Questions & Mistakes', desc: 'Common coding mistakes and lessons learned.', route: 'silly-questions' },
    'technical-terms': { title: 'Technical Terms', desc: 'Backend & system design definitions.', route: 'technical-terms' },
    'til': { title: 'Today I Learned', desc: 'Short practical engineering notes.', route: 'til' },
    'about': { title: 'About', desc: 'Backend engineer specialising in system design.', route: 'about' },
    'cheatsheets': { title: 'Cheatsheets', desc: 'Quick reference for Go, Docker, PostgreSQL, Kubernetes.', route: 'cheatsheets' },
    'glossary': { title: 'Glossary', desc: 'Backend and system design terms.', route: 'glossary' },
    'series': { title: 'Series', desc: 'Multi-part posts.', route: 'series' },
    'resources': { title: 'Resources', desc: 'Curated tools and links.', route: 'resources' },
  };

  const key = segments.join('/') || '';
  const section = sectionMap[key];
  if (section) {
    return buildResponse(
      section.title,
      section.desc,
      key ? `${BASE}/${key}` : BASE,
      getStoredOgImageUrl(section.route),
    );
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get('url');
  const format = searchParams.get('format') || 'json';

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  if (format !== 'json') {
    return NextResponse.json({ error: 'Only JSON format is supported' }, { status: 501 });
  }

  let pathname: string;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'blog.ratnesh-maurya.com') {
      return NextResponse.json({ error: 'URL must be from blog.ratnesh-maurya.com' }, { status: 404 });
    }
    pathname = parsed.pathname;
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const data = await resolveUrl(pathname);
  if (!data) {
    return NextResponse.json({ error: 'No embed data found for this URL' }, { status: 404 });
  }

  return NextResponse.json(data, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
