import { PERSON_IMAGE } from '@/lib/seo/person';
import { categoryPath } from '@/lib/taxonomy';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleMetadataProps {
  author: string;
  /** Frontmatter `date` — the publish date. */
  date: string;
  /** Frontmatter `updated` — shown only when it is a valid date later than `date`. */
  updated?: string;
  readingTime?: string;
  category?: string;
  /** Rendered at the right edge (e.g. the bookmark button). */
  actions?: React.ReactNode;
}

function parse(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Byline + dates + reading time + category, placed under the article title. */
export function ArticleMetadata({ author, date, updated, readingTime, category, actions }: ArticleMetadataProps) {
  const published = parse(date);
  const modified = parse(updated);
  const showModified = published && modified && modified.getTime() > published.getTime();

  return (
    <div
      className="flex flex-wrap items-center gap-3 text-sm pb-8 border-b"
      style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
    >
      <Image
        src={PERSON_IMAGE}
        alt=""
        width={40}
        height={40}
        className="w-10 h-10 rounded-full flex-shrink-0 object-cover border"
        style={{ borderColor: 'var(--line)' }}
      />
      <div className="flex flex-col leading-tight">
        <Link
          href="/about"
          rel="author"
          className="font-bold border-b border-transparent hover:border-current transition-colors"
          style={{ color: 'var(--text)' }}
        >
          {author}
        </Link>
        <span className="flex flex-wrap items-center gap-x-1.5 mt-0.5" style={{ fontSize: '13px' }}>
          {published && (
            <time dateTime={published.toISOString()}>{format(published, 'MMMM d, yyyy')}</time>
          )}
          {readingTime && (
            <>
              <span aria-hidden="true">·</span>
              <span>{readingTime}</span>
            </>
          )}
          {category && (
            <>
              <span aria-hidden="true">·</span>
              <Link href={categoryPath(category)} className="hover:underline">{category}</Link>
            </>
          )}
        </span>
      </div>
      {actions && <span className="ml-auto">{actions}</span>}
      {showModified && modified && (
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)',
            color: 'var(--accent-600)',
            border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
          }}
        >
          Updated <time dateTime={modified.toISOString()}>{format(modified, 'MMM d, yyyy')}</time>
        </span>
      )}
    </div>
  );
}
