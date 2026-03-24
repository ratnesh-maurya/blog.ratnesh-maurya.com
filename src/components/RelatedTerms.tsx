import Link from 'next/link';

interface TermLink {
  slug: string;
  title: string;
}

interface RelatedTermsProps {
  terms: TermLink[];
}

export function RelatedTerms({ terms }: RelatedTermsProps) {
  if (terms.length === 0) return null;

  return (
    <aside aria-label="Related technical terms" className="mt-10 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
        Related Technical Terms
      </h3>
      <div className="flex flex-wrap gap-2">
        {terms.map(term => (
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
