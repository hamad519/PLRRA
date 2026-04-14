import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch event', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { title, date, location, description, mainImageBase64 } = await req.json();

    if (!title || !date || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, date, location, and main image are required' }, { status: 400 });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        date: new Date(date),
        location,
        description: description || '',
        mainImageBase64,
      },
    });

    return NextResponse.json({ message: 'Event updated successfully', eventId: event.id, data: event }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const deletedEvent = await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Event deleted successfully', eventId: deletedEvent.id }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to delete event', error: error.message }, { status: 500 });
  }
}
