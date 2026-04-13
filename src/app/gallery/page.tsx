import { GalleryHeroSection } from "@/components/sections/GalleryHeroSection";
import { GallerySection } from "@/components/sections/GallerySection";

export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <GalleryHeroSection />
      <GallerySection />
    </div>
  );
}