import { notFound } from 'next/navigation';
import { blogs } from '@/lib/blog-data';
import { SingleBlogContentSection } from '@/components/sections/SingleBlogContentSection';
import { BlogHeroSection } from '@/components/sections/BlogHeroSection'; // New hero for single blog

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default function SingleBlogPage({ params }: BlogPageProps) {
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeroSection title={blog.title} date={blog.date} />
      <SingleBlogContentSection blog={blog} />
    </div>
  );
}