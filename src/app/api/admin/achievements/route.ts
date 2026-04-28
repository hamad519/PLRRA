import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { year, title, subtitle, details, sortOrder, isActive } = await req.json();
    if (!year || !title || !details?.length) {
      return NextResponse.json({ message: 'Year, title, and at least one detail are required' }, { status: 400 });
    }
    const item = await prisma.achievement.create({
      data: { year, title, subtitle: subtitle || '', details, sortOrder: sortOrder ?? 0, isActive: isActive ?? true },
    });
    return NextResponse.json({ success: true, message: 'Achievement added', data: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await prisma.achievement.findMany({ orderBy: { sortOrder: 'asc' } });
    const data = items.map((i) => ({ ...i, _id: i.id }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
