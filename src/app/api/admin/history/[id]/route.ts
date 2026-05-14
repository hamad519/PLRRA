import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseId } from '@/lib/parseId';

type IncomingBullet = { text?: string; children?: string[] };

function sanitizeBullets(input: unknown): { text: string; children?: string[] }[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((raw: IncomingBullet) => {
      const text = typeof raw?.text === 'string' ? raw.text.trim() : '';
      if (!text) return null;
      const children = Array.isArray(raw.children)
        ? raw.children.map((c) => (typeof c === 'string' ? c.trim() : '')).filter(Boolean)
        : [];
      return children.length > 0 ? { text, children } : { text };
    })
    .filter((b): b is { text: string; children?: string[] } => b !== null);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });
  try {
    const item = await prisma.historySection.findUnique({ where: { id: numericId } });
    if (!item) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: { ...item, _id: item.id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });
  try {
    const { year, title, intro, iconName, bullets, sortOrder, isActive } = await req.json();
    const cleanBullets = sanitizeBullets(bullets);
    const hasContent =
      (typeof title === 'string' && title.trim()) ||
      (typeof intro === 'string' && intro.trim()) ||
      cleanBullets.length > 0;
    if (!hasContent) {
      return NextResponse.json({ success: false, message: 'Provide a title, intro, or at least one bullet' }, { status: 400 });
    }
    const item = await prisma.historySection.update({
      where: { id: numericId },
      data: {
        year: typeof year === 'string' ? year : '',
        title: typeof title === 'string' ? title : '',
        intro: typeof intro === 'string' ? intro : '',
        iconName: typeof iconName === 'string' ? iconName : '',
        bullets: cleanBullets,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, message: 'History section updated', data: item });
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
    await prisma.historySection.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
