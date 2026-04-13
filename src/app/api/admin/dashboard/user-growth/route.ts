import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
  await dbConnect();

  try {
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1
        }
      }
    ]);

    // Format data for the chart (e.g., cumulative count, month names)
    const formattedData = userGrowth.map((item, index, arr) => {
      const date = new Date(item.year, item.month - 1); // Month is 0-indexed for Date object
      const monthName = date.toLocaleString('default', { month: 'short' });
      const cumulativeUsers = arr.slice(0, index + 1).reduce((sum, current) => sum + current.count, 0);
      return {
        name: monthName,
        users: cumulativeUsers,
      };
    });

    return NextResponse.json({ success: true, data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user growth data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch user growth data', error: error.message }, { status: 500 });
  }
}