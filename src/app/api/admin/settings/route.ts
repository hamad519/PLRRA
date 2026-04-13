import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  await dbConnect();
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    let settings = await SiteSettings.findOne();
    
    if (settings) {
      // Use findByIdAndUpdate with the body directly to update all fields provided
      settings = await SiteSettings.findByIdAndUpdate(
        settings._id, 
        { $set: body }, 
        { new: true, runValidators: true }
      );
    } else {
      settings = await SiteSettings.create(body);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully', 
      data: settings 
    });
  } catch (error: any) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}