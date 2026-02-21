import { generateSearchData } from '../src/lib/generateSearchData';

generateSearchData()
  .then(() => {
    console.log('Search data generation completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Search data generation failed:', err);
    process.exit(1);
  });
