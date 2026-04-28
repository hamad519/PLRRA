import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [records, pressReleases] = await Promise.all([
      prisma.nationalRecord.findMany({
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
        take: 10,
      }),
      prisma.pressRelease.findMany({
        orderBy: { date: 'desc' },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      success: true,
      records.map((r: any) => ({ name: `${r.title} (${r.year})`, href: r.pdfBase64 })),
      pressReleases: pressReleases.map((p: any) => ({ name: p.title, href: p.pdfBase64 })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
