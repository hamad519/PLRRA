import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LatestNews from '@/models/LatestNews';

export async function GET() {
  await dbConnect();
  try {
    const newsItems = await LatestNews.find({ isActive: true }).sort({ date: -1 }).select('title');
    return NextResponse.json({ success: true, data: newsItems });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
