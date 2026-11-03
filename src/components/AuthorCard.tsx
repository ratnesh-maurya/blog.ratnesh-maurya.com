import { PERSON_IMAGE } from '@/lib/seo/person';
import { PORTFOLIO_URL } from '@/lib/site';
import Image from 'next/image';
import Link from 'next/link';

const ROLE = 'Software Engineer | Backend & AI Engineering';

const EXPERTISE = [
  'Golang',
  'Elixir',
  'Distributed Systems',
  'PostgreSQL',
  'Backend Architecture',
  'AI Engineering',
  'MCP',
  'Cloud Infrastructure',
];

interface AuthorCardProps {
  /** Overrides the displayed name when an article credits a different byline. */
  name?: string;
}

/** Author box for article pages — E-E-A-T attribution, links to the About page. */
export function AuthorCard({ name = 'Ratnesh Maurya' }: AuthorCardProps) {
  return (
    <aside
      aria-labelledby="author-card-name"
      className="mt-14 flex flex-col sm:flex-row items-start gap-5 rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, var(--surface) 0%, color-mix(in srgb, var(--accent-50) 40%, var(--surface)) 100%)',
        border: '1px solid var(--line)',
      }}
    >
      <Image
        src={PERSON_IMAGE}
        alt={name}
        width={64}
        height={64}
        className="w-16 h-16 rounded-2xl flex-shrink-0 object-cover"
        style={{ outline: '2px solid var(--accent-200)' }}
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
          About the author
        </p>
        <h2 id="author-card-name" className="text-base font-bold" style={{ color: 'var(--text)' }}>
          {name}
        </h2>
        <p className="text-sm mb-2" style={{ color: 'var(--accent-600)' }}>{ROLE}</p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--body)' }}>
          Writes about backend systems, distributed systems and AI engineering, with Go, Elixir and PostgreSQL.
        </p>
        <ul className="flex flex-wrap gap-1.5 mb-4" aria-label="Areas of expertise">
          {EXPERTISE.map((item) => (
            <li
              key={item}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/about"
            rel="author"
            className="text-xs font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            About {name.split(' ')[0]} →
          </Link>
          <a
            href="https://github.com/ratnesh-maurya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold"
            style={{ color: 'var(--muted)' }}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/ratnesh-maurya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold"
            style={{ color: 'var(--muted)' }}
          >
            LinkedIn
          </a>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold"
            style={{ color: 'var(--muted)' }}
          >
            Portfolio ↗
          </a>
        </div>
      </div>
    </aside>
  );
}
