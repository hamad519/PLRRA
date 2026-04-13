import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PastResultRecord from '@/models/PastResultRecord';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const pastResultRecord = await PastResultRecord.findById(id);
    if (!pastResultRecord) {
      return NextResponse.json({ success: false, message: 'Past result/record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: pastResultRecord }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching past result/record:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch past result/record', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const { title, date, location, matches } = await req.json();

    if (!title || !date || !location || !matches || matches.length === 0) {
      return NextResponse.json({ message: 'Title, date, location, and at least one match result are required' }, { status: 400 });
    }

    const updatedPastResultRecordData = {
      title,
      date: new Date(date),
      location,
      matches,
    };

    const pastResultRecord = await PastResultRecord.findByIdAndUpdate(id, updatedPastResultRecordData, { new: true, runValidators: true });

    if (!pastResultRecord) {
      return NextResponse.json({ success: false, message: 'Past result/record not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Past result/record updated successfully', id: pastResultRecord._id, data: pastResultRecord }, { status: 200 });
  } catch (error: any) {
    console.error('Update past result/record error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const deletedPastResultRecord = await PastResultRecord.findByIdAndDelete(id);

    if (!deletedPastResultRecord) {
      return NextResponse.json({ success: false, message: 'Past result/record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Past result/record deleted successfully', id: deletedPastResultRecord._id }, { status: 200 });
  } catch (error: any) {
    console.error('Delete past result/record error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete past result/record', error: error.message }, { status: 500 });
  }
}