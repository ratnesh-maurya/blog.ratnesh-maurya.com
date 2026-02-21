import Link from 'next/link';

interface NavItem {
  slug: string;
  title: string;
  href: string;
  label?: string; // category or type label
  description?: string; // optional excerpt for prev/next card
}

interface PostNavigationProps {
  prev: NavItem | null;
  next: NavItem | null;
  accentVar?: string; // CSS variable for accent color, defaults to --accent-500
}

export function PostNavigation({ prev, next, accentVar = '--accent-500' }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Post navigation"
      className="mt-12 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Previous */}
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1.5 p-4 rounded-xl border transition-all duration-200"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          rel="prev"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: `var(${accentVar})` }}>
            <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </span>
          {prev.label && (
            <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
              {prev.label}
            </span>
          )}
          <span className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[var(--accent-500)] transition-colors"
            style={{ color: 'var(--text-primary)' }}>
            {prev.title}
          </span>
          {prev.description && (
            <span className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
              {prev.description}
            </span>
          )}
        </Link>
      ) : (
        <div />
      )}

      {/* Next */}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col gap-1.5 p-4 rounded-xl border transition-all duration-200 sm:text-right sm:items-end"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          rel="next"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold sm:flex-row-reverse"
            style={{ color: `var(${accentVar})` }}>
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Next
          </span>
          {next.label && (
            <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
              {next.label}
            </span>
          )}
          <span className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[var(--accent-500)] transition-colors"
            style={{ color: 'var(--text-primary)' }}>
            {next.title}
          </span>
          {next.description && (
            <span className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
              {next.description}
            </span>
          )}
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
