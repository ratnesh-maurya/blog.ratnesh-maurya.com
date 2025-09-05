import fs from 'fs';
import path from 'path';
import { getAllBlogPosts, getAllSillyQuestions } from './content';

export async function generateSearchData() {
  try {
    const [blogPosts, sillyQuestions] = await Promise.all([
      getAllBlogPosts(),
      getAllSillyQuestions()
    ]);

    // Create simplified data for search
    const searchData = {
      blogPosts: blogPosts.map(post => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        category: post.category,
        date: post.date
      })),
      sillyQuestions: sillyQuestions.map(question => ({
        slug: question.slug,
        question: question.question,
        answer: question.answer,
        tags: question.tags,
        date: question.date
      }))
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
