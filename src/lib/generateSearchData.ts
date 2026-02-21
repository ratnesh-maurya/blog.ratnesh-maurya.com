import fs from 'fs';
import path from 'path';
import { getAllBlogPosts, getAllSillyQuestions, getAllTechnicalTerms, getAllTILEntries } from './content';

export async function generateSearchData() {
  try {
    const [blogPosts, sillyQuestions, technicalTerms, tilEntries] = await Promise.all([
      getAllBlogPosts(),
      getAllSillyQuestions(),
      getAllTechnicalTerms(),
      getAllTILEntries(),
    ]);

    const searchData = {
      blogPosts: blogPosts.map((post) => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        category: post.category,
        date: post.date,
      })),
      sillyQuestions: sillyQuestions.map((question) => ({
        slug: question.slug,
        question: question.question,
        answer: question.answer,
        tags: question.tags,
        date: question.date,
      })),
      technicalTerms: technicalTerms.map((term) => ({
        slug: term.slug,
        title: term.title,
        description: term.description,
      })),
      tilEntries: tilEntries.map((entry) => ({
        slug: entry.slug,
        title: entry.title,
        description: entry.rawContent.replace(/\s+/g, ' ').trim().substring(0, 300),
        tags: entry.tags,
        category: entry.category,
        date: entry.date,
      })),
    };

    // Write to public directory so it can be fetched
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(publicDir, 'search-data.json'),
      JSON.stringify(searchData, null, 2)
    );

    console.log('Search data generated successfully');
    return searchData;
  } catch (error) {
    console.error('Failed to generate search data:', error);
    throw error;
  }
}
