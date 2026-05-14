import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

export async function GET() {
  try {
    const items = await prisma.historySection.findMany({ orderBy: { sortOrder: 'asc' } });
    const data = items.map((i: any) => ({ ...i, _id: i.id }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    const item = await prisma.historySection.create({
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
    return NextResponse.json({ success: true, message: 'History section added', data: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
