import fs from 'fs';
import path from 'path';
import { buildFeedXml } from '../src/lib/feeds/feed';
import { buildRssXml } from '../src/lib/feeds/rss';

// Feeds are written to public/ so the CDN serves them as static files
// (no serverless function runs when a feed reader fetches them).
async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), await buildRssXml());
  fs.writeFileSync(path.join(publicDir, 'feed.xml'), await buildFeedXml());
  console.log('Feeds written: public/rss.xml, public/feed.xml');
}

main().catch((e) => {
  console.error('generate-feeds failed:', e);
  process.exit(1);
});
