import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch event', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const { title, date, location, description, mainImageBase64 } = await req.json();

    if (!title || !date || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, date, location, and main image are required' }, { status: 400 });
    }

    const updatedEventData = {
      title,
      date: new Date(date),
      location,
      description,
      mainImageBase64,
    };

    const event = await Event.findByIdAndUpdate(id, updatedEventData, { new: true, runValidators: true });

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Event updated successfully', eventId: event._id, data: event }, { status: 200 });
  } catch (error: any) {
    console.error('Update event error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully', eventId: deletedEvent._id }, { status: 200 });
  } catch (error: any) {
    console.error('Delete event error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete event', error: error.message }, { status: 500 });
  }
}