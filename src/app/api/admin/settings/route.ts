import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { deleteUploadedFile } from '@/lib/deleteUploadedFile';

const DEFAULT_STATS = { nationalRecords: '0', internationalMedals: '0', eliteShooters: '0', growthRate: '0%' };

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { stats: DEFAULT_STATS } });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        stats: settings.stats ?? DEFAULT_STATS,
        championMoments: settings.championMoments ?? [],
        heroSlides: settings.heroSlides ?? [],
        accountDetails: settings.accountDetails ?? { bankName: '', accountTitle: '', accountNumber: '', iban: '', branchCode: '' },
        aims: settings.aims ?? [],
      },
    });
  } catch (error: any) {
    console.error('[GET /api/admin/settings] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data: any = {};
    const scalarFields = [
      'address', 'contactNo', 'email', 'workingHours',
      'facebookLink', 'instagramLink', 'isMaintenanceMode', 'plraIntro',
      'constitutionPdfBase64',
    ];
    for (const key of scalarFields) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    // JSON fields — pass through as-is. Prisma will serialize them.
    if (body.stats !== undefined) data.stats = body.stats;
    if (body.championMoments !== undefined) data.championMoments = body.championMoments;
    if (body.heroSlides !== undefined) data.heroSlides = body.heroSlides;
    if (body.accountDetails !== undefined) data.accountDetails = body.accountDetails;
    if (body.aims !== undefined) data.aims = body.aims;

    const existing = await prisma.siteSettings.findFirst();
    const settings = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
      : await prisma.siteSettings.create({ data });

    // If the constitution PDF was replaced or cleared, delete the old file from /uploads/
    if (
      existing?.constitutionPdfBase64 &&
      body.constitutionPdfBase64 !== undefined &&
      existing.constitutionPdfBase64 !== body.constitutionPdfBase64
    ) {
      await deleteUploadedFile(existing.constitutionPdfBase64);
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        ...settings,
        stats: settings.stats ?? DEFAULT_STATS,
        championMoments: settings.championMoments ?? [],
        heroSlides: settings.heroSlides ?? [],
        accountDetails: settings.accountDetails ?? { bankName: '', accountTitle: '', accountNumber: '', iban: '', branchCode: '' },
        aims: settings.aims ?? [],
      },
    });
  } catch (error: any) {
    console.error('[POST /api/admin/settings] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
