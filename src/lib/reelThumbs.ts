import type { SupabaseClient } from '@supabase/supabase-js';

export const THUMB_BUCKET = 'reel-thumbs';
const MAX_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10_000;
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
// Link-preview crawlers get the post's og:image without a login wall.
export const PREVIEW_UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

let bucketReady: Promise<void> | null = null;

/** Creates the public bucket on first use, so no SQL migration is needed. */
function ensureBucket(sb: SupabaseClient): Promise<void> {
  bucketReady ??= (async () => {
    const { data } = await sb.storage.getBucket(THUMB_BUCKET);
    if (data) return;
    const { error } = await sb.storage.createBucket(THUMB_BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: Object.keys(EXT),
    });
    if (error && !/already exists/i.test(error.message)) throw new Error(`Could not create storage bucket: ${error.message}`);
  })().catch((e) => {
    bucketReady = null; // retry on the next save
    throw e;
  });
  return bucketReady;
}

/** True for instagram.com post/reel URLs. */
export function isInstagramPostUrl(url: string): boolean {
  return /^https:\/\/(www\.)?instagram\.com\/(p|reel|reels)\/[\w-]+/i.test(url);
}

/**
 * Current cover image of a public Instagram post, as a signed CDN link that
 * expires within weeks — pass it straight to storeThumb.
 *
 * Prefers `/media/?size=l`, which redirects to the full-frame first slide
 * (1080×1440 for a 3:4 carousel). Falls back to the og:image link-preview tag,
 * which is a centre-cropped square, for posts where that endpoint fails (reels).
 */
export async function fetchInstagramCover(postUrl: string): Promise<string> {
  if (!isInstagramPostUrl(postUrl)) throw new Error('Not an Instagram post URL');
  const base = postUrl.split('?')[0].replace(/\/?$/, '/');

  try {
    const full = await fetch(`${base}media/?size=l`, {
      headers: { 'user-agent': PREVIEW_UA },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: 'follow',
    });
    if (full.ok && (full.headers.get('content-type') ?? '').startsWith('image/') && isExpiringCdnUrl(full.url)) {
      await full.body?.cancel();
      return full.url;
    }
    await full.body?.cancel();
  } catch {
    // fall through to the preview tag
  }

  const res = await fetch(base, { headers: { 'user-agent': PREVIEW_UA }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Instagram returned HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
  if (!m) throw new Error('Instagram did not return a preview image (post private, deleted, or blocked)');
  return m[1].replace(/&amp;/g, '&');
}

/** Instagram/Facebook CDN links are signed and expire within weeks — never store or render them. */
export function isExpiringCdnUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host.endsWith('.cdninstagram.com') || host.endsWith('.fbcdn.net');
  } catch {
    return false;
  }
}

/** True when the URL already points at our own thumbnail bucket. */
export function isStoredThumb(url: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(base) && url.startsWith(`${base}/storage/v1/object/public/${THUMB_BUCKET}/`);
}

async function readSource(source: { url: string } | { dataUrl: string }): Promise<{ bytes: Buffer; type: string }> {
  if ('dataUrl' in source) {
    const m = source.dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if (!m) throw new Error('Thumbnail upload must be a JPEG, PNG or WebP image');
    return { bytes: Buffer.from(m[2], 'base64'), type: m[1] };
  }

  if (!/^https:\/\//i.test(source.url)) throw new Error('Thumbnail URL must be https');
  const res = await fetch(source.url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), redirect: 'follow' });
  if (!res.ok) {
    throw new Error(
      res.status === 403 || res.status === 410
        ? 'Thumbnail link has expired — copy a fresh image address from the Instagram post, or upload the image'
        : `Could not download thumbnail (HTTP ${res.status})`,
    );
  }
  const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
  if (!EXT[type]) throw new Error(`Thumbnail must be a JPEG, PNG or WebP image (got ${type || 'unknown'})`);
  return { bytes: Buffer.from(await res.arrayBuffer()), type };
}

/**
 * Copies a thumbnail into the public `reel-thumbs` bucket and returns its
 * permanent public URL. The `?v=` suffix busts caches when a reel's thumbnail
 * is replaced, since the object path stays the same per slug.
 */
export async function storeThumb(sb: SupabaseClient, slug: string, source: { url: string } | { dataUrl: string }): Promise<string> {
  await ensureBucket(sb);
  const { bytes, type } = await readSource(source);
  if (bytes.length === 0) throw new Error('Thumbnail is empty');
  if (bytes.length > MAX_BYTES) throw new Error('Thumbnail is larger than 2 MB');

  const path = `${slug}.${EXT[type]}`;
  // Different extension from a previous upload would leave a stale file behind.
  await sb.storage.from(THUMB_BUCKET).remove(Object.values(EXT).map((e) => `${slug}.${e}`).filter((p) => p !== path));
  const { error } = await sb.storage.from(THUMB_BUCKET).upload(path, bytes, {
    contentType: type,
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`Thumbnail upload failed: ${error.message}`);

  const { data } = sb.storage.from(THUMB_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function deleteThumbs(sb: SupabaseClient, slug: string): Promise<void> {
  await sb.storage.from(THUMB_BUCKET).remove(Object.values(EXT).map((e) => `${slug}.${e}`));
}
