import { isExpiringCdnUrl } from '@/lib/reelThumbs';
import { withUtm, type Reel } from '@/lib/reels';

const PROFILE_URL = 'https://www.instagram.com/ratn_labs/';
const SITE_URL = 'https://blog.ratnesh-maurya.com';

/** Instagram's brand gradient — only on the avatar ring, so the page reads as "from Instagram" without copying it. */
const STORY_RING = 'linear-gradient(45deg, #f9ce34 0%, #ee2a7b 55%, #6228d7 100%)';

const KINDS: Record<string, string> = {
  blog: 'Blog post',
  'technical-terms': 'Technical term',
  news: 'Daily news',
  til: 'Today I learned',
  cheatsheets: 'Cheatsheet',
  'silly-questions': 'Silly question',
};

function InstagramGlyph({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zM16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
    </svg>
  );
}

function Arrow({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function GitHubGlyph({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function kindOf(url: string | undefined): string {
  if (!url) return 'Reel';
  try {
    return KINDS[new URL(url).pathname.split('/').filter(Boolean)[0]] ?? 'Post';
  } catch {
    return 'Post';
  }
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function usableThumb(reel: Reel): string | null {
  // Old rows may still hold Instagram CDN links, which expire and render as broken images.
  return reel.thumb_url && !isExpiringCdnUrl(reel.thumb_url) ? reel.thumb_url : null;
}

/**
 * 3:4 cover, the shape the carousels are designed in. Covers in another shape
 * (square reel previews) are shown whole on a blurred copy of themselves
 * instead of being cropped, so the title on the slide stays readable.
 */
function Cover({ src, title, kind }: { src: string | null; title: string; kind: string }) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden" style={{ backgroundColor: 'var(--surface-muted)' }}>
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Cover of the post: ${title}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </>
      ) : (
        <div
          className="absolute inset-0 flex flex-col justify-between p-5 text-white"
          style={{ background: 'linear-gradient(150deg, var(--accent-500), color-mix(in srgb, var(--accent-500) 50%, #000))' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-80">{kind}</span>
          <span className="text-xl font-extrabold leading-tight tracking-tight line-clamp-5">{title}</span>
          <span className="text-xs font-semibold opacity-80">@ratn_labs</span>
        </div>
      )}
    </div>
  );
}

function Tile({ reel, isLatest }: { reel: Reel; isLatest: boolean }) {
  const blogLink = reel.links.find((l) => /blog/i.test(l.label) || l.url.includes('blog.ratnesh-maurya.com'));
  const extra = reel.links.filter((l) => l !== blogLink);
  const readHref = blogLink ? withUtm(blogLink.url, reel.slug) : reel.reel_url;
  const kind = kindOf(blogLink?.url);
  const newTab = !blogLink;

  return (
    <article
      id={reel.slug}
      className="group relative flex scroll-mt-24 flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 target:ring-2 target:ring-[var(--accent-500)]"
      style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow-sm)' }}
    >
      {/* One big target: the whole card opens the post. Secondary links sit above it (z-10). */}
      <a
        href={readHref}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: 'var(--accent-500)' }}
        aria-label={blogLink ? `Read: ${reel.title}` : `Watch on Instagram: ${reel.title}`}
      />

      <div className="pointer-events-none relative">
        <Cover src={usableThumb(reel)} title={reel.title} kind={kind} />
        {isLatest && (
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: 'var(--accent-500)' }}>
            Latest
          </span>
        )}
        {/* Hover hint on pointer devices; the label under the cover covers touch. */}
        <span
          className="absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 [@media(hover:hover)]:inline-flex"
          style={{ backgroundColor: 'rgba(0,0,0,0.72)' }}
        >
          {blogLink ? 'Read' : 'Watch'}
          <Arrow className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="pointer-events-none relative flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--accent-500)' }}>
          {kind}
        </span>
        <h2 className="text-sm font-semibold leading-snug line-clamp-2 sm:text-[15px]" style={{ color: 'var(--text-primary)' }}>
          {reel.title}
        </h2>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <time dateTime={reel.posted_at} className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
            {shortDate(reel.posted_at)}
          </time>
          <div className="pointer-events-auto relative z-10 ml-auto flex items-center gap-1">
            {extra.map((l) => (
              <a
                key={l.url}
                href={withUtm(l.url, reel.slug)}
                target="_blank"
                rel="noopener noreferrer"
                title={l.label}
                aria-label={`${l.label} (opens in a new tab)`}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:brightness-95"
                style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)' }}
              >
                {l.url.includes('github.com') ? <GitHubGlyph /> : <Arrow className="w-3.5 h-3.5 -rotate-45" />}
              </a>
            ))}
            {blogLink && (
              <a
                href={reel.reel_url}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Instagram"
                aria-label={`View "${reel.title}" on Instagram (opens in a new tab)`}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:brightness-95"
                style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)' }}
              >
                <InstagramGlyph className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function LinksView({ reels }: { reels: Reel[] }) {
  return (
    <div className="min-h-screen">
      <div className="hero-gradient-bg">
        <header className="mx-auto max-w-6xl px-4 pb-8 pt-20 sm:px-6 sm:pt-24 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
            <div className="flex items-center gap-4 sm:contents">
              <span className="inline-flex shrink-0 rounded-full p-[3px]" style={{ background: STORY_RING }}>
                <span
                  className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black text-white sm:h-24 sm:w-24 sm:text-4xl"
                  style={{ backgroundColor: 'var(--accent-500)', border: '3px solid var(--background)' }}
                  aria-hidden="true"
                >
                  R
                </span>
              </span>
              <div className="sm:hidden">
                <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Ratn Labs</h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>@ratn_labs</p>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="hidden items-baseline gap-3 sm:flex">
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Ratn Labs</h1>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>@ratn_labs</span>
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed sm:text-[15px]" style={{ color: 'var(--text-secondary)' }}>
                Systems, backend &amp; AI engineering. Tap any post to read the full write-up behind it.
              </p>
              <p className="mt-1 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {`${reels.length} post${reels.length === 1 ? '' : 's'} · latest first`}
              </p>
            </div>

            <div className="flex gap-2 sm:shrink-0">
              <a
                href={PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 sm:flex-none"
                style={{ backgroundColor: 'var(--accent-500)' }}
              >
                <InstagramGlyph />
                Follow
              </a>
              <a
                href={`${SITE_URL}/blog/`}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:brightness-95 sm:flex-none"
                style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
              >
                All articles
                <Arrow className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {reels.length === 0 ? (
          <p className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {reels.map((reel, i) => (
              <Tile key={reel.slug} reel={reel} isLatest={i === 0} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
