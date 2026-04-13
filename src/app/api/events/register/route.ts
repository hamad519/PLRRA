import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import EventRegistration from '@/models/EventRegistration';

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