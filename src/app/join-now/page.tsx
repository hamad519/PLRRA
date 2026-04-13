import { JoinNowHeroSection } from "@/components/sections/JoinNowHeroSection";
import { JoinNowForm } from "@/components/forms/JoinNowForm";

export default function JoinNowPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JoinNowHeroSection />
      <JoinNowForm />
    </div>
  );
}