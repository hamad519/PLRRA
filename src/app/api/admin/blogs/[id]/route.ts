import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';
import { deleteUploadedFile } from '@/lib/deleteUploadedFile';
import { slugify } from '@/lib/slugify';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const blog = await prisma.blog.findUnique({ where: { id: numericId } });
    if (!blog) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: { ...blog, _id: blog.id } });
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
    const existing = await prisma.blog.findUnique({ where: { id: numericId } });
    if (!existing) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.imageBase64 !== undefined) data.imageBase64 = body.imageBase64;
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription;
    if (body.content !== undefined) data.content = body.content;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    // Regenerate slug if title changed
    if (body.title !== undefined && body.title !== existing.title) {
      const baseSlug = slugify(body.title) || `post-${Date.now()}`;
      let slug = baseSlug;
      let suffix = 1;
      while (true) {
        const conflict = await prisma.blog.findUnique({ where: { slug } });
        if (!conflict || conflict.id === numericId) break;
        slug = `${baseSlug}-${suffix++}`;
      }
      data.slug = slug;
    }

    const blog = await prisma.blog.update({ where: { id: numericId }, data });

    if (
      body.imageBase64 !== undefined &&
      existing.imageBase64 &&
      existing.imageBase64 !== body.imageBase64
    ) {
      await deleteUploadedFile(existing.imageBase64);
    }

    return NextResponse.json({ success: true, message: 'Updated successfully', data: blog });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: numericId },
      select: { imageBase64: true },
    });
    if (!blog) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    await prisma.blog.delete({ where: { id: numericId } });
    await deleteUploadedFile(blog.imageBase64);

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
