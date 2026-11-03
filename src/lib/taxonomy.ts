import type { BlogPost } from '@/types/blog';

/** URL slug for a tag or category. Matches the tag slugs already used in the sitemap. */
export function slugifyTerm(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, '-');
}

export function tagPath(tag: string): string {
  return `/blog/tag/${encodeURIComponent(slugifyTerm(tag))}/`;
}

export function categoryPath(category: string): string {
  return `/blog/category/${encodeURIComponent(slugifyTerm(category))}/`;
}

export interface CategorySummary {
  label: string;
  slug: string;
  count: number;
  latestDate: string;
}

/** Distinct categories across posts, most posts first. Label is the first spelling seen. */
export function getCategories(posts: Pick<BlogPost, 'category' | 'date' | 'updated'>[]): CategorySummary[] {
  const map = new Map<string, CategorySummary>();
  for (const post of posts) {
    const label = post.category?.trim();
    if (!label) continue;
    const slug = slugifyTerm(label);
    const when = post.updated || post.date;
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
      if (when > existing.latestDate) existing.latestDate = when;
    } else {
      map.set(slug, { label, slug, count: 1, latestDate: when });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
