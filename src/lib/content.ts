import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import readingTime from 'reading-time';
import { BlogPost, SillyQuestion } from '@/types/blog';
import { addIdsToHeadings } from './toc';

const contentDirectory = path.join(process.cwd(), 'content');
const blogDirectory = path.join(contentDirectory, 'blog');
const sillyQuestionsDirectory = path.join(contentDirectory, 'silly-questions');

// Ensure directories exist
if (!fs.existsSync(blogDirectory)) {
  fs.mkdirSync(blogDirectory, { recursive: true });
}
if (!fs.existsSync(sillyQuestionsDirectory)) {
  fs.mkdirSync(sillyQuestionsDirectory, { recursive: true });
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const fileNames = fs.readdirSync(blogDirectory).filter(name => name.endsWith('.md'));
  
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return await getBlogPost(slug);
    })
  );

  return allPostsData
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(content);

    const contentHtml = addIdsToHeadings(processedContent.toString());
    const readingTimeResult = readingTime(content);

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      author: data.author || 'Ratnesh Maurya',
      tags: data.tags || [],
      category: data.category || 'General',
      readingTime: readingTimeResult.text,
      featured: data.featured || false,
      image: data.image || '',
      socialImage: data.socialImage || data.image || '',
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export async function getAllSillyQuestions(): Promise<SillyQuestion[]> {
  const fileNames = fs.readdirSync(sillyQuestionsDirectory).filter(name => name.endsWith('.md'));
  
  const allQuestionsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return await getSillyQuestion(slug);
    })
  );

  return allQuestionsData
    .filter((question): question is SillyQuestion => question !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getSillyQuestion(slug: string): Promise<SillyQuestion | null> {
  try {
    const fullPath = path.join(sillyQuestionsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(content);
    
    const answerHtml = processedContent.toString();

    return {
      slug,
      question: data.question || '',
      answer: answerHtml,
      date: data.date || '',
      tags: data.tags || [],
      category: data.category || 'General',
    };
  } catch (error) {
    console.error(`Error reading silly question ${slug}:`, error);
    return null;
  }
}

export function getBlogPostSlugs(): string[] {
  const fileNames = fs.readdirSync(blogDirectory);
  return fileNames.map((name) => name.replace(/\.md$/, ''));
}

export function getSillyQuestionSlugs(): string[] {
  const fileNames = fs.readdirSync(sillyQuestionsDirectory);
  return fileNames.map((name) => name.replace(/\.md$/, ''));
}
