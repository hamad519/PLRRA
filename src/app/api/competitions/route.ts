import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const competitions = await prisma.competition.findMany({
      orderBy: { fromDate: 'desc' },
      select: {
        id: true,
        title: true,
        fromDate: true,
        toDate: true,
        date: true,
        location: true,
        mainImageBase64: true,
        galleryImagesBase64: true,
        galleryMedia: true,
        description: true,
      },
    });
    const data = competitions.map((c: any) => ({ ...c, _id: c.id }));
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch competitions', error: error.message }, { status: 500 });
  }
}
