import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { year, title, pdfBase64 } = await req.json();

    if (!year || !title || !pdfBase64) {
      return NextResponse.json({ success: false, message: 'Year, Title, and PDF are required' }, { status: 400 });
    }

    const record = await prisma.nationalRecord.create({
      data: { year: Number(year), title, pdfBase64 },
    });

    return NextResponse.json({ success: true, message: 'Record added successfully', data: record }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const records = await prisma.nationalRecord.findMany({ orderBy: [{ year: 'desc' }, { createdAt: 'desc' }] });
    const data = records.map((r) => ({ ...r, _id: r.id }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
