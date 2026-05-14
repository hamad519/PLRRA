import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
