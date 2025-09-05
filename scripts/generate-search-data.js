const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function getAllBlogPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter(name => name.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(/\.md$/, ''),
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        category: data.category,
        date: data.date
      };
    });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function getAllSillyQuestions() {
  const questionsDirectory = path.join(process.cwd(), 'content/silly-questions');
  const filenames = fs.readdirSync(questionsDirectory);

  const questions = filenames
    .filter(name => name.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(questionsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: filename.replace(/\.md$/, ''),
        question: data.question,
        answer: content.substring(0, 200) + '...',
        tags: data.tags || [],
        date: data.date
      };
    });

  return questions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function generateSearchData() {
  try {
    const [blogPosts, sillyQuestions] = await Promise.all([
      getAllBlogPosts(),
      getAllSillyQuestions()
    ]);

    const searchData = {
      blogPosts,
      sillyQuestions
    };

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

generateSearchData()
  .then(() => {
    console.log('Search data generation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Search data generation failed:', error);
    process.exit(1);
  });
