import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteThumbs, fetchInstagramCover, isExpiringCdnUrl, isInstagramPostUrl, isStoredThumb, storeThumb } from '@/lib/reelThumbs';
import { canonicalInstagramUrl, importInstagramPost } from '@/lib/instagramImport';
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
  /** Uploaded image as a data URL (data:image/png;base64,...). Takes precedence over thumb_url. */
  thumb_data?: string | null;
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
      thumb_data: typeof b.thumb_data === 'string' && b.thumb_data.startsWith('data:image/') ? b.thumb_data : null,
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

/**
 * POST /api/admin/reels?action=import  { url }
 * Reads an Instagram post (caption, date, cover) and returns a ready-to-save reel
 * draft. Nothing is written. `existing` is true when that post is already a reel.
 */
async function importDraft(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { url?: unknown } | null;
  const url = typeof body?.url === 'string' ? body.url.trim() : '';
  if (!url) return NextResponse.json({ error: 'Paste an Instagram post link' }, { status: 400 });

  let draft: Awaited<ReturnType<typeof importInstagramPost>>;
  try {
    draft = await importInstagramPost(url);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  const sb = getAdminClient();
  const { data, error } = await sb.from('reels').select('slug, reel_url');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = (data ?? []) as Array<{ slug: string; reel_url: string }>;

  const same = rows.find((r) => {
    try {
      return canonicalInstagramUrl(r.reel_url) === draft.reel_url;
    } catch {
      return false;
    }
  });
  let slug = draft.slug;
  if (same) {
    slug = same.slug;
  } else {
    // A different post can map to the same slug (e.g. a second post about one topic) — never overwrite it.
    const taken = new Set(rows.map((r) => r.slug));
    for (let n = 2; taken.has(slug); n++) slug = `${draft.slug}-${n}`;
  }
  const { notes, ...reel } = draft;
  return NextResponse.json({ reel: { ...reel, slug }, existing: Boolean(same), notes });
}

export async function POST(req: NextRequest) {
  const fail = checkAuth(req);
  if (fail) return fail;
  if (req.nextUrl.searchParams.get('action') === 'import') return importDraft(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const v = validateReel(body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });

  const sb = getAdminClient();

  // Instagram image links expire within weeks, so keep our own copy of every
  // thumbnail. Already-stored URLs (an unchanged edit) are kept as they are.
  let thumbUrl = v.data.thumb_url ?? null;
  let warning: string | undefined;
  try {
    if (v.data.thumb_data) thumbUrl = await storeThumb(sb, v.data.slug, { dataUrl: v.data.thumb_data });
    else if (thumbUrl && !isStoredThumb(thumbUrl) && !isExpiringCdnUrl(thumbUrl)) thumbUrl = await storeThumb(sb, v.data.slug, { url: thumbUrl });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  // No usable thumbnail given: pull the cover straight from the Instagram post.
  if ((!thumbUrl || !isStoredThumb(thumbUrl)) && isInstagramPostUrl(v.data.reel_url)) {
    try {
      thumbUrl = await storeThumb(sb, v.data.slug, { url: await fetchInstagramCover(v.data.reel_url) });
    } catch (e) {
      thumbUrl = null;
      warning = `Saved without a thumbnail: ${(e as Error).message}. Upload the image instead.`;
    }
  }

  const row = {
    slug: v.data.slug,
    title: v.data.title,
    description: v.data.description ?? '',
    reel_url: v.data.reel_url,
    thumb_url: thumbUrl,
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
  return NextResponse.json({ reel: data, warning });
}

/**
 * PATCH /api/admin/reels?action=refresh-thumbs[&all=1]
 * Pulls and stores a cover for every reel whose thumbnail is missing or is an
 * (expiring) Instagram link — or, with all=1, for every Instagram reel. Safe to re-run.
 */
export async function PATCH(req: NextRequest) {
  const fail = checkAuth(req);
  if (fail) return fail;
  if (req.nextUrl.searchParams.get('action') !== 'refresh-thumbs') {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
  // ?all=1 re-pulls every Instagram cover, e.g. to replace older square crops with full-frame ones.
  const all = req.nextUrl.searchParams.get('all') === '1';
  const sb = getAdminClient();
  const { data: reels, error } = await sb.from('reels').select('slug, reel_url, thumb_url');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: Array<{ slug: string; ok: boolean; message?: string }> = [];
  for (const r of (reels ?? []) as Array<{ slug: string; reel_url: string; thumb_url: string | null }>) {
    if (!all && r.thumb_url && isStoredThumb(r.thumb_url)) continue;
    if (!isInstagramPostUrl(r.reel_url)) continue;
    try {
      const thumb = await storeThumb(sb, r.slug, { url: await fetchInstagramCover(r.reel_url) });
      const { error: upErr } = await sb.from('reels').update({ thumb_url: thumb } as never).eq('slug', r.slug);
      if (upErr) throw new Error(upErr.message);
      results.push({ slug: r.slug, ok: true });
    } catch (e) {
      results.push({ slug: r.slug, ok: false, message: (e as Error).message });
    }
  }
  if (results.some((r) => r.ok)) revalidateAll();
  return NextResponse.json({ results });
}

export async function DELETE(req: NextRequest) {
  const fail = checkAuth(req);
  if (fail) return fail;

  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug query param required' }, { status: 400 });

  const sb = getAdminClient();
  const { error } = await sb.from('reels').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await deleteThumbs(sb, slug).catch(() => {});

  revalidateAll();
  return NextResponse.json({ ok: true });
}
