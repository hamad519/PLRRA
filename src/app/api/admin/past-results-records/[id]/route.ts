import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const record = await prisma.pastResultRecord.findUnique({ where: { id: numericId } });
    if (!record) {
      return NextResponse.json({ success: false, message: 'Past result/record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { ...record, _id: record.id } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch past result/record', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const { title, date, location, matches } = await req.json();

    if (!title || !date || !location || !matches || matches.length === 0) {
      return NextResponse.json({ message: 'Title, date, location, and at least one match result are required' }, { status: 400 });
    }

    const record = await prisma.pastResultRecord.update({
      where: { id: numericId },
      data: {
        title,
        date: new Date(date),
        location,
        matches,
      },
    });

    return NextResponse.json({ message: 'Past result/record updated successfully', id: record.id, data: record }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Past result/record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const record = await prisma.pastResultRecord.delete({ where: { id: numericId } });
    return NextResponse.json({ message: 'Past result/record deleted successfully', id: record.id }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Past result/record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to delete past result/record', error: error.message }, { status: 500 });
  }
}
