export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  readingTime: string;
  featured?: boolean;
  image?: string;
  socialImage?: string; // Custom social sharing image
  questions?: string[]; // SEO questions for FAQ structured data (not displayed on page)
  content: string;
}

export interface SillyQuestion {
  slug: string;
  question: string;
  answer: string;
  date: string;
  tags: string[];
  category: string;
}

export interface TILEntry {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  content: string; // rendered HTML
  rawContent: string; // plain markdown for excerpt
}

export interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  featured?: boolean;
  image?: string;
  socialImage?: string;
}

export interface SillyQuestionMetadata {
  question: string;
  date: string;
  tags: string[];
  category: string;
}
