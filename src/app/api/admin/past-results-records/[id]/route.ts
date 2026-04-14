import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const record = await prisma.pastResultRecord.findUnique({ where: { id } });
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
  try {
    const { title, date, location, matches } = await req.json();

    if (!title || !date || !location || !matches || matches.length === 0) {
      return NextResponse.json({ message: 'Title, date, location, and at least one match result are required' }, { status: 400 });
    }

    const record = await prisma.pastResultRecord.update({
      where: { id },
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
  try {
    const record = await prisma.pastResultRecord.delete({ where: { id } });
    return NextResponse.json({ message: 'Past result/record deleted successfully', id: record.id }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Past result/record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to delete past result/record', error: error.message }, { status: 500 });
  }
}
