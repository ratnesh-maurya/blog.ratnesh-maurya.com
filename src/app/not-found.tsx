'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Daily news', href: '/news' },
  { label: 'Technical terms', href: '/technical-terms' },
  { label: 'TIL', href: '/til' },
  { label: 'Cheatsheets', href: '/cheatsheets' },
  { label: 'About', href: '/about' },
];

export default function NotFound() {
  const pathname = usePathname() || '/';

  return (
    <div className="nf">
      <div className="sky sky-soft" aria-hidden="true" />
      <div className="wrap nf-grid">
        <div>
          <p className="nf-num" lang="hi" aria-label="404">४०४</p>
          <h1 className="display">This page took a <em>wrong turn</em></h1>
          <p className="lede">
            The link is old, mistyped, or the post moved. Here is exactly what the server saw.
          </p>
        </div>

        <div className="trace" role="group" aria-label="What happened">
          <div className="trace-bar">
            <i /><i /><i />
            <span>blog.ratneshmaurya.com</span>
          </div>
          <pre className="trace-body">
            <span className="t-dim">$</span> GET <span className="t-path">{pathname}</span>{'\n'}
            <span className="t-dim">→</span> router: <span className="t-bad">404 · no page here</span>{'\n'}
            <span className="t-dim">→</span> no close match — try one below{'\n'}
            <span className="t-dim">→</span> or press ⌘K to search every post
          </pre>
          <ul className="trace-links">
            {links.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
