import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NationalRecord from '@/models/NationalRecord';
import PressRelease from '@/models/PressRelease';

export async function GET() {
  await dbConnect();
  try {
    const records = await NationalRecord.find({}).sort({ year: -1, createdAt: -1 }).limit(10);
    const pressReleases = await PressRelease.find({}).sort({ date: -1 }).limit(10);

    return NextResponse.json({
      success: true,
      records: records.map(r => ({ name: `${r.title} (${r.year})`, href: r.pdfBase64 })),
      pressReleases: pressReleases.map(p => ({ name: p.title, href: p.pdfBase64 }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}