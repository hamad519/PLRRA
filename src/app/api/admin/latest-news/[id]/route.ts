import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const news = await prisma.latestNews.findUnique({ where: { id: numericId } });
    if (!news) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: { ...news, _id: news.id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const { title, date, isActive } = await req.json();
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const data: any = { title };
    if (date !== undefined) data.date = new Date(date);
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await prisma.latestNews.update({ where: { id: numericId }, data });
    return NextResponse.json({ success: true, message: 'Updated successfully', data: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    await prisma.latestNews.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
