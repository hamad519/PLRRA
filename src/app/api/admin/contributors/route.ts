import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, role, contributions, sortOrder, isActive } = await req.json();
    if (!name || !contributions?.length) {
      return NextResponse.json({ message: 'Name and at least one contribution are required' }, { status: 400 });
    }
    const item = await prisma.contributor.create({
      data: { name, role: role || '', contributions, sortOrder: sortOrder ?? 0, isActive: isActive ?? true },
    });
    return NextResponse.json({ success: true, message: 'Contributor added', data: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await prisma.contributor.findMany({ orderBy: { sortOrder: 'asc' } });
    const data = items.map((i: any) => ({ ...i, _id: i.id }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
