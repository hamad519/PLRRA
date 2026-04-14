import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const deleted = await prisma.membershipApplication.delete({ where: { id } });
    return NextResponse.json({ message: 'Membership application deleted successfully', applicationId: deleted.id }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Membership application not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to delete membership application', error: error.message }, { status: 500 });
  }
}
