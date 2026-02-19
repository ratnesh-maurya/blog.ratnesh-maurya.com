import { Metadata } from 'next';
import { BreadcrumbStructuredData, GlossaryStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Glossary — Backend & System Design Terms | Ratn Labs',
  description: 'Definitions for common backend engineering, system design, Go, and distributed systems terms. Clear explanations with real-world context.',
  keywords: ['backend glossary', 'system design terms', 'distributed systems glossary', 'Go terms', 'CAP theorem', 'idempotency', 'microservices', 'inode', 'ACID', 'event sourcing'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/glossary' },
  openGraph: {
    title: 'Glossary — Backend & System Design Terms | Ratn Labs',
    description: 'Clear definitions for common backend, system design, and distributed systems terms.',
    url: 'https://blog.ratnesh-maurya.com/glossary',
    siteName: 'Ratn Labs',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Glossary — Backend Terms | Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

const terms = [
  {
    category: 'Distributed Systems',
    items: [
      { term: 'CAP Theorem', def: 'A distributed system can only guarantee two of three properties simultaneously: Consistency, Availability, and Partition Tolerance. In practice, network partitions are unavoidable, so the real choice is between CP (consistent but may be unavailable) and AP (always available but may return stale data).' },
      { term: 'Eventual Consistency', def: 'A consistency model where, given no new updates, all replicas of a piece of data will eventually converge to the same value. Common in systems like DynamoDB, Cassandra, and DNS. Suitable when temporary staleness is acceptable.' },
      { term: 'Idempotency', def: 'An operation is idempotent if executing it multiple times produces the same result as executing it once. Critical for APIs (especially payment endpoints) to safely handle retries without duplicating side effects. HTTP GET, PUT, DELETE are idempotent; POST typically is not.' },
      { term: 'Consensus Algorithm', def: 'A protocol that allows distributed nodes to agree on a single value even when some nodes fail. Examples: Raft (used in etcd, CockroachDB) and Paxos. Required for distributed leader election and log replication.' },
      { term: 'Two-Phase Commit (2PC)', def: 'A distributed transaction protocol ensuring all participants either commit or rollback together. Phase 1: coordinator asks all nodes to prepare. Phase 2: coordinator sends commit/rollback. Drawback: blocking — if coordinator crashes after prepare, nodes are stuck.' },
    ],
  },
  {
    category: 'System Design',
    items: [
      { term: 'Horizontal Scaling', def: 'Adding more machines to distribute load (scale out), as opposed to vertical scaling (adding more CPU/RAM to one machine, scale up). Horizontal scaling enables near-infinite capacity but requires stateless services and a load balancer.' },
      { term: 'Load Balancer', def: 'A component that distributes incoming requests across multiple servers. Strategies: round-robin, least connections, IP hash, weighted. Layer 4 balancers work at TCP level; Layer 7 at HTTP level (can route by URL path, headers, etc.).' },
      { term: 'Circuit Breaker', def: 'A fault-tolerance pattern that detects failures and stops sending requests to a failing service, giving it time to recover. States: Closed (normal), Open (failing, reject all), Half-Open (test with limited traffic). Prevents cascading failures.' },
      { term: 'Backpressure', def: 'A mechanism to signal upstream producers to slow down when downstream consumers cannot keep up. Essential in streaming systems and queues to prevent memory exhaustion and cascading failures.' },
      { term: 'Sharding', def: 'Splitting a database horizontally across multiple machines, where each shard holds a subset of the data. A shard key determines which shard stores each record. Enables horizontal scaling of databases but complicates cross-shard queries and transactions.' },
    ],
  },
  {
    category: 'Database',
    items: [
      { term: 'ACID', def: 'Properties guaranteeing database transaction reliability. Atomicity (all or nothing), Consistency (data stays valid), Isolation (concurrent transactions don\'t interfere), Durability (committed data persists). Traditional relational databases like PostgreSQL are ACID-compliant.' },
      { term: 'Index', def: 'A data structure (typically a B-tree or hash) that speeds up data retrieval at the cost of extra storage and slower writes. Without an index, a query scans every row. With one, it jumps directly to matching rows. Always index foreign keys and frequently filtered columns.' },
      { term: 'N+1 Query Problem', def: 'A performance anti-pattern where fetching N records then making one additional query per record results in N+1 total queries. Example: fetching 100 users then querying each user\'s posts individually. Fix: use JOIN or batch loading (e.g., SQL IN clause).' },
      { term: 'Optimistic Locking', def: 'A concurrency strategy where a transaction assumes no conflict will occur and only checks for conflicts at commit time (usually via a version number or timestamp). Lower contention than pessimistic locking but requires retry logic on conflict.' },
      { term: 'Connection Pooling', def: 'Reusing a fixed set of database connections rather than opening/closing one per request. Opening a DB connection is expensive (~30ms). A pool keeps connections alive and lends them to requests. Essential for any production web service.' },
    ],
  },
  {
    category: 'Go',
    items: [
      { term: 'Goroutine', def: 'A lightweight thread managed by the Go runtime, not the OS. Goroutines start with ~2KB stack (growing as needed) vs OS threads at ~1MB. You can run millions concurrently. Scheduled cooperatively by the Go runtime\'s M:N scheduler.' },
      { term: 'Channel', def: 'A typed conduit for communication between goroutines. Unbuffered channels synchronise sender and receiver. Buffered channels allow sending up to N values without a receiver. Closing a channel signals receivers that no more values will be sent.' },
      { term: 'defer', def: 'Schedules a function call to run when the surrounding function returns, in LIFO order. Commonly used for cleanup (file.Close(), mu.Unlock(), span.End()). Deferred functions run even if the function panics, making them useful for ensuring resource release.' },
      { term: 'Interface', def: 'An implicit contract in Go — a type implements an interface simply by having the required methods, no explicit declaration needed. Enables powerful composition and testability. The empty interface (interface{} or any) accepts any type.' },
      { term: 'Context', def: 'A standard way to carry deadlines, cancellation signals, and request-scoped values across API boundaries and goroutines. Always accept context.Context as the first argument in functions that do I/O. Cancel contexts when done to release resources.' },
    ],
  },
  {
    category: 'Cloud & Infrastructure',
    items: [
      { term: 'IaC (Infrastructure as Code)', def: 'Managing infrastructure (servers, networks, databases) through machine-readable configuration files rather than manual processes. Tools: Terraform, Pulumi, AWS CloudFormation. Enables version control, reproducibility, and automated deployment of infrastructure.' },
      { term: 'Immutable Infrastructure', def: 'A practice where servers are never modified after deployment. Instead of updating a running server, you build a new image and replace the old one. Eliminates configuration drift, simplifies rollbacks, and makes deployments predictable.' },
      { term: 'Service Mesh', def: 'An infrastructure layer for service-to-service communication, typically implemented as sidecar proxies (e.g., Envoy). Handles traffic management, mTLS, observability, and retries without changing application code. Istio and Linkerd are common implementations.' },
      { term: 'Blue-Green Deployment', def: 'A release strategy with two identical production environments (Blue = current, Green = new). Traffic switches from Blue to Green atomically. Enables zero-downtime deployments and instant rollback by switching traffic back.' },
      { term: 'Observability', def: 'The ability to infer the internal state of a system from its external outputs. The three pillars: Logs (discrete events), Metrics (numeric measurements over time), Traces (request flows across services). A system is observable if you can debug novel failures without deploying new code.' },
    ],
  },
  {
    category: 'File Systems & OS',
    items: [
      { term: 'Inode', def: 'A data structure on a Unix filesystem that stores metadata about a file (permissions, owner, size, timestamps, block locations) — everything except the filename. The directory maps filenames to inode numbers. Hard links are multiple directory entries pointing to the same inode.' },
      { term: 'Journaling', def: 'A filesystem technique that keeps a log (journal) of changes before committing them, enabling recovery after crashes without full disk scans. ext4 and NTFS use journaling. The journal can be written in ordered, writeback, or full-journal mode with different safety/performance tradeoffs.' },
      { term: 'Memory-Mapped File', def: 'A segment of virtual memory mapped directly to a file. Reads/writes to the memory region are automatically synchronised to disk by the OS. Useful for large files and inter-process communication. Used heavily by databases for efficient I/O.' },
    ],
  },
];

export default function GlossaryPage() {
  const allTerms = terms.flatMap(c => c.items);
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Glossary', url: 'https://blog.ratnesh-maurya.com/glossary' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <GlossaryStructuredData terms={terms} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

        {/* Header */}
        <div className="hero-gradient-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Reference
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Engineering{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Glossary
              </span>
            </h1>
            <p className="text-base leading-relaxed max-w-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
              Clear definitions for backend, system design, Go, and distributed systems terms — with real-world context, not just dictionary copy.
            </p>
            <div className="flex flex-wrap gap-4 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{allTerms.length}</span> terms
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{terms.length}</span> categories
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {terms.map(cat => (
            <section key={cat.category} id={cat.category.toLowerCase().replace(/\s+/g, '-')}>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ color: 'var(--text-muted)' }}>
                {cat.category}
              </h2>
              <div className="space-y-4">
                {cat.items.map(item => (
                  <div key={item.term}
                    id={item.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    className="rounded-xl border p-5"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {item.term}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {item.def}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
