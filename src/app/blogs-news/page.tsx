import { BlogsNewsHeroSection } from "@/components/sections/BlogsNewsHeroSection";
import { BlogsNewsListingSection } from "@/components/sections/BlogsNewsListingSection";

export default function BlogsNewsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BlogsNewsHeroSection />
      <BlogsNewsListingSection />
    </div>
  );
}