import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({ orderBy: { date: 'desc' } });
    const data = blogs.map((b: any) => ({ ...b, _id: b.id }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, date, imageBase64, shortDescription, content, isActive } = await req.json();
    if (!title || !imageBase64 || !shortDescription || !content) {
      return NextResponse.json(
        { success: false, message: 'Title, image, short description and content are required' },
        { status: 400 },
      );
    }

    const baseSlug = slugify(title);
    let slug = baseSlug || `post-${Date.now()}`;
    let suffix = 1;
    while (await prisma.blog.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        date: date ? new Date(date) : new Date(),
        imageBase64,
        shortDescription,
        content,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, message: 'Blog added successfully', data: blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
