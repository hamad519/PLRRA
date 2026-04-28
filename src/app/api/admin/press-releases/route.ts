import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, date, pdfBase64 } = await req.json();
    if (!title || !pdfBase64) {
      return NextResponse.json({ message: 'Title and PDF are required' }, { status: 400 });
    }
    const pressRelease = await prisma.pressRelease.create({
      data: {
        title,
        date: date ? new Date(date) : new Date(),
        pdfBase64,
      },
    });
    return NextResponse.json({ success: true, message: 'Press Release added successfully', data: pressRelease }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const releases = await prisma.pressRelease.findMany({ orderBy: { date: 'desc' } });
    const data = releases.map((r: any) => ({ ...r, _id: r.id }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
