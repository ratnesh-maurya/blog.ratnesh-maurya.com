export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export function generateTableOfContents(content: string): TocItem[] {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[1-6]>/g;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const title = match[3].trim();
    
    if (title && id) {
      toc.push({
        id,
        title,
        level,
      });
    }
  }

  return toc;
}

export function addIdsToHeadings(content: string): string {
  return content.replace(/<h([1-6])([^>]*)>([^<]*)<\/h[1-6]>/g, (match, level, attrs, title) => {
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    return `<h${level}${attrs} id="${id}">${title}</h${level}>`;
  });
}
