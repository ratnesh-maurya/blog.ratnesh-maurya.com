import type { BlogPost } from '@/types/blog';
import Link from 'next/link';

/**
 * Server-rendered stand-in for <BlogListingClient> while it hydrates.
 *
 * BlogListingClient reads `useSearchParams`, which makes everything inside the nearest
 * Suspense boundary render on the client only. Wrapping it in its own boundary keeps the
 * rest of the page (JSON-LD, breadcrumbs) in the static HTML, and this list puts real,
 * crawlable links to every post in it too. It is replaced as soon as the client mounts.
 */
export function BlogListingFallback({ posts, title }: { posts: Pick<BlogPost, 'slug' | 'title' | 'description'>[]; title: string }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6" style={{ color: 'var(--text)' }}>
        {title}
      </h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}/`} className="font-semibold hover:underline" style={{ color: 'var(--text)' }}>
              {post.title}
            </Link>
            {post.description && (
              <p className="text-sm mt-1" style={{ color: 'var(--body)' }}>{post.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
