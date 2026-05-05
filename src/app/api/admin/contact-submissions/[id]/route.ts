import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });
    }

    await prisma.contactSubmission.delete({
      where: { id: numericId },
    });
    return NextResponse.json({ success: true, message: 'Submission deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
