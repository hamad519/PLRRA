import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const competition = await prisma.competition.findUnique({ where: { id: numericId } });
    if (!competition) {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { ...competition, _id: competition.id } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch competition', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const { title, fromDate, toDate, location, description, mainImageBase64, galleryImagesBase64 } = await req.json();

    if (!title || !fromDate || !toDate || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, from date, to date, location, and main image are required' }, { status: 400 });
    }

    const competition = await prisma.competition.update({
      where: { id: numericId },
      data: {
        title,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        location,
        description: description || '',
        mainImageBase64,
        galleryImagesBase64: galleryImagesBase64 ?? [],
      },
    });

    return NextResponse.json({ message: 'Competition updated successfully', competitionId: competition.id, data: competition }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    await prisma.competition.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true, message: 'Competition deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}
