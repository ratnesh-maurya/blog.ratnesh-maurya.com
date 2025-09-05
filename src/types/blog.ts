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
