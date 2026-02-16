import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const db = await getDatabase();
    const viewsCollection = db.collection('views');

    // Get total views across all posts using aggregation pipeline
    const result = await viewsCollection.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
        },
      },
    ]).toArray();

    const totalViews = result[0]?.totalViews || 0;

    return NextResponse.json(
      {
        totalViews,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching total views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total views' },
      { status: 500 }
    );
  }
}

