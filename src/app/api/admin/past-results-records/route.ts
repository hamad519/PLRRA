import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PastResultRecord from '@/models/PastResultRecord';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { title, date, location, matches } = await req.json();

    if (!title || !date || !location || !matches || matches.length === 0) {
      return NextResponse.json({ message: 'Title, date, location, and at least one match result are required' }, { status: 400 });
    }

    const pastResultRecordData = {
      title,
      date: new Date(date),
      location,
      matches,
    };

    const pastResultRecord = await PastResultRecord.create(pastResultRecordData);
    
    return NextResponse.json({ message: 'Past result/record added successfully', id: pastResultRecord._id }, { status: 201 });
  } catch (error: any) {
    console.error('Add past result/record error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    const pastResultRecords = await PastResultRecord.find({}).sort({ date: -1 }); // Sort by date descending
    return NextResponse.json({ success: true, data: pastResultRecords }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching past results/records:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch past results/records', error: error.message }, { status: 500 });
  }
}