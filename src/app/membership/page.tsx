import { MembershipHeroSection } from "@/components/sections/MembershipHeroSection";
import { TrainingCoursesSection } from "@/components/sections/TrainingCoursesSection";
import { MembershipInstructionsSection } from "@/components/sections/MembershipInstructionsSection";

export default function MembershipPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MembershipHeroSection />
      <TrainingCoursesSection />
      <MembershipInstructionsSection />
    </div>
  );
}