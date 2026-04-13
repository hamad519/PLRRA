import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LatestNews from '@/models/LatestNews';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const news = await LatestNews.findById(params.id);
    if (!news) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: news });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { title, date, isActive } = await req.json();
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }
    const updated = await LatestNews.findByIdAndUpdate(
      params.id,
      { title, date: date ? new Date(date) : undefined, isActive },
      { new: true, runValidators: true }
    );
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Updated successfully', data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const deleted = await LatestNews.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
