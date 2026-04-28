import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const d = await req.json();

    if (!d.eventId || !d.firstName || !d.email) {
      return NextResponse.json({ message: 'Missing required registration fields' }, { status: 400 });
    }

    const eventIdNum = Number(d.eventId);
    if (!Number.isInteger(eventIdNum) || eventIdNum <= 0) {
      return NextResponse.json({ message: 'Invalid event id' }, { status: 400 });
    }

    const newRegistration = await prisma.eventRegistration.create({
      data: {
        eventId: eventIdNum,
        firstName: d.firstName,
        lastName: d.lastName,
        fatherName: d.fatherName,
        religion: d.religion,
        dateOfBirth: new Date(d.dateOfBirth),
        profession: d.profession,
        addressLine1: d.addressLine1,
        city: d.city,
        state: d.state,
        phoneNo: d.phoneNo,
        email: d.email,
        cnicNo: d.cnicNo,
        cnicCopyBase64: d.cnicCopyBase64,
        passportNo: d.passportNo || '',
        passportCopyBase64: d.passportCopyBase64 || null,
        weapons: d.weapons ?? [],
        weaponLicenseCopyBase64: d.weaponLicenseCopyBase64,
        bankChallanCopyBase64: d.bankChallanCopyBase64,
        status: d.status || 'pending',
      },
    });

    return NextResponse.json(
      { message: 'Registration submitted successfully!', registrationId: newRegistration.id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Only fetch fields needed by the list table — document fields are loaded
    // lazily in the detail page, keeping this response fast even with 1000s of rows.
    const registrations = await prisma.eventRegistration.findMany({
      select: {
        id: true,
        eventId: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNo: true,
        cnicNo: true,
        status: true,
        submittedAt: true,
        event: { select: { title: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    const formatted = registrations.map((r: any) => ({
      ...r,
      _id: r.id,
      eventId: { _id: r.eventId, title: r.event?.title ?? '' },
    }));

    return NextResponse.json({ success: true, data: formatted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch registrations', error: error.message }, { status: 500 });
  }
}
