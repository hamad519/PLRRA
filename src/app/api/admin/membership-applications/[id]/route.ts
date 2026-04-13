import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MembershipApplication from '@/models/MembershipApplication';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  try {
    const deletedApplication = await MembershipApplication.findByIdAndDelete(id);

    if (!deletedApplication) {
      return NextResponse.json({ success: false, message: 'Membership application not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Membership application deleted successfully', applicationId: deletedApplication._id }, { status: 200 });
  } catch (error: any) {
    console.error('Delete membership application error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete membership application', error: error.message }, { status: 500 });
  }
}