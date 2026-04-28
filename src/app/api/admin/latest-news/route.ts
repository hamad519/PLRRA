import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, date, isActive } = await req.json();
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }
    const news = await prisma.latestNews.create({
      data: {
        title,
        date: date ? new Date(date) : new Date(),
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    return NextResponse.json({ success: true, message: 'News item added successfully', data: news }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await prisma.latestNews.findMany({ orderBy: { date: 'desc' } });
    const data = items.map((i: any) => ({ ...i, _id: i.id }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
