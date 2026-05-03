/**
 * IndexNow ping — submit URLs to Bing, Yandex, and IndexNow network.
 * Run after deploy: `tsx scripts/indexnow-ping.ts`
 * Or with specific URLs: `tsx scripts/indexnow-ping.ts /blog/my-post /about`
 *
 * API: POST https://api.indexnow.org/IndexNow
 * Bing: POST https://www.bing.com/indexnow
 * Yandex: POST https://yandex.com/indexnow
 */

const KEY = '6241a419bfa9c01e7a4abaf8340e5cce';
const HOST = 'blog.ratnesh-maurya.com';
const BASE = `https://${HOST}`;
const KEY_LOCATION = `${BASE}/${KEY}.txt`;

const ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

async function pingEndpoint(endpoint: string, urls: string[]) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  });

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });

  const status = res.status;
  const label = endpoint.replace('https://', '').split('/')[0];
  if (status === 200 || status === 202) {
    console.log(`[indexnow] ✓ ${label} accepted ${urls.length} URL(s)`);
  } else {
    const text = await res.text().catch(() => '');
    console.warn(`[indexnow] ✗ ${label} → HTTP ${status}: ${text.slice(0, 120)}`);
  }
}

async function main() {
  const cliArgs = process.argv.slice(2);

  let urls: string[];
  if (cliArgs.length > 0) {
    urls = cliArgs.map((u) => (u.startsWith('http') ? u : `${BASE}${u.startsWith('/') ? u : `/${u}`}`));
  } else {
    // Default: ping high-priority static URLs
    urls = [
      `${BASE}/`,
      `${BASE}/blog/`,
      `${BASE}/about/`,
      `${BASE}/news/`,
      `${BASE}/til/`,
      `${BASE}/technical-terms/`,
      `${BASE}/cheatsheets/`,
      `${BASE}/glossary/`,
      `${BASE}/topics/`,
      `${BASE}/series/`,
    ];
  }

  if (urls.length > 10_000) {
    console.error('[indexnow] IndexNow limit is 10,000 URLs per request');
    process.exit(1);
  }

  console.log(`[indexnow] Pinging ${ENDPOINTS.length} endpoints with ${urls.length} URL(s)…`);
  await Promise.all(ENDPOINTS.map((ep) => pingEndpoint(ep, urls)));
}

main().catch((e) => {
  console.error('[indexnow]', e);
  process.exit(1);
});
