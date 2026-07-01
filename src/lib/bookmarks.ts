/**
 * Client-side bookmarks — localStorage only.
 * Saved posts appear on /bookmarks.
 */

export interface Bookmark {
  type: string;
  slug: string;
  title: string;
  href: string;
  savedAt: number;
}

const KEY = 'bookmarks-v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getBookmarks(): Bookmark[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(b => b && typeof b.slug === 'string' && typeof b.href === 'string');
  } catch {
    return [];
  }
}

export function isBookmarked(type: string, slug: string): boolean {
  return getBookmarks().some(b => b.type === type && b.slug === slug);
}

export function toggleBookmark(bookmark: Omit<Bookmark, 'savedAt'>): boolean {
  if (!isBrowser()) return false;
  try {
    const bookmarks = getBookmarks();
    const idx = bookmarks.findIndex(b => b.type === bookmark.type && b.slug === bookmark.slug);
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
      localStorage.setItem(KEY, JSON.stringify(bookmarks));
      return false;
    }
    bookmarks.unshift({ ...bookmark, savedAt: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(bookmarks));
    return true;
  } catch {
    return false;
  }
}

export function removeBookmark(type: string, slug: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(getBookmarks().filter(b => !(b.type === type && b.slug === slug))));
  } catch {
    // ignore
  }
}
