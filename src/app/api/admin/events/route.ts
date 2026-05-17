import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, fromDate, toDate, location, description, mainImageBase64 } = await req.json();

    if (!title || !fromDate || !toDate || !location) {
      return NextResponse.json({ message: 'Title, from date, to date, and location are required' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        location,
        mainImageBase64: mainImageBase64 || null,
        description: description || '',
      },
    });

    return NextResponse.json({ message: 'Event added successfully', eventId: event.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { fromDate: 'desc' } });
    const data = events.map((e: any) => ({ ...e, _id: e.id }));
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch events', error: error.message }, { status: 500 });
  }
}
