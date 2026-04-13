import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Competition from '@/models/Competition';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const competition = await Competition.findById(id);
    if (!competition) {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: competition }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching competition:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch competition', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const { title, date, location, description, mainImageBase64, galleryImagesBase64 } = await req.json();

    if (!title || !date || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, date, location, and main image are required' }, { status: 400 });
    }

    const updatedCompetitionData = {
      title,
      date: new Date(date),
      location,
      description,
      mainImageBase64,
      galleryImagesBase64: galleryImagesBase64 || [],
    };

    const competition = await Competition.findByIdAndUpdate(id, updatedCompetitionData, { new: true, runValidators: true });

    if (!competition) {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Competition updated successfully', competitionId: competition._id, data: competition }, { status: 200 });
  } catch (error: any) {
    console.error('Update competition error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}