import { isExpiringCdnUrl } from '@/lib/reelThumbs';
import { withUtm, type Reel } from '@/lib/reels';

const PROFILE_URL = 'https://www.instagram.com/ratn_labs/';
const SITE_URL = 'https://blog.ratnesh-maurya.com';

/** Instagram's brand gradient — used only for the story rings, everything else follows the site's tokens. */
const STORY_RING = 'linear-gradient(45deg, #f9ce34 0%, #ee2a7b 55%, #6228d7 100%)';

const glass: React.CSSProperties = {
  backgroundColor: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow-sm)',
  backdropFilter: 'blur(12px) saturate(160%)',
  WebkitBackdropFilter: 'blur(12px) saturate(160%)',
};

function InstagramGlyph({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zM16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
    </svg>
  );
}

function Chevron({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

function External({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

/** Circular brand mark, same "R" as the site header. */
function Avatar({ size }: { size: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-black text-white shrink-0"
      style={{ width: size, height: size, backgroundColor: 'var(--accent-500)', fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      R
    </span>
  );
}

/** Gradient ring + gap around a circular child, like an Instagram story. */
function Ring({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full shrink-0" style={{ width: size, height: size, background: STORY_RING, padding: 2.5 }}>
      <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full" style={{ border: '3px solid var(--background)', backgroundColor: 'var(--surface-muted)' }}>
        {children}
      </span>
    </span>
  );
}

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** What kind of page the post's main link points at. */
function kindOf(url: string | undefined): string {
  if (!url) return 'Reel';
  try {
    const section = new URL(url).pathname.split('/').filter(Boolean)[0];
    return (
      ({ blog: 'Blog post', 'technical-terms': 'Technical term', news: 'Daily news', til: 'Today I learned', cheatsheets: 'Cheatsheet', 'silly-questions': 'Silly question' } as Record<string, string>)[section] ?? 'Post'
    );
  } catch {
    return 'Post';
  }
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function usableThumb(reel: Reel): string | null {
  // Old rows may still hold Instagram CDN links, which expire and render as broken images.
  return reel.thumb_url && !isExpiringCdnUrl(reel.thumb_url) ? reel.thumb_url : null;
}

/** Shown when a post has no stored cover: branded tile with the title, so the feed never has holes. */
function CoverFallback({ title, kind }: { title: string; kind: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-7 text-white"
      style={{ background: 'linear-gradient(145deg, var(--accent-500), color-mix(in srgb, var(--accent-500) 55%, #000))' }}
    >
      <span className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">{kind}</span>
      <span className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight line-clamp-5">{title}</span>
      <span className="text-sm font-semibold opacity-80">RatnLabs · @ratn_labs</span>
    </div>
  );
}

function Highlights({ reels }: { reels: Reel[] }) {
  return (
    <nav aria-label="Jump to a post" className="-mx-4 px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-5 overflow-x-auto pb-2 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reels.map((reel) => {
          const thumb = usableThumb(reel);
          return (
            <li key={reel.slug} className="snap-start shrink-0 w-[72px]">
              <a href={`#${reel.slug}`} className="flex flex-col items-center gap-1.5 group" aria-label={reel.title}>
                <Ring size={72}>
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" width={72} height={72} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-lg font-black" style={{ color: 'var(--accent-500)' }}>R</span>
                  )}
                </Ring>
                <span className="w-full truncate text-center text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {reel.title}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Post({ reel, isLatest }: { reel: Reel; isLatest: boolean }) {
  const blogLink = reel.links.find((l) => /blog/i.test(l.label) || l.url.includes('blog.ratnesh-maurya.com'));
  const others = reel.links.filter((l) => l !== blogLink);
  const readHref = blogLink ? withUtm(blogLink.url, reel.slug) : reel.reel_url;
  const kind = kindOf(blogLink?.url);
  const thumb = usableThumb(reel);
  const external = blogLink ? false : true;

  return (
    <article id={reel.slug} className="scroll-mt-24 overflow-hidden rounded-2xl" style={glass}>
      <header className="flex items-center gap-3 px-4 py-3">
        <Ring size={40}>
          <Avatar size={34} />
        </Ring>
        <div className="min-w-0 leading-tight">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            ratn_labs
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {kind}
          </p>
        </div>
        {isLatest && (
          <span className="ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: 'var(--accent-500)' }}>
            Latest
          </span>
        )}
      </header>

      {/* The cover is the biggest tap target: it opens the post itself. */}
      <a
        href={readHref}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        aria-label={blogLink ? `Read: ${reel.title}` : `Watch on Instagram: ${reel.title}`}
        className="group relative block aspect-square w-full overflow-hidden"
        style={{ backgroundColor: 'var(--surface-muted)' }}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={`Cover slide for ${reel.title}`}
            width={640}
            height={640}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <CoverFallback title={reel.title} kind={kind} />
        )}
      </a>

      {/* Instagram's "Learn more" bar: one obvious way to read it. */}
      <a
        href={readHref}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold transition-colors hover:brightness-95"
        style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--accent-500)', borderBottom: '1px solid var(--glass-border)' }}
      >
        <span>{blogLink ? `Read the ${kind.toLowerCase()}` : 'Watch on Instagram'}</span>
        <Chevron />
      </a>

      <div className="space-y-3 px-4 pb-4 pt-3">
        <div>
          <h2 className="text-[15px] font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
            {reel.title}
          </h2>
          {reel.description && (
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {reel.description}
            </p>
          )}
        </div>

        {others.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {others.map((l) => (
              <li key={l.url}>
                <a
                  href={withUtm(l.url, reel.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: 'var(--surface-muted)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                >
                  <span>{l.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{domainOf(l.url)}</span>
                  <External className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between pt-1">
          <time dateTime={reel.posted_at} className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {longDate(reel.posted_at)}
          </time>
          <a
            href={reel.reel_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            <InstagramGlyph className="w-3.5 h-3.5" />
            View on Instagram
          </a>
        </div>
      </div>
    </article>
  );
}

export function LinksView({ reels }: { reels: Reel[] }) {
  const linkCount = reels.reduce((n, r) => n + r.links.length, 0);

  return (
    <div className="min-h-screen">
      <div className="hero-gradient-bg">
        <header className="mx-auto max-w-xl px-4 pt-20 pb-6 sm:pt-24">
          <div className="flex items-center gap-5 sm:gap-8">
            <Ring size={96}>
              <Avatar size={84} />
            </Ring>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
                ratn_labs
              </h1>
              <dl className="mt-2 flex gap-5 text-sm">
                <div className="flex gap-1">
                  <dt className="sr-only">Posts</dt>
                  <dd className="font-bold" style={{ color: 'var(--text-primary)' }}>{reels.length}</dd>
                  <span style={{ color: 'var(--text-secondary)' }}>posts</span>
                </div>
                <div className="flex gap-1">
                  <dt className="sr-only">Links</dt>
                  <dd className="font-bold" style={{ color: 'var(--text-primary)' }}>{linkCount}</dd>
                  <span style={{ color: 'var(--text-secondary)' }}>links</span>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-4 text-sm leading-relaxed">
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Ratn Labs</p>
            <p style={{ color: 'var(--text-secondary)' }}>code, meme, coffee</p>
            <p style={{ color: 'var(--text-secondary)' }}>Systems, backend &amp; AI engineering — every link from my posts, in one place.</p>
            <a href={SITE_URL} className="font-semibold hover:underline" style={{ color: 'var(--accent-500)' }}>
              blog.ratnesh-maurya.com
            </a>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: 'var(--accent-500)' }}
            >
              <InstagramGlyph />
              Follow
            </a>
            <a
              href={`${SITE_URL}/blog/`}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-95"
              style={{ backgroundColor: 'var(--surface-muted)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
            >
              Read the blog
            </a>
          </div>

          {reels.length > 1 && (
            <div className="mt-6">
              <Highlights reels={reels} />
            </div>
          )}
        </header>
      </div>

      <main className="mx-auto max-w-xl px-4 pb-16 pt-6">
        {reels.length === 0 ? (
          <p className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="space-y-6">
            {reels.map((reel, i) => (
              <Post key={reel.slug} reel={reel} isLatest={i === 0} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
