import { TrainingEducationHeroSection } from "@/components/sections/TrainingEducationHeroSection";
import { TrainingEducationContentSection } from "@/components/sections/TrainingEducationContentSection";

export default function TrainingEducationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TrainingEducationHeroSection />
      <TrainingEducationContentSection />
    </div>
  );
}