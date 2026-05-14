import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';
import { deleteUploadedFile } from '@/lib/deleteUploadedFile';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: numericId },
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
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const { status } = await req.json();

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    const registration = await prisma.eventRegistration.update({
      where: { id: numericId },
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

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: numericId },
      select: {
        cnicCopyBase64: true,
        passportCopyBase64: true,
        weaponLicenseCopyBase64: true,
        bankChallanCopyBase64: true,
      },
    });
    if (!registration) {
      return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 });
    }

    await prisma.eventRegistration.delete({ where: { id: numericId } });

    await deleteUploadedFile(registration.cnicCopyBase64);
    await deleteUploadedFile(registration.passportCopyBase64);
    await deleteUploadedFile(registration.weaponLicenseCopyBase64);
    await deleteUploadedFile(registration.bankChallanCopyBase64);

    return NextResponse.json({ success: true, message: 'Registration deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to delete registration', error: error.message }, { status: 500 });
  }
}
