/**
 * Cover images for the /links page.
 *
 * Each carousel's first slide is exported to public/reels/covers/<slug>.webp and
 * listed in src/data/reel-covers.json, both committed. The page shows that exact
 * image, so a visitor recognises the Instagram post they came from — no image is
 * ever pulled from Instagram.
 *
 *   npm run reels:covers          export every carousel in reels/ (backfill)
 *
 * renderCarousel() in the reel kit calls exportCover() automatically, so new
 * carousels only need committing.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '..');
const COVER_DIR = path.join(root, 'public', 'reels', 'covers');
const MANIFEST = path.join(root, 'src', 'data', 'reel-covers.json');
/** Tiles render ≤ ~300 px wide; 600×800 stays sharp on 2× screens at ~40 KB. */
const WIDTH = 600;
const HEIGHT = 800;

export type CoverManifest = {
  /** reel slug → public cover URL */
  bySlug: Record<string, string>;
  /** normalised blog path (e.g. "/technical-terms/bloom-filter") → public cover URL */
  byPath: Record<string, string>;
};

/** "https://blog.ratnesh-maurya.com/blog/Foo-Bar/?utm=x" → "/blog/foo-bar" */
export function coverPathKey(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.replace(/^www\./, '') !== 'blog.ratnesh-maurya.com') return null;
    const p = u.pathname.replace(/\/+$/, '').toLowerCase();
    return p || null;
  } catch {
    return null;
  }
}

/** Cross-process mutex: mkdir is atomic. A lock older than 15 s is treated as abandoned. */
async function withLock<T>(dir: string, fn: () => T): Promise<T> {
  const deadline = Date.now() + 20_000;
  for (;;) {
    try {
      fs.mkdirSync(dir);
      break;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e;
      try {
        if (Date.now() - fs.statSync(dir).mtimeMs > 15_000) fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        // released between the two calls
      }
      if (Date.now() > deadline) throw new Error(`Timed out waiting for ${dir}`);
      await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));
    }
  }
  try {
    return fn();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function readManifest(): CoverManifest {
  try {
    const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) as Partial<CoverManifest>;
    return { bySlug: m.bySlug ?? {}, byPath: m.byPath ?? {} };
  } catch {
    return { bySlug: {}, byPath: {} };
  }
}

function sorted(o: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
}

/**
 * Writes the cover for one carousel and records it in the manifest.
 * `postUrl` is the blog page the post links to (used to match reels whose slug differs).
 */
export async function exportCover(firstSlide: string, slug: string, postUrl?: string): Promise<string> {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Cover slug must be lowercase kebab-case (got "${slug}")`);
  const sharp = (await import('sharp')).default;
  const webp = await sharp(firstSlide).resize(WIDTH, HEIGHT, { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toBuffer();

  fs.mkdirSync(COVER_DIR, { recursive: true });
  fs.writeFileSync(path.join(COVER_DIR, `${slug}.webp`), webp);
  // Content hash in the URL so browsers and the CDN pick up a re-rendered cover immediately.
  const url = `/reels/covers/${slug}.webp?v=${crypto.createHash('sha1').update(webp).digest('hex').slice(0, 8)}`;

  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  // Several carousels can render at once: serialise the read-modify-write so no entry is lost.
  await withLock(`${MANIFEST}.lock`, () => {
    const m = readManifest();
    m.bySlug[slug] = url;
    const key = postUrl ? coverPathKey(postUrl) : null;
    if (key) m.byPath[key] = url;
    const tmp = `${MANIFEST}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({ bySlug: sorted(m.bySlug), byPath: sorted(m.byPath) }, null, 2) + '\n');
    fs.renameSync(tmp, MANIFEST);
  });
  return url;
}

/** Backfill: export the cover of every rendered carousel in reels/. */
async function main() {
  const reelsDir = path.join(root, 'reels');
  if (!fs.existsSync(reelsDir)) {
    console.log('No reels/ folder — nothing to export.');
    return;
  }
  let done = 0;
  for (const name of fs.readdirSync(reelsDir).sort()) {
    const dir = path.join(reelsDir, name);
    if (name.startsWith('_') || !fs.statSync(dir).isDirectory()) continue;
    const first = fs.readdirSync(dir).filter((f) => /^01-.*\.png$/.test(f))[0];
    const linksFile = path.join(dir, 'links.json');
    if (!first || !fs.existsSync(linksFile)) {
      console.log(`  skip ${name} (no 01-*.png or links.json)`);
      continue;
    }
    const links = JSON.parse(fs.readFileSync(linksFile, 'utf8')) as { slug?: string; links?: Array<{ url: string }> };
    const slug = links.slug || name;
    const postUrl = links.links?.map((l) => l.url).find((u) => coverPathKey(u));
    const url = await exportCover(path.join(dir, first), slug, postUrl);
    console.log(`  ${slug.padEnd(28)} ${url}`);
    done++;
  }
  console.log(`\n✓ ${done} covers → public/reels/covers/ (+ src/data/reel-covers.json). Commit both.`);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
