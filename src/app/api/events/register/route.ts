import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const d = await req.json();

    if (!d.eventId || !d.firstName || !d.email) {
      return NextResponse.json({ message: 'Missing required registration fields' }, { status: 400 });
    }

    const newRegistration = await prisma.eventRegistration.create({
      data: {
        eventId: d.eventId,
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
        status: 'pending',
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
