'use client';

import { useEffect } from 'react';

/** Registers the offline service worker (production only). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // registration failure is non-fatal (private mode, unsupported, etc.)
    });
  }, []);

  return null;
}
