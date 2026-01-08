import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDatabase();
    const viewsCollection = db.collection('views');

    // Get total views across all posts
    const result = await viewsCollection.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
        },
      },
    ]).toArray();

    const totalViews = result[0]?.totalViews || 0;

    return NextResponse.json({
      totalViews,
    });
  } catch (error) {
    console.error('Error fetching total views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total views' },
      { status: 500 }
    );
  }
}

