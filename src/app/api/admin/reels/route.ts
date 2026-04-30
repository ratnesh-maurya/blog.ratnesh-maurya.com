import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function checkAuth(req: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    return NextResponse.json({ error: 'ADMIN_SECRET not configured on server' }, { status: 500 });
  }
  const got = req.headers.get('x-admin-secret');
  if (got !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

function revalidateAll() {
  revalidatePath('/links');
  revalidatePath('/l');
}

type LinkInput = { label: string; url: string };
type ReelInput = {
  slug: string;
  title: string;
  description?: string;
  reel_url: string;
  thumb_url?: string | null;
  posted_at?: string;
  links?: LinkInput[];
};

function validateReel(body: unknown): { ok: true; data: ReelInput } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Body must be JSON object' };
  const b = body as Record<string, unknown>;
  if (typeof b.slug !== 'string' || !/^[a-z0-9-]+$/.test(b.slug)) {
    return { ok: false, error: 'slug must be lowercase letters, digits, hyphens' };
  }
  if (typeof b.title !== 'string' || !b.title.trim()) return { ok: false, error: 'title required' };
  if (typeof b.reel_url !== 'string' || !b.reel_url.startsWith('http')) {
    return { ok: false, error: 'reel_url must be http(s) URL' };
  }
  const links = Array.isArray(b.links) ? b.links : [];
  for (const l of links) {
    if (!l || typeof l !== 'object') return { ok: false, error: 'each link must be object' };
    const ll = l as Record<string, unknown>;
    if (typeof ll.label !== 'string' || typeof ll.url !== 'string') {
      return { ok: false, error: 'each link needs string label + url' };
    }
  }
  return {
    ok: true,
    data: {
      slug: b.slug,
      title: b.title.trim(),
      description: typeof b.description === 'string' ? b.description : '',
      reel_url: b.reel_url,
      thumb_url: typeof b.thumb_url === 'string' && b.thumb_url ? b.thumb_url : null,
      posted_at: typeof b.posted_at === 'string' && b.posted_at ? b.posted_at : undefined,
      links: links as LinkInput[],
    },
  };
}

export async function GET(req: NextRequest) {
  const fail = checkAuth(req);
  if (fail) return fail;
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('reels')
    .select('slug, title, description, reel_url, thumb_url, posted_at, links, created_at, updated_at')
    .order('posted_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reels: data ?? [] });
}

export async function POST(req: NextRequest) {
  const fail = checkAuth(req);
  if (fail) return fail;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const v = validateReel(body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });

  const sb = getAdminClient();
  const row = {
    slug: v.data.slug,
    title: v.data.title,
    description: v.data.description ?? '',
    reel_url: v.data.reel_url,
    thumb_url: v.data.thumb_url,
    links: v.data.links ?? [],
    ...(v.data.posted_at ? { posted_at: v.data.posted_at } : {}),
  };

  const { data, error } = await sb
    .from('reels')
    .upsert(row as never, { onConflict: 'slug' })
    .select()
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateAll();
  return NextResponse.json({ reel: data });
}

export async function DELETE(req: NextRequest) {
  const fail = checkAuth(req);
  if (fail) return fail;

  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug query param required' }, { status: 400 });

  const sb = getAdminClient();
  const { error } = await sb.from('reels').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateAll();
  return NextResponse.json({ ok: true });
}
