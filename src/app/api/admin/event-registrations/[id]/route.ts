import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const registration = await prisma.eventRegistration.findUnique({
      where: { id },
      include: { event: { select: { title: true } } },
    });

    if (!registration) {
      return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 });
    }

    const formatted = {
      ...registration,
      _id: registration.id,
      eventId: { _id: registration.eventId, title: registration.event?.title ?? '' },
    };

    return NextResponse.json({ success: true, data: formatted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch registration', error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { status } = await req.json();

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    const registration = await prisma.eventRegistration.update({
      where: { id },
      data: { status },
      include: { event: { select: { title: true } } },
    });

    const formatted = {
      ...registration,
      _id: registration.id,
      eventId: { _id: registration.eventId, title: registration.event?.title ?? '' },
    };

    return NextResponse.json(
      { success: true, message: `Registration ${status} successfully`, data: formatted },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to update status', error: error.message }, { status: 500 });
  }
}
