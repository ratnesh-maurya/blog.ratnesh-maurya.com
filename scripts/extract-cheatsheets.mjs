/**
 * One-time script: extracts sections from cheatsheet page.tsx files
 * and writes content/cheatsheets/{slug}.json. Run from project root.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pagesDir = path.join(root, 'src', 'app', 'cheatsheets');
const outDir = path.join(root, 'content', 'cheatsheets');

const slugs = ['docker', 'postgres', 'kubectl'];

function extractSectionsFromTsx(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const start = raw.indexOf('const sections = [');
  if (start === -1) return null;
  let depth = 0;
  let i = start + 'const sections = ['.length;
  let inString = false;
  let stringChar = null;
  let inTemplate = false;
  let backtickCount = 0;
  let sectionStart = i;
  const sections = [];
  let current = { title: null, code: '' };
  while (i < raw.length) {
    const c = raw[i];
    if (inTemplate) {
      if (c === '`') {
        backtickCount++;
        if (backtickCount === 1) {
          current.code = '';
        } else {
          inTemplate = false;
          backtickCount = 0;
        }
      } else if (backtickCount === 1) {
        current.code += c;
      }
      i++;
      continue;
    }
    if (c === '`' && !inString) {
      inTemplate = true;
      backtickCount = 1;
      i++;
      continue;
    }
    if (inString) {
      if (raw[i] === '\\' && raw[i + 1] === stringChar) {
        i += 2;
        continue;
      }
      if (raw[i] === stringChar) {
        inString = false;
        stringChar = null;
      }
      i++;
      continue;
    }
    if ((c === "'" || c === '"') && !inString) {
      inString = true;
      stringChar = c;
      i++;
      continue;
    }
    if (c === '{') depth++;
    if (c === '}') {
      depth--;
      if (depth === 0 && current.title) {
        sections.push({ title: current.title, code: current.code.trim() });
        current = { title: null, code: '' };
      }
    }
    if (depth === 1 && raw.slice(i, i + 8) === 'title: \'') {
      const end = raw.indexOf("'", i + 8);
      current.title = raw.slice(i + 8, end);
      i = end + 1;
      continue;
    }
    i++;
  }
  return sections;
}

const meta = {
  docker: {
    title: 'Docker Cheatsheet — Dockerfile, Commands & Compose',
    description: 'Quick reference for Docker CLI commands, Dockerfile instructions, docker-compose, volumes, networks, and multi-stage builds.',
    subtitle: 'Dockerfile, CLI commands, docker-compose, volumes, and networks',
    keywords: ['Docker', 'Dockerfile', 'docker-compose', 'Docker CLI', 'Docker volumes', 'Docker networks', 'multi-stage build'],
    emoji: '🐳',
  },
  postgres: {
    title: 'PostgreSQL Cheatsheet — Queries, Indexes & JSONB',
    description: 'Quick reference for PostgreSQL queries, indexes, JSONB operations, common admin commands, and performance patterns.',
    subtitle: 'Queries, indexes, JSONB, transactions, and admin reference',
    keywords: ['PostgreSQL', 'postgres cheatsheet', 'SQL reference', 'JSONB', 'indexes', 'psql commands', 'transactions'],
    emoji: '🐘',
  },
  kubectl: {
    title: 'kubectl Cheatsheet — Kubernetes CLI Reference',
    description: 'Quick reference for kubectl commands — pods, deployments, services, configmaps, debugging, and rollouts.',
    subtitle: 'Pods, deployments, services, debugging, and cluster management',
    keywords: ['kubectl', 'Kubernetes CLI', 'kubectl commands', 'kubectl reference', 'pods', 'deployments', 'kubectl debug'],
    emoji: '☸️',
  },
};

for (const slug of slugs) {
  const pagePath = path.join(pagesDir, slug, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    console.warn('Skip', slug, '(no page.tsx)');
    continue;
  }
  const sections = extractSectionsFromTsx(pagePath);
  if (!sections || sections.length === 0) {
    console.warn('Skip', slug, '(no sections extracted)');
    continue;
  }
  const content = { ...meta[slug], sections };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(content, null, 2));
  console.log('Wrote', slug + '.json', sections.length, 'sections');
}
