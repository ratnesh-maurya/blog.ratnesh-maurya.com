import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

// Bump when the remark/rehype pipeline below changes so stale HTML is not reused.
const PIPELINE_VERSION = '1';

// .next/cache is restored between Vercel builds, so unchanged posts skip re-rendering.
const cacheDir = path.join(process.cwd(), '.next', 'cache', 'markdown-html');
const memo = new Map<string, Promise<string>>();

async function render(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);
  return file.toString();
}

/** Markdown → HTML, memoized per process and cached on disk by content hash. */
export function renderMarkdown(markdown: string): Promise<string> {
  const key = crypto.createHash('sha256').update(PIPELINE_VERSION).update(markdown).digest('hex');
  const hit = memo.get(key);
  if (hit) return hit;

  const pending = (async () => {
    const cached = path.join(cacheDir, `${key}.html`);
    try {
      return fs.readFileSync(cached, 'utf8');
    } catch {
      // cache miss
    }
    const html = await render(markdown);
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(cached, html);
    } catch {
      // read-only fs or race with another worker; the cache is best-effort
    }
    return html;
  })();
  memo.set(key, pending);
  return pending;
}
