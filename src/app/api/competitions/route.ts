import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Competition from '@/models/Competition';

export async function GET() {
  await dbConnect();
  try {
    const competitions = await Competition.find({})
      .sort({ fromDate: -1 })
      .select('title fromDate toDate date location mainImageBase64 galleryImagesBase64 description');
    return NextResponse.json({ success: true, data: competitions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch competitions', error: error.message }, { status: 500 });
  }
}
