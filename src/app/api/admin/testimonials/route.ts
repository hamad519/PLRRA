import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, designation, message, imageUrl, rating, isActive } = await req.json();
    if (!name || !message) {
      return NextResponse.json({ message: 'Name and message are required' }, { status: 400 });
    }
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        designation: designation || '',
        message,
        imageUrl: imageUrl || null,
        rating: rating ?? 5,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    return NextResponse.json({ success: true, message: 'Testimonial added', data: testimonial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    const data = testimonials.map((t: any) => ({ ...t, _id: t.id }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
