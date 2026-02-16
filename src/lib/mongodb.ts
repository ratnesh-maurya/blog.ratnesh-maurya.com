import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI environment variable is required. Please add it to .env.local');
}

const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain at least 2 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
  socketTimeoutMS: 45000, // How long to wait for a socket connection
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  const db = client.db('blog');
  
  // Ensure indexes exist for better query performance
  const viewsCollection = db.collection('views');
  const upvotesCollection = db.collection('upvotes');
  
  // Create indexes if they don't exist (idempotent operation)
  // Using Promise.allSettled to ensure all indexes are created even if one fails
  await Promise.allSettled([
    // Unique index on slug for views - prevents duplicates and improves lookup performance
    viewsCollection.createIndex(
      { slug: 1 }, 
      { 
        unique: true, 
        background: true,
        name: 'slug_1_unique'
      }
    ),
    // Index on views field for aggregation queries (sum operations)
    viewsCollection.createIndex(
      { views: 1 }, 
      { 
        background: true,
        name: 'views_1'
      }
    ),
    // Index on createdAt for potential date-based queries
    viewsCollection.createIndex(
      { createdAt: 1 }, 
      { 
        background: true,
        name: 'createdAt_1'
      }
    ),
    // Unique index on slug for upvotes - prevents duplicates and improves lookup performance
    upvotesCollection.createIndex(
      { slug: 1 }, 
      { 
        unique: true, 
        background: true,
        name: 'slug_1_unique'
      }
    ),
    // Index on upvotes field for aggregation queries (sum operations)
    upvotesCollection.createIndex(
      { upvotes: 1 }, 
      { 
        background: true,
        name: 'upvotes_1'
      }
    ),
    // Index on createdAt for potential date-based queries
    upvotesCollection.createIndex(
      { createdAt: 1 }, 
      { 
        background: true,
        name: 'createdAt_1'
      }
    ),
  ]);
  
  return db;
}

