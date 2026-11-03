import Link from 'next/link';

interface BreadcrumbsProps {
  /** Last item is the current page and is not linked. */
  items: { name: string; href: string }[];
  className?: string;
}

/** Visible breadcrumb trail. The matching JSON-LD comes from BreadcrumbStructuredData. */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" style={{ color: 'var(--muted)' }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2 min-w-0">
              {isLast ? (
                <span aria-current="page" className="truncate max-w-[40ch]" style={{ color: 'var(--body)' }}>
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:underline">
                  {item.name}
                </Link>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
