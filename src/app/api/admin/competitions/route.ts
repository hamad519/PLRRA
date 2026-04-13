import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Competition from '@/models/Competition';

// Remove formidable imports and config.api.bodyParser as we are now expecting JSON
// import formidable from 'formidable';
// import { IncomingForm } from 'formidable';
// export const config = { api: { bodyParser: false, }, };

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Parse the request body as JSON
    const { title, date, location, description, mainImageBase64, galleryImagesBase64 } = await req.json();

    // Ensure required fields are present
    if (!title || !date || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, date, location, and main image are required' }, { status: 400 });
    }

    const competitionData = {
      title,
      date: new Date(date),
      location,
      mainImageBase64,
      description,
      galleryImagesBase64: galleryImagesBase64 || [], // Ensure it's an array, even if empty
    };

    const competition = await Competition.create(competitionData);
    
    return NextResponse.json({ message: 'Competition added successfully', competitionId: competition._id }, { status: 201 });
  } catch (error: any) {
    console.error('Add competition error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    const competitions = await Competition.find({}).sort({ date: -1 }); // Sort by date descending
    return NextResponse.json({ success: true, data: competitions }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching competitions:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch competitions', error: error.message }, { status: 500 });
  }
}