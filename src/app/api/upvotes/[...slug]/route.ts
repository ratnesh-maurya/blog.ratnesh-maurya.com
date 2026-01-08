import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    // Join array of slug segments and remove trailing slash if present
    const slugString = (Array.isArray(slug) ? slug.join('/') : slug).replace(/\/$/, '');
    const db = await getDatabase();
    const upvotesCollection = db.collection('upvotes');

    const upvoteDoc = await upvotesCollection.findOne({ slug: slugString });

    return NextResponse.json({
      slug: slugString,
      upvotes: upvoteDoc?.upvotes || 0,
    });
  } catch (error) {
    console.error('Error fetching upvotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upvotes' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    // Join array of slug segments and remove trailing slash if present
    const slugString = (Array.isArray(slug) ? slug.join('/') : slug).replace(/\/$/, '');
    const db = await getDatabase();
    const upvotesCollection = db.collection('upvotes');

    // Increment upvote count (upsert if doesn't exist)
    const result = await upvotesCollection.findOneAndUpdate(
      { slug: slugString },
      {
        $inc: { upvotes: 1 },
        $setOnInsert: { slug: slugString, createdAt: new Date() },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    return NextResponse.json({
      slug: slugString,
      upvotes: result?.value?.upvotes || 1,
    });
  } catch (error) {
    console.error('Error incrementing upvotes:', error);
    return NextResponse.json(
      { error: 'Failed to increment upvotes' },
      { status: 500 }
    );
  }
}

