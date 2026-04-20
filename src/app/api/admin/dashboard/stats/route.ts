import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalUsers,
      upcomingEvents,
      competitions,
      pressReleases,
      nationalRecords,
      pastResults,
      latestNews,
      pendingRegistrations,
      approvedRegistrations,
      rejectedRegistrations,
      pendingApplications,
      approvedApplications,
      testimonials,
      achievements,
      contributors,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.competition.count(),
      prisma.pressRelease.count(),
      prisma.nationalRecord.count(),
      prisma.pastResultRecord.count(),
      prisma.latestNews.count({ where: { isActive: true } }),
      prisma.eventRegistration.count({ where: { status: 'pending' } }),
      prisma.eventRegistration.count({ where: { status: 'approved' } }),
      prisma.eventRegistration.count({ where: { status: 'rejected' } }),
      prisma.membershipApplication.count({ where: { status: 'pending' } }),
      prisma.membershipApplication.count({ where: { status: 'approved' } }),
      prisma.testimonial.count({ where: { isActive: true } }),
      prisma.achievement.count(),
      prisma.contributor.count(),
    ]);

    // Recent activity
    const recentRegistrations = await prisma.eventRegistration.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        status: true,
        submittedAt: true,
        event: { select: { title: true } },
      },
    });

    const recentApplications = await prisma.membershipApplication.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        membershipPlan: true,
        status: true,
        submittedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          totalUsers,
          upcomingEvents,
          competitions,
          pressReleases,
          nationalRecords,
          pastResults,
          latestNews,
          testimonials,
          achievements,
          contributors,
          registrations: {
            pending: pendingRegistrations,
            approved: approvedRegistrations,
            rejected: rejectedRegistrations,
            total: pendingRegistrations + approvedRegistrations + rejectedRegistrations,
          },
          applications: {
            pending: pendingApplications,
            approved: approvedApplications,
            total: pendingApplications + approvedApplications,
          },
        },
        recentRegistrations,
        recentApplications,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
