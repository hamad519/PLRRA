import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MembershipApplication from '@/models/MembershipApplication';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const applicationData = await req.json();

    // Basic validation (more detailed validation is handled by Zod in the form)
    if (!applicationData.firstName || !applicationData.email || !applicationData.cnicNo) {
      return NextResponse.json({ message: 'Missing required application fields' }, { status: 400 });
    }

    const newApplication = await MembershipApplication.create(applicationData);
    
    return NextResponse.json({ message: 'Membership application submitted successfully', applicationId: newApplication._id }, { status: 201 });
  } catch (error: any) {
    console.error('Membership application submission error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    const applications = await MembershipApplication.find({}).sort({ submittedAt: -1 });
    return NextResponse.json({ success: true, data: applications }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching membership applications:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch membership applications', error: error.message }, { status: 500 });
  }
}