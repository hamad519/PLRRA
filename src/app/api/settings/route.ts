import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const DEFAULT_STATS = { nationalRecords: '0', internationalMedals: '0', eliteShooters: '0', growthRate: '0%' };

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ success: true, data: null });
    }
    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        stats: settings.stats ?? DEFAULT_STATS,
        championMoments: settings.championMoments ?? [],
        heroSlides: settings.heroSlides ?? [],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
