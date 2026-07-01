/**
 * Client-side reading history — localStorage only, no server round-trips.
 * Powers "Continue reading" on the homepage and scroll-position resume.
 */

export interface ReadingHistoryEntry {
  type: string;        // 'blog' | 'news' | 'til' | 'cheatsheets' | ...
  slug: string;
  title: string;
  href: string;
  progress: number;    // 0–100, % of page scrolled
  scrollY: number;     // absolute scroll position for resume
  updatedAt: number;   // epoch ms
}

const KEY = 'reading-history-v1';
const MAX_ENTRIES = 10;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getReadingHistory(): ReadingHistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(e => e && typeof e.slug === 'string' && typeof e.href === 'string');
  } catch {
    return [];
  }
}

export function recordReadingProgress(entry: Omit<ReadingHistoryEntry, 'updatedAt'>): void {
  if (!isBrowser()) return;
  try {
    const history = getReadingHistory().filter(
      e => !(e.type === entry.type && e.slug === entry.slug)
    );
    history.unshift({ ...entry, updatedAt: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)));
  } catch {
    // storage full / privacy mode — silently skip
  }
}

export function getEntry(type: string, slug: string): ReadingHistoryEntry | undefined {
  return getReadingHistory().find(e => e.type === type && e.slug === slug);
}

/** Entries worth resuming: started but not finished, most recent first. */
export function getContinueReading(limit = 3): ReadingHistoryEntry[] {
  return getReadingHistory()
    .filter(e => e.progress >= 5 && e.progress < 90)
    .slice(0, limit);
}

/** Most recently viewed, regardless of progress. */
export function getRecentlyViewed(limit = 5): ReadingHistoryEntry[] {
  return getReadingHistory().slice(0, limit);
}
