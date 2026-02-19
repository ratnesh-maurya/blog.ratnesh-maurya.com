import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbStructuredData, CheatsheetStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'PostgreSQL Cheatsheet — Queries, Indexes & JSONB | Ratn Labs',
  description: 'Quick reference for PostgreSQL queries, indexes, JSONB operations, common admin commands, and performance patterns.',
  keywords: ['PostgreSQL cheatsheet', 'postgres reference', 'SQL cheatsheet', 'JSONB queries', 'PostgreSQL indexes', 'psql commands'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/cheatsheets/postgres' },
  openGraph: { title: 'PostgreSQL Cheatsheet — Ratn Labs', url: 'https://blog.ratnesh-maurya.com/cheatsheets/postgres', siteName: 'Ratn Labs', type: 'article' },
  twitter: { card: 'summary_large_image', title: 'PostgreSQL Cheatsheet — Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: 'psql CLI',
    code: `psql -U user -d dbname -h localhost
\\l                    -- list databases
\\c dbname             -- connect to database
\\dt                   -- list tables
\\d tablename          -- describe table
\\di                   -- list indexes
\\df                   -- list functions
\\x                    -- toggle expanded output
\\timing               -- show query time
\\e                    -- open query in editor
\\q                    -- quit`,
  },
  {
    title: 'Table Operations',
    code: `-- Create
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    email      TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alter
ALTER TABLE users ADD COLUMN age INT;
ALTER TABLE users DROP COLUMN age;
ALTER TABLE users RENAME COLUMN name TO full_name;
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Drop
DROP TABLE users;
DROP TABLE IF EXISTS users CASCADE;`,
  },
  {
    title: 'Core Queries',
    code: `-- SELECT with filtering and sorting
SELECT id, name, email
FROM users
WHERE created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;

-- COUNT and GROUP BY
SELECT category, COUNT(*) AS total
FROM posts
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY total DESC;

-- JOIN
SELECT u.name, p.title
FROM users u
JOIN posts p ON p.user_id = u.id
WHERE u.active = true;

-- LEFT JOIN (include users with no posts)
SELECT u.name, COUNT(p.id) AS post_count
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
GROUP BY u.id, u.name;`,
  },
  {
    title: 'Insert, Update, Delete',
    code: `-- Insert
INSERT INTO users (email, name) VALUES ('x@example.com', 'Alice');

-- Upsert (insert or update on conflict)
INSERT INTO users (email, name)
VALUES ('x@example.com', 'Alice')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;

-- Update
UPDATE users SET name = 'Bob', updated_at = NOW()
WHERE id = 42;

-- Delete
DELETE FROM users WHERE id = 42;

-- Returning modified rows
UPDATE users SET active = false WHERE id = 42 RETURNING *;`,
  },
  {
    title: 'Indexes',
    code: `-- B-tree (default, good for =, <, >, BETWEEN, ORDER BY)
CREATE INDEX idx_users_email ON users (email);

-- Partial index (smaller, faster for filtered queries)
CREATE INDEX idx_active_users ON users (created_at) WHERE active = true;

-- Composite index
CREATE INDEX idx_posts_user_date ON posts (user_id, created_at DESC);

-- Unique index
CREATE UNIQUE INDEX idx_users_email_unique ON users (email);

-- GIN index for JSONB and full-text search
CREATE INDEX idx_metadata ON posts USING GIN (metadata);

-- Check index usage
SELECT * FROM pg_stat_user_indexes WHERE relname = 'users';

-- Drop index concurrently (no lock)
DROP INDEX CONCURRENTLY idx_users_email;`,
  },
  {
    title: 'JSONB',
    code: `-- Create column
ALTER TABLE posts ADD COLUMN metadata JSONB;

-- Insert
INSERT INTO posts (metadata)
VALUES ('{"tags": ["go", "aws"], "views": 100}');

-- Query operators
-- @>  contains
SELECT * FROM posts WHERE metadata @> '{"status": "published"}';

-- ?   key exists
SELECT * FROM posts WHERE metadata ? 'tags';

-- ->> get value as text
SELECT metadata->>'author' FROM posts;

-- #>> get nested value
SELECT metadata#>>'{address,city}' FROM posts;

-- Update nested key
UPDATE posts SET metadata = jsonb_set(metadata, '{views}', '200');

-- GIN index for fast JSONB queries
CREATE INDEX idx_posts_meta ON posts USING GIN (metadata);`,
  },
  {
    title: 'Transactions',
    code: `BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Rollback on error
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  -- something fails
ROLLBACK;

-- Savepoints
BEGIN;
  SAVEPOINT sp1;
  UPDATE ...;
  ROLLBACK TO sp1;   -- undo only to savepoint
COMMIT;`,
  },
  {
    title: 'Useful Queries',
    code: `-- Table sizes
SELECT relname AS table,
       pg_size_pretty(pg_total_relation_size(relid)) AS size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Slow queries (requires pg_stat_statements extension)
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Lock monitoring
SELECT pid, query, state, wait_event_type, wait_event
FROM pg_stat_activity
WHERE wait_event IS NOT NULL;

-- Kill a connection
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE datname = 'mydb' AND pid <> pg_backend_pid();`,
  },
];

export default function PostgresCheatsheetPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Cheatsheets', url: 'https://blog.ratnesh-maurya.com/cheatsheets' },
    { name: 'PostgreSQL', url: 'https://blog.ratnesh-maurya.com/cheatsheets/postgres' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <CheatsheetStructuredData
        title="PostgreSQL Cheatsheet — Queries, Indexes & JSONB"
        description="Quick reference for PostgreSQL queries, indexes, JSONB operations, common admin commands, and performance patterns."
        slug="postgres"
        keywords={['PostgreSQL', 'postgres cheatsheet', 'SQL reference', 'JSONB', 'indexes', 'psql commands', 'transactions']}
      />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <Link href="/cheatsheets" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Cheatsheets
          </Link>

          <div className="flex items-center gap-3 mb-10">
            <span className="text-4xl">🐘</span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                PostgreSQL Cheatsheet
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Queries, indexes, JSONB, transactions, and admin reference
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map(section => (
              <div key={section.title}>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)' }}>
                  {section.title}
                </h2>
                <pre className="rounded-xl p-5 text-sm leading-relaxed overflow-x-auto"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono, monospace)' }}>
                  <code>{section.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
