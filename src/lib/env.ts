/**
 * True when the app is running in production (e.g. `next start`).
 * In development (`next dev`), analytics and stats-update APIs are not called.
 */
export const isProduction =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

/**
 * True when the current browser has the __exclude_tracking cookie set
 * by the middleware (IP-based exclusion).
 */
export function isExcludedUser(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim().startsWith('__exclude_tracking='));
}

/**
 * Combined check: tracking is allowed only in production AND when the user is not excluded.
 */
export function shouldTrack(): boolean {
  return isProduction && !isExcludedUser();
}
