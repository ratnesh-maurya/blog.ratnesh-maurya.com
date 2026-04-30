import { Metadata } from 'next';
import { getAllReels, withUtm, type Reel } from '@/lib/reels';

const PROFILE_URL = 'https://www.instagram.com/ratn_labs/';
const SITE_URL = 'https://blog.ratnesh-maurya.com';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Links — Ratn Labs',
  description: 'Every link mentioned in @ratn_labs Instagram reels — blog posts, repos, and tools.',
  alternates: { canonical: `${SITE_URL}/links/` },
  openGraph: {
    title: 'Links — Ratn Labs',
    description: 'Every link mentioned in @ratn_labs Instagram reels.',
    url: `${SITE_URL}/links/`,
    siteName: 'Ratn Labs',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Links — Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

function ReelCard({ reel, isLatest }: { reel: Reel; isLatest: boolean }) {
  const blogLink = reel.links.find((link) => /blog/i.test(link.label) || link.url.includes('blog.ratnesh-maurya.com'));
  const thumbnailHref = blogLink ? withUtm(blogLink.url, reel.slug) : reel.reel_url;
  const thumbnailAriaLabel = blogLink ? `Open blog post for ${reel.title}` : `Watch ${reel.title} reel`;

  const linksBlock = (
    <div className="flex flex-col gap-2">
      {reel.links.map((l) => (
        <a
          key={l.url}
          href={withUtm(l.url, reel.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 group"
          style={{
            backgroundColor: 'var(--glass-bg-subtle)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
          }}
        >
          <span className="truncate">{l.label}</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5 flex-shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: 'var(--accent-500)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ))}
      <a
        href={reel.reel_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium mt-1 inline-flex items-center gap-1 hover:underline"
        style={{ color: 'var(--text-muted)' }}
      >
        Watch the reel ↗
      </a>
    </div>
  );

  return (
    <article
      id={reel.slug}
      className="rounded-2xl p-6 transition-all flex flex-col"
      style={{
        backgroundColor: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow-sm)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        {isLatest && (
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--accent-500)', color: 'white' }}
          >
            Latest
          </span>
        )}
        <time className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {new Date(reel.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </time>
      </div>

      <h2 className="text-lg sm:text-xl font-bold mb-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
        {reel.title}
      </h2>
      {reel.thumb_url ? (
        <div className="mb-4 flex items-start gap-3">
          <a
            href={thumbnailHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-28 sm:w-32 overflow-hidden rounded-lg border shrink-0"
            style={{ borderColor: 'var(--glass-border)' }}
            aria-label={thumbnailAriaLabel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={reel.thumb_url}
              alt={`${reel.title} thumbnail`}
              loading="lazy"
              className="aspect-[9/16] w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
            />
          </a>
          <div className="min-w-0 flex-1">
            {reel.description && (
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                {reel.description}
              </p>
            )}
            {linksBlock}
          </div>
        </div>
      ) : (
        <>
          {reel.description && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {reel.description}
            </p>
          )}
          {linksBlock}
        </>
      )}
    </article>
  );
}

export default async function LinksPage() {
  const reels = await getAllReels();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
      <div className="hero-gradient-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-500)' }}>
            From the bio
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            @ratn_labs links
          </h1>
          <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Every link mentioned in my reels — blog posts, repos, and tools. Latest first.
          </p>
          <div className="mt-5 flex justify-center gap-2 flex-wrap">
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow-sm)',
                backdropFilter: 'blur(10px) saturate(160%)',
                WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                color: 'var(--text-primary)',
              }}
            >
              <span>📸</span> @ratn_labs
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {reels.length === 0 ? (
          <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No reels yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reels.map((reel, i) => (
              <ReelCard key={reel.slug} reel={reel} isLatest={i === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
