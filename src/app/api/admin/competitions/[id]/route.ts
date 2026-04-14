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
    return NextResponse.json({ success: false, message: 'Failed to fetch competition', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  try {
    const { title, fromDate, toDate, location, description, mainImageBase64, galleryImagesBase64 } = await req.json();

    if (!title || !fromDate || !toDate || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, from date, to date, location, and main image are required' }, { status: 400 });
    }

    const competition = await Competition.findByIdAndUpdate(
      id,
      {
        title,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        location,
        description,
        mainImageBase64,
        galleryImagesBase64: galleryImagesBase64 || [],
      },
      { new: true, runValidators: true }
    );

    if (!competition) {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Competition updated successfully', competitionId: competition._id, data: competition }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  try {
    const deleted = await Competition.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Competition deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}
