import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const d = await req.json();

    if (!d.firstName || !d.email || !d.cnicNo) {
      return NextResponse.json({ message: 'Missing required application fields' }, { status: 400 });
    }

    const newApplication = await prisma.membershipApplication.create({
      data: {
        membershipPlan: d.membershipPlan,
        firstName: d.firstName,
        lastName: d.lastName,
        fatherName: d.fatherName,
        religion: d.religion,
        dateOfBirth: new Date(d.dateOfBirth),
        profession: d.profession,
        addressLine1: d.addressLine1,
        city: d.city,
        state: d.state,
        jobBusinessAddress: d.jobBusinessAddress,
        presentHomeAddress: d.presentHomeAddress,
        permanentHomeAddress: d.permanentHomeAddress,
        cnicNo: d.cnicNo,
        cnicCopyBase64: d.cnicCopyBase64,
        passportNo: d.passportNo || '',
        passportCopyBase64: d.passportCopyBase64 || null,
        phoneNo: d.phoneNo,
        email: d.email,
        weapons: d.weapons ?? [],
        weaponLicenseCopyBase64: d.weaponLicenseCopyBase64,
        membershipFeeYear: d.membershipFeeYear,
        bankChallanCopyBase64: d.bankChallanCopyBase64,
        status: d.status || 'pending',
      },
    });

    return NextResponse.json(
      { message: 'Membership application submitted successfully', applicationId: newApplication.id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const applications = await prisma.membershipApplication.findMany({
      select: {
        id: true,
        membershipPlan: true,
        firstName: true,
        lastName: true,
        fatherName: true,
        email: true,
        phoneNo: true,
        cnicNo: true,
        city: true,
        status: true,
        submittedAt: true,
      },
      orderBy: { submittedAt: 'desc' },
    });
    const data = applications.map((a: any) => ({ ...a, _id: a.id }));
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch membership applications', error: error.message }, { status: 500 });
  }
}
