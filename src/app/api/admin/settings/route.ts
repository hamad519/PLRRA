import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Only whitelist SiteSettings fields
    const data: any = {};
    const fields = [
      'address', 'contactNo', 'email', 'workingHours',
      'facebookLink', 'instagramLink', 'isMaintenanceMode',
      'plraIntro', 'stats', 'championMoments', 'heroSlides',
    ];
    for (const key of fields) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    const existing = await prisma.siteSettings.findFirst();
    const settings = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
      : await prisma.siteSettings.create({ data });

    return NextResponse.json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
