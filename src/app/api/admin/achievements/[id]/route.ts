import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });
  try {
    await prisma.achievement.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
