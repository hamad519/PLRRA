import { BlogsNewsHeroSection } from "@/components/sections/BlogsNewsHeroSection";
import { BlogsNewsListingSection } from "@/components/sections/BlogsNewsListingSection";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function BlogsNewsPage() {
  let blogs: any[] = [];
  try {
    const rows = await prisma.blog.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' },
    });
    blogs = rows.map((b) => ({
      id: String(b.id),
      slug: b.slug,
      title: b.title,
      date: b.date.toISOString(),
      imageUrl: b.imageBase64,
      shortDescription: b.shortDescription,
    }));
  } catch (e) {
    console.error('Failed to load blogs', e);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BlogsNewsHeroSection />
      <BlogsNewsListingSection blogs={blogs} />
    </div>
  );
}
