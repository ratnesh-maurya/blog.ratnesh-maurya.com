import Link from 'next/link';

interface TermLink {
  slug: string;
  title: string;
  category?: string;
}

interface RelatedTermsProps {
  terms: TermLink[];
  currentSlug?: string;
  count?: number;
}

export function RelatedTerms({ terms, currentSlug, count = 10 }: RelatedTermsProps) {
  const filteredTerms = currentSlug ? terms.filter((t) => t.slug !== currentSlug) : terms;
  const displayTerms = filteredTerms.slice(0, count);

  if (displayTerms.length === 0) return null;

  return (
    <aside aria-label="Related technical terms" className="mt-10 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
        Explore Technical Terms
      </h3>
      <div className="flex flex-wrap gap-2">
        {displayTerms.map(term => (
          <Link
            key={term.slug}
            href={`/technical-terms/${term.slug}/`}
            className="nb-badge nb-badge-primary transition-opacity duration-150 hover:opacity-75"
          >
            {term.title}
          </Link>
        ))}
      </div>
    </aside>
  );
}
