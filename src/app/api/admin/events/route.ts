import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, date, location, description, mainImageBase64 } = await req.json();

    if (!title || !date || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, date, location, and main image are required' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        location,
        mainImageBase64,
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
    const events = await prisma.event.findMany({ orderBy: { date: 'desc' } });
    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch events', error: error.message }, { status: 500 });
  }
}
