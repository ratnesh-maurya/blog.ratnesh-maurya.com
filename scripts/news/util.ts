export function toISODateInTimezone(date: Date, tzone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: tzone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    const get = (t: string) => parts.find((p) => p.type === t)?.value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  } catch {
    return date.toISOString().split('T')[0];
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, what: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`${what} timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/**
 * Shortens text to at most `max` chars without cutting mid-word, preferring a
 * sentence boundary when that keeps at least `minKeep` chars.
 */
export function fitText(text: string, max: number, minKeep = Math.floor(max * 0.75)): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const head = clean.slice(0, max + 1);
  const sentenceEnd = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '));
  if (sentenceEnd + 1 >= minKeep) return clean.slice(0, sentenceEnd + 1);
  const wordEnd = head.lastIndexOf(' ');
  return clean.slice(0, wordEnd > 0 ? wordEnd : max).replace(/[\s,:;–—-]+$/, '');
}
