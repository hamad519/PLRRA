import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import EventRegistration from '@/models/EventRegistration';
import Event from '@/models/Event'; // This import registers the model

export async function POST(req: Request) {
  await dbConnect();

  try {
    const registrationData = await req.json();

    if (!registrationData.eventId || !registrationData.firstName || !registrationData.email) {
      return NextResponse.json({ message: 'Missing required registration fields' }, { status: 400 });
    }

    const newRegistration = await EventRegistration.create(registrationData);
    
    return NextResponse.json({ 
      message: 'Registration submitted successfully!', 
      registrationId: newRegistration._id 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Event registration error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    // Explicitly reference Event to ensure it's registered in Mongoose
    // This prevents the "Schema hasn't been registered" error during populate
    const _ensureModel = Event; 

    const registrations = await EventRegistration.find({})
      .populate('eventId', 'title')
      .sort({ submittedAt: -1 });
      
    return NextResponse.json({ success: true, data: registrations }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching event registrations:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch registrations', error: error.message }, { status: 500 });
  }
}