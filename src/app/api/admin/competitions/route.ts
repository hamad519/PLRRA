import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, fromDate, toDate, location, description, mainImageBase64, galleryImagesBase64 } = await req.json();

    if (!title || !fromDate || !toDate || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, from date, to date, location, and main image are required' }, { status: 400 });
    }

    const competition = await prisma.competition.create({
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

    return NextResponse.json({ message: 'Competition added successfully', competitionId: competition.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const competitions = await prisma.competition.findMany({
      select: {
        id: true,
        title: true,
        fromDate: true,
        toDate: true,
        date: true,
        location: true,
        mainImageBase64: true, // still a small path string — keep for list thumbnails
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { fromDate: 'desc' },
    });
    const data = competitions.map((c) => ({ ...c, _id: c.id }));
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch competitions', error: error.message }, { status: 500 });
  }
}
