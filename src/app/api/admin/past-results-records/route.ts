import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, date, location, matches } = await req.json();

    if (!title || !date || !location || !matches || matches.length === 0) {
      return NextResponse.json({ message: 'Title, date, location, and at least one match result are required' }, { status: 400 });
    }

    const record = await prisma.pastResultRecord.create({
      data: {
        title,
        date: new Date(date),
        location,
        matches,
      },
    });

    return NextResponse.json({ message: 'Past result/record added successfully', id: record.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const records = await prisma.pastResultRecord.findMany({ orderBy: { date: 'desc' } });
    const data = records.map((r) => ({ ...r, _id: r.id }));
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch past results/records', error: error.message }, { status: 500 });
  }
}
