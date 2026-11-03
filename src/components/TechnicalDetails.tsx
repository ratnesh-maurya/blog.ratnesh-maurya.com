import type { BlogPost } from '@/types/blog';

type Details = Pick<BlogPost, 'language' | 'framework' | 'softwareVersion' | 'testedEnvironment' | 'repo'>;

/** Facts about the article's code. Renders nothing unless at least one field is set. */
export function TechnicalDetails({ language, framework, softwareVersion, testedEnvironment, repo }: Details) {
  const rows: { label: string; value: React.ReactNode }[] = [];
  if (language) rows.push({ label: 'Language', value: language });
  if (framework) rows.push({ label: 'Framework', value: framework });
  if (softwareVersion) rows.push({ label: 'Version', value: softwareVersion });
  if (testedEnvironment) rows.push({ label: 'Tested on', value: testedEnvironment });
  if (repo) {
    rows.push({
      label: 'Code',
      value: (
        <a href={repo} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--accent-600)' }}>
          {repo.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      ),
    });
  }
  if (rows.length === 0) return null;

  return (
    <section
      aria-label="Technical details"
      className="mb-10 rounded-xl px-5 py-4"
      style={{ border: '1px solid var(--line)', background: 'var(--glass-bg)' }}
    >
      <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="font-semibold" style={{ color: 'var(--muted)' }}>{row.label}</dt>
            <dd className="min-w-0 break-words" style={{ color: 'var(--text)' }}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Official docs and sources the article relies on. Renders nothing when there are none. */
export function ArticleReferences({ references }: { references?: BlogPost['references'] }) {
  if (!references || references.length === 0) return null;
  return (
    <section aria-labelledby="article-references" className="pt-10" style={{ borderTop: '1px solid var(--line)' }}>
      <h2 id="article-references" className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
        References
      </h2>
      <ol className="list-decimal pl-5 space-y-1.5 text-sm" style={{ color: 'var(--body)' }}>
        {references.map((ref) => (
          <li key={ref.url}>
            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--accent-600)' }}>
              {ref.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
