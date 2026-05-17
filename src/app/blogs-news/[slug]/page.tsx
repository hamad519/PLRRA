import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { SingleBlogContentSection } from '@/components/sections/SingleBlogContentSection';
import { BlogHeroSection } from '@/components/sections/BlogHeroSection';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SingleBlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const row = await prisma.blog.findFirst({
    where: { slug, isActive: true },
  });

  if (!row) {
    notFound();
  }

  const blog = {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    date: format(row.date, 'PPP'),
    imageUrl: row.imageBase64,
    shortDescription: row.shortDescription,
    content: row.content,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeroSection title={blog.title} date={blog.date} />
      <SingleBlogContentSection blog={blog} />
    </div>
  );
}
