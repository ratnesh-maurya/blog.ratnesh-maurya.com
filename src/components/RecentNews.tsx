import Link from 'next/link';

interface NewsPost {
  slug: string;
  title: string;
  date: string;
}

interface RecentNewsProps {
  news: NewsPost[];
  currentSlug?: string;
  count?: number;
}

export function RecentNews({ news, currentSlug, count = 3 }: RecentNewsProps) {
  const filtered = currentSlug ? news.filter((n) => n.slug !== currentSlug) : news;
  const recent = filtered.slice(0, count);

  if (recent.length === 0) return null;

  return (
    <section className="mt-12 pt-8" style={{ borderTop: '2px solid var(--nb-border)' }} aria-label="Recent News">
      <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
        Recent News
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recent.map((item, i) => (
          <Link
            key={item.slug}
            href={`/news/${item.slug}`}
            className="group nb-card flex flex-col gap-1.5 p-4 transition-all duration-200 hover:-translate-y-1"
            style={{ backgroundColor: `var(--nb-card-${(i + 3) % 6})` }}
          >
            <span className="nb-badge nb-badge-muted self-start">
              News Digest
            </span>
            <span className="text-sm font-bold leading-snug line-clamp-2 nb-title-hover" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </span>
            <span className="text-xs mt-auto pt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>
              {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
