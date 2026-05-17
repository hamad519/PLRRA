import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';
import { deleteUploadedFile, deleteUploadedFiles } from '@/lib/deleteUploadedFile';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const event = await prisma.nationalGalleryEvent.findUnique({ where: { id: numericId } });
    if (!event) {
      return NextResponse.json({ success: false, message: 'Gallery event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { ...event, _id: event.id } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch gallery event', error: error.message },
      { status: 500 }
    );
  }
}

function extractMediaUrls(media: unknown): string[] {
  if (!Array.isArray(media)) return [];
  return media
    .map((m: any) => (m && typeof m === 'object' ? m.url : null))
    .filter((u: any): u is string => typeof u === 'string');
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const { title, date, mainImageBase64, galleryMedia } = await req.json();

    if (!title || !date || !mainImageBase64) {
      return NextResponse.json(
        { message: 'Title, date, and main image are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.nationalGalleryEvent.findUnique({
      where: { id: numericId },
      select: { mainImageBase64: true, galleryMedia: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Gallery event not found' }, { status: 404 });
    }

    const event = await prisma.nationalGalleryEvent.update({
      where: { id: numericId },
      data: {
        title,
        date: new Date(date),
        mainImageBase64,
        galleryMedia: galleryMedia ?? [],
      },
    });

    // Delete orphaned files (in old record but not in the new payload)
    if (existing.mainImageBase64 && existing.mainImageBase64 !== mainImageBase64) {
      await deleteUploadedFile(existing.mainImageBase64);
    }

    const newUrls = new Set<string>(extractMediaUrls(galleryMedia));
    const oldUrls = extractMediaUrls(existing.galleryMedia);
    const orphaned = oldUrls.filter((u) => !newUrls.has(u));
    if (orphaned.length) await deleteUploadedFiles(orphaned);

    return NextResponse.json(
      { message: 'Gallery event updated successfully', eventId: event.id, data: event },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Gallery event not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const event = await prisma.nationalGalleryEvent.findUnique({
      where: { id: numericId },
      select: { mainImageBase64: true, galleryMedia: true },
    });
    if (!event) {
      return NextResponse.json({ success: false, message: 'Gallery event not found' }, { status: 404 });
    }

    await prisma.nationalGalleryEvent.delete({ where: { id: numericId } });

    await deleteUploadedFile(event.mainImageBase64);
    const media = Array.isArray(event.galleryMedia) ? event.galleryMedia : [];
    const urls = media
      .map((m: any) => (m && typeof m === 'object' ? m.url : null))
      .filter((u: any): u is string => typeof u === 'string');
    await deleteUploadedFiles(urls);

    return NextResponse.json(
      { success: true, message: 'Gallery event deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Gallery event not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
