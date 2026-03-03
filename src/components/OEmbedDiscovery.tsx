'use client';

import { usePathname } from 'next/navigation';

const BASE = 'https://blog.ratnesh-maurya.com';
const OEMBED_ENDPOINT = `${BASE}/api/oembed`;

export function OEmbedDiscovery() {
  const pathname = usePathname();
  const pageUrl = encodeURIComponent(`${BASE}${pathname}`);

  return (
    <link
      rel="alternate"
      type="application/json+oembed"
      href={`${OEMBED_ENDPOINT}?url=${pageUrl}&format=json`}
      title="oEmbed"
    />
  );
}
