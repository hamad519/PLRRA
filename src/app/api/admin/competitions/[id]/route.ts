import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';
import { deleteUploadedFile, deleteUploadedFiles } from '@/lib/deleteUploadedFile';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const competition = await prisma.competition.findUnique({ where: { id: numericId } });
    if (!competition) {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { ...competition, _id: competition.id } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch competition', error: error.message }, { status: 500 });
  }
}

function extractMediaUrls(media: unknown): string[] {
  if (!Array.isArray(media)) return [];
  return media
    .map((m: any) => (m && typeof m === 'object' ? m.url : null))
    .filter((u: any): u is string => typeof u === 'string');
}

function extractStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v: any): v is string => typeof v === 'string');
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const { title, fromDate, toDate, location, description, mainImageBase64, galleryImagesBase64, galleryMedia } = await req.json();

    if (!title || !fromDate || !toDate || !location || !mainImageBase64) {
      return NextResponse.json({ message: 'Title, from date, to date, location, and main image are required' }, { status: 400 });
    }

    const existing = await prisma.competition.findUnique({
      where: { id: numericId },
      select: { mainImageBase64: true, galleryImagesBase64: true, galleryMedia: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }

    const competition = await prisma.competition.update({
      where: { id: numericId },
      data: {
        title,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        location,
        description: description || '',
        mainImageBase64,
        galleryImagesBase64: galleryImagesBase64 ?? [],
        galleryMedia: galleryMedia ?? [],
      },
    });

    // Delete orphaned files (in old record but not in the new payload)
    const newMediaUrls = new Set<string>([
      ...extractStringArray(galleryImagesBase64),
      ...extractMediaUrls(galleryMedia),
    ]);

    if (existing.mainImageBase64 && existing.mainImageBase64 !== mainImageBase64) {
      await deleteUploadedFile(existing.mainImageBase64);
    }

    const oldUrls = [
      ...extractStringArray(existing.galleryImagesBase64),
      ...extractMediaUrls(existing.galleryMedia),
    ];
    const orphaned = oldUrls.filter((u) => !newMediaUrls.has(u));
    if (orphaned.length) await deleteUploadedFiles(orphaned);

    return NextResponse.json({ message: 'Competition updated successfully', competitionId: competition.id, data: competition }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

  try {
    const competition = await prisma.competition.findUnique({
      where: { id: numericId },
      select: { mainImageBase64: true, galleryImagesBase64: true, galleryMedia: true },
    });
    if (!competition) {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }

    await prisma.competition.delete({ where: { id: numericId } });

    await deleteUploadedFile(competition.mainImageBase64);
    await deleteUploadedFiles(competition.galleryImagesBase64);
    const media = Array.isArray(competition.galleryMedia) ? competition.galleryMedia : [];
    const mediaUrls = media
      .map((m: any) => (m && typeof m === 'object' ? m.url : null))
      .filter((u: any): u is string => typeof u === 'string');
    await deleteUploadedFiles(mediaUrls);

    return NextResponse.json({ success: true, message: 'Competition deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Competition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}
