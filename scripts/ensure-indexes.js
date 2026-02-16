/**
 * Script to ensure MongoDB indexes are created for optimal query performance
 * Run with: node scripts/ensure-indexes.js
 * 
 * Make sure MONGODB_URI is set in your environment or .env.local file
 */

// Try to load dotenv if available, otherwise rely on environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not available, rely on environment variables
  console.log('ℹ️  dotenv not found, using environment variables');
}

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI environment variable is required. Please add it to .env.local');
  process.exit(1);
}

async function ensureIndexes() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
    });
    
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('blog');
    const viewsCollection = db.collection('views');
    const upvotesCollection = db.collection('upvotes');
    
    console.log('\n📊 Creating indexes for "views" collection...');
    
    // Views collection indexes
    await viewsCollection.createIndex(
      { slug: 1 },
      { unique: true, background: true, name: 'slug_1_unique' }
    );
    console.log('  ✓ Created unique index on slug');
    
    await viewsCollection.createIndex(
      { views: 1 },
      { background: true, name: 'views_1' }
    );
    console.log('  ✓ Created index on views');
    
    await viewsCollection.createIndex(
      { createdAt: 1 },
      { background: true, name: 'createdAt_1' }
    );
    console.log('  ✓ Created index on createdAt');
    
    console.log('\n📊 Creating indexes for "upvotes" collection...');
    
    // Upvotes collection indexes
    await upvotesCollection.createIndex(
      { slug: 1 },
      { unique: true, background: true, name: 'slug_1_unique' }
    );
    console.log('  ✓ Created unique index on slug');
    
    await upvotesCollection.createIndex(
      { upvotes: 1 },
      { background: true, name: 'upvotes_1' }
    );
    console.log('  ✓ Created index on upvotes');
    
    await upvotesCollection.createIndex(
      { createdAt: 1 },
      { background: true, name: 'createdAt_1' }
    );
    console.log('  ✓ Created index on createdAt');
    
    console.log('\n📋 Listing all indexes...');
    
    const viewsIndexes = await viewsCollection.indexes();
    console.log('\n  Views collection indexes:');
    viewsIndexes.forEach(index => {
      console.log(`    - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    const upvotesIndexes = await upvotesCollection.indexes();
    console.log('\n  Upvotes collection indexes:');
    upvotesIndexes.forEach(index => {
      console.log(`    - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n✅ All indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    
    // If it's a duplicate key error, that's okay - index already exists
    if (error.code === 85 || error.codeName === 'IndexOptionsConflict') {
      console.log('⚠️  Some indexes may already exist. This is normal.');
    } else {
      throw error;
    }
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

ensureIndexes()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
