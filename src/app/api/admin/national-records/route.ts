import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NationalRecord from '@/models/NationalRecord';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // We only expect year, title, and pdfBase64 now
    const { year, title, pdfBase64 } = body;
    
    if (!year || !title || !pdfBase64) {
      return NextResponse.json({ success: false, message: 'Year, Title, and PDF are required' }, { status: 400 });
    }

    const record = await NationalRecord.create({
      year,
      title,
      pdfBase64
    });

    return NextResponse.json({ success: true, message: 'Record added successfully', data: record }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const records = await NationalRecord.find({}).sort({ year: -1, createdAt: -1 });
    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}