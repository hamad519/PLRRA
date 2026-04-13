import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import EventRegistration from '@/models/EventRegistration';
import Event from '@/models/Event';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    // Ensure Event model is registered for population
    const _ensureModel = Event;

    const registration = await EventRegistration.findById(id)
      .populate('eventId', 'title');
      
    if (!registration) {
      return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: registration }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching registration details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch registration', error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const { status } = await req.json();

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    // Ensure Event model is registered for population
    const _ensureModel = Event;

    const registration = await EventRegistration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('eventId', 'title');

    if (!registration) {
      return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Registration ${status} successfully`, 
      data: registration 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating registration status:', error);
    return NextResponse.json({ success: false, message: 'Failed to update status', error: error.message }, { status: 500 });
  }
}