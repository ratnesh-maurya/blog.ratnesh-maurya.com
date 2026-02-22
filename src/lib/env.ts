/**
 * True when the app is running in production (e.g. `next start`).
 * In development (`next dev`), analytics and stats-update APIs are not called.
 */
export const isProduction =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
