import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { title, date, location, description, mainImageBase64 } = await req.json();

    if (!title || !date || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, date, location, and main image are required' }, { status: 400 });
    }

    const eventData = {
      title,
      date: new Date(date),
      location,
      mainImageBase64,
      description,
    };

    const event = await Event.create(eventData);
    
    return NextResponse.json({ message: 'Event added successfully', eventId: event._id }, { status: 201 });
  } catch (error: any) {
    console.error('Add event error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    const events = await Event.find({}).sort({ date: -1 }); // Sort by date descending
    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch events', error: error.message }, { status: 500 });
  }
}