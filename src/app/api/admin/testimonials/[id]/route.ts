import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';
import { deleteUploadedFile } from '@/lib/deleteUploadedFile';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id: numericId } });
    if (!testimonial) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: { ...testimonial, _id: testimonial.id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const body = await req.json();
    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.designation !== undefined) data.designation = body.designation;
    if (body.message !== undefined) data.message = body.message;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.rating !== undefined) data.rating = body.rating;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    const updated = await prisma.testimonial.update({ where: { id: numericId }, data });
    return NextResponse.json({ success: true, message: 'Updated', data: updated });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: numericId },
      select: { imageUrl: true },
    });
    if (!testimonial) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    await prisma.testimonial.delete({ where: { id: numericId } });
    await deleteUploadedFile(testimonial.imageUrl);

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
