import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const competition = await prisma.competition.findUnique({ where: { id } });
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
  try {
    const { title, fromDate, toDate, location, description, mainImageBase64, galleryImagesBase64 } = await req.json();

    if (!title || !fromDate || !toDate || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, from date, to date, location, and main image are required' }, { status: 400 });
    }

    const competition = await prisma.competition.update({
      where: { id },
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
  try {
    await prisma.competition.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Competition deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}
