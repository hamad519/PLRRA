import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, date, mainImageBase64, galleryMedia } = await req.json();

    if (!title || !date || !mainImageBase64) {
      return NextResponse.json(
        { message: 'Title, date, and main image are required' },
        { status: 400 }
      );
    }

    const event = await prisma.nationalGalleryEvent.create({
      data: {
        title,
        date: new Date(date),
        mainImageBase64,
        galleryMedia: galleryMedia ?? [],
      },
    });

    return NextResponse.json(
      { message: 'Gallery event added successfully', eventId: event.id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await prisma.nationalGalleryEvent.findMany({
      orderBy: { date: 'desc' },
    });
    const data = events.map((e: any) => ({ ...e, _id: e.id }));
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch gallery events', error: error.message },
      { status: 500 }
    );
  }
}
