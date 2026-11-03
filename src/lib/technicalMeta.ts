import type { ArticleReference, BlogPost } from '@/types/blog';

type TechnicalMeta = Pick<
  BlogPost,
  'language' | 'framework' | 'softwareVersion' | 'testedEnvironment' | 'repo' | 'references'
>;

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function httpUrl(value: unknown): string | undefined {
  const raw = text(value);
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Reads the optional technical-article frontmatter fields. Anything missing or malformed
 * (non-string values, non-http(s) URLs, references without a title or url) is dropped, so
 * existing articles are unaffected and bad frontmatter never reaches the page or JSON-LD.
 */
export function parseTechnicalMeta(data: Record<string, unknown>): TechnicalMeta {
  const references: ArticleReference[] = Array.isArray(data.references)
    ? data.references.flatMap((ref): ArticleReference[] => {
        if (!ref || typeof ref !== 'object') return [];
        const { title, url } = ref as Record<string, unknown>;
        const cleanTitle = text(title);
        const cleanUrl = httpUrl(url);
        return cleanTitle && cleanUrl ? [{ title: cleanTitle, url: cleanUrl }] : [];
      })
    : [];

  return {
    language: text(data.language),
    framework: text(data.framework),
    softwareVersion: text(data.softwareVersion),
    testedEnvironment: text(data.testedEnvironment),
    repo: httpUrl(data.repo),
    references: references.length > 0 ? references : undefined,
  };
}
