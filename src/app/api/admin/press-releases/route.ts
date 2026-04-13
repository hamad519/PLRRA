import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PressRelease from '@/models/PressRelease';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { title, date, pdfBase64 } = await req.json();
    if (!title || !pdfBase64) {
      return NextResponse.json({ message: 'Title and PDF are required' }, { status: 400 });
    }
    const pressRelease = await PressRelease.create({ title, date: new Date(date), pdfBase64 });
    return NextResponse.json({ success: true, message: 'Press Release added successfully', data: pressRelease }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const releases = await PressRelease.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: releases });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}