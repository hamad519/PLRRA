import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LatestNews from '@/models/LatestNews';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { title, date, isActive } = await req.json();
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }
    const news = await LatestNews.create({
      title,
      date: date ? new Date(date) : new Date(),
      isActive: isActive !== undefined ? isActive : true,
    });
    return NextResponse.json({ success: true, message: 'News item added successfully', data: news }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const newsItems = await LatestNews.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: newsItems });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
