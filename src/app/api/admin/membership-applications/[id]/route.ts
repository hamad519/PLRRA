import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';
import { deleteUploadedFile } from '@/lib/deleteUploadedFile';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const application = await prisma.membershipApplication.findUnique({
      where: { id: numericId },
      select: {
        cnicCopyBase64: true,
        passportCopyBase64: true,
        weaponLicenseCopyBase64: true,
        bankChallanCopyBase64: true,
      },
    });
    if (!application) {
      return NextResponse.json({ success: false, message: 'Membership application not found' }, { status: 404 });
    }

    const deleted = await prisma.membershipApplication.delete({ where: { id: numericId } });

    await deleteUploadedFile(application.cnicCopyBase64);
    await deleteUploadedFile(application.passportCopyBase64);
    await deleteUploadedFile(application.weaponLicenseCopyBase64);
    await deleteUploadedFile(application.bankChallanCopyBase64);

    return NextResponse.json({ message: 'Membership application deleted successfully', applicationId: deleted.id }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Membership application not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to delete membership application', error: error.message }, { status: 500 });
  }
}
