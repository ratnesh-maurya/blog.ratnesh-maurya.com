export interface OgOptions {
  title: string;
  subtitle: string;
  breadcrumb?: string;
  accent?: string;
}

const BASE = 'https://blog.ratnesh-maurya.com';

/** OPENGRAPH-SETUP §3 — default OG image path (resolved with metadataBase) */
export const defaultOgImageUrl = `${BASE}/opengraph-image`;
