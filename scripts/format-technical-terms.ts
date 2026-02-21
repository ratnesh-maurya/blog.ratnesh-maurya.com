/**
 * Format technical-terms/*.md: add ## headings, replace [N] with markdown links from links.txt,
 * remove pasted reference blocks, add questions array to frontmatter for FAQPage SEO.
 * Run: npx tsx scripts/format-technical-terms.ts
 */
import fs from 'fs';
import path from 'path';

const LINKS_PATH = path.join(process.cwd(), 'links.txt');
const TERMS_DIR = path.join(process.cwd(), 'content', 'technical-terms');

type RefEntry = { title: string; url: string };
const refMap = new Map<number, RefEntry>();

function parseLinksFile(): void {
  const text = fs.readFileSync(LINKS_PATH, 'utf8');
  const lines = text.split('\n').map((l) => l.trim());
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^\[(\d+)\](?:\s*\[\d+\])*\s*(.+)$/);
    if (match) {
      const title = match[2].trim();
      const urlLine = lines[i + 1];
      const url = urlLine?.startsWith('http') ? urlLine.trim() : '';
      const numbers = line.match(/\d+/g);
      if (numbers && url) {
        const entry: RefEntry = { title, url };
        numbers.forEach((n) => refMap.set(parseInt(n, 10), entry));
      }
      i += 2;
    } else {
      i += 1;
    }
  }
}

function cleanupDoubleLinks(content: string): string {
  return content.replace(
    /(\]\((https?[^)]+)\)\s*"[^"]*"\))\s*\]\s*\(\2\)\s*".*?"\)/g,
    (_, keep) => keep
  );
}

function replaceRefs(content: string): string {
  let out = content;
  out = cleanupDoubleLinks(out);
  return out.replace(/(?<!\\)\[(\d+)\]/g, (_, num) => {
    const n = parseInt(num, 10);
    const entry = refMap.get(n);
    if (!entry) return `[${num}]`;
    const label = entry.title.length > 55 ? entry.title.slice(0, 52) + '…' : entry.title;
    return `[\\[${num}\\]](${entry.url} "${label}")`;
  });
}

const SECTION_LABELS = [
  'Definition',
  'Core concept',
  'Use cases',
  'Trade-offs',
  'Example',
  'References',
  'Sources',
] as const;

function stripPastedRefBlock(body: string): string {
  const sourcesIndex = body.search(/\nSources:\s/);
  if (sourcesIndex === -1) return body;
  return body.slice(0, sourcesIndex).trimEnd();
}

function bodyWithHeadings(body: string): string {
  let out = '';
  let remaining = body;
  const labelPattern = new RegExp(
    `^(${SECTION_LABELS.join('|')})(?:\s*\\([^)]+\\))?:\\s*`,
    'im'
  );
  while (remaining.length > 0) {
    const match = remaining.match(labelPattern);
    if (!match) {
      const nextLabel = remaining.search(
        new RegExp(`\n(${SECTION_LABELS.join('|')})(?:\s*\\([^)]+\\))?:\\s*`, 'im')
      );
      if (nextLabel === -1) {
        out += remaining.trim();
        break;
      }
      out += remaining.slice(0, nextLabel).trim();
      remaining = remaining.slice(nextLabel);
      continue;
    }
    const label = match[1];
    if (label.toLowerCase() === 'sources') {
      break;
    }
    const rest = remaining.slice(match.index! + match[0].length);
    const nextMatch = rest.match(new RegExp(`\n(${SECTION_LABELS.join('|')})(?:\s*\\([^)]+\\))?:\\s*`, 'im'));
    const sectionEnd = nextMatch ? nextMatch.index! : rest.length;
    const sectionBody = rest.slice(0, sectionEnd).trim();
    if (out) out += '\n\n';
    out += `## ${label}\n\n${sectionBody}`;
    remaining = nextMatch ? rest.slice(nextMatch.index!) : '';
  }
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

function defaultQuestions(title: string, description: string): Array<{ question: string; answer: string }> {
  const shortDesc = description.slice(0, 300).replace(/\[\[\d+\]\]\([^)]+\)/g, '').trim();
  return [
    { question: `What is ${title}?`, answer: shortDesc || `${title} is a technical concept in databases and system design.` },
    { question: `When is ${title} used?`, answer: `See the Use cases section above for when ${title} is applied.` },
    { question: `What are the trade-offs of ${title}?`, answer: `See the Trade-offs section above for the trade-offs of ${title}.` },
  ];
}

function extractFrontmatter(raw: string): { fm: string; body: string } {
  const dash = raw.indexOf('---', 3);
  if (raw.startsWith('---') && dash > 0) {
    let fm = raw.slice(3, dash).trim();
    if (fm.endsWith('---')) fm = fm.slice(0, -3).trimEnd();
    return { fm, body: raw.slice(dash + 3).trim() };
  }
  return { fm: '', body: raw };
}

function addQuestionsToFrontmatter(fm: string, title: string, description: string): string {
  if (fm.includes('questions:') || fm.includes('faq:')) return fm;
  const questions = defaultQuestions(title, description);
  const yamlFaq = `questions:\n${questions.map((q) => `  - question: "${q.question.replace(/"/g, '\\"')}"\n    answer: "${q.answer.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`).join('\n')}`;
  const insertPos = fm.trimEnd().length;
  const withNewline = fm.endsWith('\n') ? fm : fm + '\n';
  return withNewline + yamlFaq + '\n';
}

function main(): void {
  parseLinksFile();
  console.log(`Parsed ${refMap.size} reference numbers from links.txt`);

  const files = fs.readdirSync(TERMS_DIR).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(TERMS_DIR, file);
    let raw = fs.readFileSync(filePath, 'utf8');
    const { fm, body: rawBody } = extractFrontmatter(raw);
    let body = stripPastedRefBlock(rawBody);
    body = replaceRefs(body);
    body = bodyWithHeadings(body);

    const titleMatch = fm.match(/title:\s*["']([^"']+)["']/);
    const descMatch = fm.match(/description:\s*["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
    const description = descMatch ? descMatch[1] : '';

    let newFm = addQuestionsToFrontmatter(fm, title, description);
    const out = `---\n${newFm.trimEnd()}\n---\n\n${body}\n`;
    fs.writeFileSync(filePath, out, 'utf8');
    console.log(`Formatted ${file}`);
  }
  console.log(`Done. Formatted ${files.length} files.`);
}

main();
