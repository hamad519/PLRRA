import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Competition from '@/models/Competition';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { title, fromDate, toDate, location, description, mainImageBase64, galleryImagesBase64 } = await req.json();

    if (!title || !fromDate || !toDate || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, from date, to date, location, and main image are required' }, { status: 400 });
    }

    const competition = await Competition.create({
      title,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      location,
      description,
      mainImageBase64,
      galleryImagesBase64: galleryImagesBase64 || [],
    });

    return NextResponse.json({ message: 'Competition added successfully', competitionId: competition._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const competitions = await Competition.find({}).sort({ fromDate: -1 });
    return NextResponse.json({ success: true, data: competitions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch competitions', error: error.message }, { status: 500 });
  }
}
